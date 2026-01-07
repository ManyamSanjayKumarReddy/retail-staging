import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";

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
    // Simulate form submission (frontend only)
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

  return (
    <Layout>
      <section className="bg-background py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            {/* Page Header */}
            <div className="mb-10 text-center">
              <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Contact Us
              </h1>
              <p className="text-foreground-secondary">
                Have a custom requirement? Get in touch with us and we'll make
                it happen.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Contact Info */}
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <Card className="border-border">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <a
                          href="tel:+1234567890"
                          className="font-medium text-foreground hover:text-primary"
                        >
                          +1 234 567 890
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <a
                          href="mailto:contact@retailstore.com"
                          className="font-medium text-foreground hover:text-primary"
                        >
                          contact@retailstore.com
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium text-foreground">
                          123 Retail Street, City
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="border-border">
                  <CardContent className="p-6">
                    {isSubmitted ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                          <CheckCircle2 className="h-8 w-8 text-success" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-foreground">
                          Thank You!
                        </h3>
                        <p className="text-foreground-secondary">
                          We've received your request. Our team will contact you
                          shortly.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-6"
                          onClick={() => setIsSubmitted(false)}
                        >
                          Send Another Request
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <h3 className="text-lg font-semibold text-foreground">
                          Custom Order Request
                        </h3>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="name">Name *</Label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              placeholder="Your name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="mt-1.5"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone *</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              placeholder="Your phone number"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              className="mt-1.5"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="email">Email (Optional)</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Your email address"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1.5"
                          />
                        </div>

                        <div>
                          <Label htmlFor="requirement">Requirement *</Label>
                          <Textarea
                            id="requirement"
                            name="requirement"
                            placeholder="Describe your custom order requirement..."
                            value={formData.requirement}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="mt-1.5"
                          />
                        </div>

                        <Button type="submit" size="lg" className="w-full">
                          <Send className="mr-2 h-4 w-4" />
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
