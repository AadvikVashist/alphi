"use client"

import { motion } from "framer-motion"
import { ArrowRight, BarChart2, CheckCircle2, CreditCard, GaugeCircle, GitBranch, Globe, LineChart, Lock, TrendingUp, Wallet, WalletCards, AlertTriangle, Search, Shield, Activity } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">


      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        {/* Animated Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Curved Lines */}
          <svg className="absolute h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="grad2" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0" />
                <stop offset="50%" stopColor="hsl(var(--secondary))" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Top Curves */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                repeatDelay: 1,
              }}
              d="M 100 100 Q 300 0 500 100 T 900 100"
              fill="none"
              stroke="url(#grad1)"
              strokeWidth="1"
            />
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                repeatDelay: 1,
                delay: 0.5,
              }}
              d="M 0 200 Q 200 100 400 200 T 800 200"
              fill="none"
              stroke="url(#grad2)"
              strokeWidth="1"
            />
            {/* Bottom Curves */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                repeatDelay: 1,
                delay: 1,
              }}
              d="M 100 600 Q 300 500 500 600 T 900 600"
              fill="none"
              stroke="url(#grad1)"
              strokeWidth="1"
            />
          </svg>

          {/* Straight Lines */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: "100%", opacity: 0 }}
                animate={{
                  x: "-100%",
                  opacity: [0, 0.7, 0.7, 0],
                }}
                transition={{
                  duration: 2.5,
                  delay: i * 0.2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  ease: "linear",
                }}
                className="absolute right-0"
                style={{
                  top: `${15 + i * 10}%`,
                  height: "1px",
                  width: "100%",
                  background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--secondary))"}60, transparent)`,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Animated Background */}
        <div className="absolute inset-0 z-[1]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute -left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute -right-1/4 top-1/2 h-96 w-96 rounded-full bg-secondary/20 blur-3xl"
          />
        </div>

        {/* Content */}
        <div className="container relative z-[3] px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mx-auto max-w-3xl space-y-8"
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Intelligent</span> Crypto Trading
            </h1>
            <p className="mx-auto max-w-2xl text-foreground/80 sm:text-xl">
              Democratizing market intelligence for retail crypto traders with institutional-grade data and AI-powered analysis
            </p>
            <div className="flex justify-center space-x-4">
              <Button className="bg-primary text-lg text-primary-foreground hover:bg-primary/90 transition-colors">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-border text-lg hover:bg-accent hover:text-accent-foreground transition-colors">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 border-t border-border bg-background py-24">
        <div className="container px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Market Intelligence Suite</h2>
            <p className="mt-4 text-muted-foreground">The comprehensive toolset for smarter crypto trading decisions</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="group rounded-lg border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/50"
            >
              <LineChart className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-xl font-bold">Live Market Data</h3>
              <p className="text-muted-foreground">
                Real-time price feeds, order book visualization, volatility indicators, and arbitrage opportunities across exchanges.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="group rounded-lg border border-border bg-card p-6 shadow-sm transition-colors hover:border-secondary/50"
            >
              <WalletCards className="mb-4 h-12 w-12 text-secondary" />
              <h3 className="mb-2 text-xl font-bold">On-Chain Analytics</h3>
              <p className="text-muted-foreground">
                Track whale wallet movements, token flows between exchanges, treasury holdings, and NFT market trends.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="group rounded-lg border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/50"
            >
              <GaugeCircle className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-xl font-bold">Sentiment Analysis</h3>
              <p className="text-muted-foreground">
                LLM-based news summarization, social media sentiment tracking, and Fear/Greed index measurement.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Alphi Section */}
      <section className="relative z-10 border-t border-border bg-background py-24">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mx-auto mb-16 max-w-3xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Retail Traders Need Alphi</h2>
            <p className="mt-4 text-muted-foreground">
              Retail crypto traders struggle with information asymmetry compared to institutions and experienced traders.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0 }}
              viewport={{ once: true }}
              className="group rounded-lg border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/50"
            >
              <h3 className="mb-4 text-xl font-bold">Overcoming Decision Fatigue</h3>
              <p className="text-muted-foreground">
                The 24/7 nature of crypto markets creates decision fatigue and stress. Alphi provides data-driven insights to help you make informed decisions without the emotional toll.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="group rounded-lg border border-border bg-card p-6 shadow-sm transition-colors hover:border-secondary/50"
            >
              <h3 className="mb-4 text-xl font-bold">Integrated LLM Intelligence</h3>
              <p className="text-muted-foreground">
                While traders validate theses with tools like OpenAI deep research, these are separate from trading platforms. Alphi integrates LLM intelligence directly into your trading workflow.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="group rounded-lg border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/50"
            >
              <h3 className="mb-4 text-xl font-bold">Counter Cognitive Bias</h3>
              <p className="text-muted-foreground">
                Volatility amplifies natural cognitive biases like recency and confirmation bias. Alphi provides systematic frameworks to counterbalance these tendencies.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="group rounded-lg border border-border bg-card p-6 shadow-sm transition-colors hover:border-secondary/50"
            >
              <h3 className="mb-4 text-xl font-bold">Beyond FOMO-Driven Trading</h3>
              <p className="text-muted-foreground">
                Fear of missing out drives emotional rather than analytical decisions, especially during bull markets. Alphi provides data-backed analysis to move beyond narrative-driven trading.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 border-t border-border bg-background py-24">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl rounded-lg border border-border bg-card/80 p-8 text-center shadow-md md:p-12 lg:p-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Trade Smarter?</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join thousands of traders who are leveling the playing field with institutional-grade market intelligence.
            </p>
            <ul className="mx-auto mt-8 flex max-w-xl flex-col gap-4 text-left">
              <li className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Real-time market data across major exchanges</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>AI-powered news analysis and sentiment tracking</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>On-chain analytics and risk assessment tools</span>
              </li>
            </ul>
            <Button className="mt-8">
              Sign Up Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8">
        <div className="container flex flex-col items-center justify-between space-y-4 px-4 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-bold">Alphi</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Alphi. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">
              Privacy
            </Link>
            <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
