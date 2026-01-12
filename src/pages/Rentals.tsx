import { useState, useEffect, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Pagination } from "@/components/Pagination";
import { Clock, Loader2, Search, Filter, ArrowUpDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/database";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ITEMS_PER_PAGE = 12;

type SortOption = "newest" | "oldest" | "price-low" | "price-high" | "name-asc" | "name-desc";

const Rentals = () => {
  const [rentals, setRentals] = useState<Product[]>([]);
  const [allRentals, setAllRentals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Extract unique categories from rentals
  const categories = useMemo(() => {
    const cats = [...new Set(allRentals.map(p => p.category).filter(Boolean))];
    return cats.sort();
  }, [allRentals]);

  useEffect(() => {
    fetchAllRentals();
  }, []);

  const fetchAllRentals = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("is_rental", true)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setAllRentals(data || []);
    } catch (err) {
      console.error("Error fetching rentals:", err);
      setError("Failed to load rentals");
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse price
  const parsePrice = (price: number | string): number => {
    if (typeof price === 'number') return price;
    return parseFloat(String(price).replace(/[^0-9.-]/g, '')) || 0;
  };

  // Filter and sort rentals
  const filteredRentals = useMemo(() => {
    let result = allRentals;

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "price-low":
          return parsePrice(a.price) - parsePrice(b.price);
        case "price-high":
          return parsePrice(b.price) - parsePrice(a.price);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return result;
  }, [allRentals, searchQuery, selectedCategory, sortBy]);

  // Paginated rentals
  const paginatedRentals = useMemo(() => {
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE;
    return filteredRentals.slice(from, to);
  }, [filteredRentals, currentPage]);

  const totalPages = Math.ceil(filteredRentals.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("newest");
  };

  return (
    <Layout>
      <section className="bg-background py-14 md:py-20">
        <div className="container">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary animate-fade-in">
              <Clock className="h-4 w-4" />
              Rental Services
            </span>
            <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Items for Rent
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Need equipment for a short time? Rent premium items at affordable
              daily rates. Perfect for events, projects, and special occasions.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-8 flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            {/* Search Row */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search rentals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filters Row */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[140px] sm:w-[160px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
                  <SelectTrigger className="w-[140px] sm:w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {(searchQuery || selectedCategory !== "all" || sortBy !== "newest") && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Results count */}
          {!loading && !error && (
            <p className="mb-6 text-sm text-muted-foreground">
              Showing {filteredRentals.length} {filteredRentals.length === 1 ? 'rental' : 'rentals'}
              {selectedCategory !== "all" && ` in "${selectedCategory}"`}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          )}

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
          {!loading && !error && filteredRentals.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No rentals found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter</p>
              {(searchQuery || selectedCategory !== "all") && (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Rentals Grid */}
          {!loading && !error && paginatedRentals.length > 0 && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedRentals.map((item, index) => (
                  <div
                    key={item.id}
                    className="opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                  >
                    <ProductCard
                      id={item.id}
                      name={item.name}
                      image={item.images?.[0] || item.image || "/placeholder.svg"}
                      price={item.price}
                      isRental
                      isFeatured={item.is_featured}
                      isExpired={item.is_expired}
                      isUnavailable={item.is_unavailable}
                      isOnRequest={item.is_on_request}
                      detailPath={`/rentals/${item.id}`}
                    />
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={filteredRentals.length}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Rentals;
