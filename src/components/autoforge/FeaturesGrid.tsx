'use client';

import React from 'react';
import type {
  FeaturesProps,
  FeatureItem,
  WithClassName,
} from './types';

// =============================================================================
// Feature Card Component
// =============================================================================

/**
 * Props for the FeatureCard sub-component
 * Extends FeatureItem with additional customization options
 */
export interface FeatureCardProps extends FeatureItem, WithClassName {
  /** Custom icon element (ReactNode for maximum flexibility) */
  iconElement?: React.ReactNode;
  /** Icon container background color class. Default: "bg-blue-100" */
  iconBgClass?: string;
  /** Icon container text/icon color class. Default: "text-blue-600" */
  iconColorClass?: string;
  /** Card variant for different visual styles */
  variant?: 'default' | 'bordered' | 'elevated';
}

/**
 * Individual feature card with icon, title, and description
 * Supports custom icons via iconElement prop or icon name string
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon = 'star',
  iconElement,
  title = 'Feature',
  description = '',
  link,
  linkText = 'Learn more',
  iconBgClass = 'bg-blue-100',
  iconColorClass = 'text-blue-600',
  variant = 'default',
  className = '',
}) => {
  // Variant-specific styles
  const variantClasses: Record<string, string> = {
    default: 'bg-white',
    bordered: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg hover:shadow-xl transition-shadow duration-300',
  };

  // Default icon fallback (simple SVG star)
  const defaultIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );

  // Icon mapping for common icon names
  const iconMap: Record<string, React.ReactNode> = {
    star: defaultIcon,
    check: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    lightning: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    shield: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    sparkles: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
    cog: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    heart: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    rocket: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
        />
      </svg>
    ),
    globe: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
  };

  // Determine which icon to render
  const renderIcon = (): React.ReactNode => {
    if (iconElement) {
      return iconElement;
    }
    return iconMap[icon] || defaultIcon;
  };

  const CardContent = (
    <>
      {/* Icon Container */}
      <div
        className={`
          inline-flex items-center justify-center
          w-12 h-12 rounded-xl
          ${iconBgClass} ${iconColorClass}
          mb-4
        `}
      >
        {renderIcon()}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{description}</p>
      )}

      {/* Optional Link */}
      {link && (
        <span className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium group-hover:underline">
          {linkText}
          <svg
            className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </>
  );

  const cardClasses = `
    group
    p-6 rounded-2xl
    ${variantClasses[variant]}
    ${className}
  `;

  // If there's a link, wrap in anchor tag
  if (link) {
    return (
      <a href={link} className={`${cardClasses} block`}>
        {CardContent}
      </a>
    );
  }

  return <div className={cardClasses}>{CardContent}</div>;
};

// =============================================================================
// Features Grid Component
// =============================================================================

/**
 * Extended props for FeaturesGrid with additional customization
 */
export interface FeaturesGridProps extends FeaturesProps, WithClassName {
  /** Background color class for the section. Default: "bg-gray-50" */
  bgClass?: string;
  /** Card variant to apply to all cards. Default: "default" */
  cardVariant?: 'default' | 'bordered' | 'elevated';
  /** Icon background color class for all cards */
  iconBgClass?: string;
  /** Icon color class for all cards */
  iconColorClass?: string;
  /** Custom icon elements mapped by feature id or index */
  customIcons?: Record<string | number, React.ReactNode>;
  /** Section ID for navigation/anchor linking */
  id?: string;
  /** Padding size. Default: "lg" */
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  /** Center the section heading. Default: true */
  centerHeading?: boolean;
}

/**
 * Responsive features grid section with customizable cards
 * 
 * @example
 * ```tsx
 * <FeaturesGrid
 *   heading="Why Choose Us"
 *   subheading="Here's what makes us different"
 *   items={[
 *     { icon: 'lightning', title: 'Fast', description: 'Lightning quick performance' },
 *     { icon: 'shield', title: 'Secure', description: 'Enterprise-grade security' },
 *     { icon: 'heart', title: 'Reliable', description: '99.9% uptime guarantee' },
 *   ]}
 *   columns={3}
 * />
 * ```
 */
export const FeaturesGrid: React.FC<FeaturesGridProps> = ({
  heading = 'Features',
  subheading,
  items = [],
  columns = 3,
  bgClass = 'bg-gray-50',
  cardVariant = 'default',
  iconBgClass,
  iconColorClass,
  customIcons = {},
  id,
  padding = 'lg',
  centerHeading = true,
  className = '',
}) => {
  // Padding variants
  const paddingClasses: Record<string, string> = {
    sm: 'py-8 px-4',
    md: 'py-12 px-6',
    lg: 'py-16 px-6 lg:px-8',
    xl: 'py-24 px-6 lg:px-8',
  };

  // Grid column classes - responsive: 1 col mobile, 2 col tablet, N col desktop
  const columnClasses: Record<number, string> = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section
      id={id}
      className={`
        ${bgClass}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className={`mb-12 ${centerHeading ? 'text-center' : ''}`}>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            {heading}
          </h2>
          {subheading && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subheading}
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div
          className={`
            grid
            ${columnClasses[columns] || columnClasses[3]}
            gap-6 lg:gap-8
          `}
        >
          {items.map((item, index) => {
            const itemId = item.id || index;
            const customIcon = customIcons[itemId] || customIcons[index];

            return (
              <FeatureCard
                key={itemId}
                {...item}
                iconElement={customIcon}
                variant={cardVariant}
                iconBgClass={iconBgClass}
                iconColorClass={iconColorClass}
              />
            );
          })}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No features to display</p>
          </div>
        )}
      </div>
    </section>
  );
};

// =============================================================================
// Default Export
// =============================================================================

export default FeaturesGrid;
