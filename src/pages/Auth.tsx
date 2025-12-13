import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UtensilsCrossed, Mail, Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Helmet } from "react-helmet-async";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup');
  const [showPassword, setShowPassword] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  return (
    <>
      <Helmet>
        <title>{isSignUp ? 'Sign Up' : 'Sign In'} | MealBuddy</title>
        <meta name="description" content="Join MealBuddy to find meal companions on your campus." />
      </Helmet>
      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12">
          <div className="max-w-md mx-auto w-full">
            {/* Back Link */}
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to home</span>
            </Link>
            
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">MealBuddy</span>
            </div>
            
            {/* Header */}
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-muted-foreground mb-8">
              {isSignUp 
                ? 'Join the campus meal matching community' 
                : 'Sign in to find your next meal buddy'}
            </p>
            
            {/* Form */}
            <form className="space-y-5">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name (optional)</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="name" 
                      placeholder="Your name" 
                      className="pl-10"
                      disabled={isAnonymous}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">University Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@metu.edu.tr" 
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Use your @metu.edu.tr email for verified status
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    className="pl-10 pr-10"
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              {isSignUp && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="anonymous" 
                    checked={isAnonymous}
                    onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                  />
                  <label 
                    htmlFor="anonymous" 
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Start as anonymous (you can reveal your identity later)
                  </label>
                </div>
              )}
              
              <Button type="submit" className="w-full gradient-warm text-primary-foreground shadow-warm">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </form>
            
            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            {/* Guest Mode */}
            <Button variant="outline" className="w-full">
              Continue as Guest
            </Button>
            
            {/* Toggle */}
            <p className="text-center text-sm text-muted-foreground mt-8">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                type="button"
                className="text-primary hover:underline font-medium"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
        
        {/* Right Side - Illustration */}
        <div className="hidden lg:flex flex-1 gradient-warm items-center justify-center p-16">
          <div className="max-w-lg text-center text-primary-foreground">
            <div className="w-32 h-32 rounded-full bg-primary-foreground/20 mx-auto mb-8 flex items-center justify-center">
              <UtensilsCrossed className="w-16 h-16" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Make Mealtime Social
            </h2>
            <p className="text-lg opacity-90">
              Join a community of students who believe that the best meals are shared. 
              Connect, chat, and create memories over campus food.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
