import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, MessageSender, Ticket, TicketCategory } from '../types';
import { getSmartAnswer, createTicketSummary, getVideoDescriptionFromLibras, getTranscriptionFromAudio } from '../services/geminiService';
import { KNOWLEDGE_BASE } from '../data/knowledgeBase';
import ChatMessageBubble from './ChatMessageBubble';
import { SendIcon, LoadingIcon, MicrophoneIcon, VideoCameraIcon } from './Icons';
import LibrasRecordingModal from './LibrasRecordingModal';

interface ChatInterfaceProps {
  onTicketCreated: (ticketData: { title: string; description: string; originalQuery: string; category: TicketCategory; }) => Ticket;
  onViewTicket: (ticketId: string) => void;
}

const FAQ_SUGGESTIONS = [
  { title: 'Meu computador não liga', subtitle: 'O que devo verificar primeiro?' },
  { title: 'Mouse ou teclado não funciona', subtitle: 'Veja os passos para resolver.' },
  { title: 'Meu computador está muito lento', subtitle: 'Descubra as possíveis causas.' },
  { title: 'O ar condicionado não gela', subtitle: 'Saiba o que pode ser.' },
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onTicketCreated, onViewTicket }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      text: 'Olá! Sou o Nexus, seu assistente de suporte virtual. Como posso ajudar você hoje?',
      sender: MessageSender.Agent,
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLibrasModalOpen, setIsLibrasModalOpen] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
   
    if (messages.length > 1) {
        const existingHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        const updatedHistory = [messages, ...existingHistory.filter((session: ChatMessage[]) => session[0]?.id !== 'init')];
        localStorage.setItem('chatHistory', JSON.stringify(updatedHistory.slice(0, 10)));
    }
  }, [messages]);

  const processAndSendUserQuery = useCallback(async (query: string, isFromLibras = false) => {
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: query,
      sender: MessageSender.User,
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setUserInput('');
    setIsLoading(true);

    const agentResponseText = await getSmartAnswer(updatedMessages, KNOWLEDGE_BASE);
    setIsLoading(false);

    if (agentResponseText.includes('AVISO:')) {
         const agentMessage: ChatMessage = {
            id: `agent-${Date.now()}`,
            text: agentResponseText,
            sender: MessageSender.Agent,
        };
        setMessages(prev => [...prev, agentMessage]);
        return;
    }

    if (agentResponseText === 'NaoEncontrado') {
        const notFoundMessage: ChatMessage = {
            id: `agent-${Date.now()}`,
            text: isFromLibras 
                ? 'Entendi o problema comunicado em Libras. Vou registrar um chamado para nossa equipe de suporte.'
                : 'Não consegui encontrar uma resposta em minha base de conhecimento. Vou registrar um chamado para nossa equipe de suporte.',
            sender: MessageSender.Agent,
        };
        setMessages(prev => [...prev, notFoundMessage]);
        
        setIsLoading(true);
        const ticketSummary = await createTicketSummary(updatedMessages, query);
        const newTicket = onTicketCreated({ ...ticketSummary, originalQuery: query });
        setIsLoading(false);
        
        const ticketCreatedMessage: ChatMessage = {
            id: `agent-${Date.now() + 1}`,
            text: `Chamado "${newTicket.title}" (ID: ${newTicket.id}) criado com sucesso! Nossa equipe entrará em contato em breve.`,
            sender: MessageSender.Agent,
            action: {
              label: 'Visualizar Chamado',
              onClick: () => onViewTicket(newTicket.id),
            }
        };
        setMessages(prev => [...prev, ticketCreatedMessage]);

    } else {
        const agentMessage: ChatMessage = {
            id: `agent-${Date.now()}`,
            text: agentResponseText,
            sender: MessageSender.Agent,
        };
        setMessages(prev => [...prev, agentMessage]);
    }
  }, [messages, onTicketCreated, onViewTicket]);

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;
    processAndSendUserQuery(userInput);
  }, [userInput, isLoading, processAndSendUserQuery]);
  
  const startRecording = async () => {
    setVoiceError(null);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            setIsLoading(true);
            
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
                const base64data = (reader.result as string).split(',')[1];
                const mimeType = audioBlob.type;
                const transcript = await getTranscriptionFromAudio(base64data, mimeType);
                setIsLoading(false);
                if (transcript && !transcript.includes('AVISO:')) {
                    setUserInput(transcript);
                } else {
                    setVoiceError(transcript); 
                }
            };

            
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);

    } catch (err) {
        console.error("Error starting recording:", err);
        setVoiceError("Não foi possível iniciar a gravação. Verifique as permissões do microfone.");
        setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleVoiceInput = () => {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
  };
  
  const handleLibrasVideoSubmit = async (videoBlob: Blob) => {
    setIsLibrasModalOpen(false);
    setIsLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(videoBlob);
    reader.onloadend = async () => {
        const base64data = (reader.result as string).split(',')[1];
        const description = await getVideoDescriptionFromLibras(base64data);
        setIsLoading(false);
        
        if (description && !description.includes('AVISO:')) {
            const librasMessage: ChatMessage = {
              id: `libras-${Date.now()}`,
              text: `(Vídeo em Libras) "${description}"`,
              sender: MessageSender.User,
            };
            processAndSendUserQuery(description, true);
        } else {
            const errorMessage: ChatMessage = {
                id: `agent-${Date.now()}`,
                text: description, 
                sender: MessageSender.Agent,
            };
            setMessages(prev => [...prev, errorMessage]);
        }
    };
    reader.onerror = () => {
        setIsLoading(false);
        const errorMessage: ChatMessage = {
            id: `agent-${Date.now()}`,
            text: "Desculpe, ocorreu um erro ao processar o vídeo. Por favor, tente novamente.",
            sender: MessageSender.Agent,
        };
        setMessages(prev => [...prev, errorMessage]);
    };
  };

  return (
    <div className="flex flex-col h-full max-h-[85vh] bg-white rounded-lg shadow-xl border border-slate-200">
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl max-w-md lg:max-w-lg inline-block bg-slate-200 text-slate-800 rounded-bl-none">
              <div className="flex items-center space-x-2">
                <LoadingIcon className="w-5 h-5 animate-spin" />
                <span>Nexus está digitando...</span>
              </div>
            </div>
          </div>
        )}
        
        {messages.length <= 1 && !isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              {FAQ_SUGGESTIONS.map((faq) => (
                  <button
                      key={faq.title}
                      onClick={() => processAndSendUserQuery(faq.title)}
                      className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors duration-200 border border-purple-100 group"
                  >
                      <p className="font-semibold text-purple-800">{faq.title}</p>
                      <p className="text-sm text-purple-600 group-hover:text-purple-700">{faq.subtitle}</p>
                  </button>
              ))}
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200">
        {voiceError && (
          <p className="text-sm text-center text-red-600 mb-2">{voiceError}</p>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleVoiceInput}
            disabled={isLoading}
            className={`p-3 rounded-full transition-colors disabled:opacity-50 ${
                isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
            aria-label={isRecording ? 'Parar gravação' : 'Iniciar gravação por voz'}
          >
            <MicrophoneIcon className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={() => setIsLibrasModalOpen(true)}
            disabled={isLoading}
            className="p-3 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-full transition-colors disabled:opacity-50"
            aria-label="Abrir chamado em Libras"
          >
            <VideoCameraIcon className="w-6 h-6" />
          </button>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e as any);
                }
            }}
            placeholder={isRecording ? "Ouvindo... fale agora." : "Digite sua mensagem aqui..."}
            className="w-full px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
            rows={1}
            disabled={isLoading || isRecording}
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:bg-purple-300 transition-colors"
            aria-label="Enviar mensagem"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </div>

      <LibrasRecordingModal
        isOpen={isLibrasModalOpen}
        onClose={() => setIsLibrasModalOpen(false)}
        onSubmit={handleLibrasVideoSubmit}
      />
    </div>
  );
};

export default ChatInterface;