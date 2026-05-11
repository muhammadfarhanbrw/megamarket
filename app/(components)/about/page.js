'use client';

import { ShoppingBag, Sparkles, Package, Truck, Shield, CreditCard, Heart, Star } from 'lucide-react';

const Page = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-pink-50">
      
      {/* Hero Section - Responsive */}
      <div className="relative bg-linear-to-r from-purple-700 to-pink-600 text-white py-12 md:py-20 mx-4 md:m-8 lg:m-12 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 md:px-4 py-1 mb-3 md:mb-4 backdrop-blur-sm">
              <Sparkles size={14} className="md:w-4 md:h-4" />
              <span className="text-xs md:text-sm">Welcome to EcomRace</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 leading-tight">
              Your Style,<br />Our Passion
            </h1>
            <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto px-2">
              Discover a world of fashion, beauty, and lifestyle essentials
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16">
        
        {/* Categories Grid - Responsive */}
        <div className="mb-12 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-3 md:mb-4">What We Offer</h2>
          <p className="text-sm md:text-base text-center text-gray-600 mb-8 md:mb-12 px-4">Curated collections for every aspect of your life</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Garments */}
            <div className="bg-white rounded-2xl p-5 md:p-8 shadow-lg hover:shadow-xl transition shadow-purple-100 border border-purple-100">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <ShoppingBag size={26} className="md:w-8 md:h-8 text-purple-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Garments</h3>
              <p className="text-sm text-gray-600">Trendy fashion for men and women. From casual wear to formal attire, we've got you covered.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">T-Shirts</span>
                <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">Jeans</span>
                <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">Dresses</span>
                <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">Hoodies</span>
              </div>
            </div>

            {/* Cosmetics */}
            <div className="bg-white rounded-2xl p-5 md:p-8 shadow-lg hover:shadow-xl transition shadow-pink-100 border border-pink-100">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-pink-100 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <Sparkles size={26} className="md:w-8 md:h-8 text-pink-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Cosmetics</h3>
              <p className="text-sm text-gray-600">Premium beauty products that enhance your natural glow. Safe, tested, and cruelty-free.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded">Lipsticks</span>
                <span className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded">Serums</span>
                <span className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded">Moisturizers</span>
                <span className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded">Palettes</span>
              </div>
            </div>

            {/* Others */}
            <div className="bg-white rounded-2xl p-5 md:p-8 shadow-lg hover:shadow-xl transition shadow-gray-100 border border-gray-100">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <Package size={26} className="md:w-8 md:h-8 text-gray-700" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">More Categories</h3>
              <p className="text-sm text-gray-600">Electronics, accessories, home decor, and everything in between.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Electronics</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Accessories</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Home Decor</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Gifts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement - Responsive */}
        <div className="bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl p-6 md:p-10 mb-12 md:mb-20 text-white text-center mx-2 md:mx-0">
          <Heart size={36} className="md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-white/80" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Our Mission</h2>
          <p className="text-base md:text-lg max-w-3xl mx-auto text-white/90 px-4">
            To bring you the best products from around the world at prices you'll love, 
            with service that makes you smile.
          </p>
        </div>

        {/* Features - Responsive */}
        <div className="mb-12 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">Why Shop With Us</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                <Truck size={20} className="md:w-6 md:h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">Free Shipping</h3>
              <p className="text-xs text-gray-500">On orders $100+</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                <Shield size={20} className="md:w-6 md:h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">Secure Payment</h3>
              <p className="text-xs text-gray-500">100% protected</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                <Package size={20} className="md:w-6 md:h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">Returns on</h3>
              <p className="text-xs text-gray-500">shade and damage Products</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                <Star size={20} className="md:w-6 md:h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">24/7 Support</h3>
              <p className="text-xs text-gray-500">Always here to help</p>
            </div>
          </div>
        </div>

        {/* Stats - Responsive */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center py-6 md:py-8 border-t border-b border-gray-200">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-purple-600">10k+</div>
            <div className="text-xs md:text-sm text-gray-500">Happy Customers</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-purple-600">500+</div>
            <div className="text-xs md:text-sm text-gray-500">Products</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-purple-600">50+</div>
            <div className="text-xs md:text-sm text-gray-500">Brands</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-purple-600">No Returns</div>
            <div className="text-xs md:text-sm text-gray-500">Policy</div>
          </div>
        </div>

        {/* Contact CTA - Responsive */}
        <div className="mt-12 md:mt-16 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Have Questions?</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">We'd love to hear from you</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 bg-white rounded-full shadow-md px-4 md:px-6 py-3 mx-4 md:mx-0">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="md:w-5 md:h-5 text-purple-600" />
              <span className="text-sm text-gray-700">mrkali0709@gmail.com</span>
            </div>
            <span className="hidden sm:block w-px h-6 bg-gray-300"></span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 font-semibold">+923198842738</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;