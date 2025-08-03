
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddSkillModal: React.FC<AddSkillModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    skill_name: '',
    category: '',
    proficiency_level: 3
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('skills')
        .insert({
          user_id: user.id,
          ...formData
        });

      if (error) throw error;

      toast({
        title: 'Skill added',
        description: 'Your skill has been added successfully.',
      });

      onSuccess();
      onClose();
      setFormData({ skill_name: '', category: '', proficiency_level: 3 });
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: 'Error',
        description: 'Failed to add skill. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add Skill</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="skill_name">Skill Name *</Label>
            <Input
              id="skill_name"
              required
              value={formData.skill_name}
              onChange={(e) => setFormData(prev => ({ ...prev, skill_name: e.target.value }))}
              placeholder="React.js, Python, Project Management..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Programming Languages">Programming Languages</SelectItem>
                <SelectItem value="Frameworks & Libraries">Frameworks & Libraries</SelectItem>
                <SelectItem value="Tools & Technologies">Tools & Technologies</SelectItem>
                <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Data & Analytics">Data & Analytics</SelectItem>
                <SelectItem value="Cloud & DevOps">Cloud & DevOps</SelectItem>
                <SelectItem value="Project Management">Project Management</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Proficiency Level: {formData.proficiency_level}/5</Label>
            <Slider
              value={[formData.proficiency_level]}
              onValueChange={(value) => setFormData(prev => ({ ...prev, proficiency_level: value[0] }))}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Skill'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
