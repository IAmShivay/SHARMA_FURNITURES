import { BrandInfo, ContactInfo, SocialLinks } from '../types';

export const brandInfo: BrandInfo = {
  name: 'LuxeHome',
  tagline: 'Where Luxury Meets Comfort',
  description: 'LuxeHome is a premium furniture brand dedicated to creating exceptional pieces that transform houses into homes. Founded on the principles of quality craftsmanship, timeless design, and sustainable practices.',
  founded: '2018',
  location: 'New York, USA',
  values: [
    'Exceptional Craftsmanship',
    'Sustainable Materials',
    'Timeless Design',
    'Customer Satisfaction',
    'Innovation in Comfort'
  ]
};

export const contactInfo: ContactInfo = {
  phone: '+1 (555) 123-4567',
  email: 'hello@luxehome.com',
  address: {
    street: '123 Design Avenue',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States'
  },
  hours: {
    weekdays: 'Monday - Friday: 9:00 AM - 8:00 PM EST',
    weekends: 'Saturday - Sunday: 10:00 AM - 6:00 PM EST'
  }
};

export const socialLinks: SocialLinks = {
  facebook: 'https://facebook.com/luxehome',
  instagram: 'https://instagram.com/luxehome',
  twitter: 'https://twitter.com/luxehome',
  pinterest: 'https://pinterest.com/luxehome',
  youtube: 'https://youtube.com/luxehome'
};