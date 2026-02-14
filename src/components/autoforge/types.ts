/**
 * Landing Page TypeScript Interfaces
 * 
 * Production-ready type definitions for landing page components.
 * All props are optional with sensible defaults documented.
 */

// =============================================================================
// Hero Section
// =============================================================================

/**
 * Props for the Hero section component
 */
export interface HeroProps {
  /** Main headline text. Default: "Welcome" */
  headline?: string;
  /** Supporting subheadline text. Default: "" */
  subheadline?: string;
  /** Call-to-action button text. Default: "Get Started" */
  ctaText?: string;
  /** Call-to-action link URL. Default: "#" */
  ctaLink?: string;
  /** Optional background image URL */
  backgroundImage?: string;
  /** Optional secondary CTA text */
  secondaryCtaText?: string;
  /** Optional secondary CTA link */
  secondaryCtaLink?: string;
  /** Text alignment. Default: "center" */
  alignment?: 'left' | 'center' | 'right';
  /** Whether to show an overlay on background image. Default: true */
  showOverlay?: boolean;
}

/**
 * Default values for HeroProps
 */
export const heroDefaults: Required<Pick<HeroProps, 'headline' | 'ctaText' | 'ctaLink' | 'alignment' | 'showOverlay'>> = {
  headline: 'Welcome',
  ctaText: 'Get Started',
  ctaLink: '#',
  alignment: 'center',
  showOverlay: true,
};

// =============================================================================
// Features Section
// =============================================================================

/**
 * Individual feature item
 */
export interface FeatureItem {
  /** Unique identifier for the feature */
  id?: string;
  /** Icon name or component (e.g., Lucide icon name). Default: "star" */
  icon?: string;
  /** Feature title. Default: "Feature" */
  title?: string;
  /** Feature description text. Default: "" */
  description?: string;
  /** Optional link URL for the feature */
  link?: string;
  /** Optional link text. Default: "Learn more" */
  linkText?: string;
}

/**
 * Props for the Features section component
 */
export interface FeaturesProps {
  /** Section heading. Default: "Features" */
  heading?: string;
  /** Section subheading */
  subheading?: string;
  /** Array of feature items */
  items?: FeatureItem[];
  /** Layout columns. Default: 3 */
  columns?: 2 | 3 | 4;
}

/**
 * Default values for FeatureItem
 */
export const featureItemDefaults: Required<Pick<FeatureItem, 'icon' | 'title' | 'linkText'>> = {
  icon: 'star',
  title: 'Feature',
  linkText: 'Learn more',
};

// =============================================================================
// Testimonials Section
// =============================================================================

/**
 * Individual testimonial item
 */
export interface TestimonialItem {
  /** Unique identifier for the testimonial */
  id?: string;
  /** Testimonial quote text. Default: "" */
  quote?: string;
  /** Author's name. Default: "Anonymous" */
  author?: string;
  /** Author's role or title. Default: "" */
  role?: string;
  /** Author's company */
  company?: string;
  /** Avatar image URL */
  avatar?: string;
  /** Rating out of 5 */
  rating?: 1 | 2 | 3 | 4 | 5;
}

/**
 * Props for the Testimonials section component
 */
export interface TestimonialsProps {
  /** Section heading. Default: "What Our Customers Say" */
  heading?: string;
  /** Section subheading */
  subheading?: string;
  /** Array of testimonial items */
  items?: TestimonialItem[];
  /** Display style. Default: "carousel" */
  variant?: 'carousel' | 'grid' | 'single';
  /** Show rating stars. Default: true */
  showRating?: boolean;
}

/**
 * Default values for TestimonialItem
 */
export const testimonialItemDefaults: Required<Pick<TestimonialItem, 'author'>> = {
  author: 'Anonymous',
};

// =============================================================================
// Footer Section
// =============================================================================

/**
 * Individual footer link item
 */
export interface FooterLink {
  /** Unique identifier for the link */
  id?: string;
  /** Link display text. Default: "Link" */
  label?: string;
  /** Link URL. Default: "#" */
  href?: string;
  /** Category/group name for organizing links */
  category?: string;
  /** Whether link opens in new tab. Default: false */
  external?: boolean;
  /** Icon to display with link */
  icon?: string;
}

/**
 * Footer link group/category
 */
export interface FooterLinkGroup {
  /** Group title */
  title: string;
  /** Links in this group */
  links: FooterLink[];
}

/**
 * Social media link
 */
export interface SocialLink {
  /** Platform name (e.g., "twitter", "github") */
  platform: string;
  /** Profile URL */
  href: string;
  /** Optional custom icon */
  icon?: string;
}

/**
 * Props for the Footer component
 */
export interface FooterProps {
  /** Company/brand name */
  brandName?: string;
  /** Brand logo URL */
  logoUrl?: string;
  /** Copyright text */
  copyright?: string;
  /** Organized link groups */
  linkGroups?: FooterLinkGroup[];
  /** Flat list of links (alternative to linkGroups) */
  links?: FooterLink[];
  /** Social media links */
  socialLinks?: SocialLink[];
  /** Newsletter signup enabled. Default: false */
  showNewsletter?: boolean;
  /** Newsletter heading */
  newsletterHeading?: string;
  /** Newsletter placeholder text */
  newsletterPlaceholder?: string;
}

/**
 * Default values for FooterLink
 */
export const footerLinkDefaults: Required<Pick<FooterLink, 'label' | 'href' | 'external'>> = {
  label: 'Link',
  href: '#',
  external: false,
};

// =============================================================================
// Landing Page (Combined)
// =============================================================================

/**
 * Complete landing page props combining all sections
 */
export interface LandingPageProps {
  /** Hero section props */
  hero?: HeroProps;
  /** Features section props */
  features?: FeaturesProps;
  /** Testimonials section props */
  testimonials?: TestimonialsProps;
  /** Footer props */
  footer?: FooterProps;
  /** Page metadata */
  meta?: PageMeta;
}

/**
 * Page metadata for SEO
 */
export interface PageMeta {
  /** Page title */
  title?: string;
  /** Meta description */
  description?: string;
  /** Open Graph image URL */
  ogImage?: string;
  /** Canonical URL */
  canonicalUrl?: string;
  /** Additional keywords */
  keywords?: string[];
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Make all properties in T optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Extract required properties from an interface
 */
export type RequiredProps<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

/**
 * Props with className support (for Tailwind)
 */
export interface WithClassName {
  className?: string;
}

/**
 * Props with children support
 */
export interface WithChildren {
  children?: React.ReactNode;
}

/**
 * Combined base props for components
 */
export type BaseComponentProps = WithClassName & WithChildren;
