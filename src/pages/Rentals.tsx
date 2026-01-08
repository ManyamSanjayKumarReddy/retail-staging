import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Clock, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const Rentals = () => {
  const { products: rentals, loading, error } = useProducts({ isRental: true });
  const { settings } = useSiteSettings();

  return (
    <Layout>
      <section className="bg-background py-14 md:py-20">
        <div className="container">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary animate-fade-in">
              <Clock className="h-4 w-4" />
              Rental Services
            </span>
            <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Items for Rent
            </h1>
            <p className="mx-auto max-w-2xl text-foreground-secondary text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Need equipment for a short time? Rent premium items at affordable
              daily rates. Perfect for events, projects, and special occasions.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20 text-destructive">
              <p>Failed to load rentals. Please try again later.</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && rentals.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p>No rental items available at the moment.</p>
            </div>
          )}

          {/* Rentals Grid */}
          {!loading && !error && rentals.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rentals.map((item, index) => (
                <div
                  key={item.id}
                  className="opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                <ProductCard
                  id={item.id}
                  name={item.name}
                  image={item.images?.[0] || item.image || '/placeholder.svg'}
                  price={item.price}
                  isRental
                    detailPath={`/rentals/${item.id}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Rentals;
