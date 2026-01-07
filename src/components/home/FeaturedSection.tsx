import { Link } from "react-router-dom";
import { ProductCard } from "../ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const featuredItems = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    price: 2999,
    originalPrice: 4999,
    discountPercent: 40,
  },
  {
    id: "2",
    name: "Smart Watch Series Pro",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    price: 5499,
    originalPrice: 7999,
    discountPercent: 31,
  },
  {
    id: "3",
    name: "Portable Bluetooth Speaker",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    price: 1499,
    originalPrice: 2499,
    discountPercent: 40,
  },
  {
    id: "4",
    name: "Designer Sunglasses",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    price: 899,
    originalPrice: 1499,
    discountPercent: 40,
  },
];

export const FeaturedSection = () => {
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
            unbeatable prices. Order via WhatsApp for same-day delivery.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredItems.map((item, index) => (
            <div
              key={item.id}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <ProductCard {...item} detailPath={`/items/${item.id}`} />
            </div>
          ))}
        </div>

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
