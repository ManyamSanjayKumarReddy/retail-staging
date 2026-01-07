import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, CreditCard, Smartphone, Banknote, Building2 } from "lucide-react";

const WHATSAPP_NUMBER = "1234567890";

const paymentMethods = [
  {
    icon: Smartphone,
    name: "UPI Payment",
    description: "Pay via any UPI app like Google Pay, PhonePe, or Paytm",
  },
  {
    icon: CreditCard,
    name: "Card Payment",
    description: "Credit/Debit cards accepted via secure payment link",
  },
  {
    icon: Banknote,
    name: "Cash on Delivery",
    description: "Pay in cash when your order is delivered",
  },
  {
    icon: Building2,
    name: "Bank Transfer",
    description: "Direct bank transfer to our account",
  },
];

const Payment = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello! I would like to confirm my payment details."
  )}`;

  return (
    <Layout>
      <section className="bg-background py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            {/* Page Header */}
            <div className="mb-10 text-center">
              <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Payment Information
              </h1>
              <p className="text-foreground-secondary">
                We offer multiple secure payment options for your convenience.
                Choose the method that works best for you.
              </p>
            </div>

            {/* Payment Methods */}
            <div className="mb-10 grid gap-4 sm:grid-cols-2">
              {paymentMethods.map((method) => (
                <Card key={method.name} className="border-border">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <method.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{method.name}</h3>
                      <p className="mt-1 text-sm text-foreground-secondary">
                        {method.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Instructions */}
            <Card className="mb-10 border-border bg-muted/50">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  Payment Instructions
                </h3>
                <ul className="space-y-3 text-foreground-secondary">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span>After placing your order via WhatsApp, you'll receive payment details.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span>For UPI payments, we'll share our UPI ID in the chat.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span>For card payments, we'll send a secure payment link.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span>Once payment is confirmed, your order will be processed immediately.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center">
              <p className="mb-4 text-foreground-secondary">
                Ready to complete your payment? Contact us on WhatsApp.
              </p>
              <Button asChild variant="whatsapp" size="lg">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Confirm Payment on WhatsApp
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
