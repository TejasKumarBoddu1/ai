
import { Github, Linkedin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SocialLinksProps = {
  githubUrl: string;
  linkedinUrl: string;
  onChange: (key: string, value: string) => void;
};

const SocialLinks = ({ githubUrl, linkedinUrl, onChange }: SocialLinksProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="githubUrl">
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              <span>GitHub Profile URL</span>
            </div>
          </Label>
          <Input
            id="githubUrl"
            placeholder="https://github.com/username"
            value={githubUrl}
            onChange={(e) => onChange("githubUrl", e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">
            <div className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn Profile URL</span>
            </div>
          </Label>
          <Input
            id="linkedinUrl"
            placeholder="https://linkedin.com/in/username"
            value={linkedinUrl}
            onChange={(e) => onChange("linkedinUrl", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;
