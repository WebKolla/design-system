import blogInsights from './blog-insights.webp'
import consultancyManager from './consultancy-manager.webp'
import consultantPortrait from './consultant-portrait.webp'
import faqHelpCentre from './faq-help-centre.webp'
import featureApproval from './feature-approval.webp'
import featureInvoicing from './feature-invoicing.webp'
import featureTimeTracking from './feature-time-tracking.webp'
import heroBanner from './hero-banner.webp'
import loginBackground from './login-background.webp'
import missionValues from './mission-values.webp'
import socialProofTrust from './social-proof-trust.webp'
import supportHelpdesk from './support-helpdesk.webp'
import teamCulture from './team-culture.webp'
import teamDashboard from './team-dashboard.webp'
import testimonialCaseStudy from './testimonial-case-study.webp'
import timesheetMoment from './timesheet-moment.webp'

/**
 * The sixteen product photographs, with their alt text.
 *
 * These are the **original** `.webp` files from the UX positioning bundle, not
 * a re-export of the Figma frames — Figma holds the same images, so exporting
 * from there would only add a generation of loss.
 *
 * Alt text is written here rather than at each call site so a photograph
 * cannot be used with a different description on two pages. It describes what
 * the image shows, not what the section is about: the surrounding copy already
 * carries the message.
 */
export const PHOTOS = {
  heroBanner: { src: heroBanner, alt: 'A consultancy team working together at a shared desk' },
  teamDashboard: { src: teamDashboard, alt: 'A laptop showing a timesheet dashboard on a meeting table' },
  consultancyManager: { src: consultancyManager, alt: 'A consultancy manager reviewing work on a laptop' },
  consultantPortrait: { src: consultantPortrait, alt: 'A consultant at their desk' },
  featureTimeTracking: { src: featureTimeTracking, alt: 'Hours being entered on a laptop' },
  featureApproval: { src: featureApproval, alt: 'Two colleagues reviewing a week of work on screen' },
  featureInvoicing: { src: featureInvoicing, alt: 'An invoice being prepared at a desk' },
  timesheetMoment: { src: timesheetMoment, alt: 'A consultant filling in a timesheet at the end of the week' },
  socialProofTrust: { src: socialProofTrust, alt: 'A team in discussion around a table' },
  testimonialCaseStudy: { src: testimonialCaseStudy, alt: 'A consultant speaking with a client' },
  missionValues: { src: missionValues, alt: 'A small team collaborating in a bright office' },
  teamCulture: { src: teamCulture, alt: 'Colleagues talking in a shared workspace' },
  blogInsights: { src: blogInsights, alt: 'A notebook and laptop on a desk' },
  faqHelpCentre: { src: faqHelpCentre, alt: 'Someone reading documentation on a laptop' },
  supportHelpdesk: { src: supportHelpdesk, alt: 'A support conversation taking place at a desk' },
  loginBackground: { src: loginBackground, alt: '' },
} as const

export type PhotoKey = keyof typeof PHOTOS
