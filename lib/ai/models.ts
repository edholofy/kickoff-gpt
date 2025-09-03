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
    description: 'GPT-4o with superior sports analytics and betting insights (GPT-5 coming soon)',
  },
  {
    id: 'grok-4',
    name: 'Grok-4 ⚡',
    description: 'Grok-2 with advanced capabilities for sports analysis (Grok-4 coming soon)',
  },
];
