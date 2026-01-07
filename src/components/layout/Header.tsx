import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/items", label: "Items" },
  { href: "/rentals", label: "Rentals" },
  { href: "/payment", label: "Payment" },
  { href: "/contact", label: "Contact" },
];

const WHATSAPP_NUMBER = "1234567890"; // Replace with actual number

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello! I'm interested in your products."
  )}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">Retail</span>
          <span className="text-xl font-semibold text-foreground">Store</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === link.href
                  ? "text-primary"
                  : "text-foreground-secondary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* WhatsApp CTA */}
        <div className="hidden md:block">
          <Button asChild variant="whatsapp" size="sm">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />
              Order Now
            </a>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container flex flex-col gap-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-foreground-secondary"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild variant="whatsapp" size="sm" className="w-full">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                Order Now
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
