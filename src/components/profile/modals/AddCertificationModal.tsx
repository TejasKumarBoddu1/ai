
import React, { useState } from 'react';
import { X, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AddCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddCertificationModal: React.FC<AddCertificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    certification_name: '',
    issuing_organization: '',
    issue_date: '',
    expiration_date: '',
    credential_id: '',
    certificate_url: '',
    verification_url: '',
    never_expires: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('certifications')
        .insert({
          user_id: user.id,
          certification_name: formData.certification_name,
          issuing_organization: formData.issuing_organization,
          issue_date: formData.issue_date || null,
          expiration_date: formData.never_expires ? null : formData.expiration_date || null,
          credential_id: formData.credential_id || null,
          certificate_url: formData.certificate_url || null,
          verification_url: formData.verification_url || null
        });

      if (error) throw error;

      toast({
        title: 'Certification added',
        description: 'Your certification has been added successfully.',
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding certification:', error);
      toast({
        title: 'Error',
        description: 'Failed to add certification. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Award className="h-5 w-5" />
            Add Certification
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="certification_name">Certification Name *</Label>
            <Input
              id="certification_name"
              required
              value={formData.certification_name}
              onChange={(e) => setFormData(prev => ({ ...prev, certification_name: e.target.value }))}
              placeholder="AWS Certified Solutions Architect"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuing_organization">Issuing Organization *</Label>
            <Input
              id="issuing_organization"
              required
              value={formData.issuing_organization}
              onChange={(e) => setFormData(prev => ({ ...prev, issuing_organization: e.target.value }))}
              placeholder="Amazon Web Services"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input
                id="issue_date"
                type="date"
                value={formData.issue_date}
                onChange={(e) => setFormData(prev => ({ ...prev, issue_date: e.target.value }))}
              />
            </div>

            {!formData.never_expires && (
              <div className="space-y-2">
                <Label htmlFor="expiration_date">Expiration Date</Label>
                <Input
                  id="expiration_date"
                  type="date"
                  value={formData.expiration_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiration_date: e.target.value }))}
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="never_expires"
              checked={formData.never_expires}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, never_expires: checked as boolean }))}
            />
            <Label htmlFor="never_expires">This certification does not expire</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="credential_id">Credential ID</Label>
            <Input
              id="credential_id"
              value={formData.credential_id}
              onChange={(e) => setFormData(prev => ({ ...prev, credential_id: e.target.value }))}
              placeholder="ABC123DEF456"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificate_url">Certificate URL</Label>
            <Input
              id="certificate_url"
              type="url"
              value={formData.certificate_url}
              onChange={(e) => setFormData(prev => ({ ...prev, certificate_url: e.target.value }))}
              placeholder="https://certificate-url.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="verification_url">Verification URL</Label>
            <Input
              id="verification_url"
              type="url"
              value={formData.verification_url}
              onChange={(e) => setFormData(prev => ({ ...prev, verification_url: e.target.value }))}
              placeholder="https://verify.issuer.com"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Certification'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
