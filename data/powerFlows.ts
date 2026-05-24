// Power Automate / Copilot Studio flow definitions for in-app rendering.
// Each flow is a list of typed steps with the Microsoft service it uses.
// Rendered natively by <PowerFlowDiagram /> — no external images.

export type StepType = 'trigger' | 'action' | 'condition' | 'loop' | 'end';

export const STEP_TYPES: StepType[] = ['trigger', 'action', 'condition', 'loop', 'end'];

export type ServiceName =
  | 'forms' | 'onedrive' | 'sharepoint' | 'outlook' | 'teams'
  | 'excel' | 'word' | 'powerapps' | 'automate' | 'dataverse'
  | 'aibuilder' | 'approvals' | 'control' | 'variable' | 'compose'
  | 'schedule' | 'http' | 'graph' | 'azure' | 'azuread'
  | 'planner' | 'copilot' | 'content' | 'users' | 'partner';

export const SERVICE_NAMES: ServiceName[] = [
  'forms', 'onedrive', 'sharepoint', 'outlook', 'teams',
  'excel', 'word', 'powerapps', 'automate', 'dataverse',
  'aibuilder', 'approvals', 'control', 'variable', 'compose',
  'schedule', 'http', 'graph', 'azure', 'azuread',
  'planner', 'copilot', 'content', 'users', 'partner',
];

export interface FlowStep {
  type: StepType;
  service: ServiceName;
  label: string;
  sub: string;
}

export interface PowerFlow {
  id: string;
  title: string;
  steps: FlowStep[];
  /** force a two-column layout in the diagram (when space allows) */
  preferTwoColumn?: boolean;
}

export const POWER_FLOWS: Record<string, PowerFlow> = {
  // keyed by constants string ID (pp-pa-1, etc.)
  // Use POWER_FLOWS_BY_TITLE when item.id is a numeric DB id
  'pp-pa-1': {
    id: 'pp-pa-1',
    title: 'Forms → OneDrive Upload Request',
    preferTwoColumn: true,
    steps: [
      { type: 'trigger', service: 'forms',    label: 'When a new response is submitted', sub: 'Microsoft Forms' },
      { type: 'action',  service: 'forms',    label: 'Get response details',             sub: 'Microsoft Forms' },
      { type: 'action',  service: 'compose',  label: 'Compose — Generate Request ID',    sub: 'Data Operation' },
      { type: 'action',  service: 'onedrive', label: 'Create file in /Uploads',          sub: 'OneDrive for Business' },
      { type: 'action',  service: 'schedule', label: 'Delay 5 seconds',                  sub: 'Schedule' },
      { type: 'action',  service: 'onedrive', label: 'Create share link (organization)', sub: 'OneDrive for Business' },
      { type: 'action',  service: 'sharepoint', label: 'Create item — Upload Requests',  sub: 'SharePoint' },
      { type: 'end',     service: 'outlook',  label: 'Send email with upload link',      sub: 'Office 365 Outlook' },
    ],
  },
  'pp-pa-2': {
    id: 'pp-pa-2',
    title: 'OneDrive Upload → SharePoint Link Sync',
    steps: [
      { type: 'trigger', service: 'onedrive',   label: 'When a file is created (Uploads/)', sub: 'OneDrive for Business' },
      { type: 'action',  service: 'compose',    label: 'Split file path — extract ID',      sub: 'Data Operation' },
      { type: 'action',  service: 'onedrive',   label: 'Create share link (organization)',  sub: 'OneDrive for Business' },
      { type: 'action',  service: 'sharepoint', label: 'Get items — filter by ID',          sub: 'SharePoint' },
      { type: 'loop',    service: 'control',    label: 'Apply to each matching item',       sub: 'Control' },
      { type: 'end',     service: 'sharepoint', label: 'Update item — set file link',       sub: 'SharePoint' },
    ],
  },
  'pp-pa-3': {
    id: 'pp-pa-3',
    title: 'Vendor Onboarding Automation',
    steps: [
      { type: 'trigger', service: 'forms',      label: 'When a new response is submitted', sub: 'Microsoft Forms' },
      { type: 'action',  service: 'forms',      label: 'Get response details',             sub: 'Microsoft Forms' },
      { type: 'action',  service: 'compose',    label: 'Parse PAN / GST / MSME / Cheque',  sub: 'Data Operation' },
      { type: 'action',  service: 'compose',    label: 'Generate Vendor ID',               sub: 'Compose' },
      { type: 'action',  service: 'sharepoint', label: 'Create folder — /Vendors/<ID>',    sub: 'SharePoint' },
      { type: 'loop',    service: 'control',    label: 'For each document → upload',       sub: 'Control' },
      { type: 'action',  service: 'sharepoint', label: 'Create share links per doc',       sub: 'SharePoint' },
      { type: 'action',  service: 'sharepoint', label: 'Create item — Vendor Registry',    sub: 'SharePoint' },
      { type: 'end',     service: 'approvals',  label: 'Start approval — Vendor Review',   sub: 'Approvals' },
    ],
  },
  'pp-pa-4': {
    id: 'pp-pa-4',
    title: 'Power Apps → SharePoint File Upload',
    steps: [
      { type: 'trigger', service: 'powerapps',  label: 'PowerApps (V2) — file received', sub: 'Power Apps' },
      { type: 'action',  service: 'sharepoint', label: 'Create file in document library', sub: 'SharePoint' },
      { type: 'action',  service: 'sharepoint', label: 'Get file properties',             sub: 'SharePoint' },
      { type: 'end',     service: 'powerapps',  label: 'Respond to a PowerApp — URL',     sub: 'Power Apps' },
    ],
  },
  'pp-pa-5': {
    id: 'pp-pa-5',
    title: 'Quotation Approval Flow',
    steps: [
      { type: 'trigger',   service: 'powerapps',  label: 'PowerApps — company, file, ID',  sub: 'Power Apps' },
      { type: 'action',    service: 'approvals',  label: 'Start and wait — Approve quote', sub: 'Approvals' },
      { type: 'condition', service: 'control',    label: 'Condition: Outcome = Approve',   sub: 'Control' },
      { type: 'action',    service: 'sharepoint', label: 'If yes → Status = Approved',     sub: 'SharePoint' },
      { type: 'end',       service: 'sharepoint', label: 'If no → Status = Rejected',      sub: 'SharePoint' },
    ],
  },
  'pp-pa-6': {
    id: 'pp-pa-6',
    title: 'Reportix — Dataverse to Word/PDF',
    steps: [
      { type: 'trigger', service: 'powerapps',  label: 'PowerApps — ReportID',          sub: 'Power Apps' },
      { type: 'action',  service: 'dataverse', label: 'List rows — Headers',            sub: 'Dataverse' },
      { type: 'action',  service: 'dataverse', label: 'List rows — Procedures',         sub: 'Dataverse' },
      { type: 'action',  service: 'dataverse', label: 'List rows — Device particulars', sub: 'Dataverse' },
      { type: 'action',  service: 'dataverse', label: 'List rows — Energy lines',       sub: 'Dataverse' },
      { type: 'action',  service: 'dataverse', label: 'List rows — Checklist responses',sub: 'Dataverse' },
      { type: 'loop',    service: 'control',   label: 'Nested loops — build sections',  sub: 'Control' },
      { type: 'action',  service: 'word',      label: 'Populate Word template',         sub: 'Word Online' },
      { type: 'action',  service: 'onedrive',  label: 'Save .docx to OneDrive',         sub: 'OneDrive for Business' },
      { type: 'end',     service: 'onedrive',  label: 'Convert to PDF & store',         sub: 'OneDrive for Business' },
    ],
  },
  'pp-pa-7': {
    id: 'pp-pa-7',
    title: 'AI Builder Email Auto-Reply',
    steps: [
      { type: 'trigger',   service: 'automate',  label: 'Manually trigger a flow',          sub: 'Power Automate' },
      { type: 'action',    service: 'variable',  label: 'Initialize — user emails array',   sub: 'Variable' },
      { type: 'action',    service: 'http',      label: 'HTTP — get Graph access token',    sub: 'HTTP' },
      { type: 'loop',      service: 'control',   label: 'For each user',                    sub: 'Control' },
      { type: 'action',    service: 'graph',     label: 'Get unread emails',                sub: 'Microsoft Graph' },
      { type: 'condition', service: 'graph',     label: 'Ensure "AI-Replies" folder exists',sub: 'Microsoft Graph' },
      { type: 'action',    service: 'content',   label: 'HTML → plain text',                sub: 'Content Conversion' },
      { type: 'action',    service: 'aibuilder', label: 'AI Builder — generate reply',      sub: 'AI Builder' },
      { type: 'action',    service: 'graph',     label: 'Create draft in AI-Replies',       sub: 'Microsoft Graph' },
      { type: 'end',       service: 'graph',     label: 'Mark original as read',            sub: 'Microsoft Graph' },
    ],
  },
  'pp-pa-8': {
    id: 'pp-pa-8',
    title: 'Excel Company Enrichment (CIN Lookup)',
    steps: [
      { type: 'trigger', service: 'automate', label: 'Manually trigger a flow',       sub: 'Power Automate' },
      { type: 'action',  service: 'excel',    label: 'List rows present in a table',  sub: 'Excel Online' },
      { type: 'loop',    service: 'control',  label: 'For each company',              sub: 'Control' },
      { type: 'action',  service: 'http',     label: 'HTTP — search company API',     sub: 'HTTP' },
      { type: 'action',  service: 'compose',  label: 'Parse JSON — extract CIN',      sub: 'Data Operation' },
      { type: 'end',     service: 'excel',    label: 'Update a row — write CIN',      sub: 'Excel Online' },
    ],
  },
  'pp-pa-9': {
    id: 'pp-pa-9',
    title: 'Excel CIN → Revenue Enrichment',
    steps: [
      { type: 'trigger', service: 'automate', label: 'Manually trigger a flow',      sub: 'Power Automate' },
      { type: 'action',  service: 'excel',    label: 'List rows present in a table', sub: 'Excel Online' },
      { type: 'action',  service: 'variable', label: 'Collect all CIN values',       sub: 'Variable' },
      { type: 'loop',    service: 'control',  label: 'For each CIN',                 sub: 'Control' },
      { type: 'action',  service: 'http',     label: 'HTTP — fetch revenue',         sub: 'HTTP' },
      { type: 'end',     service: 'excel',    label: 'Update row — revenue',         sub: 'Excel Online' },
    ],
  },
  'pp-pa-10': {
    id: 'pp-pa-10',
    title: 'Shared Mailbox → Planner + SharePoint + Teams',
    steps: [
      { type: 'trigger',   service: 'outlook',    label: 'When a new email arrives (shared)', sub: 'Office 365 Outlook' },
      { type: 'condition', service: 'control',    label: 'Has attachments?',                  sub: 'Control' },
      { type: 'action',    service: 'planner',    label: 'Create a Planner task',             sub: 'Planner' },
      { type: 'action',    service: 'sharepoint', label: 'Create folder — subject+timestamp', sub: 'SharePoint' },
      { type: 'action',    service: 'sharepoint', label: 'Save all attachments',              sub: 'SharePoint' },
      { type: 'action',    service: 'sharepoint', label: 'Create folder share link',          sub: 'SharePoint' },
      { type: 'action',    service: 'planner',    label: 'HTML → text → append to task',      sub: 'Planner' },
      { type: 'action',    service: 'outlook',    label: 'Send confirmation email',           sub: 'Office 365 Outlook' },
      { type: 'end',       service: 'teams',      label: 'Post message in Teams',             sub: 'Microsoft Teams' },
    ],
  },
  'pp-pa-11': {
    id: 'pp-pa-11',
    title: 'Partner Center Customer Sync',
    steps: [
      { type: 'trigger', service: 'automate', label: 'Manually trigger a flow',           sub: 'Power Automate' },
      { type: 'action',  service: 'http',     label: 'HTTP — OAuth2 token',               sub: 'HTTP' },
      { type: 'action',  service: 'partner',  label: 'HTTP — GET customers',              sub: 'Partner Center API' },
      { type: 'action',  service: 'compose',  label: 'Parse JSON — customers',            sub: 'Data Operation' },
      { type: 'action',  service: 'variable', label: 'Initialize — customers array',      sub: 'Variable' },
      { type: 'loop',    service: 'control',  label: 'For each customer',                 sub: 'Control' },
      { type: 'end',     service: 'variable', label: 'Append Tenant ID + Company + DAP',  sub: 'Variable' },
    ],
  },
  'pp-pa-12': {
    id: 'pp-pa-12',
    title: 'External Email Allowance (Azure Automation)',
    steps: [
      { type: 'trigger', service: 'forms',   label: 'When a new response is submitted', sub: 'Microsoft Forms' },
      { type: 'action',  service: 'forms',   label: 'Get response details',             sub: 'Microsoft Forms' },
      { type: 'action',  service: 'azure',   label: 'Start runbook — Create Contact',   sub: 'Azure Automation' },
      { type: 'action',  service: 'azure',   label: 'Get job output',                   sub: 'Azure Automation' },
      { type: 'end',     service: 'outlook', label: 'Send confirmation email',          sub: 'Office 365 Outlook' },
    ],
  },
  'pp-pa-13': {
    id: 'pp-pa-13',
    title: 'GDAP Invitation Automation',
    steps: [
      { type: 'trigger',   service: 'forms',   label: 'When a new response is submitted', sub: 'Microsoft Forms' },
      { type: 'action',    service: 'forms',   label: 'Get response details',             sub: 'Microsoft Forms' },
      { type: 'action',    service: 'compose', label: 'Parse roles → Graph format',       sub: 'Data Operation' },
      { type: 'action',    service: 'http',    label: 'HTTP — OAuth2 token',              sub: 'HTTP' },
      { type: 'action',    service: 'graph',   label: 'POST — Create GDAP relationship',  sub: 'Microsoft Graph' },
      { type: 'condition', service: 'control', label: 'Duplicate username?',              sub: 'Control' },
      { type: 'end',       service: 'outlook', label: 'Send approval link email',         sub: 'Office 365 Outlook' },
    ],
  },
  'pp-pa-14': {
    id: 'pp-pa-14',
    title: 'Manual Approval with Switch Routing',
    steps: [
      { type: 'trigger',   service: 'automate',  label: 'Manually trigger a flow',         sub: 'Power Automate' },
      { type: 'action',    service: 'schedule',  label: 'Delay (short)',                   sub: 'Schedule' },
      { type: 'action',    service: 'approvals', label: 'Start and wait — Text approval',  sub: 'Approvals' },
      { type: 'condition', service: 'control',   label: 'Switch on accepted text',         sub: 'Control' },
      { type: 'action',    service: 'control',   label: 'Case "apple" → Scope',            sub: 'Control' },
      { type: 'end',       service: 'control',   label: 'Default → Scope',                 sub: 'Control' },
    ],
  },
  'pp-pa-15': {
    id: 'pp-pa-15',
    title: 'Subscription Renewal Reminder',
    steps: [
      { type: 'trigger',   service: 'automate', label: 'Manually trigger a flow',  sub: 'Power Automate' },
      { type: 'action',    service: 'excel',    label: 'List rows — subscriptions',sub: 'Excel Online' },
      { type: 'loop',      service: 'control',  label: 'For each row',             sub: 'Control' },
      { type: 'action',    service: 'compose',  label: 'Compute end date',         sub: 'Compose' },
      { type: 'condition', service: 'control',  label: 'Today = end date − 45?',   sub: 'Control' },
      { type: 'end',       service: 'outlook',  label: 'Send renewal reminder email', sub: 'Office 365 Outlook' },
    ],
  },
  'pp-pa-16': {
    id: 'pp-pa-16',
    title: 'Delegated Admin Onboarding (Graph)',
    steps: [
      { type: 'trigger', service: 'forms',   label: 'When a new response is submitted', sub: 'Microsoft Forms' },
      { type: 'action',  service: 'forms',   label: 'Get response details',             sub: 'Microsoft Forms' },
      { type: 'action',  service: 'compose', label: 'Map roles → definition IDs',       sub: 'Data Operation' },
      { type: 'action',  service: 'azuread', label: 'HTTP — token (client creds)',      sub: 'Azure AD' },
      { type: 'action',  service: 'graph',   label: 'POST — Create delegated relation', sub: 'Microsoft Graph' },
      { type: 'end',     service: 'outlook', label: 'Send acceptance link email',       sub: 'Office 365 Outlook' },
    ],
  },
  'pp-pa-17': {
    id: 'pp-pa-17',
    title: 'Leave Approval Flow',
    steps: [
      { type: 'trigger',   service: 'forms',      label: 'When a new response is submitted', sub: 'Microsoft Forms' },
      { type: 'action',    service: 'forms',      label: 'Get response details',             sub: 'Microsoft Forms' },
      { type: 'action',    service: 'users',      label: 'Get user profile (V2)',            sub: 'Office 365 Users' },
      { type: 'action',    service: 'approvals',  label: 'Start and wait — Manager approval',sub: 'Approvals' },
      { type: 'condition', service: 'control',    label: 'Outcome = Approve?',               sub: 'Control' },
      { type: 'action',    service: 'sharepoint', label: 'Create item — Leave Log',          sub: 'SharePoint' },
      { type: 'end',       service: 'outlook',    label: 'Email requester (approve/reject)', sub: 'Office 365 Outlook' },
    ],
  },
  'pp-pa-18': {
    id: 'pp-pa-18',
    title: 'Event Registration → Calendar Event',
    steps: [
      { type: 'trigger',   service: 'outlook', label: 'When a new email arrives',  sub: 'Office 365 Outlook' },
      { type: 'condition', service: 'control', label: 'Sender / Subject matches?', sub: 'Control' },
      { type: 'action',    service: 'content', label: 'HTML body → plain text',    sub: 'Content Conversion' },
      { type: 'action',    service: 'compose', label: 'Extract event date & time', sub: 'Compose' },
      { type: 'end',       service: 'outlook', label: 'Create event (V4)',         sub: 'Office 365 Outlook' },
    ],
  },
  'pp-cp-1': {
    id: 'pp-cp-1',
    title: 'Copilot Agent — SharePoint File Counter',
    steps: [
      { type: 'trigger', service: 'copilot',    label: 'When a Copilot agent calls the flow', sub: 'Copilot Studio' },
      { type: 'action',  service: 'sharepoint', label: 'List files (properties only)',        sub: 'SharePoint' },
      { type: 'action',  service: 'compose',    label: 'Compose — length() − 1',              sub: 'Data Operation' },
      { type: 'end',     service: 'copilot',    label: 'Respond to the agent — count',        sub: 'Copilot Studio' },
    ],
  },
};

// Title-indexed lookup — use this when the item.id is a numeric DB id (not pp-pa-1 etc.)
export const POWER_FLOWS_BY_TITLE: Record<string, PowerFlow> = Object.fromEntries(
  Object.values(POWER_FLOWS).map(f => [f.title, f])
);
