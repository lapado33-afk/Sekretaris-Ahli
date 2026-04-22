
import { GoogleGenAI } from "@google/genai";
import { MeetingData, GeneratedMinutes, GroundingSource } from "../types";

const getAIInstance = (customKey?: string) => {
  const key = customKey || process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  return new GoogleGenAI({ apiKey: key });
};

export const generateProfessionalMinutes = async (data: MeetingData, apiKey?: string): Promise<GeneratedMinutes> => {
  const ai = getAIInstance(apiKey);
  
  const prompt = `
    Sebagai Sekretaris Ahli Kepala Sekolah, susunlah Notulen Rapat yang sangat formal, berwibawa, dan kaya informasi berdasarkan data di bawah ini.
    Gunakan bantuan pencarian Google jika ada agenda yang merujuk pada regulasi pendidikan, kurikulum merdeka, atau standar nasional pendidikan terbaru untuk memberikan konteks yang akurat.

    DATA RAPAT:
    JUDUL: ${data.title}
    HARI/TANGGAL: ${data.date}
    WAKTU: ${data.time}
    TEMPAT: ${data.location}
    PIMPINAN: ${data.leadBy}
    PESERTA: ${data.participants}
    AGENDA: ${data.agenda}
    DISKUSI: ${data.discussionPoints}
    KEPUTUSAN: ${data.decisions}
    TINDAK LANJUT: ${data.nextSteps}

    INSTRUKSI KETAT FORMAT (WAJIB DIPATUHI):
    1. JANGAN gunakan simbol bintang (*) atau double bintang (**) untuk penebalan atau daftar.
    2. Gunakan PENULISAN HURUF KAPITAL untuk Judul dan Nama Bagian agar terlihat formal tanpa perlu simbol markdown.
    3. Untuk daftar/list, gunakan penomoran angka (1, 2, 3...) atau huruf (a, b, c...). JANGAN gunakan bullet points.
    4. Struktur harus mengikuti standar administrasi sekolah:
       - JUDUL NOTULEN (KAPITAL)
       - IDENTITAS RAPAT (Hari, Tanggal, Waktu, Tempat, Pimpinan)
       - DAFTAR HADIR (Narasi singkat)
       - AGENDA RAPAT
       - RISALAH PEMBAHASAN (Gunakan poin 1, 2, 3)
       - KEPUTUSAN RAPAT
       - RENCANA TINDAK LANJUT
       - PENUTUP
    5. Di bagian akhir, sediakan tempat tanda tangan yang rapi untuk Notulis (kiri) dan Mengetahui: Kepala Sekolah (kanan).
    6. Gunakan Bahasa Indonesia yang sangat baku, sopan, dan profesional (PUEBI).
    7. Hasil harus bersih dari karakter teknis markdown sehingga bisa langsung di-copy ke Word atau dicetak.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.4,
        topP: 0.95,
        tools: [{ googleSearch: {} }] as any,
      },
    });

    const text = response.text || "Maaf, terjadi kesalahan saat menyusun notulen.";
    
    // Ekstraksi sumber grounding jika ada
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    chunks.forEach((chunk: any) => {
      if (chunk.web && chunk.web.uri && chunk.web.title) {
        sources.push({
          title: chunk.web.title,
          uri: chunk.web.uri
        });
      }
    });

    return { 
      text, 
      sources: sources.length > 0 ? sources : undefined 
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Gagal menghubungi layanan AI. Silakan coba lagi.");
  }
};

export const suggestNextSteps = async (data: Partial<MeetingData>, apiKey?: string): Promise<string> => {
  const ai = getAIInstance(apiKey);
  const prompt = `
    Berdasarkan data rapat berikut, berikan saran 3-5 poin rencana tindak lanjut (action plans) yang konkret dan profesional.
    
    AGENDA: ${data.agenda}
    DISKUSI: ${data.discussionPoints}
    KEPUTUSAN: ${data.decisions}
    
    INSTRUKSI:
    - Gunakan penomoran angka (1, 2, 3...).
    - JANGAN gunakan simbol bintang (*).
    - Bahasa formal dan langsung pada inti aksi (Misal: "Menyusun jadwal...", "Mendistribusikan berkas...").
    - Berikan hanya poin-poinnya saja.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Suggestion Error:", error);
    return "";
  }
};
