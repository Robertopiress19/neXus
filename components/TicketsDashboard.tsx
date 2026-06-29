import React, { useState, useMemo, useEffect } from 'react';
import { Ticket, TicketStatus, TicketPriority, UserRole, TicketCategory, User } from '../types';
import TicketCard from './TicketCard';
import ContactModal from './ChatHistoryModal';
import {
    ChartBarIcon,
    FunnelIcon,
    XMarkIcon,
} from './Icons';

interface TicketsDashboardProps {
  tickets: Ticket[];
  onUpdateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  userRole: UserRole;
  users: User[];
  focusedTicketId?: string | null;
  onAddMessage: (ticketId: string, messageText: string) => void;
}

const TicketsDashboard: React.FC<TicketsDashboardProps> = ({ tickets, onUpdateTicketStatus, userRole, users, focusedTicketId, onAddMessage }) => {
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | 'all'>('all');
  const [idFilter, setIdFilter] = useState<string | null>(focusedTicketId || null);
  const [contactUser, setContactUser] = useState<User | null>(null);

  // Modal State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempStatusFilter, setTempStatusFilter] = useState(statusFilter);
  const [tempPriorityFilter, setTempPriorityFilter] = useState(priorityFilter);
  const [tempCategoryFilter, setTempCategoryFilter] = useState(categoryFilter);

  // When modal opens, sync temp state with main state
  useEffect(() => {
    if (isFilterModalOpen) {
      setTempStatusFilter(statusFilter);
      setTempPriorityFilter(priorityFilter);
      setTempCategoryFilter(categoryFilter);
    }
  }, [isFilterModalOpen, statusFilter, priorityFilter, categoryFilter]);


  useEffect(() => {
      setIdFilter(focusedTicketId || null);
      if (focusedTicketId) {
        setStatusFilter('all');
        setPriorityFilter('all');
        setCategoryFilter('all');
      }
  }, [focusedTicketId]);
  
  const handleOpenContactModal = (userId: string) => {
    const userToContact = users.find(u => u.email === userId);
    if (userToContact) {
        setContactUser(userToContact);
    } else {
        console.warn(`User with email ${userId} not found.`);
        alert(`Não foi possível encontrar os detalhes do usuário com e-mail: ${userId}`);
    }
  };

  const handleCloseContactModal = () => {
    setContactUser(null);
  };


  const stats = useMemo(() => {
    return {
      total: tickets.length,
      abertos: tickets.filter(t => t.status === TicketStatus.Aberto).length,
      emAndamento: tickets.filter(t => t.status === TicketStatus.EmAndamento).length,
      resolvidos: tickets.filter(t => t.status === TicketStatus.Resolvido).length,
      cancelados: tickets.filter(t => t.status === TicketStatus.Cancelado).length,
    }
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    if (idFilter) {
        return tickets.filter(ticket => ticket.id === idFilter);
    }
    return tickets.filter(ticket => {
      const statusMatch = statusFilter === 'all' || ticket.status === statusFilter;
      const priorityMatch = priorityFilter === 'all' || ticket.priority === priorityFilter;
      const categoryMatch = categoryFilter === 'all' || ticket.category === categoryFilter;
      return statusMatch && priorityMatch && categoryMatch;
    });
  }, [tickets, statusFilter, priorityFilter, categoryFilter, idFilter]);

  const clearIdFilter = () => {
    setIdFilter(null);
  };

  const handleApplyModalFilters = () => {
    setStatusFilter(tempStatusFilter);
    setPriorityFilter(tempPriorityFilter);
    setCategoryFilter(tempCategoryFilter);
    clearIdFilter();
    setIsFilterModalOpen(false);
  };

  const handleClearModalFilters = () => {
    setTempStatusFilter('all');
    setTempPriorityFilter('all');
    setTempCategoryFilter('all');
  };

  const StatusFilterTab: React.FC<{
    label: string;
    count: number;
    isActive: boolean;
    onClick: () => void;
    colorClass: string;
    disabled?: boolean;
    }> = ({ label, count, isActive, onClick, colorClass, disabled }) => {
        return (
            <button
                onClick={onClick}
                disabled={disabled}
                className={`flex-shrink-0 px-3 sm:px-4 py-3 text-sm sm:text-base font-medium transition-all duration-200 border-b-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    isActive
                        ? `${colorClass} border-current`
                        : 'text-slate-500 hover:text-slate-800 border-transparent hover:border-slate-300'
                }`}
            >
                {label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    isActive ? 'bg-opacity-10' : 'bg-slate-100 text-slate-500'
                } ${isActive ? `bg-current text-current` : ''}`}>
                    {count}
                </span>
            </button>
        );
    }
    
    const FilterButton: React.FC<{
      label: string;
      value: string;
      activeValue: string;
      onClick: (value: any) => void;
      disabled?: boolean;
    }> = ({ label, value, activeValue, onClick, disabled }) => {
      const isActive = value === activeValue;
      return (
        <button
          onClick={() => onClick(value)}
          disabled={disabled}
          className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors disabled:opacity-50 ${
              isActive
                ? 'text-purple-700 bg-purple-50'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
          {label}
        </button>
      );
    };

    const ModalFilterButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
        <button
          onClick={onClick}
          className={`w-full text-center px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
            isActive ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {label}
        </button>
    );

  return (
    <div className="space-y-6">
    
       <div className="hidden md:block bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center border-b border-slate-200 overflow-x-auto">
                <StatusFilterTab label="Todos" count={stats.total} isActive={statusFilter === 'all'} onClick={() => { setStatusFilter('all'); clearIdFilter(); }} colorClass="text-purple-600" disabled={!!idFilter} />
                <StatusFilterTab label="Abertos" count={stats.abertos} isActive={statusFilter === TicketStatus.Aberto} onClick={() => { setStatusFilter(TicketStatus.Aberto); clearIdFilter(); }} colorClass="text-red-600" disabled={!!idFilter} />
                <StatusFilterTab label="Em Andamento" count={stats.emAndamento} isActive={statusFilter === TicketStatus.EmAndamento} onClick={() => { setStatusFilter(TicketStatus.EmAndamento); clearIdFilter(); }} colorClass="text-yellow-600" disabled={!!idFilter} />
                <StatusFilterTab label="Resolvidos" count={stats.resolvidos} isActive={statusFilter === TicketStatus.Resolvido} onClick={() => { setStatusFilter(TicketStatus.Resolvido); clearIdFilter(); }} colorClass="text-green-600" disabled={!!idFilter} />
                <StatusFilterTab label="Cancelados" count={stats.cancelados} isActive={statusFilter === TicketStatus.Cancelado} onClick={() => { setStatusFilter(TicketStatus.Cancelado); clearIdFilter(); }} colorClass="text-slate-600" disabled={!!idFilter} />
            </div>
             <div className="p-3 flex items-center gap-x-4 gap-y-2 flex-wrap">
                <span className="text-sm font-medium text-slate-500 shrink-0">Prioridade:</span>
                <div className="flex items-center gap-1 flex-wrap">
                    <FilterButton label="Todas" value="all" activeValue={priorityFilter} onClick={() => { setPriorityFilter('all'); clearIdFilter(); }} disabled={!!idFilter} />
                    {Object.values(TicketPriority).map(priority => (
                        <FilterButton key={priority} label={priority} value={priority} activeValue={priorityFilter} onClick={() => { setPriorityFilter(priority); clearIdFilter(); }} disabled={!!idFilter} />
                    ))}
                </div>
            </div>
            <div className="p-3 flex items-center gap-x-4 gap-y-2 flex-wrap border-t border-slate-200">
                <span className="text-sm font-medium text-slate-500 shrink-0">Categoria:</span>
                <div className="flex items-center gap-1 flex-wrap">
                    <FilterButton label="Todas" value="all" activeValue={categoryFilter} onClick={() => { setCategoryFilter('all'); clearIdFilter(); }} disabled={!!idFilter} />
                    {Object.values(TicketCategory).map(category => (
                        <FilterButton key={category} label={category} value={category} activeValue={categoryFilter} onClick={() => { setCategoryFilter(category); clearIdFilter(); }} disabled={!!idFilter} />
                    ))}
                </div>
            </div>
        </div>

    
        <div className="md:hidden">
            <button
            onClick={() => setIsFilterModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50"
            >
                <FunnelIcon className="w-5 h-5" />
                Filtros
                { (statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all') && <span className="w-2 h-2 rounded-full bg-purple-500"></span> }
            </button>
        </div>

     
        {isFilterModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-end sm:items-center" role="dialog" aria-modal="true">
                <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full max-w-md m-0 sm:m-4 animate-slide-up">
                    <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <h3 className="text-lg font-semibold">Filtros</h3>
                    <button onClick={() => setIsFilterModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100">
                        <XMarkIcon className="w-6 h-6 text-slate-500" />
                    </button>
                    </div>
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="text-sm font-medium text-slate-600 block mb-2">Status</label>
                            <div className="grid grid-cols-2 gap-2">
                                <ModalFilterButton label="Todos" isActive={tempStatusFilter === 'all'} onClick={() => setTempStatusFilter('all')} />
                                <ModalFilterButton label="Abertos" isActive={tempStatusFilter === TicketStatus.Aberto} onClick={() => setTempStatusFilter(TicketStatus.Aberto)} />
                                <ModalFilterButton label="Em Andamento" isActive={tempStatusFilter === TicketStatus.EmAndamento} onClick={() => setTempStatusFilter(TicketStatus.EmAndamento)} />
                                <ModalFilterButton label="Resolvidos" isActive={tempStatusFilter === TicketStatus.Resolvido} onClick={() => setTempStatusFilter(TicketStatus.Resolvido)} />
                                <ModalFilterButton label="Cancelados" isActive={tempStatusFilter === TicketStatus.Cancelado} onClick={() => setTempStatusFilter(TicketStatus.Cancelado)} />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-600 block mb-2">Prioridade</label>
                            <div className="grid grid-cols-3 gap-2">
                                <ModalFilterButton label="Todas" isActive={tempPriorityFilter === 'all'} onClick={() => setTempPriorityFilter('all')} />
                                {Object.values(TicketPriority).map(priority => (
                                    <ModalFilterButton key={priority} label={priority} isActive={tempPriorityFilter === priority} onClick={() => setTempPriorityFilter(priority)} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-600 block mb-2">Categoria</label>
                            <div className="grid grid-cols-2 gap-2">
                                <ModalFilterButton label="Todas" isActive={tempCategoryFilter === 'all'} onClick={() => setTempCategoryFilter('all')} />
                                {Object.values(TicketCategory).map(category => (
                                    <ModalFilterButton key={category} label={category} isActive={tempCategoryFilter === category} onClick={() => setTempCategoryFilter(category)} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-b-xl sm:rounded-b-xl">
                        <button onClick={handleClearModalFilters} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-md">Limpar</button>
                        <button onClick={handleApplyModalFilters} className="px-6 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-md">Aplicar</button>
                    </div>
                </div>
            </div>
        )}

        {idFilter && (
            <div className="text-center">
                <p className="text-sm text-slate-600">
                    Mostrando o chamado específico <strong>{idFilter}</strong>.
                    <button onClick={clearIdFilter} className="ml-2 text-purple-600 hover:text-purple-800 font-semibold">Limpar filtro</button>
                </p>
            </div>
        )}

        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <ChartBarIcon className="w-6 h-6 text-slate-600" />
                <h2 className="text-xl font-semibold text-slate-800">Chamados ({filteredTickets.length})</h2>
            </div>
            {filteredTickets.length > 0 ? (
            <div className="space-y-4">
                {filteredTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} onUpdateTicketStatus={onUpdateTicketStatus} userRole={userRole} onContactUser={handleOpenContactModal} onAddMessage={onAddMessage} />)}
            </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-slate-200">
                    <p className="text-slate-500">Nenhum chamado encontrado com os filtros atuais.</p>
                </div>
            )}
        </div>

        <ContactModal user={contactUser} onClose={handleCloseContactModal} />

        <style>{`
            @keyframes slide-up {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
            }
            .animate-slide-up { animation: slide-up 0.3s ease-out; }
            @media (min-width: 640px) {
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-slide-up { animation: fade-in 0.2s ease-out; }
            }
        `}</style>
    </div>
  );
};

export default TicketsDashboard;