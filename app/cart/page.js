
// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';

// export default function CartPage() {
//   const [cart, setCart] = useState([]);
//   const [showCheckoutModal, setShowCheckoutModal] = useState(false);
//   const [customerInfo, setCustomerInfo] = useState({
//     name: '',
//     phone: '',
//     address: {
//       city: '',
//       area: ''
//     }
//   });
//   const [orderPlacing, setOrderPlacing] = useState(false);
//   const [orderPlaced, setOrderPlaced] = useState(false);
//   const [orderError, setOrderError] = useState('');
//   const [placedOrder, setPlacedOrder] = useState(null);

//   // Load cart on page load
//   useEffect(() => {
//     const savedCart = localStorage.getItem('cart');
//     if (savedCart) {
//       const parsedCart = JSON.parse(savedCart);
//       const validCart = parsedCart.filter(item => item && (item.id || item._id));
//       const normalizedCart = validCart.map(item => ({
//         ...item,
//         id: item.id || item._id,
//       }));
//       setCart(normalizedCart);
//     }
//   }, []);

//   // Update quantity
//   const updateQuantity = (id, newQuantity) => {
//     if (newQuantity < 1) return;
//     const updatedCart = cart.map(item => 
//       item.id === id ? { ...item, quantity: newQuantity } : item
//     );
//     setCart(updatedCart);
//     localStorage.setItem('cart', JSON.stringify(updatedCart));
//     window.dispatchEvent(new Event('cartUpdated'));
//   };

//   // Remove item
//   const removeItem = (id) => {
//     const updatedCart = cart.filter(item => item.id !== id);
//     setCart(updatedCart);
//     localStorage.setItem('cart', JSON.stringify(updatedCart));
//     window.dispatchEvent(new Event('cartUpdated'));
//   };

//   // Calculate total
//   const total = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
//   const shippingCost = total > 5000 ? 0 : 99;
//   const finalTotal = total + shippingCost;

//   // Handle checkout
//   const handleCheckout = () => {
//     setShowCheckoutModal(true);
//   };

//   // Generate random order ID
//   const generateOrderId = () => {
//     const prefix = 'ORD';
//     const timestamp = Date.now().toString().slice(-8);
//     const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//     return `${prefix}${timestamp}${random}`;
//   };

//   // Validate phone number
//   const validatePhoneNumber = (phone) => {
//     const phoneRegex = /^[0-9]{10,15}$/;
//     return phoneRegex.test(phone.replace(/\s/g, ''));
//   };

//   // Place order
// // In your cart page, replace the existing placeOrder function with this:

// const placeOrder = async (e) => {
//   e.preventDefault();
  
//   if (!customerInfo.name || !customerInfo.phone || !customerInfo.address.city || !customerInfo.address.area) {
//     setOrderError('Please fill in all fields (Name, Phone Number, City, and Area)');
//     return;
//   }

//   // Phone number validation
//   if (!validatePhoneNumber(customerInfo.phone)) {
//     setOrderError('Please enter a valid phone number (10-15 digits)');
//     return;
//   }
  
//   setOrderPlacing(true);
//   setOrderError('');
  
//   const orderId = generateOrderId();
  
//   // Create order data with correct field names
//   const orderData = {
//     orderId: orderId,
//     items: cart.map(item => ({
//       id: item.id || item._id,
//       name: item.name,
//       price: item.price,
//       quantity: item.quantity,
//       image: item.image
//     })),
//     totalAmount: finalTotal, // CRITICAL: Use 'totalAmount' not 'total'
//     customer: {
//       name: customerInfo.name,
//       phone: customerInfo.phone,
//       address: {
//         area: customerInfo.address.area,
//         city: customerInfo.address.city
//       }
//     },
//     source: 'customer',
//     orderDate: new Date().toISOString(),
//     status: 'pending'
//   };
  
//   try {
//     const response = await fetch('/api/orders', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(orderData),
//     });
    
//     const data = await response.json();
    
//     if (data.success) {
//       // Save order to localStorage for tracking
//       const savedOrders = localStorage.getItem('orders');
//       const orders = savedOrders ? JSON.parse(savedOrders) : [];
//       orders.push(orderData);
//       localStorage.setItem('orders', JSON.stringify(orders));
      
//       // Clear cart
//       localStorage.removeItem('cart');
//       setCart([]);
//       setPlacedOrder(orderData);
//       setOrderPlaced(true);
//       setShowCheckoutModal(false);
      
//       // Dispatch event to update cart count in header
//       window.dispatchEvent(new Event('cartUpdated'));
//     } else {
//       setOrderError(data.error || 'Failed to place order');
//     }
//   } catch (error) {
//     console.error('Error placing order:', error);
//     setOrderError('Network error. Please try again.');
//   } finally {
//     setOrderPlacing(false);
//   }
// };

//   if (orderPlaced && placedOrder) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-12">
//         <div className="max-w-2xl mx-auto px-4">
//           <div className="bg-white rounded-lg shadow-lg p-8 text-center">
//             <div className="mb-6">
//               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                 </svg>
//               </div>
//               <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
              
//               {/* Order ID Card - Important for customer */}
//               <div className="mt-6 mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6">
//                 <p className="text-sm text-gray-600 mb-2">Your Order ID</p>
//                 <p className="text-3xl font-bold text-purple-600 font-mono tracking-wider mb-3">
//                   {placedOrder.orderId}
//                 </p>
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
//                   <p className="text-sm text-yellow-800 flex items-center justify-center gap-2">
//                     <span className="text-xl">⚠️</span>
//                     <span className="font-semibold">IMPORTANT:</span>
//                     Please save this Order ID to track your order status!
//                   </p>
//                 </div>
//               </div>
              
//               <div className="border-t border-gray-200 pt-4">
//                 <p className="text-gray-700 mb-2">📞 We will call you shortly to confirm your order.</p>
//                 <p className="text-gray-700 mb-2">⏳ Your order is now under processing.</p>
//                 <p className="text-gray-700 font-semibold">🚚 Estimated delivery within 72 hours!</p>
//               </div>
//             </div>
            
//             <div className="space-y-3">
//               <Link 
//                 href="/product" 
//                 className="block w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
//               >
//                 Continue Shopping
//               </Link>
//               <Link 
//                 href={`/track-order?orderId=${placedOrder.orderId}`} 
//                 className="block w-full border-2 border-purple-600 text-purple-600 py-3 rounded-lg hover:bg-purple-50 transition font-semibold"
//               >
//                 Track Your Order
//               </Link>
//             </div>
            
//             {/* Order Summary */}
//             <div className="mt-6 text-left bg-gray-50 rounded-lg p-4">
//               <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
//               <p className="text-sm text-gray-600"><span className="font-medium">Name:</span> {placedOrder.customerInfo.name}</p>
//               <p className="text-sm text-gray-600"><span className="font-medium">Phone:</span> {placedOrder.customerInfo.phone}</p>
//               <p className="text-sm text-gray-600"><span className="font-medium">Address:</span> {placedOrder.customerInfo.address.area}, {placedOrder.customerInfo.address.city}</p>
//               <p className="text-sm text-gray-600"><span className="font-medium">Total Amount:</span> Rs: {placedOrder.total.toFixed(2)}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (cart.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-12">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
//           <Link href="/product" className="bg-purple-600 text-white px-6 py-3 rounded-lg inline-block">
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-7xl mx-auto px-4">
//         <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Cart Items */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow">
//               {cart.map((item) => (
//                 <div key={item.id} className="p-6 border-b flex gap-4">
//                   <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden">
//                     {item.image ? (
//                       <img 
//                         src={item.image} 
//                         alt={item.name}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
//                         No img
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-lg">{item.name}</h3>
//                     <p className="text-gray-600">Rs: {parseFloat(item.price).toFixed(2)}</p>
//                     <div className="flex items-center gap-3 mt-3">
//                       <button 
//                         onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
//                         className="px-3 py-1 border rounded hover:bg-gray-50"
//                       >-</button>
//                       <span className="w-8 text-center">{item.quantity || 1}</span>
//                       <button 
//                         onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
//                         className="px-3 py-1 border rounded hover:bg-gray-50"
//                       >+</button>
//                       <button 
//                         onClick={() => removeItem(item.id)}
//                         className="text-red-500 ml-4 hover:text-red-700"
//                       >Remove</button>
//                     </div>
//                   </div>
//                   <div className="font-semibold text-lg">
//                     Rs: {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="bg-white rounded-lg shadow p-6 h-fit">
//             <h2 className="text-xl font-bold mb-4">Order Summary</h2>
//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <span>Subtotal</span>
//                 <span>Rs: {total.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Shipping</span>
//                 <span>{shippingCost === 0 ? 'Free' : `Rs: ${shippingCost}`}</span>
//               </div>
//               <div className="border-t pt-2 mt-2">
//                 <div className="flex justify-between font-bold text-lg">
//                   <span>Total</span>
//                   <span>Rs: {finalTotal.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
//             <button 
//               onClick={handleCheckout}
//               className="w-full bg-purple-600 text-white py-3 rounded-lg mt-6 hover:bg-purple-700 transition"
//             >
//               Proceed to Checkout
//             </button>
//             <Link href="/product" className="block text-center text-purple-600 mt-4 hover:underline">
//               Continue Shopping
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Checkout Modal */}
//       {showCheckoutModal && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowCheckoutModal(false)}></div>
//           <div className="flex min-h-full items-center justify-center p-4">
//             <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
//               <div className="p-6">
//                 <h2 className="text-2xl font-bold mb-4">Complete Your Order</h2>
//                 <p className="text-gray-600 mb-4">Please provide your information below</p>
                
//                 {orderError && (
//                   <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
//                     {orderError}
//                   </div>
//                 )}
                
//                 <form onSubmit={placeOrder}>
//                   {/* Name Field */}
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium mb-1">Full Name *</label>
//                     <input
//                       type="text"
//                       value={customerInfo.name}
//                       onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                       required
//                       placeholder="Enter your full name"
//                     />
//                   </div>
                  
//                   {/* Phone Number Field */}
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium mb-1">Phone Number *</label>
//                     <input
//                       type="tel"
//                       value={customerInfo.phone}
//                       onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                       required
//                       placeholder="e.g., 03001234567"
//                     />
//                     <p className="text-xs text-gray-500 mt-1">Enter 10-15 digit phone number</p>
//                   </div>
                  
//                   {/* Address Section */}
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium mb-2">Address *</label>
                    
//                     {/* City Field */}
//                     <div className="mb-3">
//                       <input
//                         type="text"
//                         value={customerInfo.address.city}
//                         onChange={(e) => setCustomerInfo({
//                           ...customerInfo, 
//                           address: {...customerInfo.address, city: e.target.value}
//                         })}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                         required
//                         placeholder="City e.g., Karachi, Lahore, Islamabad"
//                       />
//                     </div>
                    
//                     {/* Area Field */}
//                     <div>
//                       <input
//                         type="text"
//                         value={customerInfo.address.area}
//                         onChange={(e) => setCustomerInfo({
//                           ...customerInfo, 
//                           address: {...customerInfo.address, area: e.target.value}
//                         })}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                         required
//                         placeholder="Area e.g., DHA, Gulberg, F-7"
//                       />
//                     </div>
//                   </div>
                  
//                   {/* Order Total */}
//                   <div className="mb-4 p-3 bg-gray-50 rounded-lg">
//                     <div className="flex justify-between mb-2">
//                       <span className="font-semibold">Total Amount:</span>
//                       <span className="font-bold text-purple-600">Rs: {finalTotal.toFixed(2)}</span>
//                     </div>
//                   </div>
                  
//                   {/* Buttons */}
//                   <div className="flex gap-3">
//                     <button
//                       type="submit"
//                       disabled={orderPlacing}
//                       className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition"
//                     >
//                       {orderPlacing ? 'Placing Order...' : 'Place Order'}
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => setShowCheckoutModal(false)}
//                       className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: {
      city: '',
      area: ''
    }
  });
  const [orderPlacing, setOrderPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  // Load cart on page load
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      const validCart = parsedCart.filter(item => item && (item.id || item._id));
      const normalizedCart = validCart.map(item => ({
        ...item,
        id: item.id || item._id,
      }));
      setCart(normalizedCart);
    }
  }, []);

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Remove item
  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Calculate total
  const total = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  const shippingCost = total > 5000 ? 0 : 99;
  const finalTotal = total + shippingCost;

  // Handle checkout
  const handleCheckout = () => {
    setShowCheckoutModal(true);
  };

  // Generate random order ID
  const generateOrderId = () => {
    const prefix = 'ORD';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${timestamp}${random}`;
  };

  // Validate phone number
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Place order
  const placeOrder = async (e) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address.city || !customerInfo.address.area) {
      setOrderError('Please fill in all fields (Name, Phone Number, City, and Area)');
      return;
    }

    // Phone number validation
    if (!validatePhoneNumber(customerInfo.phone)) {
      setOrderError('Please enter a valid phone number (10-15 digits)');
      return;
    }
    
    setOrderPlacing(true);
    setOrderError('');
    
    const orderId = generateOrderId();
    
    // Create order data with correct field names
    const orderData = {
      orderId: orderId,
      items: cart.map(item => ({
        id: item.id || item._id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
        image: item.image || ''
      })),
      totalAmount: parseFloat(finalTotal),
      customer: {
        name: customerInfo.name,
        phone: customerInfo.phone,
        address: {
          area: customerInfo.address.area,
          city: customerInfo.address.city
        }
      },
      source: 'customer',
      orderDate: new Date().toISOString(),
      status: 'pending'
    };
    
    console.log("Sending order:", orderData);
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      const data = await response.json();
      console.log("Response:", data);
      
      if (data.success) {
        // Save order to localStorage for tracking
        const savedOrders = localStorage.getItem('orders');
        const orders = savedOrders ? JSON.parse(savedOrders) : [];
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Clear cart
        localStorage.removeItem('cart');
        setCart([]);
        setPlacedOrder(orderData);
        setOrderPlaced(true);
        setShowCheckoutModal(false);
        
        // Dispatch event to update cart count in header
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        setOrderError(data.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setOrderError('Network error. Please try again.');
    } finally {
      setOrderPlacing(false);
    }
  };

  if (orderPlaced && placedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
              
              {/* Order ID Card */}
              <div className="mt-6 mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 mb-2">Your Order ID</p>
                <p className="text-3xl font-bold text-purple-600 font-mono tracking-wider mb-3">
                  {placedOrder.orderId}
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                  <p className="text-sm text-yellow-800 flex items-center justify-center gap-2">
                    <span className="text-xl">⚠️</span>
                    <span className="font-semibold">IMPORTANT:</span>
                    Please save this Order ID to track your order status!
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <p className="text-gray-700 mb-2">📞 We will call you shortly to confirm your order.</p>
                <p className="text-gray-700 mb-2">⏳ Your order is now under processing.</p>
                <p className="text-gray-700 font-semibold">🚚 Estimated delivery within 72 hours!</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link 
                href="/product" 
                className="block w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
              >
                Continue Shopping
              </Link>
              <Link 
                href={`/track-order?orderId=${placedOrder.orderId}`} 
                className="block w-full border-2 border-purple-600 text-purple-600 py-3 rounded-lg hover:bg-purple-50 transition font-semibold"
              >
                Track Your Order
              </Link>
            </div>
            
            {/* Order Summary - FIXED to use 'customer' not 'customerInfo' */}
            <div className="mt-6 text-left bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
              <p className="text-sm text-gray-600"><span className="font-medium">Name:</span> {placedOrder.customer?.name || 'N/A'}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Phone:</span> {placedOrder.customer?.phone || 'N/A'}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Address:</span> {placedOrder.customer?.address?.area || 'N/A'}, {placedOrder.customer?.address?.city || 'N/A'}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Total Amount:</span> Rs: {(placedOrder.totalAmount || placedOrder.total || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link href="/product" className="bg-purple-600 text-white px-6 py-3 rounded-lg inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {cart.map((item) => (
                <div key={item.id} className="p-6 border-b flex gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600">Rs: {parseFloat(item.price).toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button 
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                        className="px-3 py-1 border rounded hover:bg-gray-50"
                      >-</button>
                      <span className="w-8 text-center">{item.quantity || 1}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        className="px-3 py-1 border rounded hover:bg-gray-50"
                      >+</button>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 ml-4 hover:text-red-700"
                      >Remove</button>
                    </div>
                  </div>
                  <div className="font-semibold text-lg">
                    Rs: {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs: {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `Rs: ${shippingCost}`}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>Rs: {finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-purple-600 text-white py-3 rounded-lg mt-6 hover:bg-purple-700 transition"
            >
              Proceed to Checkout
            </button>
            <Link href="/product" className="block text-center text-purple-600 mt-4 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowCheckoutModal(false)}></div>
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Complete Your Order</h2>
                <p className="text-gray-600 mb-4">Please provide your information below</p>
                
                {orderError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {orderError}
                  </div>
                )}
                
                <form onSubmit={placeOrder}>
                  {/* Name Field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  {/* Phone Number Field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                      placeholder="e.g., 03001234567"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter 10-15 digit phone number</p>
                  </div>
                  
                  {/* Address Section */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Address *</label>
                    
                    {/* City Field */}
                    <div className="mb-3">
                      <input
                        type="text"
                        value={customerInfo.address.city}
                        onChange={(e) => setCustomerInfo({
                          ...customerInfo, 
                          address: {...customerInfo.address, city: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                        placeholder="City e.g., Karachi, Lahore, Islamabad"
                      />
                    </div>
                    
                    {/* Area Field */}
                    <div>
                      <input
                        type="text"
                        value={customerInfo.address.area}
                        onChange={(e) => setCustomerInfo({
                          ...customerInfo, 
                          address: {...customerInfo.address, area: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                        placeholder="Area e.g., DHA, Gulberg, F-7"
                      />
                    </div>
                  </div>
                  
                  {/* Order Total */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="font-bold text-purple-600">Rs: {finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={orderPlacing}
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition"
                    >
                      {orderPlacing ? 'Placing Order...' : 'Place Order'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCheckoutModal(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}