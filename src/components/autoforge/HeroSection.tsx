'use client';

import { HeroProps, heroDefaults, WithClassName } from './types';

/**
 * HeroSection Component
 * 
 * A full-width hero section with headline, subheadline, and CTA buttons.
 * Supports optional background images with overlay and responsive design.
 * 
 * @example
 * ```tsx
 * <HeroSection
 *   headline="Build Something Amazing"
 *   subheadline="Start your journey with our powerful platform"
 *   ctaText="Get Started"
 *   ctaLink="/signup"
 *   secondaryCtaText="Learn More"
 *   secondaryCtaLink="/features"
 * />
 * ```
 */
export interface HeroSectionProps extends HeroProps, WithClassName {}

export function HeroSection({
  headline = heroDefaults.headline,
  subheadline,
  ctaText = heroDefaults.ctaText,
  ctaLink = heroDefaults.ctaLink,
  backgroundImage,
  secondaryCtaText,
  secondaryCtaLink,
  alignment = heroDefaults.alignment,
  showOverlay = heroDefaults.showOverlay,
  className = '',
}: HeroSectionProps) {
  // Alignment classes mapping
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  // Container alignment for flex
  const containerAlignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <section
      className={`
        relative w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh]
        flex items-center
        ${backgroundImage ? '' : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'}
        ${className}
      `.trim()}
      role="banner"
      aria-label="Hero section"
    >
      {/* Background Image */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden="true"
        />
      )}

      {/* Overlay */}
      {backgroundImage && showOverlay && (
        <div
          className="absolute inset-0 bg-black/50"
          aria-hidden="true"
        />
      )}

      {/* Content Container */}
      <div
        className={`
          relative z-10 w-full
          px-4 sm:px-6 lg:px-8
          py-12 sm:py-16 lg:py-24
          max-w-7xl mx-auto
        `.trim()}
      >
        <div
          className={`
            flex flex-col gap-6 sm:gap-8
            ${alignmentClasses[alignment]}
            max-w-4xl
            ${alignment === 'center' ? 'mx-auto' : alignment === 'right' ? 'ml-auto' : ''}
          `.trim()}
        >
          {/* Headline */}
          <h1
            className="
              text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
              font-bold tracking-tight
              text-white
              leading-tight
            "
          >
            {headline}
          </h1>

          {/* Subheadline */}
          {subheadline && (
            <p
              className="
                text-base sm:text-lg md:text-xl lg:text-2xl
                text-slate-300
                max-w-2xl
                leading-relaxed
              "
            >
              {subheadline}
            </p>
          )}

          {/* CTA Buttons */}
          <div
            className={`
              flex flex-col sm:flex-row
              gap-3 sm:gap-4
              mt-2 sm:mt-4
              ${containerAlignmentClasses[alignment]}
              w-full sm:w-auto
            `.trim()}
          >
            {/* Primary CTA */}
            <a
              href={ctaLink}
              className="
                inline-flex items-center justify-center
                px-6 sm:px-8 py-3 sm:py-4
                text-base sm:text-lg font-semibold
                text-white bg-indigo-600
                rounded-lg
                shadow-lg shadow-indigo-500/30
                hover:bg-indigo-500
                hover:shadow-xl hover:shadow-indigo-500/40
                hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900
                transition-all duration-200 ease-out
                w-full sm:w-auto
              "
              role="button"
            >
              {ctaText}
            </a>

            {/* Secondary CTA */}
            {secondaryCtaText && secondaryCtaLink && (
              <a
                href={secondaryCtaLink}
                className="
                  inline-flex items-center justify-center
                  px-6 sm:px-8 py-3 sm:py-4
                  text-base sm:text-lg font-semibold
                  text-white
                  bg-white/10 backdrop-blur-sm
                  border border-white/20
                  rounded-lg
                  hover:bg-white/20
                  hover:border-white/30
                  hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900
                  transition-all duration-200 ease-out
                  w-full sm:w-auto
                "
                role="button"
              >
                {secondaryCtaText}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Decorative gradient at bottom */}
      <div
        className="
          absolute bottom-0 left-0 right-0
          h-24 sm:h-32
          bg-gradient-to-t from-slate-900/80 to-transparent
          pointer-events-none
        "
        aria-hidden="true"
      />
    </section>
  );
}

export default HeroSection;
