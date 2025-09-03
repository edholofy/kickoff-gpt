import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { gateway } from '@ai-sdk/gateway';
import { xai } from '@ai-sdk/xai';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { isTestEnvironment } from '../constants';

// Use direct xAI if API key is available, otherwise use gateway
const useDirectXAI = process.env.XAI_API_KEY && !process.env.VERCEL;

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : useDirectXAI
  ? customProvider({
      languageModels: {
        'chat-model': xai('grok-4'),
        'chat-model-reasoning': wrapLanguageModel({
          model: xai('grok-4'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': xai('grok-4'),
        'artifact-model': xai('grok-4'),
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': gateway.languageModel('xai/grok-4'),
        'chat-model-reasoning': wrapLanguageModel({
          model: gateway.languageModel('xai/grok-4'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': gateway.languageModel('xai/grok-4'),
        'artifact-model': gateway.languageModel('xai/grok-4'),
      },
    });
