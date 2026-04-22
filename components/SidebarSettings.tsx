
import React from 'react';
import { MeetingData } from '../types';

interface SidebarSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  formData: MeetingData;
  setFormData: React.Dispatch<React.SetStateAction<MeetingData>>;
  apiKey: string;
  setApiKey: (key: string) => void;
}

const SidebarSettings: React.FC<SidebarSettingsProps> = ({ 
  isOpen, 
  onClose, 
  formData, 
  setFormData, 
  apiKey, 
  setApiKey 
}) => {
  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      header: { ...prev.header, [name]: value }
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logoKabupaten' | 'logoSekolah') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) {
        alert("Ukuran file terlalu besar. Maksimal 500KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          header: { ...prev.header, [type]: reader.result as string }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-[350px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <i className="fas fa-cog text-amber-500"></i> Pengaturan
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-8">
          {/* API Key Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-l-4 border-amber-500 pl-3">
              Konfigurasi API
            </h3>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Gemini API Key</label>
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Masukkan API Key..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm"
              />
              <p className="text-[10px] text-slate-400 italic leading-relaxed">
                Key tersimpan sementara di browser. Kosongkan untuk menggunakan sistem default.
              </p>
            </div>
          </section>

          {/* Kop Sekolah Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-l-4 border-blue-500 pl-3">
              Kop Sekolah (Header)
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Baris 1 (Pemerintah)</label>
                <input 
                  type="text" 
                  name="government"
                  value={formData.header.government}
                  onChange={handleHeaderChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Baris 2 (Dinas)</label>
                <input 
                  type="text" 
                  name="department"
                  value={formData.header.department}
                  onChange={handleHeaderChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Nama Sekolah</label>
                <input 
                  type="text" 
                  name="schoolName"
                  value={formData.header.schoolName}
                  onChange={handleHeaderChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Alamat</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.header.address}
                  onChange={handleHeaderChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </section>

          {/* Logo Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-l-4 border-green-500 pl-3">
              Logo Dokumen
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="text-xs font-bold text-slate-600 block mb-2">Logo Kabupaten (Kiri)</label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-slate-300 flex items-center justify-center rounded">
                    {formData.header.logoKabupaten ? (
                      <img src={formData.header.logoKabupaten} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <i className="fas fa-landmark text-slate-300 text-xs"></i>
                    )}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleLogoUpload(e, 'logoKabupaten')}
                    className="text-[10px] w-full" 
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="text-xs font-bold text-slate-600 block mb-2">Logo Sekolah (Kanan)</label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-slate-300 flex items-center justify-center rounded">
                    {formData.header.logoSekolah ? (
                      <img src={formData.header.logoSekolah} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <i className="fas fa-school text-slate-300 text-xs"></i>
                    )}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleLogoUpload(e, 'logoSekolah')}
                    className="text-[10px] w-full" 
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 text-center">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition shadow-lg"
          >
            Selesai & Simpan
          </button>
          <p className="text-[10px] text-slate-400 mt-2">
            Pengaturan akan diterapkan pada pratinjau dokumen.
          </p>
        </div>
      </div>
    </>
  );
};

export default SidebarSettings;
