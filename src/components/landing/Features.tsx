import { MapPin, Clock, Users, Shield, MessageCircle, Star } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Campus Locations",
    description: "Choose from popular spots like Cafeteria, Çarşı, Physics, Mathematics, and more."
  },
  {
    icon: Clock,
    title: "Time-Based Matching",
    description: "Set when you're free and get matched with students available at the same time."
  },
  {
    icon: Users,
    title: "Small Groups",
    description: "Meet in comfortable groups of 2-4 people for low-pressure social meals."
  },
  {
    icon: Shield,
    title: "Anonymous Option",
    description: "Chat anonymously first and reveal your identity when you feel comfortable."
  },
  {
    icon: MessageCircle,
    title: "Icebreaker Chat",
    description: "Built-in conversation starters to make that first chat easier."
  },
  {
    icon: Star,
    title: "Ratings & Badges",
    description: "Earn badges for positive meetups and build your campus reputation."
  }
];

export const Features = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, safe, and designed for university students who want to make mealtime more social.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-warm transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl gradient-warm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
