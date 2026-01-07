import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ChevronLeft, ChevronRight, ArrowLeft, Shield, Truck, Star } from "lucide-react";

const WHATSAPP_NUMBER = "1234567890";

const itemsData: Record<string, {
  id: string;
  name: string;
  images: string[];
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  description: string;
  specifications: { label: string; value: string }[];
}> = {
  "1": {
    id: "1",
    name: "Premium Wireless Headphones",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800",
    ],
    price: 2999,
    originalPrice: 4999,
    discountPercent: 40,
    description: "Experience crystal-clear audio with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and premium comfort for all-day wear.",
    specifications: [
      { label: "Material", value: "Premium Leather & Aluminum" },
      { label: "Color", value: "Matte Black" },
      { label: "Battery Life", value: "30 Hours" },
      { label: "Connectivity", value: "Bluetooth 5.2" },
      { label: "Weight", value: "250g" },
    ],
  },
  "2": {
    id: "2",
    name: "Smart Watch Series Pro",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800",
    ],
    price: 5499,
    originalPrice: 7999,
    discountPercent: 31,
    description: "Stay connected and track your fitness with our advanced smartwatch. Features heart rate monitoring, GPS, water resistance, and a stunning AMOLED display.",
    specifications: [
      { label: "Display", value: "1.4\" AMOLED" },
      { label: "Water Resistance", value: "5 ATM" },
      { label: "Battery Life", value: "7 Days" },
      { label: "GPS", value: "Built-in" },
    ],
  },
};

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [currentImage, setCurrentImage] = useState(0);

  const item = id && itemsData[id] ? itemsData[id] : {
    id: id || "1",
    name: "Product Name",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"],
    price: 999,
    description: "Product description goes here.",
    specifications: [{ label: "Material", value: "Premium Quality" }],
  };

  const whatsappMessage = `Hello! I would like to order: ${item.name} - Price: ₹${item.price}`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % item.images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + item.images.length) % item.images.length);

  return (
    <Layout>
      <section className="bg-background py-10 md:py-16">
        <div className="container">
          {/* Back Button */}
          <Link
            to="/items"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-foreground-secondary transition-all duration-300 hover:text-primary hover:-translate-x-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Items
          </Link>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Image Slider */}
            <div className="relative animate-fade-in">
              <div className="aspect-square overflow-hidden rounded-2xl bg-muted shadow-card">
                <img
                  src={item.images[currentImage]}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500"
                />
              </div>

              {/* Discount Badge */}
              {item.discountPercent && (
                <span className="absolute left-4 top-4 rounded-xl bg-discount px-3 py-1.5 text-sm font-bold text-discount-foreground shadow-lg">
                  {item.discountPercent}% OFF
                </span>
              )}

              {/* Navigation Arrows */}
              {item.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-3 shadow-lg backdrop-blur transition-all duration-300 hover:bg-background hover:scale-110"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-3 shadow-lg backdrop-blur transition-all duration-300 hover:bg-background hover:scale-110"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Dots */}
              {item.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {item.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                        index === currentImage 
                          ? "bg-primary w-6" 
                          : "bg-background/80 hover:bg-background"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="animate-slide-in-right">
              <h1 className="text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
                {item.name}
              </h1>

              {/* Price */}
              <div className="mt-5 flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">₹{item.price}</span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{item.originalPrice}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-6 text-foreground-secondary leading-relaxed text-lg">
                {item.description}
              </p>

              {/* Trust Badges */}
              <div className="mt-8 flex flex-wrap gap-4">
                {[
                  { icon: Shield, label: "Genuine Product" },
                  { icon: Truck, label: "Fast Delivery" },
                  { icon: Star, label: "Top Rated" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-foreground-secondary">{label}</span>
                  </div>
                ))}
              </div>

              {/* Specifications */}
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-bold text-foreground">
                  Specifications
                </h3>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {item.specifications.map((spec, index) => (
                        <tr
                          key={spec.label}
                          className={index % 2 === 0 ? "bg-muted/50" : "bg-background"}
                        >
                          <td className="px-5 py-4 text-sm font-semibold text-foreground">
                            {spec.label}
                          </td>
                          <td className="px-5 py-4 text-sm text-foreground-secondary">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CTA */}
              <Button asChild variant="whatsapp" size="lg" className="mt-8 w-full btn-press group text-base">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  Order on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ItemDetail;
