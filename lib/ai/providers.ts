import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { gateway } from '@ai-sdk/gateway';
import { xai } from '@ai-sdk/xai';
import { openai } from '@ai-sdk/openai';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { isTestEnvironment } from '../constants';

// Provider configuration based on available API keys
const useDirectXAI = !!process.env.XAI_API_KEY;
const useOpenAI = !!process.env.OPENAI_API_KEY;
const useGateway = process.env.VERCEL || (!useDirectXAI && !useOpenAI);

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
        'gpt-4o': chatModel,
        'gpt-5': chatModel,
        'grok-4': chatModel,
      },
    })
  : customProvider({
      languageModels: {
        // Default models for backward compatibility - switched to GPT-4o for reliability
        'chat-model': useOpenAI ? openai('gpt-4o') : (useDirectXAI ? xai('grok-4') : gateway.languageModel('xai/grok-2-vision-1212')),
        'chat-model-reasoning': wrapLanguageModel({
          model: useOpenAI ? openai('gpt-5') : (useDirectXAI ? xai('grok-4') : gateway.languageModel('xai/grok-beta')),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': useOpenAI ? openai('gpt-4o') : (useDirectXAI ? xai('grok-4') : gateway.languageModel('xai/grok-2-1212')),
        'artifact-model': useOpenAI ? openai('gpt-4o') : (useDirectXAI ? xai('grok-4') : gateway.languageModel('xai/grok-2-1212')),
        
        // GPT-5 - Using actual GPT-5 with high reasoning capabilities
        'gpt-5': (() => {
          const model = useOpenAI ? openai('gpt-5') : (useGateway ? gateway.languageModel('xai/grok-2-vision-1212') : openai('gpt-5'));
          console.log('🤖 GPT-5 provider configuration:', {
            useOpenAI,
            useGateway,
            useDirectXAI,
            modelProvider: useOpenAI ? 'openai' : useGateway ? 'gateway' : 'openai-fallback',
            modelId: useOpenAI ? 'gpt-5' : 'xai/grok-2-vision-1212'
          });
          return model;
        })(),
        
        // GPT-4o - Fast and reliable model for general use
        'gpt-4o': useOpenAI ? openai('gpt-4o') : (useGateway ? gateway.languageModel('openai/gpt-4o') : openai('gpt-4o')),

        // Grok-4 - Using Grok-2 as fallback until Grok-4 is available
        'grok-4': useDirectXAI ? xai('grok-2-vision-1212') : (useGateway ? gateway.languageModel('xai/grok-2-vision-1212') : xai('grok-2-vision-1212')),
      },
    });
