import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ArrowRight } from "lucide-react";

const WHATSAPP_NUMBER = "1234567890";

export const WhatsAppStrip = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello! I'm interested in your products."
  )}`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-whatsapp to-whatsapp/90 py-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* Floating WhatsApp Icons */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 opacity-20 hidden lg:block animate-float">
        <WhatsAppIcon className="h-24 w-24" />
      </div>
      <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-20 hidden lg:block animate-float stagger-2">
        <WhatsAppIcon className="h-16 w-16" />
      </div>

      <div className="container relative">
        <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-white md:text-3xl lg:text-4xl">
              Order Directly on WhatsApp
            </h2>
            <p className="mt-3 text-white/90 text-lg max-w-xl">
              Get instant responses and the fastest delivery. Just one tap away!
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="group bg-white text-whatsapp hover:bg-white/90 shadow-lg btn-press animate-fade-in min-w-[200px]"
            style={{ animationDelay: "0.2s" }}
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              Start Chat Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
