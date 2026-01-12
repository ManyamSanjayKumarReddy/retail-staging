import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ChevronLeft, ChevronRight, ArrowLeft, CalendarIcon, Clock, CheckCircle2, Loader2, Play } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useProduct } from "@/hooks/useProducts";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const RentalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { product: item, loading, error } = useProduct(id);
  const { settings } = useSiteSettings();
  const [currentImage, setCurrentImage] = useState(0);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

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
          <h1 className="text-2xl font-bold mb-4">Rental Item Not Found</h1>
          <p className="text-muted-foreground mb-6">The rental item you're looking for doesn't exist.</p>
          <Link to="/rentals">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Rentals
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const images = item.images?.length ? item.images : [item.image || '/placeholder.svg'];

  const dateRange = fromDate && toDate 
    ? `From: ${format(fromDate, "PPP")} To: ${format(toDate, "PPP")}` 
    : fromDate 
    ? `From: ${format(fromDate, "PPP")}` 
    : "";

  const whatsappMessage = `Hello! I would like to rent: ${item.name} - Price: ₹${item.price}/day${dateRange ? ` ${dateRange}` : ""}`;
  const whatsappUrl = `https://wa.me/${settings?.whatsapp_number || ''}?text=${encodeURIComponent(whatsappMessage)}`;

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  const isVideo = (url: string) => url.match(/\.(mp4|webm|ogg|mov)$/i);

  const specificationsArray = item.specifications 
    ? Object.entries(item.specifications).map(([label, value]) => ({ label, value }))
    : [];

  const content = (item as any).content;

  return (
    <Layout>
      <section className="bg-background py-10 md:py-16">
        <div className="container">
          {/* Back Button */}
          <Link
            to="/rentals"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-foreground-secondary transition-all duration-300 hover:text-primary hover:-translate-x-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Rentals
          </Link>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="space-y-4 animate-fade-in">
              {/* Main Image/Video */}
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-card">
                {isVideo(images[currentImage]) ? (
                  <video
                    src={images[currentImage]}
                    className="h-full w-full object-cover"
                    controls
                    playsInline
                  />
                ) : (
                  <img
                    src={images[currentImage]}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500"
                  />
                )}

                {/* Rental Badge */}
                <span className="absolute left-4 top-4 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg">
                  Available for Rent
                </span>

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
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        index === currentImage 
                          ? "border-primary ring-2 ring-primary/30" 
                          : "border-transparent hover:border-muted-foreground/30"
                      }`}
                    >
                      {isVideo(img) ? (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Play className="w-6 h-6 text-muted-foreground" />
                        </div>
                      ) : (
                        <img src={img} alt={`${item.name} ${index + 1}`} className="w-full h-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Rental Info */}
            <div className="animate-slide-in-right">
              <h1 className="text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
                {item.name}
              </h1>

              {/* Price */}
              <div className="mt-5 flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">₹{item.price}</span>
                <span className="text-lg text-muted-foreground">/day</span>
              </div>

              {/* Description */}
              <p className="mt-6 text-foreground-secondary leading-relaxed text-lg">
                {item.description}
              </p>

              {/* Date Selection */}
              <div className="mt-8 p-5 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">
                    Select Rental Period
                  </h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
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
                        <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
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
                        <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              {specificationsArray.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-whatsapp" />
                    What's Included
                  </h3>
                  <div className="rounded-xl border border-border overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        {specificationsArray.map((spec, index) => (
                          <tr key={spec.label} className={index % 2 === 0 ? "bg-muted/50" : "bg-background"}>
                            <td className="px-5 py-4 text-sm font-semibold text-foreground">{spec.label}</td>
                            <td className="px-5 py-4 text-sm text-foreground-secondary">{spec.value}</td>
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
                  Request Rental on WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Detailed Content Section */}
          {content && (
            <div className="mt-16 animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground mb-6">Rental Details</h2>
              <div className="prose prose-lg max-w-none text-foreground-secondary bg-muted/30 rounded-2xl p-6 md:p-8">
                <div className="whitespace-pre-wrap leading-relaxed">
                  {content}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default RentalDetail;