import React from 'react';
import { User } from '../types';
import { XMarkIcon, UserCircleIcon, EnvelopeIcon, BuildingOffice2Icon, PhoneIcon } from './Icons';

interface ContactModalProps {
  user: User | null;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="contact-modal-title"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 id="contact-modal-title" className="text-lg font-semibold text-slate-800">Informações de Contato</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100" aria-label="Fechar modal">
            <XMarkIcon className="w-6 h-6 text-slate-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
            <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                    <UserCircleIcon className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                    <p className="text-sm text-slate-500">Nome</p>
                    <p className="font-semibold text-slate-800 text-lg">{user.name}</p>
                </div>
            </div>
            
            <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700 break-all">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                    <BuildingOffice2Icon className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700">{user.sector}</span>
                </div>
                <div className="flex items-center space-x-3">
                    <PhoneIcon className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700">{user.phone}</span>
                </div>
            </div>
        </div>
        <div className="p-4 bg-slate-50 rounded-b-xl text-right">
            <button 
                onClick={onClose} 
                className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500 transition-colors"
            >
                Fechar
            </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default ContactModal;