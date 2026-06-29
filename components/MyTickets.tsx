import React from 'react';
import { Ticket, TicketStatus } from '../types';
import TicketCard from './TicketCard';
import { ChatBubbleLeftRightIcon } from './Icons';

interface MyTicketsProps {
  tickets: Ticket[];
  onUpdateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  onSwitchView: (view: 'chat') => void;
  focusedTicketId?: string | null;
  onAddMessage: (ticketId: string, messageText: string) => void;
}

const MyTickets: React.FC<MyTicketsProps> = ({ tickets, onUpdateTicketStatus, onSwitchView, focusedTicketId, onAddMessage }) => {
  const visibleTickets = focusedTicketId ? tickets.filter(t => t.id === focusedTicketId) : tickets;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-slate-800">Meus Chamados</h2>
            <button
                onClick={() => onSwitchView('chat')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500 transition-colors"
            >
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                <span>Voltar para o Chat</span>
            </button>
        </div>
        
        {focusedTicketId && (
            <div className="text-center bg-purple-50 border border-purple-200 p-3 rounded-lg">
                <p className="text-sm text-purple-800">
                    Mostrando o chamado específico <strong>{focusedTicketId}</strong>.
                </p>
            </div>
        )}

        {visibleTickets.length > 0 ? (
            <div className="space-y-4">
                {visibleTickets.map(ticket => (
                    <TicketCard 
                        key={ticket.id} 
                        ticket={ticket} 
                        onUpdateTicketStatus={onUpdateTicketStatus} 
                        userRole="user" 
                        onAddMessage={onAddMessage}
                    />
                ))}
            </div>
        ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-700">Nenhum chamado encontrado.</h3>
                <p className="mt-2 text-slate-500">Você ainda não abriu nenhum chamado de suporte.</p>
                <button
                    onClick={() => onSwitchView('chat')}
                    className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700"
                >
                    Iniciar Conversa
                </button>
            </div>
        )}
    </div>
  );
};

export default MyTickets;
