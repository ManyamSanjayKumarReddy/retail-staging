import { Link } from "react-router-dom";
import { ProductCard } from "../ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Sample featured items data
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
    <section className="bg-background py-16 md:py-24">
      <div className="container">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <span className="mb-2 inline-block text-sm font-medium uppercase tracking-wider text-primary">
            Featured Collection
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Top Selling Products
          </h2>
          <p className="mx-auto max-w-2xl text-foreground-secondary">
            Discover our most popular items. Premium quality products at
            unbeatable prices. Order via WhatsApp for same-day delivery.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredItems.map((item, index) => (
            <div
              key={item.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard
                {...item}
                detailPath={`/items/${item.id}`}
              />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/items">
              View All Items
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
