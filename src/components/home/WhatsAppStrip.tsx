import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "1234567890";

export const WhatsAppStrip = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello! I'm interested in your products."
  )}`;

  return (
    <section className="bg-whatsapp py-12">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-bold text-whatsapp-foreground md:text-3xl">
              Order Directly on WhatsApp
            </h2>
            <p className="mt-2 text-whatsapp-foreground/90">
              Get instant responses and the fastest delivery. Just one tap away!
            </p>
          </div>
          <Button
            asChild
            variant="heroOutline"
            size="lg"
            className="border-whatsapp-foreground text-whatsapp-foreground hover:bg-whatsapp-foreground hover:text-whatsapp"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Start Chat Now
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
