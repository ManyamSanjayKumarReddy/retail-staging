import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Package, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const Items = () => {
  const { products, loading, error } = useProducts({ isRental: false });
  const { settings } = useSiteSettings();

  return (
    <Layout>
      <section className="bg-background py-14 md:py-20">
        <div className="container">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary animate-fade-in">
              <Package className="h-4 w-4" />
              Shop Now
            </span>
            <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Our Products
            </h1>
            <p className="mx-auto max-w-2xl text-foreground-secondary text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Browse our complete collection of premium products. Order via
              WhatsApp for instant service and same-day delivery.
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
              <p>Failed to load products. Please try again later.</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p>No products available at the moment.</p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && products.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((item, index) => (
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
                  originalPrice={item.original_price}
                  discountPercent={item.original_price ? Math.round((1 - item.price / item.original_price) * 100) : undefined}
                    detailPath={`/items/${item.id}`}
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

export default Items;
