import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  isRental?: boolean;
  detailPath: string;
}

export const ProductCard = ({
  id,
  name,
  image,
  price,
  originalPrice,
  discountPercent,
  isRental = false,
  detailPath,
}: ProductCardProps) => {
  const { settings } = useSiteSettings();

  const whatsappMessage = isRental
    ? `Hello! I'm interested in renting: ${name}`
    : `Hello! I would like to order: ${name} - Price: ₹${price}`;

  const whatsappUrl = `https://wa.me/${settings?.whatsapp_number || ''}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-card card-hover">
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
        {discountPercent && discountPercent > 0 && (
          <span className="rounded-lg bg-discount px-2.5 py-1 text-xs font-bold text-discount-foreground shadow-sm animate-scale-in">
            {discountPercent}% OFF
          </span>
        )}
        {isRental && (
          <span className="rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow-sm animate-scale-in">
            Rental
          </span>
        )}
      </div>

      {/* Image */}
      <Link to={detailPath} className="block aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover img-zoom"
        />
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={detailPath}>
          <h3 className="line-clamp-2 text-base font-semibold text-card-foreground transition-colors duration-300 hover:text-primary">
            {name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">₹{price}</span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{originalPrice}
            </span>
          )}
          {isRental && (
            <span className="text-sm text-muted-foreground">/day</span>
          )}
        </div>

        {/* CTA */}
        <Button 
          asChild 
          variant="whatsapp" 
          size="sm" 
          className="mt-3 w-full btn-press group/btn"
        >
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
            <WhatsAppIcon className="h-4 w-4 transition-transform duration-300 group-hover/btn:scale-110" />
            <span>{isRental ? "Rent Now" : "Order Now"}</span>
          </a>
        </Button>
      </div>
    </div>
  );
};
