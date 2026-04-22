
import React, { useState } from 'react';
import { MeetingData, MeetingType } from '../types';
import { suggestNextSteps } from '../services/geminiService';

interface MeetingFormProps {
  formData: MeetingData;
  setFormData: React.Dispatch<React.SetStateAction<MeetingData>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const MeetingForm: React.FC<MeetingFormProps> = ({ formData, setFormData, onSubmit, isLoading }) => {
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, title: e.target.value }));
  };

  const handleAutoSuggest = async () => {
    if (!formData.agenda || !formData.discussionPoints || !formData.decisions) {
      alert("Harap isi Agenda, Diskusi, dan Keputusan terlebih dahulu agar AI dapat memberikan saran yang akurat.");
      return;
    }

    setIsSuggesting(true);
    try {
      const suggestion = await suggestNextSteps(formData);
      if (suggestion) {
        setFormData(prev => ({ ...prev, nextSteps: suggestion }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSuggesting(false);
    }
  };

  // Check if main fields are filled to highlight suggestion button
  const canSuggest = formData.agenda && formData.discussionPoints && formData.decisions;

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
      if (file.size > 500000) { // 500kb limit for base64 storage
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
    <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 space-y-6">
      {/* Kop Sekolah Section */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <i className="fas fa-heading text-blue-600"></i> Pengaturan Kop Sekolah
          </h3>
          <p className="text-xs text-slate-500 mt-1">Isi identitas sekolah untuk bagian atas dokumen.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1 col-span-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Identitas Atas (Baris 1)</label>
            <input 
              type="text" 
              name="government"
              value={formData.header.government}
              onChange={handleHeaderChange}
              placeholder="PEMERINTAH KABUPATEN ..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="space-y-1 col-span-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Dinas Terkait (Baris 2)</label>
            <input 
              type="text" 
              name="department"
              value={formData.header.department}
              onChange={handleHeaderChange}
              placeholder="DINAS PENDIDIKAN DAN ..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Nama Sekolah</label>
            <input 
              type="text" 
              name="schoolName"
              value={formData.header.schoolName}
              onChange={handleHeaderChange}
              placeholder="NAMA SEKOLAH ANDA"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Alamat & Kontak</label>
            <input 
              type="text" 
              name="address"
              value={formData.header.address}
              onChange={handleHeaderChange}
              placeholder="Jl. Raya Utama No. 123..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none italic"
            />
          </div>

          {/* Logo Uploaders */}
          <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2 mt-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Logo Kab/Kota</label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded flex items-center justify-center overflow-hidden">
                  {formData.header.logoKabupaten ? (
                    <img src={formData.header.logoKabupaten} alt="Logo Kab" className="w-full h-full object-contain" />
                  ) : (
                    <i className="fas fa-landmark text-slate-300"></i>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleLogoUpload(e, 'logoKabupaten')}
                  className="text-xs w-full file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Logo Sekolah</label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded flex items-center justify-center overflow-hidden">
                  {formData.header.logoSekolah ? (
                    <img src={formData.header.logoSekolah} alt="Logo Sek" className="w-full h-full object-contain" />
                  ) : (
                    <i className="fas fa-school text-slate-300"></i>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleLogoUpload(e, 'logoSekolah')}
                  className="text-xs w-full file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <i className="fas fa-edit text-amber-600"></i> Data Pertemuan
        </h2>
        <p className="text-slate-500 text-sm">Lengkapi detail rapat untuk menyusun notulen yang akurat.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1 col-span-1 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Pilih Template / Jenis Rapat</label>
          <select 
            onChange={handleTemplateSelect}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
          >
            <option value="">-- Pilih Jenis Rapat --</option>
            {Object.values(MeetingType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1 col-span-1 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Judul Rapat</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange}
            placeholder="Contoh: Rapat Koordinasi Persiapan UAS 2024"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Tanggal</label>
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Waktu</label>
          <input 
            type="text" 
            name="time" 
            value={formData.time} 
            onChange={handleChange}
            placeholder="Contoh: 09:00 - 11:30 WIB"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Tempat</label>
          <input 
            type="text" 
            name="location" 
            value={formData.location} 
            onChange={handleChange}
            placeholder="Contoh: Ruang Rapat Utama"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Pimpinan Rapat</label>
          <input 
            type="text" 
            name="leadBy" 
            value={formData.leadBy} 
            onChange={handleChange}
            placeholder="Nama Lengkap & Gelar"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Peserta Rapat</label>
          <textarea 
            name="participants" 
            value={formData.participants} 
            onChange={handleChange}
            rows={2}
            placeholder="Daftar peserta atau kelompok (misal: Seluruh Guru Mapel)"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          ></textarea>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Agenda Utama</label>
          <textarea 
            name="agenda" 
            value={formData.agenda} 
            onChange={handleChange}
            rows={2}
            placeholder="Poin-poin agenda rapat"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            required
          ></textarea>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700 text-amber-800">Catatan Diskusi (Raw Notes)</label>
          <textarea 
            name="discussionPoints" 
            value={formData.discussionPoints} 
            onChange={handleChange}
            rows={4}
            placeholder="Masukkan poin-poin yang dibicarakan secara bebas..."
            className="w-full px-4 py-2 border border-amber-200 rounded-lg bg-amber-50/30 focus:ring-2 focus:ring-amber-500 outline-none"
          ></textarea>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Keputusan & Kesepakatan</label>
          <textarea 
            name="decisions" 
            value={formData.decisions} 
            onChange={handleChange}
            rows={3}
            placeholder="Hasil akhir atau kesepakatan yang dicapai"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          ></textarea>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-700">Tindak Lanjut</label>
            <button
              type="button"
              onClick={handleAutoSuggest}
              disabled={isSuggesting}
              className={`text-xs px-3 py-1 rounded-full border transition flex items-center gap-1 ${isSuggesting ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : (canSuggest ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 animate-pulse' : 'bg-slate-50 text-slate-400 border-slate-200 cursor-help')}`}
              title={canSuggest ? "Klik untuk mengisi tindak lanjut secara otomatis" : "Isi Agenda & Keputusan terlebih dahulu"}
            >
              {isSuggesting ? (
                <><i className="fas fa-spinner animate-spin"></i> Berpikir...</>
              ) : (
                <><i className="fas fa-magic"></i> Isi Otomatis</>
              )}
            </button>
          </div>
          <textarea 
            name="nextSteps" 
            value={formData.nextSteps} 
            onChange={handleChange}
            rows={3}
            placeholder="Rencana aksi setelah rapat selesai..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all duration-300"
          ></textarea>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition flex items-center justify-center gap-3 ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 active:scale-[0.98]'}`}
      >
        {isLoading ? (
          <>
            <i className="fas fa-circle-notch animate-spin"></i>
            Menyusun Notulen...
          </>
        ) : (
          <>
            <i className="fas fa-magic"></i>
            Sempurnakan & Susun Notulen
          </>
        )}
      </button>
    </form>
  );
};

export default MeetingForm;
