'use client';

import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  Clock,
  Shield,
  Truck,
  RefreshCw,
  Heart
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart size={24} className="text-purple-400 fill-purple-400" />
              <h2 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MegaMarket
              </h2>
            </div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Your one-stop destination for fashion, beauty, and lifestyle products. 
              We bring you quality products at affordable prices.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                <Youtube size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-purple-500 mt-1"></span>
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">Shop</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">Order Status</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Customer Service
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-purple-500 mt-1"></span>
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">Shipping Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">Return Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition text-sm">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Contact Info - UPDATED with your details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Contact Info
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-purple-500 mt-1"></span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={16} className="mt-0.5 shrink-0 text-purple-400" />
                <span>Burewal, Pakistan</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone size={16} className="shrink-0 text-purple-400" />
                <a href="tel:+923198842738" className="hover:text-purple-400 transition">+92 319 8842738</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={16} className="shrink-0 text-purple-400" />
                <a href="mailto:mrkali0709@gmail.com" className="hover:text-purple-400 transition">mrkali0709@gmail.com</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Clock size={16} className="shrink-0 text-purple-400" />
                <span>Mon - Fri: 9AM - 6PM EST</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 py-8 mt-8 border-t border-gray-800">
          <div className="flex items-center justify-center gap-3 text-gray-400">
            <Truck size={20} className="text-purple-400" />
            <div>
              <p className="text-sm font-semibold text-white">Free Shipping</p>
              <p className="text-xs">On orders over $500</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-400">
            <Shield size={20} className="text-purple-400" />
            <div>
              <p className="text-sm font-semibold text-white">Secure Payment</p>
              <p className="text-xs">100% protected</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-400">
            <RefreshCw size={20} className="text-purple-400" />
            <div>
              <p className="text-sm font-semibold text-white">Easy Returns</p>
              <p className="text-xs">damage claim guarantee</p>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="text-center pt-6 mt-6 border-t border-gray-800">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} EcomRace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;