export const DEFAULT_CHAT_MODEL: string = 'gpt-5';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'gpt-5',
    name: 'GPT-5 🔥',
    description: 'Latest GPT-5 with superior sports analytics and betting insights',
  },
  {
    id: 'grok-4',
    name: 'Grok-4 ⚡',
    description: 'Latest Grok-4 model with advanced capabilities for sports analysis',
  },
];
