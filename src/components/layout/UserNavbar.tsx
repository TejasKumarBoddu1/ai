import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Menu, ChevronDown, User, Settings, LogOut, BarChart, Award, Sparkles, Briefcase, Shield, LucideIcon, GraduationCap, MessageSquare, Book, TrendingUp, Star, Linkedin, Code, Rocket, Route } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import QwikZenLogo from "../ui/QwikZenLogo";

interface NavLinkProps {
  href: string;
  icon?: LucideIcon;
  label: string;
}

const NavLink = ({ href, icon: Icon, label }: NavLinkProps) => {
  return (
    <Link
      to={href}
      className="text-sm font-medium text-white/90 transition-colors hover:text-white font-poppins flex items-center gap-1.5"
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{label}</span>
    </Link>
  );
};

interface NavDropdownProps {
  label: string;
  icon?: LucideIcon;
  items: { name: string; href: string; icon?: LucideIcon }[];
}

const NavDropdown = ({ label, icon: Icon, items }: NavDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-white/90 hover:text-white hover:bg-white/10 p-1.5 h-auto px-2"
        >
          <div className="flex items-center gap-1.5">
            {Icon && <Icon className="h-4 w-4" />}
            <span className="font-medium text-sm">{label}</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-48">
        <DropdownMenuGroup>
          {items.map((item) => (
            <DropdownMenuItem key={item.name} asChild>
              <Link 
                to={item.href} 
                className="cursor-pointer flex items-center gap-2 hover:bg-accent"
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const UserNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // CV Tools dropdown items
  const cvTools = [
    { name: "Resume Builder", href: "/builder", icon: FileText },
    { name: "ATS Scanner", href: "/ats-scanner", icon: BarChart },
    { name: "LinkedIn Optimizer", href: "/linkedin-optimizer", icon: Linkedin },
    { name: "Compare Resumes", href: "/resume-compare", icon: FileText },
  ];
  
  // QwiX Career Guide dropdown items
  const careerGuideTools = [
    { name: "Career Path Simulator", href: "/career-path-simulator", icon: Route },
    { name: "Interview Coach", href: "/interview-coach", icon: MessageSquare },
    { name: "AI Job Switch Planner", href: "/ai-job-switch-planner", icon: Sparkles },
    { name: "AI Shadow Career Simulator", href: "/ai-shadow-career-simulator", icon: Briefcase },
    { name: "Skill Gap Analysis", href: "/skill-gap-analysis", icon: BarChart },
    { name: "AI Layoff Readiness Toolkit", href: "/ai-layoff-readiness-toolkit", icon: Sparkles },
  ];

  // QwiX Learn dropdown items
  const learnTools = [
    { name: "AI Coding Coach", href: "/ai-coding-coach", icon: Code },
    { name: "QwiXPro Builder", href: "/qwixpro-builder", icon: Rocket },
    { name: "Skill Gap Analysis", href: "/skill-gap-analysis", icon: TrendingUp },
    { name: "Mindprint Assessment", href: "/mindprint-assessment", icon: Star },
  ];

  return (
    <header className="border-b bg-gradient-to-r from-modern-blue-600 to-soft-purple text-white sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <QwikZenLogo variant="white" size="md" showText={true} />
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <NavDropdown 
            label="CV Tools" 
            icon={FileText} 
            items={cvTools}
          />
          
          <NavDropdown 
            label="QwiX Career Guide" 
            icon={Briefcase} 
            items={careerGuideTools}
          />

          <NavDropdown 
            label="QwiX Learn" 
            icon={Book} 
            items={learnTools}
          />
          
          <NavLink 
            href="/certification-center" 
            icon={Award} 
            label="QwiXCert"
          />
          
          <NavLink 
            href="/job-board" 
            label="Job Board"
          />
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-9 w-9 border-2 border-white/20">
                  <AvatarImage src={user?.profilePicture} alt={user?.name || ''} />
                  <AvatarFallback className="bg-primary">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">
                    <BarChart className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center">
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
                  {cvTools.map((item) => (
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
                  {careerGuideTools.map((item) => (
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
                  {learnTools.map((item) => (
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
                  <p className="text-sm font-semibold text-white/70 mb-2">NAVIGATION</p>
                  <Link
                    to="/certification-center"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Award className="h-5 w-5" />
                    QwiXCert
                  </Link>
                  <Link
                    to="/job-board"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Briefcase className="h-5 w-5" />
                    Job Board
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BarChart className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>
                  <Link
                    to="/about"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white/90 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                </div>
                
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
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default UserNavbar;
