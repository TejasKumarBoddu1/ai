
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/types/profile';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onUpdate: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdate
}) => {
  const { user } = useAuth();
  const { updateProfile } = useProfile();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    professional_headline: profile?.professional_headline || '',
    headline_tagline: profile?.headline_tagline || '',
    location: profile?.location || '',
    website_url: profile?.website_url || '',
    about_summary: profile?.about_summary || '',
    phone: profile?.phone || '',
    industry: profile?.industry || '',
    years_experience: profile?.years_experience || 0,
    current_company: profile?.current_company || '',
    current_position: profile?.current_position || ''
  });

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        professional_headline: profile.professional_headline || '',
        headline_tagline: profile.headline_tagline || '',
        location: profile.location || '',
        website_url: profile.website_url || '',
        about_summary: profile.about_summary || '',
        phone: profile.phone || '',
        industry: profile.industry || '',
        years_experience: profile.years_experience || 0,
        current_company: profile.current_company || '',
        current_position: profile.current_position || ''
      });
    }
  }, [profile]);

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Construction', 'Real Estate', 'Transportation', 'Media',
    'Legal', 'Consulting', 'Non-Profit', 'Government', 'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(formData);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Professional Headlines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="headline">Professional Headline *</Label>
              <Input
                id="headline"
                value={formData.professional_headline}
                onChange={(e) => handleInputChange('professional_headline', e.target.value)}
                placeholder="Full Stack Developer | React Expert"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={formData.headline_tagline}
                onChange={(e) => handleInputChange('headline_tagline', e.target.value)}
                placeholder="Building the future, one line at a time"
              />
            </div>
          </div>

          {/* Current Position */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Current Position</Label>
              <Input
                id="position"
                value={formData.current_position}
                onChange={(e) => handleInputChange('current_position', e.target.value)}
                placeholder="Senior Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Current Company</Label>
              <Input
                id="company"
                value={formData.current_company}
                onChange={(e) => handleInputChange('current_company', e.target.value)}
                placeholder="Google"
              />
            </div>
          </div>

          {/* Industry and Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select 
                value={formData.industry} 
                onValueChange={(value) => handleInputChange('industry', value)}
              >
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[200]">
                  {industries.map((industry) => (
                    <SelectItem 
                      key={industry} 
                      value={industry}
                      className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Select 
                value={formData.years_experience?.toString() || ''} 
                onValueChange={(value) => handleInputChange('years_experience', parseInt(value))}
              >
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select years" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[200]">
                  {Array.from({ length: 21 }, (_, i) => (
                    <SelectItem 
                      key={i} 
                      value={i.toString()}
                      className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      {i === 0 ? 'Less than 1 year' : `${i}+ years`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location and Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="San Francisco Bay Area"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website_url}
              onChange={(e) => handleInputChange('website_url', e.target.value)}
              placeholder="https://yourportfolio.com"
            />
          </div>

          {/* About Summary */}
          <div className="space-y-2">
            <Label htmlFor="about">Professional Summary</Label>
            <Textarea
              id="about"
              rows={6}
              value={formData.about_summary}
              onChange={(e) => handleInputChange('about_summary', e.target.value)}
              placeholder="Write a compelling professional summary that highlights your expertise, achievements, and career goals..."
              className="resize-none"
            />
            <div className="text-sm text-gray-500 text-right">
              {formData.about_summary.length}/2600
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
              <Save className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
