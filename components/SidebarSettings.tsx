
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

  const removeLogo = (type: 'logoKabupaten' | 'logoSekolah') => {
    setFormData(prev => ({
      ...prev,
      header: { ...prev.header, [type]: undefined }
    }));
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
            <i className="fas fa-sliders-h text-amber-500"></i> Pengaturan Dokumen
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-8">
          {/* Live Preview of Header */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-l-4 border-slate-900 pl-3">
              Pratinjau Kop Surat
            </h3>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm scale-75 origin-top -mb-16">
              <div className="p-4 border-b-2 border-slate-900 flex items-center gap-2">
                <div className="w-10 h-10 bg-slate-50 flex items-center justify-center shrink-0">
                  {formData.header.logoKabupaten ? <img src={formData.header.logoKabupaten} className="max-w-full max-h-full object-contain" /> : <i className="fas fa-landmark text-slate-300 text-xs"></i>}
                </div>
                <div className="text-[8px] text-center flex-grow font-bold uppercase leading-tight">
                  <div className="text-[6px]">{formData.header.government || 'PEMERINTAH KABUPATEN ...'}</div>
                  <div className="text-[7px]">{formData.header.department || 'DINAS PENDIDIKAN ...'}</div>
                  <div className="text-[9px]">{formData.header.schoolName || 'NAMA SEKOLAH'}</div>
                  <div className="text-[5px] font-normal italic">{formData.header.address || 'Alamat Sekolah...'}</div>
                </div>
                <div className="w-10 h-10 bg-slate-50 flex items-center justify-center shrink-0">
                  {formData.header.logoSekolah ? <img src={formData.header.logoSekolah} className="max-w-full max-h-full object-contain" /> : <i className="fas fa-school text-slate-300 text-xs"></i>}
                </div>
              </div>
            </div>
          </section>

          {/* API Key Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-l-4 border-amber-500 pl-3">
              Konfigurasi AI
            </h3>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 space-y-3">
              <label className="text-xs font-bold text-amber-900 uppercase">Input Gemini API Key</label>
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Masukkan API Key Anda..."
                className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm bg-white"
              />
              <div className="flex items-start gap-2 text-[10px] text-amber-700 leading-tight">
                <i className="fas fa-info-circle mt-0.5"></i>
                <p>Kosongkan jika ingin menggunakan sistem default. Key ini hanya tersimpan di browser Anda.</p>
              </div>
            </div>
          </section>

          {/* Kop Sekolah Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-l-4 border-blue-500 pl-3">
              Kop Sekolah (Header)
            </h3>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-blue-900 uppercase">Instansi Pemerintah (Baris 1)</label>
                <input 
                  type="text" 
                  name="government"
                  value={formData.header.government}
                  onChange={handleHeaderChange}
                  placeholder="PEMERINTAH KABUPATEN ..."
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-blue-900 uppercase">Dinas (Baris 2)</label>
                <input 
                  type="text" 
                  name="department"
                  value={formData.header.department}
                  onChange={handleHeaderChange}
                  placeholder="DINAS PENDIDIKAN ..."
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-blue-900 uppercase">Nama Sekolah (Baris 3)</label>
                <input 
                  type="text" 
                  name="schoolName"
                  value={formData.header.schoolName}
                  onChange={handleHeaderChange}
                  placeholder="NAMA SEKOLAH ANDA"
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white font-bold focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-blue-900 uppercase">Alamat & Kontak</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.header.address}
                  onChange={handleHeaderChange}
                  placeholder="Alamat Lengkap & Telp/Email..."
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            </div>
          </section>

          {/* Logo Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
              Logo Institusi
            </h3>
            <div className="space-y-4">
              {/* Logo Kabupaten */}
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-emerald-900 uppercase">Logo Kabupaten (Kiri)</label>
                  {formData.header.logoKabupaten && (
                    <button 
                      onClick={() => removeLogo('logoKabupaten')}
                      className="text-[10px] text-red-500 hover:text-red-700 font-bold"
                    >
                      HAPUS LOGO
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <div className="w-full h-24 bg-white border-2 border-dashed border-emerald-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {formData.header.logoKabupaten ? (
                      <img src={formData.header.logoKabupaten} className="max-w-full max-h-full object-contain p-2" />
                    ) : (
                      <div className="text-center">
                        <i className="fas fa-landmark text-emerald-200 text-3xl mb-1"></i>
                        <p className="text-[9px] text-emerald-400 uppercase font-bold">Belum Ada Logo</p>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    id="upload-logo-kab"
                    accept="image/*" 
                    onChange={(e) => handleLogoUpload(e, 'logoKabupaten')}
                    className="hidden" 
                  />
                  <label 
                    htmlFor="upload-logo-kab"
                    className="w-full py-2 bg-white border border-emerald-300 text-emerald-700 text-center text-xs font-bold rounded-lg cursor-pointer hover:bg-emerald-100 transition"
                  >
                    GANTI / UNGGAH LOGO
                  </label>
                </div>
              </div>

              {/* Logo Sekolah */}
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-emerald-900 uppercase">Logo Sekolah (Kanan)</label>
                  {formData.header.logoSekolah && (
                    <button 
                      onClick={() => removeLogo('logoSekolah')}
                      className="text-[10px] text-red-500 hover:text-red-700 font-bold"
                    >
                      HAPUS LOGO
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <div className="w-full h-24 bg-white border-2 border-dashed border-emerald-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {formData.header.logoSekolah ? (
                      <img src={formData.header.logoSekolah} className="max-w-full max-h-full object-contain p-2" />
                    ) : (
                      <div className="text-center">
                        <i className="fas fa-school text-emerald-200 text-3xl mb-1"></i>
                        <p className="text-[9px] text-emerald-400 uppercase font-bold">Belum Ada Logo</p>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    id="upload-logo-sek"
                    accept="image/*" 
                    onChange={(e) => handleLogoUpload(e, 'logoSekolah')}
                    className="hidden" 
                  />
                  <label 
                    htmlFor="upload-logo-sek"
                    className="w-full py-2 bg-white border border-emerald-300 text-emerald-700 text-center text-xs font-bold rounded-lg cursor-pointer hover:bg-emerald-100 transition"
                  >
                    GANTI / UNGGAH LOGO
                  </label>
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
