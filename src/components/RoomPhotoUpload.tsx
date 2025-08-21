import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, Image, X, FileImage, Loader, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadedPhoto {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  photo_type: 'original' | 'ai_generated' | 'edited';
  created_at: string;
  url?: string;
}

interface RoomPhotoUploadProps {
  projectId: string;
  onPhotoUploaded?: (photo: UploadedPhoto) => void;
  maxFiles?: number;
}

export function RoomPhotoUpload({ projectId, onPhotoUploaded, maxFiles = 10 }: RoomPhotoUploadProps) {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user || !projectId) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour télécharger des photos",
        variant: "destructive"
      });
      return;
    }

    if (uploadedPhotos.length + acceptedFiles.length > maxFiles) {
      toast({
        title: "Erreur",
        description: `Vous ne pouvez télécharger que ${maxFiles} photos maximum`,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const totalFiles = acceptedFiles.length;
      let completed = 0;

      for (const file of acceptedFiles) {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "Erreur",
            description: `${file.name} est trop volumineux (max 10MB)`,
            variant: "destructive"
          });
          continue;
        }

        // Create unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${projectId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('room-photos')
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('room-photos')
          .getPublicUrl(fileName);

        // Save photo record to database
        const { data: photoData, error: dbError } = await supabase
          .from('room_photos')
          .insert({
            project_id: projectId,
            file_path: fileName,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            photo_type: 'original',
            metadata: {
              originalName: file.name,
              uploadedAt: new Date().toISOString()
            }
          })
          .select()
          .single();

        if (dbError) {
          throw dbError;
        }

        const newPhoto: UploadedPhoto = {
          ...photoData,
          url: publicUrl
        };

        setUploadedPhotos(prev => [...prev, newPhoto]);
        
        if (onPhotoUploaded) {
          onPhotoUploaded(newPhoto);
        }

        completed++;
        setUploadProgress((completed / totalFiles) * 100);
      }

      toast({
        title: "Succès",
        description: `${completed} photo(s) téléchargée(s) avec succès`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [user, projectId, onPhotoUploaded, uploadedPhotos.length, maxFiles, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple: true,
    disabled: uploading
  });

  const deletePhoto = async (photo: UploadedPhoto) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('room-photos')
        .remove([photo.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('room_photos')
        .delete()
        .eq('id', photo.id);

      if (dbError) throw dbError;

      setUploadedPhotos(prev => prev.filter(p => p.id !== photo.id));

      toast({
        title: "Succès",
        description: "Photo supprimée avec succès",
      });

    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          Photos de la Pièce
        </CardTitle>
        <CardDescription>
          Téléchargez des photos de votre pièce pour l'analyse IA
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Upload Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            {uploading ? (
              <>
                <Loader className="w-12 h-12 mx-auto text-primary animate-spin" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Téléchargement en cours...</p>
                  <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                  <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}% terminé</p>
                </div>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {isDragActive ? 'Déposez les photos ici...' : 'Glissez-déposez vos photos ici'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ou cliquez pour sélectionner des fichiers
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Formats supportés: JPEG, PNG, WebP, GIF (max 10MB par photo)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Uploaded Photos */}
        {uploadedPhotos.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Photos téléchargées ({uploadedPhotos.length})</h4>
              <Badge variant="outline">
                {uploadedPhotos.length}/{maxFiles}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedPhotos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    {photo.url ? (
                      <img
                        src={photo.url}
                        alt={photo.file_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileImage className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deletePhoto(photo)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium truncate" title={photo.file_name}>
                      {photo.file_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(photo.file_size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
