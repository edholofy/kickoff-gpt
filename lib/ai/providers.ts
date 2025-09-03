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
        'gpt-5': chatModel,
        'grok-4': chatModel,
      },
    })
  : customProvider({
      languageModels: {
        // Default models for backward compatibility
        'chat-model': useOpenAI ? openai('gpt-5') : (useDirectXAI ? xai('grok-4') : gateway.languageModel('xai/grok-2-vision-1212')),
        'chat-model-reasoning': wrapLanguageModel({
          model: useOpenAI ? openai('gpt-5') : (useDirectXAI ? xai('grok-4') : gateway.languageModel('xai/grok-beta')),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': useOpenAI ? openai('gpt-5') : (useDirectXAI ? xai('grok-4') : gateway.languageModel('xai/grok-2-1212')),
        'artifact-model': useOpenAI ? openai('gpt-5') : (useDirectXAI ? xai('grok-4') : gateway.languageModel('xai/grok-2-1212')),
        
        // GPT-5 - The latest and greatest
        'gpt-5': useOpenAI ? openai('gpt-5') : (useGateway ? gateway.languageModel('xai/grok-2-vision-1212') : openai('gpt-4-turbo-preview')),
        
        // Grok-4 - Powerful alternative
        'grok-4': useDirectXAI ? xai('grok-4') : (useGateway ? gateway.languageModel('xai/grok-2-vision-1212') : xai('grok-2-vision-1212')),
      },
    });
