
// app/(components)/seller/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SellerPortal = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [factoryRates, setFactoryRates] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [sellerForm, setSellerForm] = useState({
    sellerId: '',
    name: '',
    phone: '',
    address: { city: '', area: '' }
  });
  const [orderPlacing, setOrderPlacing] = useState(false);
  const [sellerStats, setSellerStats] = useState({ 
    totalOrders: 0, 
    totalCommission: 0,
    pendingCommission: 0,
    paidCommission: 0,
    orders: []
  });
  const [profitHistory, setProfitHistory] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    
    if (parsedUser.role !== 'seller') {
      router.push('/home');
      return;
    }
    
    setUser(parsedUser);
    loadCart();
    fetchProducts();
    fetchFactoryRates();
    
    setSellerForm(prev => ({ 
      ...prev, 
      sellerId: parsedUser.email,
      name: parsedUser.name || parsedUser.email?.split('@')[0] || 'Seller',
      phone: parsedUser.phone || ''
    }));
    
    loadSellerData(parsedUser.email);
    
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.categories === selectedCategory));
    }
  }, [selectedCategory, products]);

  const loadSellerData = async (sellerId) => {
    try {
      await Promise.all([
        fetchSellerStats(sellerId),
        fetchProfitHistory(sellerId)
      ]);
    } catch (error) {
      console.error("Error loading seller data:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
        setFilteredProducts(data.products);
        const uniqueCategories = [...new Set(data.products.map(p => p.categories).filter(Boolean))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchFactoryRates = async () => {
    try {
      const response = await fetch('/api/factory-rates');
      if (!response.ok) throw new Error('Failed to fetch factory rates');
      const data = await response.json();
      if (data.success) setFactoryRates(data.rates);
    } catch (error) {
      console.error("Error fetching factory rates:", error);
    }
  };

  const fetchSellerStats = async (sellerId) => {
    try {
      const response = await fetch(`/api/orders?sellerId=${encodeURIComponent(sellerId)}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      
      if (data.success) {
        const sellerOrders = data.orders.filter(o => o.source === 'seller_portal' && o.sellerInfo?.sellerId === sellerId);
        
        const totalOrders = sellerOrders.length;
        const totalCommission = sellerOrders.reduce((sum, order) => sum + (order.commission || 0), 0);
        const pendingCommission = sellerOrders.filter(o => o.commissionStatus === 'pending').reduce((sum, o) => sum + (o.commission || 0), 0);
        const paidCommission = sellerOrders.filter(o => o.commissionStatus === 'paid').reduce((sum, o) => sum + (o.commission || 0), 0);
        
        setSellerStats({ 
          totalOrders, 
          totalCommission,
          pendingCommission,
          paidCommission,
          orders: sellerOrders
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchProfitHistory = async (sellerId) => {
    try {
      const response = await fetch(`/api/orders?sellerId=${encodeURIComponent(sellerId)}`);
      if (!response.ok) throw new Error('Failed to fetch profit history');
      const data = await response.json();
      
      if (data.success) {
        const deliveredOrders = data.orders.filter(o => 
          o.source === 'seller_portal' && 
          o.sellerInfo?.sellerId === sellerId && 
          o.status === 'delivered'
        );
        setProfitHistory(deliveredOrders);
      }
    } catch (error) {
      console.error("Error fetching profit history:", error);
    }
  };

  const refreshData = async () => {
    if (!user?.email) return;
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchSellerStats(user.email),
        fetchProfitHistory(user.email)
      ]);
      alert(`✅ Data refreshed! Found ${profitHistory.length} delivered orders`);
    } catch (error) {
      console.error("Error refreshing data:", error);
      alert("Error refreshing data. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadCart = () => {
    const saved = localStorage.getItem('sellerCart');
    if (saved) setCart(JSON.parse(saved));
  };

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('sellerCart', JSON.stringify(newCart));
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product._id);
    if (existing) {
      saveCart(cart.map(item => 
        item.id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      saveCart([...cart, { 
        id: product._id, 
        name: product.name, 
        price: product.price, 
        quantity: 1, 
        image: product.image 
      }]);
    }
    alert(`${product.name} added to cart!`);
  };

  const updateQuantity = (id, change) => {
    const newCart = cart.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    );
    saveCart(newCart);
  };

  const removeFromCart = (id) => {
    saveCart(cart.filter(item => item.id !== id));
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }
    setShowCart(false);
    setShowCheckout(true);
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    
    if (!sellerForm.sellerId || !sellerForm.name || !sellerForm.phone || !sellerForm.address.city || !sellerForm.address.area) {
      alert("Please fill all fields (Seller ID, Name, Phone, City, and Area)");
      return;
    }
    
    setOrderPlacing(true);
    
    const orderData = {
      orderId: `SEL-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount: getCartTotal(),
      source: 'seller_portal',
      customer: {
        name: sellerForm.name,
        phone: sellerForm.phone,
        address: {
          city: sellerForm.address.city,
          area: sellerForm.address.area
        }
      },
      sellerInfo: {
        sellerId: sellerForm.sellerId,
        name: sellerForm.name,
        phone: sellerForm.phone,
        address: {
          city: sellerForm.address.city,
          area: sellerForm.address.area
        }
      }
    };
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.removeItem('sellerCart');
        setCart([]);
        setShowCheckout(false);
        await refreshData();
        alert(`Order placed successfully!\n\nOrder ID: ${orderData.orderId}`);
      } else {
        alert("Failed to place order: " + (data.error || JSON.stringify(data)));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error: " + error.message);
    } finally {
      setOrderPlacing(false);
    }
  };

  const goToHome = () => {
    router.push('/home');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('sellerCart');
    router.push('/login');
  };

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const viewProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading Seller Portal...</div>
      </div>
    );
  }

  const statsCards = [
    { id: "card-total-orders", title: "Total Orders", value: sellerStats.totalOrders, color: "text-white" },
    { id: "card-total-commission", title: "Total Commission", value: `₹${sellerStats.totalCommission}`, color: "text-green-500" },
    { id: "card-pending-commission", title: "Pending Commission", value: `₹${sellerStats.pendingCommission}`, color: "text-yellow-500" },
    { id: "card-paid-commission", title: "Paid Commission", value: `₹${sellerStats.paidCommission}`, color: "text-blue-500" }
  ];

  const groupedRates = factoryRates.reduce((groups, rate) => {
    if (!groups[rate.category]) {
      groups[rate.category] = [];
    }
    groups[rate.category].push(rate);
    return groups;
  }, {});

  const totalDeliveredOrders = profitHistory.length;
  const totalEarnedCommission = profitHistory.reduce((sum, order) => sum + (order.commission || 0), 0);
  const avgCommission = totalDeliveredOrders > 0 ? (totalEarnedCommission / totalDeliveredOrders).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button onClick={goToHome} className="text-white font-bold text-xl hover:text-purple-400 transition">
                Seller Portal
              </button>
              <div className="hidden md:flex gap-4">
                <button onClick={() => setActiveTab("dashboard")} className={`px-3 py-2 rounded ${activeTab === "dashboard" ? "bg-purple-600" : "text-gray-300"}`}>Dashboard</button>
                <button onClick={() => setActiveTab("shop")} className={`px-3 py-2 rounded ${activeTab === "shop" ? "bg-purple-600" : "text-gray-300"}`}>Shop</button>
                <button onClick={() => setActiveTab("factoryRates")} className={`px-3 py-2 rounded ${activeTab === "factoryRates" ? "bg-purple-600" : "text-gray-300"}`}>🏭 Factory Rates</button>
                <button onClick={() => setActiveTab("profitHistory")} className={`px-3 py-2 rounded ${activeTab === "profitHistory" ? "bg-purple-600" : "text-gray-300"}`}>📊 Profit History</button>
                <button onClick={() => setShowCart(true)} className="relative text-gray-300 hover:text-white transition">
                  🛒 Cart 
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </button>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-gray-300">{user?.email}</span>
              <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      {/* IMPROVED CART MODAL - Centered with better design */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-700">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <div>
                <h2 className="text-2xl font-bold text-white">Your Cart</h2>
                <p className="text-gray-400 text-sm mt-1">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
              </div>
              <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-white text-3xl transition">&times;</button>
            </div>
            
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-400 text-lg">Your cart is empty</p>
                  <p className="text-gray-500 text-sm mt-2">Add products from the Shop tab to get started</p>
                  <button 
                    onClick={() => setShowCart(false)}
                    className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-gray-800 rounded-xl p-4 flex gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.image && item.image !== 'pending' ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{item.name}</h3>
                        <p className="text-purple-400 font-bold mt-1">₹{item.price.toLocaleString()}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)} 
                            className="w-8 h-8 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition"
                          >
                            -
                          </button>
                          <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)} 
                            className="w-8 h-8 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition"
                          >
                            +
                          </button>
                          <button 
                            onClick={() => removeFromCart(item.id)} 
                            className="ml-auto text-red-400 hover:text-red-300 text-sm transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-white font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-800 p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-2xl font-bold text-white">₹{getCartTotal().toLocaleString()}</span>
                </div>
                <button 
                  onClick={handleCheckout} 
                  className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
                >
                  Proceed to Checkout
                </button>
                <button 
                  onClick={() => setShowCart(false)} 
                  className="w-full mt-2 text-gray-400 py-2 rounded-xl hover:text-white transition"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Checkout</h2>
                <button onClick={() => setShowCheckout(false)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
              </div>
              <p className="text-gray-400 text-sm mb-6">Enter your details to place your order</p>
              
              <form onSubmit={placeOrder} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Seller ID *</label>
                  <input type="text" value={sellerForm.sellerId} onChange={(e) => setSellerForm({...sellerForm, sellerId: e.target.value})} className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Full Name *</label>
                  <input type="text" value={sellerForm.name} onChange={(e) => setSellerForm({...sellerForm, name: e.target.value})} className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Phone Number *</label>
                  <input type="tel" value={sellerForm.phone} onChange={(e) => setSellerForm({...sellerForm, phone: e.target.value})} className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">City *</label>
                  <input type="text" value={sellerForm.address.city} onChange={(e) => setSellerForm({...sellerForm, address: {...sellerForm.address, city: e.target.value}})} className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Area *</label>
                  <input type="text" value={sellerForm.address.area} onChange={(e) => setSellerForm({...sellerForm, address: {...sellerForm.address, area: e.target.value}})} className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none" required />
                </div>
                
                <div className="bg-purple-900/30 p-4 rounded-xl mt-4">
                  <p className="text-gray-300 text-sm mb-2">Order Summary:</p>
                  <div className="flex justify-between text-white">
                    <span>Total Amount:</span>
                    <span className="font-bold">₹{getCartTotal().toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button type="submit" disabled={orderPlacing} className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50">
                    {orderPlacing ? "Placing..." : "Place Order"}
                  </button>
                  <button type="button" onClick={() => setShowCheckout(false)} className="px-6 py-3 bg-gray-800 text-gray-400 rounded-xl hover:bg-gray-700 transition">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Product View Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Product Details</h2>
              <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="h-64 bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden">
                  {selectedProduct.image && selectedProduct.image !== 'pending' && !imageErrors[selectedProduct._id] ? (
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-contain" onError={() => handleImageError(selectedProduct._id)} />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <svg className="w-20 h-20 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">No Image Available</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedProduct.name}</h3>
                  <p className="text-purple-400 text-xl mt-1">₹{selectedProduct.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Category</p>
                  <p className="text-white">{selectedProduct.categories || 'Uncategorized'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Description</p>
                  <p className="text-gray-300">{selectedProduct.description || 'No description available'}</p>
                </div>
                {selectedProduct.factoryPrice > 0 && (
                  <div>
                    <p className="text-gray-400 text-sm">Factory Price</p>
                    <p className="text-green-400">₹{selectedProduct.factoryPrice.toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${selectedProduct.status === 'approved' ? 'bg-green-900 text-green-300' : selectedProduct.status === 'pending' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'}`}>
                    {selectedProduct.status?.toUpperCase() || 'PENDING'}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button onClick={() => { addToCart(selectedProduct); setShowProductModal(false); }} className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition">
                  Add to Cart
                </button>
                <button onClick={() => setShowProductModal(false)} className="px-6 py-3 bg-gray-800 text-gray-400 rounded-xl hover:bg-gray-700 transition">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Keep your existing tabs here */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">Seller Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {statsCards.map((stat) => (
                <div key={stat.id} className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                  <h3 className="text-gray-400 text-sm">{stat.title}</h3>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="mb-6 flex justify-end">
              <button onClick={refreshData} disabled={isRefreshing} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 transition disabled:opacity-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                {isRefreshing ? "Refreshing..." : "Refresh Data"}
              </button>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
              <div className="space-y-3 text-gray-300">
                <p>1. Browse products from the Shop tab</p>
                <p>2. Add products to your cart</p>
                <p>3. At checkout, enter your details</p>
                <p>4. Place your order and we'll process it</p>
                <p className="text-purple-400 mt-4">Your Seller ID: <span className="font-mono">{sellerForm.sellerId}</span></p>
              </div>
            </div>
          </div>
        )}

        {/* Shop Tab */}
        {activeTab === "shop" && (
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">Products for Resale</h1>
            <p className="text-gray-400 mb-6">Browse our collection and add items to your cart</p>
            
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setSelectedCategory("all")} className={`px-4 py-2 rounded-full transition ${selectedCategory === "all" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>
                  All Products ({products.length})
                </button>
                {categories.map((category) => (
                  <button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 rounded-full transition ${selectedCategory === category ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>
                    {category} ({products.filter(p => p.categories === category).length})
                  </button>
                ))}
              </div>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-gray-900 rounded-xl">
                <p className="text-gray-400">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
                  const hasImageError = imageErrors[product._id];
                  const validImage = product.image && product.image !== 'pending' && !hasImageError;
                  
                  return (
                    <div key={product._id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 transition-all duration-300 flex flex-col">
                      <div className="h-56 bg-gray-800 flex items-center justify-center relative overflow-hidden cursor-pointer" onClick={() => viewProduct(product)}>
                        {validImage ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" onError={() => handleImageError(product._id)} />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description?.substring(0, 80)}</p>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-purple-400 font-bold text-2xl">₹{product.price.toLocaleString()}</p>
                          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">{product.categories || 'General'}</span>
                        </div>
                        <div className="mt-auto flex gap-2">
                          <button onClick={() => viewProduct(product)} className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition text-sm font-medium">
                            View
                          </button>
                          <button onClick={() => addToCart(product)} className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Factory Rates Tab */}
        {activeTab === "factoryRates" && (
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">Factory Rates</h1>
            <p className="text-gray-400 mb-8">View competitive pricing from factories</p>
            {factoryRates.length === 0 ? (
              <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
                <p className="text-gray-400">No factory rates available yet. Check back later.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.keys(groupedRates).map((category, categoryIndex) => (
                  <div key={categoryIndex} className="bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3">
                      <h2 className="text-xl font-bold text-white">{category}</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Factory Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Selling Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Min Order</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Supplier</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Profit Margin</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {groupedRates[category].map((rate, rateIndex) => {
                            const profitMargin = ((rate.sellingPrice - rate.factoryPrice) / rate.factoryPrice * 100).toFixed(1);
                            return (
                              <tr key={rateIndex} className="hover:bg-gray-800/50">
                                <td className="px-6 py-4 text-white font-medium">{rate.productName}</td>
                                <td className="px-6 py-4 text-purple-400">₹{rate.factoryPrice.toLocaleString()}</td>
                                <td className="px-6 py-4 text-green-400">₹{rate.sellingPrice.toLocaleString()}</td>
                                <td className="px-6 py-4 text-gray-300">{rate.minOrderQuantity}+</td>
                                <td className="px-6 py-4 text-gray-400">{rate.supplier || '-'}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${profitMargin > 50 ? 'bg-green-900 text-green-300' : profitMargin > 20 ? 'bg-blue-900 text-blue-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                    {profitMargin}%
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profit History Tab */}
        {activeTab === "profitHistory" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Profit & Commission History</h1>
                <p className="text-gray-400 mt-1">Track your earnings from delivered orders</p>
              </div>
              <button onClick={refreshData} disabled={isRefreshing} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-purple-900/50 to-purple-800/50 p-6 rounded-xl border border-purple-500/30">
                <h3 className="text-gray-400 text-sm">Delivered Orders</h3>
                <p className="text-3xl font-bold text-white">{totalDeliveredOrders}</p>
              </div>
              <div className="bg-gradient-to-r from-green-900/50 to-green-800/50 p-6 rounded-xl border border-green-500/30">
                <h3 className="text-gray-400 text-sm">Total Commission Earned</h3>
                <p className="text-3xl font-bold text-green-400">₹{totalEarnedCommission.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 p-6 rounded-xl border border-blue-500/30">
                <h3 className="text-gray-400 text-sm">Average Commission</h3>
                <p className="text-3xl font-bold text-blue-400">₹{avgCommission}</p>
              </div>
            </div>
            {profitHistory.length === 0 ? (
              <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
                <p className="text-gray-400 text-lg">No delivered orders yet</p>
                <p className="text-sm text-gray-500 mt-2">When admin marks your order as "Delivered", it will appear here.</p>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Items</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Total Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Commission</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {profitHistory.map((order, orderIndex) => (
                        <tr key={orderIndex} className="hover:bg-gray-800/50">
                          <td className="px-6 py-4 font-mono text-sm text-purple-400">{order.orderId}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{new Date(order.orderDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{order.items?.length || 0} items</td>
                          <td className="px-6 py-4 text-sm font-semibold text-white">₹{(order.totalAmount || 0).toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-green-400">₹{(order.commission || 0).toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded-full text-xs bg-green-900 text-green-300">✅ Delivered</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPortal;