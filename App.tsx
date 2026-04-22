
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import MeetingForm from './components/MeetingForm';
import MinutesPreview from './components/MinutesPreview';
import { MeetingData, GeneratedMinutes } from './types';
import { generateProfessionalMinutes } from './services/geminiService';

const App: React.FC = () => {
  const [formData, setFormData] = useState<MeetingData>({
    title: '',
    date: '',
    time: '',
    location: '',
    leadBy: '',
    participants: '',
    agenda: '',
    discussionPoints: '',
    decisions: '',
    nextSteps: '',
    header: {
      government: 'PEMERINTAH KABUPATEN LUWU UTARA',
      department: 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
      schoolName: '',
      address: ''
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedMinutes | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateProfessionalMinutes(formData);
      setGeneratedResult(result);
      // Scroll to result on small screens
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          const previewElement = document.getElementById('preview-section');
          previewElement?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan yang tidak terduga.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = useCallback(() => {
    if (generatedResult?.text) {
      // Remove any markdown leftovers if any (though prompt forbids it)
      const cleanText = generatedResult.text.replace(/[*_#]/g, '');
      navigator.clipboard.writeText(cleanText);
      alert("Notulen berhasil disalin! Anda bisa langsung menempelkannya (paste) di Microsoft Word atau Google Docs.");
    }
  }, [generatedResult]);

  const handleReset = useCallback(() => {
    if (confirm("Apakah Anda yakin ingin menghapus draf ini dan kembali ke pengisian data?")) {
      setGeneratedResult(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen pb-20 bg-[#f1f5f9]">
      <div className="no-print">
        <Header />
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3 no-print">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form Column */}
          <div className={`lg:col-span-5 transition-all duration-500 no-print ${generatedResult ? 'opacity-50 hover:opacity-100' : 'lg:col-span-12 max-w-3xl mx-auto w-full'}`}>
            <MeetingForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
            />
          </div>

          {/* Result Column */}
          <div id="preview-section" className={`lg:col-span-7 transition-all duration-500 ${!generatedResult && !isLoading ? 'hidden' : 'block'}`}>
            {isLoading ? (
              <div className="bg-white rounded-xl shadow-lg p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-slate-100 border-t-amber-500 rounded-full animate-spin"></div>
                  <i className="fas fa-search absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Menyusun Notulen Profesional</h3>
                  <p className="text-slate-500">AI sedang mencari referensi terkini dan merangkai kata agar sesuai standar administrasi sekolah...</p>
                </div>
              </div>
            ) : (
              generatedResult && (
                <MinutesPreview 
                  content={generatedResult.text} 
                  sources={generatedResult.sources}
                  header={formData.header}
                  onCopy={handleCopy} 
                  onReset={handleReset} 
                />
              )
            )}
          </div>
        </div>

        {!generatedResult && !isLoading && (
          <div className="mt-12 max-w-4xl mx-auto text-center space-y-8 animate-fadeIn no-print">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-search-plus text-xl"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Google Grounding</h3>
                <p className="text-slate-500 text-sm">Notulen diperkaya dengan data referensi dari internet yang valid dan relevan.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-link text-xl"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Sumber Transparan</h3>
                <p className="text-slate-500 text-sm">Setiap informasi tambahan dilengkapi dengan link sumber di bagian bawah dokumen.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-file-contract text-xl"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Format Tanpa Bintang</h3>
                <p className="text-slate-500 text-sm">Hasil bersih, formal, dan siap cetak langsung tanpa format markdown.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 text-center text-slate-400 text-sm no-print">
        <p>&copy; {new Date().getFullYear()} Sekretaris Ahli - Pendamping Administrasi Sekolah Modern</p>
      </footer>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background-color: white !important; margin: 0 !important; padding: 0 !important; }
          main { margin: 0 !important; padding: 0 !important; max-width: none !important; width: 100% !important; }
          .lg\\:col-span-7 { width: 100% !important; margin: 0 !important; padding: 0 !important; display: block !important; }
          #preview-section { display: block !important; width: 100% !important; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
