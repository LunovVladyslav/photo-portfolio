import { useState } from 'react';
import { LogOut, Users, FolderOpen, Upload, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ClientManagement } from './ClientManagement';
import { SessionManagement } from './SessionManagement';
import { PhotoUpload } from './PhotoUpload';
import { PortfolioManagement } from './PortfolioManagement';
import { toast } from 'sonner@2.0.3';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  accessCode: string;
}

interface Session {
  id: string;
  clientId: string;
  name: string;
  date: string;
  type: string;
  status: 'scheduled' | 'completed' | 'processing';
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

interface AdminDashboardProps {
  onLogout: () => void;
  onBackToPortfolio: () => void;
}

export function AdminDashboard({ onLogout, onBackToPortfolio }: AdminDashboardProps) {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 123-4567',
      createdAt: '2024-01-15',
      accessCode: 'DEMO2024'
    }
  ]);

  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      clientId: '1',
      name: 'Wedding Photography',
      date: '2024-06-15',
      type: 'Wedding',
      status: 'completed',
      photoCount: 12
    }
  ]);

  const [photos, setPhotos] = useState<Photo[]>([]);

  // Portfolio Albums State
  const [albums, setAlbums] = useState([
    {
      id: 'all',
      name: 'All Sessions',
      count: 0,
      photos: []
    },
    {
      id: 'weddings',
      name: 'Weddings',
      count: 8,
      photos: [
        {
          id: '1',
          url: 'https://images.unsplash.com/photo-1647730346047-649e23e3c7fa?w=1080',
          title: 'Sarah & John',
          session: 'Wedding Day'
        },
        {
          id: '2',
          url: 'https://images.unsplash.com/photo-1682113297701-add548fca303?w=1080',
          title: 'Bridal Portrait',
          session: 'Emma\'s Wedding'
        }
      ]
    }
  ]);

  const handleAddClient = (client: Omit<Client, 'id' | 'createdAt' | 'accessCode'>) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      accessCode: Math.random().toString(36).substring(2, 10).toUpperCase()
    };
    setClients([...clients, newClient]);
    toast.success('Client added successfully!');
  };

  const handleUpdateClient = (id: string, updates: Partial<Client>) => {
    setClients(clients.map(c => c.id === id ? { ...c, ...updates } : c));
    toast.success('Client updated successfully!');
  };

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
    setSessions(sessions.filter(s => s.clientId !== id));
    toast.success('Client deleted successfully!');
  };

  const handleAddSession = (session: Omit<Session, 'id' | 'photoCount'>) => {
    const newSession: Session = {
      ...session,
      id: Date.now().toString(),
      photoCount: 0
    };
    setSessions([...sessions, newSession]);
    toast.success('Session created successfully!');
  };

  const handleUpdateSession = (id: string, updates: Partial<Session>) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, ...updates } : s));
    toast.success('Session updated successfully!');
  };

  const handleDeleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
    setPhotos(photos.filter(p => p.sessionId !== id));
    toast.success('Session deleted successfully!');
  };

  const handleUploadPhotos = (sessionId: string, files: File[]) => {
    const newPhotos: Photo[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      sessionId,
      filename: file.name,
      url: URL.createObjectURL(file),
      category: 'Uncategorized',
      uploadedAt: new Date().toISOString(),
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
    }));

    setPhotos([...photos, ...newPhotos]);
    
    // Update session photo count
    setSessions(sessions.map(s => 
      s.id === sessionId 
        ? { ...s, photoCount: s.photoCount + newPhotos.length }
        : s
    ));

    toast.success(`${files.length} photo(s) uploaded successfully!`);
  };

  const handleDeletePhoto = (photoId: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (photo) {
      setPhotos(photos.filter(p => p.id !== photoId));
      setSessions(sessions.map(s => 
        s.id === photo.sessionId 
          ? { ...s, photoCount: Math.max(0, s.photoCount - 1) }
          : s
      ));
      toast.success('Photo deleted successfully!');
    }
  };

  const handleUpdatePhotoCategory = (photoId: string, category: string) => {
    setPhotos(photos.map(p => p.id === photoId ? { ...p, category } : p));
    toast.success('Photo category updated!');
  };

  // Portfolio Album Handlers
  const handleAddAlbum = (album: { name: string; photos: any[] }) => {
    const newAlbum = {
      ...album,
      id: Date.now().toString(),
      count: 0
    };
    setAlbums([...albums, newAlbum]);
    toast.success('Album added successfully!');
  };

  const handleUpdateAlbum = (id: string, updates: Partial<any>) => {
    setAlbums(albums.map(a => a.id === id ? { ...a, ...updates } : a));
    toast.success('Album updated successfully!');
  };

  const handleDeleteAlbum = (id: string) => {
    setAlbums(albums.filter(a => a.id !== id));
    toast.success('Album deleted successfully!');
  };

  const handleAddPhoto = (albumId: string, photo: { url: string; title: string; session: string }) => {
    const newPhoto = {
      ...photo,
      id: Date.now().toString()
    };
    setAlbums(albums.map(a => {
      if (a.id === albumId) {
        return {
          ...a,
          photos: [...a.photos, newPhoto],
          count: a.count + 1
        };
      }
      return a;
    }));
    toast.success('Photo added successfully!');
  };

  const handleDeletePhotoFromAlbum = (albumId: string, photoId: string) => {
    setAlbums(albums.map(a => {
      if (a.id === albumId) {
        return {
          ...a,
          photos: a.photos.filter((p: any) => p.id !== photoId),
          count: Math.max(0, a.count - 1)
        };
      }
      return a;
    }));
    toast.success('Photo deleted successfully!');
  };

  const handleLogout = () => {
    toast.success('Logged out successfully!');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl italic">Admin Panel</h1>
            <p className="text-sm text-gray-600">Photography Portfolio Management</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onBackToPortfolio}>
              <ArrowLeft size={18} className="mr-2" />
              Back to Portfolio
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="clients" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="clients" className="flex items-center space-x-2">
              <Users size={16} />
              <span>Clients</span>
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center space-x-2">
              <FolderOpen size={16} />
              <span>Sessions</span>
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center space-x-2">
              <Upload size={16} />
              <span>Photos</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center space-x-2">
              <ImageIcon size={16} />
              <span>Portfolio</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <ClientManagement
              clients={clients}
              onAdd={handleAddClient}
              onUpdate={handleUpdateClient}
              onDelete={handleDeleteClient}
            />
          </TabsContent>

          <TabsContent value="sessions">
            <SessionManagement
              sessions={sessions}
              clients={clients}
              onAdd={handleAddSession}
              onUpdate={handleUpdateSession}
              onDelete={handleDeleteSession}
            />
          </TabsContent>

          <TabsContent value="photos">
            <PhotoUpload
              sessions={sessions}
              clients={clients}
              photos={photos}
              onUpload={handleUploadPhotos}
              onDelete={handleDeletePhoto}
              onUpdateCategory={handleUpdatePhotoCategory}
            />
          </TabsContent>

          <TabsContent value="portfolio">
            <PortfolioManagement
              albums={albums}
              onAddAlbum={handleAddAlbum}
              onUpdateAlbum={handleUpdateAlbum}
              onDeleteAlbum={handleDeleteAlbum}
              onAddPhoto={handleAddPhoto}
              onDeletePhoto={handleDeletePhotoFromAlbum}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
