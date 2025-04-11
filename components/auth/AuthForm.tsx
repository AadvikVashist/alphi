"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { IconBrandGoogle } from "@tabler/icons-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
interface AuthFormProps {
  className?: string;
}

export function AuthForm({ className }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const supabase = createClient();
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'email profile https://www.googleapis.com/auth/gmail.readonly',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
        
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn("border-border/40 shadow-lg relative bg-card/70 backdrop-blur-sm overflow-hidden", className)}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <CardHeader className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your UGC creator management platform
        </p>
      </CardHeader>

      <CardContent className="space-y-6 px-8">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <Button
            variant="outline"
            size="lg"
            className="flex w-full items-center justify-center gap-3 py-6 shadow-sm transition-all hover:bg-secondary/60 group"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <IconBrandGoogle className="size-4" />
            )}
            <span>Continue with Google</span>
          </Button>
          
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-md p-[1px] -z-10 transition-all group-hover:opacity-100 opacity-0 blur-sm bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20" />
        </motion.div>

        {error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-center text-sm text-destructive"
          >
            {error}
          </motion.p>
        )}
      </CardContent>

      <CardFooter className="pb-8 px-8">
        <p className="text-center text-xs text-muted-foreground w-full">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="font-medium text-primary/90 hover:text-primary transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="font-medium text-primary/90 hover:text-primary transition-colors">
            Privacy Policy
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default AuthForm; 