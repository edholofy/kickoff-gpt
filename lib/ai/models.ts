export const DEFAULT_CHAT_MODEL: string = 'gpt-5';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'grok-4',
    name: 'Grok-4',
    description: 'Latest Grok-4 model with advanced capabilities for sports analysis',
  },
  {
    id: 'grok-4-reasoning',
    name: 'Grok-4 Reasoning',
    description: 'Grok-4 with advanced reasoning for complex betting analysis',
  },
  {
    id: 'gpt-5',
    name: 'GPT-5 🔥',
    description: 'Latest GPT-5 with superior sports analytics and betting insights',
  },
  {
    id: 'gpt-5-reasoning',
    name: 'GPT-5 Reasoning',
    description: 'GPT-5 with chain-of-thought for betting strategies',
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Fast and efficient OpenAI model for real-time analysis',
  },
  {
    id: 'gpt-4-turbo-reasoning',
    name: 'GPT-4 Turbo Reasoning',
    description: 'GPT-4 Turbo with reasoning for complex decisions',
  },
];
