import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ChevronLeft, ChevronRight, ArrowLeft, Shield, Truck, Star, Loader2 } from "lucide-react";
import { useProduct } from "@/hooks/useProducts";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { product: item, loading, error } = useProduct(id);
  const { settings } = useSiteSettings();
  const [currentImage, setCurrentImage] = useState(0);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !item) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/items">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const images = item.images?.length ? item.images : [item.image || '/placeholder.svg'];
  const discountPercent = item.original_price 
    ? Math.round((1 - item.price / item.original_price) * 100) 
    : null;

  const whatsappMessage = `Hello! I would like to order: ${item.name} - Price: ₹${item.price}`;
  const whatsappUrl = `https://wa.me/${settings?.whatsapp_number || ''}?text=${encodeURIComponent(whatsappMessage)}`;

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  // Convert specifications object to array format
  const specificationsArray = item.specifications 
    ? Object.entries(item.specifications).map(([label, value]) => ({ label, value }))
    : [];

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
                  src={images[currentImage]}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500"
                />
              </div>

              {/* Discount Badge */}
              {discountPercent && discountPercent > 0 && (
                <span className="absolute left-4 top-4 rounded-xl bg-discount px-3 py-1.5 text-sm font-bold text-discount-foreground shadow-lg">
                  {discountPercent}% OFF
                </span>
              )}

              {/* Navigation Arrows */}
              {images.length > 1 && (
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
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {images.map((_, index) => (
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
                {item.original_price && item.original_price > item.price && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{item.original_price}
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
              {specificationsArray.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-bold text-foreground">
                    Specifications
                  </h3>
                  <div className="rounded-xl border border-border overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        {specificationsArray.map((spec, index) => (
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
              )}

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
