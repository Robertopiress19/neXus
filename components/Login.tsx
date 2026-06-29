import React, { useState } from 'react';
import { CurrentUser, User } from '../types';

interface LoginProps {
  onLogin: (user: CurrentUser) => void;
  users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userDetails = users.find(u => u.email === email);

    if (email === 'usuario@inovaapps.com' && userDetails) {
      onLogin({ ...userDetails, role: 'user' });
    } else if (email === 'atendente@inovaapps.com' && userDetails) {
      onLogin({ ...userDetails, role: 'agent' });
    } else {
      setError('E-mail inválido. Use um dos e-mails de teste.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
            <h1 className="font-logo text-3xl font-bold text-slate-800">
                ne<span className="text-purple-600 font-black">X</span>us
            </h1>
            <p className="mt-2 text-sm text-slate-500">Agente de Suporte Interativo</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-bold text-slate-600 block">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="seu.email@exemplo.com"
              className="w-full px-4 py-2 mt-2 text-slate-700 bg-slate-100 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
           <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-md border border-slate-200">
                <p className="font-semibold">Para este protótipo, use os e-mails:</p>
                <ul className="list-disc list-inside mt-1">
                    <li><strong className="text-slate-600">Usuário:</strong> usuario@inovaapps.com</li>
                    <li><strong className="text-slate-600">Atendente:</strong> atendente@inovaapps.com</li>
                </ul>
            </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;