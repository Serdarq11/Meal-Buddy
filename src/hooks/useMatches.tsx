import { useState, createContext, useContext, ReactNode } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export interface MatchRequest {
  id: string;
  name: string;
  isAnonymous: boolean;
  location: string;
  time: string[];
  interests: string[];
  matchScore: number;
  department?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

interface MatchesContextType {
  pendingMatches: MatchRequest[];
  acceptedMatches: MatchRequest[];
  addMatchRequest: (location: string, times: string[], isAnonymous: boolean, matchMode: 'random' | 'manual') => void;
  acceptMatch: (id: string) => void;
  declineMatch: (id: string) => void;
}

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

// Generate random interests
const randomInterests = [
  ["Coffee Lover", "Study Breaks"],
  ["Music", "Gaming"],
  ["Reading", "Movies"],
  ["Sports", "Fitness"],
  ["Art", "Photography"],
  ["Food", "Cooking"],
];

const randomNames = [
  "Anonymous User",
  "Alex K.",
  "Elif Y.",
  "Mert S.",
  "Zeynep A.",
  "Can B.",
];

const departments = [
  // Mimarlık Fakültesi
  "Mimarlık", "Şehir ve Bölge Planlama", "Endüstriyel Tasarım",
  // Fen Edebiyat Fakültesi
  "Biyolojik Bilimler", "Kimya", "Tarih", "Matematik", "Felsefe", "Fizik", "Psikoloji", "Sosyoloji", "İstatistik",
  // İktisadi ve İdari Bilimler Fakültesi
  "İşletme", "İktisat", "Uluslararası İlişkiler", "Siyaset Bilimi ve Kamu Yönetimi",
  // Eğitim Fakültesi
  "Bilgisayar ve Öğretim Teknolojileri Eğitimi", "Eğitim Bilimleri", "Temel Eğitim", "Yabancı Diller Eğitimi", "Beden Eğitimi ve Spor", "Matematik ve Fen Bilimleri Eğitimi",
  // Mühendislik Fakültesi
  "Havacılık ve Uzay Mühendisliği", "Kimya Mühendisliği", "İnşaat Mühendisliği", "Bilgisayar Mühendisliği", "Elektrik ve Elektronik Mühendisliği", "Mühendislik Bilimleri", "Çevre Mühendisliği", "Gıda Mühendisliği", "Jeoloji Mühendisliği", "Endüstri Mühendisliği", "Makina Mühendisliği", "Metalurji ve Malzeme Mühendisliği", "Maden Mühendisliği", "Petrol ve Doğal Gaz Mühendisliği",
  // Enstitüler
  "Uygulamalı Matematik", "Enformatik", "Deniz Bilimleri", "Fen Bilimleri", "Sosyal Bilimler",
  // Meslek Yüksekokulu
  "Elektrik Programı", "Elektronik Teknolojisi", "Endüstriyel Elektronik", "Endüstriyel Otomasyon", "Gıda Teknolojisi", "Kaynak Teknolojisi", "Teknik Programlar",
  // Yabancı Diller Yüksekokulu
  "Temel İngilizce", "Modern Diller", "Yabancı Diller", "Akademik Yazı Merkezi",
  // Rektörlüğe Bağlı Bölümler
  "Türk Dili", "Müzik ve Güzel Sanatlar"
];

export const MatchesProvider = ({ children }: { children: ReactNode }) => {
  const [matches, setMatches] = useState<MatchRequest[]>([]);

  const addMatchRequest = (location: string, times: string[], isAnonymous: boolean, matchMode: 'random' | 'manual') => {
    const newMatch: MatchRequest = {
      id: crypto.randomUUID(),
      name: isAnonymous ? "Anonymous User" : randomNames[Math.floor(Math.random() * randomNames.length)],
      isAnonymous,
      location,
      time: times,
      interests: randomInterests[Math.floor(Math.random() * randomInterests.length)],
      matchScore: Math.floor(Math.random() * 30) + 70,
      department: !isAnonymous ? departments[Math.floor(Math.random() * departments.length)] : undefined,
      status: 'pending',
      createdAt: new Date(),
    };

    setMatches(prev => [newMatch, ...prev]);
    
    toast.success(`Match request created!`, {
      description: `Looking for a meal buddy at ${location} for ${times.join(', ')}`,
    });
  };

  const acceptMatch = (id: string) => {
    setMatches(prev => 
      prev.map(match => 
        match.id === id ? { ...match, status: 'accepted' as const } : match
      )
    );
    toast.success("Match accepted! 🎉", {
      description: "You can now chat with your meal buddy",
    });
  };

  const declineMatch = (id: string) => {
    setMatches(prev => prev.filter(match => match.id !== id));
    toast.info("Match declined", {
      description: "The match request has been removed",
    });
  };

  const pendingMatches = matches.filter(m => m.status === 'pending');
  const acceptedMatches = matches.filter(m => m.status === 'accepted');

  return (
    <MatchesContext.Provider value={{ 
      pendingMatches, 
      acceptedMatches, 
      addMatchRequest, 
      acceptMatch, 
      declineMatch 
    }}>
      {children}
    </MatchesContext.Provider>
  );
};

export const useMatches = () => {
  const context = useContext(MatchesContext);
  if (context === undefined) {
    throw new Error('useMatches must be used within a MatchesProvider');
  }
  return context;
};
