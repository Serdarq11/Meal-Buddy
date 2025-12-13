import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { LocationPreview } from "@/components/landing/LocationPreview";
import { CTA } from "@/components/landing/CTA";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>MealBuddy - Find Your Campus Meal Companion</title>
        <meta name="description" content="Connect with fellow university students for meals at campus locations. Make new friends and never eat alone again." />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-16">
          <Hero />
          <Features />
          <LocationPreview />
          <CTA />
        </main>
      </div>
    </>
  );
};

export default Index;
