import { useState, createContext, useContext, ReactNode } from 'react';
import { toast } from 'sonner';

export interface MatchRequest {
  id: string;
  name: string;
  isAnonymous: boolean;
  location: string;
  time: string[];
  interests: string[];
  matchScore: number;
  department?: string;
  bio?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

export interface ManualMatchOption {
  id: string;
  name: string;
  isAnonymous: boolean;
  location: string;
  time: string[];
  interests: string[];
  matchScore: number;
  department?: string;
  bio?: string;
}

interface MatchesContextType {
  pendingMatches: MatchRequest[];
  acceptedMatches: MatchRequest[];
  manualMatchOptions: ManualMatchOption[];
  isSelectingManual: boolean;
  addMatchRequest: (location: string, times: string[], isAnonymous: boolean, matchMode: 'random' | 'manual') => void;
  acceptMatch: (id: string) => void;
  declineMatch: (id: string) => void;
  selectManualMatch: (option: ManualMatchOption) => void;
  cancelManualSelection: () => void;
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
  ["Tech", "Coding"],
  ["Travel", "Languages"],
];

const randomNames = [
  "Anonymous User",
  "Alex K.",
  "Elif Y.",
  "Mert S.",
  "Zeynep A.",
  "Can B.",
  "Ayşe D.",
  "Emre T.",
  "Selin Ö.",
  "Burak C.",
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

const bios = [
  "Chill vibes only ☕",
  "Always hungry, never on time 🍕",
  "Coffee addict, chaos coordinator",
  "Looking for study buddies and snacks",
  "Foodie at heart, broke in wallet",
  "New here, let's grab döner!",
  "Surviving on caffeine and hope",
  "Will talk about cats forever 🐱",
  "Midterm season = stress eating",
  "Send memes, not lectures",
  "Pro napper, amateur student",
  "Here for the free wifi honestly",
  "Netflix breaks between classes 📺",
  "Existential crisis but make it fun",
  "Just vibing through finals week",
  "Tea over coffee, fight me",
  "Bookworm seeking lunch buddy",
  "Gym? I thought you said çay 🍵",
  "Deadline? What deadline?",
  "Living for Friday vibes only",
];

export const MatchesProvider = ({ children }: { children: ReactNode }) => {
  const [matches, setMatches] = useState<MatchRequest[]>([]);
  const [manualMatchOptions, setManualMatchOptions] = useState<ManualMatchOption[]>([]);
  const [isSelectingManual, setIsSelectingManual] = useState(false);
  const [pendingManualRequest, setPendingManualRequest] = useState<{location: string; times: string[]; isAnonymous: boolean} | null>(null);

  const generateManualOptions = (location: string, times: string[]): ManualMatchOption[] => {
    const options: ManualMatchOption[] = [];
    const usedNames = new Set<string>();
    
    for (let i = 0; i < 6; i++) {
      let name: string;
      do {
        name = randomNames[Math.floor(Math.random() * (randomNames.length - 1)) + 1]; // Skip "Anonymous User"
      } while (usedNames.has(name) && usedNames.size < randomNames.length - 1);
      usedNames.add(name);
      
      const isAnon = Math.random() > 0.7;
      
      options.push({
        id: crypto.randomUUID(),
        name: isAnon ? "Anonymous User" : name,
        isAnonymous: isAnon,
        location,
        time: times,
        interests: randomInterests[Math.floor(Math.random() * randomInterests.length)],
        matchScore: Math.floor(Math.random() * 25) + 75,
        department: !isAnon ? departments[Math.floor(Math.random() * departments.length)] : undefined,
        bio: bios[Math.floor(Math.random() * bios.length)],
      });
    }
    
    return options.sort((a, b) => b.matchScore - a.matchScore);
  };

  const addMatchRequest = (location: string, times: string[], isAnonymous: boolean, matchMode: 'random' | 'manual') => {
    if (matchMode === 'manual') {
      // Generate options for manual selection
      const options = generateManualOptions(location, times);
      setManualMatchOptions(options);
      setIsSelectingManual(true);
      setPendingManualRequest({ location, times, isAnonymous });
      
      toast.info(`Found ${options.length} potential buddies!`, {
        description: `Choose who you'd like to meet at ${location}`,
      });
    } else {
      // Random match - create immediately
      const newMatch: MatchRequest = {
        id: crypto.randomUUID(),
        name: isAnonymous ? "Anonymous User" : randomNames[Math.floor(Math.random() * (randomNames.length - 1)) + 1],
        isAnonymous,
        location,
        time: times,
        interests: randomInterests[Math.floor(Math.random() * randomInterests.length)],
        matchScore: Math.floor(Math.random() * 30) + 70,
        department: !isAnonymous ? departments[Math.floor(Math.random() * departments.length)] : undefined,
        bio: bios[Math.floor(Math.random() * bios.length)],
        status: 'pending',
        createdAt: new Date(),
      };

      setMatches(prev => [newMatch, ...prev]);
      
      toast.success(`Match request created!`, {
        description: `Looking for a meal buddy at ${location} for ${times.join(', ')}`,
      });
    }
  };

  const selectManualMatch = (option: ManualMatchOption) => {
    const newMatch: MatchRequest = {
      id: option.id,
      name: option.name,
      isAnonymous: option.isAnonymous,
      location: option.location,
      time: option.time,
      interests: option.interests,
      matchScore: option.matchScore,
      department: option.department,
      bio: option.bio,
      status: 'pending',
      createdAt: new Date(),
    };

    setMatches(prev => [newMatch, ...prev]);
    setManualMatchOptions([]);
    setIsSelectingManual(false);
    setPendingManualRequest(null);
    
    toast.success(`Match request sent to ${option.name}!`, {
      description: "They'll appear in your pending matches",
    });
  };

  const cancelManualSelection = () => {
    setManualMatchOptions([]);
    setIsSelectingManual(false);
    setPendingManualRequest(null);
    toast.info("Selection cancelled");
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
      manualMatchOptions,
      isSelectingManual,
      addMatchRequest, 
      acceptMatch, 
      declineMatch,
      selectManualMatch,
      cancelManualSelection,
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
