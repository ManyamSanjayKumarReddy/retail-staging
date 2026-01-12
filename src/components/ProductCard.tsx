import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { Eye } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: string | number;
  originalPrice?: string | number;
  discountPercent?: number;
  isRental?: boolean;
  isFeatured?: boolean;
  isExpired?: boolean;
  isUnavailable?: boolean;
  isOnRequest?: boolean;
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
  isFeatured = false,
  isExpired = false,
  isUnavailable = false,
  isOnRequest = false,
  detailPath,
}: ProductCardProps) => {
  const { settings } = useSiteSettings();
  const currency = settings?.currency_symbol || '₹';
  
  // Format price display - if it's a string already formatted, use as is; otherwise add currency
  const formatPrice = (p: string | number | undefined): string => {
    if (p === undefined || p === null) return '';
    if (typeof p === 'string' && p.trim() !== '') return p;
    return `${currency}${p}`;
  };

  const displayPrice = formatPrice(price);
  const displayOriginalPrice = originalPrice ? formatPrice(originalPrice) : null;

  const whatsappMessage = isRental
    ? `Hello! I'm interested in renting: ${name}`
    : `Hello! I would like to order: ${name} - Price: ${displayPrice}`;

  const whatsappUrl = `https://wa.me/${settings?.whatsapp_number || ''}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-card card-hover">
      {/* Status Badges */}
      <div className="absolute left-2 top-2 z-10 flex flex-wrap gap-1 max-w-[calc(100%-16px)]">
        {isFeatured && (
          <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-white shadow-sm">
            Featured
          </span>
        )}
        {isExpired && (
          <span className="rounded bg-gray-500 px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-white shadow-sm">
            Expired
          </span>
        )}
        {isUnavailable && (
          <span className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-white shadow-sm">
            Unavailable
          </span>
        )}
        {isOnRequest && (
          <span className="rounded bg-blue-500 px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-white shadow-sm">
            On Request
          </span>
        )}
        {discountPercent && discountPercent > 0 && (
          <span className="rounded bg-discount px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-discount-foreground shadow-sm">
            {discountPercent}% OFF
          </span>
        )}
        {isRental && (
          <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-primary-foreground shadow-sm">
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
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-lg font-bold text-foreground">{displayPrice}</span>
          {displayOriginalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {displayOriginalPrice}
            </span>
          )}
          {isRental && (
            <span className="text-sm text-muted-foreground">/day</span>
          )}
        </div>

        {/* CTAs */}
        <div className="mt-3 flex gap-2">
          <Button 
            asChild 
            variant="outline" 
            size="sm" 
            className="flex-1 btn-press"
          >
            <Link to={detailPath} className="flex items-center justify-center gap-2">
              <Eye className="h-4 w-4" />
              <span>View More</span>
            </Link>
          </Button>
          <Button 
            asChild 
            variant="whatsapp" 
            size="sm" 
            className="flex-1 btn-press group/btn"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              <WhatsAppIcon className="h-4 w-4 transition-transform duration-300 group-hover/btn:scale-110" />
              <span>{isRental ? "Rent" : "Order"}</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};
