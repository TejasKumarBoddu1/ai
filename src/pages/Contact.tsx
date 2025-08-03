
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, MessageSquare, Globe } from "lucide-react";

const Contact = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-b from-modern-blue-600 to-soft-purple text-white">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute w-20 h-20 rounded-full bg-white/30 blur-xl top-1/4 left-1/4 animate-pulse"></div>
          <div className="absolute w-32 h-32 rounded-full bg-white/20 blur-xl top-2/3 left-2/3 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 px-6 py-1 bg-white/20 text-white hover:bg-white/30">Contact Us</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h1>
            <p className="text-lg text-white/90 mb-8">
              Have questions or want to learn more about QwiXEd360°Suite? Our team is here to help you navigate your career journey.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/10 to-transparent"></div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div 
              className="rounded-xl overflow-hidden"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-8 border-2 border-modern-blue-100 shadow-lg">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Send Us a Message</h2>
                  <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
                </div>
                
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter your first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter your last name" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="What is this regarding?" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Your message..." className="min-h-[150px]" />
                  </div>
                  
                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="flex flex-col justify-between"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Connect With Us</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-modern-blue-100 mr-4">
                      <Mail className="h-5 w-5 text-modern-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <p className="text-gray-600 mb-1">For general inquiries:</p>
                      <a href="mailto:info@qwikzen.com" className="text-modern-blue-600 hover:underline">info@qwikzen.com</a>
                      <p className="text-gray-600 mt-2 mb-1">For support:</p>
                      <a href="mailto:support@qwikzen.com" className="text-modern-blue-600 hover:underline">support@qwikzen.com</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-modern-blue-100 mr-4">
                      <Phone className="h-5 w-5 text-modern-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Phone</h3>
                      <p className="text-gray-600 mb-1">Customer Service:</p>
                      <a href="tel:+1234567890" className="text-modern-blue-600 hover:underline">+1 (234) 567-890</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-modern-blue-100 mr-4">
                      <MapPin className="h-5 w-5 text-modern-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Location</h3>
                      <p className="text-gray-600">
                        QwikZen Headquarters<br />
                        123 Innovation Street<br />
                        Tech Hub, CA 94103<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <Card className="overflow-hidden border-0 shadow-lg">
                  <div className="p-6 bg-gradient-to-r from-modern-blue-600 to-soft-purple text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <Globe className="h-6 w-6" />
                      <h3 className="text-xl font-bold">Follow Us</h3>
                    </div>
                    <p className="mb-4 text-white/90">
                      Stay connected with QwiXEd360°Suite for the latest updates, career tips, and technology insights.
                    </p>
                    <div className="flex space-x-4">
                      <a 
                        href="#" 
                        className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                        aria-label="Twitter"
                      >
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                      <a 
                        href="#" 
                        className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                        aria-label="LinkedIn"
                      >
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                      <a 
                        href="#" 
                        className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                        aria-label="Instagram"
                      >
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                        </svg>
                      </a>
                      <a 
                        href="#" 
                        className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                        aria-label="GitHub"
                      >
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Find answers to the most common questions about QwiXEd360°Suite and our services.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {[
                {
                  q: "What is QwiXEd360°Suite?",
                  a: "QwiXEd360°Suite is a comprehensive career development platform that offers AI-powered tools for resume building, interview preparation, career path simulation, certification, and more."
                },
                {
                  q: "Is QwiXEd360°Suite free to use?",
                  a: "We offer both free and premium features. Our basic resume builder and ATS scanner are available in free tier, while advanced features require a subscription. Check our pricing page for more details."
                },
                {
                  q: "How does the blockchain certification work?",
                  a: "Our QwiXCert system issues tamper-proof certificates stored on blockchain. These certificates can be instantly verified by employers and institutions without requiring third-party verification."
                },
                {
                  q: "Can I use QwiXEd360°Suite on mobile devices?",
                  a: "Yes, QwiXEd360°Suite is fully responsive and works seamlessly across desktop, tablet, and mobile devices."
                },
              ].map((item, index) => (
                <Card key={index} className="border border-gray-200">
                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-2">{item.q}</h3>
                    <p className="text-gray-600">{item.a}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

    </MainLayout>
  );
};

export default Contact;
