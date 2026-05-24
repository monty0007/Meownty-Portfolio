
import { Project, Skill, BlogPost, Achievement, PowerPlatformItem } from './types';

export const PROJECTS: Project[] = [

  {
    id: '1',
    title: 'Trivia Arena',
    description: 'An interactive quiz platform where users can create and play quizzes, featuring authentication and a joyful, user-focused UI/UX.',
    image: '/triviarena.png',
    tags: ['React', 'Firebase', 'MongoDB', 'TailwindCSS'],
    color: '#00A1FF',
    link: 'https://triviarena.maoverse.xyz/',
    disabled: false
  },
  {
    id: '2',
    title: 'Power Quote',
    description: 'A live Power Apps solution for managing quotations and purchase orders, with automated Word and PDF generation.',
    image: '/screen.png',
    tags: ['Power Apps', 'Power Automate', 'SharePoint / Dataverse', 'Word Templates'],
    color: '#FF4B4B',
    link: 'na',
    disabled: true
  },
  {
    id: '3',
    title: 'Automify The Builder',
    description: 'A drag-and-drop automation platform inspired by n8n, enabling users to visually design workflows through a clean interface.',
    image: '/auto.png',
    tags: ['React', 'Automation', 'Workflow Builder'],
    color: '#6B4BFF',
    link: 'https://automify.vercel.app/',
    disabled: false
  },
  {
    id: '4',
    title: 'Oryn',
    description: 'A prompt board that helps users craft precise, structured prompts to generate accurate AI images — no more guessing what to type.',
    image: '/oryn.png',
    tags: ['AI', 'Prompt Engineering', 'Image Generation', 'React'],
    color: '#FF6B35',
    link: 'https://oryn.maoverse.xyz/',
    disabled: false
  },
  {
    id: '5',
    title: 'Doc Reaper',
    description: 'A web tool that converts HTML to PDF on the fly — built because no reliable online solution existed for this seemingly simple need.',
    image: '/docreaper.png',
    tags: ['Node.js', 'HTML to PDF', 'Web Tool'],
    color: '#E91E63',
    link: 'https://docreaper.maoverse.xyz/',
    disabled: false
  },
  {
    id: '6',
    title: 'Mario Kart',
    description: 'Hackathon-winning game: an extended Mario experience where the player navigates through levels inside a kart, blending classic platformer mechanics with kart gameplay.',
    image: '/mariokart.png',
    tags: ['JavaScript', 'Canvas', 'Game Dev', 'Hackathon Winner'],
    color: '#E53935',
    link: 'https://super-mario-kart-902002915057.asia-south1.run.app/',
    disabled: false
  },
  {
    id: '7',
    title: 'Reportix',
    description: 'An intelligent document system built on the Microsoft Power Platform that automates the otherwise manual, time-consuming process of generating reports inside enterprise workflows.',
    image: '/reportix.png',
    tags: ['Power Platform', 'Power Automate', 'SharePoint', 'Automation'],
    color: '#1565C0',
    link: '',
    disabled: true
  },
  {
    id: '8',
    title: 'InspectIQ',
    description: 'Digitized a critical inspection report that was previously near-impossible to standardize, and built automation to proactively track and flag machines approaching their expiry dates.',
    image: '',
    tags: ['Power Apps', 'Power Automate', 'Digitization', 'Automation'],
    color: '#37474F',
    link: '',
    disabled: true
  },
  {
    id: '9',
    title: 'Azure Pricing Calculator',
    description: 'A smarter alternative to the official Azure pricing page — users can manually configure BOQs in a cleaner interface, or let AI generate them automatically. Supports saving quotes and side-by-side VM comparisons.',
    image: '/azurecalc.png',
    tags: ['React', 'Azure', 'AI', 'BOQ', 'VM Comparison'],
    color: '#0078D4',
    link: 'http://calcai.maoverse.xyz/',
    disabled: false
  },
  {
    id: '10',
    title: 'BizForge',
    description: 'An end-to-end business operations suite tailored for SMBs — covers the full cycle from quotation creation and approvals to accounts payable, payment processing, and Tally push integration. Includes RBAC, admin dashboards, and financial graphs.',
    image: '/foetronlab.png',
    tags: ['React', 'Power Platform', 'CSS', 'Firebase Authentication', 'Entra Setup', 'Postgres'],
    color: '#2E7D32',
    link: '',
    disabled: true
  },
  {
    id: '11',
    title: 'Cookie Craze',
    description: 'A delightful, fully animated cookie-themed website with smooth transitions and playful UI interactions.',
    image: '/cookie.png',
    tags: ['HTML', 'CSS', 'Animation'],
    color: '#FF9800',
    link: '',
    disabled: false
  },
  {
    id: '12',
    title: 'Yojana AI',
    description: 'Simply describe yourself and Yojana AI surfaces all government schemes you are eligible for — eliminating the need to manually browse through hundreds of scheme listings across portals.',
    image: '/yojana.png',
    tags: ['AI', 'React', 'Government Schemes', 'NLP'],
    color: '#6A1B9A',
    link: '',
    disabled: false
  },
  {
    id: '13',
    title: 'Promptboard',
    description: 'A sleek prompt board for AI image generation — same core idea as Oryn but rebuilt from scratch with a completely different UI/UX direction, exploring an alternate design language for the same problem.',
    image: '/promptboard.png',
    tags: ['AI', 'Prompt Engineering', 'Image Generation', 'React'],
    color: '#00BCD4',
    link: 'https://promptboard.zero1studio.xyz/',
    disabled: false
  },
  {
    id: '14',
    title: 'ReelTrace',
    description: 'Drop any Instagram reel link and ReelTrace pinpoints the exact filming location on a map — or generates a ready-to-use travel itinerary based on the spots featured in the reel.',
    image: '/reeltrace.png',
    tags: ['AI', 'React', 'Location Detection', 'Travel', 'Instagram'],
    color: '#F06292',
    link: 'https://itinerary-planner-liard.vercel.app/plan',
    disabled: false
  },
  {
    id: '15',
    title: 'Only4You',
    description: 'India\'s learning platform for Ethical Hacking, Python, Web Development & AI — with 300+ lessons, live safe labs, an in-browser code editor, and an Azure AI Mentor, all for ₹99/year.',
    image: '/only4you.png',
    tags: ['React', 'Node.js', 'Learning Platform', 'Real-time'],
    color: '#43A047',
    link: 'https://only4you-app.vercel.app/',
    disabled: false
  },
  {
    id: '16',
    title: 'MSPulse',
    description: 'Got tired of digging through Microsoft\'s website for real updates — so built a personal dashboard that auto-fetches and surfaces the latest Microsoft product and security updates on a clean, scheduled feed.',
    image: '/mspulse.png',
    tags: ['React', 'Automation', 'Microsoft', 'Scheduled Fetch', 'Dashboard'],
    color: '#0078D4',
    link: 'https://microsoftupdates.co.in/',
    disabled: false
  }
];

export const SKILLS: Skill[] = [
  { name: 'Power Platform', level: 92 },
  { name: 'Backend', level: 95 },
  { name: 'Prompt Engineering', level: 83 },
  { name: 'Automation', level: 93 },
  { name: 'Frontend', level: 80 }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'Midnight Summit Hackathon – 1st Place',
    issuer: 'Midnight Foundation (In-Person)',
    date: '2025',
    icon: '🏆',
    color: '#FFD600'
  },
  {
    id: '2',
    title: 'Microsoft Hackathon & Ideathon – 1st Place',
    issuer: 'Microsoft',
    date: '2025',
    icon: '🥇',
    color: '#00A1FF'
  }
];


export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'guide',
    title: 'Action Bastion Guide to Blogging',
    date: 'Jan 20, 2025',
    excerpt: 'Learn how to use Images, Code, and Notes in your custom blog entries!',
    category: 'Documentation',
    color: '#FFD600',
    sections: [
      { type: 'text', content: 'Welcome to your rich-content editor! Below are examples of everything you can build using the JSON sections in the admin panel.' },
      { type: 'note', content: 'Pro-Tip: You can find the JSON templates for these blocks by clicking "VIEW BLUEPRINT MANUAL" in the Admin Lab!' },
      { type: 'image', content: '', caption: 'High-tech gadgets for your blog posts.' },
      { type: 'text', content: 'You can also drop code snippets that look like real 22nd-century terminals:' },
      { type: 'code', content: 'const powerUp = () => {\n  console.log("ACTION BASTION!!!");\n  return "🚀 Ready for deployment!";\n};', language: 'javascript' },
      { type: 'text', content: 'Every section is framed with neubrutalist borders to keep that premium Awwwards cartoon aesthetic.' }
    ]
  },
  {
    id: '1',
    title: 'The Secret Life of LLMs',
    date: 'Oct 12, 2024',
    excerpt: 'Exploring how hidden states in transformers resemble 90s cartoon logic.',
    category: 'AI Research',
    color: '#FF4B4B',
    sections: [
      { type: 'text', content: 'Transformers are essentially vast neural stages where attention mechanisms act as directors.' },
      { type: 'image', content: '', caption: 'Neural networks visualizing patterns.' },
      { type: 'note', content: 'Attention is all you need, but a good cape helps too!' }
    ]
  }
];

export const POWER_PLATFORM_ITEMS: PowerPlatformItem[] = [
  // ─────────────────────────────── Power Apps ───────────────────────────────
  {
    id: 'pp-app-1',
    title: 'Internal Orders & Quotations Manager',
    description:
      'Internal management Power App for a team to create and manage Orders and Quotations under a single workspace. Two dedicated sections (Orders, Quotations) with full version history and edit tracking. Data is persisted to SharePoint Lists and Document Libraries, so the team gets a structured, auditable record of every transaction.',
    category: 'Power Apps',
    images: [],
    color: '#742774',
    link: '',
  },
  {
    id: 'pp-app-2',
    title: 'Org-Wide Digitization App (Dataverse)',
    description:
      'A complex digitization Power App for an organization that consolidates multiple business pages into a single sidebar navigation. The sidebar hosts multiple vertical galleries — users can pick any page and start filling its form right there. Backed by a deeply structured Dataverse schema for relational, scalable storage across all digitized processes.',
    category: 'Power Apps',
    images: [],
    color: '#A93BA9',
    link: '',
  },

  // ───────────────────────────── Power Automate ─────────────────────────────
  {
    id: 'pp-pa-1',
    title: 'Forms → OneDrive Upload Request',
    description:
      'Triggered by a new Microsoft Forms response, this flow generates a unique Request ID from the current date/time, creates a placeholder file in OneDrive (Uploads folder) named with that ID, waits briefly, generates an org-wide share link, logs the request into a SharePoint list, and emails the requester the secure upload link — fully automating file request handling and record-keeping.',
    category: 'Power Automate',
    images: [],
    color: '#0066FF',
    link: '',
  },
  {
    id: 'pp-pa-2',
    title: 'OneDrive Upload → SharePoint Link Sync',
    description:
      'When a file is created in a specific OneDrive folder, the flow splits the file path to extract a unique identifier, generates a shareable link, queries a SharePoint list for related items using that identifier, and updates every matching item with the new file link — keeping OneDrive uploads and SharePoint records perfectly in sync.',
    category: 'Power Automate',
    images: [],
    color: '#1976D2',
    link: '',
  },
  {
    id: 'pp-pa-3',
    title: 'Vendor Onboarding Automation',
    description:
      'Forms-triggered vendor onboarding flow that parses PAN, GST, MSME and Cheque document links, generates a unique Vendor ID, creates a dedicated SharePoint folder, downloads and re-uploads every document, generates per-document share links, writes a consolidated SharePoint list item, and kicks off an approval with all links attached — a fully auditable, end-to-end onboarding pipeline.',
    category: 'Power Automate',
    images: [],
    color: '#388E3C',
    link: '',
  },
  {
    id: 'pp-pa-4',
    title: 'Power Apps → SharePoint File Upload',
    description:
      'Invoked from a Power App, this flow accepts a file payload, creates it inside a specified SharePoint document library folder, retrieves the file properties including its URL, and responds back to the calling Power App with the URL — providing a clean bridge between Power Apps and SharePoint storage.',
    category: 'Power Automate',
    images: [],
    color: '#0288D1',
    link: '',
  },
  {
    id: 'pp-pa-5',
    title: 'Quotation Approval Flow',
    description:
      'Triggered from Power Apps with company name, salesperson, file link and file ID. It starts an approval routed to a designated approver and, based on the response, updates the related SharePoint item status to “Approved” or “Rejected” — automating and tracking the quotation review lifecycle end-to-end.',
    category: 'Power Automate',
    images: [],
    color: '#E53935',
    link: '',
  },
  {
    id: 'pp-pa-6',
    title: 'Reportix — Dataverse to Word/PDF Report Generator',
    description:
      'A Cloud Flow that accepts a ReportID from Power Apps and pulls report headers, testing procedures, device particulars, energy source lines and checklist responses from Dataverse. Uses nested loops and array manipulation to organize checklist templates, populates a Word template, saves it to OneDrive, converts to PDF and stores it in a designated folder — fully automating testing report generation.',
    category: 'Power Automate',
    images: [],
    color: '#1565C0',
    link: '',
  },
  {
    id: 'pp-pa-7',
    title: 'AI Builder Email Auto-Reply',
    description:
      'Manually triggered flow that runs over a list of users, obtains a Microsoft Graph access token, pulls each user’s unread emails, ensures an “AI-Replies” folder exists, converts each email body from HTML to text, prompts AI Builder to draft a reply, saves it as a draft in “AI-Replies” and marks the source mail as read — an AI-assisted inbox-zero helper.',
    category: 'Power Automate',
    images: [],
    color: '#7B1FA2',
    link: '',
  },
  {
    id: 'pp-pa-8',
    title: 'Excel Company Enrichment (CIN Lookup)',
    description:
      'Manually triggered flow that reads company data from an Excel file in OneDrive, iterates each company name, calls an external company-search HTTP API, parses the response to extract details such as CIN, and writes the enriched values back into the original Excel — fully automated data enrichment for company records.',
    category: 'Power Automate',
    images: [],
    color: '#2E7D32',
    link: '',
  },
  {
    id: 'pp-pa-9',
    title: 'Excel CIN → Revenue Enrichment',
    description:
      'Reads an Excel table from OneDrive and collects all CIN values, then for each CIN calls an external HTTP endpoint to fetch revenue data and updates the corresponding row back in Excel — keeping company revenue figures continuously up to date from an external API.',
    category: 'Power Automate',
    images: [],
    color: '#558B2F',
    link: '',
  },
  {
    id: 'pp-pa-10',
    title: 'Shared Mailbox → Planner + SharePoint + Teams',
    description:
      'Monitors a shared mailbox and, when a new email arrives, branches on attachments. If present: creates a Planner task, spins up a SharePoint folder named with subject + timestamp, saves all attachments there, generates a share link, converts the email body to plain text into the task, emails the sender a confirmation, and posts a Teams message. If no attachments, prompts the sender to resend with the file — a full ticket-intake automation.',
    category: 'Power Automate',
    images: [],
    color: '#F57C00',
    link: '',
  },
  {
    id: 'pp-pa-11',
    title: 'Partner Center Customer Sync',
    description:
      'Manually triggered flow that authenticates with Microsoft Partner Center via OAuth2, retrieves an access token, fetches the customer list from the Partner Center API, parses the response, and loops through each customer to collect Tenant ID, Company Name and Delegated Access status into an array variable — ready for downstream processing or reporting.',
    category: 'Power Automate',
    images: [],
    color: '#00838F',
    link: '',
  },
  {
    id: 'pp-pa-12',
    title: 'External Email Allowance (Azure Automation)',
    description:
      'Forms-triggered flow to add a new mail contact in Microsoft 365: retrieves the form response, invokes an Azure Automation runbook to create the contact, polls for the runbook job output, and sends a confirmation email back to the requester — providing a seamless, auditable workflow for managing external email allowances.',
    category: 'Power Automate',
    images: [],
    color: '#0277BD',
    link: '',
  },
  {
    id: 'pp-pa-13',
    title: 'GDAP Invitation Automation',
    description:
      'Streamlines granting Granular Delegated Admin Privileges via Microsoft Forms and Microsoft Graph. Parses form responses (company, roles, responder, date), maps roles into Graph-required formats and descriptions, obtains an OAuth2 token, creates the GDAP relationship, handles duplicate-username conflicts, and emails the responder an approval link with full role + duration details.',
    category: 'Power Automate',
    images: [],
    color: '#5E35B1',
    link: '',
  },
  {
    id: 'pp-pa-14',
    title: 'Manual Approval with Switch Routing',
    description:
      'Manually triggered flow that introduces a short delay, then starts a text approval sent to a designated reviewer. Uses a Switch action on the accepted text (e.g. “apple”) to route into different scoped branches, each carrying its own conditional logic — a reusable pattern for approval-driven workflow branching.',
    category: 'Power Automate',
    images: [],
    color: '#D81B60',
    link: '',
  },
  {
    id: 'pp-pa-15',
    title: 'Subscription Renewal Reminder',
    description:
      'Reads a subscription table from Excel, computes each subscription end date, and checks whether today is exactly 45 days before renewal. When the window hits, it sends a personalized email reminder to the user — ensuring no service interruption due to missed renewal dates.',
    category: 'Power Automate',
    images: [],
    color: '#FB8C00',
    link: '',
  },
  {
    id: 'pp-pa-16',
    title: 'Delegated Admin Onboarding (Graph)',
    description:
      'Forms-triggered flow that extracts the responder’s email and company, maps selected roles to Graph role-definition IDs, requests an Azure AD token via client credentials, creates a delegated admin relationship in Microsoft Graph with the chosen roles, and emails the responder an acceptance link with role + duration details — a secure, automated delegated-admin onboarding process.',
    category: 'Power Automate',
    images: [],
    color: '#3949AB',
    link: '',
  },
  {
    id: 'pp-pa-17',
    title: 'Leave Approval Flow',
    description:
      'End-to-end leave workflow built on Microsoft Forms, SharePoint and Outlook. On submission, the flow retrieves the response and user profile, routes an approval to the manager, and on approval logs the request to a SharePoint list and emails the requester. On rejection, it emails the requester the manager’s comments — clean approvals, tracking and notifications in one flow.',
    category: 'Power Automate',
    images: [],
    color: '#00897B',
    link: '',
  },
  {
    id: 'pp-pa-18',
    title: 'Event Registration → Calendar Event',
    description:
      'Watches the Inbox for emails from specific senders with subjects like “Registration Confirmation” or “Event Details”. When matched, converts the HTML body to plain text, extracts the event date and time, and automatically creates a calendar event — turning registration confirmations into actual calendar entries with zero manual effort.',
    category: 'Power Automate',
    images: [],
    color: '#6D4C41',
    link: '',
  },

  // ───────────────────────────── Copilot Studio ─────────────────────────────
  {
    id: 'pp-cp-1',
    title: 'Copilot Agent — SharePoint File Counter',
    description:
      'Cloud Flow exposed to a Copilot agent. When invoked from Copilot, it connects to a SharePoint site, lists files from a specified document library, computes the total count (subtracting one to exclude the header/unwanted item), and responds back to Copilot — giving end users instant, conversational file counts on demand.',
    category: 'Copilot Studio',
    images: [],
    color: '#00A4EF',
    link: '',
  },
];

export const CARTOON_ICONS = [
  { id: 'shinchan', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Shinchan&backgroundColor=FFD600', x: 5, y: 15, scale: 1.2 },
  { id: 'doraemon', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Doraemon&backgroundColor=00A1FF', x: 85, y: 25, scale: 1.5 },
  { id: 'ninja', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ninja&backgroundColor=6B4BFF', x: 15, y: 75, scale: 1.1 },
  { id: 'pika', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Pikachu&backgroundColor=FFD600', x: 80, y: 85, scale: 1.3 },
];
