import LandingPage from '@/components/autoforge/LandingPage';
import type { LandingPageProps } from '@/components/autoforge/types';

/**
 * Demo page showcasing the LandingPage component with sample data.
 * This serves as both a visual testing page and usage example.
 */

const demoProps: LandingPageProps = {
  hero: {
    headline: 'Ship Products Faster with AI-Powered Development',
    subheadline:
      'Accelerate your workflow with intelligent code generation, automated testing, and seamless deployment. Join 10,000+ developers building the future.',
    ctaText: 'Start Free Trial',
    ctaLink: '/signup',
    secondaryCtaText: 'Watch Demo',
    secondaryCtaLink: '/demo-video',
    alignment: 'center',
  },

  features: {
    heading: 'Everything You Need to Build Faster',
    subheading:
      'Powerful features designed by developers, for developers. From idea to production in record time.',
    columns: 3,
    items: [
      {
        id: 'feature-1',
        icon: 'lightning',
        title: 'Lightning Fast Generation',
        description:
          'Generate production-ready code in seconds with our advanced AI models. Supports 20+ languages and frameworks out of the box.',
        link: '/features/generation',
        linkText: 'Learn more',
      },
      {
        id: 'feature-2',
        icon: 'shield',
        title: 'Enterprise-Grade Security',
        description:
          'SOC 2 Type II certified with end-to-end encryption. Your code never leaves your environment without explicit permission.',
        link: '/features/security',
        linkText: 'View certifications',
      },
      {
        id: 'feature-3',
        icon: 'cog',
        title: 'Seamless Integrations',
        description:
          'Connect with GitHub, GitLab, Bitbucket, Jira, Linear, and 50+ other tools your team already uses.',
        link: '/integrations',
        linkText: 'Browse integrations',
      },
      {
        id: 'feature-4',
        icon: 'sparkles',
        title: 'Smart Code Reviews',
        description:
          'AI-powered code analysis catches bugs, security vulnerabilities, and performance issues before they reach production.',
        link: '/features/reviews',
        linkText: 'See it in action',
      },
      {
        id: 'feature-5',
        icon: 'rocket',
        title: 'One-Click Deployment',
        description:
          'Deploy to AWS, GCP, Azure, or Vercel with a single click. Automatic rollbacks and blue-green deployments included.',
        link: '/features/deploy',
        linkText: 'Explore deployment',
      },
      {
        id: 'feature-6',
        icon: 'globe',
        title: 'Real-Time Collaboration',
        description:
          'Work together with your team in real-time. Share snippets, review code, and pair program from anywhere in the world.',
        link: '/features/collaboration',
        linkText: 'Start collaborating',
      },
    ],
  },

  testimonials: {
    heading: 'Trusted by Industry Leaders',
    subheading: 'See why thousands of teams choose us to power their development workflow.',
    showRating: true,
    items: [
      {
        id: 'testimonial-1',
        quote:
          "This tool has completely transformed how our team ships code. What used to take days now takes hours. It's like having a 10x engineer on every project.",
        author: 'Sarah Chen',
        role: 'VP of Engineering',
        company: 'TechFlow Inc.',
        rating: 5,
      },
      {
        id: 'testimonial-2',
        quote:
          "The code quality and security features are outstanding. We've reduced our bug rate by 60% since adoption. Our security team finally sleeps at night.",
        author: 'Marcus Rodriguez',
        role: 'CTO',
        company: 'SecureStack',
        rating: 5,
      },
      {
        id: 'testimonial-3',
        quote:
          "I was skeptical about AI tools at first, but this one actually delivers. The integrations work flawlessly with our existing CI/CD pipeline.",
        author: 'Emily Watson',
        role: 'Senior Developer',
        company: 'CloudNine Solutions',
        rating: 5,
      },
      {
        id: 'testimonial-4',
        quote:
          "We onboarded 50 developers in a week with zero friction. The learning curve is non-existent. Best developer tool purchase we've ever made.",
        author: 'James Park',
        role: 'Engineering Manager',
        company: 'DataDriven Labs',
        rating: 5,
      },
    ],
  },

  footer: {
    brandName: 'DevFlow',
    showNewsletter: true,
    newsletterHeading: 'Stay in the loop',
    newsletterPlaceholder: 'you@company.com',
    linkGroups: [
      {
        title: 'Product',
        links: [
          { id: 'link-features', label: 'Features', href: '/features' },
          { id: 'link-pricing', label: 'Pricing', href: '/pricing' },
          { id: 'link-integrations', label: 'Integrations', href: '/integrations' },
          { id: 'link-changelog', label: 'Changelog', href: '/changelog' },
          { id: 'link-roadmap', label: 'Roadmap', href: '/roadmap' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { id: 'link-docs', label: 'Documentation', href: '/docs' },
          { id: 'link-api', label: 'API Reference', href: '/docs/api' },
          { id: 'link-guides', label: 'Guides & Tutorials', href: '/guides' },
          { id: 'link-blog', label: 'Blog', href: '/blog' },
          { id: 'link-community', label: 'Community', href: '/community' },
        ],
      },
      {
        title: 'Company',
        links: [
          { id: 'link-about', label: 'About Us', href: '/about' },
          { id: 'link-careers', label: 'Careers', href: '/careers' },
          { id: 'link-press', label: 'Press Kit', href: '/press' },
          { id: 'link-contact', label: 'Contact', href: '/contact' },
          { id: 'link-partners', label: 'Partners', href: '/partners' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { id: 'link-privacy', label: 'Privacy Policy', href: '/privacy' },
          { id: 'link-terms', label: 'Terms of Service', href: '/terms' },
          { id: 'link-security', label: 'Security', href: '/security' },
          { id: 'link-gdpr', label: 'GDPR', href: '/gdpr' },
          { id: 'link-cookies', label: 'Cookie Policy', href: '/cookies' },
        ],
      },
    ],
    socialLinks: [
      { platform: 'twitter', href: 'https://twitter.com/devflow' },
      { platform: 'github', href: 'https://github.com/devflow' },
      { platform: 'linkedin', href: 'https://linkedin.com/company/devflow' },
      { platform: 'discord', href: 'https://discord.gg/devflow' },
      { platform: 'youtube', href: 'https://youtube.com/@devflow' },
    ],
    copyright: '© 2024 DevFlow, Inc. All rights reserved.',
  },

  smoothScroll: true,
  showDividers: false,
  sectionIds: {
    hero: 'hero',
    features: 'features',
    testimonials: 'testimonials',
    footer: 'footer',
  },
};

export default function DemoPage() {
  return <LandingPage {...demoProps} />;
}

export const metadata = {
  title: 'DevFlow - Ship Products Faster with AI-Powered Development',
  description:
    'Accelerate your workflow with intelligent code generation, automated testing, and seamless deployment. Join 10,000+ developers building the future.',
};
