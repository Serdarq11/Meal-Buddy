import { Button } from "@/components/ui/button";
import { ArrowRight, Users, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 gradient-soft" />
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Find your meal buddy on campus</span>
          </div>
          
          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Never Eat{" "}
            <span className="text-primary relative">
              Alone
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C50 2 150 2 198 10" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
            {" "}Again
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with fellow students for meals at your favorite campus spots. 
            Make new friends, share conversations, and turn lunch breaks into memorable moments.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/auth">
              <Button size="lg" className="gradient-warm text-primary-foreground shadow-warm hover:opacity-90 transition-all text-lg px-8 py-6">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/explore">
              <Button size="lg" variant="outline" className="border-2 border-primary/20 hover:bg-primary/5 text-lg px-8 py-6">
                Explore Locations
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">500+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">15+</div>
              <div className="text-sm text-muted-foreground">Campus Spots</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">2min</div>
              <div className="text-sm text-muted-foreground">Avg Match Time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
