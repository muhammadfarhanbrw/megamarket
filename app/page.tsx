// import React from "react";

// import Product from "./(components)/product/page";
// import About from "./(components)/about/page";
// import Services from "./(components)/services/page";
// import Slider from "./(components)/slider/page";
// import Reviews from './(components)/Reviews'



// const page = () => {
//   return (
//     <div>
//       <Slider />
     
//       <Product />
//       <Services />
//       <About />
//       <Reviews />
     
//     </div>
//   );
// };

// export default page;

"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Product from "./(components)/product/page";
import About from "./(components)/about/page";
import Services from "./(components)/services/page";
import Slider from "./(components)/slider/page";
import Reviews from './(components)/Reviews';

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Check regular login from localStorage
    const userData = localStorage.getItem('user');
    
    console.log("Status:", status);
    console.log("Session:", session);
    console.log("UserData:", userData);
    
    // Wait for session to load
    if (status === "loading") {
      return;
    }
    
    // If authenticated via session or localStorage
    if (session || userData) {
      setShouldRedirect(false);
      return;
    }
    
    // Not authenticated, redirect to login
    setShouldRedirect(true);
  }, [session, status]);

  // Handle redirect separately
  useEffect(() => {
    if (shouldRedirect) {
      router.push("/login");
    }
  }, [shouldRedirect, router]);

  // Show loading while checking
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // If authenticated, show content
  if (session || localStorage.getItem('user')) {
    return (
      <div>
        <Slider />
        <Product />
        <Services />
        <About />
        <Reviews />
      </div>
    );
  }

  // Return null while redirecting
  return null;
};

export default Page;