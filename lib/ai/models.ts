export const DEFAULT_CHAT_MODEL: string = 'chat-model';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Grok-4',
    description: 'Latest Grok-4 model with advanced capabilities for sports analysis',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Grok-4 Reasoning',
    description: 'Grok-4 with advanced reasoning for complex betting analysis',
  },
];
