import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Clock } from "lucide-react";

const rentalItems = [
  {
    id: "1",
    name: "Professional DSLR Camera Kit",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
    price: 999,
  },
  {
    id: "2",
    name: "4K Projector with Screen",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=400&fit=crop",
    price: 1499,
  },
  {
    id: "3",
    name: "DJ Sound System Complete",
    image: "https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=400&h=400&fit=crop",
    price: 2499,
  },
  {
    id: "4",
    name: "Event Lighting Package",
    image: "https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=400&h=400&fit=crop",
    price: 1999,
  },
  {
    id: "5",
    name: "Drone with 4K Camera",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop",
    price: 1299,
  },
  {
    id: "6",
    name: "Studio Microphone Set",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop",
    price: 799,
  },
];

const Rentals = () => {
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

          {/* Rentals Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rentalItems.map((item, index) => (
              <div
                key={item.id}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <ProductCard {...item} isRental detailPath={`/rentals/${item.id}`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Rentals;
