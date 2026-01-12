import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { CreditCard, Smartphone, Banknote, Building2, Shield, ArrowRight, Loader2, QrCode, Copy, Check } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { supabase } from "@/lib/supabase";

interface PaymentSettings {
  id: string;
  upi_enabled: boolean;
  card_enabled: boolean;
  cod_enabled: boolean;
  bank_enabled: boolean;
  qr_code_image: string | null;
  upi_id: string | null;
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  how_it_works: string[];
}

const defaultPaymentSettings: PaymentSettings = {
  id: '',
  upi_enabled: true,
  card_enabled: true,
  cod_enabled: true,
  bank_enabled: true,
  qr_code_image: null,
  upi_id: null,
  bank_name: null,
  account_name: null,
  account_number: null,
  ifsc_code: null,
  how_it_works: [
    "After placing your order via WhatsApp, you'll receive payment details.",
    "For UPI payments, scan the QR code or use our UPI ID.",
    "For card payments, we'll send a secure payment link.",
    "Once payment is confirmed, your order will be processed immediately."
  ]
};

const Payment = () => {
  const { settings } = useSiteSettings();
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(defaultPaymentSettings);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setPaymentSettings({
          ...defaultPaymentSettings,
          ...data,
          how_it_works: data.how_it_works || defaultPaymentSettings.how_it_works
        });
      }
    } catch (err) {
      console.error('Error fetching payment settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const whatsappUrl = `https://wa.me/${settings?.whatsapp_number || ''}?text=${encodeURIComponent(
    "Hello! I would like to confirm my payment details."
  )}`;

  const paymentMethods = [
    {
      key: 'upi',
      icon: Smartphone,
      name: "UPI Payment",
      description: "Pay via any UPI app like Google Pay, PhonePe, or Paytm",
      color: "bg-purple-500/10 text-purple-600",
      enabled: paymentSettings.upi_enabled,
    },
    {
      key: 'card',
      icon: CreditCard,
      name: "Card Payment",
      description: "Credit/Debit cards accepted via secure payment link",
      color: "bg-blue-500/10 text-blue-600",
      enabled: paymentSettings.card_enabled,
    },
    {
      key: 'cod',
      icon: Banknote,
      name: "Cash on Delivery",
      description: "Pay in cash when your order is delivered",
      color: "bg-green-500/10 text-green-600",
      enabled: paymentSettings.cod_enabled,
    },
    {
      key: 'bank',
      icon: Building2,
      name: "Bank Transfer",
      description: "Direct bank transfer to our account",
      color: "bg-orange-500/10 text-orange-600",
      enabled: paymentSettings.bank_enabled,
    },
  ].filter(m => m.enabled);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-background py-14 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            {/* Page Header */}
            <div className="mb-12 text-center">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary animate-fade-in">
                <CreditCard className="h-4 w-4" />
                Secure Payments
              </span>
              <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                Payment Information
              </h1>
              <p className="text-muted-foreground text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                We offer multiple secure payment options for your convenience.
              </p>
            </div>

            {/* Payment Methods */}
            {paymentMethods.length > 0 && (
              <div className="mb-10 grid gap-4 sm:grid-cols-2">
                {paymentMethods.map((method, index) => (
                  <Card 
                    key={method.key} 
                    className="border-border card-hover opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                  >
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${method.color}`}>
                        <method.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{method.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* QR Code & UPI Section */}
            {paymentSettings.upi_enabled && (paymentSettings.qr_code_image || paymentSettings.upi_id) && (
              <Card className="mb-10 border-border animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                      <QrCode className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      Scan & Pay
                    </h3>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2 items-center">
                    {paymentSettings.qr_code_image && (
                      <div className="flex justify-center">
                        <div className="bg-white p-4 rounded-xl shadow-card">
                          <img 
                            src={paymentSettings.qr_code_image} 
                            alt="Payment QR Code" 
                            className="w-48 h-48 md:w-56 md:h-56 object-contain"
                          />
                        </div>
                      </div>
                    )}
                    
                    {paymentSettings.upi_id && (
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          Scan the QR code or use our UPI ID to make payment:
                        </p>
                        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                          <span className="font-mono font-semibold flex-1">{paymentSettings.upi_id}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(paymentSettings.upi_id!, 'upi')}
                          >
                            {copiedField === 'upi' ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bank Details Section */}
            {paymentSettings.bank_enabled && paymentSettings.bank_name && (
              <Card className="mb-10 border-border animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                      <Building2 className="h-5 w-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      Bank Transfer Details
                    </h3>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    {paymentSettings.bank_name && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Bank Name</p>
                        <p className="font-semibold">{paymentSettings.bank_name}</p>
                      </div>
                    )}
                    {paymentSettings.account_name && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Account Name</p>
                        <p className="font-semibold">{paymentSettings.account_name}</p>
                      </div>
                    )}
                    {paymentSettings.account_number && (
                      <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Account Number</p>
                          <p className="font-semibold font-mono">{paymentSettings.account_number}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(paymentSettings.account_number!, 'account')}
                        >
                          {copiedField === 'account' ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                    {paymentSettings.ifsc_code && (
                      <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">IFSC Code</p>
                          <p className="font-semibold font-mono">{paymentSettings.ifsc_code}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(paymentSettings.ifsc_code!, 'ifsc')}
                        >
                          {copiedField === 'ifsc' ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* How It Works */}
            {paymentSettings.how_it_works && paymentSettings.how_it_works.length > 0 && (
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
                  <ul className="space-y-4 text-muted-foreground">
                    {paymentSettings.how_it_works.map((text, i) => (
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
            )}

            {/* CTA */}
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <p className="mb-5 text-muted-foreground">
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
