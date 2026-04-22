
import React from 'react';
import { GroundingSource, SchoolHeaderData } from '../types';

interface MinutesPreviewProps {
  content: string;
  sources?: GroundingSource[];
  header: SchoolHeaderData;
  onCopy: () => void;
  onReset: () => void;
}

const MinutesPreview: React.FC<MinutesPreviewProps> = ({ content, sources, header, onCopy, onReset }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Action Buttons */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 flex justify-between items-center no-print">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <i className="fas fa-file-alt text-amber-500"></i> Pratinjau Dokumen
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={onCopy}
            className="p-2 px-4 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-sm font-semibold flex items-center gap-2 transition"
            title="Salin Teks"
          >
            <i className="fas fa-copy"></i> Salin
          </button>
          <button 
            onClick={() => window.print()}
            className="p-2 px-4 bg-slate-900 hover:bg-slate-800 rounded-lg text-white text-sm font-semibold flex items-center gap-2 transition shadow-md"
          >
            <i className="fas fa-print"></i> Cetak Dokumen
          </button>
          <button 
            onClick={onReset}
            className="p-2 px-4 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 text-sm font-semibold flex items-center gap-2 transition"
          >
            <i className="fas fa-trash-alt"></i> Batal
          </button>
        </div>
      </div>

      {/* The "Paper" */}
      <div className="bg-white shadow-2xl border border-slate-200 mx-auto w-full max-w-[210mm] min-h-[297mm] p-[10mm] sm:p-[20mm] md:p-[25mm] flex flex-col print:shadow-none print:border-none print:m-0 print:p-0">
        
        {/* School Letterhead (Kop Surat) */}
        <div className="border-b-4 border-double border-slate-900 pb-4 mb-8 flex items-center justify-between gap-4">
          {/* Left Logo - Kabupaten */}
          <div className="w-24 h-24 flex items-center justify-center flex-shrink-0">
            {header.logoKabupaten ? (
              <img src={header.logoKabupaten} alt="Logo Kabupaten" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center border-2 border-slate-200">
                <i className="fas fa-landmark text-2xl text-slate-400"></i>
              </div>
            )}
          </div>

          <div className="text-center flex-grow">
            <h1 className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-900 leading-tight">{header.government}</h1>
            <h2 className="text-lg sm:text-xl font-bold uppercase text-slate-900 leading-tight">{header.department}</h2>
            <h3 className="text-xl sm:text-2xl font-bold uppercase text-slate-900 leading-tight">{header.schoolName || 'NAMA SEKOLAH'}</h3>
            <p className="text-[10pt] text-slate-700 font-medium mt-1 uppercase leading-snug">{header.address || 'Alamat Sekolah Belum Diisi'}</p>
          </div>

          {/* Right Logo - Sekolah */}
          <div className="w-24 h-24 flex items-center justify-center flex-shrink-0">
            {header.logoSekolah ? (
              <img src={header.logoSekolah} alt="Logo Sekolah" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center border-2 border-slate-200">
                <i className="fas fa-school text-2xl text-slate-400"></i>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow whitespace-pre-wrap font-serif text-[12pt] text-slate-900 leading-[1.6] text-justify mb-10">
          {content}
        </div>

        {/* Sources / Grounding Section */}
        {sources && sources.length > 0 && (
          <div className="mt-10 pt-6 border-t-2 border-slate-200">
            <h4 className="text-[11pt] font-bold uppercase mb-3 text-slate-800">Referensi Dan Sumber Informasi (Google Search):</h4>
            <div className="space-y-2">
              {sources.map((source, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-[10pt] font-semibold text-slate-700">{index + 1}. {source.title}</span>
                  <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-[9pt] text-blue-600 hover:underline italic truncate">
                    {source.uri}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer info for preview only */}
        <div className="mt-10 pt-8 border-t border-slate-100 text-center text-slate-400 text-[10pt] italic no-print">
          Dokumen ini diproses secara otomatis oleh Sistem Sekretaris Ahli dengan dukungan Google Search.
        </div>
      </div>
    </div>
  );
};

export default MinutesPreview;
