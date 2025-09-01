
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out the platform",
      features: [
        { text: "1 resume", included: true },
        { text: "Basic templates", included: true },
        { text: "Export to PDF", included: true },
        { text: "AI-powered suggestions", included: false },
        { text: "ATS optimization", included: false },
        { text: "Premium templates", included: false },
        { text: "Remove watermark", included: false },
        { text: "Priority support", included: false },
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Premium",
      price: "$12",
      period: "monthly",
      description: "Everything you need for job hunting",
      features: [
        { text: "Unlimited resumes", included: true },
        { text: "All templates", included: true },
        { text: "Export to PDF & DOCX", included: true },
        { text: "AI-powered suggestions", included: true },
        { text: "ATS optimization", included: true },
        { text: "Premium templates", included: true },
        { text: "Remove watermark", included: true },
        { text: "Priority support", included: true },
      ],
      cta: "Try Premium",
      popular: true,
    },
    {
      name: "Annual",
      price: "$96",
      period: "yearly",
      description: "Save 33% with annual billing",
      features: [
        { text: "Unlimited resumes", included: true },
        { text: "All templates", included: true },
        { text: "Export to PDF & DOCX", included: true },
        { text: "AI-powered suggestions", included: true },
        { text: "ATS optimization", included: true },
        { text: "Premium templates", included: true },
        { text: "Remove watermark", included: true },
        { text: "Priority support", included: true },
      ],
      cta: "Get Annual",
      popular: false,
    },
  ];

  return (
    <MainLayout>
      <div className="container py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Choose a plan that works for you. All plans include full access to our resume builder.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden relative flex flex-col ${
                plan.popular ? "ring-2 ring-primary" : ""
              }`}
            >
              {plan.popular && (
                <div className="bg-primary py-1 text-primary-foreground text-xs font-medium text-center">
                  Most Popular
                </div>
              )}
              <div className="p-6 flex-1">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline text-primary">
                  <span className="text-4xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="ml-1 text-xl font-semibold text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="mt-2 text-muted-foreground">{plan.description}</p>
                
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
                      )}
                      <span className={feature.included ? "" : "text-muted-foreground"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
                
              <div className="p-6 bg-muted/50">
                <Button 
                  asChild 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link to={plan.name === "Free" ? "/builder" : "/login"}>
                    {plan.cta}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto grid gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">Can I cancel my subscription?</h3>
              <p className="text-muted-foreground">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">How do the AI suggestions work?</h3>
              <p className="text-muted-foreground">Our AI analyzes your input and provides tailored suggestions for each section of your resume, optimized for your industry and target role.</p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground">We offer a 14-day money-back guarantee if you're not satisfied with your Premium subscription.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Pricing;
