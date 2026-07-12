import { Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe, MessageCircle, Share2, Users, Code, Send } from 'lucide-react';
import { useState } from 'react';

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'FAQ', href: '#faq' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Contact', href: '#contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
};

const socialLinks = [
  { icon: MessageCircle, href: '#' },
  { icon: Share2, href: '#' },
  { icon: Users, href: '#' },
  { icon: Globe, href: '#' },
  { icon: Code, href: '#' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative border-t bg-background/50 backdrop-blur-xl overflow-hidden pt-16 pb-8">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Logo size="lg" />
            </Link>
            <p className="text-muted-foreground max-w-sm">
              The intelligent AI learning ecosystem empowering students, teachers, and institutions to achieve their full potential.
            </p>
            
            <div className="space-y-3 pt-4">
              <h4 className="font-semibold text-sm">Subscribe to our newsletter</h4>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                  required
                />
                <Button type="submit" variant="gradient" size="icon" disabled={subscribed}>
                  {subscribed ? <span className="text-xs">✓</span> : <Send className="h-4 w-4" />}
                </Button>
              </form>
              {subscribed && <p className="text-xs text-success animate-fade-in">Thanks for subscribing!</p>}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-6">Product</h4>
            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Legal</h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EduSphere AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social, idx) => {
              const Icon = social.icon;
              return (
                <a
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
