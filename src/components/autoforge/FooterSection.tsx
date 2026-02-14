'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  FooterProps,
  FooterLink,
  FooterLinkGroup,
  SocialLink,
  footerLinkDefaults,
} from './types';

// =============================================================================
// Social Media Icons (inline SVGs for zero dependencies)
// =============================================================================

const socialIcons: Record<string, React.ReactNode> = {
  twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  facebook: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
    </svg>
  ),
  github: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  ),
  youtube: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
    </svg>
  ),
  tiktok: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  discord: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
    </svg>
  ),
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get the icon for a social platform
 */
function getSocialIcon(platform: string): React.ReactNode {
  const normalizedPlatform = platform.toLowerCase().replace(/\s+/g, '');
  return socialIcons[normalizedPlatform] || (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}

/**
 * Group flat links by their category
 */
function groupLinksByCategory(links: FooterLink[]): FooterLinkGroup[] {
  const groups = new Map<string, FooterLink[]>();
  
  links.forEach((link) => {
    const category = link.category || 'Links';
    const existing = groups.get(category) || [];
    groups.set(category, [...existing, link]);
  });
  
  return Array.from(groups.entries()).map(([title, groupLinks]) => ({
    title,
    links: groupLinks,
  }));
}

/**
 * Get current year for copyright
 */
function getCurrentYear(): number {
  return new Date().getFullYear();
}

// =============================================================================
// Sub-Components
// =============================================================================

interface FooterLinkItemProps {
  link: FooterLink;
}

/**
 * Individual footer link item
 */
function FooterLinkItem({ link }: FooterLinkItemProps) {
  const label = link.label || footerLinkDefaults.label;
  const href = link.href || footerLinkDefaults.href;
  const isExternal = link.external || footerLinkDefaults.external;

  const linkProps = isExternal
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <li>
      <Link
        href={href}
        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200 text-sm"
        {...linkProps}
      >
        {label}
        {isExternal && (
          <span className="sr-only"> (opens in new tab)</span>
        )}
      </Link>
    </li>
  );
}

interface FooterColumnProps {
  group: FooterLinkGroup;
}

/**
 * Footer column with category title and links
 */
function FooterColumn({ group }: FooterColumnProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
        {group.title}
      </h3>
      <ul className="space-y-3">
        {group.links.map((link, index) => (
          <FooterLinkItem key={link.id || `${group.title}-link-${index}`} link={link} />
        ))}
      </ul>
    </div>
  );
}

interface SocialLinksRowProps {
  socialLinks: SocialLink[];
}

/**
 * Row of social media icon links
 */
function SocialLinksRow({ socialLinks }: SocialLinksRowProps) {
  if (socialLinks.length === 0) return null;

  return (
    <div className="flex space-x-6">
      {socialLinks.map((social, index) => (
        <a
          key={`social-${social.platform}-${index}`}
          href={social.href}
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Follow us on ${social.platform}`}
        >
          {getSocialIcon(social.platform)}
        </a>
      ))}
    </div>
  );
}

interface NewsletterFormProps {
  heading?: string;
  placeholder?: string;
}

/**
 * Newsletter signup form
 */
function NewsletterForm({
  heading = 'Subscribe to our newsletter',
  placeholder = 'Enter your email',
}: NewsletterFormProps) {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    // Simulate API call - replace with actual newsletter signup logic
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <div className="lg:max-w-md">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
        {heading}
      </h3>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          disabled={status === 'loading'}
          className="flex-1 min-w-0 px-4 py-2 text-sm text-gray-900 placeholder-gray-500 bg-white dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {status === 'success' && (
        <p className="mt-2 text-sm text-green-600 dark:text-green-400">
          Thanks for subscribing!
        </p>
      )}
      {status === 'error' && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export interface FooterSectionProps extends FooterProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * FooterSection - A responsive multi-column footer component
 * 
 * Features:
 * - Multi-column link layout grouped by category
 * - Responsive grid (stacks on mobile, expands on desktop)
 * - Dynamic copyright text with current year
 * - Optional social media icons row
 * - Optional newsletter signup form
 * - Dark mode support
 * - Accessible with proper ARIA labels
 * 
 * @example
 * ```tsx
 * <FooterSection
 *   brandName="Acme Inc"
 *   links={[
 *     { label: 'About', href: '/about', category: 'Company' },
 *     { label: 'Careers', href: '/careers', category: 'Company' },
 *     { label: 'Blog', href: '/blog', category: 'Resources' },
 *     { label: 'Docs', href: '/docs', category: 'Resources' },
 *   ]}
 *   socialLinks={[
 *     { platform: 'twitter', href: 'https://twitter.com/acme' },
 *     { platform: 'github', href: 'https://github.com/acme' },
 *   ]}
 * />
 * ```
 */
export default function FooterSection({
  brandName,
  logoUrl,
  copyright,
  linkGroups,
  links,
  socialLinks = [],
  showNewsletter = false,
  newsletterHeading,
  newsletterPlaceholder,
  className = '',
}: FooterSectionProps) {
  // Memoize link groups to avoid recalculating on every render
  const resolvedLinkGroups = useMemo(() => {
    // Prefer linkGroups if provided, otherwise group flat links
    if (linkGroups && linkGroups.length > 0) {
      return linkGroups;
    }
    if (links && links.length > 0) {
      return groupLinksByCategory(links);
    }
    return [];
  }, [linkGroups, links]);

  const currentYear = getCurrentYear();
  const copyrightText = copyright || `© ${currentYear} ${brandName || 'Company'}. All rights reserved.`;

  return (
    <footer
      className={`bg-gray-50 dark:bg-gray-900 ${className}`}
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main footer content */}
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand section */}
          <div className="space-y-8">
            {logoUrl ? (
              <Link href="/" className="inline-block">
                <img
                  src={logoUrl}
                  alt={brandName || 'Logo'}
                  className="h-8 w-auto"
                />
              </Link>
            ) : brandName ? (
              <Link
                href="/"
                className="text-xl font-bold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {brandName}
              </Link>
            ) : null}
            
            {/* Social links */}
            {socialLinks.length > 0 && (
              <SocialLinksRow socialLinks={socialLinks} />
            )}
          </div>

          {/* Link columns */}
          {resolvedLinkGroups.length > 0 && (
            <div className="mt-12 xl:mt-0 xl:col-span-2">
              <div
                className={`grid gap-8 ${
                  resolvedLinkGroups.length === 1
                    ? 'grid-cols-1'
                    : resolvedLinkGroups.length === 2
                    ? 'grid-cols-2'
                    : resolvedLinkGroups.length === 3
                    ? 'grid-cols-2 md:grid-cols-3'
                    : 'grid-cols-2 md:grid-cols-4'
                }`}
              >
                {resolvedLinkGroups.map((group, index) => (
                  <FooterColumn
                    key={group.title || `group-${index}`}
                    group={group}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Newsletter section */}
        {showNewsletter && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <NewsletterForm
              heading={newsletterHeading}
              placeholder={newsletterPlaceholder}
            />
          </div>
        )}

        {/* Bottom bar with copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
            {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}

// =============================================================================
// Named Export for Flexibility
// =============================================================================

export { FooterSection };
