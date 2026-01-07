import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MessageCircle, ChevronLeft, ChevronRight, ArrowLeft, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "1234567890";

// Sample rental data
const rentalsData: Record<string, {
  id: string;
  name: string;
  images: string[];
  price: number;
  description: string;
  specifications: { label: string; value: string }[];
}> = {
  "1": {
    id: "1",
    name: "Professional DSLR Camera Kit",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800",
    ],
    price: 999,
    description: "Complete professional camera kit with body, multiple lenses, tripod, and accessories. Perfect for photography and videography projects.",
    specifications: [
      { label: "Camera", value: "Canon EOS R5" },
      { label: "Lenses", value: "24-70mm, 70-200mm" },
      { label: "Accessories", value: "Tripod, Flash, Memory Cards" },
      { label: "Bag", value: "Included" },
    ],
  },
  "2": {
    id: "2",
    name: "4K Projector with Screen",
    images: [
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800",
    ],
    price: 1499,
    description: "High-quality 4K projector with a portable screen. Ideal for presentations, movie nights, and events.",
    specifications: [
      { label: "Resolution", value: "4K UHD" },
      { label: "Brightness", value: "3000 Lumens" },
      { label: "Screen Size", value: "120 inches" },
      { label: "Connectivity", value: "HDMI, USB, Wireless" },
    ],
  },
};

const RentalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [currentImage, setCurrentImage] = useState(0);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

  // Default item if not found
  const item = id && rentalsData[id] ? rentalsData[id] : {
    id: id || "1",
    name: "Rental Item",
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800"],
    price: 999,
    description: "Rental item description goes here.",
    specifications: [{ label: "Condition", value: "Excellent" }],
  };

  const dateRange = fromDate && toDate 
    ? `From: ${format(fromDate, "PPP")} To: ${format(toDate, "PPP")}` 
    : fromDate 
    ? `From: ${format(fromDate, "PPP")}` 
    : "";

  const whatsappMessage = `Hello! I would like to rent: ${item.name} - Price: ₹${item.price}/day${dateRange ? ` ${dateRange}` : ""}`;
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
            to="/rentals"
            className="mb-6 inline-flex items-center gap-2 text-sm text-foreground-secondary transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Rentals
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

              {/* Rental Badge */}
              <span className="absolute left-4 top-4 rounded-md bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                Available for Rent
              </span>

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

            {/* Rental Info */}
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                {item.name}
              </h1>

              {/* Price */}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-3xl font-bold text-foreground">
                  ₹{item.price}
                </span>
                <span className="text-muted-foreground">/day</span>
              </div>

              {/* Description */}
              <p className="mt-6 text-foreground-secondary leading-relaxed">
                {item.description}
              </p>

              {/* Date Selection */}
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  Select Rental Period
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      From Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !fromDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fromDate ? format(fromDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={fromDate}
                          onSelect={setFromDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      To Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !toDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {toDate ? format(toDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={toDate}
                          onSelect={setToDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  What's Included
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
                  Request Rental on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RentalDetail;
