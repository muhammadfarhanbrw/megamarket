'use client';

import { 
  Truck, 
  Shield, 
  RefreshCw, 
  Headphones, 
  Gift, 
  CreditCard,
  Clock,
  MapPin,
  CheckCircle,
  Package,
  Lock,
  Zap,
  ShoppingBag,
  Phone,
  Mail,
  Building2
} from 'lucide-react';

const Page = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      
      {/* Hero Section - Responsive margins for mobile */}
      <div className="relative bg-linear-to-r from-blue-700 to-purple-700 text-white py-12 md:py-20 mx-4 md:m-8 lg:m-12 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 md:px-4 py-1 mb-3 md:mb-4 backdrop-blur-sm">
              <Zap size={14} className="md:w-4 md:h-4" />
              <span className="text-xs md:text-sm">Our Services</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 leading-tight">
              We Deliver <br />Across Pakistan
            </h1>
            <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto px-2">
              Experience premium shopping services designed for your convenience across Pakistan
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16">
        
        {/* Core Services Grid */}
        <div className="mb-12 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-3 md:mb-4">What We Offer</h2>
          <p className="text-sm md:text-base text-center text-gray-600 mb-8 md:mb-12 px-4">Comprehensive services to enhance your shopping experience</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            
            {/* Free Shipping */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-xl transition group">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-blue-500 transition">
                <Truck size={24} className="md:w-7 md:h-7 text-blue-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-600">Enjoy free shipping on all orders over PKR 5,000 across Pakistan.</p>
              <div className="mt-3 text-xs text-blue-600 font-medium">Minimum order: PKR 5,000</div>
            </div>

            {/* Secure Payments */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-xl transition group">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-green-500 transition">
                <Lock size={24} className="md:w-7 md:h-7 text-green-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Secure Payments</h3>
              <p className="text-sm text-gray-600">Multiple payment options including Cash on Delivery, Bank Transfer, and EasyPaisa.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Cash on Delivery</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">EasyPaisa</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Bank Transfer</span>
              </div>
            </div>

            {/* Easy Returns */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-xl transition group">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-purple-500 transition">
                <RefreshCw size={24} className="md:w-7 md:h-7 text-purple-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Easy Returns</h3>
              <p className="text-sm text-gray-600">7-day return policy. No questions asked on defective or wrong items.</p>
              <div className="mt-3 text-xs text-purple-600 font-medium">7-day guarantee</div>
            </div>

            {/* 24/7 Support */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-xl transition group">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-orange-500 transition">
                <Headphones size={24} className="md:w-7 md:h-7 text-orange-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Customer Support</h3>
              <p className="text-sm text-gray-600">Dedicated support via phone, email, and WhatsApp. We're here to help!</p>
              <div className="mt-3 text-xs text-orange-600 font-medium">Response within 2 hours</div>
            </div>

            {/* Gift Wrapping */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-xl transition group">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-pink-500 transition">
                <Gift size={24} className="md:w-7 md:h-7 text-pink-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Gift Wrapping</h3>
              <p className="text-sm text-gray-600">Premium gift wrapping with personalized messages. Perfect for special occasions.</p>
              <div className="mt-3 text-xs text-pink-600 font-medium">Add at checkout</div>
            </div>

            {/* Express Delivery */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-xl transition group">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-indigo-500 transition">
                <Clock size={24} className="md:w-7 md:h-7 text-indigo-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Express Delivery</h3>
              <p className="text-sm text-gray-600">Fast delivery in major cities. Same-day delivery in Lahore, Multan, and Faisalabad.</p>
              <div className="mt-3 text-xs text-indigo-600 font-medium">1-3 business days</div>
            </div>
          </div>
        </div>

        {/* Delivery Coverage - Updated for Pakistan */}
        <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-10 mb-12 md:mb-20 text-white">
          <div className="text-center mb-6 md:mb-8">
            <MapPin size={36} className="md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-white/80" />
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Delivery Coverage</h2>
            <p className="text-sm md:text-base text-white/90">We deliver to major cities across Pakistan</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="font-semibold text-sm md:text-base">Lahore</div>
              <div className="text-xs md:text-sm text-white/80">Same-day delivery</div>
            </div>
            <div>
              <div className="font-semibold text-sm md:text-base">Multan</div>
              <div className="text-xs md:text-sm text-white/80">Express delivery available</div>
            </div>
            <div>
              <div className="font-semibold text-sm md:text-base">Faisalabad</div>
              <div className="text-xs md:text-sm text-white/80">Fast delivery</div>
            </div>
            <div>
              <div className="font-semibold text-sm md:text-base">Burewala</div>
              <div className="text-xs md:text-sm text-white/80">Standard delivery</div>
            </div>
          </div>
          <div className="text-center mt-6 text-sm text-white/80">
            <p>Plus delivery to all major cities and towns across Pakistan</p>
          </div>
        </div>

        {/* Service Process - Responsive */}
        <div className="mb-12 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-3 md:mb-4">How It Works</h2>
          <p className="text-sm md:text-base text-center text-gray-600 mb-8 md:mb-12">Simple steps to get your products delivered</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 relative">
                <span className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-blue-600 text-white rounded-full text-xs md:text-sm flex items-center justify-center">1</span>
                <ShoppingBag size={22} className="md:w-7 md:h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">Browse & Select</h3>
              <p className="text-xs text-gray-500">Choose from 500+ products</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 relative">
                <span className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-green-600 text-white rounded-full text-xs md:text-sm flex items-center justify-center">2</span>
                <CreditCard size={22} className="md:w-7 md:h-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">Place Order</h3>
              <p className="text-xs text-gray-500">Secure checkout with COD</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 relative">
                <span className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-purple-600 text-white rounded-full text-xs md:text-sm flex items-center justify-center">3</span>
                <Package size={22} className="md:w-7 md:h-7 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">Fast Processing</h3>
              <p className="text-xs text-gray-500">We pack & ship within 24h</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 relative">
                <span className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-orange-600 text-white rounded-full text-xs md:text-sm flex items-center justify-center">4</span>
                <Truck size={22} className="md:w-7 md:h-7 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">Doorstep Delivery</h3>
              <p className="text-xs text-gray-500">Track your order in real-time</p>
            </div>
          </div>
        </div>

        {/* Guarantee Section - Responsive */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg mb-12 md:mb-16">
          <div className="text-center mb-6 md:mb-8">
            <Shield size={36} className="md:w-12 md:h-12 mx-auto text-green-500 mb-3" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Our Guarantees</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="md:w-5 md:h-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-800 text-sm md:text-base">100% Authentic Products</h4>
                <p className="text-xs text-gray-500">No counterfeits. Ever.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="md:w-5 md:h-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-800 text-sm md:text-base">Best Price Guarantee</h4>
                <p className="text-xs text-gray-500">Quality products at best prices</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="md:w-5 md:h-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-800 text-sm md:text-base">Secure Packaging</h4>
                <p className="text-xs text-gray-500">Eco-friendly & damage-proof</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA - Updated with Pakistan info */}
        <div className="text-center bg-linear-to-r from-gray-50 to-gray-100 rounded-2xl p-6 md:p-10">
          <Headphones size={36} className="md:w-12 md:h-12 mx-auto text-purple-600 mb-3 md:mb-4" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Need Help?</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">Our support team is ready to assist you</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <div className="flex items-center justify-center gap-2 bg-white px-4 md:px-5 py-2 rounded-full shadow">
              <Phone size={16} className="md:w-4.5 text-purple-600" />
              <span className="text-sm text-gray-700">0319 8842738</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white px-4 md:px-5 py-2 rounded-full shadow">
              <Mail size={16} className="md:w-4.5 text-purple-600" />
              <span className="text-sm text-gray-700">mrkali0709@gmail.com</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 size={14} />
              <span>Lahore</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 size={14} />
              <span>Multan</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 size={14} />
              <span>Faisalabad</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 size={14} />
              <span>Burewala</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;