import React from 'react';
import { ChatMessage, MessageSender } from '../types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.User;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`px-4 py-3 rounded-2xl max-w-md lg:max-w-lg inline-block break-words ${
          isUser
            ? 'bg-purple-600 text-white rounded-br-none'
            : 'bg-slate-200 text-slate-800 rounded-bl-none'
        }`}
      >
        <p className="text-base whitespace-pre-wrap">{message.text}</p>
        {message.action && (
            <div className="mt-3">
                <button
                    onClick={message.action.onClick}
                    className="px-3 py-1.5 text-sm font-semibold text-purple-700 bg-white rounded-md hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-200 focus-visible:ring-purple-500 transition-colors"
                >
                    {message.action.label}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageBubble;