import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { RentalHighlights } from "@/components/home/RentalHighlights";
import { WhatsAppStrip } from "@/components/home/WhatsAppStrip";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedSection />
      <RentalHighlights />
      <WhatsAppStrip />
    </Layout>
  );
};

export default Index;