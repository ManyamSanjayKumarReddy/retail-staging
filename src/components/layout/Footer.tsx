import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

const WHATSAPP_NUMBER = "1234567890";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background-soft">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="animate-fade-in">
            <Link to="/" className="inline-flex items-center gap-1 group">
              <span className="text-xl font-bold text-primary transition-colors">Retail</span>
              <span className="text-xl font-semibold text-foreground">Store</span>
            </Link>
            <p className="mt-4 text-foreground-secondary leading-relaxed">
              Quality products and rental services. Order directly via WhatsApp
              for the fastest service.
            </p>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-3">
              {[
                { to: "/", label: "Home" },
                { to: "/items", label: "Items" },
                { to: "/rentals", label: "Rentals" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-foreground-secondary transition-all duration-300 hover:text-primary hover:translate-x-1 inline-flex items-center gap-1"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-foreground">
              Contact Us
            </h3>
            <div className="flex flex-col gap-4">
              <a
                href={`tel:+${WHATSAPP_NUMBER}`}
                className="group flex items-center gap-3 text-foreground-secondary transition-colors duration-300 hover:text-primary"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                  <Phone className="h-4 w-4" />
                </span>
                +1 234 567 890
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-foreground-secondary transition-colors duration-300 hover:text-whatsapp"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-whatsapp/10 transition-all duration-300 group-hover:bg-whatsapp group-hover:text-white">
                  <WhatsAppIcon className="h-4 w-4" />
                </span>
                WhatsApp
              </a>
              <a
                href="mailto:contact@retailstore.com"
                className="group flex items-center gap-3 text-foreground-secondary transition-colors duration-300 hover:text-primary"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                  <Mail className="h-4 w-4" />
                </span>
                contact@retailstore.com
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Retail Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
