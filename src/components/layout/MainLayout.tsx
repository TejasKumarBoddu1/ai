
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, Instagram, Twitter, Linkedin, Globe, Sparkles, 
  Award, Shield, User, MessageSquare, Briefcase, 
  GraduationCap, Route, BarChart, Code, Rocket, TrendingUp, 
  Star, ChevronDown, LogIn, LogOut, Menu, UserPlus
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import QwikZenLogo from "../ui/QwikZenLogo";
import { useState } from "react";
import WalletConnect from "@/components/blockchain/WalletConnect";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const productLinks = [
    { name: "Resume Builder", href: "/builder", icon: FileText },
    { name: "ATS Scanner", href: "/ats-scanner", icon: BarChart },
    { name: "LinkedIn Optimizer", href: "/linkedin-optimizer", icon: Linkedin },
    { name: "Compare Resumes", href: "/resume-compare", icon: FileText },
    { name: "QwiXCert", href: "/certification-center", icon: Shield },
    { name: "Job Board", href: "/job-board", icon: Briefcase },
  ];

  const careerGuideLinks = [
    { name: "Career Path Simulator", href: "/career-path-simulator", icon: Route },
    { name: "Interview Coach", href: "/interview-coach", icon: MessageSquare },
    { name: "AI Job Switch Planner", href: "/ai-job-switch-planner", icon: Sparkles },
    { name: "AI Shadow Career Simulator", href: "/ai-shadow-career-simulator", icon: Briefcase },
    { name: "Skill Gap Analysis", href: "/skill-gap-analysis", icon: BarChart },
    { name: "AI Layoff Readiness Toolkit", href: "/ai-layoff-readiness-toolkit", icon: Sparkles },
  ];

  const learnLinks = [
    { name: "AI Coding Coach", href: "/ai-coding-coach", icon: Code },
    { name: "QwiXPro Builder", href: "/qwixpro-builder", icon: Rocket },
    { name: "Skill Gap Analysis", href: "/skill-gap-analysis", icon: TrendingUp },
    { name: "Mindprint Assessment", href: "/mindprint-assessment", icon: Star },
  ];

  const companyLinks = [
    { name: "About", href: "/about", icon: User },
    { name: "Contact", href: "/contact", icon: MessageSquare },
  ];

  const socialLinks = [
    { icon: Instagram, name: "Instagram", href: "https://instagram.com/qwikzen_india" },
    { icon: Twitter, name: "Twitter", href: "https://twitter.com/dspraneeth07" },
    { icon: Linkedin, name: "LinkedIn", href: "https://www.linkedin.com/company/qwikzen" },
    { icon: Globe, name: "Website", href: "https://qwikzen.netlify.app" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-modern-blue-600 to-soft-purple text-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <QwikZenLogo variant="white" size="md" showText={true} />
          </div>
          
          {/* Desktop Navigation - Right Aligned */}
          <div className="hidden ml-auto md:flex items-center gap-4">
            {/* CV Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-white/90 hover:text-white hover:bg-white/10 p-1.5 h-auto px-2"
                >
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium text-sm">CV Tools</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuGroup>
                  {productLinks.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link 
                        to={item.href} 
                        className="cursor-pointer flex items-center gap-2"
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* QwiX Career Guide Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-white/90 hover:text-white hover:bg-white/10 p-1.5 h-auto px-2"
                >
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    <span className="font-medium text-sm">QwiX Career Guide</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuGroup>
                  {careerGuideLinks.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link 
                        to={item.href} 
                        className="cursor-pointer flex items-center gap-2"
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* QwiX Learn Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-white/90 hover:text-white hover:bg-white/10 p-1.5 h-auto px-2"
                >
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4" />
                    <span className="font-medium text-sm">QwiX Learn</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuGroup>
                  {learnLinks.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link 
                        to={item.href} 
                        className="cursor-pointer flex items-center gap-2"
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Company links */}
            {companyLinks.map((link) => (
              <Button asChild key={link.name} variant="ghost" className="text-white hover:bg-white/10">
                <Link to={link.href} className="flex items-center gap-2">
                  {link.icon && <link.icon className="h-4 w-4" />}
                  {link.name}
                </Link>
              </Button>
            ))}

            <WalletConnect />

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profilePicture || ''} alt={user.name || 'User'} />
                      <AvatarFallback>{getInitials(user.name || 'User')}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" className="text-white hover:bg-white/10">
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Log in
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/register">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign up
                  </Link>
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile Navigation */}
          <div className="ml-auto md:hidden flex items-center gap-2">
            {!isAuthenticated && (
              <Button asChild size="sm" variant="ghost" className="text-white">
                <Link to="/login">Log in</Link>
              </Button>
            )}
            
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[385px] bg-gradient-to-b from-modern-blue-600 to-soft-purple text-white">
                <div className="flex flex-col gap-6 pt-10">
                  {user && (
                    <div className="flex items-center gap-3 mb-6 px-2">
                      <Avatar className="h-10 w-10 border-2 border-white/20">
                        <AvatarImage src={user.profilePicture} alt={user.name || ''} />
                        <AvatarFallback className="bg-primary text-white">
                          {user.name ? getInitials(user.name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-white/70">{user.email}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-1 px-2">
                    <p className="text-sm font-semibold text-white/70 mb-2">CV TOOLS</p>
                    {productLinks.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon && <item.icon className="h-5 w-5" />}
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="space-y-1 px-2">
                    <p className="text-sm font-semibold text-white/70 mb-2">QWIX CAREER GUIDE</p>
                    {careerGuideLinks.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon && <item.icon className="h-5 w-5" />}
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  <div className="space-y-1 px-2">
                    <p className="text-sm font-semibold text-white/70 mb-2">QWIX LEARN</p>
                    {learnLinks.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon && <item.icon className="h-5 w-5" />}
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="space-y-1 px-2">
                    <p className="text-sm font-semibold text-white/70 mb-2">COMPANY</p>
                    {companyLinks.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon && <item.icon className="h-5 w-5" />}
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  
                  {isAuthenticated ? (
                    <div className="border-t border-white/20 pt-4 px-2 mt-auto">
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-6 mt-6 border-t border-white/20">
                      <Button asChild className="w-full">
                        <Link 
                          to="/register" 
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Sign up
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full mt-2 bg-transparent border-white text-white">
                        <Link 
                          to="/login" 
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <LogIn className="h-4 w-4 mr-2" />
                          Log in
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <main className="flex-1 bg-gradient-to-b from-gray-50 to-white">
        {children}
      </main>
      
      <footer className="bg-gradient-to-r from-modern-blue-700 to-modern-blue-900 text-white py-10 md:py-14">
        <div className="container grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Company description column */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              <span className="font-semibold font-sf-pro">QwiXEd360°Suite</span>
            </div>
            <p className="text-sm text-gray-300 font-poppins max-w-md">
              AI-powered career platform helping job seekers create professional resumes optimized for ATS systems, 
              gain certifications, and advance their career paths.
            </p>
          </div>
          
          {/* Footer links - balanced layout */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <p className="font-medium font-sf-pro">Product</p>
            <div className="grid grid-cols-2 gap-2">
              {productLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className="text-sm text-gray-300 hover:text-white font-poppins flex items-center gap-2"
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-4 flex flex-col gap-3">
            <p className="font-medium font-sf-pro">Career Guide</p>
            <div className="grid grid-cols-2 gap-2">
              {careerGuideLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className="text-sm text-gray-300 hover:text-white font-poppins flex items-center gap-2"
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Link>
              ))}
              {companyLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className="text-sm text-gray-300 hover:text-white font-poppins flex items-center gap-2"
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Social Media Links - Centered */}
        <div className="container mt-8 text-center">
          <p className="font-medium font-sf-pro mb-4">FOLLOW US</p>
          <div className="flex justify-center gap-6 mb-6">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a 
                  key={link.name}
                  href={link.href}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label={link.name}
                >
                  <Icon className="h-6 w-6" />
                </a>
              );
            })}
          </div>
        </div>
        
        <div className="container pt-8 border-t border-white/10">
          <p className="text-center text-sm text-gray-400 font-poppins">
            © {new Date().getFullYear()} QwiXEd360°Suite by QwikZen. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
