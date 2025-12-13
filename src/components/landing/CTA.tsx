import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-warm opacity-10" />
      <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-accent/20 blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Find Your Meal Buddy?
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Join hundreds of students who are already making mealtime more fun. 
            Sign up now and never eat alone again.
          </p>
          <Link to="/auth">
            <Button size="lg" className="gradient-warm text-primary-foreground shadow-warm hover:opacity-90 transition-all text-lg px-10 py-6">
              Join Now — It's Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
