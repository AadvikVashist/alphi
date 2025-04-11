import React from 'react'
import { motion } from "framer-motion"
import { useScreenSize } from "@/hooks/use-screen-size"
import { PixelTrail } from "@/components/ui/pixel-trail"
import { GooeyFilter } from "@/components/ui/gooey-filter"

interface AnimatedBackgroundProps {
  withPixelTrail?: boolean
  withGradients?: boolean
  withGridPattern?: boolean
  className?: string
}

export function AnimatedBackground({
  withPixelTrail = true,
  withGradients = true,
  withGridPattern = true,
  className = "",
}: AnimatedBackgroundProps) {
  const screenSize = useScreenSize()

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${className}`}>
      {/* Gooey filter for pixel trail */}
      {withPixelTrail && (
        <>
          <GooeyFilter id="gooey-filter-pixel-trail" strength={2} />
          <div
            className="absolute inset-0 z-0 opacity-40"
            style={{ filter: "url(#gooey-filter-pixel-trail)" }}
          >
            <PixelTrail
              pixelSize={screenSize.lessThan(`md`) ? 20 : 24}
              fadeDuration={0}
              delay={500}
              pixelClassName="bg-primary/20"
            />
          </div>
        </>
      )}
      
      {/* Gradient blobs */}
      {withGradients && (
        <>
          {/* Top left gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-foreground/10 blur-[80px]"
          />
          
          {/* Bottom right gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute -bottom-20 -right-20 h-[500px] w-[500px] rounded-full bg-foreground/5 blur-[80px]"
          />
        </>
      )}
      
      {/* Grid pattern overlay */}
      {withGridPattern && (
        <div className="absolute inset-0 bg-grid-pattern-light bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_50%_50%,#000_70%,transparent_100%)]" />
      )}
    </div>
  )
}
