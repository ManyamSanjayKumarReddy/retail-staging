import { Link } from "react-router-dom";
import { ProductCard } from "../ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

export const RentalHighlights = () => {
  const { products: rentals, loading } = useProducts({ isRental: true, isFeatured: true, limit: 3 });

  return (
    <section className="bg-background-soft py-20 md:py-28 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      
      <div className="container relative">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary animate-fade-in">
            <Clock className="h-4 w-4" />
            Rental Services
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Available for Rent
          </h2>
          <p className="mx-auto max-w-2xl text-foreground-secondary text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Need equipment for a short time? Rent premium items at affordable
            daily rates. Perfect for events, projects, and more.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Rentals Grid */}
        {!loading && rentals.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rentals.map((item, index) => (
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
                  isRental
                  detailPath={`/rentals/${item.id}`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && rentals.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No featured rental items available at the moment.</p>
          </div>
        )}

        {/* View All Button */}
        <div className="mt-14 text-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <Button asChild variant="outline" size="lg" className="group btn-press">
            <Link to="/rentals">
              View All Rentals
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
