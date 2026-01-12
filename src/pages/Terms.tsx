import { Layout } from "@/components/layout/Layout";
import { FileText, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface TermsContent {
  id: string;
  content: string;
  updated_at: string;
}

const Terms = () => {
  const [terms, setTerms] = useState<TermsContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const { data, error } = await supabase
        .from("terms_conditions")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") throw error;
      setTerms(data);
    } catch (err) {
      console.error("Error fetching terms:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="bg-background py-14 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            {/* Page Header */}
            <div className="mb-12 text-center">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary animate-fade-in">
                <FileText className="h-4 w-4" />
                Legal
              </span>
              <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                Terms & Conditions
              </h1>
              <p className="text-muted-foreground text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                Please read these terms carefully before using our services.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : terms?.content ? (
              <div 
                className="prose prose-lg max-w-none dark:prose-invert animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
              >
                <div 
                  className="bg-card border border-border rounded-xl p-6 md:p-10 shadow-card"
                  dangerouslySetInnerHTML={{ __html: terms.content.replace(/\n/g, '<br/>') }}
                />
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No terms & conditions available</p>
                <p className="text-sm mt-1">Please check back later.</p>
              </div>
            )}

            {terms?.updated_at && (
              <p className="mt-8 text-center text-sm text-muted-foreground animate-fade-in">
                Last updated: {new Date(terms.updated_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
