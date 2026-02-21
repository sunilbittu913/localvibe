import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Local<span className="text-primary-500">Vibe</span></span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Discover local businesses, services, and deals near you. Connect with your community through LocalVibe.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/discover" className="text-sm hover:text-primary-500 transition-colors">Discover Businesses</Link></li>
              <li><Link to="/jobs" className="text-sm hover:text-primary-500 transition-colors">Job Search</Link></li>
              <li><Link to="/offers" className="text-sm hover:text-primary-500 transition-colors">Offers & Deals</Link></li>
              <li><Link to="/register" className="text-sm hover:text-primary-500 transition-colors">List Your Business</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:text-primary-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm hover:text-primary-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm hover:text-primary-500 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm hover:text-primary-500 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-primary-500" />
                <span>support@localvibe.in</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-primary-500" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-primary-500 mt-0.5" />
                <span>Hyderabad, Telangana, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} LocalVibe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
