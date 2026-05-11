// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter, usePathname } from 'next/navigation';
// import { 
//   Bars3Icon, 
//   XMarkIcon, 
//   ShoppingCartIcon,
//   UserCircleIcon,
//   ArrowRightOnRectangleIcon,
//   UserIcon,
//   Cog6ToothIcon,
//   ShieldCheckIcon
// } from '@heroicons/react/24/outline';

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [cartCount, setCartCount] = useState(0);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userMenuOpen, setUserMenuOpen] = useState(false);
//   const [userEmail, setUserEmail] = useState('');
//   const [userRole, setUserRole] = useState('');
//   const router = useRouter();
//   const pathname = usePathname();

//  const navigation = [
//   { name: 'Home', href: '/' },
//   { name: 'Shop', href: '/product' },
//   { name: 'About', href: '/about' },
//   { name: 'Services', href: '/services' },
//   { name: 'Order Status', href: '/order-status' }, 
//   { name: 'Customer Reviews', href: '/reviews' },
// ];

//   // Check login status and user role
//   const checkAuthStatus = () => {
//     const userData = localStorage.getItem('user');
//     if (userData) {
//       const user = JSON.parse(userData);
//       setIsLoggedIn(true);
//       setUserEmail(user.email);
//       setUserRole(user.role || 'user');
//     } else {
//       setIsLoggedIn(false);
//       setUserEmail('');
//       setUserRole('');
//     }
//   };

//   // Load cart count from localStorage
//   const updateCartCount = () => {
//     const savedCart = localStorage.getItem('cart');
//     if (savedCart) {
//       const cart = JSON.parse(savedCart);
//       const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
//       setCartCount(totalItems);
//     } else {
//       setCartCount(0);
//     }
//   };

//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     setIsLoggedIn(false);
//     setUserMenuOpen(false);
//     window.dispatchEvent(new Event('authChange'));
//     router.push('/');
//   };

//   useEffect(() => {
//     checkAuthStatus();
//     updateCartCount();

//     window.addEventListener('authChange', checkAuthStatus);
//     window.addEventListener('storage', updateCartCount);
//     window.addEventListener('cartUpdated', updateCartCount);

//     return () => {
//       window.removeEventListener('authChange', checkAuthStatus);
//       window.removeEventListener('storage', updateCartCount);
//       window.removeEventListener('cartUpdated', updateCartCount);
//     };
//   }, []);

//   return (
//     <nav className="bg-white sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <Link href="/" className="text-xl font-bold text-gray-800">
//               MegaMarket
//             </Link>
//           </div>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center space-x-8">
//             {navigation.map((item) => {
//               const isActive = pathname === item.href;
//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={`relative text-gray-700 hover:text-gray-900 transition-colors ${
//                     isActive ? 'text-blue-600' : ''
//                   }`}
//                 >
//                   {item.name}
//                   {isActive && (
//                     <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
//                   )}
//                 </Link>
//               );
//             })}
            
//             {/* Cart Button */}
//             <Link
//               href="/cart"
//               className={`relative flex items-center gap-2 transition-colors ${
//                 pathname === '/cart' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'
//               }`}
//             >
//               <ShoppingCartIcon className="h-6 w-6" />
//               {cartCount > 0 && (
//                 <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                   {cartCount}
//                 </span>
//               )}
//               {pathname === '/cart' && (
//                 <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
//               )}
//             </Link>
            
//             {/* Conditional Rendering - User Menu or Login Button */}
//             {isLoggedIn ? (
//               <div className="relative">
//                 <button
//                   onClick={() => setUserMenuOpen(!userMenuOpen)}
//                   className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
//                 >
//                   <UserCircleIcon className="h-8 w-8" />
//                   <span className="text-sm font-medium">{userEmail.split('@')[0]}</span>
//                 </button>
                
//                 {/* Dropdown Menu */}
//                 {userMenuOpen && (
//                   <>
//                     <div 
//                       className="fixed inset-0 z-10"
//                       onClick={() => setUserMenuOpen(false)}
//                     />
//                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
//                       <Link
//                         href="/profile"
//                         className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                         onClick={() => setUserMenuOpen(false)}
//                       >
//                         <UserIcon className="h-4 w-4 mr-2" />
//                         My Profile
//                       </Link>
                      
//                       {userRole === 'admin' && (
//                         <Link
//                           href="/dashboard"
//                           className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           onClick={() => setUserMenuOpen(false)}
//                         >
//                           <ShieldCheckIcon className="h-4 w-4 mr-2" />
//                           Admin Dashboard
//                         </Link>
//                       )}
                      
//                       <button
//                         onClick={handleLogout}
//                         className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                       >
//                         <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
//                         Logout
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             ) : (
//               <Link
//                 href="/login"
//                 className={`px-4 py-2 rounded-md transition-colors ${
//                   pathname === '/login' 
//                     ? 'bg-blue-700 text-white' 
//                     : 'bg-blue-600 text-white hover:bg-blue-700'
//                 }`}
//               >
//                 Login
//               </Link>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center gap-4">
//             <Link
//               href="/cart"
//               className={`relative transition-colors ${
//                 pathname === '/cart' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'
//               }`}
//             >
//               <ShoppingCartIcon className="h-6 w-6" />
//               {cartCount > 0 && (
//                 <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>
            
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="text-gray-700 hover:text-gray-900 focus:outline-none"
//             >
//               {isOpen ? (
//                 <XMarkIcon className="h-6 w-6" />
//               ) : (
//                 <Bars3Icon className="h-6 w-6" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="md:hidden">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//             {navigation.map((item) => {
//               const isActive = pathname === item.href;
//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={`block px-3 py-2 transition-colors ${
//                     isActive 
//                       ? 'text-blue-600 border-l-4 border-blue-600 bg-blue-50' 
//                       : 'text-gray-700 hover:text-gray-900'
//                   }`}
//                   onClick={() => setIsOpen(false)}
//                 >
//                   {item.name}
//                 </Link>
//               );
//             })}
//             <Link
//               href="/cart"
//               className={`block px-3 py-2 transition-colors ${
//                 pathname === '/cart'
//                   ? 'text-blue-600 border-l-4 border-blue-600 bg-blue-50'
//                   : 'text-gray-700 hover:text-gray-900'
//               }`}
//               onClick={() => setIsOpen(false)}
//             >
//               Cart ({cartCount})
//             </Link>
            
//             {isLoggedIn ? (
//               <>
//                 <Link
//                   href="/profile"
//                   className={`block px-3 py-2 transition-colors ${
//                     pathname === '/profile'
//                       ? 'text-blue-600 border-l-4 border-blue-600 bg-blue-50'
//                       : 'text-gray-700 hover:text-gray-900'
//                   }`}
//                   onClick={() => setIsOpen(false)}
//                 >
//                   My Profile
//                 </Link>
                
//                 {userRole === 'admin' && (
//                   <Link
//                     href="/dashboard"
//                     className={`block px-3 py-2 transition-colors ${
//                       pathname === '/dashboard'
//                         ? 'text-blue-600 border-l-4 border-blue-600 bg-blue-50'
//                         : 'text-gray-700 hover:text-gray-900'
//                     }`}
//                     onClick={() => setIsOpen(false)}
//                   >
//                     Admin Dashboard
//                   </Link>
//                 )}
                
//                 <button
//                   onClick={() => {
//                     handleLogout();
//                     setIsOpen(false);
//                   }}
//                   className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <Link
//                 href="/login"
//                 className={`block px-3 py-2 rounded-md text-center transition-colors ${
//                   pathname === '/login'
//                     ? 'bg-blue-700 text-white'
//                     : 'bg-blue-600 text-white hover:bg-blue-700'
//                 }`}
//                 onClick={() => setIsOpen(false)}
//               >
//                 Sign In
//               </Link>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Bars3Icon, 
  XMarkIcon, 
  ShoppingCartIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  Cog6ToothIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/product' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Order Status', href: '/order-status' }, 
    { name: 'Customer Reviews', href: '/reviews' },
  ];

  // Check login status from both Google session and regular login
  const checkAuthStatus = () => {
    // Check Google session first
    if (session?.user) {
      setIsLoggedIn(true);
      setUserName(session.user.name || session.user.email?.split('@')[0]);
      setUserEmail(session.user.email);
      setUserRole(session.user.role || 'user');
      return;
    }

    // Check regular login from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.isLoggedIn) {
          setIsLoggedIn(true);
          setUserEmail(user.email);
          setUserName(user.userData?.name || user.email?.split('@')[0]);
          setUserRole(user.role || 'user');
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    } else {
      setIsLoggedIn(false);
      setUserEmail('');
      setUserName('');
      setUserRole('');
    }
  };

  // Load cart count from localStorage
  const updateCartCount = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    } else {
      setCartCount(0);
    }
  };

  // Handle logout - works for both Google and regular login
  const handleLogout = () => {
    // Clear regular login
    localStorage.removeItem('user');
    
    // Sign out from Google if using Google login
    if (session) {
      signOut({ redirect: false });
    }
    
    setIsLoggedIn(false);
    setUserMenuOpen(false);
    window.dispatchEvent(new Event('authChange'));
    router.push('/');
  };

  useEffect(() => {
    checkAuthStatus();
    updateCartCount();

    window.addEventListener('authChange', checkAuthStatus);
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('authChange', checkAuthStatus);
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, [session, status]);

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              MegaMarket
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative text-gray-700 hover:text-gray-900 transition-colors ${
                    isActive ? 'text-blue-600' : ''
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
                  )}
                </Link>
              );
            })}
            
            {/* Cart Button */}
            <Link
              href="/cart"
              className={`relative flex items-center gap-2 transition-colors ${
                pathname === '/cart' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Conditional Rendering - User Menu or Login Button */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <UserCircleIcon className="h-8 w-8" />
                  <span className="text-sm font-medium">{userName || userEmail?.split('@')[0]}</span>
                </button>
                
                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-100">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{userName}</p>
                        <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                      </div>
                      
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <UserIcon className="h-4 w-4 mr-2" />
                        My Profile
                      </Link>
                      
                      {userRole === 'admin' && (
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <ShieldCheckIcon className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 border-t border-gray-100 mt-1"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={`px-4 py-2 rounded-md transition-colors ${
                  pathname === '/login' 
                    ? 'bg-blue-700 text-white' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Link
              href="/cart"
              className={`relative transition-colors ${
                pathname === '/cart' ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 transition-colors ${
                    isActive 
                      ? 'text-blue-600 border-l-4 border-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            
            <Link
              href="/cart"
              className={`block px-3 py-2 transition-colors ${
                pathname === '/cart'
                  ? 'text-blue-600 border-l-4 border-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Cart ({cartCount})
            </Link>
            
            {isLoggedIn ? (
              <>
                <div className="px-3 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                </div>
                
                <Link
                  href="/profile"
                  className={`block px-3 py-2 transition-colors ${
                    pathname === '/profile'
                      ? 'text-blue-600 border-l-4 border-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  My Profile
                </Link>
                
                {userRole === 'admin' && (
                  <Link
                    href="/dashboard"
                    className={`block px-3 py-2 transition-colors ${
                      pathname === '/dashboard'
                        ? 'text-blue-600 border-l-4 border-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={`block px-3 py-2 text-center rounded-md transition-colors ${
                  pathname === '/login'
                    ? 'bg-blue-700 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}