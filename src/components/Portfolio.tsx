import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useInView } from 'motion/react';
import { Folder, FolderOpen, Image as ImageIcon } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Organize photos into sessions/folders
const photoSessions = [
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
        url: 'https://images.unsplash.com/photo-1647730346047-649e23e3c7fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY291cGxlJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzYyNDgzMTA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Sarah & John',
        session: 'Wedding Day'
      },
      {
        url: 'https://images.unsplash.com/photo-1682113297701-add548fca303?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlkYWwlMjBwb3J0cmFpdCUyMGZhc2hpb258ZW58MXx8fHwxNzYyNTEyMDkzfDA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Bridal Portrait',
        session: 'Emma\'s Wedding'
      },
      {
        url: 'https://images.unsplash.com/photo-1729075538820-f7720b2d3db4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdhZ2VtZW50JTIwY291cGxlJTIwb3V0ZG9vcnxlbnwxfHx8fDE3NjI1MTIwOTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Engagement Session',
        session: 'Alex & Maria'
      },
      {
        url: 'https://images.unsplash.com/photo-1611456531646-2a68d6df2723?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjI0MjE2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Reception',
        session: 'Sofia & Michael'
      },
      {
        url: 'https://images.unsplash.com/photo-1709887139259-e5fdce21afa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZGl0b3JpYWwlMjBmYXNoaW9uJTIwbW9kZWx8ZW58MXx8fHwxNzYyNTExNzcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'First Dance',
        session: 'David & Anna'
      },
      {
        url: 'https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2MjQ4NDk4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Ceremony',
        session: 'Chris & Julie'
      },
      {
        url: 'https://images.unsplash.com/photo-1614492025699-2a9ea5b8c58b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZWRpdG9yaWFsJTIwc3R5bGV8ZW58MXx8fHwxNzYyNDk1NDk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Getting Ready',
        session: 'Sarah & John'
      },
      {
        url: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdoaXRlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYyNDU4MDI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Portraits',
        session: 'Emma\'s Wedding'
      }
    ]
  },
  {
    id: 'portraits',
    name: 'Portrait Sessions',
    count: 6,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2MjQ4NDk4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Studio Session',
        session: 'Individual Portrait'
      },
      {
        url: 'https://images.unsplash.com/photo-1568585105565-e372998a195d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBoZWFkc2hvdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjI0MzI5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Professional Headshot',
        session: 'Corporate Session'
      },
      {
        url: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdoaXRlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYyNDU4MDI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'B&W Portrait',
        session: 'Artistic Session'
      },
      {
        url: 'https://images.unsplash.com/photo-1715871583544-3a20163b5cca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBncmFkdWF0aW9uJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYyNTEyMDkzfDA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Senior Portrait',
        session: 'Graduation 2024'
      },
      {
        url: 'https://images.unsplash.com/photo-1593382067395-ace3045a1547?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHBvcnRyYWl0JTIwYXJ0fGVufDF8fHx8MTc2MjQ3Mzg3MXww&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Creative Portrait',
        session: 'Art Series'
      },
      {
        url: 'https://images.unsplash.com/photo-1686774272000-7096622ba435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwZmFzaGlvbiUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2MjUxMTc3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Outdoor Portrait',
        session: 'Natural Light'
      }
    ]
  },
  {
    id: 'family',
    name: 'Family & Maternity',
    count: 5,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1601294281485-2b5a214689dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBwb3J0cmFpdCUyMG91dGRvb3J8ZW58MXx8fHwxNzYyNDI3NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Family Session',
        session: 'Johnson Family'
      },
      {
        url: 'https://images.unsplash.com/photo-1639400786129-29aef6b3ce38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRlcm5pdHklMjBwcmVnbmFuY3klMjBwaG90b3N8ZW58MXx8fHwxNzYyNTEyMDkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Maternity',
        session: 'Expecting Joy'
      },
      {
        url: 'https://images.unsplash.com/photo-1688048703620-4554ea8b7f24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWJ5JTIwbmV3Ym9ybiUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2MjUxMjA5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Newborn',
        session: 'Baby Oliver'
      },
      {
        url: 'https://images.unsplash.com/photo-1632613714614-e817d3814a8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZlc3R5bGUlMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NjI0NzQwODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Lifestyle',
        session: 'Smith Family'
      },
      {
        url: 'https://images.unsplash.com/photo-1611456531646-2a68d6df2723?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjI0MjE2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Extended Family',
        session: 'Holiday Portraits'
      }
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion Editorial',
    count: 7,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1611456531646-2a68d6df2723?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjI0MjE2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Vogue Inspired',
        session: 'Editorial 2024'
      },
      {
        url: 'https://images.unsplash.com/photo-1709887139259-e5fdce21afa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZGl0b3JpYWwlMjBmYXNoaW9uJTIwbW9kZWx8ZW58MXx8fHwxNzYyNTExNzcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Modern Elegance',
        session: 'Spring Collection'
      },
      {
        url: 'https://images.unsplash.com/photo-1614492025699-2a9ea5b8c58b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZWRpdG9yaWFsJTIwc3R5bGV8ZW58MXx8fHwxNzYyNDk1NDk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Street Style',
        session: 'Urban Fashion'
      },
      {
        url: 'https://images.unsplash.com/photo-1686774272000-7096622ba435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwZmFzaGlvbiUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2MjUxMTc3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Outdoor Fashion',
        session: 'Summer Campaign'
      },
      {
        url: 'https://images.unsplash.com/photo-1593382067395-ace3045a1547?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHBvcnRyYWl0JTIwYXJ0fGVufDF8fHx8MTc2MjQ3Mzg3MXww&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Avant Garde',
        session: 'Art Direction'
      },
      {
        url: 'https://images.unsplash.com/photo-1682113297701-add548fca303?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlkYWwlMjBwb3J0cmFpdCUyMGZhc2hpb258ZW58MXx8fHwxNzYyNTEyMDkzfDA&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Haute Couture',
        session: 'Designer Series'
      },
      {
        url: 'https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2MjQ4NDk4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        title: 'Minimalist',
        session: 'Clean Lines'
      }
    ]
  }
];

// Calculate total for "All Sessions"
photoSessions[0].count = photoSessions.slice(1).reduce((sum, session) => sum + session.count, 0);
photoSessions[0].photos = photoSessions.slice(1).flatMap(session => session.photos);

export function Portfolio() {
  const [selectedSession, setSelectedSession] = useState('all');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const currentSession = photoSessions.find(s => s.id === selectedSession);
  const photos = currentSession?.photos || [];

  return (
    <section id="portfolio" className="py-24 px-6 bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl mb-4 italic">Portfolio</h2>
          <p className="text-gray-600 mb-12">
            Browse through my photo sessions
          </p>
        </motion.div>

        {/* Folder-style category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {photoSessions.map((session, index) => (
              <motion.button
                key={session.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedSession(session.id)}
                className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${
                  selectedSession === session.id
                    ? 'bg-black text-white border-black shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  {selectedSession === session.id ? (
                    <FolderOpen size={32} className="text-white" />
                  ) : (
                    <Folder size={32} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                  )}
                  <div className="text-center">
                    <p className="mb-1">{session.name}</p>
                    <div className="flex items-center justify-center space-x-1 text-sm opacity-70">
                      <ImageIcon size={14} />
                      <span>{session.count}</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Photo Grid - Unsplash Style */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSession}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Unsplash-style multi-column layout */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {photos.map((photo, index) => {
                // Vary heights for Unsplash-style grid
                const heights = ['h-64', 'h-80', 'h-96', 'h-72', 'h-[28rem]', 'h-[20rem]'];
                const randomHeight = heights[index % heights.length];
                
                return (
                  <motion.div
                    key={`${selectedSession}-${index}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className={`relative overflow-hidden rounded-lg cursor-pointer group break-inside-avoid ${randomHeight}`}
                  >
                    <ImageWithFallback
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="mb-1">{photo.title}</h3>
                        <p className="text-sm text-gray-300">{photo.session}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {photos.length === 0 && (
              <div className="text-center py-20">
                <Folder size={64} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No photos in this session</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
