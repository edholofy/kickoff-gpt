export const DEFAULT_CHAT_MODEL: string = 'gpt-4o';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o ⚡',
    description: 'OpenAI GPT-4o - Fast, reliable, and excellent for sports analysis',
  },
  {
    id: 'gpt-5',
    name: 'GPT-5 🔥',
    description: 'OpenAI GPT-5 with advanced reasoning for superior sports analytics and insights',
  },
  {
    id: 'grok-4',
    name: 'Grok-4 ⚡',
    description: 'Grok-2 with advanced capabilities for sports analysis (Grok-4 coming soon)',
  },
];
