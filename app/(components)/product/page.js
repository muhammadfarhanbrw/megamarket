
// "use client";

// import { useEffect, useState, useRef } from "react";
// import TrendingDealsSlider from "../TrendingDealsSlider";

// export default function ProductsPage() {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [categoryImages, setCategoryImages] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [cart, setCart] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [mainImage, setMainImage] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [hoveredCategory, setHoveredCategory] = useState(null);
//   const dropdownRef = useRef(null);
//   const sliderRef = useRef(null);
  
//   // Slider state
//   const [scrollPosition, setScrollPosition] = useState(0);
//   const [maxScroll, setMaxScroll] = useState(0);
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 12;

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Load cart from localStorage on component mount
//   useEffect(() => {
//     const savedCart = localStorage.getItem("cart");
//     if (savedCart) {
//       setCart(JSON.parse(savedCart));
//     }
//   }, []);

//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     if (cart.length > 0) {
//       localStorage.setItem("cart", JSON.stringify(cart));
//     } else {
//       localStorage.removeItem("cart");
//     }
//     window.dispatchEvent(new Event("cartUpdated"));
//   }, [cart]);

//   // Fetch products and category images
//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/products");
//       const data = await res.json();

//       console.log("API Response:", data);

//       let productsArray = [];
      
//       if (data.success && data.products) {
//         productsArray = data.products;
//         if (data.categories) {
//           setCategories(data.categories);
//         }
        
//         if (data.categoryImages) {
//           setCategoryImages(data.categoryImages);
//         }
//       } else if (Array.isArray(data)) {
//         productsArray = data;
//       } else {
//         console.error("Unexpected response:", data);
//         setError("Failed to load products");
//         setLoading(false);
//         return;
//       }

//       setProducts(productsArray);
      
//       if (!data.categories) {
//         const uniqueCategories = [...new Set(productsArray.map(p => p.categories).filter(Boolean))];
//         setCategories(uniqueCategories);
//       }
      
//       await fetchCategoryImages();
      
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setError("Failed to fetch products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategoryImages = async () => {
//     try {
//       const res = await fetch("/api/category-images");
//       if (res.ok) {
//         const data = await res.json();
//         if (data.success && data.images) {
//           setCategoryImages(data.images);
//         }
//       }
//     } catch (error) {
//       console.log("No category images endpoint found, using product images instead");
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // Reset page when category changes
//   useEffect(() => {
//     setCurrentPage(1);
//     setIsDropdownOpen(false);
//   }, [selectedCategory]);

//   // Update max scroll when categories change
//   useEffect(() => {
//     if (sliderRef.current && categories.length > 0) {
//       const updateMaxScroll = () => {
//         const container = sliderRef.current;
//         const maxScrollAmount = container.scrollWidth - container.clientWidth;
//         setMaxScroll(maxScrollAmount);
//       };
//       updateMaxScroll();
//       window.addEventListener('resize', updateMaxScroll);
//       return () => window.removeEventListener('resize', updateMaxScroll);
//     }
//   }, [categories]);

//   const handleScroll = () => {
//     if (sliderRef.current) {
//       setScrollPosition(sliderRef.current.scrollLeft);
//     }
//   };

//   const scrollLeft = () => {
//     if (sliderRef.current) {
//       sliderRef.current.scrollBy({ left: -320, behavior: 'smooth' });
//     }
//   };

//   const scrollRight = () => {
//     if (sliderRef.current) {
//       sliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
//     }
//   };

//   const addToCart = (product) => {
//     setCart((prevCart) => {
//       const existingItem = prevCart.find((item) => item._id === product._id);
//       let newCart;
//       if (existingItem) {
//         newCart = prevCart.map((item) =>
//           item._id === product._id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       } else {
//         newCart = [...prevCart, { ...product, quantity: 1 }];
//       }
//       return newCart;
//     });

//     alert(`${product.name} added to cart!`);
//   };

//   const openModal = (product) => {
//     setSelectedProduct(product);
//     setMainImage(product.image || "https://via.placeholder.com/500x500?text=No+Image");
//     setIsModalOpen(true);
//     document.body.style.overflow = "hidden";
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedProduct(null);
//     setMainImage("");
//     document.body.style.overflow = "auto";
//   };

//   const getRelatedProducts = (product) => {
//     if (!product || !product.categories) return [];
    
//     return products
//       .filter(p => p.categories === product.categories && p._id !== product._id)
//       .slice(0, 3);
//   };

//   const filteredProducts = selectedCategory === "all" 
//     ? products 
//     : products.filter(product => product.categories === selectedCategory);

//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);
//   const nextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };
//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const getCategoryImage = (category) => {
//     if (categoryImages[category]) {
//       return categoryImages[category];
//     }
    
//     const firstProduct = products.find(p => p.categories === category);
//     if (firstProduct && firstProduct.image) {
//       return firstProduct.image;
//     }
    
//     return "https://via.placeholder.com/400x300?text=No+Category+Image";
//   };

//   // Get random gradient for categories without images
//   const getGradient = (index) => {
//     const gradients = [
//       "from-purple-500 to-pink-500",
//       "from-blue-500 to-cyan-500",
//       "from-green-500 to-emerald-500",
//       "from-orange-500 to-red-500",
//       "from-indigo-500 to-purple-500",
//       "from-yellow-500 to-orange-500",
//       "from-teal-500 to-green-500",
//       "from-rose-500 to-red-500"
//     ];
//     return gradients[index % gradients.length];
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
//         <div className="relative">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="h-8 w-8 bg-blue-600 rounded-full animate-pulse"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-linear-to-br from-gray-50 to-gray-100 min-h-screen">
//       <div className="container mx-auto px-4 py-8">
//         {/* Trending Deals Slider - Added at the top */}
//         <TrendingDealsSlider addToCart={addToCart} />

//         {/* Hero Section with Category Slider */}
//         {categories.length > 0 && (
//           <div className="mb-16">
//             {/* Header with animation */}
//             <div className="text-center mb-10">
//               <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 animate-fade-in">
//                 Shop by Categories
//               </h2>
//               <div className="w-24 h-1 bg-linear-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-4"></div>
//               <p className="text-gray-600 text-lg">Discover amazing products in your favorite categories</p>
//             </div>
            
//             {/* Slider Container */}
//             <div className="relative group">
//               {/* Navigation Buttons */}
//               <button 
//                 onClick={scrollLeft}
//                 disabled={scrollPosition <= 0}
//                 className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full shadow-lg p-3 transition-all duration-300 ${
//                   scrollPosition <= 0 
//                     ? "opacity-0 cursor-not-allowed" 
//                     : "opacity-0 group-hover:opacity-100 hover:scale-110 hover:shadow-xl cursor-pointer"
//                 }`}
//                 aria-label="Previous categories"
//               >
//                 <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>
              
//               <button 
//                 onClick={scrollRight}
//                 disabled={scrollPosition >= maxScroll - 10}
//                 className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full shadow-lg p-3 transition-all duration-300 ${
//                   scrollPosition >= maxScroll - 10 
//                     ? "opacity-0 cursor-not-allowed" 
//                     : "opacity-0 group-hover:opacity-100 hover:scale-110 hover:shadow-xl cursor-pointer"
//                 }`}
//                 aria-label="Next categories"
//               >
//                 <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
              
//               {/* Scrollable Categories */}
//               <div 
//                 ref={sliderRef}
//                 onScroll={handleScroll}
//                 className="flex overflow-x-auto gap-6 pb-6 scrollbar-thin scroll-smooth"
//                 style={{ scrollbarWidth: 'thin', msOverflowStyle: 'auto' }}
//               >
//                 {/* All Categories option - Premium Card */}
//                 <div className="shrink-0 w-72">
//                   <div
//                     onClick={() => setSelectedCategory("all")}
//                     onMouseEnter={() => setHoveredCategory("all")}
//                     onMouseLeave={() => setHoveredCategory(null)}
//                     className={`relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-all duration-500 transform ${
//                       selectedCategory === "all" 
//                         ? "scale-105 shadow-2xl" 
//                         : "hover:scale-105 hover:shadow-2xl"
//                     }`}
//                   >
//                     {/* Enhanced Selected Border - More Visible */}
//                     {selectedCategory === "all" && (
//                       <>
//                         <div className="absolute inset-0 rounded-2xl border-4 border-blue-500 z-10 pointer-events-none"></div>
//                         <div className="absolute inset-0 rounded-2xl border-4 border-blue-300 animate-pulse pointer-events-none"></div>
//                         <div className="absolute -inset-1 bg-blue-500 rounded-2xl blur-md opacity-50 pointer-events-none"></div>
//                         {/* Checkmark Badge */}
//                         <div className="absolute top-3 right-3 z-20 bg-blue-500 rounded-full p-1 shadow-lg">
//                           <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                           </svg>
//                         </div>
//                       </>
//                     )}
                    
//                     <div className="relative h-80 bg-linear-to-br from-blue-500 via-purple-500 to-pink-500">
//                       {/* Animated Background */}
//                       <div className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                      
//                       {/* Content */}
//                       <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
//                         <div className="relative">
//                           <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
//                           <svg className="w-24 h-24 mb-4 relative z-10 animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
//                           </svg>
//                         </div>
//                         <h3 className="text-3xl font-bold mb-2">All Categories</h3>
//                         <p className="text-sm opacity-95 mb-3">{products.length}+ Products</p>
//                         <div className="relative overflow-hidden">
//                           <div className={`border-b-2 border-white transform transition-transform duration-300 ${hoveredCategory === "all" ? "scale-x-100" : "scale-x-0"}`}></div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Individual Categories */}
//                 {categories.map((category, idx) => {
//                   const productCount = products.filter(p => p.categories === category).length;
//                   const categoryImage = getCategoryImage(category);
//                   const isHovered = hoveredCategory === category;
//                   const isSelected = selectedCategory === category;
//                   const gradient = getGradient(idx);
                  
//                   return (
//                     <div key={category} className="shrink-0 w-72">
//                       <div
//                         onClick={() => setSelectedCategory(category)}
//                         onMouseEnter={() => setHoveredCategory(category)}
//                         onMouseLeave={() => setHoveredCategory(null)}
//                         className={`relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-all duration-500 transform ${
//                           isSelected 
//                             ? "scale-105 shadow-2xl" 
//                             : "hover:scale-105 hover:shadow-2xl"
//                         }`}
//                       >
//                         {/* Enhanced Selected Border - More Visible with Glow Effect */}
//                         {isSelected && (
//                           <>
//                             {/* Main thick blue border */}
//                             <div className="absolute inset-0 rounded-2xl border-4 border-blue-500 z-10 pointer-events-none"></div>
//                             {/* Animated pulse border for extra visibility */}
//                             <div className="absolute inset-0 rounded-2xl border-4 border-blue-300 animate-pulse pointer-events-none"></div>
//                             {/* Outer glow effect */}
//                             <div className="absolute -inset-1 bg-blue-500 rounded-2xl blur-md opacity-60 pointer-events-none"></div>
//                             {/* Inner glow */}
//                             <div className="absolute inset-1 rounded-xl border-2 border-blue-400/50 pointer-events-none"></div>
//                             {/* Checkmark Badge */}
//                             <div className="absolute top-3 right-3 z-20 bg-blue-500 rounded-full p-1.5 shadow-lg">
//                               <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                               </svg>
//                             </div>
//                             {/* Selected text indicator on bottom */}
//                             <div className="absolute bottom-0 left-0 right-0 z-20 bg-linear-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold py-1 text-center">
//                               ✓ SELECTED
//                             </div>
//                           </>
//                         )}
                        
//                         <div className="relative h-80 bg-gray-800">
//                           {/* Category Image */}
//                           <img
//                             src={categoryImage}
//                             alt={category}
//                             className="w-full h-full object-cover transition-transform duration-700"
//                             style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
//                             onError={(e) => {
//                               e.target.src = `https://via.placeholder.com/400x300?text=${category}`;
//                             }}
//                           />
                          
//                           {/* Gradient Overlay - Changes on hover */}
//                           <div className={`absolute inset-0 bg-linear-to-t transition-opacity duration-500 ${
//                             isHovered 
//                               ? "from-black via-black/70 to-transparent opacity-100" 
//                               : "from-black/80 via-black/40 to-transparent opacity-90"
//                           }`}></div>
                          
//                           {/* Animated Shine Effect on Hover */}
//                           <div className={`absolute inset-0 transform -skew-x-12 transition-transform duration-700 ${
//                             isHovered ? "translate-x-full bg-white/20" : "-translate-x-full"
//                           }`}></div>
                          
//                           {/* Category Content */}
//                           <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
//                             <h3 className="text-2xl font-bold mb-1 transform transition-transform duration-300" style={{ transform: isHovered ? 'translateY(-8px)' : 'translateY(0)' }}>
//                               {category}
//                             </h3>
                            
//                             {/* Underline effect */}
//                             <div className="relative mb-3">
//                               <div className={`h-0.5 bg-linear-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-500 ${
//                                 isHovered ? "w-full" : "w-0"
//                               }`}></div>
//                             </div>
                            
//                             <div className="flex items-center justify-between">
//                               <div>
//                                 <p className="text-sm opacity-90">{productCount} Products</p>
//                                 {isHovered && (
//                                   <div className="flex items-center gap-1 mt-2 text-sm font-semibold animate-slide-in">
//                                     <span>Shop Now</span>
//                                     <svg className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                     </svg>
//                                   </div>
//                                 )}
//                               </div>
                              
//                               {/* Animated Icon */}
//                               <div className={`transform transition-all duration-500 ${
//                                 isHovered ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
//                               }`}>
//                                 <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
//                                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                   </svg>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
                          
//                           {/* Top Badge - Popular categories get a badge */}
//                           {productCount > 20 && (
//                             <div className="absolute top-4 left-4 z-20 bg-linear-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse-slow">
//                               🔥 Popular
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Divider with animation */}
//         {categories.length > 0 && (
//           <div className="relative my-12">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t-2 border-gray-200"></div>
//             </div>
//             <div className="relative flex justify-center">
//               <span className="bg-linear-to-br from-gray-50 to-gray-100 px-4 text-gray-400 text-sm">✦</span>
//             </div>
//           </div>
//         )}

//         {/* Main Products Section with Pagination */}
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Sidebar - Categories (Desktop) */}
//           <div className="hidden lg:block lg:w-1/4 w-full">
//             <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
//               <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
//                 Categories
//               </h2>
              
//               <div className="space-y-2">
//                 <button
//                   onClick={() => setSelectedCategory("all")}
//                   className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
//                     selectedCategory === "all"
//                       ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:translate-x-1"
//                   }`}
//                 >
//                   All Products
//                   <span className="float-right text-sm">
//                     ({products.length})
//                   </span>
//                 </button>
                
//                 {categories.map((category) => (
//                   <button
//                     key={category}
//                     onClick={() => setSelectedCategory(category)}
//                     className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
//                       selectedCategory === category
//                         ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md"
//                         : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:translate-x-1"
//                     }`}
//                   >
//                     {category}
//                     <span className="float-right text-sm">
//                       ({products.filter(p => p.categories === category).length})
//                     </span>
//                   </button>
//                 ))}
//               </div>

//               {categories.length === 0 && (
//                 <div className="text-center py-4 text-gray-500">
//                   <p>No categories available</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Mobile Dropdown for Categories */}
//           <div className="lg:hidden w-full mb-4" ref={dropdownRef}>
//             <button
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
//             >
//               <span className="font-medium text-gray-700">
//                 {selectedCategory === "all" ? "All Products" : selectedCategory}
//               </span>
//               <svg
//                 className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
//                   isDropdownOpen ? "rotate-180" : ""
//                 }`}
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>

//             {isDropdownOpen && (
//               <div className="absolute z-50 mt-2 w-[calc(100%-2rem)] bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
//                 <div className="py-2">
//                   <button
//                     onClick={() => setSelectedCategory("all")}
//                     className={`w-full text-left px-4 py-3 transition-colors ${
//                       selectedCategory === "all"
//                         ? "bg-blue-50 text-blue-600 font-medium"
//                         : "text-gray-700 hover:bg-gray-50"
//                     }`}
//                   >
//                     <div className="flex justify-between items-center">
//                       <span>All Products</span>
//                       <span className="text-sm text-gray-500">({products.length})</span>
//                     </div>
//                   </button>
                  
//                   {categories.map((category) => (
//                     <button
//                       key={category}
//                       onClick={() => setSelectedCategory(category)}
//                       className={`w-full text-left px-4 py-3 transition-colors ${
//                         selectedCategory === category
//                           ? "bg-blue-50 text-blue-600 font-medium"
//                           : "text-gray-700 hover:bg-gray-50"
//                       }`}
//                     >
//                       <div className="flex justify-between items-center">
//                         <span>{category}</span>
//                         <span className="text-sm text-gray-500">
//                           ({products.filter(p => p.categories === category).length})
//                         </span>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Products Grid with Pagination */}
//           <div className="lg:w-3/4 w-full">
//             {filteredProducts.length === 0 ? (
//               <div className="text-center py-12 bg-white rounded-lg shadow-md">
//                 <p className="text-gray-500 text-lg">No products found</p>
//                 {selectedCategory !== "all" && (
//                   <button
//                     onClick={() => setSelectedCategory("all")}
//                     className="mt-4 text-blue-600 hover:text-blue-700"
//                   >
//                     View all products
//                   </button>
//                 )}
//               </div>
//             ) : (
//               <>
//                 <div className="mb-4">
//                   <h2 className="text-2xl font-semibold text-gray-800">
//                     {selectedCategory === "all" ? "All Products" : selectedCategory}
//                   </h2>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {currentProducts.map((product) => (
//                     <div
//                       key={product._id}
//                       className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
//                     >
//                       <div className="relative pt-[100%] bg-gray-100">
//                         {product.image ? (
//                           <img
//                             src={product.image}
//                             alt={product.name}
//                             className="absolute top-0 left-0 w-full h-full object-cover"
//                             onError={(e) => {
//                               e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
//                             }}
//                           />
//                         ) : (
//                           <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
//                             <div className="text-center">
//                               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                               </svg>
//                               <p className="text-gray-400 text-sm mt-2">No image</p>
//                             </div>
//                           </div>
//                         )}
//                       </div>

//                       <div className="p-4 flex flex-col grow">
//                         {product.categories && (
//                           <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded mb-2 self-start">
//                             {product.categories}
//                           </span>
//                         )}
                        
//                         <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
//                           {product.name}
//                         </h3>
                        
//                         <div className="mb-3">
//                           <span className="text-2xl font-bold text-blue-600">
//                             Rs: {parseFloat(product.price).toFixed(2)}
//                           </span>
//                         </div>

//                         <div className="flex gap-2 mt-auto">
//                           <button
//                             onClick={() => addToCart(product)}
//                             className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
//                           >
//                             Add to Cart
//                           </button>
//                           <button
//                             onClick={() => openModal(product)}
//                             className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
//                           >
//                             View
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Pagination Controls */}
//                 {totalPages > 1 && (
//                   <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
//                     <button
//                       onClick={prevPage}
//                       disabled={currentPage === 1}
//                       className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                         currentPage === 1
//                           ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                           : "bg-blue-600 text-white hover:bg-blue-700"
//                       }`}
//                     >
//                       Previous
//                     </button>
                    
//                     <div className="flex gap-2">
//                       {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                         let pageNum;
//                         if (totalPages <= 5) {
//                           pageNum = i + 1;
//                         } else if (currentPage <= 3) {
//                           pageNum = i + 1;
//                         } else if (currentPage >= totalPages - 2) {
//                           pageNum = totalPages - 4 + i;
//                         } else {
//                           pageNum = currentPage - 2 + i;
//                         }
                        
//                         return (
//                           <button
//                             key={pageNum}
//                             onClick={() => paginate(pageNum)}
//                             className={`w-10 h-10 rounded-lg font-medium transition-colors ${
//                               currentPage === pageNum
//                                 ? "bg-blue-600 text-white"
//                                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                             }`}
//                           >
//                             {pageNum}
//                           </button>
//                         );
//                       })}
//                     </div>
                    
//                     <button
//                       onClick={nextPage}
//                       disabled={currentPage === totalPages}
//                       className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                         currentPage === totalPages
//                           ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                           : "bg-blue-600 text-white hover:bg-blue-700"
//                       }`}
//                     >
//                       Next
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>

//         {/* Product Modal with Related Products */}
//         {isModalOpen && selectedProduct && (
//           <div className="fixed inset-0 z-50 overflow-y-auto">
//             <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal}></div>
            
//             <div className="flex min-h-full items-center justify-center p-4">
//               <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//                 <button
//                   onClick={closeModal}
//                   className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 bg-white rounded-full p-1 shadow-md"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>

//                 <div className="flex flex-col">
//                   <div className="flex flex-col md:flex-row p-6">
//                     <div className="md:w-1/2 bg-gray-100 rounded-lg overflow-hidden mb-4 md:mb-0">
//                       <img
//                         src={mainImage}
//                         alt={selectedProduct.name}
//                         className="w-full h-96 object-cover"
//                         onError={(e) => {
//                           e.target.src = "https://via.placeholder.com/500x500?text=No+Image";
//                         }}
//                       />
//                     </div>

//                     <div className="md:w-1/2 md:pl-6">
//                       <h2 className="text-2xl font-bold text-gray-800 mb-2">
//                         {selectedProduct.name}
//                       </h2>
                      
//                       {selectedProduct.categories && (
//                         <span className="inline-block px-2 py-1 bg-blue-100 text-blue-600 rounded-md text-sm mb-4">
//                           {selectedProduct.categories}
//                         </span>
//                       )}
                      
//                       <div className="mb-4">
//                         <span className="text-3xl font-bold text-blue-600">
//                           Rs: {parseFloat(selectedProduct.price).toFixed(2)}
//                         </span>
//                       </div>

//                       <div className="mb-6">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
//                         <div className="bg-gray-50 rounded-lg p-4">
//                           <p className="text-gray-600 whitespace-pre-wrap">
//                             {selectedProduct.description || "No description available"}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="mb-6">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-2">Seller Information</h3>
//                         <div className="bg-gray-50 rounded-lg p-4">
//                           <p className="text-gray-600">
//                             <span className="font-medium">Seller ID:</span> {selectedProduct.sellerId || "N/A"}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex gap-3">
//                         <button
//                           onClick={() => {
//                             addToCart(selectedProduct);
//                             closeModal();
//                           }}
//                           className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
//                         >
//                           Add to Cart
//                         </button>
//                         <button
//                           onClick={closeModal}
//                           className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                         >
//                           Close
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {getRelatedProducts(selectedProduct).length > 0 && (
//                     <div className="border-t border-gray-200 p-6">
//                       <h3 className="text-xl font-bold text-gray-800 mb-4">
//                         You May Also Like
//                       </h3>
//                       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                         {getRelatedProducts(selectedProduct).map((relatedProduct) => (
//                           <div
//                             key={relatedProduct._id}
//                             className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
//                             onClick={() => {
//                               setSelectedProduct(relatedProduct);
//                               setMainImage(relatedProduct.image || "https://via.placeholder.com/500x500?text=No+Image");
//                             }}
//                           >
//                             <div className="relative pt-[100%] bg-gray-100">
//                               {relatedProduct.image ? (
//                                 <img
//                                   src={relatedProduct.image}
//                                   alt={relatedProduct.name}
//                                   className="absolute top-0 left-0 w-full h-full object-cover"
//                                   onError={(e) => {
//                                     e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
//                                   }}
//                                 />
//                               ) : (
//                                 <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
//                                   <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                   </svg>
//                                 </div>
//                               )}
//                             </div>
//                             <div className="p-3">
//                               <h4 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
//                                 {relatedProduct.name}
//                               </h4>
//                               <div className="flex justify-between items-center">
//                                 <span className="text-blue-600 font-bold text-sm">
//                                   Rs: {parseFloat(relatedProduct.price).toFixed(2)}
//                                 </span>
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     addToCart(relatedProduct);
//                                   }}
//                                   className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors"
//                                 >
//                                   Add
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <style jsx>{`
//           .scrollbar-thin::-webkit-scrollbar {
//             height: 6px;
//           }
          
//           .scrollbar-thin::-webkit-scrollbar-track {
//             background: #f1f1f1;
//             border-radius: 10px;
//           }
          
//           .scrollbar-thin::-webkit-scrollbar-thumb {
//             background: linear-gradient(to right, #3b82f6, #a855f7);
//             border-radius: 10px;
//           }
          
//           .scrollbar-thin::-webkit-scrollbar-thumb:hover {
//             background: linear-gradient(to right, #2563eb, #9333ea);
//           }
          
//           @keyframes fade-in {
//             from {
//               opacity: 0;
//               transform: translateY(-20px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
          
//           @keyframes slide-in {
//             from {
//               opacity: 0;
//               transform: translateX(-10px);
//             }
//             to {
//               opacity: 1;
//               transform: translateX(0);
//             }
//           }
          
//           @keyframes bounce-slow {
//             0%, 100% {
//               transform: translateY(0);
//             }
//             50% {
//               transform: translateY(-10px);
//             }
//           }
          
//           @keyframes pulse-slow {
//             0%, 100% {
//               opacity: 1;
//             }
//             50% {
//               opacity: 0.7;
//             }
//           }
          
//           .animate-fade-in {
//             animation: fade-in 0.6s ease-out;
//           }
          
//           .animate-slide-in {
//             animation: slide-in 0.3s ease-out;
//           }
          
//           .animate-bounce-slow {
//             animation: bounce-slow 2s ease-in-out infinite;
//           }
          
//           .animate-pulse-slow {
//             animation: pulse-slow 2s ease-in-out infinite;
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState, useRef } from "react";
import TrendingDealsSlider from "../TrendingDealsSlider";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryImages, setCategoryImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [mainImage, setMainImage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [hoveredSidebarCategory, setHoveredSidebarCategory] = useState(null);
  const dropdownRef = useRef(null);
  const sliderRef = useRef(null);
  const sidebarSliderRef = useRef(null);
  
  // Slider state for main categories
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);

  // Fetch products and category images
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();

      console.log("API Response:", data);

      let productsArray = [];
      
      if (data.success && data.products) {
        productsArray = data.products;
        if (data.categories) {
          setCategories(data.categories);
        }
        
        if (data.categoryImages) {
          setCategoryImages(data.categoryImages);
        }
      } else if (Array.isArray(data)) {
        productsArray = data;
      } else {
        console.error("Unexpected response:", data);
        setError("Failed to load products");
        setLoading(false);
        return;
      }

      setProducts(productsArray);
      
      if (!data.categories) {
        const uniqueCategories = [...new Set(productsArray.map(p => p.categories).filter(Boolean))];
        setCategories(uniqueCategories);
      }
      
      await fetchCategoryImages();
      
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryImages = async () => {
    try {
      const res = await fetch("/api/category-images");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.images) {
          setCategoryImages(data.images);
        }
      }
    } catch (error) {
      console.log("No category images endpoint found, using product images instead");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
    setIsDropdownOpen(false);
  }, [selectedCategory]);

  // Update max scroll and show/hide scroll buttons for main categories
  useEffect(() => {
    if (sliderRef.current && categories.length > 0) {
      const updateMaxScroll = () => {
        const container = sliderRef.current;
        const maxScrollAmount = container.scrollWidth - container.clientWidth;
        setMaxScroll(maxScrollAmount);
        setShowScrollButtons(maxScrollAmount > 10);
      };
      updateMaxScroll();
      window.addEventListener('resize', updateMaxScroll);
      return () => window.removeEventListener('resize', updateMaxScroll);
    }
  }, [categories]);

  const handleScroll = () => {
    if (sliderRef.current) {
      setScrollPosition(sliderRef.current.scrollLeft);
      const maxScrollAmount = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
      setMaxScroll(maxScrollAmount);
      setShowScrollButtons(maxScrollAmount > 10);
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

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      let newCart;
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }
      return newCart;
    });

    const event = new CustomEvent("showNotification", { 
      detail: { message: `${product.name} added to cart!`, type: "success" }
    });
    window.dispatchEvent(event);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setMainImage(product.image || "https://via.placeholder.com/500x500?text=No+Image");
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setMainImage("");
    document.body.style.overflow = "auto";
  };

  const getRelatedProducts = (product) => {
    if (!product || !product.categories) return [];
    
    return products
      .filter(p => p.categories === product.categories && p._id !== product._id)
      .slice(0, 3);
  };

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.categories === selectedCategory);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getCategoryImage = (category) => {
    if (categoryImages[category]) {
      return categoryImages[category];
    }
    
    const firstProduct = products.find(p => p.categories === category);
    if (firstProduct && firstProduct.image) {
      return firstProduct.image;
    }
    
    return "https://via.placeholder.com/400x300?text=No+Category+Image";
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }
    
    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Trending Deals Slider - Added at the top */}
        <TrendingDealsSlider addToCart={addToCart} />

        {/* Hero Section with Category Slider */}
        {categories.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 animate-fade-in">
                Shop by Categories
              </h2>
              <div className="w-24 h-1 bg-linear-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-4"></div>
              <p className="text-gray-600 text-lg">Discover amazing products in your favorite categories</p>
            </div>
            
            <div className="relative group">
              {/* Left Scroll Button */}
              {showScrollButtons && (
                <button 
                  onClick={scrollLeft}
                  disabled={scrollPosition <= 0}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full shadow-lg p-3 transition-all duration-300 ${
                    scrollPosition <= 0 
                      ? "opacity-0 cursor-not-allowed" 
                      : "opacity-0 group-hover:opacity-100 hover:scale-110 hover:shadow-xl cursor-pointer"
                  }`}
                  aria-label="Previous categories"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              
              {/* Right Scroll Button */}
              {showScrollButtons && (
                <button 
                  onClick={scrollRight}
                  disabled={scrollPosition >= maxScroll - 10}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full shadow-lg p-3 transition-all duration-300 ${
                    scrollPosition >= maxScroll - 10 
                      ? "opacity-0 cursor-not-allowed" 
                      : "opacity-0 group-hover:opacity-100 hover:scale-110 hover:shadow-xl cursor-pointer"
                  }`}
                  aria-label="Next categories"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              
              {/* Scrollable Categories */}
              <div 
                ref={sliderRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto gap-6 pb-6 scrollbar-thin scroll-smooth"
                style={{ scrollbarWidth: 'thin', msOverflowStyle: 'auto' }}
              >
                {/* All Categories option - Premium Card */}
                <div className="shrink-0 w-72">
                  <div
                    onClick={() => setSelectedCategory("all")}
                    onMouseEnter={() => setHoveredCategory("all")}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className={`relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-all duration-500 transform ${
                      selectedCategory === "all" 
                        ? "scale-105 shadow-2xl" 
                        : "hover:scale-105 hover:shadow-2xl"
                    }`}
                  >
                    {selectedCategory === "all" && (
                      <>
                        <div className="absolute inset-0 rounded-2xl border-4 border-blue-500 z-10 pointer-events-none"></div>
                        <div className="absolute inset-0 rounded-2xl border-4 border-blue-300 animate-pulse pointer-events-none"></div>
                        <div className="absolute -inset-1 bg-blue-500 rounded-2xl blur-md opacity-50 pointer-events-none"></div>
                        <div className="absolute top-3 right-3 z-20 bg-blue-500 rounded-full p-1 shadow-lg">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </>
                    )}
                    
                    <div className="relative h-80 bg-linear-to-br from-blue-500 via-purple-500 to-pink-500">
                      <div className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                          <svg className="w-24 h-24 mb-4 relative z-10 animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                        </div>
                        <h3 className="text-3xl font-bold mb-2">All Categories</h3>
                        <p className="text-sm opacity-95 mb-3">{products.length}+ Products</p>
                        <div className="relative overflow-hidden">
                          <div className={`border-b-2 border-white transform transition-transform duration-300 ${hoveredCategory === "all" ? "scale-x-100" : "scale-x-0"}`}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Individual Categories */}
                {categories.map((category, idx) => {
                  const productCount = products.filter(p => p.categories === category).length;
                  const categoryImage = getCategoryImage(category);
                  const isHovered = hoveredCategory === category;
                  const isSelected = selectedCategory === category;
                  
                  return (
                    <div key={category} className="shrink-0 w-72">
                      <div
                        onClick={() => setSelectedCategory(category)}
                        onMouseEnter={() => setHoveredCategory(category)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        className={`relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-all duration-500 transform ${
                          isSelected 
                            ? "scale-105 shadow-2xl" 
                            : "hover:scale-105 hover:shadow-2xl"
                        }`}
                      >
                        {isSelected && (
                          <>
                            <div className="absolute inset-0 rounded-2xl border-4 border-blue-500 z-10 pointer-events-none"></div>
                            <div className="absolute inset-0 rounded-2xl border-4 border-blue-300 animate-pulse pointer-events-none"></div>
                            <div className="absolute -inset-1 bg-blue-500 rounded-2xl blur-md opacity-60 pointer-events-none"></div>
                            <div className="absolute inset-1 rounded-xl border-2 border-blue-400/50 pointer-events-none"></div>
                            <div className="absolute top-3 right-3 z-20 bg-blue-500 rounded-full p-1.5 shadow-lg">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 z-20 bg-linear-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold py-1 text-center">
                              ✓ SELECTED
                            </div>
                          </>
                        )}
                        
                        <div className="relative h-80 bg-gray-800">
                          <img
                            src={categoryImage}
                            alt={category}
                            className="w-full h-full object-cover transition-transform duration-700"
                            style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
                            onError={(e) => {
                              e.target.src = `https://via.placeholder.com/400x300?text=${category}`;
                            }}
                          />
                          
                          <div className={`absolute inset-0 bg-linear-to-t transition-opacity duration-500 ${
                            isHovered 
                              ? "from-black via-black/70 to-transparent opacity-100" 
                              : "from-black/80 via-black/40 to-transparent opacity-90"
                          }`}></div>
                          
                          <div className={`absolute inset-0 transform -skew-x-12 transition-transform duration-700 ${
                            isHovered ? "translate-x-full bg-white/20" : "-translate-x-full"
                          }`}></div>
                          
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <h3 className="text-2xl font-bold mb-1 transform transition-transform duration-300 relative inline-block">
                              {category}
                              <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-300 ${
                                isHovered ? "w-full" : "w-0"
                              }`}></span>
                            </h3>
                            
                            <div className="relative mt-2">
                              <p className="text-sm opacity-90">{productCount} Products</p>
                              {isHovered && (
                                <div className="flex items-center gap-1 mt-2 text-sm font-semibold animate-slide-in">
                                  <span>Shop Now</span>
                                  <svg className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            
                            <div className={`absolute right-0 bottom-0 transform transition-all duration-500 ${
                              isHovered ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
                            }`}>
                              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          
                          {productCount > 20 && (
                            <div className="absolute top-4 left-4 z-20 bg-linear-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse-slow">
                              🔥 Popular
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {categories.length > 0 && (
          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-linear-to-br from-gray-50 to-gray-100 px-4 text-gray-400 text-sm">✦</span>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories with simple scroll (no auto-scroll, no buttons) */}
          <div className="hidden lg:block lg:w-1/4 w-full">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
                Categories
              </h2>
              
              {/* Simple Scrollable Categories List - User controlled only */}
              <div 
                className="relative"
              >
                <div
                  ref={sidebarSliderRef}
                  className={`space-y-2 ${
                    categories.length > 5 ? "max-h-80 overflow-y-auto" : ""
                  }`}
                  style={{ 
                    scrollbarWidth: 'thin',
                  }}
                >
                  <button
                    onClick={() => setSelectedCategory("all")}
                    onMouseEnter={() => setHoveredSidebarCategory("all")}
                    onMouseLeave={() => setHoveredSidebarCategory(null)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 relative group ${
                      selectedCategory === "all"
                        ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span>All Products</span>
                    <span className="float-right text-sm">
                      ({products.length})
                    </span>
                    {/* Underline effect on hover for sidebar categories */}
                    {selectedCategory !== "all" && (
                      <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ${
                        hoveredSidebarCategory === "all" ? "w-full" : "w-0"
                      }`}></span>
                    )}
                  </button>
                  
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      onMouseEnter={() => setHoveredSidebarCategory(category)}
                      onMouseLeave={() => setHoveredSidebarCategory(null)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 relative group ${
                        selectedCategory === category
                          ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                      <span className="float-right text-sm">
                        ({products.filter(p => p.categories === category).length})
                      </span>
                      {/* Underline effect on hover for sidebar categories */}
                      {selectedCategory !== category && (
                        <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ${
                          hoveredSidebarCategory === category ? "w-full" : "w-0"
                        }`}></span>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Gentle gradient fade at bottom when scrollable - just visual hint */}
                {categories.length > 5 && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                )}
              </div>

              {categories.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <p>No categories available</p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Dropdown */}
          <div className="lg:hidden w-full mb-4" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-700">
                {selectedCategory === "all" ? "All Products" : selectedCategory}
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute z-50 mt-2 w-[calc(100%-2rem)] bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                <div className="py-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-4 py-3 transition-colors ${
                      selectedCategory === "all"
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>All Products</span>
                      <span className="text-sm text-gray-500">({products.length})</span>
                    </div>
                  </button>
                  
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-3 transition-colors ${
                        selectedCategory === category
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category}</span>
                        <span className="text-sm text-gray-500">
                          ({products.filter(p => p.categories === category).length})
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4 w-full">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-gray-500 text-lg">No products found</p>
                {selectedCategory !== "all" && (
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="mt-4 text-blue-600 hover:text-blue-700"
                  >
                    View all products
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {selectedCategory === "all" ? "All Products" : selectedCategory}
                  </h2>
                  <div className="text-sm text-gray-500">
                    Showing {indexOfFirstProduct + 1} - {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group"
                      onMouseEnter={() => setHoveredProduct(product._id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      {/* Image Container */}
                      <div className="relative h-64 md:h-72 bg-gray-100 overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-gray-400 text-sm mt-2">No image</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Category Name - Shows on top left on hover */}
                        <div className={`absolute top-4 left-4 transition-all duration-300 ${
                          hoveredProduct === product._id 
                            ? "opacity-100 translate-x-0" 
                            : "opacity-0 -translate-x-4"
                        }`}>
                          {product.categories && (
                            <span className="text-white text-xs font-semibold bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                              {product.categories}
                            </span>
                          )}
                        </div>
                        
                        {/* Product Name - Shows on bottom left on hover */}
                        <div className={`absolute bottom-4 left-4 right-20 transition-all duration-300 ${
                          hoveredProduct === product._id 
                            ? "opacity-100 translate-y-0" 
                            : "opacity-0 translate-y-4"
                        }`}>
                          <div className="text-white text-sm font-medium bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg inline-block max-w-full">
                            {product.name}
                          </div>
                        </div>
                        
                        {/* View Icon - Shows on top right on hover */}
                        <div className={`absolute top-4 right-4 transition-all duration-300 ${
                          hoveredProduct === product._id 
                            ? "opacity-100 translate-x-0" 
                            : "opacity-0 translate-x-4"
                        }`}>
                          <button
                            onClick={() => openModal(product)}
                            className="bg-white/90 backdrop-blur-sm text-blue-600 p-2.5 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                            aria-label="View Details"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Add to Cart button */}
                      <div className="p-4 pt-3">
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full group/btn relative overflow-hidden font-medium text-blue-600 hover:text-blue-700 transition-all duration-300 py-2 px-4 rounded-lg"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 18v3" />
                            </svg>
                            Add to Cart
                          </span>
                          <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover/btn:w-[calc(100%-2rem)] group-hover/btn:left-4"></span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10 mb-6 flex-wrap">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>
                    
                    <div className="flex gap-2">
                      {getPageNumbers().map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => paginate(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm"
                      }`}
                    >
                      Next
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
                
                {/* Page info for mobile */}
                {totalPages > 1 && (
                  <div className="text-center text-sm text-gray-500 mt-2">
                    Page {currentPage} of {totalPages}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Product Modal */}
        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal}></div>
            
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 bg-white rounded-full p-1 shadow-md"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="flex flex-col">
                  <div className="flex flex-col md:flex-row p-6">
                    <div className="md:w-1/2 bg-gray-100 rounded-lg overflow-hidden mb-4 md:mb-0">
                      <img
                        src={mainImage}
                        alt={selectedProduct.name}
                        className="w-full h-96 object-contain"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/500x500?text=No+Image";
                        }}
                      />
                    </div>

                    <div className="md:w-1/2 md:pl-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {selectedProduct.name}
                      </h2>
                      
                      {selectedProduct.categories && (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-600 rounded-md text-sm mb-4">
                          {selectedProduct.categories}
                        </span>
                      )}
                      
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-blue-600">
                          Rs: {parseFloat(selectedProduct.price).toFixed(2)}
                        </span>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-600 whitespace-pre-wrap">
                            {selectedProduct.description || "No description available"}
                          </p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Seller Information</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-600">
                            <span className="font-medium">Seller ID:</span> {selectedProduct.sellerId || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            addToCart(selectedProduct);
                            closeModal();
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={closeModal}
                          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>

                  {getRelatedProducts(selectedProduct).length > 0 && (
                    <div className="border-t border-gray-200 p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">
                        You May Also Like
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {getRelatedProducts(selectedProduct).map((relatedProduct) => (
                          <div
                            key={relatedProduct._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                            onClick={() => {
                              setSelectedProduct(relatedProduct);
                              setMainImage(relatedProduct.image || "https://via.placeholder.com/500x500?text=No+Image");
                            }}
                          >
                            <div className="h-48 bg-gray-100">
                              {relatedProduct.image ? (
                                <img
                                  src={relatedProduct.image}
                                  alt={relatedProduct.name}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="p-3">
                              <h4 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                                {relatedProduct.name}
                              </h4>
                              <div className="flex justify-between items-center">
                                <span className="text-blue-600 font-bold text-sm">
                                  Rs: {parseFloat(relatedProduct.price).toFixed(2)}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(relatedProduct);
                                  }}
                                  className="text-blue-600 hover:text-blue-700 font-medium text-xs transition-colors flex items-center gap-1"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 18v3" />
                                  </svg>
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .scrollbar-thin::-webkit-scrollbar {
            height: 6px;
          }
          
          .scrollbar-thin::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: linear-gradient(to right, #3b82f6, #a855f7);
            border-radius: 10px;
          }
          
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to right, #2563eb, #9333ea);
          }
          
          ::-webkit-scrollbar {
            width: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #3b82f6, #a855f7);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #2563eb, #9333ea);
          }
          
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slide-in {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes bounce-slow {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          @keyframes pulse-slow {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
          
          .animate-slide-in {
            animation: slide-in 0.3s ease-out;
          }
          
          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
          
          .animate-pulse-slow {
            animation: pulse-slow 2s ease-in-out infinite;
          }
          
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </div>
  );
}