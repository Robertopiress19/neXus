import React, { useState, useEffect } from 'react';
import { ChatSession, ChatMessage } from '../types';
import ChatMessageBubble from './ChatMessageBubble';
import { ChatBubbleLeftRightIcon } from './Icons';

const ChatHistory: React.FC<{ onSwitchView: (view: 'chat') => void; }> = ({ onSwitchView }) => {
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [openSessionIndex, setOpenSessionIndex] = useState<number | null>(null);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('chatHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse chat history from localStorage", error);
    }
  }, []);

  const getSessionTitle = (session: ChatMessage[]): string => {
    
    const firstUserMessage = session.find(msg => msg.id !== 'init' && msg.sender === 'user');
    return firstUserMessage ? firstUserMessage.text : 'Conversa iniciada';
  };

  const getSessionDate = (session: ChatMessage[]): Date | null => {
    const firstMessage = session.find(msg => msg.id !== 'init');
    if (firstMessage) {
        const timestamp = parseInt(firstMessage.id.split('-')[1], 10);
        if (!isNaN(timestamp)) {
            return new Date(timestamp);
        }
    }
    return null;
  }

  const toggleSession = (index: number) => {
    setOpenSessionIndex(openSessionIndex === index ? null : index);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Histórico de Conversas</h2>
        <button
            onClick={() => onSwitchView('chat')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500 transition-colors"
        >
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            <span>Voltar para o Chat</span>
        </button>
      </div>

      {history.length > 0 ? (
        <div className="space-y-3">
          {history.map((session, index) => (
            <div key={index} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
              <button
                onClick={() => toggleSession(index)}
                className="w-full p-4 text-left flex justify-between items-center hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple-500"
                aria-expanded={openSessionIndex === index}
              >
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate pr-4">{getSessionTitle(session)}</p>
                    {getSessionDate(session) && (
                         <p className="text-xs text-slate-500 mt-1">
                            {getSessionDate(session)?.toLocaleString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                         </p>
                    )}
                </div>
                <svg className={`w-5 h-5 text-slate-500 transition-transform flex-shrink-0 ${openSessionIndex === index ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {openSessionIndex === index && (
                <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-4 max-h-96 overflow-y-auto">
                  {session.map(msg => (
                    <ChatMessageBubble key={msg.id} message={msg} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-700">Nenhum histórico encontrado.</h3>
          <p className="mt-2 text-slate-500">Suas conversas anteriores aparecerão aqui.</p>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
