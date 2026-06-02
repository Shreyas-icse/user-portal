import React from "react";
import { Search, MessageSquare, MapPin, CreditCard } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Search or Ask",
      description:
        "Use the voice AI assistant or search for a specific service you need",
      color: "bg-brand-blue-100 text-brand-blue-600",
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Get Matched",
      description:
        "We'll match you with nearby available service providers in real-time",
      color: "bg-brand-teal-100 text-brand-teal-600",
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Track Progress",
      description:
        "Track your provider's location and get updates on their arrival",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Pay Securely",
      description:
        "Pay after the job is completed through our secure payment system",
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <section className="py-12 md:py-24 bg-brand-blue-50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground">
            Finding and hiring service professionals has never been easier. Our platform connects you with nearby providers in just a few steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="relative mb-8">
                <div className={`${step.color} p-4 rounded-full`}>
                  {step.icon}
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-gray-200 -translate-y-1/2">
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 animate-pulse">
                      <div className="h-2 w-2 rounded-full bg-brand-blue-500"></div>
                    </div>
                  </div>
                )}

                <div className="absolute -top-4 -right-4 h-8 w-8 bg-white border-2 border-brand-blue-500 rounded-full flex items-center justify-center text-brand-blue-600 font-bold">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
