import { useState } from 'react';
import { Plus, Edit2, Trash2, Mail, Phone, Key, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  accessCode: string;
}

interface ClientManagementProps {
  clients: Client[];
  onAdd: (client: Omit<Client, 'id' | 'createdAt' | 'accessCode'>) => void;
  onUpdate: (id: string, updates: Partial<Client>) => void;
  onDelete: (id: string) => void;
}

export function ClientManagement({ clients, onAdd, onUpdate, onDelete }: ClientManagementProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleOpenAdd = () => {
    setFormData({ name: '', email: '', phone: '' });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone
    });
    setEditingClient(client);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      onUpdate(editingClient.id, formData);
      setEditingClient(null);
    } else {
      onAdd(formData);
      setIsAddOpen(false);
    }
    setFormData({ name: '', email: '', phone: '' });
  };

  const handleDelete = () => {
    if (deletingClient) {
      onDelete(deletingClient.id);
      setDeletingClient(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl mb-1">Client Management</h2>
            <p className="text-gray-600">Manage your photography clients</p>
          </div>
          <Button onClick={handleOpenAdd}>
            <Plus size={18} className="mr-2" />
            Add Client
          </Button>
        </div>

        {clients.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No clients yet. Add your first client to get started.</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Access Code</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Mail size={14} className="text-gray-400" />
                        <span>{client.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Phone size={14} className="text-gray-400" />
                        <span>{client.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Key size={14} className="text-gray-400" />
                        <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {client.accessCode}
                        </code>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{client.createdAt}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(client)}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingClient(client)}
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
      <Dialog open={isAddOpen || !!editingClient} onOpenChange={(open) => {
        if (!open) {
          setIsAddOpen(false);
          setEditingClient(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
            <DialogDescription>
              {editingClient ? 'Update client information below.' : 'Enter the details for the new client.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingClient(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {editingClient ? 'Update' : 'Add'} Client
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingClient} onOpenChange={() => setDeletingClient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingClient?.name}? This will also delete all associated sessions and photos. This action cannot be undone.
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
