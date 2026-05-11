// // // // app/(components)/dashboard/page.js
// // // 'use client';

// // // import { useState, useEffect } from 'react';
// // // import { 
// // //   ShoppingBagIcon, 
// // //   DocumentTextIcon, 
// // //   FireIcon, 
// // //   UsersIcon, 
// // //   ChartBarIcon,
// // //   CurrencyDollarIcon,
// // //   StarIcon
// // // } from '@heroicons/react/24/outline';
// // // import { useRouter } from 'next/navigation';
// // // import ProductsTab from './components/ProductsTab';
// // // import OrdersTab from './components/OrdersTab';
// // // import DealsTab from './components/DealsTab';
// // // import UsersTab from './components/UsersTab';
// // // import SellersTab from './components/SellersTab';
// // // import FactoryRatesTab from './components/FactoryRatesTab';
// // // import ReviewsTab from './components/ReviewsTab';

// // // export default function DashboardPage() {
// // //   const [products, setProducts] = useState([]);
// // //   const [orders, setOrders] = useState([]);
// // //   const [deals, setDeals] = useState([]);
// // //   const [sellers, setSellers] = useState([]);
// // //   const [reviews, setReviews] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [activeTab, setActiveTab] = useState('products');
// // //   const router = useRouter();

// // //   // Helper function to format numbers - removes decimals
// // //   const formatPrice = (price) => {
// // //     if (!price && price !== 0) return '₹0';
// // //     let num = typeof price === 'string' ? parseFloat(price) : price;
// // //     if (isNaN(num)) return '₹0';
// // //     // Round to nearest integer to fix floating point issues
// // //     const rounded = Math.round(num);
// // //     return `₹${rounded.toLocaleString('en-IN')}`;
// // //   };

// // //   // Check admin access
// // //   useEffect(() => {
// // //     const userData = localStorage.getItem('user');
// // //     if (!userData) {
// // //       router.push('/login');
// // //       return;
// // //     }
// // //     try {
// // //       const user = JSON.parse(userData);
// // //       if (user.role !== 'admin') router.push('/');
// // //     } catch (error) {
// // //       router.push('/login');
// // //     }
// // //   }, [router]);

// // //   // Fetch functions
// // //   const fetchProducts = async () => {
// // //     try {
// // //       const res = await fetch('/api/products');
// // //       const data = await res.json();
// // //       if (data.success) setProducts(data.products || []);
// // //     } catch (error) {
// // //       console.error('Error fetching products:', error);
// // //     }
// // //   };

// // //   const fetchOrders = async () => {
// // //     try {
// // //       const res = await fetch('/api/orders');
// // //       const data = await res.json();
// // //       if (data.success) setOrders(data.orders || []);
// // //     } catch (error) {
// // //       console.error('Error fetching orders:', error);
// // //     }
// // //   };

// // //   const fetchDeals = async () => {
// // //     try {
// // //       const res = await fetch('/api/trending-deals');
// // //       const data = await res.json();
// // //       if (data.success) setDeals(data.deals || []);
// // //     } catch (error) {
// // //       console.error('Error fetching deals:', error);
// // //     }
// // //   };

// // //   const fetchSellers = async () => {
// // //     try {
// // //       const res = await fetch('/api/users?role=seller');
// // //       const data = await res.json();
// // //       if (data.success) setSellers(data.users || []);
// // //     } catch (error) {
// // //       console.error('Error fetching sellers:', error);
// // //     }
// // //   };

// // //   const fetchReviews = async () => {
// // //     try {
// // //       const res = await fetch('/api/reviews');
// // //       const data = await res.json();
// // //       if (data.success) setReviews(data.reviews || []);
// // //     } catch (error) {
// // //       console.error('Error fetching reviews:', error);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     const loadData = async () => {
// // //       setLoading(true);
// // //       await Promise.all([fetchProducts(), fetchOrders(), fetchDeals(), fetchSellers(), fetchReviews()]);
// // //       setLoading(false);
// // //     };
// // //     loadData();
// // //   }, []);

// // //   // Calculate statistics with rounded values
// // //   const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
// // //   const sellerOrders = orders.filter(o => o.source === 'seller_portal');
// // //   const totalSellerOrders = sellerOrders.length;
// // //   // Round the commission to nearest integer
// // //   const totalCommission = Math.round(sellerOrders.reduce((sum, order) => sum + (order.commission || 0), 0));
// // //   const uniqueSellers = [...new Set(sellerOrders.map(o => o.sellerInfo?.sellerId).filter(Boolean))];
  
// // //   // Review statistics
// // //   const pendingReviewsCount = reviews.filter(r => !r.isApproved).length;
// // //   const approvedReviewsCount = reviews.filter(r => r.isApproved).length;
// // //   const totalReviews = reviews.length;
// // //   const averageRating = reviews.filter(r => r.isApproved).length > 0 
// // //     ? (reviews.filter(r => r.isApproved).reduce((sum, r) => sum + r.rating, 0) / approvedReviewsCount).toFixed(1)
// // //     : 0;

// // //   if (loading) {
// // //     return (
// // //       <div className="flex justify-center items-center min-h-screen">
// // //         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-200">
// // //       <div className="container mx-auto px-4 py-8">
// // //         {/* Header */}
// // //         <div className="bg-linear-to-r from-blue-600 to-indigo-800 rounded-2xl shadow-xl p-8 mb-8 text-white">
// // //           <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
// // //           <p className="text-blue-100">Manage products, orders, users, sellers, reviews, factory rates and deals</p>
// // //         </div>

// // //         {/* Stats Cards */}
// // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
// // //           <div className="bg-white rounded-xl shadow-lg p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-gray-500 text-sm">Total Products</p>
// // //                 <p className="text-2xl font-bold text-gray-800">{products.length}</p>
// // //               </div>
// // //               <ShoppingBagIcon className="h-10 w-10 text-blue-500" />
// // //             </div>
// // //           </div>
          
// // //           <div className="bg-white rounded-xl shadow-lg p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-gray-500 text-sm">Total Orders</p>
// // //                 <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
// // //               </div>
// // //               <DocumentTextIcon className="h-10 w-10 text-green-500" />
// // //             </div>
// // //           </div>
          
// // //           <div className="bg-white rounded-xl shadow-lg p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-gray-500 text-sm">Seller Orders</p>
// // //                 <p className="text-2xl font-bold text-purple-600">{totalSellerOrders}</p>
// // //               </div>
// // //               <UsersIcon className="h-10 w-10 text-purple-500" />
// // //             </div>
// // //           </div>
          
// // //           <div className="bg-white rounded-xl shadow-lg p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-gray-500 text-sm">Total Commission</p>
// // //                 <p className="text-2xl font-bold text-orange-600">{formatPrice(totalCommission)}</p>
// // //               </div>
// // //               <ChartBarIcon className="h-10 w-10 text-orange-500" />
// // //             </div>
// // //           </div>

// // //           <div className="bg-white rounded-xl shadow-lg p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-gray-500 text-sm">Active Sellers</p>
// // //                 <p className="text-2xl font-bold text-teal-600">{uniqueSellers.length}</p>
// // //               </div>
// // //               <CurrencyDollarIcon className="h-10 w-10 text-teal-500" />
// // //             </div>
// // //           </div>

// // //           <div className="bg-white rounded-xl shadow-lg p-6">
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="text-gray-500 text-sm">Reviews</p>
// // //                 <p className="text-2xl font-bold text-pink-600">{totalReviews}</p>
// // //                 <p className="text-xs text-gray-400">{approvedReviewsCount} approved</p>
// // //               </div>
// // //               <StarIcon className="h-10 w-10 text-pink-500" />
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Review Summary Card */}
// // //         {totalReviews > 0 && (
// // //           <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl shadow-lg p-6 mb-8">
// // //             <div className="flex items-center justify-between flex-wrap gap-4">
// // //               <div className="flex items-center gap-4">
// // //                 <div className="text-center">
// // //                   <div className="text-4xl font-bold text-pink-600">{averageRating}</div>
// // //                   <div className="flex text-yellow-400 text-lg">
// // //                     {'★'.repeat(Math.round(averageRating))}{'☆'.repeat(5 - Math.round(averageRating))}
// // //                   </div>
// // //                   <div className="text-xs text-gray-500">Average Rating</div>
// // //                 </div>
// // //                 <div className="h-12 w-px bg-gray-300"></div>
// // //                 <div>
// // //                   <div className="text-2xl font-bold text-gray-800">{pendingReviewsCount}</div>
// // //                   <div className="text-sm text-gray-500">Pending Approval</div>
// // //                 </div>
// // //               </div>
// // //               <button
// // //                 onClick={() => setActiveTab('reviews')}
// // //                 className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
// // //               >
// // //                 Manage Reviews
// // //               </button>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* Tabs */}
// // //         <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
// // //           <div className="flex gap-2 flex-wrap">
// // //             <button 
// // //               onClick={() => setActiveTab('products')} 
// // //               className={`px-6 py-3 rounded-lg font-semibold transition-all ${
// // //                 activeTab === 'products' 
// // //                   ? 'bg-blue-600 text-white shadow-md' 
// // //                   : 'text-gray-600 hover:bg-gray-100'
// // //               }`}
// // //             >
// // //               <ShoppingBagIcon className="h-5 w-5 inline mr-2" /> Products
// // //             </button>
            
// // //             <button 
// // //               onClick={() => setActiveTab('orders')} 
// // //               className={`px-6 py-3 rounded-lg font-semibold transition-all ${
// // //                 activeTab === 'orders' 
// // //                   ? 'bg-blue-600 text-white shadow-md' 
// // //                   : 'text-gray-600 hover:bg-gray-100'
// // //               }`}
// // //             >
// // //               <DocumentTextIcon className="h-5 w-5 inline mr-2" /> Orders
// // //               {pendingOrdersCount > 0 && (
// // //                 <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
// // //                   {pendingOrdersCount}
// // //                 </span>
// // //               )}
// // //             </button>
            
// // //             <button 
// // //               onClick={() => setActiveTab('sellers')} 
// // //               className={`px-6 py-3 rounded-lg font-semibold transition-all ${
// // //                 activeTab === 'sellers' 
// // //                   ? 'bg-purple-600 text-white shadow-md' 
// // //                   : 'text-gray-600 hover:bg-gray-100'
// // //               }`}
// // //             >
// // //               <UsersIcon className="h-5 w-5 inline mr-2" /> Sellers
// // //               {uniqueSellers.length > 0 && (
// // //                 <span className="ml-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
// // //                   {uniqueSellers.length}
// // //                 </span>
// // //               )}
// // //             </button>
            
// // //             <button 
// // //               onClick={() => setActiveTab('reviews')} 
// // //               className={`px-6 py-3 rounded-lg font-semibold transition-all ${
// // //                 activeTab === 'reviews' 
// // //                   ? 'bg-pink-600 text-white shadow-md' 
// // //                   : 'text-gray-600 hover:bg-gray-100'
// // //               }`}
// // //             >
// // //               <StarIcon className="h-5 w-5 inline mr-2" /> Reviews
// // //               {pendingReviewsCount > 0 && (
// // //                 <span className="ml-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
// // //                   {pendingReviewsCount}
// // //                 </span>
// // //               )}
// // //             </button>
            
// // //             <button 
// // //               onClick={() => setActiveTab('factoryRates')} 
// // //               className={`px-6 py-3 rounded-lg font-semibold transition-all ${
// // //                 activeTab === 'factoryRates' 
// // //                   ? 'bg-teal-600 text-white shadow-md' 
// // //                   : 'text-gray-600 hover:bg-gray-100'
// // //               }`}
// // //             >
// // //               <CurrencyDollarIcon className="h-5 w-5 inline mr-2" /> Factory Rates
// // //             </button>
            
// // //             <button 
// // //               onClick={() => setActiveTab('users')} 
// // //               className={`px-6 py-3 rounded-lg font-semibold transition-all ${
// // //                 activeTab === 'users' 
// // //                   ? 'bg-green-600 text-white shadow-md' 
// // //                   : 'text-gray-600 hover:bg-gray-100'
// // //               }`}
// // //             >
// // //               <UsersIcon className="h-5 w-5 inline mr-2" /> All Users
// // //             </button>
            
// // //             <button 
// // //               onClick={() => setActiveTab('deals')} 
// // //               className={`px-6 py-3 rounded-lg font-semibold transition-all ${
// // //                 activeTab === 'deals' 
// // //                   ? 'bg-orange-600 text-white shadow-md' 
// // //                   : 'text-gray-600 hover:bg-gray-100'
// // //               }`}
// // //             >
// // //               <FireIcon className="h-5 w-5 inline mr-2" /> Deals
// // //             </button>
// // //           </div>
// // //         </div>

// // //         {/* Tab Content */}
// // //         {activeTab === 'products' && <ProductsTab products={products} fetchProducts={fetchProducts} />}
// // //         {activeTab === 'orders' && <OrdersTab orders={orders} fetchOrders={fetchOrders} />}
// // //         {activeTab === 'sellers' && <SellersTab orders={orders} sellers={sellers} />}
// // //         {activeTab === 'reviews' && <ReviewsTab />}
// // //         {activeTab === 'factoryRates' && <FactoryRatesTab />}
// // //         {activeTab === 'users' && <UsersTab />}
// // //         {activeTab === 'deals' && <DealsTab deals={deals} fetchDeals={fetchDeals} products={products} />}
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // // app/dashboard/page.js
// // 'use client';

// // import { useState } from 'react';
// // import SliderManager from '@/app/components/dashboard/SliderManager'; // Your existing component
// // import {
// //   HomeIcon,
// //   PhotoIcon,
// //   ShoppingBagIcon,
// //   UsersIcon,
// //   Cog6ToothIcon,
// //   Bars3Icon,
// //   XMarkIcon
// // } from '@heroicons/react/24/outline';

// // const menuItems = [
// //   { id: 'overview', name: 'Overview', icon: HomeIcon },
// //   { id: 'sliders', name: 'Slider Manager', icon: PhotoIcon },
// //   { id: 'products', name: 'Products', icon: ShoppingBagIcon },
// //   { id: 'users', name: 'Users', icon: UsersIcon },
// //   { id: 'settings', name: 'Settings', icon: Cog6ToothIcon },
// // ];

// // export default function Dashboard() {
// //   const [activeMenu, setActiveMenu] = useState('sliders'); // Set sliders as default
// //   const [sidebarOpen, setSidebarOpen] = useState(true);

// //   const renderContent = () => {
// //     switch (activeMenu) {
// //       case 'sliders':
// //         return <SliderManager />; // Your complete SliderManager component
// //       case 'overview':
// //         return <DashboardOverview />;
// //       case 'products':
// //         return <div className="p-6">Products Management (Coming Soon)</div>;
// //       case 'users':
// //         return <div className="p-6">Users Management (Coming Soon)</div>;
// //       case 'settings':
// //         return <div className="p-6">Settings (Coming Soon)</div>;
// //       default:
// //         return <SliderManager />;
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Sidebar */}
// //       <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200`}>
// //         <div className="flex flex-col h-full">
// //           {/* Logo */}
// //           <div className="flex items-center justify-between p-4 border-b">
// //             {sidebarOpen ? (
// //               <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
// //             ) : (
// //               <h1 className="text-xl font-bold text-gray-800">AP</h1>
// //             )}
// //             <button
// //               onClick={() => setSidebarOpen(!sidebarOpen)}
// //               className="p-1 rounded-lg hover:bg-gray-100"
// //             >
// //               {sidebarOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
// //             </button>
// //           </div>

// //           {/* Navigation */}
// //           <nav className="flex-1 p-4 space-y-2">
// //             {menuItems.map((item) => (
// //               <button
// //                 key={item.id}
// //                 onClick={() => setActiveMenu(item.id)}
// //                 className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
// //                   activeMenu === item.id
// //                     ? 'bg-blue-50 text-blue-600'
// //                     : 'text-gray-700 hover:bg-gray-100'
// //                 }`}
// //               >
// //                 <item.icon className="h-5 w-5" />
// //                 {sidebarOpen && <span>{item.name}</span>}
// //               </button>
// //             ))}
// //           </nav>
// //         </div>
// //       </aside>

// //       {/* Main Content */}
// //       <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
// //         {/* Header */}
// //         <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
// //           <div className="flex items-center justify-between px-6 py-4">
// //             <div>
// //               <h2 className="text-2xl font-semibold text-gray-800">
// //                 {menuItems.find(item => item.id === activeMenu)?.name || 'Dashboard'}
// //               </h2>
// //               <p className="text-sm text-gray-500 mt-1">
// //                 {activeMenu === 'sliders' ? 'Manage your homepage slides' : 'Manage your content'}
// //               </p>
// //             </div>
// //             <div className="flex items-center gap-4">
// //               <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
// //                 <span className="text-sm font-medium">A</span>
// //               </div>
// //             </div>
// //           </div>
// //         </header>

// //         {/* Page Content - Your SliderManager will render here */}
// //         <div className="p-6">
// //           {renderContent()}
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }

// // // Dashboard Overview Component (optional)
// // function DashboardOverview() {
// //   const [stats, setStats] = useState({ sliders: 0, activeSliders: 0 });
  
// //   useEffect(() => {
// //     fetchStats();
// //   }, []);
  
// //   const fetchStats = async () => {
// //     try {
// //       const res = await fetch('/api/slider');
// //       const data = await res.json();
// //       if (data.success) {
// //         setStats({
// //           sliders: data.sliders.length,
// //           activeSliders: data.sliders.filter(s => s.isActive).length
// //         });
// //       }
// //     } catch (error) {
// //       console.error('Error:', error);
// //     }
// //   };
  
// //   return (
// //     <div className="space-y-6">
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //         <StatCard title="Total Slides" value={stats.sliders} icon={PhotoIcon} color="blue" />
// //         <StatCard title="Active Slides" value={stats.activeSliders} icon={PhotoIcon} color="green" />
// //         <StatCard title="Total Products" value="0" icon={ShoppingBagIcon} color="purple" />
// //         <StatCard title="Total Users" value="0" icon={UsersIcon} color="orange" />
// //       </div>
      
// //       <div className="bg-white rounded-xl p-6 shadow-sm">
// //         <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //           <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
// //             <PhotoIcon className="h-6 w-6 text-blue-600 mb-2" />
// //             <p className="font-medium">Add New Slide</p>
// //             <p className="text-sm text-gray-500">Create a new homepage slider</p>
// //           </button>
// //           <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
// //             <ShoppingBagIcon className="h-6 w-6 text-green-600 mb-2" />
// //             <p className="font-medium">Add Product</p>
// //             <p className="text-sm text-gray-500">Add new product to store</p>
// //           </button>
// //           <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
// //             <UsersIcon className="h-6 w-6 text-purple-600 mb-2" />
// //             <p className="font-medium">Manage Users</p>
// //             <p className="text-sm text-gray-500">View and manage user accounts</p>
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function StatCard({ title, value, icon: Icon, color }) {
// //   const colors = {
// //     blue: 'bg-blue-50 text-blue-600',
// //     green: 'bg-green-50 text-green-600',
// //     purple: 'bg-purple-50 text-purple-600',
// //     orange: 'bg-orange-50 text-orange-600',
// //   };
  
// //   return (
// //     <div className="bg-white rounded-xl p-6 shadow-sm">
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <p className="text-sm text-gray-500">{title}</p>
// //           <p className="text-2xl font-bold mt-1">{value}</p>
// //         </div>
// //         <div className={`p-3 rounded-lg ${colors[color]}`}>
// //           <Icon className="h-6 w-6" />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // app/(components)/dashboard/page.js
// 'use client';

// import { useState, useEffect } from 'react';
// import { 
//   ShoppingBagIcon, 
//   DocumentTextIcon, 
//   FireIcon, 
//   UsersIcon, 
//   ChartBarIcon,
//   CurrencyDollarIcon,
//   StarIcon,
//   PhotoIcon
// } from '@heroicons/react/24/outline';
// import { useRouter } from 'next/navigation';
// import ProductsTab from './components/ProductsTab';
// import OrdersTab from './components/OrdersTab';
// import DealsTab from './components/DealsTab';
// import UsersTab from './components/UsersTab';
// import SellersTab from './components/SellersTab';
// import FactoryRatesTab from './components/FactoryRatesTab';
// import ReviewsTab from './components/ReviewsTab';
// import SliderManager from './components/SliderManager';

// export default function DashboardPage() {
//   const [products, setProducts] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [deals, setDeals] = useState([]);
//   const [sellers, setSellers] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('products');
//   const router = useRouter();

//   // Helper function to format numbers - removes decimals
//   const formatPrice = (price) => {
//     if (!price && price !== 0) return '₹0';
//     let num = typeof price === 'string' ? parseFloat(price) : price;
//     if (isNaN(num)) return '₹0';
//     // Round to nearest integer to fix floating point issues
//     const rounded = Math.round(num);
//     return `₹${rounded.toLocaleString('en-IN')}`;
//   };

//   // Check admin access
//   useEffect(() => {
//     const userData = localStorage.getItem('user');
//     if (!userData) {
//       router.push('/login');
//       return;
//     }
//     try {
//       const user = JSON.parse(userData);
//       if (user.role !== 'admin') router.push('/');
//     } catch (error) {
//       router.push('/login');
//     }
//   }, [router]);

//   // Fetch functions
//   const fetchProducts = async () => {
//     try {
//       const res = await fetch('/api/products');
//       const data = await res.json();
//       if (data.success) setProducts(data.products || []);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     }
//   };

//   const fetchOrders = async () => {
//     try {
//       const res = await fetch('/api/orders');
//       const data = await res.json();
//       if (data.success) setOrders(data.orders || []);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//     }
//   };

//   const fetchDeals = async () => {
//     try {
//       const res = await fetch('/api/trending-deals');
//       const data = await res.json();
//       if (data.success) setDeals(data.deals || []);
//     } catch (error) {
//       console.error('Error fetching deals:', error);
//     }
//   };

//   const fetchSellers = async () => {
//     try {
//       const res = await fetch('/api/users?role=seller');
//       const data = await res.json();
//       if (data.success) setSellers(data.users || []);
//     } catch (error) {
//       console.error('Error fetching sellers:', error);
//     }
//   };

//   const fetchReviews = async () => {
//     try {
//       const res = await fetch('/api/reviews');
//       const data = await res.json();
//       if (data.success) setReviews(data.reviews || []);
//     } catch (error) {
//       console.error('Error fetching reviews:', error);
//     }
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       await Promise.all([fetchProducts(), fetchOrders(), fetchDeals(), fetchSellers(), fetchReviews()]);
//       setLoading(false);
//     };
//     loadData();
//   }, []);

//   // Calculate statistics with rounded values
//   const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
//   const sellerOrders = orders.filter(o => o.source === 'seller_portal');
//   const totalSellerOrders = sellerOrders.length;
//   // Round the commission to nearest integer
//   const totalCommission = Math.round(sellerOrders.reduce((sum, order) => sum + (order.commission || 0), 0));
//   const uniqueSellers = [...new Set(sellerOrders.map(o => o.sellerInfo?.sellerId).filter(Boolean))];
  
//   // Review statistics
//   const pendingReviewsCount = reviews.filter(r => !r.isApproved).length;
//   const approvedReviewsCount = reviews.filter(r => r.isApproved).length;
//   const totalReviews = reviews.length;
//   const averageRating = reviews.filter(r => r.isApproved).length > 0 
//     ? (reviews.filter(r => r.isApproved).reduce((sum, r) => sum + r.rating, 0) / approvedReviewsCount).toFixed(1)
//     : 0;

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-200">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="bg-linear-to-r from-blue-600 to-indigo-800 rounded-2xl shadow-xl p-8 mb-8 text-white">
//           <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
//           <p className="text-blue-100">Manage products, orders, users, sellers, reviews, factory rates, deals and sliders</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Total Products</p>
//                 <p className="text-2xl font-bold text-gray-800">{products.length}</p>
//               </div>
//               <ShoppingBagIcon className="h-10 w-10 text-blue-500" />
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Total Orders</p>
//                 <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
//               </div>
//               <DocumentTextIcon className="h-10 w-10 text-green-500" />
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Seller Orders</p>
//                 <p className="text-2xl font-bold text-purple-600">{totalSellerOrders}</p>
//               </div>
//               <UsersIcon className="h-10 w-10 text-purple-500" />
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Total Commission</p>
//                 <p className="text-2xl font-bold text-orange-600">{formatPrice(totalCommission)}</p>
//               </div>
//               <ChartBarIcon className="h-10 w-10 text-orange-500" />
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Active Sellers</p>
//                 <p className="text-2xl font-bold text-teal-600">{uniqueSellers.length}</p>
//               </div>
//               <CurrencyDollarIcon className="h-10 w-10 text-teal-500" />
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Reviews</p>
//                 <p className="text-2xl font-bold text-pink-600">{totalReviews}</p>
//                 <p className="text-xs text-gray-400">{approvedReviewsCount} approved</p>
//               </div>
//               <StarIcon className="h-10 w-10 text-pink-500" />
//             </div>
//           </div>
//         </div>

//         {/* Review Summary Card */}
//         {totalReviews > 0 && (
//           <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl shadow-lg p-6 mb-8">
//             <div className="flex items-center justify-between flex-wrap gap-4">
//               <div className="flex items-center gap-4">
//                 <div className="text-center">
//                   <div className="text-4xl font-bold text-pink-600">{averageRating}</div>
//                   <div className="flex text-yellow-400 text-lg">
//                     {'★'.repeat(Math.round(averageRating))}{'☆'.repeat(5 - Math.round(averageRating))}
//                   </div>
//                   <div className="text-xs text-gray-500">Average Rating</div>
//                 </div>
//                 <div className="h-12 w-px bg-gray-300"></div>
//                 <div>
//                   <div className="text-2xl font-bold text-gray-800">{pendingReviewsCount}</div>
//                   <div className="text-sm text-gray-500">Pending Approval</div>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setActiveTab('reviews')}
//                 className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
//               >
//                 Manage Reviews
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Tabs */}
//         <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
//           <div className="flex gap-2 flex-wrap">
//             <button 
//               onClick={() => setActiveTab('products')} 
//               className={`px-6 py-3 rounded-lg font-semibold transition-all ${
//                 activeTab === 'products' 
//                   ? 'bg-blue-600 text-white shadow-md' 
//                   : 'text-gray-600 hover:bg-gray-100'
//               }`}
//             >
//               <ShoppingBagIcon className="h-5 w-5 inline mr-2" /> Products
//             </button>
            
//             <button 
//               onClick={() => setActiveTab('orders')} 
//               className={`px-6 py-3 rounded-lg font-semibold transition-all ${
//                 activeTab === 'orders' 
//                   ? 'bg-blue-600 text-white shadow-md' 
//                   : 'text-gray-600 hover:bg-gray-100'
//               }`}
//             >
//               <DocumentTextIcon className="h-5 w-5 inline mr-2" /> Orders
//               {pendingOrdersCount > 0 && (
//                 <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
//                   {pendingOrdersCount}
//                 </span>
//               )}
//             </button>
            
//             <button 
//               onClick={() => setActiveTab('sellers')} 
//               className={`px-6 py-3 rounded-lg font-semibold transition-all ${
//                 activeTab === 'sellers' 
//                   ? 'bg-purple-600 text-white shadow-md' 
//                   : 'text-gray-600 hover:bg-gray-100'
//               }`}
//             >
//               <UsersIcon className="h-5 w-5 inline mr-2" /> Sellers
//               {uniqueSellers.length > 0 && (
//                 <span className="ml-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
//                   {uniqueSellers.length}
//                 </span>
//               )}
//             </button>
            
//             <button 
//               onClick={() => setActiveTab('reviews')} 
//               className={`px-6 py-3 rounded-lg font-semibold transition-all ${
//                 activeTab === 'reviews' 
//                   ? 'bg-pink-600 text-white shadow-md' 
//                   : 'text-gray-600 hover:bg-gray-100'
//               }`}
//             >
//               <StarIcon className="h-5 w-5 inline mr-2" /> Reviews
//               {pendingReviewsCount > 0 && (
//                 <span className="ml-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
//                   {pendingReviewsCount}
//                 </span>
//               )}
//             </button>
            
//             <button 
//               onClick={() => setActiveTab('factoryRates')} 
//               className={`px-6 py-3 rounded-lg font-semibold transition-all ${
//                 activeTab === 'factoryRates' 
//                   ? 'bg-teal-600 text-white shadow-md' 
//                   : 'text-gray-600 hover:bg-gray-100'
//               }`}
//             >
//               <CurrencyDollarIcon className="h-5 w-5 inline mr-2" /> Factory Rates
//             </button>
            
//             <button 
//               onClick={() => setActiveTab('users')} 
//               className={`px-6 py-3 rounded-lg font-semibold transition-all ${
//                 activeTab === 'users' 
//                   ? 'bg-green-600 text-white shadow-md' 
//                   : 'text-gray-600 hover:bg-gray-100'
//               }`}
//             >
//               <UsersIcon className="h-5 w-5 inline mr-2" /> All Users
//             </button>
            
//             <button 
//               onClick={() => setActiveTab('deals')} 
//               className={`px-6 py-3 rounded-lg font-semibold transition-all ${
//                 activeTab === 'deals' 
//                   ? 'bg-orange-600 text-white shadow-md' 
//                   : 'text-gray-600 hover:bg-gray-100'
//               }`}
//             >
//               <FireIcon className="h-5 w-5 inline mr-2" /> Deals
//             </button>

//             {/* NEW SLIDER MANAGER BUTTON - ADDED */}
//             <button 
//               onClick={() => setActiveTab('slider')} 
//               className={`px-6 py-3 rounded-lg font-semibold transition-all ${
//                 activeTab === 'slider' 
//                   ? 'bg-indigo-600 text-white shadow-md' 
//                   : 'text-gray-600 hover:bg-gray-100'
//               }`}
//             >
//               <PhotoIcon className="h-5 w-5 inline mr-2" /> Slider Manager
//             </button>
//           </div>
//         </div>

//         {/* Tab Content */}
//         {activeTab === 'products' && <ProductsTab products={products} fetchProducts={fetchProducts} />}
//         {activeTab === 'orders' && <OrdersTab orders={orders} fetchOrders={fetchOrders} />}
//         {activeTab === 'sellers' && <SellersTab orders={orders} sellers={sellers} />}
//         {activeTab === 'reviews' && <ReviewsTab />}
//         {activeTab === 'factoryRates' && <FactoryRatesTab />}
//         {activeTab === 'users' && <UsersTab />}
//         {activeTab === 'deals' && <DealsTab deals={deals} fetchDeals={fetchDeals} products={products} />}
        
//         {/* NEW SLIDER MANAGER CONTENT - ADDED */}
//         {activeTab === 'slider' && <SliderManager />}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBagIcon, 
  DocumentTextIcon, 
  FireIcon, 
  UsersIcon, 
  ChartBarIcon,
  CurrencyDollarIcon,
  StarIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import ProductsTab from './components/ProductsTab';
import OrdersTab from './components/OrdersTab';
import DealsTab from './components/DealsTab';
import UsersTab from './components/UsersTab';
import SellersTab from './components/SellersTab';
import FactoryRatesTab from './components/FactoryRatesTab';
import ReviewsTab from './components/ReviewsTab';
import SliderManager from './components/SliderManager';

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deals, setDeals] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const router = useRouter();

  // Helper function to format numbers - removes decimals
  const formatPrice = (price) => {
    if (!price && price !== 0) return '₹0';
    let num = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(num)) return '₹0';
    // Round to nearest integer to fix floating point issues
    const rounded = Math.round(num);
    return `₹${rounded.toLocaleString('en-IN')}`;
  };

  // Check admin access
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    try {
      const user = JSON.parse(userData);
      if (user.role !== 'admin') router.push('/');
    } catch (error) {
      router.push('/login');
    }
  }, [router]);

  // Fetch functions with cache prevention
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      const data = await res.json();
      if (data.success) setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchDeals = async () => {
    try {
      // Add cache busting to get fresh data
      const res = await fetch('/api/trending-deals', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      const data = await res.json();
      console.log('Fetched deals from API:', data.deals?.length || 0, 'deals');
      if (data.success) {
        setDeals(data.deals || []);
      } else {
        setDeals([]);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
      setDeals([]);
    }
  };

  const fetchSellers = async () => {
    try {
      const res = await fetch('/api/users?role=seller', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      const data = await res.json();
      if (data.success) setSellers(data.users || []);
    } catch (error) {
      console.error('Error fetching sellers:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      const data = await res.json();
      if (data.success) setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchOrders(), fetchDeals(), fetchSellers(), fetchReviews()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Calculate statistics with rounded values
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const sellerOrders = orders.filter(o => o.source === 'seller_portal');
  const totalSellerOrders = sellerOrders.length;
  // Round the commission to nearest integer
  const totalCommission = Math.round(sellerOrders.reduce((sum, order) => sum + (order.commission || 0), 0));
  const uniqueSellers = [...new Set(sellerOrders.map(o => o.sellerInfo?.sellerId).filter(Boolean))];
  
  // Review statistics
  const pendingReviewsCount = reviews.filter(r => !r.isApproved).length;
  const approvedReviewsCount = reviews.filter(r => r.isApproved).length;
  const totalReviews = reviews.length;
  const averageRating = reviews.filter(r => r.isApproved).length > 0 
    ? (reviews.filter(r => r.isApproved).reduce((sum, r) => sum + r.rating, 0) / approvedReviewsCount).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-800 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-blue-100">Manage products, orders, users, sellers, reviews, factory rates, deals and sliders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-gray-800">{products.length}</p>
              </div>
              <ShoppingBagIcon className="h-10 w-10 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
              </div>
              <DocumentTextIcon className="h-10 w-10 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Seller Orders</p>
                <p className="text-2xl font-bold text-purple-600">{totalSellerOrders}</p>
              </div>
              <UsersIcon className="h-10 w-10 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Commission</p>
                <p className="text-2xl font-bold text-orange-600">{formatPrice(totalCommission)}</p>
              </div>
              <ChartBarIcon className="h-10 w-10 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Sellers</p>
                <p className="text-2xl font-bold text-teal-600">{uniqueSellers.length}</p>
              </div>
              <CurrencyDollarIcon className="h-10 w-10 text-teal-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Reviews</p>
                <p className="text-2xl font-bold text-pink-600">{totalReviews}</p>
                <p className="text-xs text-gray-400">{approvedReviewsCount} approved</p>
              </div>
              <StarIcon className="h-10 w-10 text-pink-500" />
            </div>
          </div>
        </div>

        {/* Review Summary Card */}
        {totalReviews > 0 && (
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-pink-600">{averageRating}</div>
                  <div className="flex text-yellow-400 text-lg">
                    {'★'.repeat(Math.round(averageRating))}{'☆'.repeat(5 - Math.round(averageRating))}
                  </div>
                  <div className="text-xs text-gray-500">Average Rating</div>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{pendingReviewsCount}</div>
                  <div className="text-sm text-gray-500">Pending Approval</div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('reviews')}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
              >
                Manage Reviews
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={() => setActiveTab('products')} 
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'products' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ShoppingBagIcon className="h-5 w-5 inline mr-2" /> Products
            </button>
            
            <button 
              onClick={() => setActiveTab('orders')} 
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'orders' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <DocumentTextIcon className="h-5 w-5 inline mr-2" /> Orders
              {pendingOrdersCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
            
            <button 
              onClick={() => setActiveTab('sellers')} 
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'sellers' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <UsersIcon className="h-5 w-5 inline mr-2" /> Sellers
              {uniqueSellers.length > 0 && (
                <span className="ml-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  {uniqueSellers.length}
                </span>
              )}
            </button>
            
            <button 
              onClick={() => setActiveTab('reviews')} 
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'reviews' 
                  ? 'bg-pink-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <StarIcon className="h-5 w-5 inline mr-2" /> Reviews
              {pendingReviewsCount > 0 && (
                <span className="ml-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                  {pendingReviewsCount}
                </span>
              )}
            </button>
            
            <button 
              onClick={() => setActiveTab('factoryRates')} 
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'factoryRates' 
                  ? 'bg-teal-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CurrencyDollarIcon className="h-5 w-5 inline mr-2" /> Factory Rates
            </button>
            
            <button 
              onClick={() => setActiveTab('users')} 
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'users' 
                  ? 'bg-green-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <UsersIcon className="h-5 w-5 inline mr-2" /> All Users
            </button>
            
            <button 
              onClick={() => setActiveTab('deals')} 
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'deals' 
                  ? 'bg-orange-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FireIcon className="h-5 w-5 inline mr-2" /> Deals
              {deals.length > 0 && (
                <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  {deals.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('slider')} 
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'slider' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <PhotoIcon className="h-5 w-5 inline mr-2" /> Slider Manager
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && <ProductsTab products={products} fetchProducts={fetchProducts} />}
        {activeTab === 'orders' && <OrdersTab orders={orders} fetchOrders={fetchOrders} />}
        {activeTab === 'sellers' && <SellersTab orders={orders} sellers={sellers} />}
        {activeTab === 'reviews' && <ReviewsTab />}
        {activeTab === 'factoryRates' && <FactoryRatesTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'deals' && <DealsTab deals={deals} fetchDeals={fetchDeals} products={products} />}
        {activeTab === 'slider' && <SliderManager />}
      </div>
    </div>
  );
}