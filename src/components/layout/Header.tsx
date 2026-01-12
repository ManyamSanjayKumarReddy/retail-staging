import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/items", label: "Items" },
  { href: "/rentals", label: "Rentals" },
  { href: "/payment", label: "Payment" },
  { href: "/contact", label: "Contact" },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappUrl = `https://wa.me/${settings?.whatsapp_number || ''}?text=${encodeURIComponent(
    settings?.whatsapp_message || "Hello! I'm interested in your products."
  )}`;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-lg shadow-sm border-b border-border/50"
          : "bg-background border-b border-border"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="group flex items-center gap-1 transition-transform duration-300 hover:scale-105"
        >
          <span className="text-xl font-bold text-primary transition-colors">
            {settings?.site_name?.split(' ')[0] || 'Retail'}
          </span>
          <span className="text-xl font-semibold text-foreground">
            {settings?.site_name?.split(' ').slice(1).join(' ') || 'Store'}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "relative text-sm font-medium transition-colors duration-300 hover:text-primary",
                location.pathname === link.href
                  ? "text-primary"
                  : "text-foreground-secondary",
                "link-underline"
              )}
            >
              {link.label}
              {location.pathname === link.href && (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* WhatsApp CTA */}
        <div className="hidden md:block">
          <Button 
            asChild 
            variant="whatsapp" 
            size="sm" 
            className="btn-press group"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <WhatsAppIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <span>Order Now</span>
            </a>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="relative md:hidden p-2 rounded-lg transition-colors hover:bg-muted"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={cn(
            "block transition-all duration-300",
            isMenuOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
          )}>
            <Menu className="h-6 w-6 text-foreground" />
          </span>
          <span className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-300",
            isMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
          )}>
            <X className="h-6 w-6 text-foreground" />
          </span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out md:hidden",
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="container flex flex-col gap-1 py-4">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                location.pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-foreground-secondary hover:bg-muted hover:text-foreground"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <div className="px-4 pt-2">
            <Button asChild variant="whatsapp" size="sm" className="w-full btn-press">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                <WhatsAppIcon className="h-4 w-4" />
                <span>Order Now</span>
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};
