
import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QwikZenLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'white' | 'default';
}

const QwikZenLogo = ({ size = 'md', showText = true, variant = 'default' }: QwikZenLogoProps) => {
  const getIconSize = () => {
    switch(size) {
      case 'sm': return 'h-5 w-5';
      case 'lg': return 'h-8 w-8';
      default: return 'h-6 w-6';
    }
  };

  const getTextSize = () => {
    switch(size) {
      case 'sm': return 'text-base';
      case 'lg': return 'text-2xl';
      default: return 'text-lg';
    }
  };

  const textColor = variant === 'white' 
    ? 'text-white' 
    : 'bg-gradient-to-r from-modern-blue-500 to-soft-purple bg-clip-text text-transparent';

  const bgColor = variant === 'white'
    ? 'bg-transparent' 
    : 'bg-modern-blue-600';

  return (
    <Link to="/" className="flex items-center">
      <div className="flex items-center gap-2">
        <img 
          src="/lovable-uploads/3265058c-5d87-416e-8812-a23917ab06ab.png" 
          alt="QwikZen Logo" 
          className={`${getIconSize()}`}
        />
        
        {showText && (
          <div className="flex items-center gap-1.5">
            <div className={`flex items-center ${variant === 'white' ? '' : 'pl-1'}`}>
              <GraduationCap className={`${getIconSize()} ${variant === 'white' ? 'text-white' : 'text-modern-blue-600'} mr-1`} />
              <span className={`${getTextSize()} font-bold ${textColor} font-sf-pro`}>
                QwiXEd360°Suite
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default QwikZenLogo;
