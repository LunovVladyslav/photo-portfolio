import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Check, Calendar, Clock, Mail, User, Phone, MessageSquare } from 'lucide-react';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

const pricingPlans = [
  {
    id: 'portrait',
    name: 'Portrait Session',
    price: '$500',
    duration: '2 hours',
    features: [
      'Studio or outdoor location',
      '2 outfit changes',
      '20 edited high-resolution images',
      'Online gallery for 30 days',
      'Print release included'
    ]
  },
  {
    id: 'editorial',
    name: 'Editorial Package',
    price: '$1,200',
    duration: '4 hours',
    features: [
      'Multiple locations',
      'Unlimited outfit changes',
      '50 edited high-resolution images',
      'Creative direction & styling consultation',
      'Online gallery for 60 days',
      'Print release included',
      'Makeup artist available'
    ],
    featured: true
  },
  {
    id: 'commercial',
    name: 'Commercial Project',
    price: 'Custom',
    duration: 'Flexible',
    features: [
      'Full-day or multi-day shoots',
      'Unlimited locations',
      'Full image licensing',
      'Dedicated creative team',
      'Rush delivery available',
      'Brand strategy consultation'
    ]
  }
];

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  package: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}

export function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    package: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });

  const handleBookNow = (packageName: string) => {
    setSelectedPackage(packageName);
    setFormData(prev => ({ ...prev, package: packageName }));
    setIsBookingOpen(true);
  };

  const handleChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', formData);
    toast.success('Booking request sent! We\'ll contact you within 24 hours.');
    setIsBookingOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      package: selectedPackage,
      preferredDate: '',
      preferredTime: '',
      message: ''
    });
  };

  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl mb-4 italic">Pricing</h2>
          <p className="text-gray-600">
            Investment in timeless imagery
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card
                className={`p-8 h-full transition-all duration-300 hover:shadow-xl ${
                  plan.featured
                    ? 'border-2 border-black bg-neutral-50'
                    : 'border border-gray-200'
                }`}
              >
                {plan.featured && (
                  <div className="inline-block px-3 py-1 bg-black text-white text-xs tracking-wider rounded-full mb-4">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl">{plan.price}</span>
                  {plan.duration && (
                    <span className="text-gray-500 ml-2">/ {plan.duration}</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check size={20} className="mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleBookNow(plan.name)}
                  variant={plan.featured ? 'default' : 'outline'}
                  className="w-full"
                >
                  Book Now
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Book Your Session</DialogTitle>
            <DialogDescription>
              Fill out the form below and we'll get back to you within 24 hours to confirm your booking.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Package Selection */}
            <div className="space-y-2">
              <Label htmlFor="package">Selected Package *</Label>
              <Select
                value={formData.package}
                onValueChange={(value) => handleChange('package', value)}
                required
              >
                <SelectTrigger id="package">
                  <SelectValue placeholder="Select a package" />
                </SelectTrigger>
                <SelectContent>
                  {pricingPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.name}>
                      {plan.name} - {plan.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="John Doe"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="john@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Session Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredDate">Preferred Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => handleChange('preferredDate', e.target.value)}
                    className="pl-10"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredTime">Preferred Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="preferredTime"
                    type="time"
                    value={formData.preferredTime}
                    onChange={(e) => handleChange('preferredTime', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Additional Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Additional Information</Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Tell us more about your vision, location preferences, or any special requests..."
                  className="pl-10 min-h-[120px]"
                  rows={5}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsBookingOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Submit Booking Request
              </Button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              By submitting this form, you agree to be contacted regarding your booking request.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
