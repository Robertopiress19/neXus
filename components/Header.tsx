import React, { useState } from 'react';
import { CurrentUser } from '../types';
import { Bars3Icon, ArrowLeftOnRectangleIcon, ChartBarIconOutline as ChartBarIcon, ChatBubbleLeftRightIcon, TicketIcon, ClockIcon } from './Icons';

interface HeaderProps {
    user: CurrentUser;
    onLogout: () => void;
    currentView: 'chat' | 'dashboard' | 'myTickets' | 'chatHistory';
    onSwitchView: (view: 'chat' | 'dashboard' | 'myTickets' | 'chatHistory') => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, currentView, onSwitchView }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const NavLinks: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
        const commonClasses = `font-medium transition-colors ${isMobile ? 'block w-full text-left p-3' : 'px-3 py-2'}`;

        if (user.role === 'user') {
            return (
                <>
                    <button
                        onClick={() => { onSwitchView('chat'); isMobile && setIsMenuOpen(false); }}
                        className={`${commonClasses} ${currentView === 'chat' ? 'text-purple-600' : 'text-slate-600 hover:text-purple-600'}`}
                    >
                        <ChatBubbleLeftRightIcon className="w-5 h-5 inline-block mr-2" />
                        Chat
                    </button>
                    <button
                        onClick={() => { onSwitchView('myTickets'); isMobile && setIsMenuOpen(false); }}
                        className={`${commonClasses} ${currentView === 'myTickets' ? 'text-purple-600' : 'text-slate-600 hover:text-purple-600'}`}
                    >
                        <TicketIcon className="w-5 h-5 inline-block mr-2" />
                        Meus Chamados
                    </button>
                    <button
                        onClick={() => { onSwitchView('chatHistory'); isMobile && setIsMenuOpen(false); }}
                        className={`${commonClasses} ${currentView === 'chatHistory' ? 'text-purple-600' : 'text-slate-600 hover:text-purple-600'}`}
                    >
                        <ClockIcon className="w-5 h-5 inline-block mr-2" />
                        Histórico
                    </button>
                </>
            );
        }

        if (user.role === 'agent') {
            return (
                <button
                    onClick={() => { onSwitchView('dashboard'); isMobile && setIsMenuOpen(false); }}
                    className={`${commonClasses} ${currentView === 'dashboard' ? 'text-purple-600' : 'text-slate-600 hover:text-purple-600'}`}
                >
                    <ChartBarIcon className="w-5 h-5 inline-block mr-2" />
                    Painel de Chamados
                </button>
            );
        }
        
        return null;
    };


    return (
        <header className="bg-white shadow-sm sticky top-0 z-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <h1 className="font-logo text-2xl font-bold text-slate-800">
                        ne<span className="text-purple-600 font-black">X</span>us
                    </h1>

                  
                    <nav className="hidden md:flex items-center space-x-4">
                        <NavLinks />
                        <div className="border-l border-slate-200 pl-4 flex items-center space-x-3">
                             <span className="text-sm text-slate-500">{user.email}</span>
                             <button
                                onClick={onLogout}
                                className="p-2 text-slate-500 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
                                title="Sair"
                            >
                                <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </nav>

               
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-md">
                            <Bars3Icon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

        
            {isMenuOpen && (
                 <div className="md:hidden bg-white border-t border-slate-200">
                    <nav className="container mx-auto px-4 py-2 space-y-1">
                        <NavLinks isMobile />
                         <div className="border-t border-slate-200 pt-3 mt-2">
                             <p className="text-sm text-slate-500 px-3 mb-2">{user.email}</p>
                             <button
                                onClick={onLogout}
                                className="w-full text-left p-3 font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center"
                            >
                                <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
                                Sair
                            </button>
                         </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;