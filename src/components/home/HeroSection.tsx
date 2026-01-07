import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, CalendarDays } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container relative z-10 flex min-h-[80vh] items-center py-20">
        <div className="mx-auto max-w-3xl text-center">
          {/* Tagline */}
          <span className="mb-4 inline-block rounded-full bg-primary-foreground/20 px-4 py-2 text-sm font-medium uppercase tracking-widest text-primary-foreground">
            Quality Products & Rentals
          </span>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
            Shop Smart,{" "}
            <span className="relative">
              Save More
              <span className="absolute -bottom-1 left-0 h-1 w-full bg-whatsapp"></span>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mb-8 text-lg text-primary-foreground/80 md:text-xl">
            Browse our collection of premium products and rental items. Order
            directly via WhatsApp for the fastest service.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild variant="hero" size="lg">
              <Link to="/items">
                <ShoppingBag className="mr-2 h-5 w-5" />
                View Items
              </Link>
            </Button>
            <Button asChild variant="heroOutline" size="lg">
              <Link to="/rentals">
                <CalendarDays className="mr-2 h-5 w-5" />
                Rent Items
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-whatsapp/20 blur-3xl" />
      <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-primary-foreground/10 blur-3xl" />
    </section>
  );
};
