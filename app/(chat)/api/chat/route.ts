import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  stepCountIs,
  streamText,
} from 'ai';
import { auth, type UserType } from '@/app/(auth)/auth';
import { type RequestHints, systemPrompt } from '@/lib/ai/prompts';
import {
  createStreamId,
  deleteChatById,
  getChatById,
  getMessageCountByUserId,
  getMessagesByChatId,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import { convertToUIMessages, generateUUID, truncateMessages, getTotalContentLength } from '@/lib/utils';
import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { sportmonksTools } from '@/lib/sportmonks/tools';
import { isProductionEnvironment } from '@/lib/constants';
import { myProvider } from '@/lib/ai/providers';
import { entitlementsByUserType } from '@/lib/ai/entitlements';
import { postRequestBodySchema, type PostRequestBody } from './schema';
import { geolocation } from '@vercel/functions';
import {
  createResumableStreamContext,
  type ResumableStreamContext,
} from 'resumable-stream';
import { after } from 'next/server';
import { ChatSDKError } from '@/lib/errors';
import type { ChatMessage } from '@/lib/types';
import type { ChatModel } from '@/lib/ai/models';
import type { VisibilityType } from '@/components/visibility-selector';

export const maxDuration = 300; // 5 minutes for GPT-5 high reasoning

let globalStreamContext: ResumableStreamContext | null = null;

export function getStreamContext() {
  if (!globalStreamContext) {
    try {
      globalStreamContext = createResumableStreamContext({
        waitUntil: after,
      });
    } catch (error: any) {
      if (error.message.includes('REDIS_URL')) {
        console.log(
          ' > Resumable streams are disabled due to missing REDIS_URL',
        );
      } else {
        console.error(error);
      }
    }
  }

  return globalStreamContext;
}

export async function POST(request: Request) {
  console.log('🚀 Chat POST endpoint called');
  let requestBody: PostRequestBody;

  try {
    const json = await request.json();
    console.log('📝 Request body received:', { 
      keys: Object.keys(json), 
      selectedChatModel: json.selectedChatModel 
    });
    requestBody = postRequestBodySchema.parse(json);
    console.log('✅ Request body validation passed');
  } catch (error) {
    console.error('❌ Request body validation failed:', error);
    return new ChatSDKError('bad_request:api').toResponse();
  }

  try {
    const {
      id,
      message,
      selectedChatModel,
      selectedVisibilityType,
    }: {
      id: string;
      message: ChatMessage;
      selectedChatModel: ChatModel['id'];
      selectedVisibilityType: VisibilityType;
    } = requestBody;

    const session = await auth();
    console.log('👤 Session check:', { hasSession: !!session, hasUser: !!session?.user });

    if (!session?.user) {
      console.error('❌ No session or user found');
      return new ChatSDKError('unauthorized:chat').toResponse();
    }

    const userType: UserType = session.user.type;
    console.log('✅ User authenticated:', { userId: session.user.id, userType });

    const messageCount = await getMessageCountByUserId({
      id: session.user.id,
      differenceInHours: 24,
    });

    if (messageCount > entitlementsByUserType[userType].maxMessagesPerDay) {
      return new ChatSDKError('rate_limit:chat').toResponse();
    }

    const chat = await getChatById({ id });

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message,
      });

      await saveChat({
        id,
        userId: session.user.id,
        title,
        visibility: selectedVisibilityType,
      });
    } else {
      if (chat.userId !== session.user.id) {
        return new ChatSDKError('forbidden:chat').toResponse();
      }
    }

    const messagesFromDb = await getMessagesByChatId({ id });
    const allMessages = [...convertToUIMessages(messagesFromDb), message];
    const uiMessages = truncateMessages(allMessages);

    const { longitude, latitude, city, country } = geolocation(request);

    const requestHints: RequestHints = {
      longitude,
      latitude,
      city,
      country,
    };

    // Debug logging for context issues
    const totalContentLength = getTotalContentLength(uiMessages);
    const systemPromptText = systemPrompt({ selectedChatModel, requestHints, mode: 'football' });
    const systemPromptLength = systemPromptText.length;

    console.log(`📊 Messages debug:`, {
      totalFromDb: messagesFromDb.length,
      totalWithNew: allMessages.length,
      afterTruncation: uiMessages.length,
      totalContentLength,
      contentLengthKB: Math.round(totalContentLength / 1024),
      systemPromptLength,
      systemPromptKB: Math.round(systemPromptLength / 1024),
      totalContextKB: Math.round((totalContentLength + systemPromptLength) / 1024),
      messageSizes: uiMessages.map(m => ({
        role: m.role,
        partsCount: m.parts?.length || 0,
        totalLength: JSON.stringify(m.parts).length
      }))
    });

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: message.id,
          role: 'user',
          parts: message.parts,
          attachments: [],
          createdAt: new Date(),
        },
      ],
    });

    const streamId = generateUUID();
    await createStreamId({ streamId, chatId: id });

    const stream = createUIMessageStream({
      execute: ({ writer: dataStream }) => {
        let model: ReturnType<typeof myProvider.languageModel>;
        console.log('🤖 Loading model:', selectedChatModel);
        try {
          model = myProvider.languageModel(selectedChatModel);
          console.log('✅ Model loaded successfully:', selectedChatModel);
        } catch (error) {
          console.error('❌ Model loading failed:', selectedChatModel, error);
          try {
            console.log('🔄 Trying fallback to gpt-5...');
            model = myProvider.languageModel('gpt-5');
            console.log('✅ Fallback model loaded');
          } catch (fallbackError) {
            console.error('❌ Fallback model also failed:', fallbackError);
            throw new Error(`Could not load model ${selectedChatModel} or fallback model`);
          }
        }

        // Enhanced logging for GPT-5 debugging
        const isGPT5 = selectedChatModel === 'gpt-5';
        const gpt5Config = isGPT5 ? {
          reasoning_effort: 'medium',
          verbosity: 'medium'
        } : {};

        console.log('🔧 Model configuration:', {
          selectedModel: selectedChatModel,
          isGPT5,
          gpt5Config,
          modelType: typeof model,
          hasReasoningEffort: 'reasoning_effort' in gpt5Config
        });

        const result = streamText({
          model,
          system: systemPrompt({ selectedChatModel, requestHints, mode: 'football' }),
          messages: convertToModelMessages(uiMessages),
          stopWhen: stepCountIs(5),
          // GPT-5 specific configuration with medium reasoning for balanced performance
          ...gpt5Config,
          experimental_activeTools: [
            // Priority: Football analysis tools first
            'get_today_matches',
            'get_fixtures',
            'get_live_matches',
            'get_team_stats',
            'get_head_to_head',
            'get_standings',
            'get_match_odds',
            'get_match_predictions',
            'search_team',
            'get_league_info',
            // Secondary tools
            'createDocument',
            'updateDocument',
            'requestSuggestions',
          ],
          experimental_transform: smoothStream({ chunking: 'word' }),
          tools: {
            getWeather,
            createDocument: createDocument({ session, dataStream }),
            updateDocument: updateDocument({ session, dataStream }),
            requestSuggestions: requestSuggestions({
              session,
              dataStream,
            }),
            ...sportmonksTools,
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: 'stream-text',
          },
        });

        console.log('📊 StreamText result created:', {
          hasResult: !!result,
          resultType: typeof result,
          hasConsume: typeof result?.consumeStream === 'function',
          hasToUI: typeof result?.toUIMessageStream === 'function'
        });

        try {
          result.consumeStream();
          console.log('✅ Stream consumption started successfully');
        } catch (error) {
          console.error('❌ Error consuming stream:', error);
          throw error;
        }

        try {
          const uiStream = result.toUIMessageStream({
            sendReasoning: true,
          });
          console.log('✅ UI message stream created:', {
            hasStream: !!uiStream,
            streamType: typeof uiStream
          });

          dataStream.merge(uiStream);
          console.log('✅ Stream merged with dataStream');
        } catch (error) {
          console.error('❌ Error creating/merging UI stream:', error);
          throw error;
        }
      },
      generateId: generateUUID,
      onFinish: async ({ messages }) => {
        await saveMessages({
          messages: messages.map((message) => ({
            id: message.id,
            role: message.role,
            parts: message.parts,
            createdAt: new Date(),
            attachments: [],
            chatId: id,
          })),
        });
      },
      onError: () => {
        return 'Oops, an error occurred!';
      },
    });

    const streamContext = getStreamContext();

    if (streamContext) {
      return new Response(
        await streamContext.resumableStream(streamId, () =>
          stream.pipeThrough(new JsonToSseTransformStream()),
        ),
      );
    } else {
      return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
    }
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    console.error('Unhandled error in chat API:', error);
    return new ChatSDKError('offline:chat').toResponse();
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new ChatSDKError('bad_request:api').toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError('unauthorized:chat').toResponse();
  }

  const chat = await getChatById({ id });

  if (chat.userId !== session.user.id) {
    return new ChatSDKError('forbidden:chat').toResponse();
  }

  const deletedChat = await deleteChatById({ id });

  return Response.json(deletedChat, { status: 200 });
}
