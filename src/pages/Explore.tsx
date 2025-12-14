import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Users, Clock, Search, TrendingUp } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useMatches } from "@/hooks/useMatches";
import { toast } from "sonner";

const locations = [
  { id: 1, name: "Cafeteria", users: 12, trending: true, emoji: "🍽️", description: "Main campus dining hall" },
  { id: 2, name: "Çarşı", users: 8, trending: true, emoji: "🏪", description: "Student marketplace area" },
  { id: 3, name: "Physics Building Café", users: 5, trending: false, emoji: "⚛️", description: "Quiet spot near labs" },
  { id: 4, name: "Mathematics Building", users: 3, trending: false, emoji: "📐", description: "Quick bites between classes" },
  { id: 5, name: "Susam Café", users: 7, trending: true, emoji: "☕", description: "Best coffee on campus" },
  { id: 6, name: "Dorm 1 Café", users: 4, trending: false, emoji: "🏠", description: "Cozy dormitory café" },
  { id: 7, name: "Dorm 5 Café", users: 6, trending: false, emoji: "🏠", description: "Popular evening spot" },
  { id: 8, name: "Library Café", users: 9, trending: true, emoji: "📚", description: "Study break favorite" },
  { id: 9, name: "Dorm 9 Café", users: 2, trending: false, emoji: "🏠", description: "Quiet and peaceful" },
  { id: 10, name: "Engineering Canteen", users: 11, trending: true, emoji: "⚙️", description: "Engineers' hangout" },
  { id: 11, name: "Sports Complex Café", users: 3, trending: false, emoji: "🏃", description: "Post-workout fuel" },
  { id: 12, name: "Art Building Café", users: 4, trending: false, emoji: "🎨", description: "Creative atmosphere" },
];

const upcomingMeetups = [
  { id: 101, location: "Cafeteria", time: "12:30", people: 3, spotsLeft: 1 },
  { id: 102, location: "Susam Café", time: "13:00", people: 2, spotsLeft: 2 },
  { id: 103, location: "Library Café", time: "14:00", people: 2, spotsLeft: 2 },
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { addMatchRequest } = useMatches();
  
  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const trendingLocations = locations.filter(l => l.trending);

  const handleJoinLocation = (locationName: string) => {
    addMatchRequest(locationName, ["Now"], false, "random");
    toast.success(`Joining ${locationName}!`, {
      description: "Finding a meal buddy for you..."
    });
    navigate("/matches");
  };

  const handleJoinMeetup = (meetup: typeof upcomingMeetups[0]) => {
    addMatchRequest(meetup.location, [meetup.time], false, "random");
    toast.success(`Joined meetup at ${meetup.location}!`, {
      description: `You'll meet at ${meetup.time}`
    });
    navigate("/matches");
  };

  return (
    <>
      <Helmet>
        <title>Explore Campus Locations | MealBuddy</title>
        <meta name="description" content="Discover popular campus dining spots and see who's available for meals." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Explore Campus</h1>
              <p className="text-muted-foreground">Discover where students are eating and find your next meal buddy</p>
            </div>
            
            {/* Search */}
            <div className="relative max-w-md mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search locations..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Locations Grid */}
              <div className="lg:col-span-2">
                {/* Trending Section */}
                {!searchQuery && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">Trending Now</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {trendingLocations.slice(0, 4).map((location) => (
                        <div 
                          key={location.id}
                          className="group p-5 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-soft transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-3xl">{location.emoji}</span>
                            <Badge className="gradient-warm text-primary-foreground border-0 text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Hot
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                            {location.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">{location.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-primary">
                              <Users className="w-4 h-4" />
                              <span className="text-sm font-medium">{location.users} available</span>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => handleJoinLocation(location.name)}
                              className="gradient-warm text-primary-foreground"
                            >
                              Join
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* All Locations */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {searchQuery ? 'Search Results' : 'All Locations'}
                  </h2>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredLocations.map((location) => (
                      <div 
                        key={location.id}
                        className="group p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-soft transition-all"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{location.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                              {location.name}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Users className="w-3.5 h-3.5" />
                              <span>{location.users} available</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-full"
                          onClick={() => handleJoinLocation(location.name)}
                        >
                          Join Others
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  {filteredLocations.length === 0 && (
                    <div className="text-center py-12">
                      <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">No locations found</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Sidebar - Upcoming Meetups */}
              <div>
                <div className="p-6 rounded-2xl bg-card border border-border sticky top-24">
                  <div className="flex items-center gap-2 mb-5">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Happening Soon</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {upcomingMeetups.map((meetup) => (
                      <div 
                        key={meetup.id}
                        className="p-4 rounded-xl bg-background border border-border hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground">{meetup.location}</h4>
                          <Badge variant="outline" className="text-xs">
                            {meetup.spotsLeft} {meetup.spotsLeft === 1 ? 'spot' : 'spots'} left
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{meetup.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            <span>{meetup.people} joined</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full gradient-warm text-primary-foreground"
                          onClick={() => handleJoinMeetup(meetup)}
                        >
                          Join Meetup
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Click any location or meetup to join!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Explore;
