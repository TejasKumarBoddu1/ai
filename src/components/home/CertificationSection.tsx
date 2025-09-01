
import React from 'react';
import { Shield, Award, CheckCircle, ExternalLink, Lock, Hash, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CertificationSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-gray-900">
            QwiXCert Blockchain Certifications
          </h2>
          <p className="text-lg text-gray-700">
            Earn verifiable, tamper-proof credentials that showcase your skills to employers
            with our cutting-edge blockchain certification platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-blue-100 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Verifiable Credentials</h3>
                  <p className="text-gray-600">
                    Every certification is recorded on the Polygon blockchain, making it 
                    instantly verifiable by employers and recruiters.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-blue-100 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Tamper-Proof Security</h3>
                  <p className="text-gray-600">
                    Blockchain technology ensures your credentials can never be altered or 
                    falsified, maintaining the integrity of your achievements.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-blue-100 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                  <Hash className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Shareable Proof</h3>
                  <p className="text-gray-600">
                    Share your credentials via URL or QR code, letting anyone verify
                    your skills independently without third-party confirmation.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-blue-100 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Resume Integration</h3>
                  <p className="text-gray-600">
                    Seamlessly add your blockchain certifications to your QwiX CV resume,
                    enhancing your credentials with verifiable proof of skills.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/certification-center">
                  Explore Certifications <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/verify-cert">
                  Verify a Certificate <CheckCircle className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-20"></div>
              <Card className="relative border-2 border-blue-100 shadow-xl">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        <span className="font-bold">QwiXCertChain</span>
                      </div>
                      <Badge variant="outline" className="text-white border-white/40 bg-white/10">
                        VERIFIED
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-1">Web3 & Blockchain Fundamentals</h3>
                    <p className="text-sm opacity-80 mb-3">Awarded to John Doe</p>
                    <div className="flex justify-between items-end text-sm">
                      <div>
                        <p className="opacity-70">Issued by</p>
                        <p className="font-medium">QwikZen</p>
                      </div>
                      <div>
                        <p className="opacity-70">Issue Date</p>
                        <p className="font-medium">April 11, 2025</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Certificate ID</p>
                      <p className="text-sm font-mono">QWIXCERT-l5b2k3-A7F9R</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Blockchain</p>
                      <p className="text-sm">Polygon PoS Chain</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <img 
                      src="data:image/png;base64,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"
                      alt="QR Code"
                      className="h-24 w-24 border rounded-md"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Web3 & Blockchain",
              count: 8,
              icon: Hash,
              color: "blue"
            },
            {
              title: "Software Development",
              count: 12,
              icon: CheckCircle,
              color: "purple"
            },
            {
              title: "Career & Leadership",
              count: 5,
              icon: Award,
              color: "green"
            }
          ].map((category, idx) => (
            <Card key={idx} className={`border-${category.color}-100 hover:border-${category.color}-300 transition-colors`}>
              <CardContent className="p-6">
                <div className={`bg-${category.color}-100 p-2.5 rounded-full inline-flex mb-4`}>
                  <category.icon className={`h-5 w-5 text-${category.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-4">
                  {category.count} certifications available
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/certification-center">
                    View Certificates
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationSection;
