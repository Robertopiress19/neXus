import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Ticket, TicketStatus, TicketPriority, CurrentUser, TicketCategory, User, TicketMessage } from './types';
import ChatInterface from './components/ChatInterface';
import TicketsDashboard from './components/TicketsDashboard';
import Login from './components/Login';
import Header from './components/Header';
import MyTickets from './components/MyTickets';
import ChatHistory from './components/ChatHistory';

const USERS: User[] = [
  {
    email: 'usuario@inovaapps.com',
    name: 'Ana Silva',
    sector: 'Recepção',
    phone: '(11) 98765-4321',
  },
  {
    email: 'atendente@inovaapps.com',
    name: 'Carlos Pereira',
    sector: 'Suporte TI',
    phone: '(11) 91234-5678',
  },
  {
    email: 'outro.usuario@email.com',
    name: 'Bruno Costa',
    sector: 'Marketing',
    phone: '(21) 99999-8888',
  }
];

const initialTickets: Ticket[] = [
    {
      id: 'TKT-001',
      userId: 'usuario@inovaapps.com',
      title: 'Computador não liga',
      description: 'O computador da recepção não está ligando, mesmo após verificar os cabos de energia.',
      originalQuery: 'Meu computador não quer ligar de jeito nenhum.',
      status: TicketStatus.EmAndamento,
      priority: TicketPriority.Alta,
      category: TicketCategory.Computador,
      createdAt: new Date('2025-09-12T14:16:00'),
      updatedAt: new Date('2025-09-13T13:16:00'),
      messages: [
        {
          sender: 'agent',
          text: 'Já verifiquei o chamado e estou a caminho para verificar o problema pessoalmente.',
          timestamp: new Date('2025-09-13T10:00:00'),
        }
      ],
    },
    {
      id: 'TKT-002',
      userId: 'outro.usuario@email.com',
      title: 'Mouse sem fio não conecta',
      description: 'O mouse sem fio do setor de marketing parou de funcionar. As pilhas foram trocadas mas o problema persiste.',
      originalQuery: 'Meu mouse não funciona, já troquei a pilha.',
      status: TicketStatus.Resolvido,
      priority: TicketPriority.Baixa,
      category: TicketCategory.Perifericos,
      createdAt: new Date('2025-09-11T14:16:00'),
      updatedAt: new Date('2025-09-12T14:25:00'),
      messages: [],
    },
     {
      id: 'TKT-003',
      userId: 'usuario@inovaapps.com',
      title: 'Ar condicionado da sala de reunião não gela',
      description: 'Usuário informa que o ar condicionado da sala de reunião principal não está refrigerando o ambiente adequadamente.',
      originalQuery: 'O ar condicionado da sala de reunião não está gelando.',
      status: TicketStatus.Aberto,
      priority: TicketPriority.Media,
      category: TicketCategory.ArCondicionado,
      createdAt: new Date('2025-09-14T09:05:00'),
      updatedAt: new Date('2025-09-14T09:05:00'),
      messages: [],
    },
  ];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [view, setView] = useState<'chat' | 'dashboard' | 'myTickets' | 'chatHistory'>('chat');
  const [focusedTicketId, setFocusedTicketId] = useState<string | null>(null);

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const storedTickets = localStorage.getItem('tickets');
      if (storedTickets) {
        const parsedTickets = JSON.parse(storedTickets);
        // Dates are stored as strings, need to convert them back to Date objects
        return parsedTickets.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
          messages: t.messages ? t.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })) : [],
        }));
      }
    } catch (error) {
      console.error("Failed to parse tickets from localStorage", error);
    }
    return initialTickets;
  });

  // Persist tickets to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('tickets', JSON.stringify(tickets));
    } catch (error) {
      console.error("Failed to save tickets to localStorage", error);
    }
  }, [tickets]);

  const handleLogin = (user: CurrentUser) => {
    setCurrentUser(user);
    if (user.role === 'agent') {
      setView('dashboard');
    } else {
      setView('chat');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };
  
  const addTicket = useCallback((newTicketData: { title: string; description: string; originalQuery: string; category: TicketCategory }): Ticket => {
    if (!currentUser) throw new Error("Usuário não autenticado.");
    
    const newTicket: Ticket = {
      id: `TKT-${String(Date.now()).slice(-4)}`, // More robust ID generation
      userId: currentUser.email,
      status: TicketStatus.Aberto,
      priority: TicketPriority.Media,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
      ...newTicketData
    };
    setTickets(prevTickets => [newTicket, ...prevTickets]);
    return newTicket;
  }, [currentUser]);
  
  const handleUpdateTicketStatus = useCallback((ticketId: string, status: TicketStatus) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, status, updatedAt: new Date() } : ticket
      )
    );
  }, []);
  
  const addMessageToTicket = useCallback((ticketId: string, messageText: string) => {
    if (!currentUser) return;

    const newMessage: TicketMessage = {
      sender: currentUser.role,
      text: messageText,
      timestamp: new Date(),
    };

    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId ? { 
          ...ticket, 
          messages: [...(ticket.messages || []), newMessage], 
          updatedAt: new Date() 
        } : ticket
      )
    );
  }, [currentUser]);

  const handleViewTicket = useCallback((ticketId: string) => {
    setFocusedTicketId(ticketId);
    if (currentUser?.role === 'user') {
      setView('myTickets');
    } else {
      setView('dashboard');
    }
  }, [currentUser]);

  const handleSwitchView = (newView: 'chat' | 'dashboard' | 'myTickets' | 'chatHistory') => {
    setFocusedTicketId(null);
    setView(newView);
  }

  const userVisibleTickets = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'agent') {
      return tickets;
    }
    return tickets.filter(ticket => ticket.userId === currentUser.email);
  }, [tickets, currentUser]);


  if (!currentUser) {
    return <Login onLogin={handleLogin} users={USERS} />;
  }

  const renderContent = () => {
    if (!currentUser) return null;

    if (currentUser.role === 'user') {
      switch (view) {
        case 'chat':
          return (
            <div className="flex justify-center pt-2">
              <div className="w-full max-w-4xl">
                <ChatInterface onTicketCreated={addTicket} onViewTicket={handleViewTicket} />
              </div>
            </div>
          );
        case 'myTickets':
          return (
            <MyTickets
              tickets={userVisibleTickets}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              onSwitchView={() => handleSwitchView('chat')}
              focusedTicketId={focusedTicketId}
              onAddMessage={addMessageToTicket}
            />
          );
        case 'chatHistory':
          return <ChatHistory onSwitchView={() => handleSwitchView('chat')} />;
        default:
          setView('chat'); // Fallback to chat for user
          return null;
      }
    }

    if (currentUser.role === 'agent') {
      // Agent's view is always the dashboard
      return (
        <TicketsDashboard
          tickets={userVisibleTickets}
          onUpdateTicketStatus={handleUpdateTicketStatus}
          userRole={currentUser.role}
          focusedTicketId={focusedTicketId}
          users={USERS}
          onAddMessage={addMessageToTicket}
        />
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800 bg-slate-100">
      <Header
        user={currentUser}
        onLogout={handleLogout}
        currentView={view}
        onSwitchView={handleSwitchView}
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
