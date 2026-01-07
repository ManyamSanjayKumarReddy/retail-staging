import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";

const WHATSAPP_NUMBER = "1234567890";

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    requirement: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "+1 234 567 890",
      href: "tel:+1234567890",
      color: "bg-blue-500/10 text-blue-600 group-hover:bg-blue-500 group-hover:text-white",
    },
    {
      icon: WhatsAppIcon,
      label: "WhatsApp",
      value: "Chat with us",
      href: `https://wa.me/${WHATSAPP_NUMBER}`,
      color: "bg-whatsapp/10 text-whatsapp group-hover:bg-whatsapp group-hover:text-white",
    },
    {
      icon: Mail,
      label: "Email",
      value: "contact@retailstore.com",
      href: "mailto:contact@retailstore.com",
      color: "bg-purple-500/10 text-purple-600 group-hover:bg-purple-500 group-hover:text-white",
    },
    {
      icon: MapPin,
      label: "Address",
      value: "123 Retail Street, City",
      href: "#",
      color: "bg-orange-500/10 text-orange-600 group-hover:bg-orange-500 group-hover:text-white",
    },
  ];

  return (
    <Layout>
      <section className="bg-background py-14 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            {/* Page Header */}
            <div className="mb-12 text-center">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary animate-fade-in">
                <MessageSquare className="h-4 w-4" />
                Get in Touch
              </span>
              <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                Contact Us
              </h1>
              <p className="text-foreground-secondary text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                Have a custom requirement? Get in touch and we'll make it happen.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-5">
              {/* Contact Info */}
              <div className="lg:col-span-2 space-y-4">
                {contactInfo.map((item, index) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group block opacity-0 animate-fade-in"
                    style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                  >
                    <Card className="border-border transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
                      <CardContent className="flex items-center gap-4 p-5">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${item.color}`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          <p className="font-semibold text-foreground">{item.value}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-3">
                <Card className="border-border animate-slide-in-right">
                  <CardContent className="p-6 md:p-8">
                    {isSubmitted ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-success/10 animate-scale-in">
                          <CheckCircle2 className="h-10 w-10 text-success" />
                        </div>
                        <h3 className="mb-2 text-2xl font-bold text-foreground">
                          Thank You!
                        </h3>
                        <p className="text-foreground-secondary max-w-sm">
                          We've received your request. Our team will contact you shortly.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-8 btn-press"
                          onClick={() => setIsSubmitted(false)}
                        >
                          Send Another Request
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                          <Send className="h-5 w-5 text-primary" />
                          <h3 className="text-xl font-bold text-foreground">
                            Custom Order Request
                          </h3>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="name" className="text-sm font-semibold">Name *</Label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              placeholder="Your name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="mt-2 h-12"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone" className="text-sm font-semibold">Phone *</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              placeholder="Your phone number"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              className="mt-2 h-12"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="email" className="text-sm font-semibold">Email (Optional)</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Your email address"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-2 h-12"
                          />
                        </div>

                        <div>
                          <Label htmlFor="requirement" className="text-sm font-semibold">Requirement *</Label>
                          <Textarea
                            id="requirement"
                            name="requirement"
                            placeholder="Describe your custom order requirement..."
                            value={formData.requirement}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="mt-2 resize-none"
                          />
                        </div>

                        <Button type="submit" size="lg" className="w-full btn-press group">
                          <Send className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          Submit Request
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
