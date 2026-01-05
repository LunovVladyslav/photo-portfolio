import { motion, AnimatePresence } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Lock, Download, Grid3x3, List, LayoutGrid, CheckSquare, Square, Archive, Eye } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner@2.0.3';

interface GalleryImage {
  id: string;
  url: string;
  filename: string;
  category: string;
  size: string;
}

const mockGalleryImages: GalleryImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1758810409847-f0dd071cda59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2VyZW1vbnklMjBtb21lbnRzfGVufDF8fHx8MTc2MjUxMzM0MXww&ixlib=rb-4.1.0&q=80&w=1080',
    filename: 'ceremony_001.jpg',
    category: 'Ceremony',
    size: '4.2 MB'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1549620936-aa6278062ba5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcmVjZXB0aW9uJTIwcGFydHl8ZW58MXx8fHwxNzYyNDg5NTg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    filename: 'reception_023.jpg',
    category: 'Reception',
    size: '3.8 MB'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1749224280334-460eb823e0c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjByb21hbnRpYyUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MjUxMzM0MXww&ixlib=rb-4.1.0&q=80&w=1080',
    filename: 'portraits_045.jpg',
    category: 'Portraits',
    size: '5.1 MB'
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1599081753523-a20f731f42c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZGV0YWlscyUyMHJpbmdzfGVufDF8fHx8MTc2MjUxMzM0Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    filename: 'details_012.jpg',
    category: 'Details',
    size: '2.9 MB'
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1672289444692-2bd3b48c5178?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlkZSUyMGdldHRpbmclMjByZWFkeXxlbnwxfHx8fDE3NjI0NTExODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    filename: 'getting_ready_008.jpg',
    category: 'Getting Ready',
    size: '3.5 MB'
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1695987528224-f4b9becb7a5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2FrZSUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc2MjUxMzM0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    filename: 'cake_cutting_056.jpg',
    category: 'Reception',
    size: '4.0 MB'
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1756483557756-1b40cb0421f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZ3Vlc3RzJTIwZGFuY2luZ3xlbnwxfHx8fDE3NjI1MTMzNDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    filename: 'dancing_067.jpg',
    category: 'Reception',
    size: '3.7 MB'
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1664312696723-173130983e27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwYm91cXVldCUyMGZsb3dlcnN8ZW58MXx8fHwxNzYyNDU1Mzc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    filename: 'bouquet_005.jpg',
    category: 'Details',
    size: '3.2 MB'
  },
  {
    id: '9',
    url: 'https://images.unsplash.com/photo-1611456531646-2a68d6df2723?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjI0MjE2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    filename: 'ceremony_015.jpg',
    category: 'Ceremony',
    size: '4.5 MB'
  },
  {
    id: '10',
    url: 'https://images.unsplash.com/photo-1709887139259-e5fdce21afa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZGl0b3JpYWwlMjBmYXNoaW9uJTIwbW9kZWx8ZW58MXx8fHwxNzYyNTExNzcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    filename: 'portraits_038.jpg',
    category: 'Portraits',
    size: '4.8 MB'
  },
  {
    id: '11',
    url: 'https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2MjQ4NDk4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    filename: 'getting_ready_019.jpg',
    category: 'Getting Ready',
    size: '3.9 MB'
  },
  {
    id: '12',
    url: 'https://images.unsplash.com/photo-1632613714614-e817d3814a8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NjI0NzQwODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    filename: 'portraits_052.jpg',
    category: 'Portraits',
    size: '5.3 MB'
  }
];

type ViewType = 'grid' | 'list' | 'masonry';

export function PhotoCollection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [formData, setFormData] = useState({ email: '', accessCode: '' });
  const [error, setError] = useState('');
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.accessCode === 'DEMO2024') {
      setIsUnlocked(true);
      toast.success('Gallery unlocked successfully!');
    } else {
      setError('Invalid access code. Try: DEMO2024');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePhotoSelection = (photoId: string) => {
    const newSelection = new Set(selectedPhotos);
    if (newSelection.has(photoId)) {
      newSelection.delete(photoId);
    } else {
      newSelection.add(photoId);
    }
    setSelectedPhotos(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedPhotos.size === filteredImages.length) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(filteredImages.map(img => img.id)));
    }
  };

  const handleDownloadSelected = () => {
    if (selectedPhotos.size === 0) {
      toast.error('Please select at least one photo to download');
      return;
    }
    toast.success(`Downloading ${selectedPhotos.size} photo(s) as archive...`);
    console.log('Downloading photos:', Array.from(selectedPhotos));
  };

  const handleDownloadAll = () => {
    toast.success(`Downloading all ${filteredImages.length} photos as archive...`);
    console.log('Downloading all photos');
  };

  const categories = ['all', ...Array.from(new Set(mockGalleryImages.map(img => img.category)))];
  const filteredImages = filterCategory === 'all' 
    ? mockGalleryImages 
    : mockGalleryImages.filter(img => img.category === filterCategory);

  const renderGridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredImages.map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="relative group"
        >
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            <ImageWithFallback
              src={image.url}
              alt={image.filename}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
              <button
                onClick={() => setPreviewImage(image)}
                className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <Eye size={20} />
              </button>
              <button
                onClick={() => {
                  toast.success(`Downloading ${image.filename}...`);
                }}
                className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <Download size={20} />
              </button>
            </div>
            <div className="absolute top-3 left-3 z-10">
              <Checkbox
                checked={selectedPhotos.has(image.id)}
                onCheckedChange={() => togglePhotoSelection(image.id)}
                className="bg-white"
              />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <p className="truncate">{image.filename}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-2">
      {filteredImages.map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.03 }}
          className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow group"
        >
          <Checkbox
            checked={selectedPhotos.has(image.id)}
            onCheckedChange={() => togglePhotoSelection(image.id)}
          />
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <ImageWithFallback
              src={image.url}
              alt={image.filename}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow">
            <p className="mb-1">{image.filename}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{image.category}</span>
              <span>•</span>
              <span>{image.size}</span>
            </div>
          </div>
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setPreviewImage(image)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => {
                toast.success(`Downloading ${image.filename}...`);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download size={18} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderMasonryView = () => (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {filteredImages.map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="relative group break-inside-avoid"
        >
          <div className="relative rounded-lg overflow-hidden bg-gray-100">
            <ImageWithFallback
              src={image.url}
              alt={image.filename}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
              <button
                onClick={() => setPreviewImage(image)}
                className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <Eye size={20} />
              </button>
              <button
                onClick={() => {
                  toast.success(`Downloading ${image.filename}...`);
                }}
                className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <Download size={20} />
              </button>
            </div>
            <div className="absolute top-3 left-3 z-10">
              <Checkbox
                checked={selectedPhotos.has(image.id)}
                onCheckedChange={() => togglePhotoSelection(image.id)}
                className="bg-white"
              />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <p className="truncate">{image.filename}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <section id="collection" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl mb-4 italic">Collect Your Photos</h2>
          <p className="text-gray-600">
            Access your private photo gallery
          </p>
        </motion.div>

        {!isUnlocked ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <Card className="p-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-neutral-100 rounded-full">
                  <Lock size={32} />
                </div>
              </div>
              <h3 className="text-2xl text-center mb-6">Gallery Access</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="accessCode" className="block mb-2 text-sm">
                    Access Code *
                  </label>
                  <Input
                    id="accessCode"
                    name="accessCode"
                    type="text"
                    value={formData.accessCode}
                    onChange={handleChange}
                    required
                    placeholder="Enter your access code"
                    className="w-full"
                  />
                </div>
                {error && (
                  <p className="text-red-600 text-sm">{error}</p>
                )}
                <Button type="submit" className="w-full">
                  Access Gallery
                </Button>
              </form>
              <p className="text-sm text-gray-500 text-center mt-6">
                Your access code was provided via email after your session.
              </p>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Gallery Controls */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl mb-1">Your Wedding Gallery</h3>
                  <p className="text-gray-600">{formData.email} • {filteredImages.length} photos</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleDownloadSelected}
                    disabled={selectedPhotos.size === 0}
                    className="flex items-center space-x-2"
                  >
                    <Archive size={18} />
                    <span>Download Selected ({selectedPhotos.size})</span>
                  </Button>
                  <Button onClick={handleDownloadAll} className="flex items-center space-x-2">
                    <Download size={18} />
                    <span>Download All</span>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleSelectAll}
                    className="flex items-center space-x-2 text-sm hover:text-black transition-colors"
                  >
                    {selectedPhotos.size === filteredImages.length ? (
                      <CheckSquare size={18} />
                    ) : (
                      <Square size={18} />
                    )}
                    <span>Select All</span>
                  </button>
                  {selectedPhotos.size > 0 && (
                    <span className="text-sm text-gray-600">
                      {selectedPhotos.size} selected
                    </span>
                  )}
                </div>

                {/* Category Filter */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Category:</span>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        filterCategory === cat
                          ? 'bg-black text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>

                {/* View Toggle */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewType('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewType === 'grid'
                        ? 'bg-black text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Grid View"
                  >
                    <Grid3x3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewType('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewType === 'list'
                        ? 'bg-black text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                    title="List View"
                  >
                    <List size={18} />
                  </button>
                  <button
                    onClick={() => setViewType('masonry')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewType === 'masonry'
                        ? 'bg-black text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Masonry View"
                  >
                    <LayoutGrid size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Gallery Views */}
            <AnimatePresence mode="wait">
              <motion.div
                key={viewType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {viewType === 'grid' && renderGridView()}
                {viewType === 'list' && renderListView()}
                {viewType === 'masonry' && renderMasonryView()}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 text-center space-y-2">
              <p className="text-gray-600">
                Gallery expires on December 31, 2025
              </p>
              <button
                onClick={() => {
                  setIsUnlocked(false);
                  setSelectedPhotos(new Set());
                }}
                className="text-sm text-gray-500 hover:text-black transition-colors"
              >
                Lock Gallery
              </button>
            </div>
          </motion.div>
        )}

        {/* Image Preview Dialog */}
        <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{previewImage?.filename}</DialogTitle>
            </DialogHeader>
            {previewImage && (
              <div className="space-y-4">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <ImageWithFallback
                    src={previewImage.url}
                    alt={previewImage.filename}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p>Category: {previewImage.category}</p>
                    <p>Size: {previewImage.size}</p>
                  </div>
                  <Button
                    onClick={() => {
                      toast.success(`Downloading ${previewImage.filename}...`);
                      setPreviewImage(null);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <Download size={18} />
                    <span>Download</span>
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
