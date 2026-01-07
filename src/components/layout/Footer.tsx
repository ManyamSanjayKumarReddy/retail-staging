import { Link } from "react-router-dom";
import { Phone, MessageCircle, Mail } from "lucide-react";

const WHATSAPP_NUMBER = "1234567890";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background-soft">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">Retail</span>
              <span className="text-xl font-semibold text-foreground">Store</span>
            </Link>
            <p className="mt-4 text-sm text-foreground-secondary">
              Quality products and rental services. Order directly via WhatsApp
              for the fastest service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="text-sm text-foreground-secondary transition-colors hover:text-primary"
              >
                Home
              </Link>
              <Link
                to="/items"
                className="text-sm text-foreground-secondary transition-colors hover:text-primary"
              >
                Items
              </Link>
              <Link
                to="/rentals"
                className="text-sm text-foreground-secondary transition-colors hover:text-primary"
              >
                Rentals
              </Link>
              <Link
                to="/contact"
                className="text-sm text-foreground-secondary transition-colors hover:text-primary"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact Us
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:+${WHATSAPP_NUMBER}`}
                className="flex items-center gap-2 text-sm text-foreground-secondary transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                +1 234 567 890
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-foreground-secondary transition-colors hover:text-whatsapp"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href="mailto:contact@retailstore.com"
                className="flex items-center gap-2 text-sm text-foreground-secondary transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                contact@retailstore.com
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Retail Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
