/**
 * Shared marketing chrome content.
 *
 * `.ts` deliberately — see BUG-001.
 */

export const MARKETING_NAV = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'Approvals', href: '/approvals' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

export const FOOTER = {
  blurb:
    'Timesheet management, approvals and invoicing for consultancies that bill by the hour.',
  columns: [
    {
      heading: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Approval workflows', href: '/approvals' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Invoicing', href: '/invoicing' },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'FAQ', href: '/faq' },
        { label: 'Help centre', href: '/help' },
        { label: 'Status', href: '/status' },
      ],
    },
    {
      heading: 'Legal',
      links: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
        { label: 'Data processing', href: '/dpa' },
      ],
    },
  ],
  social: [
    { label: 'X', href: 'https://x.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'GitHub', href: 'https://github.com' },
  ],
  copyright: '© 2026 TimeSubmit Ltd. All rights reserved.',
  strapline: 'Built for consultancies',
}
