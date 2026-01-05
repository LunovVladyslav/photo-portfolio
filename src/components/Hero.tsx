import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroProps {
  onScrollDown: () => void;
}

export function Hero({ onScrollDown }: HeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1761429945327-97e5f01433ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwcGhvdG9ncmFwaHklMjBzdHVkaW98ZW58MXx8fHwxNzYyNjg3NTQyfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Photography Studio Background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="text-center z-10 px-6 text-white">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl mb-4 italic"
        >
          Kelly McKeefrey
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-200 mb-12 italic"
        >
          Visionary of Style
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          onClick={onScrollDown}
          className="inline-flex items-center space-x-2 text-sm tracking-wider hover:text-gray-300 transition-colors"
        >
          <span>Explore My Work</span>
          <ArrowDown size={16} />
        </motion.button>
      </div>

      {/* Animated scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowDown size={24} className="text-white/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}
