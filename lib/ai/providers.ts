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
const useDirectXAI = process.env.XAI_API_KEY && !process.env.VERCEL;
const useOpenAI = process.env.OPENAI_API_KEY;

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
        // Grok-4 models
        'grok-4': chatModel,
        'grok-4-reasoning': reasoningModel,
        // GPT-5 models
        'gpt-5': chatModel,
        'gpt-5-reasoning': reasoningModel,
      },
    })
  : customProvider({
      languageModels: {
        // Default models (GPT-5 if available, fallback to Grok-4)
        'chat-model': useOpenAI ? openai('gpt-5') : (useDirectXAI ? xai('grok-4') : gateway.languageModel('xai/grok-4')),
        'chat-model-reasoning': wrapLanguageModel({
          model: useOpenAI ? openai('gpt-5') : (useDirectXAI ? xai('grok-4') : gateway.languageModel('xai/grok-4')),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': useOpenAI ? openai('gpt-5') : (useDirectXAI ? xai('grok-4') : gateway.languageModel('xai/grok-4')),
        'artifact-model': useOpenAI ? openai('gpt-5') : (useDirectXAI ? xai('grok-4') : gateway.languageModel('xai/grok-4')),
        
        // Grok-4 specific models
        'grok-4': useDirectXAI ? xai('grok-4') : gateway.languageModel('xai/grok-4'),
        'grok-4-reasoning': wrapLanguageModel({
          model: useDirectXAI ? xai('grok-4') : gateway.languageModel('xai/grok-4'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        
        // GPT-5 models (NOW LIVE!)
        'gpt-5': useOpenAI ? openai('gpt-5') : gateway.languageModel('openai/gpt-5'),
        'gpt-5-reasoning': wrapLanguageModel({
          model: useOpenAI ? openai('gpt-5') : gateway.languageModel('openai/gpt-5'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        
        // GPT-4 models (current stable)
        'gpt-4-turbo': useOpenAI ? openai('gpt-4-turbo-preview') : gateway.languageModel('openai/gpt-4-turbo-preview'),
        'gpt-4-turbo-reasoning': wrapLanguageModel({
          model: useOpenAI ? openai('gpt-4-turbo-preview') : gateway.languageModel('openai/gpt-4-turbo-preview'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
      },
    });
