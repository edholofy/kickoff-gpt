import { customProvider } from 'ai';
import { openai } from '@ai-sdk/openai';

// Fallback provider using OpenAI-compatible models
export const fallbackProvider = customProvider({
  languageModels: {
    'chat-model': openai('gpt-4-turbo-preview'),
    'chat-model-reasoning': openai('gpt-4-turbo-preview'),
    'title-model': openai('gpt-3.5-turbo'),
    'artifact-model': openai('gpt-4-turbo-preview'),
  },
});