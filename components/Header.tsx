
import React from 'react';

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="bg-slate-900 text-white py-6 px-4 shadow-xl mb-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-amber-500 p-3 rounded-lg shadow-inner">
            <i className="fas fa-file-signature text-2xl text-slate-900"></i>
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight">Sekretaris Ahli</h1>
            <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">Asisten Notulen & Komunikasi Sekolah</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:block text-right border-r border-slate-700 pr-4 mr-4">
            <p className="text-xs text-slate-500 italic">"Membangun Profesionalisme melalui Komunikasi Presisi"</p>
          </div>
          <button 
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all active:scale-95 group"
          >
            <i className="fas fa-cog text-amber-500 group-hover:rotate-90 transition-transform duration-500"></i>
            <span className="font-semibold text-sm">Pengaturan</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
