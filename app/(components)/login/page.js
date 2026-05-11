
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import axios from "axios";
// import { signIn, useSession } from "next-auth/react";

// const Page = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();
//   const { data: session } = useSession();

//   // Check if user is already logged in (both regular and Google login)
//   useEffect(() => {
//     // Check Google session first
//     if (session) {
//       console.log("Google session detected:", session);
//       const userRole = session.user?.role || 'user';
//       if (userRole === 'admin') {
//         router.push('/dashboard');
//       } else if (userRole === 'seller') {
//         router.push('/components/seller');
//       } else {
//         router.push('/');
//       }
//       return;
//     }

//     // Check regular login from localStorage
//     const userData = localStorage.getItem('user');
//     console.log("Stored user data:", userData);
    
//     if (userData) {
//       try {
//         const user = JSON.parse(userData);
//         if (user.isLoggedIn) {
//           if (user.role === 'admin') {
//             router.push('/dashboard');
//           } else if (user.role === 'seller') {
//             router.push('/components/seller');
//           } else {
//             router.push('/');
//           }
//         }
//       } catch (err) {
//         console.error("Error parsing user data:", err);
//       }
//     }
//   }, [router, session]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     if (!email || !password) {
//       setError("Please fill in all fields");
//       setLoading(false);
//       return;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters");
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log("Sending login request for:", email);
      
//       const response = await axios.post('/api/login', {
//         email,
//         password,
//       });
      
//       console.log("Login response:", response.data);
      
//       if (response.status === 200 && response.data.success) {
//         const userRole = response.data.user.role;
//         const redirectPath = response.data.redirectTo;
        
//         localStorage.setItem('user', JSON.stringify({
//           email: email,
//           isLoggedIn: true,
//           role: userRole,
//           userData: response.data.user
//         }));
        
//         window.dispatchEvent(new Event('authChange'));
        
//         setSuccess(`Login successful! Redirecting to ${userRole} portal...`);
        
//         setTimeout(() => {
//           console.log("Redirecting to:", redirectPath);
//           router.push(redirectPath);
//         }, 1500);
//       } else {
//         setError(response.data.message || "Login failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Login error details:", error);
      
//       if (error.response) {
//         console.error("Error response:", error.response.data);
//         setError(error.response.data.message || "Login failed. Please try again.");
//       } else if (error.request) {
//         console.error("No response received");
//         setError("Cannot connect to server. Please check if the server is running.");
//       } else {
//         console.error("Error:", error.message);
//         setError("An unexpected error occurred. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

// const handleGoogleLogin = () => {
//   setLoading(true);
//   signIn("google", { 
//     callbackUrl: "/",
//     redirect: true,
//     prompt: "select_account"  // This forces Google to ask which account
//   });
// };
//   return (
//     <div className="min-h-screen bg-black flex items-center justify-center p-4">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-black to-gray-900">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.1),transparent_50%)]"></div>
//       </div>

//       {/* Main Card */}
//       <div className="relative w-full max-w-md">
//         <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800 p-8 md:p-10">
//           {/* Logo/Brand */}
//           <div className="flex justify-center mb-8">
//             <div className="flex items-center space-x-3">
//               <div className="w-12 h-12 bg-linear-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center border border-gray-700 shadow-lg">
//                 <span className="text-white font-bold text-xl">B</span>
//               </div>
//               <span className="text-2xl font-bold bg-linear-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
//                 Brand
//               </span>
//             </div>
//           </div>

//           {/* Header */}
//           <div className="text-center mb-10">
//             <h1 className="text-3xl font-bold text-white mb-2">
//               Welcome Back
//             </h1>
//             <p className="text-gray-400">
//               Sign in to your account to continue
//             </p>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="mb-6 p-4 bg-red-900/20 border border-red-800/50 rounded-lg backdrop-blur-sm">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//                 <span className="text-red-300 font-medium">{error}</span>
//               </div>
//             </div>
//           )}

//           {/* Success Message */}
//           {success && (
//             <div className="mb-6 p-4 bg-green-900/20 border border-green-800/50 rounded-lg backdrop-blur-sm">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//                 <span className="text-green-300 font-medium">{success}</span>
//               </div>
//             </div>
//           )}

//           {/* Login Form */}
//           <form className="space-y-6" onSubmit={handleLogin}>
//             {/* Email Field */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="block w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-200"
//                   placeholder="you@example.com"
//                 />
//               </div>
//             </div>

//             {/* Password Field */}
//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-300">
//                   Password
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
//                 >
//                   {showPassword ? "Hide" : "Show"}
//                 </button>
//               </div>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   autoComplete="current-password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="block w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-200"
//                   placeholder="••••••••"
//                   minLength="6"
//                 />
//               </div>
//             </div>

//             {/* Remember Me & Forgot Password */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 bg-gray-800 border-gray-700 rounded focus:ring-gray-600 text-gray-600"
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
//                   Remember me
//                 </label>
//               </div>
//               <Link
//                 href="/forgot-password"
//                 className="text-sm font-medium text-gray-400 hover:text-gray-300 transition-colors"
//               >
//                 Forgot password?
//               </Link>
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3.5 px-4 bg-linear-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Signing in...
//                 </>
//               ) : (
//                 <>
//                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
//                   </svg>
//                   Sign In
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Divider */}
//           <div className="my-8">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-800"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-4 bg-gray-900 text-gray-500">Or continue with</span>
//               </div>
//             </div>
//           </div>

//           {/* Social Login - Google Button with functionality */}
//           <div className="grid gap-3">
//             <button 
//               onClick={handleGoogleLogin}
//               disabled={loading}
//               className="flex items-center justify-center py-3 px-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-gray-300 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                 <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                 <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                 <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                 <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//               </svg>
//               Google
//             </button>
//           </div>

//           {/* Sign Up Link */}
//           <div className="mt-8 text-center">
//             <p className="text-gray-400">
//               Don't have an account?{" "}
//               <Link
//                 href="/register"
//                 className="font-medium text-gray-300 hover:text-white transition-colors"
//               >
//                 Sign up
//               </Link>
//             </p>
//           </div>
//         </div>

//         {/* Back to Home */}
//         <div className="mt-8 text-center">
//           <Link
//             href="/"
//             className="inline-flex items-center text-gray-500 hover:text-gray-300 transition-colors group"
//           >
//             <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             Back to home
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;


// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import axios from "axios";
// import { signIn, useSession } from "next-auth/react";

// const Page = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();
//   const { data: session } = useSession();

//   // Check if user is already logged in (both regular and Google login)
//   useEffect(() => {
//     // Check Google session first
//     if (session) {
//       console.log("Google session detected:", session);
//       const userRole = session.user?.role || 'user';
//       if (userRole === 'admin') {
//         router.push('/dashboard');
//       } else if (userRole === 'seller') {
//         router.push('/components/seller');
//       } else {
//         router.push('/');
//       }
//       return;
//     }

//     // Check regular login from localStorage
//     const userData = localStorage.getItem('user');
//     console.log("Stored user data:", userData);
    
//     if (userData) {
//       try {
//         const user = JSON.parse(userData);
//         if (user.isLoggedIn) {
//           if (user.role === 'admin') {
//             router.push('/dashboard');
//           } else if (user.role === 'seller') {
//             router.push('/components/seller');
//           } else {
//             router.push('/');
//           }
//         }
//       } catch (err) {
//         console.error("Error parsing user data:", err);
//       }
//     }
//   }, [router, session]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     // Validation
//     if (!email || !password) {
//       setError("Please fill in all fields");
//       setLoading(false);
//       return;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters");
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log("Sending login request for:", email);
      
//       const response = await axios.post('/api/login', {
//         email,
//         password,
//       });
      
//       console.log("Login response:", response.data);
      
//       // Check for successful login
//       if (response.status === 200 && response.data.success) {
//         const userRole = response.data.user.role;
//         const redirectPath = response.data.redirectTo;
        
//         // Store user data in localStorage
//         localStorage.setItem('user', JSON.stringify({
//           email: email,
//           isLoggedIn: true,
//           role: userRole,
//           userData: response.data.user
//         }));
        
//         // Dispatch event for other components
//         window.dispatchEvent(new Event('authChange'));
        
//         setSuccess(`Login successful! Redirecting to ${userRole} portal...`);
        
//         // Redirect after delay
//         setTimeout(() => {
//           console.log("Redirecting to:", redirectPath);
//           router.push(redirectPath);
//         }, 1500);
//       }
//     } catch (error) {
//       // SUPPRESS console error for expected 401 responses
//       // This prevents the red AxiosError from showing in browser console
//       if (error.response?.status === 401) {
//         // Expected authentication error - don't log to console
//         // Just update the UI with the error message
//         const errorMessage = error.response?.data?.message || "Invalid email or password";
//         setError(errorMessage);
//       } else if (error.response?.status === 400) {
//         // Bad request - show validation error
//         setError(error.response?.data?.message || "Please check your input");
//       } else if (error.response?.status === 500) {
//         // Server error - log this one as it's unexpected
//         console.error("Server error:", error.response?.data);
//         setError("Server error. Please try again later.");
//       } else if (error.request) {
//         // Network error - no response received
//         console.error("Network error:", error.request);
//         setError("Cannot connect to server. Please check your internet connection.");
//       } else {
//         // Other unexpected errors
//         console.error("Unexpected error:", error.message);
//         setError("An unexpected error occurred. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = () => {
//     setLoading(true);
//     signIn("google", { 
//       callbackUrl: "/",
//       redirect: true,
//       prompt: "select_account"
//     });
//   };

//   return (
//     <div className="min-h-screen bg-black flex items-center justify-center p-4">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-black to-gray-900">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.1),transparent_50%)]"></div>
//       </div>

//       {/* Main Card */}
//       <div className="relative w-full max-w-md">
//         <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800 p-8 md:p-10">
//           {/* Logo/Brand */}
//           <div className="flex justify-center mb-8">
//             <div className="flex items-center space-x-3">
//               <div className="w-12 h-12 bg-linear-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center border border-gray-700 shadow-lg">
//                 <span className="text-white font-bold text-xl">B</span>
//               </div>
//               <span className="text-2xl font-bold bg-linear-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
//                 Brand
//               </span>
//             </div>
//           </div>

//           {/* Header */}
//           <div className="text-center mb-10">
//             <h1 className="text-3xl font-bold text-white mb-2">
//               Welcome Back
//             </h1>
//             <p className="text-gray-400">
//               Sign in to your account to continue
//             </p>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="mb-6 p-4 bg-red-900/20 border border-red-800/50 rounded-lg backdrop-blur-sm">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//                 <span className="text-red-300 font-medium">{error}</span>
//               </div>
//             </div>
//           )}

//           {/* Success Message */}
//           {success && (
//             <div className="mb-6 p-4 bg-green-900/20 border border-green-800/50 rounded-lg backdrop-blur-sm">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//                 <span className="text-green-300 font-medium">{success}</span>
//               </div>
//             </div>
//           )}

//           {/* Login Form */}
//           <form className="space-y-6" onSubmit={handleLogin}>
//             {/* Email Field */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="block w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-200"
//                   placeholder="you@example.com"
//                 />
//               </div>
//             </div>

//             {/* Password Field */}
//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-300">
//                   Password
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
//                 >
//                   {showPassword ? "Hide" : "Show"}
//                 </button>
//               </div>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   autoComplete="current-password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="block w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-200"
//                   placeholder="••••••••"
//                   minLength="6"
//                 />
//               </div>
//             </div>

//             {/* Remember Me & Forgot Password */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 bg-gray-800 border-gray-700 rounded focus:ring-gray-600 text-gray-600"
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
//                   Remember me
//                 </label>
//               </div>
//               <Link
//                 href="/forgot-password"
//                 className="text-sm font-medium text-gray-400 hover:text-gray-300 transition-colors"
//               >
//                 Forgot password?
//               </Link>
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3.5 px-4 bg-linear-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Signing in...
//                 </>
//               ) : (
//                 <>
//                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
//                   </svg>
//                   Sign In
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Divider */}
//           <div className="my-8">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-800"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-4 bg-gray-900 text-gray-500">Or continue with</span>
//               </div>
//             </div>
//           </div>

//           {/* Social Login - Google Button */}
//           <div className="grid gap-3">
//             <button 
//               onClick={handleGoogleLogin}
//               disabled={loading}
//               className="flex items-center justify-center py-3 px-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-gray-300 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                 <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                 <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                 <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                 <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//               </svg>
//               Google
//             </button>
//           </div>

//           {/* Sign Up Link */}
//           <div className="mt-8 text-center">
//             <p className="text-gray-400">
//               Don't have an account?{" "}
//               <Link
//                 href="/register"
//                 className="font-medium text-gray-300 hover:text-white transition-colors"
//               >
//                 Sign up
//               </Link>
//             </p>
//           </div>
//         </div>

//         {/* Back to Home */}
//         <div className="mt-8 text-center">
//           <Link
//             href="/"
//             className="inline-flex items-center text-gray-500 hover:text-gray-300 transition-colors group"
//           >
//             <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             Back to home
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // IMPORTANT: Store Google user data in localStorage when session is available
  useEffect(() => {
    if (session && session.user) {
      console.log("Google session detected:", session);
      console.log("User role from Google session:", session.user.role);
      
      // Store Google user data in localStorage (same format as regular login)
      localStorage.setItem('user', JSON.stringify({
        email: session.user.email,
        isLoggedIn: true,
        role: session.user.role || 'user',
        userData: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: session.user.role || 'user'
        }
      }));
      
      // Dispatch event for other components
      window.dispatchEvent(new Event('authChange'));
      
      // Redirect based on role
      const userRole = session.user.role || 'user';
      if (userRole === 'admin') {
        router.push('/dashboard');
      } else if (userRole === 'seller') {
        router.push('/seller');
      } else {
        router.push('/');
      }
    }
  }, [session, router]);

  // Check regular login from localStorage (non-Google users)
  useEffect(() => {
    // Only check if no Google session
    if (!session) {
      const userData = localStorage.getItem('user');
      console.log("Stored user data from localStorage:", userData);
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.isLoggedIn) {
            if (user.role === 'admin') {
              router.push('/dashboard');
            } else if (user.role === 'seller') {
              router.push('/seller');
            } else {
              router.push('/');
            }
          }
        } catch (err) {
          console.error("Error parsing user data:", err);
        }
      }
    }
  }, [router, session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending login request for:", email);
      
      const response = await axios.post('/api/login', {
        email,
        password,
      });
      
      console.log("Login response:", response.data);
      
      if (response.status === 200 && response.data.success) {
        const userRole = response.data.user.role;
        let redirectPath = '/';
        
        if (userRole === 'admin') {
          redirectPath = '/dashboard';
        } else if (userRole === 'seller') {
          redirectPath = '/seller';
        } else {
          redirectPath = '/';
        }
        
        localStorage.setItem('user', JSON.stringify({
          email: email,
          isLoggedIn: true,
          role: userRole,
          userData: response.data.user
        }));
        
        window.dispatchEvent(new Event('authChange'));
        setSuccess(`Login successful! Redirecting to ${userRole} portal...`);
        
        setTimeout(() => {
          console.log("Redirecting to:", redirectPath);
          router.push(redirectPath);
        }, 1500);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        const errorMessage = error.response?.data?.message || "Invalid email or password";
        setError(errorMessage);
      } else if (error.response?.status === 400) {
        setError(error.response?.data?.message || "Please check your input");
      } else if (error.response?.status === 500) {
        console.error("Server error:", error.response?.data);
        setError("Server error. Please try again later.");
      } else if (error.request) {
        console.error("Network error:", error.request);
        setError("Cannot connect to server. Please check your internet connection.");
      } else {
        console.error("Unexpected error:", error.message);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    signIn("google", { 
      callbackUrl: "/login", // Redirect back to login page, then useEffect will handle redirect
      redirect: false,
      prompt: "select_account"
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md">
        <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800 p-8 md:p-10">
          {/* Logo/Brand */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-linear-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center border border-gray-700 shadow-lg">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                Brand
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400">
              Sign in to your account to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800/50 rounded-lg backdrop-blur-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-300 font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-800/50 rounded-lg backdrop-blur-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-300 font-medium">{success}</span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  minLength="6"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-gray-800 border-gray-700 rounded focus:ring-gray-600 text-gray-600"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-gray-400 hover:text-gray-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-linear-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900 text-gray-500">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Social Login - Google Button */}
          <div className="grid gap-3">
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex items-center justify-center py-3 px-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-gray-300 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-gray-500 hover:text-gray-300 transition-colors group"
          >
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;