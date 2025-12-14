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
      department: !isAnonymous ? "Computer Engineering" : undefined,
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
