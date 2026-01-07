import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { MessageCircle, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

const WHATSAPP_NUMBER = "1234567890";

// Sample item data
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

  // Default item if not found
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

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + item.images.length) % item.images.length);
  };

  return (
    <Layout>
      <section className="bg-background py-8 md:py-12">
        <div className="container">
          {/* Back Button */}
          <Link
            to="/items"
            className="mb-6 inline-flex items-center gap-2 text-sm text-foreground-secondary transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Items
          </Link>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Slider */}
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-xl bg-muted">
                <img
                  src={item.images[currentImage]}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Navigation Arrows */}
              {item.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow-md backdrop-blur transition-colors hover:bg-background"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow-md backdrop-blur transition-colors hover:bg-background"
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
                      className={`h-2 w-2 rounded-full transition-colors ${
                        index === currentImage ? "bg-primary" : "bg-background/80"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                {item.name}
              </h1>

              {/* Price */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-3xl font-bold text-foreground">
                  ₹{item.price}
                </span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{item.originalPrice}
                    </span>
                    {item.discountPercent && (
                      <span className="rounded-md bg-discount px-2 py-1 text-sm font-semibold text-discount-foreground">
                        {item.discountPercent}% OFF
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Description */}
              <p className="mt-6 text-foreground-secondary leading-relaxed">
                {item.description}
              </p>

              {/* Specifications */}
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  Specifications
                </h3>
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {item.specifications.map((spec, index) => (
                        <tr
                          key={spec.label}
                          className={index % 2 === 0 ? "bg-muted/50" : "bg-background"}
                        >
                          <td className="px-4 py-3 text-sm font-medium text-foreground">
                            {spec.label}
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground-secondary">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CTA */}
              <Button asChild variant="whatsapp" size="lg" className="mt-8 w-full">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
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
