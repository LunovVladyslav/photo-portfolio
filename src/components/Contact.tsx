import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! I will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-24 px-6 bg-neutral-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl mb-4 italic">Get In Touch</h2>
          <p className="text-gray-600">
            Let's create something beautiful together
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="mr-4 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-gray-600">Email</p>
                  <p>hello@kellymckeefrey.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="mr-4 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="mr-4 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-gray-600">Studio</p>
                  <p>123 Fashion Avenue<br />New York, NY 10001</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-xl mb-4">Follow Me</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="p-3 bg-white rounded-full hover:bg-black hover:text-white transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  className="p-3 bg-white rounded-full hover:bg-black hover:text-white transition-colors"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#"
                  className="p-3 bg-white rounded-full hover:bg-black hover:text-white transition-colors"
                >
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm">
                  Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm">
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block mb-2 text-sm">
                  Phone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 text-sm">
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
