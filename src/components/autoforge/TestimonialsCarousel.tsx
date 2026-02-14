'use client';

import React, { useState, useEffect, useCallback, useRef, TouchEvent } from 'react';
import {
  TestimonialItem,
  TestimonialsProps,
  testimonialItemDefaults,
  WithClassName,
} from './types';

// =============================================================================
// Types
// =============================================================================

export interface TestimonialsCarouselProps extends Omit<TestimonialsProps, 'variant'>, WithClassName {
  /** Auto-rotation interval in milliseconds. Default: 5000. Set to 0 to disable. */
  autoRotateInterval?: number;
  /** Pause auto-rotation on hover. Default: true */
  pauseOnHover?: boolean;
  /** Show navigation arrows. Default: true */
  showArrows?: boolean;
  /** Show navigation dots. Default: true */
  showDots?: boolean;
  /** Animation duration in milliseconds. Default: 500 */
  animationDuration?: number;
  /** Minimum swipe distance to trigger slide change. Default: 50 */
  swipeThreshold?: number;
}

// =============================================================================
// Default Values
// =============================================================================

const carouselDefaults = {
  heading: 'What Our Customers Say',
  autoRotateInterval: 5000,
  pauseOnHover: true,
  showArrows: true,
  showDots: true,
  showRating: true,
  animationDuration: 500,
  swipeThreshold: 50,
} as const;

// =============================================================================
// Subcomponents
// =============================================================================

interface StarRatingProps {
  rating: 1 | 2 | 3 | 4 | 5;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'
          }`}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

interface AvatarProps {
  src?: string;
  alt: string;
  fallback: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback }) => {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div
        className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-md"
        aria-label={alt}
      >
        {fallback}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-14 h-14 rounded-full object-cover shadow-md ring-2 ring-white"
      onError={() => setImageError(true)}
    />
  );
};

interface NavigationArrowProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
}

const NavigationArrow: React.FC<NavigationArrowProps> = ({ direction, onClick, disabled }) => {
  const isPrev = direction === 'prev';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        absolute top-1/2 -translate-y-1/2 z-10
        ${isPrev ? 'left-0 -translate-x-1/2 md:left-4 md:translate-x-0' : 'right-0 translate-x-1/2 md:right-4 md:translate-x-0'}
        w-10 h-10 md:w-12 md:h-12
        bg-white/90 backdrop-blur-sm
        rounded-full shadow-lg
        flex items-center justify-center
        text-gray-700 hover:text-indigo-600
        hover:bg-white hover:shadow-xl
        transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/90
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
      `}
      aria-label={isPrev ? 'Previous testimonial' : 'Next testimonial'}
    >
      <svg
        className={`w-5 h-5 md:w-6 md:h-6 ${isPrev ? 'mr-0.5' : 'ml-0.5'}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={isPrev ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
        />
      </svg>
    </button>
  );
};

interface NavigationDotsProps {
  total: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}

const NavigationDots: React.FC<NavigationDotsProps> = ({ total, activeIndex, onSelect }) => {
  return (
    <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Testimonial navigation">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`
            w-2.5 h-2.5 rounded-full
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
            ${
              index === activeIndex
                ? 'bg-indigo-600 w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            }
          `}
          role="tab"
          aria-selected={index === activeIndex}
          aria-label={`Go to testimonial ${index + 1}`}
        />
      ))}
    </div>
  );
};

interface TestimonialCardProps {
  testimonial: TestimonialItem;
  showRating?: boolean;
  isActive: boolean;
  animationDuration: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  showRating = true,
  isActive,
  animationDuration,
}) => {
  const author = testimonial.author || testimonialItemDefaults.author;
  const initials = author
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`
        w-full flex-shrink-0 px-4 md:px-8
        transition-opacity
      `}
      style={{ transitionDuration: `${animationDuration}ms` }}
      role="tabpanel"
      aria-hidden={!isActive}
    >
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 relative">
          {/* Quote icon */}
          <div className="absolute -top-4 left-8 bg-indigo-600 rounded-full p-3 shadow-lg">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>

          {/* Rating */}
          {showRating && testimonial.rating && (
            <div className="mb-4 pt-4">
              <StarRating rating={testimonial.rating} />
            </div>
          )}

          {/* Quote */}
          <blockquote className={`text-gray-700 text-lg md:text-xl leading-relaxed mb-6 ${!showRating || !testimonial.rating ? 'pt-4' : ''}`}>
            &ldquo;{testimonial.quote || 'No testimonial provided.'}&rdquo;
          </blockquote>

          {/* Author info */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <Avatar
              src={testimonial.avatar}
              alt={`${author}'s avatar`}
              fallback={initials}
            />
            <div>
              <div className="font-semibold text-gray-900">{author}</div>
              {(testimonial.role || testimonial.company) && (
                <div className="text-gray-500 text-sm">
                  {testimonial.role}
                  {testimonial.role && testimonial.company && ' · '}
                  {testimonial.company}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// Main Component
// =============================================================================

export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  heading = carouselDefaults.heading,
  subheading,
  items = [],
  showRating = carouselDefaults.showRating,
  autoRotateInterval = carouselDefaults.autoRotateInterval,
  pauseOnHover = carouselDefaults.pauseOnHover,
  showArrows = carouselDefaults.showArrows,
  showDots = carouselDefaults.showDots,
  animationDuration = carouselDefaults.animationDuration,
  swipeThreshold = carouselDefaults.swipeThreshold,
  className = '',
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  const totalItems = items.length;
  const hasMultipleItems = totalItems > 1;

  // Navigation handlers
  const goToNext = useCallback(() => {
    if (isTransitioning || !hasMultipleItems) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev + 1) % totalItems);
    setTimeout(() => setIsTransitioning(false), animationDuration);
  }, [totalItems, isTransitioning, hasMultipleItems, animationDuration]);

  const goToPrev = useCallback(() => {
    if (isTransitioning || !hasMultipleItems) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
    setTimeout(() => setIsTransitioning(false), animationDuration);
  }, [totalItems, isTransitioning, hasMultipleItems, animationDuration]);

  const goToIndex = useCallback(
    (index: number) => {
      if (isTransitioning || index === activeIndex) return;
      setIsTransitioning(true);
      setActiveIndex(index);
      setTimeout(() => setIsTransitioning(false), animationDuration);
    },
    [activeIndex, isTransitioning, animationDuration]
  );

  // Auto-rotation effect
  useEffect(() => {
    if (!hasMultipleItems || autoRotateInterval <= 0 || isPaused) {
      return;
    }

    const intervalId = setInterval(() => {
      goToNext();
    }, autoRotateInterval);

    return () => clearInterval(intervalId);
  }, [hasMultipleItems, autoRotateInterval, isPaused, goToNext]);

  // Touch handlers for swipe support
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > swipeThreshold;
    const isRightSwipe = distance < -swipeThreshold;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!carouselRef.current?.contains(document.activeElement)) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // Empty state
  if (totalItems === 0) {
    return (
      <section className={`py-16 md:py-24 bg-gray-50 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {heading}
            </h2>
            <p className="text-gray-500">No testimonials available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden ${className}`}
      aria-label="Customer testimonials"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {heading}
          </h2>
          {subheading && (
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              {subheading}
            </p>
          )}
        </div>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="relative"
          onMouseEnter={() => pauseOnHover && setIsPaused(true)}
          onMouseLeave={() => pauseOnHover && setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-roledescription="carousel"
          aria-label={`Testimonial carousel with ${totalItems} slides`}
        >
          {/* Navigation Arrows */}
          {showArrows && hasMultipleItems && (
            <>
              <NavigationArrow direction="prev" onClick={goToPrev} />
              <NavigationArrow direction="next" onClick={goToNext} />
            </>
          )}

          {/* Slides Container */}
          <div className="overflow-hidden">
            <div
              ref={slideContainerRef}
              className="flex transition-transform ease-out"
              style={{
                transform: `translateX(-${activeIndex * 100}%)`,
                transitionDuration: `${animationDuration}ms`,
              }}
            >
              {items.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id || index}
                  testimonial={testimonial}
                  showRating={showRating}
                  isActive={index === activeIndex}
                  animationDuration={animationDuration}
                />
              ))}
            </div>
          </div>

          {/* Screen reader live region */}
          <div
            className="sr-only"
            aria-live="polite"
            aria-atomic="true"
          >
            Showing testimonial {activeIndex + 1} of {totalItems}
          </div>
        </div>

        {/* Navigation Dots */}
        {showDots && hasMultipleItems && (
          <NavigationDots
            total={totalItems}
            activeIndex={activeIndex}
            onSelect={goToIndex}
          />
        )}
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
