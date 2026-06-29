import React, { useState } from 'react';
import { Ticket, TicketStatus, TicketPriority, UserRole, TicketCategory, TicketMessage } from '../types';
import { SendIcon } from './Icons';

interface TicketCardProps {
  ticket: Ticket;
  onUpdateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  userRole: UserRole;
  onContactUser?: (userId: string) => void;
  onAddMessage: (ticketId: string, messageText: string) => void;
}

const TicketStatusBadge: React.FC<{ status: TicketStatus }> = ({ status }) => {
  const baseClasses = 'px-2.5 py-1 text-xs font-semibold rounded-full inline-block';
  const statusClasses = {
    [TicketStatus.Aberto]: 'bg-red-100 text-red-800',
    [TicketStatus.EmAndamento]: 'bg-yellow-100 text-yellow-800',
    [TicketStatus.Resolvido]: 'bg-green-100 text-green-800',
    [TicketStatus.Cancelado]: 'bg-slate-100 text-slate-600',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const TicketPriorityBadge: React.FC<{ priority: TicketPriority }> = ({ priority }) => {
    const baseClasses = 'px-2.5 py-1 text-xs font-semibold rounded-full inline-block';
    const priorityClasses = {
      [TicketPriority.Baixa]: 'bg-sky-100 text-sky-800',
      [TicketPriority.Media]: 'bg-orange-100 text-orange-800',
      [TicketPriority.Alta]: 'bg-purple-100 text-purple-800',
    };
    return <span className={`${baseClasses} ${priorityClasses[priority]}`}>{priority}</span>;
};

const TicketCategoryBadge: React.FC<{ category: TicketCategory }> = ({ category }) => {
    const baseClasses = 'px-2.5 py-1 text-xs font-semibold rounded-full inline-block';
    const categoryClasses: { [key in TicketCategory]: string } = {
      [TicketCategory.Computador]: 'bg-blue-100 text-blue-800',
      [TicketCategory.Perifericos]: 'bg-indigo-100 text-indigo-800',
      [TicketCategory.ArCondicionado]: 'bg-cyan-100 text-cyan-800',
      [TicketCategory.Outros]: 'bg-gray-100 text-gray-800',
    };
    return <span className={`${baseClasses} ${categoryClasses[category]}`}>{category}</span>;
};

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onUpdateTicketStatus, userRole, onContactUser, onAddMessage }) => {
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && onAddMessage) {
            onAddMessage(ticket.id, newMessage.trim());
            setNewMessage('');
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }

  return (
    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-wrap justify-between items-start mb-3 gap-4">
        <div>
            <span className="text-sm font-semibold text-slate-500">{ticket.id}</span>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
                <TicketStatusBadge status={ticket.status} />
                <TicketPriorityBadge priority={ticket.priority} />
                <TicketCategoryBadge category={ticket.category} />
            </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {userRole === 'agent' && (
              <>
                {![TicketStatus.Resolvido, TicketStatus.Cancelado].includes(ticket.status) && (
                    <button 
                        onClick={() => onContactUser && onContactUser(ticket.userId)}
                        className="px-4 py-1.5 text-sm font-medium text-purple-700 bg-purple-100 rounded-md hover:bg-purple-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500 transition-colors"
                    >
                        Contato
                    </button>
                )}
                {ticket.status === TicketStatus.Aberto && (
                    <button 
                        onClick={() => onUpdateTicketStatus(ticket.id, TicketStatus.EmAndamento)}
                        className="px-4 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500 transition-colors"
                    >
                        Iniciar Atendimento
                    </button>
                )}
                 {ticket.status === TicketStatus.EmAndamento && (
                    <button 
                        onClick={() => onUpdateTicketStatus(ticket.id, TicketStatus.Resolvido)}
                        className="px-4 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 transition-colors"
                    >
                        Resolver
                    </button>
                )}
              </>
          )}
          {userRole === 'user' && [TicketStatus.Aberto, TicketStatus.EmAndamento].includes(ticket.status) && (
              <button 
                  onClick={() => onUpdateTicketStatus(ticket.id, TicketStatus.Cancelado)}
                  className="px-4 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 transition-colors"
              >
                  Cancelar Chamado
              </button>
          )}
        </div>
      </div>

      <div className="mt-2">
        <h4 className="font-bold text-lg text-slate-800 pr-2">{ticket.title}</h4>
        <p className="text-sm text-slate-600 mt-1">{ticket.description}</p>
        <div className="mt-4 p-3 bg-slate-50 border-l-4 border-slate-200 rounded">
            <p className="text-sm font-medium text-slate-500">Pergunta original:</p>
            <p className="text-sm text-slate-700 italic">"{ticket.originalQuery}"</p>
        </div>
      </div>
      
      {(ticket.messages && ticket.messages.length > 0) && (
          <div className="mt-4 space-y-3">
              <h5 className="text-sm font-semibold text-slate-600 border-t border-slate-200 pt-3">Histórico de Atendimento</h5>
              <div className="space-y-2">
                {ticket.messages.map((msg, index) => {
                    const isMyMessage = msg.sender === userRole;
                    return (
                        <div key={index} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-2xl max-w-lg break-words ${isMyMessage ? 'bg-purple-600 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                <p className={`text-xs ${isMyMessage ? 'text-purple-200' : 'text-slate-500'} text-right mt-1`}>
                                    {`Enviado em ${formatDate(msg.timestamp)}`}
                                </p>
                            </div>
                        </div>
                    );
                })}
              </div>
          </div>
      )}

      {ticket.status === TicketStatus.EmAndamento && (
          <div className="mt-4 pt-4 border-t border-slate-200">
              <form onSubmit={handleSendMessage} className="flex items-start space-x-2">
                  <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={userRole === 'agent' ? "Digite uma mensagem para o usuário..." : "Digite sua resposta para o atendente..."}
                      className="w-full px-3 py-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 transition resize-none"
                      rows={2}
                  />
                  <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 transition-colors"
                      aria-label="Enviar mensagem"
                  >
                      <SendIcon className="w-5 h-5" />
                  </button>
              </form>
          </div>
      )}
      
      <div className="text-xs text-slate-400 mt-4 flex justify-between items-center">
          <div>
            <span>Criado em: {formatDate(ticket.createdAt)}</span>
            <span className="ml-4">Atualizado em: {formatDate(ticket.updatedAt)}</span>
          </div>
          {userRole === 'agent' && (
             <span className="font-medium text-slate-500">Solicitante: {ticket.userId}</span>
          )}
      </div>
    </div>
  );
};

export default TicketCard;
