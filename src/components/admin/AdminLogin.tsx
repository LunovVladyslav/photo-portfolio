import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'sonner@2.0.3';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - in production, this would call an API
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      toast.success('Login successful!');
      onLogin();
    } else {
      toast.error('Invalid credentials. Try: admin / admin123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-black rounded-full">
              <Lock size={32} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl text-center mb-2">Admin Panel</h1>
          <p className="text-gray-600 text-center mb-8">
            Sign in to manage clients and sessions
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block mb-2 text-sm">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  placeholder="Enter username"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Enter password"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Demo credentials: admin / admin123
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
