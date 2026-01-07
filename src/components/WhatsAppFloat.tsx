import { MessageCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const WHATSAPP_NUMBER = "1234567890";

export const WhatsAppFloat = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello! I'm interested in your products."
  )}`;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl animate-pulse"
          aria-label="Order via WhatsApp"
        >
          <MessageCircle className="h-7 w-7" />
        </a>
      </TooltipTrigger>
      <TooltipContent side="left" className="bg-foreground text-background">
        <p>Order via WhatsApp</p>
      </TooltipContent>
    </Tooltip>
  );
};
