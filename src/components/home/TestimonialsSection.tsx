
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Emily Johnson",
    position: "Marketing Manager",
    company: "Digital Innovations",
    image: "/placeholder.svg",
    text: "SmartResume helped me land my dream job! The AI suggestions made my experience sound more professional, and I got 3 interviews within a week of updating my resume.",
  },
  {
    name: "David Chen",
    position: "Software Engineer",
    company: "Tech Solutions",
    image: "/placeholder.svg",
    text: "The ATS optimization feature is a game-changer. After struggling to hear back from companies, my new resume started getting responses almost immediately.",
  },
  {
    name: "Sarah Williams",
    position: "Financial Analyst",
    company: "Global Finance",
    image: "/placeholder.svg",
    text: "As someone who struggled with formatting, the templates were a lifesaver. Professional-looking and easily customizable. Highly recommend for anyone in finance.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Success stories from our users
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Real results from job seekers who used SmartResume to transform their job search
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border bg-card hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <svg height="24" width="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="fill-primary">
                    <path d="M14,24H6c-1.1,0-2-0.9-2-2V14c0-1.1,0.9-2,2-2h8c1.1,0,2,0.9,2,2v8C16,23.1,15.1,24,14,24z"></path>
                    <path d="M14,38H6c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h8c1.1,0,2,0.9,2,2v8C16,37.1,15.1,38,14,38z"></path>
                    <path d="M42,24h-8c-1.1,0-2-0.9-2-2V14c0-1.1,0.9-2,2-2h8c1.1,0,2,0.9,2,2v8C44,23.1,43.1,24,42,24z"></path>
                    <path d="M42,38h-8c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h8c1.1,0,2,0.9,2,2v8C44,37.1,43.1,38,42,38z"></path>
                  </svg>
                </div>
                <p className="text-muted-foreground mb-6">{testimonial.text}</p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.position}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
