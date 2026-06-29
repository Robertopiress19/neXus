export enum TicketStatus {
  Aberto = 'Aberto',
  EmAndamento = 'Em Andamento',
  Resolvido = 'Resolvido',
  Cancelado = 'Cancelado',
}

export enum TicketPriority {
  Baixa = 'Baixa',
  Media = 'Media',
  Alta = 'Alta',
}

// Alterado de enum para const para permitir categorias mais descritivas (sub-categorias).
export const TicketCategory = {
  Computador: 'Tecnologia - Computador',
  Perifericos: 'Tecnologia - Periféricos',
  ArCondicionado: 'Infraestrutura - Ar Condicionado',
  Outros: 'Outros',
} as const;

export type TicketCategory = typeof TicketCategory[keyof typeof TicketCategory];

export type UserRole = 'user' | 'agent';

export interface TicketMessage {
  sender: UserRole;
  text: string;
  timestamp: Date;
}

export interface Ticket {
  id: string;
  userId: string; // E-mail do usuário que criou o ticket
  title: string;
  description: string;
  originalQuery: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: Date;
  updatedAt: Date;
  messages?: TicketMessage[];
}

export enum MessageSender {
  User = 'user',
  Agent = 'agent',
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
}

export type ChatSession = ChatMessage[];

export interface User {
  email: string;
  name: string;
  sector: string;
  phone: string;
}

export interface CurrentUser extends User {
  role: UserRole;
}