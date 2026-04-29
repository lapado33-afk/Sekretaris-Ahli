
import { GoogleGenAI } from "@google/genai";
import { MeetingData, GeneratedMinutes, GroundingSource } from "../types";

const getAIInstance = (customKey?: string) => {
  const key = customKey || process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  if (!key) {
    throw new Error("API Key tidak ditemukan. Silakan masukkan API Key Anda di menu Pengaturan (klik ikon gir di pojok kanan atas).");
  }
  return new GoogleGenAI({ apiKey: key });
};

export const generateProfessionalMinutes = async (data: MeetingData, apiKey?: string): Promise<GeneratedMinutes> => {
  let ai;
  try {
    ai = getAIInstance(apiKey);
  } catch (err: any) {
    throw new Error(err.message);
  }
  
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
       - RISALAH PEMBAHASAN (Wajib menguraikan setiap poin diskusi menjadi ringkasan narasi yang informatif, bukan hanya menulis ulang poinnya. Gunakan penomoran 1, 2, 3)
       - KEPUTUSAN RAPAT
       - RENCANA TINDAK LANJUT
       - PENUTUP
    5. Di bagian akhir, sediakan tempat tanda tangan yang rapi untuk Notulis (kiri) dan Mengetahui: Kepala Sekolah (kanan).
    6. Gunakan Bahasa Indonesia yang sangat baku, sopan, dan profesional (PUEBI).
    7. Hasil harus bersih dari karakter teknis markdown sehingga bisa langsung di-copy ke Word atau dicetak.
    8. KHUSUS BAGIAN DISKUSI: Ubah setiap input poin diskusi yang singkat menjadi ringkasan yang mencakup inti pembicaraan/perdebatan/masukan dari peserta rapat agar notulen terasa lebih profesional dan mendalam.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        temperature: 0.4,
        topP: 0.95,
        tools: [{ googleSearch: {} }] as any,
      },
    });

    const text = response.text?.() || response.text || "Maaf, AI tidak memberikan respon teks.";
    
    // Ekstraksi sumber grounding jika ada
    const sources: GroundingSource[] = [];
    const groundingMetadata = (response.candidates?.[0] as any)?.groundingMetadata;
    const chunks = groundingMetadata?.groundingChunks || [];
    
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
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Specific error handling
    const errorMessage = error?.message || "";
    if (errorMessage.includes("API_KEY_INVALID")) {
      throw new Error("API Key yang Anda masukkan tidak valid. Silakan periksa kembali di menu Pengaturan.");
    } else if (errorMessage.includes("quota exceeded") || errorMessage.includes("429")) {
      throw new Error("Batas penggunaan (Quota) API Anda telah habis. Silakan coba lagi nanti atau gunakan API Key lain.");
    } else if (errorMessage.includes("safety")) {
      throw new Error("Konten diblokir oleh filter keamanan AI. Harap sesuaikan isi data rapat Anda.");
    }
    
    throw new Error(`Gagal menghubungi layanan AI: ${errorMessage || "Kesalahan tidak dikenal"}`);
  }
};

export const suggestNextSteps = async (data: Partial<MeetingData>, apiKey?: string): Promise<string> => {
  let ai;
  try {
    ai = getAIInstance(apiKey);
  } catch (err: any) {
    console.error("AI Instance Error:", err.message);
    return ""; // Silent fail for suggestions or return error message
  }

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
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });
    return response.text?.() || response.text?.trim() || "";
  } catch (error) {
    console.error("Suggestion Error:", error);
    return "";
  }
};
