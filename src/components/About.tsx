import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl mb-6 italic">About Me</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                I'm a fashion and portrait photographer with over 10 years of experience
                capturing the essence of style and personality through my lens.
              </p>
              <p>
                My work has been featured in leading fashion magazines and editorials,
                where I strive to create images that tell compelling stories and evoke emotion.
              </p>
              <p>
                I believe that every photograph should be a piece of art, combining technical
                excellence with creative vision to produce timeless imagery.
              </p>
              <p>
                Whether it's a high-fashion editorial, personal portrait session, or commercial
                campaign, I bring passion, professionalism, and a unique artistic perspective
                to every project.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[600px] rounded-lg overflow-hidden"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2MjQ4NDk4Nnww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Portrait"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
