import { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, User, Camera, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Badge } from '../ui/badge';

interface Client {
  id: string;
  name: string;
  email: string;
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

interface SessionManagementProps {
  sessions: Session[];
  clients: Client[];
  onAdd: (session: Omit<Session, 'id' | 'photoCount'>) => void;
  onUpdate: (id: string, updates: Partial<Session>) => void;
  onDelete: (id: string) => void;
}

export function SessionManagement({ sessions, clients, onAdd, onUpdate, onDelete }: SessionManagementProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [deletingSession, setDeletingSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState({
    clientId: '',
    name: '',
    date: '',
    type: '',
    status: 'scheduled' as const
  });

  const sessionTypes = ['Wedding', 'Portrait', 'Family', 'Maternity', 'Newborn', 'Engagement', 'Corporate', 'Fashion', 'Other'];

  const handleOpenAdd = () => {
    setFormData({ clientId: '', name: '', date: '', type: '', status: 'scheduled' });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (session: Session) => {
    setFormData({
      clientId: session.clientId,
      name: session.name,
      date: session.date,
      type: session.type,
      status: session.status
    });
    setEditingSession(session);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSession) {
      onUpdate(editingSession.id, formData);
      setEditingSession(null);
    } else {
      onAdd(formData);
      setIsAddOpen(false);
    }
    setFormData({ clientId: '', name: '', date: '', type: '', status: 'scheduled' });
  };

  const handleDelete = () => {
    if (deletingSession) {
      onDelete(deletingSession.id);
      setDeletingSession(null);
    }
  };

  const getClientName = (clientId: string) => {
    return clients.find(c => c.id === clientId)?.name || 'Unknown';
  };

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl mb-1">Session Management</h2>
            <p className="text-gray-600">Create and manage photography sessions</p>
          </div>
          <Button onClick={handleOpenAdd} disabled={clients.length === 0}>
            <Plus size={18} className="mr-2" />
            Add Session
          </Button>
        </div>

        {clients.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Please add clients first before creating sessions.</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No sessions yet. Create your first session to get started.</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session Name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Photos</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User size={14} className="text-gray-400" />
                        <span>{getClientName(session.clientId)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Camera size={14} className="text-gray-400" />
                        <span>{session.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{session.date}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <ImageIcon size={14} className="text-gray-400" />
                        <span>{session.photoCount}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(session)}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingSession(session)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddOpen || !!editingSession} onOpenChange={(open) => {
        if (!open) {
          setIsAddOpen(false);
          setEditingSession(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSession ? 'Edit Session' : 'Create New Session'}</DialogTitle>
            <DialogDescription>
              {editingSession ? 'Update session information below.' : 'Create a new photography session for a client.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client *</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                required
              >
                <SelectTrigger id="clientId">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Session Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Wedding Photography"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Session Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                required
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent>
                  {sessionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Session Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                required
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingSession(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {editingSession ? 'Update' : 'Create'} Session
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingSession} onOpenChange={() => setDeletingSession(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingSession?.name}"? This will also delete all photos in this session. This action cannot be undone.
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
