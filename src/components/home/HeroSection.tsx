import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, CalendarDays, ArrowRight } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/85">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-whatsapp/20 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-white/5 blur-3xl" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container relative z-10 flex min-h-[85vh] items-center py-20">
        <div className="mx-auto max-w-3xl text-center">
          {/* Tagline */}
          <span className="mb-6 inline-block rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm animate-fade-in border border-white/20">
            ✨ Quality Products & Rentals
          </span>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Shop Smart,{" "}
            <span className="relative inline-block">
              Save More
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path 
                  d="M2 8C50 3 150 3 198 8" 
                  stroke="hsl(var(--whatsapp))" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  className="animate-slide-in-left"
                  style={{ animationDelay: "0.5s" }}
                />
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mb-10 text-lg text-white/80 md:text-xl leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Browse our collection of premium products and rental items. 
            <br className="hidden sm:block" />
            Order directly via WhatsApp for the fastest service.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Button asChild variant="hero" size="lg" className="group btn-press min-w-[180px]">
              <Link to="/items">
                <ShoppingBag className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
                View Items
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="heroOutline" size="lg" className="group btn-press min-w-[180px]">
              <Link to="/rentals">
                <CalendarDays className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
                Rent Items
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-whatsapp" />
              Fast WhatsApp Ordering
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-whatsapp" />
              Same Day Delivery
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-whatsapp" />
              Best Prices
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-gentle">
        <div className="flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs font-medium tracking-wider">SCROLL</span>
          <div className="h-8 w-5 rounded-full border-2 border-white/30 p-1">
            <div className="h-2 w-1.5 rounded-full bg-white/50 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};
