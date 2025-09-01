import { useEffect, useState } from "react";
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, Scan, BarChart3, Award, Briefcase, Clock, Shield, Calendar, 
  Send, CheckCircle, ChevronRight, RefreshCw, QrCode 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useBlockchain } from "@/context/BlockchainContext";
import QwixVaultProfile from "@/components/blockchain/QwixVaultProfile";
import type { Certificate } from '@/types/certification';
import type { BlockchainDocument, UserActivity } from '@/types/blockchain';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import CertificateCard from "@/components/certification/CertificateCard";

const Dashboard = () => {
  const { user } = useAuth();
  const { isConnected, account, getUserDocuments, getUserCertificates, getVaultUser } = useBlockchain();
  const [documents, setDocuments] = useState<BlockchainDocument[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [vaultUser, setVaultUser] = useState<any>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        
        if (isConnected) {
          const userDocuments = await getUserDocuments();
          setDocuments(userDocuments);
          
          const userCertificates = await getUserCertificates();
          setCertificates(userCertificates);
          
          const currentVaultUser = getVaultUser();
          setVaultUser(currentVaultUser);
        } else {
          setDocuments([]);
          setCertificates([]);
          setVaultUser(null);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [isConnected, getUserDocuments, getUserCertificates, getVaultUser]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      
      if (isConnected) {
        const userDocuments = await getUserDocuments();
        setDocuments(userDocuments);
        
        const userCertificates = await getUserCertificates();
        setCertificates(userCertificates);
        
        const currentVaultUser = getVaultUser();
        setVaultUser(currentVaultUser);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name || "User"}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh Data
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="documents">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="certificates">
                  <Award className="h-4 w-4 mr-2" />
                  Certificates
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Resume Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">78%</div>
                      <p className="text-xs text-muted-foreground mt-1">+12% from last update</p>
                      <Progress value={78} className="h-1.5 mt-2" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Blockchain Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{documents.length}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Verified & secured credentials
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Certificates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{certificates.length}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Blockchain-verified achievements
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your recent actions and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ActivityFeed activities={vaultUser?.activities || []} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks and actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Link to="/builder" className="group">
                        <div className="border rounded-lg p-4 transition-all hover:border-primary hover:bg-primary/5">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium group-hover:text-primary">Build Resume</h3>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                Create or edit your professional resume
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                          </div>
                        </div>
                      </Link>
                      
                      <Link to="/ats-scanner" className="group">
                        <div className="border rounded-lg p-4 transition-all hover:border-primary hover:bg-primary/5">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Scan className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium group-hover:text-primary">ATS Scanner</h3>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                Check resume compatibility with ATS
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                          </div>
                        </div>
                      </Link>
                      
                      <Link to="/job-board" className="group">
                        <div className="border rounded-lg p-4 transition-all hover:border-primary hover:bg-primary/5">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium group-hover:text-primary">Find Jobs</h3>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                Browse matching job opportunities
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                          </div>
                        </div>
                      </Link>
                      
                      <Link to="/certification-center" className="group">
                        <div className="border rounded-lg p-4 transition-all hover:border-primary hover:bg-primary/5">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Award className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium group-hover:text-primary">Get Certified</h3>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                Earn blockchain-verified certificates
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                          </div>
                        </div>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-primary" />
                        Blockchain Documents
                      </div>
                    </CardTitle>
                    <CardDescription>
                      Secure and verifiable documents stored on the blockchain
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {documents.length === 0 ? (
                      <div className="text-center py-10">
                        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No blockchain documents found</h3>
                        <p className="text-muted-foreground mb-6">
                          Secure your important documents on the blockchain for tamper-proof verification.
                        </p>
                        <Button asChild>
                          <Link to="/document-vault">
                            <FileText className="h-4 w-4 mr-2" />
                            Go to Document Vault
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {documents.map((doc) => (
                          <div key={doc.uniqueId} className="border rounded-lg overflow-hidden">
                            <div className="h-24 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                              <FileText className="h-12 w-12 text-slate-400" />
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium truncate">{doc.fileName}</h4>
                              <div className="text-xs text-muted-foreground mb-2">
                                {formatDate(doc.timestamp)}
                              </div>
                              <div className="flex justify-between">
                                <Badge variant="outline" className="truncate max-w-[100px]">
                                  {doc.fileType}
                                </Badge>
                                <Link to={`/verify-document/${doc.uniqueId}`} className="text-xs text-primary flex items-center">
                                  <QrCode className="h-3 w-3 mr-1" />
                                  Verify
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="certificates">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <div className="flex items-center">
                        <Award className="h-5 w-5 mr-2 text-primary" />
                        Blockchain Certificates
                      </div>
                    </CardTitle>
                    <CardDescription>
                      Your verifiable certificates and achievements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {certificates.length === 0 ? (
                      <div className="text-center py-10">
                        <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No certificates yet</h3>
                        <p className="text-muted-foreground mb-6">
                          Complete certification tests to earn verifiable credentials.
                        </p>
                        <Button asChild>
                          <Link to="/certification-center">
                            <Award className="h-4 w-4 mr-2" />
                            Explore Certification Tests
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {certificates.map((certificate) => (
                          <CertificateCard 
                            key={certificate.id} 
                            certificate={certificate}
                            onUpdateVisibility={() => {}} // Adding the missing prop with a no-op function
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-1">
            <QwixVaultProfile />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
