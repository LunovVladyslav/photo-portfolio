import { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, GripVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Badge } from '../ui/badge';

interface Photo {
  id: string;
  url: string;
  title: string;
  session: string;
}

interface Album {
  id: string;
  name: string;
  count: number;
  photos: Photo[];
}

interface PortfolioManagementProps {
  albums: Album[];
  onAddAlbum: (album: Omit<Album, 'id' | 'count'>) => void;
  onUpdateAlbum: (id: string, updates: Partial<Album>) => void;
  onDeleteAlbum: (id: string) => void;
  onAddPhoto: (albumId: string, photo: Omit<Photo, 'id'>) => void;
  onDeletePhoto: (albumId: string, photoId: string) => void;
}

export function PortfolioManagement({ 
  albums, 
  onAddAlbum, 
  onUpdateAlbum, 
  onDeleteAlbum,
  onAddPhoto,
  onDeletePhoto
}: PortfolioManagementProps) {
  const [isAddAlbumOpen, setIsAddAlbumOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [deletingAlbum, setDeletingAlbum] = useState<Album | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState<{ albumId: string; photo: Photo } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [albumFormData, setAlbumFormData] = useState({
    name: ''
  });

  const [photoFormData, setPhotoFormData] = useState({
    url: '',
    title: '',
    session: ''
  });

  const handleOpenAddAlbum = () => {
    setAlbumFormData({ name: '' });
    setIsAddAlbumOpen(true);
  };

  const handleOpenEditAlbum = (album: Album) => {
    setAlbumFormData({ name: album.name });
    setEditingAlbum(album);
  };

  const handleSubmitAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAlbum) {
      onUpdateAlbum(editingAlbum.id, { name: albumFormData.name });
      setEditingAlbum(null);
    } else {
      onAddAlbum({ name: albumFormData.name, photos: [] });
      setIsAddAlbumOpen(false);
    }
    setAlbumFormData({ name: '' });
  };

  const handleDeleteAlbum = () => {
    if (deletingAlbum) {
      onDeleteAlbum(deletingAlbum.id);
      setDeletingAlbum(null);
      if (selectedAlbum === deletingAlbum.id) {
        setSelectedAlbum(null);
      }
    }
  };

  const handleOpenAddPhoto = () => {
    setPhotoFormData({ url: '', title: '', session: '' });
    setIsAddPhotoOpen(true);
  };

  const handleSubmitPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAlbum) {
      onAddPhoto(selectedAlbum, photoFormData);
      setIsAddPhotoOpen(false);
      setPhotoFormData({ url: '', title: '', session: '' });
    }
  };

  const handleDeletePhoto = () => {
    if (deletingPhoto) {
      onDeletePhoto(deletingPhoto.albumId, deletingPhoto.photo.id);
      setDeletingPhoto(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedAlbum) {
      const url = URL.createObjectURL(file);
      setPhotoFormData({ ...photoFormData, url });
    }
  };

  const currentAlbum = albums.find(a => a.id === selectedAlbum);
  const regularAlbums = albums.filter(a => a.id !== 'all');

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl mb-1">Portfolio Management</h2>
            <p className="text-gray-600">Manage albums and photos for your portfolio</p>
          </div>
          <Button onClick={handleOpenAddAlbum}>
            <Plus size={18} className="mr-2" />
            Add Album
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Albums List */}
          <div className="md:col-span-1 space-y-3">
            <h3 className="mb-3">Albums</h3>
            {regularAlbums.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                <p className="text-sm">No albums yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {regularAlbums.map((album) => (
                  <div
                    key={album.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedAlbum === album.id
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedAlbum(album.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <GripVertical size={16} className="text-gray-400" />
                        <h4>{album.name}</h4>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditAlbum(album);
                          }}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingAlbum(album);
                          }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ImageIcon size={14} />
                      <span>{album.count} photos</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Photos Grid */}
          <div className="md:col-span-2">
            {selectedAlbum && currentAlbum ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3>{currentAlbum.name}</h3>
                  <Button onClick={handleOpenAddPhoto}>
                    <Plus size={18} className="mr-2" />
                    Add Photo
                  </Button>
                </div>

                {currentAlbum.photos.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <ImageIcon size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 mb-4">No photos in this album</p>
                    <Button onClick={handleOpenAddPhoto}>Add First Photo</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {currentAlbum.photos.map((photo) => (
                      <div key={photo.id} className="group relative">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <ImageWithFallback
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingPhoto({ albumId: currentAlbum.id, photo })}
                            className="bg-white"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </Button>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm truncate">{photo.title}</p>
                          <p className="text-xs text-gray-500 truncate">{photo.session}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed rounded-lg">
                <ImageIcon size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Select an album to manage photos</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Add/Edit Album Dialog */}
      <Dialog open={isAddAlbumOpen || !!editingAlbum} onOpenChange={(open) => {
        if (!open) {
          setIsAddAlbumOpen(false);
          setEditingAlbum(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAlbum ? 'Edit Album' : 'Add New Album'}</DialogTitle>
            <DialogDescription>
              {editingAlbum ? 'Update the album name.' : 'Create a new portfolio album.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitAlbum} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="albumName">Album Name *</Label>
              <Input
                id="albumName"
                value={albumFormData.name}
                onChange={(e) => setAlbumFormData({ name: e.target.value })}
                placeholder="e.g., Weddings, Portraits, Fashion Editorial"
                required
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddAlbumOpen(false);
                  setEditingAlbum(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {editingAlbum ? 'Update' : 'Create'} Album
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Photo Dialog */}
      <Dialog open={isAddPhotoOpen} onOpenChange={setIsAddPhotoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Photo to {currentAlbum?.name}</DialogTitle>
            <DialogDescription>
              Add a new photo to this album. Enter the photo URL or upload an image.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitPhoto} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="photoUrl">Photo URL *</Label>
              <Input
                id="photoUrl"
                value={photoFormData.url}
                onChange={(e) => setPhotoFormData({ ...photoFormData, url: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                required
              />
              <p className="text-xs text-gray-500">Or upload a file:</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photoTitle">Photo Title *</Label>
              <Input
                id="photoTitle"
                value={photoFormData.title}
                onChange={(e) => setPhotoFormData({ ...photoFormData, title: e.target.value })}
                placeholder="e.g., Wedding Day, Bridal Portrait"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photoSession">Session Name *</Label>
              <Input
                id="photoSession"
                value={photoFormData.session}
                onChange={(e) => setPhotoFormData({ ...photoFormData, session: e.target.value })}
                placeholder="e.g., Sarah & John, Spring 2024"
                required
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddPhotoOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Photo
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Album Confirmation */}
      <AlertDialog open={!!deletingAlbum} onOpenChange={() => setDeletingAlbum(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Album</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingAlbum?.name}"? This will delete all photos in this album. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAlbum} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Photo Confirmation */}
      <AlertDialog open={!!deletingPhoto} onOpenChange={() => setDeletingPhoto(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingPhoto?.photo.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePhoto} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
