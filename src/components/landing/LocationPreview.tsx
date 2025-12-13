import { MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const locations = [
  { name: "Cafeteria", users: 12, popular: true },
  { name: "Çarşı", users: 8, popular: true },
  { name: "Physics Building", users: 5, popular: false },
  { name: "Mathematics Building", users: 3, popular: false },
  { name: "Susam Café", users: 7, popular: true },
  { name: "Dorm 1 Café", users: 4, popular: false },
  { name: "Dorm 5 Café", users: 6, popular: false },
  { name: "Library Café", users: 9, popular: true },
];

export const LocationPreview = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Popular Campus Spots
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See where students are meeting up right now and join them!
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {locations.map((location, index) => (
            <div 
              key={index}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-soft transition-all duration-300 cursor-pointer"
            >
              {location.popular && (
                <Badge className="absolute -top-2 -right-2 gradient-warm text-primary-foreground border-0">
                  Popular
                </Badge>
              )}
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">{location.users}</span>
                </div>
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {location.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {location.users} {location.users === 1 ? 'person' : 'people'} available
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
