import React, { useState } from 'react';
import { FileText, Download, Eye, TrendingUp, Upload, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { ResumeFile, ProfileAnalytics } from '@/types/profile';

interface ResumeSectionProps {
  resumeFiles: ResumeFile[];
  analytics?: ProfileAnalytics | null;
  isOwner?: boolean;
  onUpdate?: () => void;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({
  resumeFiles,
  analytics,
  isOwner = false,
  onUpdate
}) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleResumeUpload = async () => {
    // Check authentication first
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload your resume",
        variant: "destructive"
      });
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          setUploading(true);
          console.log('Starting file upload for user:', user.id);
          console.log('File details:', { name: file.name, size: file.size, type: file.type });

          // Validate file type
          const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
          if (!allowedTypes.includes(file.type)) {
            throw new Error('Invalid file type. Please upload a PDF or Word document.');
          }

          // Validate file size (max 10MB)
          if (file.size > 10 * 1024 * 1024) {
            throw new Error('File too large. Please upload a file smaller than 10MB.');
          }

          // Check if bucket exists and user has access
          const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
          console.log('Available buckets:', buckets);
          
          if (bucketError) {
            console.error('Bucket list error:', bucketError);
            throw new Error('Storage not available. Please try again later.');
          }

          const resumeBucket = buckets?.find(bucket => bucket.id === 'resume-files');
          if (!resumeBucket) {
            throw new Error('Resume storage not configured. Please contact support.');
          }

          // Create a unique file path
          const fileExt = file.name.split('.').pop();
          const timestamp = Date.now();
          const fileName = `${user.id}/${timestamp}.${fileExt}`;
          
          console.log('Uploading to path:', fileName);

          // Upload to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('resume-files')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('Storage upload error:', uploadError);
            throw new Error(`Upload failed: ${uploadError.message}`);
          }

          console.log('Upload successful:', uploadData);

          // Save to database
          const { error: dbError } = await supabase
            .from('resume_files')
            .insert({
              user_id: user.id,
              file_name: file.name,
              file_path: uploadData.path,
              file_type: file.type,
              file_size: file.size,
              is_primary: resumeFiles.length === 0
            });

          if (dbError) {
            console.error('Database insert error:', dbError);
            // Try to clean up the uploaded file
            await supabase.storage.from('resume-files').remove([uploadData.path]);
            throw new Error(`Database error: ${dbError.message}`);
          }

          toast({
            title: "Resume uploaded",
            description: "Your resume has been uploaded successfully."
          });

          if (onUpdate) {
            onUpdate();
          }
        } catch (error: any) {
          console.error('Resume upload error:', error);
          toast({
            title: "Upload failed",
            description: error.message || "Failed to upload resume. Please try again.",
            variant: "destructive"
          });
        } finally {
          setUploading(false);
        }
      }
    };
    input.click();
  };

  const handleDownload = async (file: ResumeFile) => {
    try {
      const { data, error } = await supabase.storage
        .from('resume-files')
        .download(file.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Update download count
      await supabase
        .from('resume_files')
        .update({ 
          download_count: (file.download_count || 0) + 1,
          last_downloaded: new Date().toISOString()
        })
        .eq('id', file.id);

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Download failed",
        description: "Failed to download file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePreview = async (file: ResumeFile) => {
    try {
      const { data } = supabase.storage
        .from('resume-files')
        .getPublicUrl(file.file_path);

      if (data.publicUrl) {
        window.open(data.publicUrl, '_blank');
      }
    } catch (error) {
      console.error('Error previewing file:', error);
      toast({
        title: "Preview failed",
        description: "Failed to preview file. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Resume Files
          {isOwner && (
            <Button 
              onClick={handleResumeUpload} 
              size="sm"
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Resume'}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {resumeFiles.length > 0 ? (
          <div className="space-y-4">
            {resumeFiles.map((file) => (
              <div key={file.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{file.file_name}</h4>
                      <p className="text-sm text-gray-600">
                        {formatDate(file.created_at)} • {formatFileSize(file.file_size)}
                      </p>
                    </div>
                  </div>
                  {file.is_primary && (
                    <Badge variant="secondary">Primary</Badge>
                  )}
                </div>

                {file.ats_score && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4" />
                      <span>ATS Score: {file.ats_score}/100</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  {file.download_count !== undefined && (
                    <span className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {file.download_count} downloads
                    </span>
                  )}
                  {analytics && (
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      Profile views: {analytics.profile_views}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePreview(file)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownload(file)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No resume files uploaded yet.</p>
            {isOwner && (
              <Button 
                onClick={handleResumeUpload}
                disabled={uploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Your First Resume'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
