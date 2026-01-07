import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { CreditCard, Smartphone, Banknote, Building2, Shield, ArrowRight } from "lucide-react";

const WHATSAPP_NUMBER = "1234567890";

const paymentMethods = [
  {
    icon: Smartphone,
    name: "UPI Payment",
    description: "Pay via any UPI app like Google Pay, PhonePe, or Paytm",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: CreditCard,
    name: "Card Payment",
    description: "Credit/Debit cards accepted via secure payment link",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Banknote,
    name: "Cash on Delivery",
    description: "Pay in cash when your order is delivered",
    color: "bg-green-500/10 text-green-600",
  },
  {
    icon: Building2,
    name: "Bank Transfer",
    description: "Direct bank transfer to our account",
    color: "bg-orange-500/10 text-orange-600",
  },
];

const Payment = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello! I would like to confirm my payment details."
  )}`;

  return (
    <Layout>
      <section className="bg-background py-14 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            {/* Page Header */}
            <div className="mb-12 text-center">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary animate-fade-in">
                <CreditCard className="h-4 w-4" />
                Secure Payments
              </span>
              <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                Payment Information
              </h1>
              <p className="text-foreground-secondary text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                We offer multiple secure payment options for your convenience.
              </p>
            </div>

            {/* Payment Methods */}
            <div className="mb-10 grid gap-4 sm:grid-cols-2">
              {paymentMethods.map((method, index) => (
                <Card 
                  key={method.name} 
                  className="border-border card-hover opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${method.color}`}>
                      <method.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{method.name}</h3>
                      <p className="mt-1 text-sm text-foreground-secondary">
                        {method.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Instructions */}
            <Card className="mb-10 border-border bg-gradient-to-br from-muted/50 to-muted animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    How It Works
                  </h3>
                </div>
                <ul className="space-y-4 text-foreground-secondary">
                  {[
                    "After placing your order via WhatsApp, you'll receive payment details.",
                    "For UPI payments, we'll share our UPI ID in the chat.",
                    "For card payments, we'll send a secure payment link.",
                    "Once payment is confirmed, your order will be processed immediately."
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <p className="mb-5 text-foreground-secondary">
                Ready to complete your payment? Contact us on WhatsApp.
              </p>
              <Button asChild variant="whatsapp" size="lg" className="btn-press group">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  Confirm Payment on WhatsApp
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Payment;
