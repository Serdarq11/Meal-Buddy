import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Clock, MessageCircle, Star, Users, EyeOff, Check, X, ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useMatches, ManualMatchOption } from "@/hooks/useMatches";

const Matches = () => {
  const navigate = useNavigate();
  const { 
    pendingMatches, 
    acceptedMatches, 
    manualMatchOptions,
    isSelectingManual,
    acceptMatch, 
    declineMatch,
    selectManualMatch,
    cancelManualSelection,
  } = useMatches();
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted'>('pending');

  const handleAccept = (id: string) => {
    acceptMatch(id);
    setActiveTab('accepted');
  };

  const handleDecline = (id: string) => {
    declineMatch(id);
  };

  const handleStartChat = (match: typeof acceptedMatches[0]) => {
    navigate('/messages', { 
      state: { 
        matchId: match.id, 
        matchName: match.name,
        isAnonymous: match.isAnonymous 
      } 
    });
  };

  const handleSelectOption = (option: ManualMatchOption) => {
    selectManualMatch(option);
  };

  // Manual selection view
  if (isSelectingManual && manualMatchOptions.length > 0) {
    return (
      <>
        <Helmet>
          <title>Choose Your Buddy | MealBuddy</title>
          <meta name="description" content="Choose who you want to meet for your meal." />
        </Helmet>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="pt-20 pb-12">
            <div className="container mx-auto px-6 max-w-4xl">
              {/* Header */}
              <div className="mb-8">
                <Button 
                  variant="ghost" 
                  className="mb-4 -ml-2"
                  onClick={cancelManualSelection}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <h1 className="text-3xl font-bold text-foreground mb-2">Choose Your Buddy</h1>
                <p className="text-muted-foreground">
                  {manualMatchOptions.length} people available at {manualMatchOptions[0]?.location} • {manualMatchOptions[0]?.time.join(', ')}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {manualMatchOptions.map((option) => (
                  <div 
                    key={option.id} 
                    className="p-5 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-soft transition-all"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-14 h-14">
                        <AvatarFallback className="gradient-warm text-primary-foreground text-lg">
                          {option.isAnonymous ? <EyeOff className="w-6 h-6" /> : option.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{option.name}</h3>
                          {option.isAnonymous && (
                            <Badge variant="secondary" className="text-xs">Anonymous</Badge>
                          )}
                        </div>
                        {!option.isAnonymous && option.department && (
                          <p className="text-sm text-muted-foreground">{option.department}</p>
                        )}
                        {option.bio && (
                          <p className="text-sm text-muted-foreground mt-1 italic">"{option.bio}"</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                        <Star className="w-3.5 h-3.5 text-primary" />
                        <span className="text-sm font-medium text-primary">{option.matchScore}%</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {option.interests.map((interest, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>

                    <Button 
                      className="w-full gradient-warm text-primary-foreground"
                      onClick={() => handleSelectOption(option)}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Choose {option.isAnonymous ? "Anonymous" : option.name.split(' ')[0]}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Matches | MealBuddy</title>
        <meta name="description" content="View and manage your meal buddy matches and chats." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-6 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">My Matches</h1>
              <p className="text-muted-foreground">Manage your pending matches and accepted meal buddies</p>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'pending' 
                    ? 'gradient-warm text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                Pending ({pendingMatches.length})
              </button>
              <button
                onClick={() => setActiveTab('accepted')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'accepted' 
                    ? 'gradient-warm text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                Accepted ({acceptedMatches.length})
                {acceptedMatches.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                )}
              </button>
            </div>
            
            {/* Content */}
            {activeTab === 'pending' ? (
              <div className="space-y-4">
                {pendingMatches.map((match) => (
                  <div key={match.id} className="p-6 rounded-2xl bg-card border border-border">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-14 h-14">
                          <AvatarFallback className="gradient-warm text-primary-foreground text-lg">
                            {match.isAnonymous ? <EyeOff className="w-6 h-6" /> : match.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{match.name}</h3>
                            {match.isAnonymous && (
                              <Badge variant="secondary" className="text-xs">Anonymous</Badge>
                            )}
                          </div>
                          {!match.isAnonymous && match.department && (
                            <p className="text-sm text-muted-foreground">{match.department}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">{match.matchScore}%</span>
                        <span className="text-sm text-muted-foreground">match</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{match.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{Array.isArray(match.time) ? match.time.join(', ') : match.time}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-5">
                      {match.interests.map((interest, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 gradient-warm text-primary-foreground"
                        onClick={() => handleAccept(match.id)}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleDecline(match.id)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
                
                {pendingMatches.length === 0 && (
                  <div className="text-center py-16">
                    <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No pending matches</h3>
                    <p className="text-muted-foreground mb-4">Set your availability to get matched with other students</p>
                    <Button onClick={() => navigate('/dashboard')} className="gradient-warm text-primary-foreground">
                      Find Meal Buddy
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {acceptedMatches.map((match) => (
                  <div 
                    key={match.id} 
                    className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="w-14 h-14">
                            <AvatarFallback className="gradient-warm text-primary-foreground text-lg">
                              {match.isAnonymous ? <EyeOff className="w-6 h-6" /> : match.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-card flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{match.name}</h3>
                            {match.isAnonymous && (
                              <Badge variant="secondary" className="text-xs">Anonymous</Badge>
                            )}
                            <Badge className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                              Accepted
                            </Badge>
                          </div>
                          {!match.isAnonymous && match.department && (
                            <p className="text-sm text-muted-foreground">{match.department}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{match.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{Array.isArray(match.time) ? match.time.join(', ') : match.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border">
                      <Button 
                        className="w-full gradient-warm text-primary-foreground"
                        onClick={() => handleStartChat(match)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Start Chatting
                      </Button>
                    </div>
                  </div>
                ))}
                
                {acceptedMatches.length === 0 && (
                  <div className="text-center py-16">
                    <MessageCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No accepted matches yet</h3>
                    <p className="text-muted-foreground">Accept a pending match to start chatting</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Matches;
