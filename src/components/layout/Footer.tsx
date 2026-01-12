import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

export const Footer = () => {
  const { settings } = useSiteSettings();

  return (
    <footer className="border-t border-border bg-background-soft">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="animate-fade-in">
            <Link to="/" className="inline-flex items-center gap-1 group">
              <span className="text-xl font-bold text-primary transition-colors">
                {settings?.site_name?.split(' ')[0] || 'Retail'}
              </span>
              <span className="text-xl font-semibold text-foreground">
                {settings?.site_name?.split(' ').slice(1).join(' ') || 'Store'}
              </span>
            </Link>
            <p className="mt-4 text-foreground-secondary leading-relaxed">
              {settings?.footer_description || 'Quality products and rental services. Order directly for the fastest service.'}
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
                { to: "/payment", label: "Payment" },
                { to: "/contact", label: "Contact" },
                { to: "/terms", label: "Terms & Conditions" },
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
              {settings?.contact_phone && (
                <a
                  href={`tel:${settings.contact_phone}`}
                  className="group flex items-center gap-3 text-foreground-secondary transition-colors duration-300 hover:text-primary"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                    <Phone className="h-4 w-4" />
                  </span>
                  {settings.contact_phone}
                </a>
              )}
              {settings?.whatsapp_number && (
                <a
                  href={`https://wa.me/${settings.whatsapp_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-foreground-secondary transition-colors duration-300 hover:text-whatsapp"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-whatsapp/10 transition-all duration-300 group-hover:bg-whatsapp group-hover:text-white">
                    <WhatsAppIcon className="h-4 w-4" />
                  </span>
                  Chat
                </a>
              )}
              {settings?.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="group flex items-center gap-3 text-foreground-secondary transition-colors duration-300 hover:text-primary"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                    <Mail className="h-4 w-4" />
                  </span>
                  {settings.contact_email}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {settings?.site_name || 'Retail Store'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
