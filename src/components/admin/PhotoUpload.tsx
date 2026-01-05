import { useState, useRef } from 'react';
import { Upload, Trash2, Eye, FolderOpen, User, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Badge } from '../ui/badge';

interface Client {
  id: string;
  name: string;
}

interface Session {
  id: string;
  clientId: string;
  name: string;
  type: string;
  photoCount: number;
}

interface Photo {
  id: string;
  sessionId: string;
  filename: string;
  url: string;
  category: string;
  uploadedAt: string;
  size: string;
}

interface PhotoUploadProps {
  sessions: Session[];
  clients: Client[];
  photos: Photo[];
  onUpload: (sessionId: string, files: File[]) => void;
  onDelete: (photoId: string) => void;
  onUpdateCategory: (photoId: string, category: string) => void;
}

export function PhotoUpload({ sessions, clients, photos, onUpload, onDelete, onUpdateCategory }: PhotoUploadProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [previewPhoto, setPreviewPhoto] = useState<Photo | null>(null);
  const [deletingPhoto, setDeletingPhoto] = useState<Photo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Ceremony', 'Reception', 'Portraits', 'Details', 'Getting Ready', 'Group Photos', 'Candid', 'Uncategorized'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && selectedSessionId) {
      onUpload(selectedSessionId, files);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = () => {
    if (deletingPhoto) {
      onDelete(deletingPhoto.id);
      setDeletingPhoto(null);
    }
  };

  const getClientName = (clientId: string) => {
    return clients.find(c => c.id === clientId)?.name || 'Unknown';
  };

  const selectedSession = sessions.find(s => s.id === selectedSessionId);
  const sessionPhotos = photos.filter(p => p.sessionId === selectedSessionId);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl mb-1">Photo Upload</h2>
          <p className="text-gray-600">Upload and manage session photos</p>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Please create sessions first before uploading photos.</p>
          </div>
        ) : (
          <>
            {/* Session Selection */}
            <div className="mb-6">
              <label className="block mb-2 text-sm">Select Session</label>
              <Select value={selectedSessionId} onValueChange={setSelectedSessionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a session to upload photos" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      <div className="flex items-center space-x-2">
                        <span>{session.name}</span>
                        <span className="text-gray-500">- {getClientName(session.clientId)}</span>
                        <Badge variant="outline">{session.photoCount} photos</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSessionId && (
              <>
                {/* Upload Area */}
                <div className="mb-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                      <p className="mb-2">
                        Click to upload photos or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, JPEG up to 10MB each
                      </p>
                    </label>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FolderOpen size={16} />
                      <span>{selectedSession?.name}</span>
                      <span>•</span>
                      <User size={16} />
                      <span>{selectedSession && getClientName(selectedSession.clientId)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ImageIcon size={16} />
                      <span>{sessionPhotos.length} photos uploaded</span>
                    </div>
                  </div>
                </div>

                {/* Photo Grid */}
                {sessionPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {sessionPhotos.map((photo) => (
                      <div key={photo.id} className="group relative">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <ImageWithFallback
                            src={photo.url}
                            alt={photo.filename}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                          <button
                            onClick={() => setPreviewPhoto(photo)}
                            className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => setDeletingPhoto(photo)}
                            className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {/* Photo Info */}
                        <div className="mt-2">
                          <p className="text-sm truncate mb-1">{photo.filename}</p>
                          <Select
                            value={photo.category}
                            onValueChange={(value) => onUpdateCategory(photo.id, value)}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <ImageIcon size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No photos uploaded yet. Upload photos to this session.</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewPhoto} onOpenChange={() => setPreviewPhoto(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewPhoto?.filename}</DialogTitle>
            <DialogDescription>
              Photo preview and details
            </DialogDescription>
          </DialogHeader>
          {previewPhoto && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={previewPhoto.url}
                  alt={previewPhoto.filename}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Category</p>
                  <p>{previewPhoto.category}</p>
                </div>
                <div>
                  <p className="text-gray-500">File Size</p>
                  <p>{previewPhoto.size}</p>
                </div>
                <div>
                  <p className="text-gray-500">Uploaded</p>
                  <p>{new Date(previewPhoto.uploadedAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Filename</p>
                  <p className="truncate">{previewPhoto.filename}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingPhoto} onOpenChange={() => setDeletingPhoto(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingPhoto?.filename}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
