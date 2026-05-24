// Inline SVG service logos for Microsoft / Power Platform connectors.
// Stylized but recognizable — drawn natively in SVG, no external assets.
import React from 'react';
import type { ServiceName } from '../data/powerFlows';

type Props = { service: ServiceName; size?: number };

const wrap = (size: number, bg: string, children: React.ReactNode, rounded = 6) => (
  <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <rect x="0" y="0" width="32" height="32" rx={rounded} fill={bg} />
    {children}
  </svg>
);

export const ServiceIcon: React.FC<Props> = ({ service, size = 32 }) => {
  switch (service) {
    case 'forms':
      // purple square + check marks
      return wrap(size, '#7719AA', (
        <g>
          <rect x="7" y="9" width="3" height="3" fill="#fff" />
          <rect x="12" y="10" width="13" height="1.5" fill="#fff" />
          <rect x="7" y="14.5" width="3" height="3" fill="#fff" />
          <rect x="12" y="15.5" width="13" height="1.5" fill="#fff" />
          <rect x="7" y="20" width="3" height="3" fill="#fff" />
          <rect x="12" y="21" width="10" height="1.5" fill="#fff" />
        </g>
      ));

    case 'onedrive':
      // cloud silhouette
      return wrap(size, '#0364B8', (
        <path d="M 9 22 C 5.5 22 4 19 5 17 C 4 13 9 11 11 13 C 12 9 19 9 20 13 C 24 12 27 16 25 19 C 27 22 23 23 22 22 Z" fill="#fff" />
      ));

    case 'sharepoint':
      // overlapping circles
      return wrap(size, '#038387', (
        <g>
          <circle cx="13" cy="13" r="5" fill="#fff" />
          <circle cx="19" cy="18" r="5" fill="#fff" opacity="0.75" />
          <circle cx="14" cy="21" r="4" fill="#fff" opacity="0.55" />
        </g>
      ));

    case 'outlook':
      // O + envelope
      return wrap(size, '#0078D4', (
        <g>
          <rect x="14" y="10" width="14" height="12" rx="1.5" fill="#fff" />
          <path d="M 14 10 L 21 16 L 28 10" stroke="#0078D4" strokeWidth="1.5" fill="none" />
          <rect x="3" y="8" width="14" height="16" rx="2" fill="#0364B8" />
          <text x="10" y="20" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff" fontFamily="Arial">O</text>
        </g>
      ));

    case 'teams':
      // T tile
      return wrap(size, '#4B53BC', (
        <g>
          <rect x="5" y="8" width="14" height="16" rx="2" fill="#fff" />
          <rect x="8" y="10.5" width="8" height="2" fill="#4B53BC" />
          <rect x="11" y="12.5" width="2" height="9" fill="#4B53BC" />
          <circle cx="23" cy="13" r="4" fill="#fff" />
          <text x="23" y="16" textAnchor="middle" fontSize="6" fontWeight="900" fill="#4B53BC" fontFamily="Arial">T</text>
        </g>
      ));

    case 'excel':
      // green X
      return wrap(size, '#107C41', (
        <g>
          <rect x="5" y="7" width="22" height="18" rx="1.5" fill="#fff" />
          <rect x="5" y="7" width="22" height="4" fill="#107C41" />
          <text x="16" y="22" textAnchor="middle" fontSize="13" fontWeight="900" fill="#107C41" fontFamily="Arial">X</text>
        </g>
      ));

    case 'word':
      // blue W
      return wrap(size, '#185ABD', (
        <g>
          <rect x="5" y="7" width="22" height="18" rx="1.5" fill="#fff" />
          <rect x="5" y="7" width="22" height="4" fill="#185ABD" />
          <text x="16" y="22" textAnchor="middle" fontSize="11" fontWeight="900" fill="#185ABD" fontFamily="Arial">W</text>
        </g>
      ));

    case 'powerapps':
      // purple/pink hex-ish
      return wrap(size, '#742774', (
        <g>
          <path d="M 16 6 L 25 11 L 25 21 L 16 26 L 7 21 L 7 11 Z" fill="#fff" />
          <path d="M 16 10 L 21 13 L 21 19 L 16 22 L 11 19 L 11 13 Z" fill="#742774" />
        </g>
      ));

    case 'automate':
      // PA 4-arrow diamond
      return wrap(size, '#0066FF', (
        <g>
          <path d="M 16 4 L 28 16 L 16 28 L 4 16 Z" fill="#fff" opacity="0.95" />
          <path d="M 16 8 L 24 16 L 16 24 L 8 16 Z" fill="#0066FF" />
          <path d="M 16 11 L 21 16 L 16 21 L 11 16 Z" fill="#fff" opacity="0.85" />
        </g>
      ));

    case 'dataverse':
      // cylinder/db
      return wrap(size, '#742774', (
        <g>
          <ellipse cx="16" cy="9" rx="9" ry="3" fill="#fff" />
          <path d="M 7 9 L 7 22 C 7 24 11 25.5 16 25.5 C 21 25.5 25 24 25 22 L 25 9" fill="#fff" />
          <ellipse cx="16" cy="9" rx="9" ry="3" fill="none" stroke="#742774" strokeWidth="1" />
          <ellipse cx="16" cy="15" rx="9" ry="3" fill="none" stroke="#742774" strokeWidth="1" />
          <ellipse cx="16" cy="21" rx="9" ry="3" fill="none" stroke="#742774" strokeWidth="1" />
        </g>
      ));

    case 'aibuilder':
      // purple sparkle
      return wrap(size, '#5C2D91', (
        <g>
          <path d="M 16 6 L 18 14 L 26 16 L 18 18 L 16 26 L 14 18 L 6 16 L 14 14 Z" fill="#fff" />
          <circle cx="24" cy="9" r="2" fill="#fff" opacity="0.85" />
          <circle cx="8" cy="24" r="1.5" fill="#fff" opacity="0.7" />
        </g>
      ));

    case 'approvals':
      // green check badge
      return wrap(size, '#107C10', (
        <g>
          <circle cx="16" cy="16" r="10" fill="#fff" />
          <path d="M 10 16 L 14 20 L 22 12" stroke="#107C10" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ));

    case 'control':
      // branching arrows
      return wrap(size, '#F0A30A', (
        <g>
          <path d="M 16 6 L 16 14 M 16 14 L 8 22 M 16 14 L 24 22" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="16" cy="6" r="2.5" fill="#fff" />
          <circle cx="8" cy="22" r="2.5" fill="#fff" />
          <circle cx="24" cy="22" r="2.5" fill="#fff" />
        </g>
      ));

    case 'variable':
      // {x}
      return wrap(size, '#0078D4', (
        <text x="16" y="22" textAnchor="middle" fontSize="16" fontWeight="900" fill="#fff" fontFamily="Georgia">{'{x}'}</text>
      ));

    case 'compose':
      // gear
      return wrap(size, '#0066FF', (
        <g>
          <circle cx="16" cy="16" r="5" fill="none" stroke="#fff" strokeWidth="2" />
          <g stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <line x1="16" y1="5" x2="16" y2="9" />
            <line x1="16" y1="23" x2="16" y2="27" />
            <line x1="5" y1="16" x2="9" y2="16" />
            <line x1="23" y1="16" x2="27" y2="16" />
            <line x1="8.5" y1="8.5" x2="11" y2="11" />
            <line x1="21" y1="21" x2="23.5" y2="23.5" />
            <line x1="23.5" y1="8.5" x2="21" y2="11" />
            <line x1="11" y1="21" x2="8.5" y2="23.5" />
          </g>
        </g>
      ));

    case 'schedule':
      // clock
      return wrap(size, '#D24726', (
        <g>
          <circle cx="16" cy="16" r="10" fill="#fff" />
          <line x1="16" y1="16" x2="16" y2="9" stroke="#D24726" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="16" x2="21" y2="18" stroke="#D24726" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="16" cy="16" r="1.5" fill="#D24726" />
        </g>
      ));

    case 'http':
      // globe
      return wrap(size, '#5C5C5C', (
        <g>
          <circle cx="16" cy="16" r="9" fill="none" stroke="#fff" strokeWidth="2" />
          <ellipse cx="16" cy="16" rx="4.5" ry="9" fill="none" stroke="#fff" strokeWidth="1.5" />
          <line x1="7" y1="16" x2="25" y2="16" stroke="#fff" strokeWidth="1.5" />
        </g>
      ));

    case 'graph':
      // multi-color graph (4 panels)
      return wrap(size, '#000', (
        <g>
          <path d="M 16 4 L 28 10 L 28 22 L 16 28 L 4 22 L 4 10 Z" fill="#fff" />
          <path d="M 16 4 L 28 10 L 16 16 Z" fill="#7FBA00" />
          <path d="M 28 10 L 28 22 L 16 16 Z" fill="#FFB900" />
          <path d="M 28 22 L 16 28 L 16 16 Z" fill="#F25022" />
          <path d="M 16 28 L 4 22 L 16 16 Z" fill="#00A4EF" />
          <path d="M 4 22 L 4 10 L 16 16 Z" fill="#5C2D91" />
          <path d="M 4 10 L 16 4 L 16 16 Z" fill="#0078D4" />
        </g>
      ));

    case 'azure':
      // azure cloud A
      return wrap(size, '#0089D6', (
        <g>
          <path d="M 6 24 L 14 8 L 18 8 L 13 18 L 19 18 L 16 24 Z" fill="#fff" />
          <path d="M 19 18 L 22 12 L 27 24 L 16 24 Z" fill="#fff" opacity="0.8" />
        </g>
      ));

    case 'azuread':
      // shield
      return wrap(size, '#0078D4', (
        <g>
          <path d="M 16 5 L 26 9 L 26 17 C 26 22 21 26 16 27 C 11 26 6 22 6 17 L 6 9 Z" fill="#fff" />
          <text x="16" y="20" textAnchor="middle" fontSize="10" fontWeight="900" fill="#0078D4" fontFamily="Arial">AD</text>
        </g>
      ));

    case 'planner':
      // clipboard
      return wrap(size, '#31752F', (
        <g>
          <rect x="7" y="7" width="18" height="20" rx="1.5" fill="#fff" />
          <rect x="11" y="5" width="10" height="4" rx="1" fill="#fff" />
          <rect x="11" y="5" width="10" height="4" rx="1" fill="none" stroke="#31752F" strokeWidth="1" />
          <line x1="11" y1="14" x2="21" y2="14" stroke="#31752F" strokeWidth="1.5" />
          <line x1="11" y1="18" x2="21" y2="18" stroke="#31752F" strokeWidth="1.5" />
          <line x1="11" y1="22" x2="18" y2="22" stroke="#31752F" strokeWidth="1.5" />
        </g>
      ));

    case 'copilot':
      // Copilot wavy ribbon
      return wrap(size, '#0066FF', (
        <g>
          <path d="M 6 14 Q 10 6 16 10 Q 22 14 26 8 L 26 18 Q 22 24 16 20 Q 10 16 6 22 Z" fill="#fff" />
          <circle cx="11" cy="14" r="1.5" fill="#0066FF" />
          <circle cx="21" cy="16" r="1.5" fill="#0066FF" />
        </g>
      ));

    case 'content':
      // document with arrow
      return wrap(size, '#605E5C', (
        <g>
          <rect x="6" y="6" width="14" height="18" rx="1" fill="#fff" />
          <line x1="9" y1="11" x2="17" y2="11" stroke="#605E5C" strokeWidth="1.5" />
          <line x1="9" y1="15" x2="17" y2="15" stroke="#605E5C" strokeWidth="1.5" />
          <line x1="9" y1="19" x2="14" y2="19" stroke="#605E5C" strokeWidth="1.5" />
          <path d="M 21 16 L 26 16 M 23.5 13.5 L 26 16 L 23.5 18.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ));

    case 'users':
      // person
      return wrap(size, '#0078D4', (
        <g>
          <circle cx="16" cy="12" r="5" fill="#fff" />
          <path d="M 6 26 C 6 20 11 17 16 17 C 21 17 26 20 26 26 Z" fill="#fff" />
        </g>
      ));

    case 'partner':
      // handshake / globe with arrows
      return wrap(size, '#0E5A8A', (
        <g>
          <circle cx="16" cy="16" r="9" fill="#fff" />
          <path d="M 10 14 L 14 18 L 22 10" stroke="#0E5A8A" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="16" cy="16" r="9" fill="none" stroke="#0E5A8A" strokeWidth="1" opacity="0.3" />
        </g>
      ));

    default:
      return wrap(size, '#999', null);
  }
};

// Friendly display name for tooltip / preview
export const SERVICE_DISPLAY: Record<ServiceName, string> = {
  forms: 'Microsoft Forms',
  onedrive: 'OneDrive',
  sharepoint: 'SharePoint',
  outlook: 'Outlook',
  teams: 'Teams',
  excel: 'Excel',
  word: 'Word',
  powerapps: 'Power Apps',
  automate: 'Power Automate',
  dataverse: 'Dataverse',
  aibuilder: 'AI Builder',
  approvals: 'Approvals',
  control: 'Control',
  variable: 'Variable',
  compose: 'Compose',
  schedule: 'Schedule',
  http: 'HTTP',
  graph: 'Microsoft Graph',
  azure: 'Azure Automation',
  azuread: 'Azure AD',
  planner: 'Planner',
  copilot: 'Copilot Studio',
  content: 'Content Conversion',
  users: 'Office 365 Users',
  partner: 'Partner Center',
};
