import { customProvider, wrapLanguageModel, extractReasoningMiddleware } from 'ai';
import { openai } from '@ai-sdk/openai';

// Fallback provider using OpenAI-compatible models
export const fallbackProvider = customProvider({
  languageModels: {
    'chat-model': openai('gpt-4-turbo-preview'),
    'chat-model-reasoning': wrapLanguageModel({
      model: openai('gpt-4-turbo-preview'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    'title-model': openai('gpt-3.5-turbo'),
    'artifact-model': openai('gpt-4-turbo-preview'),
    'gpt-4-turbo': openai('gpt-4-turbo-preview'),
    'gpt-4-turbo-reasoning': wrapLanguageModel({
      model: openai('gpt-4-turbo-preview'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
  },
});