
import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'default' | 'white';
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ variant = 'default', size = 'md' }: LogoProps) => {
  const getIconSize = () => {
    switch(size) {
      case 'sm': return 'h-5 w-5';
      case 'lg': return 'h-8 w-8';
      default: return 'h-6 w-6';
    }
  };
  
  const getTextSize = () => {
    switch(size) {
      case 'sm': return 'text-lg';
      case 'lg': return 'text-3xl';
      default: return 'text-xl';
    }
  };

  return (
    <Link
      to="/"
      className="flex items-center gap-2"
    >
      <GraduationCap className={`${getIconSize()} ${variant === 'white' ? 'text-white' : 'text-primary'}`} />
      <span className={`${getTextSize()} font-bold font-sf-pro tracking-tight ${
        variant === 'white' 
          ? 'text-white'
          : 'bg-clip-text text-transparent bg-gradient-to-r from-modern-blue-600 to-soft-purple'
      }`}>
        QwiXEd360°Suite
      </span>
    </Link>
  );
};

export default Logo;
