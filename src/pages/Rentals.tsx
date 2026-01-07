import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/ProductCard";

// Sample rental items data
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
      <section className="bg-background py-12 md:py-16">
        <div className="container">
          {/* Page Header */}
          <div className="mb-10 text-center">
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              Rental Services
            </span>
            <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Items for Rent
            </h1>
            <p className="mx-auto max-w-2xl text-foreground-secondary">
              Need equipment for a short time? Rent premium items at affordable
              daily rates. Perfect for events, projects, and special occasions.
            </p>
          </div>

          {/* Rentals Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rentalItems.map((item, index) => (
              <div
                key={item.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard
                  {...item}
                  isRental
                  detailPath={`/rentals/${item.id}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Rentals;
