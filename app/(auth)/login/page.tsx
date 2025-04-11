"use client";

import AuthForm from "@/components/auth/AuthForm";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-background to-background/95">
      {/* Animated background */}
      <AnimatedBackground />

      {/* Left side branding column (desktop only) */}
      <div className="fixed left-0 top-0 hidden h-full w-1/3 flex-col justify-between bg-card/70 border-r border-border p-10 backdrop-blur-sm md:flex lg:w-1/4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-3"
          onClick={() => router.push("/")}
        >
          <Image src="/logo.png" alt="Alphi Copilot Logo" width={24} height={24} className="hidden dark:block" />
          <Image src="/logo-dark.png" alt="Alphi Copilot Logo" width={24} height={24} className="block dark:hidden" />
          <h1 className="font-semibold tracking-tight text-primary">Alphi</h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold">Crypto Market Intelligence</h2>
          <p className="text-muted-foreground">Democratizing market intelligence for retail crypto traders with institutional-grade data and AI-powered analysis.</p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary/70" />
              <p className="text-sm text-muted-foreground">Real-time market data across exchanges</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary/70" />
              <p className="text-sm text-muted-foreground">AI-powered sentiment analysis</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary/70" />
              <p className="text-sm text-muted-foreground">On-chain analytics and risk assessment</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xs text-muted-foreground"
        >
          © {new Date().getFullYear()} Alphi. All rights reserved.
        </motion.div>
      </div>

      {/* Right side auth form */}
      <div className="flex min-h-screen w-full flex-col items-center justify-center md:pl-[33%] lg:pl-[25%]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm px-8"
        >
          {/* Mobile logo (only visible on mobile) */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-center justify-center md:hidden"
          >
            <Image src="/logo.png" alt="Alphi Copilot Logo" width={32} height={32} className="mr-2" />
            <h1 className="text-xl font-semibold tracking-tight text-primary">Alphi</h1>
          </motion.div>
          
          <AuthForm />
        </motion.div>
      </div>
    </div>
  );
} 