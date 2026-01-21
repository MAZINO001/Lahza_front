import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandTwitter,
} from "@tabler/icons-react";
import { Mail, Phone, MapPin, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="max-w-full px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="https://lahza.ma/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              About LAHZA
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Help Center
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-full px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          <div className="text-xs text-muted-foreground">
            <span>©2026 </span>
            <a
              href="https://lahza.ma/"
              className="text-foreground hover:text-muted-foreground font-medium transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              LAHZA Agency
            </a>
            <span className="text-muted-foreground">
              . Business Management Platform
            </span>
          </div>

          {/* Contact Info & Social Icons */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail size={12} />
                <a
                  href="mailto:contact@lahza.ma"
                  className="hover:text-foreground transition-colors"
                >
                  contact@lahza.ma
                </a>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={12} />
                <a
                  href="https://www.google.com/maps/place/LAHZA+Marketing+Digital+Agency+:+Agence+Marketing+Certifi%C3%A9e+%7C+Agence+Web+%7C+Agence+SEO+%7C+Cr%C3%A9ation+des+Site+Web+Au+Maroc/@35.7727638,-5.8007398,17z/data=!3m1!4b1!4m6!3m5!1s0xd0c78bb49e888dd:0x1f04737bfa365e2b!8m2!3d35.7727638!4d-5.8007398!16s%2Fg%2F11dzts8jd5?entry=ttu&g_ep=EgoyMDI6MDExMy4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Tangier, Morocco
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/agencelahza/"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://www.linkedin.com/company/lahza-hm/posts/?feedView=all"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandFacebook size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
