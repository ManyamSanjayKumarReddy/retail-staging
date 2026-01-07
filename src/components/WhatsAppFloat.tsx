import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

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
          className="group fixed bottom-6 right-6 z-50"
          aria-label="Order via WhatsApp"
        >
          {/* Pulse ring effect */}
          <span className="absolute inset-0 rounded-full bg-whatsapp animate-pulse-ring" />
          
          {/* Main button */}
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-whatsapp transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
            <WhatsAppIcon className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
          </span>
        </a>
      </TooltipTrigger>
      <TooltipContent side="left" className="bg-foreground text-background font-medium">
        <p>Order via WhatsApp</p>
      </TooltipContent>
    </Tooltip>
  );
};
