
import React from "react";
import { Button } from "@mui/material";
import { Home, ArrowLeft, Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#030712] text-white px-6 overflow-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse [animation-delay:2s]"></div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Icon / Illustration Area */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
            <Ghost size={80} className="text-blue-500 animate-[bounce_3s_ease-in-out_infinite]" />
          </div>
        </div>

        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            404
          </h1>
          
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
            Page Not Found
          </h2>
          
          <p className="max-w-md mx-auto text-gray-400 text-base md:text-lg leading-relaxed">
            The page you're looking for vanished into the void. It might have been moved, deleted, or never existed in the first place.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              startIcon={<Home size={18} />}
              sx={{
                bgcolor: '#3b82f6',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
                '&:hover': {
                  bgcolor: '#2563eb',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Back to Home
            </Button>
          </a>          
        </div>

        {/* Footer Hint */}
        <div className="mt-16 pt-8 ">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
            Error Code: ERR_PAGE_NOT_FOUND
          </p>
        </div>
      </div>
    </div>
  );
}