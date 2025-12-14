import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { MapPin, Clock, Users, Eye, EyeOff, Shuffle, Search, Plus, Check } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useMatches } from "@/hooks/useMatches";

const locations = [
  { id: 1, name: "Cafeteria", users: 12, emoji: "🍽️" },
  { id: 2, name: "Çarşı", users: 8, emoji: "🏪" },
  { id: 3, name: "Physics Building", users: 5, emoji: "⚛️" },
  { id: 4, name: "Mathematics Building", users: 3, emoji: "📐" },
  { id: 5, name: "Susam Café", users: 7, emoji: "☕" },
  { id: 6, name: "Dorm 1 Café", users: 4, emoji: "🏠" },
  { id: 7, name: "Dorm 5 Café", users: 6, emoji: "🏠" },
  { id: 8, name: "Library Café", users: 9, emoji: "📚" },
  { id: 9, name: "Dorm 9 Café", users: 2, emoji: "🏠" },
];

const timeSlots = [
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { addMatchRequest } = useMatches();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [matchMode, setMatchMode] = useState<'random' | 'manual'>('random');
  const [isSearching, setIsSearching] = useState(false);

  const toggleTime = (time: string) => {
    setSelectedTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const handleFindBuddy = () => {
    if (!selectedLocation || selectedTimes.length === 0) return;
    
    const locationName = locations.find(l => l.id === selectedLocation)?.name;
    if (!locationName) return;
    
    setIsSearching(true);
    
    setTimeout(() => {
      setIsSearching(false);
      addMatchRequest(locationName, selectedTimes, isAnonymous, matchMode);
      // Reset selections
      setSelectedLocation(null);
      setSelectedTimes([]);
      // Navigate to matches page
      navigate('/matches');
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | MealBuddy</title>
        <meta name="description" content="Set your availability and find meal companions on campus." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Find a Meal Buddy</h1>
                <p className="text-muted-foreground">Set your location and time to find someone to eat with</p>
              </div>
              
              {/* Anonymous Toggle */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2">
                  {isAnonymous ? <EyeOff className="w-5 h-5 text-muted-foreground" /> : <Eye className="w-5 h-5 text-primary" />}
                  <span className="text-sm font-medium">{isAnonymous ? 'Anonymous Mode' : 'Visible Mode'}</span>
                </div>
                <Switch 
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                />
              </div>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Location Selection */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg gradient-warm flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Where do you want to eat?</h2>
                      <p className="text-sm text-muted-foreground">Select a campus location</p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {locations.map((location) => (
                      <button
                        key={location.id}
                        onClick={() => setSelectedLocation(location.id)}
                        className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                          selectedLocation === location.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/30 bg-background'
                        }`}
                      >
                        {selectedLocation === location.id && (
                          <div className="absolute top-2 right-2">
                            <Check className="w-5 h-5 text-primary" />
                          </div>
                        )}
                        <span className="text-2xl mb-2 block">{location.emoji}</span>
                        <h3 className="font-medium text-foreground">{location.name}</h3>
                        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                          <Users className="w-3.5 h-3.5" />
                          <span>{location.users} available</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Time Selection */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg gradient-warm flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">When are you available?</h2>
                      <p className="text-sm text-muted-foreground">Select one or more time slots</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => toggleTime(time)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedTimes.includes(time)
                            ? 'gradient-warm text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Match Mode */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg gradient-warm flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">How do you want to match?</h2>
                      <p className="text-sm text-muted-foreground">Choose your matching style</p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setMatchMode('random')}
                      className={`p-5 rounded-xl border-2 text-left transition-all ${
                        matchMode === 'random' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <Shuffle className={`w-6 h-6 mb-3 ${matchMode === 'random' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <h3 className="font-semibold text-foreground mb-1">Random Match</h3>
                      <p className="text-sm text-muted-foreground">
                        Get automatically paired with someone at the same time and place
                      </p>
                    </button>
                    
                    <button
                      onClick={() => setMatchMode('manual')}
                      className={`p-5 rounded-xl border-2 text-left transition-all ${
                        matchMode === 'manual' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <Search className={`w-6 h-6 mb-3 ${matchMode === 'manual' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <h3 className="font-semibold text-foreground mb-1">Manual Match</h3>
                      <p className="text-sm text-muted-foreground">
                        Browse available people and choose who you want to join
                      </p>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Summary Sidebar */}
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-card border border-border sticky top-24">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Your Selection</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium text-foreground">
                          {selectedLocation 
                            ? locations.find(l => l.id === selectedLocation)?.name 
                            : 'Not selected'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedTimes.length > 0 
                            ? selectedTimes.map(time => (
                                <Badge key={time} variant="secondary" className="text-xs">
                                  {time}
                                </Badge>
                              ))
                            : <p className="font-medium text-foreground">Not selected</p>
                          }
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Match Mode</p>
                        <p className="font-medium text-foreground capitalize">{matchMode}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      {isAnonymous ? <EyeOff className="w-5 h-5 text-muted-foreground mt-0.5" /> : <Eye className="w-5 h-5 text-primary mt-0.5" />}
                      <div>
                        <p className="text-sm text-muted-foreground">Visibility</p>
                        <p className="font-medium text-foreground">{isAnonymous ? 'Anonymous' : 'Visible'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full gradient-warm text-primary-foreground shadow-warm"
                    disabled={!selectedLocation || selectedTimes.length === 0 || isSearching}
                    onClick={handleFindBuddy}
                  >
                    {isSearching ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Find Meal Buddy
                      </>
                    )}
                  </Button>
                  
                  {(!selectedLocation || selectedTimes.length === 0) && (
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      Select a location and at least one time slot
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
