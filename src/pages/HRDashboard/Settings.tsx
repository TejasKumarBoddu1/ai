
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Loader2 } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    darkMode: false,
    language: "en",
    emailNotifications: true,
    pushNotifications: true,
    dataSharing: false,
    profileVisibility: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;
        
        // Fetch settings from the hr_members table
        const { data: userData, error } = await supabase
          .from('hr_members')
          .select('*')
          .eq('user_profile_id', user.id)
          .single();

        if (error) {
          console.error("Error fetching settings:", error);
        } else if (userData && userData.settings) {
          // Make sure userData.settings is an object before spreading it
          const storedSettings = typeof userData.settings === 'object' && userData.settings !== null 
            ? userData.settings 
            : {};
            
          setSettings({
            ...settings,
            ...storedSettings
          });
        }
      } catch (error) {
        console.error("Error in fetching settings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to update settings.",
          variant: "destructive"
        });
        return;
      }
      
      // Get the hr_member record for the current user
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
      
      // Update the settings
      const { error: updateError } = await supabase
        .from('hr_members')
        .update({
          settings: settings
        })
        .eq('id', hrMember.id);
        
      if (updateError) {
        console.error("Error updating settings:", updateError);
        toast({
          title: "Error",
          description: "Could not update settings.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Settings updated",
          description: "Your settings have been updated successfully."
        });
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
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
        <h1 className="text-3xl font-bold tracking-tight">HR Settings</h1>
        
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your HR account preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Toggle dark mode on/off.</p>
                  </div>
                  <Switch 
                    id="dark-mode" 
                    checked={settings.darkMode} 
                    onCheckedChange={(value) => handleChange('darkMode', value)} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <p className="text-sm text-muted-foreground">Select your preferred language.</p>
                  </div>
                  <select 
                    id="language" 
                    className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={settings.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how you receive recruitment notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notif">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email.</p>
                  </div>
                  <Switch 
                    id="email-notif" 
                    checked={settings.emailNotifications}
                    onCheckedChange={(value) => handleChange('emailNotifications', value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notif">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications in-app.</p>
                  </div>
                  <Switch 
                    id="push-notif"
                    checked={settings.pushNotifications}
                    onCheckedChange={(value) => handleChange('pushNotifications', value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Manage your data and privacy preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-sharing">Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">Share data with hiring teams.</p>
                  </div>
                  <Switch 
                    id="data-sharing"
                    checked={settings.dataSharing}
                    onCheckedChange={(value) => handleChange('dataSharing', value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profile-visibility">Profile Visibility</Label>
                    <p className="text-sm text-muted-foreground">Make your profile visible to hiring managers.</p>
                  </div>
                  <Switch 
                    id="profile-visibility"
                    checked={settings.profileVisibility}
                    onCheckedChange={(value) => handleChange('profileVisibility', value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
