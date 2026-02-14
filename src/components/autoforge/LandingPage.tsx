'use client';

import React, { useEffect } from 'react';
import { HeroSection } from './HeroSection';
import { FeaturesGrid } from './FeaturesGrid';
import { TestimonialsCarousel } from './TestimonialsCarousel';
import FooterSection from './FooterSection';
import type {
  LandingPageProps,
  HeroProps,
  FeaturesProps,
  TestimonialsProps,
  FooterProps,
  WithClassName,
} from './types';

// =============================================================================
// Types
// =============================================================================

/**
 * Extended props for the LandingPage component
 */
export interface LandingPageComponentProps extends LandingPageProps, WithClassName {
  /** Section IDs for navigation/anchor linking */
  sectionIds?: {
    hero?: string;
    features?: string;
    testimonials?: string;
    footer?: string;
  };
  /** Enable smooth scroll behavior. Default: true */
  smoothScroll?: boolean;
  /** Show section dividers between sections. Default: false */
  showDividers?: boolean;
  /** Custom divider component */
  dividerComponent?: React.ReactNode;
  /** Callback when page mounts */
  onMount?: () => void;
}

// =============================================================================
// Default Values
// =============================================================================

const defaultSectionIds = {
  hero: 'hero',
  features: 'features',
  testimonials: 'testimonials',
  footer: 'footer',
} as const;

// =============================================================================
// Section Divider Component
// =============================================================================

interface SectionDividerProps {
  className?: string;
}

/**
 * Visual divider between sections
 */
const SectionDivider: React.FC<SectionDividerProps> = ({ className = '' }) => (
  <div
    className={`relative ${className}`}
    aria-hidden="true"
  >
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-gray-200 dark:border-gray-700" />
    </div>
  </div>
);

// =============================================================================
// Section Spacer Component
// =============================================================================

interface SectionSpacerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Vertical spacing between sections
 */
const SectionSpacer: React.FC<SectionSpacerProps> = ({ size = 'md' }) => {
  const sizeClasses: Record<string, string> = {
    sm: 'h-8 md:h-12',
    md: 'h-12 md:h-16',
    lg: 'h-16 md:h-24',
    xl: 'h-24 md:h-32',
  };

  return <div className={sizeClasses[size]} aria-hidden="true" />;
};

// =============================================================================
// Main Component
// =============================================================================

/**
 * LandingPage - Main landing page component that composes all sections
 * 
 * Orchestrates the hero, features, testimonials, and footer sections into
 * a cohesive landing page with smooth scrolling and proper spacing.
 * 
 * @example
 * ```tsx
 * <LandingPage
 *   hero={{
 *     headline: "Build Amazing Products",
 *     subheadline: "Start your journey today",
 *     ctaText: "Get Started",
 *     ctaLink: "/signup"
 *   }}
 *   features={{
 *     heading: "Features",
 *     items: [
 *       { title: "Fast", description: "Lightning quick" },
 *       { title: "Secure", description: "Enterprise-grade security" }
 *     ]
 *   }}
 *   testimonials={{
 *     heading: "What Our Customers Say",
 *     items: [
 *       { quote: "Amazing product!", author: "John Doe" }
 *     ]
 *   }}
 *   footer={{
 *     brandName: "Acme Inc",
 *     socialLinks: [{ platform: 'twitter', href: '...' }]
 *   }}
 * />
 * ```
 */
export const LandingPage: React.FC<LandingPageComponentProps> = ({
  hero,
  features,
  testimonials,
  footer,
  meta,
  sectionIds = defaultSectionIds,
  smoothScroll = true,
  showDividers = false,
  dividerComponent,
  onMount,
  className = '',
}) => {
  // Merge section IDs with defaults
  const mergedSectionIds = {
    ...defaultSectionIds,
    ...sectionIds,
  };

  // Enable smooth scroll behavior
  useEffect(() => {
    if (smoothScroll) {
      // Enable smooth scrolling on the document
      document.documentElement.style.scrollBehavior = 'smooth';
      
      return () => {
        // Cleanup: reset scroll behavior
        document.documentElement.style.scrollBehavior = 'auto';
      };
    }
  }, [smoothScroll]);

  // Call onMount callback when component mounts
  useEffect(() => {
    onMount?.();
  }, [onMount]);

  // Custom divider or default
  const renderDivider = () => {
    if (!showDividers) return null;
    return dividerComponent || <SectionDivider />;
  };

  // Determine which sections to render based on provided props
  const hasHero = hero !== undefined;
  const hasFeatures = features !== undefined;
  const hasTestimonials = testimonials !== undefined;
  const hasFooter = footer !== undefined;

  return (
    <main
      className={`min-h-screen flex flex-col ${className}`}
      role="main"
      aria-label="Landing page"
    >
      {/* Hero Section */}
      {hasHero && (
        <section id={mergedSectionIds.hero}>
          <HeroSection
            headline={hero.headline}
            subheadline={hero.subheadline}
            ctaText={hero.ctaText}
            ctaLink={hero.ctaLink}
            backgroundImage={hero.backgroundImage}
            secondaryCtaText={hero.secondaryCtaText}
            secondaryCtaLink={hero.secondaryCtaLink}
            alignment={hero.alignment}
            showOverlay={hero.showOverlay}
          />
        </section>
      )}

      {/* Divider after Hero */}
      {hasHero && hasFeatures && renderDivider()}

      {/* Features Section */}
      {hasFeatures && (
        <section id={mergedSectionIds.features}>
          <FeaturesGrid
            heading={features.heading}
            subheading={features.subheading}
            items={features.items}
            columns={features.columns}
          />
        </section>
      )}

      {/* Spacer between Features and Testimonials */}
      {hasFeatures && hasTestimonials && !showDividers && (
        <SectionSpacer size="sm" />
      )}

      {/* Divider after Features */}
      {hasFeatures && hasTestimonials && renderDivider()}

      {/* Testimonials Section */}
      {hasTestimonials && (
        <section id={mergedSectionIds.testimonials}>
          <TestimonialsCarousel
            heading={testimonials.heading}
            subheading={testimonials.subheading}
            items={testimonials.items}
            showRating={testimonials.showRating}
          />
        </section>
      )}

      {/* Spacer before Footer */}
      {hasTestimonials && hasFooter && !showDividers && (
        <SectionSpacer size="md" />
      )}

      {/* Divider before Footer */}
      {hasTestimonials && hasFooter && renderDivider()}

      {/* Footer Section - pushed to bottom */}
      {hasFooter && (
        <section id={mergedSectionIds.footer} className="mt-auto">
          <FooterSection
            brandName={footer.brandName}
            logoUrl={footer.logoUrl}
            copyright={footer.copyright}
            linkGroups={footer.linkGroups}
            links={footer.links}
            socialLinks={footer.socialLinks}
            showNewsletter={footer.showNewsletter}
            newsletterHeading={footer.newsletterHeading}
            newsletterPlaceholder={footer.newsletterPlaceholder}
          />
        </section>
      )}

      {/* Scroll to top button (optional enhancement) */}
      <ScrollToTopButton />
    </main>
  );
};

// =============================================================================
// Scroll to Top Button
// =============================================================================

/**
 * Floating button that scrolls the page to the top
 * Only visible when user has scrolled down
 */
const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 400px
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="
        fixed bottom-6 right-6 z-50
        w-12 h-12
        bg-indigo-600 hover:bg-indigo-700
        text-white
        rounded-full shadow-lg
        flex items-center justify-center
        transition-all duration-300
        hover:scale-110
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        animate-fade-in
      "
      aria-label="Scroll to top"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
};

// =============================================================================
// CSS Animation (add to global styles or use Tailwind config)
// =============================================================================

// Note: Add this to your global CSS or tailwind.config.js:
// @keyframes fade-in {
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .animate-fade-in { animation: fade-in 0.3s ease-out; }

// =============================================================================
// Default Export
// =============================================================================

export default LandingPage;
