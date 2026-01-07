import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

const WHATSAPP_NUMBER = "1234567890";

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
  const whatsappMessage = isRental
    ? `Hello! I'm interested in renting: ${name}`
    : `Hello! I would like to order: ${name} - Price: ₹${price}`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover">
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
        {discountPercent && discountPercent > 0 && (
          <span className="rounded-md bg-discount px-2 py-1 text-xs font-semibold text-discount-foreground">
            {discountPercent}% OFF
          </span>
        )}
        {isRental && (
          <span className="rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
            Rental
          </span>
        )}
      </div>

      {/* Image */}
      <Link to={detailPath} className="block aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={detailPath}>
          <h3 className="line-clamp-2 text-base font-semibold text-card-foreground transition-colors hover:text-primary">
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
        </div>

        {/* CTA */}
        <Button asChild variant="whatsapp" size="sm" className="mt-3 w-full">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" />
            {isRental ? "Rent on WhatsApp" : "Order on WhatsApp"}
          </a>
        </Button>
      </div>
    </div>
  );
};
