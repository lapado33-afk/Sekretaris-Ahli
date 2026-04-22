
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white py-8 px-4 shadow-xl mb-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-amber-500 p-3 rounded-lg shadow-inner">
            <i className="fas fa-file-signature text-2xl text-slate-900"></i>
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">Sekretaris Ahli</h1>
            <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">Asisten Notulen & Komunikasi Sekolah</p>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-xs text-slate-500 italic">"Membangun Profesionalisme melalui Komunikasi Presisi"</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
