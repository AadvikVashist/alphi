"use client"

import * as React from "react"
import { useState, FormEvent, useCallback, useEffect, useRef } from "react"
import { 
  Bot, 
  Paperclip, 
  Mic, 
  CornerDownLeft, 
  X, 
  MessageCircle, 
  ArrowDown, 
  LineChart, 
  Wallet, 
  RefreshCw, 
  Search, 
  TrendingUp,
  DollarSign
} from "lucide-react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// Chat Input Component
interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>{}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, ...props }, ref) => (
    <Textarea
      autoComplete="off"
      ref={ref}
      name="message"
      className={cn(
        "max-h-12 px-4 py-3 bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md flex items-center h-16 resize-none",
        className,
      )}
      {...props}
    />
  ),
);
ChatInput.displayName = "ChatInput";

// Chat Bubble Components
interface ChatBubbleProps {
  variant?: "sent" | "received"
  layout?: "default" | "ai"
  className?: string
  children: React.ReactNode
}

function ChatBubble({
  variant = "received",
  layout = "default",
  className,
  children,
}: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 mb-4",
        variant === "sent" && "flex-row-reverse",
        className,
      )}
    >
      {children}
    </div>
  )
}

interface ChatBubbleMessageProps {
  variant?: "sent" | "received"
  isLoading?: boolean
  className?: string
  children?: React.ReactNode
}

function ChatBubbleMessage({
  variant = "received",
  isLoading,
  className,
  children,
}: ChatBubbleMessageProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-3",
        variant === "sent" ? "bg-primary text-primary-foreground" : "bg-muted",
        className
      )}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <MessageLoading />
        </div>
      ) : (
        children
      )}
    </div>
  )
}

interface ChatBubbleAvatarProps {
  src?: string
  fallback?: string
  className?: string
}

function ChatBubbleAvatar({
  src,
  fallback = "AI",
  className,
}: ChatBubbleAvatarProps) {
  return (
    <Avatar className={cn("h-8 w-8", className)}>
      {src && <AvatarImage src={src} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  )
}

interface ChatBubbleActionProps {
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
}

function ChatBubbleAction({
  icon,
  onClick,
  className,
}: ChatBubbleActionProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-6 w-6", className)}
      onClick={onClick}
    >
      {icon}
    </Button>
  )
}

function ChatBubbleActionWrapper({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex items-center gap-1 mt-2", className)}>
      {children}
    </div>
  )
}

// Message Loading Component
function MessageLoading() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="text-foreground"
    >
      <circle cx="4" cy="12" r="2" fill="currentColor">
        <animate
          id="spinner_qFRN"
          begin="0;spinner_OcgL.end+0.25s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="12;6;12"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
      <circle cx="12" cy="12" r="2" fill="currentColor">
        <animate
          begin="spinner_qFRN.begin+0.1s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="12;6;12"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
      <circle cx="20" cy="12" r="2" fill="currentColor">
        <animate
          id="spinner_OcgL"
          begin="spinner_qFRN.begin+0.2s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="12;6;12"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
    </svg>
  );
}

// Auto Scroll Hook
interface ScrollState {
  isAtBottom: boolean;
  autoScrollEnabled: boolean;
}

interface UseAutoScrollOptions {
  offset?: number;
  smooth?: boolean;
  content?: React.ReactNode;
}

function useAutoScroll(options: UseAutoScrollOptions = {}) {
  const { offset = 20, smooth = false, content } = options;
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastContentHeight = useRef(0);
  const userHasScrolled = useRef(false);

  const [scrollState, setScrollState] = useState<ScrollState>({
    isAtBottom: true,
    autoScrollEnabled: true,
  });

  const checkIsAtBottom = useCallback(
    (element: HTMLElement) => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const distanceToBottom = Math.abs(
        scrollHeight - scrollTop - clientHeight
      );
      return distanceToBottom <= offset;
    },
    [offset]
  );

  const scrollToBottom = useCallback(
    (instant?: boolean) => {
      if (!scrollRef.current) return;

      const targetScrollTop =
        scrollRef.current.scrollHeight - scrollRef.current.clientHeight;

      if (instant) {
        scrollRef.current.scrollTop = targetScrollTop;
      } else {
        scrollRef.current.scrollTo({
          top: targetScrollTop,
          behavior: smooth ? "smooth" : "auto",
        });
      }

      setScrollState({
        isAtBottom: true,
        autoScrollEnabled: true,
      });
      userHasScrolled.current = false;
    },
    [smooth]
  );

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const atBottom = checkIsAtBottom(scrollRef.current);

    setScrollState((prev) => ({
      isAtBottom: atBottom,
      // Re-enable auto-scroll if at the bottom
      autoScrollEnabled: atBottom ? true : prev.autoScrollEnabled,
    }));
  }, [checkIsAtBottom]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    element.addEventListener("scroll", handleScroll, { passive: true });
    return () => element.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const currentHeight = scrollElement.scrollHeight;
    const hasNewContent = currentHeight !== lastContentHeight.current;

    if (hasNewContent) {
      if (scrollState.autoScrollEnabled) {
        requestAnimationFrame(() => {
          scrollToBottom(lastContentHeight.current === 0);
        });
      }
      lastContentHeight.current = currentHeight;
    }
  }, [content, scrollState.autoScrollEnabled, scrollToBottom]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      if (scrollState.autoScrollEnabled) {
        scrollToBottom(true);
      }
    });

    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, [scrollState.autoScrollEnabled, scrollToBottom]);

  const disableAutoScroll = useCallback(() => {
    const atBottom = scrollRef.current
      ? checkIsAtBottom(scrollRef.current)
      : false;

    // Only disable if not at bottom
    if (!atBottom) {
      userHasScrolled.current = true;
      setScrollState((prev) => ({
        ...prev,
        autoScrollEnabled: false,
      }));
    }
  }, [checkIsAtBottom]);

  return {
    scrollRef,
    isAtBottom: scrollState.isAtBottom,
    autoScrollEnabled: scrollState.autoScrollEnabled,
    scrollToBottom: () => scrollToBottom(false),
    disableAutoScroll,
  };
}

// Chat Message List Component
interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  smooth?: boolean;
}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, children, smooth = false, ...props }, _ref) => {
    const {
      scrollRef,
      isAtBottom,
      autoScrollEnabled,
      scrollToBottom,
      disableAutoScroll,
    } = useAutoScroll({
      smooth,
      content: children,
    });

    return (
      <div className="relative w-full h-full">
        <div
          className={`flex flex-col w-full h-full p-4 overflow-y-auto ${className}`}
          ref={scrollRef}
          onWheel={disableAutoScroll}
          onTouchMove={disableAutoScroll}
          {...props}
        >
          <div className="flex flex-col gap-6">{children}</div>
        </div>

        {!isAtBottom && (
          <Button
            onClick={() => {
              scrollToBottom();
            }}
            size="icon"
            variant="outline"
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 inline-flex rounded-full shadow-md"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }
);
ChatMessageList.displayName = "ChatMessageList";

// Tool Card Component
interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

function ToolCard({ title, description, icon, onClick }: ToolCardProps) {
  return (
    <div 
      className="flex items-start p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="mr-4 mt-1 bg-primary/10 p-2 rounded-md">
        {icon}
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// Market Data Component
interface MarketDataProps {
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
}

function MarketData({ symbol, price, change, isPositive }: MarketDataProps) {
  return (
    <div className="flex justify-between items-center p-3 border-b">
      <div className="font-medium">{symbol}</div>
      <div className="flex flex-col items-end">
        <div className="font-medium">${price}</div>
        <div className={cn(
          "text-xs",
          isPositive ? "text-green-500" : "text-red-500"
        )}>
          {isPositive ? "+" : ""}{change}%
        </div>
      </div>
    </div>
  );
}

// Trading Copilot Component
interface ChatMessage {
  id: number;
  content: string;
  sender: "user" | "ai";
  tool?: "market-data" | "portfolio" | "chart-analysis";
  showTools?: boolean;
  isTyping?: boolean;
}

function TradingCopilot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      content: "Hello! I'm your crypto trading assistant. How can I help you today?",
      sender: "ai",
    }
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "market">("chat");
  const [showTools, setShowTools] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        content: input,
        sender: "user",
      },
    ]);
    setInput("");
    setIsLoading(true);
    setShowTools(false);

    // Simulate AI response
    setTimeout(() => {
      if (input.toLowerCase().includes("market") || input.toLowerCase().includes("price")) {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            content: "I'll check the current market data for you. Here's what I found:",
            sender: "ai",
            tool: "market-data"
          },
        ]);
      } else if (input.toLowerCase().includes("portfolio") || input.toLowerCase().includes("balance")) {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            content: "Let me analyze your portfolio performance:",
            sender: "ai",
            tool: "portfolio"
          },
        ]);
      } else if (input.toLowerCase().includes("analyze") || input.toLowerCase().includes("chart")) {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            content: "I'll analyze the chart patterns for you. Based on the technical indicators:",
            sender: "ai",
            tool: "chart-analysis"
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            content: "I can help you with market analysis, portfolio tracking, and trading strategies. Would you like me to show you some tools that might help?",
            sender: "ai",
            showTools: true
          },
        ]);
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleToolSelect = (tool: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (tool === "market-data") {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            content: "Here's the current market data for top cryptocurrencies:",
            sender: "ai",
            tool: "market-data"
          },
        ]);
      } else if (tool === "portfolio") {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            content: "Here's your portfolio performance:",
            sender: "ai",
            tool: "portfolio"
          },
        ]);
      } else if (tool === "chart-analysis") {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            content: "Based on my technical analysis of BTC/USD:",
            sender: "ai",
            tool: "chart-analysis"
          },
        ]);
      }
      setIsLoading(false);
      setShowTools(false);
    }, 1000);
  };

  const renderToolOutput = (tool: string) => {
    switch (tool) {
      case "market-data":
        return (
          <div className="mt-2 border rounded-lg overflow-hidden bg-background">
            <div className="p-3 bg-muted/50 border-b flex justify-between items-center">
              <div className="font-medium">Market Data</div>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
            </div>
            <MarketData symbol="BTC/USD" price="63,245.78" change="2.34" isPositive={true} />
            <MarketData symbol="ETH/USD" price="3,478.92" change="-0.87" isPositive={false} />
            <MarketData symbol="SOL/USD" price="142.56" change="5.21" isPositive={true} />
            <MarketData symbol="DOGE/USD" price="0.1234" change="-1.23" isPositive={false} />
            
            {/* Sentiment Analysis UI Mockup */}
            <div className="p-3 border-t border-b">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">Market Sentiment</span>
                <Button variant="ghost" size="sm" className="h-6 text-xs">View Details</Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <div className="text-xs text-muted-foreground mb-1">BTC Sentiment</div>
                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{width: "78%"}}></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Bearish</span>
                    <span className="font-medium text-green-500">78% Bullish</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-xs text-muted-foreground mb-1">ETH Sentiment</div>
                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{width: "53%"}}></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Bearish</span>
                    <span className="font-medium text-amber-500">53% Neutral</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Mentions Analysis UI */}
            <div className="p-3 border-b">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">Social Activity (24h)</span>
                <div className="flex text-xs">
                  <Button variant="ghost" size="sm" className="h-6 text-xs px-2">Twitter</Button>
                  <Button variant="ghost" size="sm" className="h-6 text-xs px-2 border-b-2 border-primary">Reddit</Button>
                  <Button variant="ghost" size="sm" className="h-6 text-xs px-2">Discord</Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">BTC</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3 text-green-500 mr-1">
                        <path d="m5 12 5 5 10-10"/>
                      </svg>
                      <span className="text-xs">4.5k</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3 text-red-500 mr-1">
                        <path d="M18 6 6 18M6 6l12 12"/>
                      </svg>
                      <span className="text-xs">1.2k</span>
                    </div>
                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden ml-2">
                      <div className="h-full bg-green-500 rounded-full" style={{width: "78%"}}></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">ETH</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3 text-green-500 mr-1">
                        <path d="m5 12 5 5 10-10"/>
                      </svg>
                      <span className="text-xs">2.3k</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3 text-red-500 mr-1">
                        <path d="M18 6 6 18M6 6l12 12"/>
                      </svg>
                      <span className="text-xs">1.8k</span>
                    </div>
                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden ml-2">
                      <div className="h-full bg-amber-500 rounded-full" style={{width: "56%"}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-2 text-center">
              <Button variant="ghost" size="sm" className="text-xs">View more</Button>
            </div>
          </div>
        );
      case "portfolio":
        return (
          <div className="mt-2 border rounded-lg overflow-hidden bg-background">
            <div className="p-3 bg-muted/50 border-b">
              <div className="font-medium">Portfolio Summary</div>
            </div>
            <div className="p-4">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Total Value:</span>
                <span className="font-medium">$12,345.67</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">24h Change:</span>
                <span className="text-green-500">+$234.56 (1.9%)</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-muted-foreground">7d Change:</span>
                <span className="text-red-500">-$123.45 (0.9%)</span>
              </div>
              
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-orange-600 text-xs font-bold">BTC</span>
                    </div>
                    <div>
                      <div className="font-medium">Bitcoin</div>
                      <div className="text-xs text-muted-foreground">0.12 BTC</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>$7,589.49</div>
                    <div className="text-xs text-green-500">+1.2%</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-blue-600 text-xs font-bold">ETH</span>
                    </div>
                    <div>
                      <div className="font-medium">Ethereum</div>
                      <div className="text-xs text-muted-foreground">1.5 ETH</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>$5,218.38</div>
                    <div className="text-xs text-red-500">-0.8%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "chart-analysis":
        return (
          <div className="mt-2 border rounded-lg overflow-hidden bg-background">
            <div className="p-3 bg-muted/50 border-b flex justify-between items-center">
              <div className="font-medium">BTC/USD Technical Analysis</div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs font-medium">1H</Button>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs font-medium">4H</Button>
                <Button variant="default" size="sm" className="h-7 px-2 text-xs font-medium">1D</Button>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs font-medium">1W</Button>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold">$63,245.78</span>
                  <span className="text-green-500 text-sm font-medium">+2.34%</span>
                </div>
                <div className="relative h-40 bg-gradient-to-b from-muted/5 to-muted/0 rounded-md mb-4">
                  {/* Mock chart with gradient and visual elements */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <svg viewBox="0 0 400 100" className="w-full h-full">
                      <path 
                        d="M0,50 C50,30 100,60 150,40 C200,20 250,70 300,50 C350,30 400,40 400,50" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        className="text-green-500"
                      />
                      <path 
                        d="M0,70 C50,65 100,75 150,70 C200,65 250,85 300,70 C350,55 400,65 400,70" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="1"
                        className="text-muted-foreground"
                        strokeDasharray="2,2"
                      />
                    </svg>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
                  
                  {/* Interactive chart controls */}
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                      <span className="sr-only">Zoom in</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                    </Button>
                    <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                      <span className="sr-only">Zoom out</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3">
                        <path d="M5 12h14"/>
                      </svg>
                    </Button>
                  </div>
                  
                  {/* Hover tooltip */}
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-popover border shadow-md rounded-md p-2 text-xs">
                    <div className="font-medium">Nov 12, 2023 09:30</div>
                    <div className="flex justify-between gap-3">
                      <span>Price:</span>
                      <span className="font-medium">$62,345.78</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span>Volume:</span>
                      <span className="font-medium">$1.2B</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                  <span className="size-2 bg-green-500 rounded-full"></span>
                  RSI
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                  <span className="size-2 bg-blue-500 rounded-full"></span>
                  MACD
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                  <span className="size-2 bg-amber-500 rounded-full"></span>
                  Bollinger
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  + Add Indicator
                </Button>
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">RSI (14):</span> 58.3 - Neutral
                </div>
                <div>
                  <span className="font-medium">MACD:</span> Bullish crossover forming
                </div>
                <div>
                  <span className="font-medium">Support levels:</span> $61,200, $59,800
                </div>
                <div>
                  <span className="font-medium">Resistance levels:</span> $64,500, $66,000
                </div>
                <div className="pt-2">
                  <span className="font-medium text-green-500">Recommendation:</span> Consider buying on dips to $61,200 support level with stop loss at $59,500.
                </div>
                
                <div className="pt-3 flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                        <path d="M9 17H5a2 2 0 0 0-2 2 2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm12-2h-4a2 2 0 0 0-2 2 2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm-18-3h4a2 2 0 0 0 2-2 2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2zm12-2h4a2 2 0 0 0 2-2 2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2z"/>
                      </svg>
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      Add Note
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Ctrl+S</span> to save chart
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-[700px] relative border rounded-lg shadow-sm overflow-hidden bg-background">
      <div className="flex flex-col h-full">
        <div className="border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-md mr-3">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Trading Copilot</h2>
                <p className="text-xs text-muted-foreground">Your AI crypto trading assistant</p>
              </div>
            </div>
            <div className="flex">
              <Button 
                variant={activeTab === "chat" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setActiveTab("chat")}
                className="rounded-r-none"
              >
                Chat
              </Button>
              <Button 
                variant={activeTab === "market" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setActiveTab("market")}
                className="rounded-l-none"
              >
                Market
              </Button>
            </div>
          </div>
        </div>

        {activeTab === "chat" ? (
          <>
            <div className="flex-1 overflow-hidden">
              <ChatMessageList>
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    variant={message.sender === "user" ? "sent" : "received"}
                  >
                    <ChatBubbleAvatar
                      className="h-8 w-8 shrink-0"
                      src={
                        message.sender === "user"
                          ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop"
                          : undefined
                      }
                      fallback={message.sender === "user" ? "US" : "AI"}
                    />
                    <div className="flex flex-col">
                      <ChatBubbleMessage
                        variant={message.sender === "user" ? "sent" : "received"}
                      >
                        {message.content}
                      </ChatBubbleMessage>
                      
                      {message.tool && renderToolOutput(message.tool)}
                      
                      {message.showTools && (
                        <div className="mt-2 grid grid-cols-1 gap-2">
                          <ToolCard 
                            title="Market Data" 
                            description="Get real-time prices and market trends"
                            icon={<TrendingUp className="h-4 w-4 text-primary" />}
                            onClick={() => handleToolSelect("market-data")}
                          />
                          <ToolCard 
                            title="Portfolio Analysis" 
                            description="Check your holdings and performance"
                            icon={<Wallet className="h-4 w-4 text-primary" />}
                            onClick={() => handleToolSelect("portfolio")}
                          />
                          <ToolCard 
                            title="Technical Analysis" 
                            description="Get chart patterns and trading signals"
                            icon={<LineChart className="h-4 w-4 text-primary" />}
                            onClick={() => handleToolSelect("chart-analysis")}
                          />
                        </div>
                      )}
                    </div>
                  </ChatBubble>
                ))}

                {isLoading && (
                  <ChatBubble variant="received">
                    <ChatBubbleAvatar
                      className="h-8 w-8 shrink-0"
                      fallback="AI"
                    />
                    <ChatBubbleMessage isLoading />
                  </ChatBubble>
                )}

                {!isLoading && messages.find(m => m.isTyping) && (
                  <ChatBubble variant="received">
                    <ChatBubbleAvatar
                      className="h-8 w-8 shrink-0"
                      fallback="AI"
                    />
                    <div className="flex items-center space-x-2 rounded-lg p-3 bg-muted">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse" 
                             style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse" 
                             style={{ animationDelay: "300ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse" 
                             style={{ animationDelay: "600ms" }}></div>
                      </div>
                    </div>
                  </ChatBubble>
                )}
              </ChatMessageList>
            </div>

            <div className="p-4 border-t">
              <form
                onSubmit={handleSubmit}
                className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
              >
                <ChatInput
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about market trends, portfolio analysis, or trading strategies..."
                  className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
                />
                <div className="flex items-center p-3 pt-0 justify-between">
                  <div className="flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => setShowTools(!showTools)}
                      className="relative"
                    >
                      <Search className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                    >
                      <Mic className="size-4" />
                    </Button>
                  </div>
                  <Button type="submit" size="sm" className="ml-auto gap-1.5">
                    Send
                    <CornerDownLeft className="size-3.5" />
                  </Button>
                </div>
              </form>
              
              {showTools && (
                <div className="mt-2 grid grid-cols-1 gap-2 border rounded-lg p-2 bg-background">
                  <ToolCard 
                    title="Market Data" 
                    description="Get real-time prices and market trends"
                    icon={<TrendingUp className="h-4 w-4 text-primary" />}
                    onClick={() => handleToolSelect("market-data")}
                  />
                  <ToolCard 
                    title="Portfolio Analysis" 
                    description="Check your holdings and performance"
                    icon={<Wallet className="h-4 w-4 text-primary" />}
                    onClick={() => handleToolSelect("portfolio")}
                  />
                  <ToolCard 
                    title="Technical Analysis" 
                    description="Get chart patterns and trading signals"
                    icon={<LineChart className="h-4 w-4 text-primary" />}
                    onClick={() => handleToolSelect("chart-analysis")}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-auto p-4">
            <div className="mb-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search for a cryptocurrency..." 
                  className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden mb-6">
              <div className="p-3 bg-muted/50 border-b flex justify-between items-center">
                <div className="font-medium">Top Cryptocurrencies</div>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Refresh
                </Button>
              </div>
              <MarketData symbol="BTC/USD" price="63,245.78" change="2.34" isPositive={true} />
              <MarketData symbol="ETH/USD" price="3,478.92" change="-0.87" isPositive={false} />
              <MarketData symbol="SOL/USD" price="142.56" change="5.21" isPositive={true} />
              <MarketData symbol="DOGE/USD" price="0.1234" change="-1.23" isPositive={false} />
              <MarketData symbol="ADA/USD" price="0.4567" change="0.45" isPositive={true} />
              <MarketData symbol="XRP/USD" price="0.5678" change="-2.34" isPositive={false} />
              <MarketData symbol="DOT/USD" price="6.789" change="1.23" isPositive={true} />
              <MarketData symbol="AVAX/USD" price="34.56" change="3.45" isPositive={true} />
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="p-3 bg-muted/50 border-b">
                <div className="font-medium">Your Watchlist</div>
              </div>
              <MarketData symbol="BTC/USD" price="63,245.78" change="2.34" isPositive={true} />
              <MarketData symbol="ETH/USD" price="3,478.92" change="-0.87" isPositive={false} />
              <MarketData symbol="SOL/USD" price="142.56" change="5.21" isPositive={true} />
              <div className="p-3 text-center border-t">
                <Button variant="outline" size="sm" className="w-full gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" />
                  Add to watchlist
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TradingCopilot; 