import { Link } from "react-router-dom";
import { ProductCard } from "../ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

export const FeaturedSection = () => {
  const { products, loading } = useProducts({ isRental: false, isFeatured: true, limit: 4 });

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary animate-fade-in">
            <Sparkles className="h-4 w-4" />
            Featured Collection
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Top Selling Products
          </h2>
          <p className="mx-auto max-w-2xl text-foreground-secondary text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Discover our most popular items. Premium quality products at
            unbeatable prices. Order now for same-day delivery.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((item, index) => (
              <div
                key={item.id}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
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

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No featured products available at the moment.</p>
          </div>
        )}

        {/* View All Button */}
        <div className="mt-14 text-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <Button asChild variant="outline" size="lg" className="group btn-press">
            <Link to="/items">
              View All Items
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
