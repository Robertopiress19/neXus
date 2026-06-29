import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500 gap-2">
          <h1 className="font-logo text-lg font-bold text-slate-800">
            ne<span className="text-purple-600 font-black">X</span>us
          </h1>
          <p>&copy; {new Date().getFullYear()} INOVAAPPS. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;