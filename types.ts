
export interface GroundingSource {
  title: string;
  uri: string;
}

export interface SchoolHeaderData {
  government: string;
  department: string;
  schoolName: string;
  address: string;
  logoKabupaten?: string; // Base64 string
  logoSekolah?: string;    // Base64 string
}

export interface MeetingData {
  title: string;
  date: string;
  time: string;
  location: string;
  leadBy: string;
  participants: string;
  agenda: string;
  discussionPoints: string;
  decisions: string;
  nextSteps: string;
  header: SchoolHeaderData;
}

export interface GeneratedMinutes {
  text: string;
  sources?: GroundingSource[];
}

export enum MeetingType {
  GURU = 'Rapat Dewan Guru',
  KOMITE = 'Rapat Komite Sekolah',
  KOORDINASI = 'Rapat Koordinasi Pimpinan',
  PLENO = 'Rapat Pleno Orang Tua',
  EVALUASI = 'Rapat Evaluasi Bulanan',
  PENGAWAS = 'Rapat Koordinasi dengan Pengawas Bina'
}
