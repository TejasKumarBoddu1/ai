import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Loader2, User, Mail, Phone, Building, Clock } from "lucide-react";
import { format } from "date-fns";

const Profile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department: "",
    profile_photo_url: "",
    hire_date: "",
    role: "",
    specializations: [],
    bio: ""
  });
  
  useEffect(() => {
    async function fetchProfileData() {
      try {
        setLoading(true);
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;
        
        // Get the HR member profile
        const { data, error } = await supabase
          .from('hr_members')
          .select('*')
          .eq('user_profile_id', user.id)
          .single();
          
        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }
        
        if (data) {
          setProfile({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            email: data.email || "",
            phone: data.phone || "",
            department: data.department || "",
            profile_photo_url: data.profile_photo_url || "",
            hire_date: data.hire_date || "",
            role: data.role || "",
            specializations: data.specializations || [],
            bio: data.bio || "" // Now using the new bio field
          });
        }
      } catch (error) {
        console.error("Error in fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfileData();
  }, []);
  
  const handleChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to update your profile.",
          variant: "destructive"
        });
        return;
      }
      
      // Get the HR member record to update
      const { data: hrMember, error: hrMemberError } = await supabase
        .from('hr_members')
        .select('id')
        .eq('user_profile_id', user.id)
        .single();
        
      if (hrMemberError) {
        console.error("Error fetching HR member:", hrMemberError);
        toast({
          title: "Error",
          description: "Could not find your HR profile.",
          variant: "destructive"
        });
        return;
      }
      
      // Update the profile, now including bio field
      const { error: updateError } = await supabase
        .from('hr_members')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          department: profile.department,
          specializations: profile.specializations,
          bio: profile.bio
        })
        .eq('id', hrMember.id);
        
      if (updateError) {
        console.error("Error updating profile:", updateError);
        toast({
          title: "Error",
          description: "Could not update profile.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully."
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Avatar and Summary */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={profile.profile_photo_url} />
                <AvatarFallback className="text-2xl">
                  {profile.first_name && profile.last_name ? 
                    `${profile.first_name[0]}${profile.last_name[0]}` : 'HR'}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">{profile.first_name} {profile.last_name}</h3>
              <p className="text-muted-foreground">{profile.role}</p>
              <p className="text-sm text-muted-foreground mt-1">{profile.department}</p>
              
              <div className="w-full mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.hire_date && (
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Joined {format(new Date(profile.hire_date), "MMMM yyyy")}</span>
                  </div>
                )}
              </div>
              
              <Button className="mt-4 w-full">Upload New Photo</Button>
            </CardContent>
          </Card>
          
          {/* Profile Details Form */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={profile.first_name} 
                    onChange={(e) => handleChange('first_name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={profile.last_name}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile.email} disabled />
                <p className="text-xs text-muted-foreground">Contact admin to change email address</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  value={profile.phone} 
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input 
                  id="department" 
                  value={profile.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio"
                  value={profile.bio || ""}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Specializations</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.specializations?.map((spec, index) => (
                    <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {spec}
                    </span>
                  ))}
                  {(!profile.specializations || profile.specializations.length === 0) && (
                    <span className="text-muted-foreground text-sm">No specializations added</span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
