// // app/components/TrendingDealsSlider.js
// 'use client';

// import { useState, useEffect, useRef } from 'react';

// export default function TrendingDealsSlider({ addToCart }) {
//   const [deals, setDeals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [timeLeft, setTimeLeft] = useState({});
//   const sliderRef = useRef(null);
//   const [scrollPosition, setScrollPosition] = useState(0);
//   const [maxScroll, setMaxScroll] = useState(0);

//   useEffect(() => {
//     fetchDeals();
//     // Refresh deals every 30 seconds
//     const interval = setInterval(fetchDeals, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchDeals = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('/api/trending-deals?active=true');
//       const data = await res.json();
//       console.log('Fetched deals:', data); // Debug log
      
//       if (data.success) {
//         // Filter out expired deals
//         const activeDeals = data.deals.filter(deal => {
//           const endDate = new Date(deal.endDate);
//           const now = new Date();
//           return deal.isActive && endDate > now;
//         });
//         setDeals(activeDeals);
//         setError(null);
//       } else {
//         setError('Failed to load deals');
//       }
//     } catch (error) {
//       console.error('Error fetching deals:', error);
//       setError('Error loading deals');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (deals.length === 0) return;

//     const timer = setInterval(() => {
//       const newTimeLeft = {};
//       const now = new Date().getTime();
      
//       deals.forEach(deal => {
//         const endTime = new Date(deal.endDate).getTime();
//         const difference = endTime - now;

//         if (difference > 0) {
//           const days = Math.floor(difference / (1000 * 60 * 60 * 24));
//           const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//           const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
//           const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          
//           newTimeLeft[deal._id] = { days, hours, minutes, seconds };
//         } else {
//           newTimeLeft[deal._id] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
//         }
//       });
//       setTimeLeft(newTimeLeft);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [deals]);

//   useEffect(() => {
//     if (sliderRef.current && deals.length > 0) {
//       const updateMaxScroll = () => {
//         const container = sliderRef.current;
//         const maxScrollAmount = container.scrollWidth - container.clientWidth;
//         setMaxScroll(maxScrollAmount);
//       };
//       updateMaxScroll();
//       window.addEventListener('resize', updateMaxScroll);
//       return () => window.removeEventListener('resize', updateMaxScroll);
//     }
//   }, [deals]);

//   const handleScroll = () => {
//     if (sliderRef.current) {
//       setScrollPosition(sliderRef.current.scrollLeft);
//     }
//   };

//   const scrollLeft = () => {
//     if (sliderRef.current) {
//       sliderRef.current.scrollBy({ left: -380, behavior: 'smooth' });
//     }
//   };

//   const scrollRight = () => {
//     if (sliderRef.current) {
//       sliderRef.current.scrollBy({ left: 380, behavior: 'smooth' });
//     }
//   };

//   const handleAddToCart = (deal) => {
//     const productToAdd = {
//       _id: deal.productId?._id || deal.productId || `deal_${deal._id}`,
//       name: deal.title,
//       price: deal.dealPrice,
//       image: deal.image,
//       categories: 'Deals',
//       description: deal.description,
//       sellerId: 'trending-deal'
//     };
    
//     if (addToCart) {
//       addToCart(productToAdd);
//     }
//   };

//   if (loading && deals.length === 0) {
//     return (
//       <div className="mb-16 text-center">
//         <div className="animate-pulse">
//           <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
//           <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return null; // Hide if error, don't show anything
//   }

//   if (deals.length === 0) {
//     return null; // No deals to show
//   }

//   return (
//     <div className="mb-16">
//       <div className="text-center mb-8">
//         <div className="flex items-center justify-center gap-2 mb-3">
//           <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
//           <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Limited Time</span>
//           <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
//         </div>
//         <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
//           🔥 Trending Deals
//         </h2>
//         <p className="text-gray-600 mt-2">Grab these hot offers before they're gone!</p>
//       </div>

//       <div className="relative group">
//         <button
//           onClick={scrollLeft}
//           disabled={scrollPosition <= 0}
//           className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 transition-all duration-300 ${
//             scrollPosition <= 0 
//               ? "opacity-0 cursor-not-allowed" 
//               : "opacity-0 group-hover:opacity-100 hover:scale-110"
//           }`}
//         >
//           <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//         </button>

//         <button
//           onClick={scrollRight}
//           disabled={scrollPosition >= maxScroll - 10}
//           className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 transition-all duration-300 ${
//             scrollPosition >= maxScroll - 10 
//               ? "opacity-0 cursor-not-allowed" 
//               : "opacity-0 group-hover:opacity-100 hover:scale-110"
//           }`}
//         >
//           <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </button>

//         <div
//           ref={sliderRef}
//           onScroll={handleScroll}
//           className="flex overflow-x-auto gap-6 pb-4 scroll-smooth"
//           style={{ scrollbarWidth: 'thin' }}
//         >
//           {deals.map((deal) => {
//             const time = timeLeft[deal._id] || { days: 0, hours: 0, minutes: 0, seconds: 0 };
//             const isExpired = time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0;
            
//             if (isExpired) return null;
            
//             return (
//               <div key={deal._id} className="shrink-0 w-80">
//                 <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
//                   <div className="relative h-48">
//                     <img
//                       src={deal.image}
//                       alt={deal.title}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.target.src = 'https://via.placeholder.com/400x300?text=Deal+Image';
//                       }}
//                     />
//                     <div className="absolute top-2 right-2">
//                       <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
//                         -{deal.discountPercentage}%
//                       </div>
//                     </div>
//                     {deal.priority > 1 && (
//                       <div className="absolute top-2 left-2">
//                         <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
//                           🔥 Hot Deal
//                         </div>
//                       </div>
//                     )}
//                   </div>
                  
//                   <div className="p-4">
//                     <h3 className="font-semibold text-lg text-gray-800 mb-1">{deal.title}</h3>
//                     <p className="text-gray-600 text-sm mb-3 line-clamp-2">{deal.description}</p>
                    
//                     <div className="flex items-center gap-2 mb-3">
//                       <span className="text-2xl font-bold text-orange-600">
//                         ₹{Number(deal.dealPrice).toFixed(2)}
//                       </span>
//                       <span className="text-gray-400 line-through text-sm">
//                         ₹{Number(deal.originalPrice).toFixed(2)}
//                       </span>
//                     </div>
                    
//                     <div className="bg-gray-100 rounded-lg p-2 mb-3">
//                       <p className="text-xs text-gray-600 text-center mb-1">Ends in:</p>
//                       <div className="flex justify-center gap-2">
//                         <div className="text-center">
//                           <div className="bg-white rounded-lg px-2 py-1">
//                             <span className="font-bold text-sm">{time.days}</span>
//                           </div>
//                           <span className="text-xs">Days</span>
//                         </div>
//                         <div className="text-center">
//                           <div className="bg-white rounded-lg px-2 py-1">
//                             <span className="font-bold text-sm">{time.hours}</span>
//                           </div>
//                           <span className="text-xs">Hours</span>
//                         </div>
//                         <div className="text-center">
//                           <div className="bg-white rounded-lg px-2 py-1">
//                             <span className="font-bold text-sm">{time.minutes}</span>
//                           </div>
//                           <span className="text-xs">Mins</span>
//                         </div>
//                         <div className="text-center">
//                           <div className="bg-white rounded-lg px-2 py-1">
//                             <span className="font-bold text-sm">{time.seconds}</span>
//                           </div>
//                           <span className="text-xs">Secs</span>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <button
//                       onClick={() => handleAddToCart(deal)}
//                       className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-semibold"
//                     >
//                       Grab Deal 🛒
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
      
//       <style jsx>{`
//         .scrollbar-thin::-webkit-scrollbar {
//           height: 6px;
//         }
//         .scrollbar-thin::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 10px;
//         }
//         .scrollbar-thin::-webkit-scrollbar-thumb {
//           background: linear-gradient(to right, #f97316, #ef4444);
//           border-radius: 10px;
//         }
//       `}</style>
//     </div>
//   );
// }

// app/components/TrendingDealsSlider.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { Eye, ShoppingBag, Zap, Clock, X } from 'lucide-react';

export default function TrendingDealsSlider({ addToCart }) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const sliderRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [selectedDeal, setSelectedDeal] = useState(null);

  useEffect(() => {
    fetchDeals();
    const interval = setInterval(fetchDeals, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/trending-deals?active=true');
      const data = await res.json();
      
      if (data.success) {
        const activeDeals = data.deals.filter(deal => {
          const endDate = new Date(deal.endDate);
          const now = new Date();
          return deal.isActive && endDate > now;
        });
        setDeals(activeDeals);
        setError(null);
      } else {
        setError('Failed to load deals');
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
      setError('Error loading deals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deals.length === 0) return;

    const timer = setInterval(() => {
      const newTimeLeft = {};
      const now = new Date().getTime();
      
      deals.forEach(deal => {
        const endTime = new Date(deal.endDate).getTime();
        const difference = endTime - now;

        if (difference > 0) {
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          
          newTimeLeft[deal._id] = { hours, minutes, seconds };
        } else {
          newTimeLeft[deal._id] = { hours: 0, minutes: 0, seconds: 0 };
        }
      });
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [deals]);

  useEffect(() => {
    if (sliderRef.current && deals.length > 0) {
      const updateMaxScroll = () => {
        const container = sliderRef.current;
        const maxScrollAmount = container.scrollWidth - container.clientWidth;
        setMaxScroll(maxScrollAmount);
      };
      updateMaxScroll();
      window.addEventListener('resize', updateMaxScroll);
      return () => window.removeEventListener('resize', updateMaxScroll);
    }
  }, [deals]);

  const handleScroll = () => {
    if (sliderRef.current) {
      setScrollPosition(sliderRef.current.scrollLeft);
    }
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (deal) => {
    const productToAdd = {
      _id: deal.productId?._id || deal.productId || `deal_${deal._id}`,
      name: deal.title,
      price: deal.dealPrice,
      image: deal.image,
      categories: 'Deals',
      description: deal.description,
      sellerId: 'trending-deal'
    };
    
    if (addToCart) {
      addToCart(productToAdd);
    }
  };

  const handleImageError = (dealId) => {
    setImageErrors(prev => ({
      ...prev,
      [dealId]: true
    }));
  };

  const getImageUrl = (deal) => {
    if (imageErrors[deal._id]) {
      return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop';
    }
    return deal.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop';
  };

  const formatTime = (time) => {
    return String(time).padStart(2, '0');
  };

  if (loading && deals.length === 0) {
    return (
      <div className="mb-12">
        <div className="text-center mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1,2,3,4].map(i => (
            <div key={i} className="shrink-0 w-80 animate-pulse">
              <div className="bg-gray-200 rounded-2xl h-[500px]"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || deals.length === 0) return null;

  return (
    <div className="mb-12">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-6 px-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-orange-500 fill-orange-500" />
            <h2 className="text-2xl font-bold text-gray-800">Trending Deals</h2>
          </div>
          <p className="text-gray-500 text-sm">Limited time offers</p>
        </div>
        <button className="text-orange-500 text-sm font-semibold hover:text-orange-600 transition">
          View All →
        </button>
      </div>

      {/* Slider Section */}
      <div className="relative group px-4">
        {/* Navigation Buttons */}
        <button
          onClick={scrollLeft}
          disabled={scrollPosition <= 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-xl rounded-full p-2 transition-all duration-300 ${
            scrollPosition <= 0 
              ? "opacity-0 cursor-not-allowed" 
              : "opacity-0 group-hover:opacity-100 hover:scale-110"
          }`}
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={scrollRight}
          disabled={scrollPosition >= maxScroll - 10}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-xl rounded-full p-2 transition-all duration-300 ${
            scrollPosition >= maxScroll - 10 
              ? "opacity-0 cursor-not-allowed" 
              : "opacity-0 group-hover:opacity-100 hover:scale-110"
          }`}
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slider Container */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-5 scroll-smooth pb-4"
          style={{ scrollbarWidth: 'thin' }}
        >
          {deals.map((deal) => {
            const time = timeLeft[deal._id] || { hours: 0, minutes: 0, seconds: 0 };
            const isExpired = time.hours === 0 && time.minutes === 0 && time.seconds === 0;
            
            if (isExpired) return null;
            
            const discountAmount = ((deal.originalPrice - deal.dealPrice) / deal.originalPrice * 100).toFixed(0);
            
            return (
              <div key={deal._id} className="shrink-0 w-80">
                <div className="relative rounded-2xl overflow-hidden shadow-lg group/card h-[500px]">
                  {/* Background Image - Full Card Height */}
                  <img
                    src={getImageUrl(deal)}
                    alt={deal.title}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(deal._id)}
                  />

                  {/* Gradient Overlay for Text Readability - Bottom only */}
                  <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

                  {/* Badges - Top */}
                  <div className="absolute top-4 left-4 right-4 z-10 flex justify-between pointer-events-none">
                    <div className="flex gap-2">
                      {deal.priority > 1 && (
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 pointer-events-auto">
                          <Zap className="w-3 h-3 fill-white" />
                          Hot Deal
                        </div>
                      )}
                    </div>
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg pointer-events-auto">
                      -{discountAmount}% OFF
                    </div>
                  </div>

                  {/* Content - Bottom - Transparent Background */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 drop-shadow-lg">
                      {deal.title}
                    </h3>
                    
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-bold text-orange-400 drop-shadow-lg">
                        ₹{Number(deal.dealPrice).toFixed(0)}
                      </span>
                      <span className="text-white/70 line-through text-sm drop-shadow">
                        ₹{Number(deal.originalPrice).toFixed(0)}
                      </span>
                      <span className="text-green-400 text-xs font-semibold ml-auto drop-shadow">
                        Save ₹{(deal.originalPrice - deal.dealPrice).toFixed(0)}
                      </span>
                    </div>

                    {/* Timer - Semi-transparent */}
                    <div className="flex items-center gap-2 mb-3 p-2 bg-black/40 backdrop-blur-md rounded-lg">
                      <Clock className="w-4 h-4 text-orange-400" />
                      <span className="text-xs font-medium text-white">Ends in:</span>
                      <div className="flex gap-1 ml-auto">
                        <div className="bg-black/60 backdrop-blur rounded px-2 py-0.5">
                          <span className="text-sm font-bold text-white">{formatTime(time.hours)}</span>
                          <span className="text-xs text-white/70 ml-0.5">h</span>
                        </div>
                        <span className="text-white">:</span>
                        <div className="bg-black/60 backdrop-blur rounded px-2 py-0.5">
                          <span className="text-sm font-bold text-white">{formatTime(time.minutes)}</span>
                          <span className="text-xs text-white/70 ml-0.5">m</span>
                        </div>
                        <span className="text-white">:</span>
                        <div className="bg-black/60 backdrop-blur rounded px-2 py-0.5">
                          <span className="text-sm font-bold text-white">{formatTime(time.seconds)}</span>
                          <span className="text-xs text-white/70 ml-0.5">s</span>
                        </div>
                      </div>
                    </div>

                    {/* Buttons - Semi-transparent */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedDeal(deal)}
                        className="flex-1 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1 border border-white/30"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleAddToCart(deal)}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1 shadow-lg"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Grab
                      </button>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/10 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal - Clean Light Design */}
      {selectedDeal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedDeal(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Section */}
            <div className="relative bg-gradient-to-br from-orange-50 to-red-50">
              <div className="w-full h-80 md:h-96">
                <img
                  src={getImageUrl(selectedDeal)}
                  alt={selectedDeal.title}
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={() => setSelectedDeal(null)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition z-10"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
                <div className="absolute top-4 left-4">
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    -{((selectedDeal.originalPrice - selectedDeal.dealPrice) / selectedDeal.originalPrice * 100).toFixed(0)}% OFF
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-20rem)]">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{selectedDeal.title}</h3>
              <p className="text-gray-600 text-base mb-6 leading-relaxed">{selectedDeal.description}</p>
              
              <div className="flex items-baseline gap-3 mb-6 pb-4 border-b">
                <span className="text-4xl font-bold text-orange-600">₹{selectedDeal.dealPrice}</span>
                <span className="text-gray-400 line-through text-lg">₹{selectedDeal.originalPrice}</span>
                <span className="text-green-600 text-base font-semibold ml-auto">
                  Save ₹{(selectedDeal.originalPrice - selectedDeal.dealPrice).toFixed(0)}
                </span>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleAddToCart(selectedDeal);
                    setSelectedDeal(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition transform hover:scale-105 text-lg"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setSelectedDeal(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition text-lg"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .flex::-webkit-scrollbar {
          height: 4px;
        }
        
        .flex::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .flex::-webkit-scrollbar-thumb {
          background: linear-gradient(to right, #f97316, #ef4444);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}