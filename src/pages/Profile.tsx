import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Pencil, Check, X } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";

interface ProfileData {
  name: string;
  department: string;
  vibe: string;
  bio: string;
  hobbies: string[];
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    department: "",
    vibe: "",
    bio: "",
    hobbies: []
  });
  
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('name, department, vibe, bio, hobbies')
        .eq('id', user.id)
        .single();
      
      if (data && !error) {
        setProfile({
          name: data.name || "",
          department: data.department || "",
          vibe: data.vibe || "",
          bio: data.bio || "",
          hobbies: data.hobbies || []
        });
      }
    };
    
    fetchProfile();
  }, [user]);

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue("");
  };

  const saveField = async (field: string) => {
    if (!user) return;
    
    setIsSaving(true);
    
    let updateData: Record<string, unknown> = {};
    
    if (field === 'hobbies') {
      updateData[field] = editValue.split('•').map(s => s.trim()).filter(Boolean);
    } else {
      updateData[field] = editValue;
    }
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);
    
    if (error) {
      toast.error("Failed to save changes");
    } else {
      setProfile(prev => ({
        ...prev,
        [field]: field === 'hobbies' 
          ? editValue.split('•').map(s => s.trim()).filter(Boolean)
          : editValue
      }));
      toast.success("Saved!");
      setEditingField(null);
      setEditValue("");
    }
    
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderField = (
    label: string, 
    field: keyof ProfileData, 
    displayValue: string,
    placeholder: string
  ) => {
    const isEditing = editingField === field;
    
    return (
      <div className="py-4 border-b border-border/50 last:border-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            {isEditing ? (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={placeholder}
                className="bg-background"
                autoFocus
              />
            ) : (
              <p className="text-foreground font-medium truncate">
                {displayValue || <span className="text-muted-foreground italic">Not set</span>}
              </p>
            )}
          </div>
          
          <div className="flex gap-2 shrink-0">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={cancelEditing}
                  disabled={isSaving}
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => saveField(field)}
                  disabled={isSaving}
                  className="gradient-warm text-primary-foreground"
                >
                  <Check className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => startEditing(field, displayValue)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>My Profile | MealBuddy</title>
        <meta name="description" content="View and edit your MealBuddy profile" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8 max-w-lg">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <h1 className="text-2xl font-bold text-foreground mb-6">My Profile</h1>
          
          <div className="bg-card rounded-2xl border border-border p-6">
            {renderField(
              "Name & Major",
              "name",
              profile.name && profile.department 
                ? `${profile.name}, ${profile.department}`
                : profile.name || "",
              "Name, Year, Major"
            )}
            
            {renderField(
              "Current Vibe",
              "vibe",
              profile.vibe,
              "😊 feeling great today"
            )}
            
            {renderField(
              "Bio",
              "bio",
              profile.bio,
              "Short witty intro (max 10 words)"
            )}
            
            {renderField(
              "Top 3 Interests",
              "hobbies",
              profile.hobbies?.join(' • ') || "",
              "Coffee • Movies • Music"
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Profile;
