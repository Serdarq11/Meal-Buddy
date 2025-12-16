import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UtensilsCrossed, Mail, Lock, User, ArrowLeft, Eye, EyeOff, Sparkles, Heart, BookOpen } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading, signUp, signIn } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup');
  const [showPassword, setShowPassword] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: credentials, 2: profile info
  
  // Step 1 fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Step 2 fields (profile)
  const [nameAndMajor, setNameAndMajor] = useState(""); // "Name, Year, Major"
  const [vibe, setVibe] = useState(""); // "😊 feeling chill"
  const [bio, setBio] = useState(""); // max 10 words
  const [interests, setInterests] = useState(""); // "Interest 1 • Interest 2 • Interest 3"

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    if (isSignUp) {
      setStep(2); // Move to profile step
    } else {
      await handleSignIn();
    }
  };

  const handleSignIn = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error("Invalid email or password. Please try again.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Welcome back!");
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Parse name and major
      const nameParts = nameAndMajor.split(',').map(s => s.trim());
      const name = nameParts[0] || "";
      const department = nameParts.slice(1).join(', ') || "";
      
      // Parse interests
      const hobbiesArray = interests.split('•').map(s => s.trim()).filter(Boolean);

      const { error } = await signUp(email, password, name, isAnonymous);
      
      if (error) {
        if (error.message.includes('already registered')) {
          toast.error("This email is already registered. Please sign in instead.");
          setStep(1);
        } else {
          toast.error(error.message);
        }
      } else {
        // Update profile with additional fields after signup
        // Small delay to ensure user is created
        setTimeout(async () => {
          const { data: { user: newUser } } = await supabase.auth.getUser();
          if (newUser) {
            await supabase
              .from('profiles')
              .update({
                name: isAnonymous ? null : name,
                department: department,
                vibe: vibe,
                bio: bio,
                hobbies: hobbiesArray
              })
              .eq('id', newUser.id);
          }
        }, 500);
        
        toast.success("Account created! Welcome to MealBuddy!");
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
            {step === 2 ? (
              <button 
                onClick={() => setStep(1)} 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to home</span>
              </Link>
            )}
            
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">MealBuddy</span>
            </div>
            
            {/* Header */}
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {step === 2 ? "Tell us about you" : (isSignUp ? 'Create your account' : 'Welcome back')}
            </h1>
            <p className="text-muted-foreground mb-8">
              {step === 2 
                ? "Quick profile setup (you can edit this later)" 
                : (isSignUp 
                  ? 'Join the campus meal matching community' 
                  : 'Sign in to find your next meal buddy')}
            </p>
            
            {/* Step 1: Credentials */}
            {step === 1 && (
              <form className="space-y-5" onSubmit={handleCredentialsSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">University Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="you@metu.edu.tr" 
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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
                      Start as anonymous (reveal your identity later)
                    </label>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full gradient-warm text-primary-foreground shadow-warm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Please wait...' : (isSignUp ? 'Continue' : 'Sign In')}
                </Button>
              </form>
            )}

            {/* Step 2: Profile Info */}
            {step === 2 && (
              <form className="space-y-5" onSubmit={handleProfileSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="nameAndMajor">Name & Major</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="nameAndMajor" 
                      placeholder="Alex, 2nd Year, Computer Science"
                      className="pl-10"
                      value={nameAndMajor}
                      onChange={(e) => setNameAndMajor(e.target.value)}
                      disabled={isAnonymous}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vibe">Current Vibe</Label>
                  <div className="relative">
                    <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="vibe" 
                      placeholder="😊 feeling chill today"
                      className="pl-10"
                      value={vibe}
                      onChange={(e) => setVibe(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="bio" 
                      placeholder="Coffee addict who loves deep convos"
                      className="pl-10"
                      maxLength={60}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Keep it short & witty</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">Top 3 Interests</Label>
                  <div className="relative">
                    <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="interests" 
                      placeholder="Coffee • Movies • Music"
                      className="pl-10"
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Separate with •</p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full gradient-warm text-primary-foreground shadow-warm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  You can edit your profile anytime
                </p>
              </form>
            )}
            
            {/* Toggle */}
            {step === 1 && (
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
            )}
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
