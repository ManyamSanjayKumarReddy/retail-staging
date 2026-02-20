import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ChevronLeft, ChevronRight, ArrowLeft, CalendarIcon, Clock, CheckCircle2, Loader2, Play, ZoomIn, Package } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useProduct } from "@/hooks/useProducts";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { StatusBadges } from "@/components/StatusBadges";
import { LinksAttachmentsDisplay } from "@/components/LinksAttachmentsDisplay";
import { supabase } from "@/lib/supabase";
import { StatusTag, ExternalLink, Attachment } from "@/types/database";
import { formatContent } from "@/lib/formatContent";
import { stripHtml } from "@/lib/utils";

const RentalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { product: item, loading, error } = useProduct(id);
  const { settings } = useSiteSettings();
  const [currentImage, setCurrentImage] = useState(0);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [statusTags, setStatusTags] = useState<StatusTag[]>([]);

  useEffect(() => {
    if (id) {
      fetchStatusTags();
    }
  }, [id]);

  const fetchStatusTags = async () => {
    const { data: tagLinks } = await supabase
      .from('product_status_tags')
      .select('status_tag_id')
      .eq('product_id', id);
    
    if (tagLinks && tagLinks.length > 0) {
      const tagIds = tagLinks.map(t => t.status_tag_id);
      const { data: tags } = await supabase
        .from('status_tags')
        .select('*')
        .in('id', tagIds)
        .eq('is_active', true);
      setStatusTags(tags || []);
    }
  };

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
            <Button><ArrowLeft className="h-4 w-4 mr-2" />Back to Rentals</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const images = item.images?.length ? item.images : [item.image || '/placeholder.svg'];
  const currency = settings?.currency_symbol || '₹';
  const allowPastDates = settings?.rental_allow_past_dates || false;
  
  const formatPrice = (p: string | number | undefined): string => {
    if (p === undefined || p === null) return '';
    if (typeof p === 'string' && p.trim() !== '') return p;
    return `${currency}${p}`;
  };

  const dateRange = fromDate && toDate 
    ? `From: ${format(fromDate, "PPP")} To: ${format(toDate, "PPP")}` 
    : fromDate ? `From: ${format(fromDate, "PPP")}` : "";

  const cleanName = stripHtml(item.name);
  const cleanDescription = stripHtml(item.description);
  const stockCount = (item as any).stock_count;

  const whatsappMessage = `Hello! I would like to rent: ${cleanName} - Price: ${formatPrice(item.price)}/day${dateRange ? ` ${dateRange}` : ""}`;
  const whatsappUrl = `https://wa.me/${settings?.whatsapp_number || ''}?text=${encodeURIComponent(whatsappMessage)}`;

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  const isVideo = (url: string) => url.match(/\.(mp4|webm|ogg|mov)$/i);

  const specificationsArray = item.specifications 
    ? Object.entries(item.specifications).map(([label, value]) => ({ label, value }))
    : [];

  const content = (item as any).content;
  const ctaText = settings?.rental_detail_cta_text || 'Request Rental on WhatsApp';

  // Get links and attachments
  const externalLinks: ExternalLink[] = (item as any).external_links || [];
  const attachments: Attachment[] = (item as any).attachments || [];

  // Disable past dates unless allowed by admin
  const disabledDates = allowPastDates ? undefined : { before: new Date() };

  return (
    <Layout>
      <section className="bg-background py-10 md:py-16">
        <div className="container">
          <Link to="/rentals" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-foreground-secondary transition-all duration-300 hover:text-primary hover:-translate-x-1">
            <ArrowLeft className="h-4 w-4" />Back to Rentals
          </Link>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="space-y-4 animate-fade-in">
              <div 
                className="relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-card cursor-pointer group"
                onClick={() => !isVideo(images[currentImage]) && setLightboxOpen(true)}
              >
                {isVideo(images[currentImage]) ? (
                  <video src={images[currentImage]} className="h-full w-full object-cover" controls playsInline />
                ) : (
                  <>
                    <img src={images[currentImage]} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                    </div>
                  </>
                )}

                {/* Status Tags */}
                {statusTags.length > 0 && (
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <StatusBadges tags={statusTags} size="md" />
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-3 shadow-lg backdrop-blur transition-all duration-300 hover:bg-background hover:scale-110" aria-label="Previous image">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-3 shadow-lg backdrop-blur transition-all duration-300 hover:bg-background hover:scale-110" aria-label="Next image">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button key={index} onClick={() => setCurrentImage(index)} className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${index === currentImage ? "border-primary ring-2 ring-primary/30" : "border-transparent hover:border-muted-foreground/30"}`}>
                      {isVideo(img) ? (
                        <div className="w-full h-full bg-muted flex items-center justify-center"><Play className="w-6 h-6 text-muted-foreground" /></div>
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
              <h1 className="text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">{cleanName}</h1>
              
              {/* Status Tags below title */}
              {statusTags.length > 0 && (
                <div className="mt-3">
                  <StatusBadges tags={statusTags} size="md" />
                </div>
              )}
              
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-3xl font-bold text-primary">{formatPrice(item.price)}</span>
                <span className="text-lg text-muted-foreground">/day</span>
              </div>

              {/* Stock Count */}
              {stockCount !== undefined && stockCount !== null && (
                <div className="mt-3 flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className={`text-sm font-semibold ${stockCount > 0 ? 'text-green-600' : 'text-destructive'}`}>
                    {stockCount > 0 ? `${stockCount} available` : 'Not available'}
                  </span>
                </div>
              )}

              <p className="mt-6 text-foreground-secondary leading-relaxed text-lg">{cleanDescription}</p>

              {/* Date Selection */}
              <div className="mt-8 p-5 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Select Rental Period</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">From Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !fromDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fromDate ? format(fromDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={fromDate} onSelect={setFromDate} disabled={disabledDates} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">To Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !toDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {toDate ? format(toDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={toDate} onSelect={setToDate} disabled={disabledDates} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {specificationsArray.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-bold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-whatsapp" />What's Included
                  </h3>
                  <div className="rounded-xl border border-border overflow-hidden">
                    <table className="w-full"><tbody>
                      {specificationsArray.map((spec, index) => (
                        <tr key={spec.label} className={index % 2 === 0 ? "bg-muted/50" : "bg-background"}>
                          <td className="px-5 py-4 text-sm font-semibold text-foreground">{spec.label}</td>
                          <td className="px-5 py-4 text-sm text-foreground-secondary">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody></table>
                  </div>
                </div>
              )}

              <Button asChild variant="whatsapp" size="lg" className="mt-8 w-full btn-press group text-base">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  {ctaText}
                </a>
              </Button>
            </div>
          </div>

          {/* Links & Attachments */}
          <LinksAttachmentsDisplay links={externalLinks} attachments={attachments} />

          {content && (
            <div className="mt-16 animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground mb-6">Rental Details</h2>
              <div className="prose prose-lg max-w-none text-foreground-secondary bg-muted/30 rounded-2xl p-6 md:p-8">
                {formatContent(content)}
              </div>
            </div>
          )}
        </div>
      </section>

      <ImageLightbox images={images} initialIndex={currentImage} open={lightboxOpen} onOpenChange={setLightboxOpen} />
    </Layout>
  );
};

export default RentalDetail;
