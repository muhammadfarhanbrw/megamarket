// app/components/Slider.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const response = await fetch('/api/slider');
      const data = await response.json();
      if (data.success && data.sliders.length > 0) {
        setSlides(data.sliders.filter(s => s.isActive));
      } else {
        // Default fallback slides
        setSlides([
          {
            _id: '1',
            title: "Summer Collection 2025",
            subtitle: "Up to 40% Off",
            description: "Discover the latest trends in fashion and beauty",
            imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop",
            buttonText: "Shop Now",
            category: "Garments"
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching sliders:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, slides.length]);

  if (loading || slides.length === 0) return null;

  return (
    <div 
      className="relative w-full px-4 md:px-8 lg:px-12"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative w-full h-75 md:h-100 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide._id}
            className={`absolute inset-0 transition-all duration-1000 ease-out transform ${
              index === currentIndex ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}
          >
            <div className="absolute inset-0">
              <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30"></div>
            </div>

            <div className="relative h-full flex items-center ml-8">
              <div className="max-w-2xl text-white px-6 md:px-10">
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs mb-3">
                  {slide.category || "Featured"}
                </span>
                <h2 className="text-3xl md:text-5xl font-bold mb-2">{slide.title}</h2>
                <p className="text-xl md:text-2xl font-semibold mb-2 text-yellow-300">{slide.subtitle}</p>
                <p className="text-sm md:text-base mb-4">{slide.description}</p>
                <button className="bg-white text-gray-900 px-6 py-2 font-semibold hover:shadow-xl transition flex items-center gap-2">
                  {slide.buttonText}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Buttons - Show on hover */}
        <button 
          onClick={prevSlide} 
          className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 hover:bg-white/40 transition-all duration-300 ${
            isHovering ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={nextSlide} 
          className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 hover:bg-white/40 transition-all duration-300 ${
            isHovering ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setCurrentIndex(idx); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 5000); }}
              className={`transition-all duration-300 ${idx === currentIndex ? "w-8 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"} rounded-full`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;