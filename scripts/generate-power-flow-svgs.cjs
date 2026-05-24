// Generates Power Automate-style SVG flow diagrams for every Power Platform item.
// Run with: node scripts/generate-power-flow-svgs.cjs
// Outputs SVGs to public/power-flows/<id>.svg

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.resolve(__dirname, '..', 'public', 'power-flows');
fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Flow definitions ────────────────────────────────────────────────────────
// type colors:  trigger=red, action=blue, condition=yellow, loop=purple, end=teal
const FLOWS = [
  {
    id: 'pp-pa-1',
    title: 'Forms → OneDrive Upload Request',
    steps: [
      { type: 'trigger',   icon: '📝', label: 'When a new response is submitted', sub: 'Microsoft Forms' },
      { type: 'action',    icon: '📋', label: 'Get response details',              sub: 'Microsoft Forms' },
      { type: 'action',    icon: '🔧', label: 'Compose — Generate Request ID',     sub: 'Data Operation' },
      { type: 'action',    icon: '☁️', label: 'Create file in /Uploads',           sub: 'OneDrive for Business' },
      { type: 'action',    icon: '⏱️', label: 'Delay 5 seconds',                   sub: 'Schedule' },
      { type: 'action',    icon: '🔗', label: 'Create share link (organization)',  sub: 'OneDrive for Business' },
      { type: 'action',    icon: '📊', label: 'Create item — Upload Requests',     sub: 'SharePoint' },
      { type: 'end',       icon: '📧', label: 'Send email with upload link',       sub: 'Office 365 Outlook' },
    ],
  },
  {
    id: 'pp-pa-2',
    title: 'OneDrive Upload → SharePoint Link Sync',
    steps: [
      { type: 'trigger',   icon: '☁️', label: 'When a file is created (Uploads/)', sub: 'OneDrive for Business' },
      { type: 'action',    icon: '✂️', label: 'Split file path → extract ID',      sub: 'Data Operation' },
      { type: 'action',    icon: '🔗', label: 'Create share link (organization)',  sub: 'OneDrive for Business' },
      { type: 'action',    icon: '📊', label: 'Get items — filter by ID',          sub: 'SharePoint' },
      { type: 'loop',      icon: '🔄', label: 'Apply to each matching item',       sub: 'Control' },
      { type: 'end',       icon: '✏️', label: 'Update item — set file link',       sub: 'SharePoint' },
    ],
  },
  {
    id: 'pp-pa-3',
    title: 'Vendor Onboarding Automation',
    steps: [
      { type: 'trigger',   icon: '📝', label: 'When a new response is submitted',  sub: 'Microsoft Forms' },
      { type: 'action',    icon: '📋', label: 'Get response details',              sub: 'Microsoft Forms' },
      { type: 'action',    icon: '🧩', label: 'Parse PAN / GST / MSME / Cheque',   sub: 'Data Operation' },
      { type: 'action',    icon: '🔧', label: 'Generate Vendor ID',                sub: 'Compose' },
      { type: 'action',    icon: '📁', label: 'Create folder — /Vendors/<ID>',     sub: 'SharePoint' },
      { type: 'loop',      icon: '🔄', label: 'For each document → upload',        sub: 'Control' },
      { type: 'action',    icon: '🔗', label: 'Create share links per doc',        sub: 'SharePoint' },
      { type: 'action',    icon: '📊', label: 'Create item — Vendor Registry',     sub: 'SharePoint' },
      { type: 'end',       icon: '✅', label: 'Start approval — Vendor Review',    sub: 'Approvals' },
    ],
  },
  {
    id: 'pp-pa-4',
    title: 'Power Apps → SharePoint File Upload',
    steps: [
      { type: 'trigger',   icon: '⚡', label: 'PowerApps (V2) — file received',    sub: 'Power Apps' },
      { type: 'action',    icon: '📊', label: 'Create file in document library',   sub: 'SharePoint' },
      { type: 'action',    icon: 'ℹ️', label: 'Get file properties',               sub: 'SharePoint' },
      { type: 'end',       icon: '↩️', label: 'Respond to a PowerApp — URL',       sub: 'Power Apps' },
    ],
  },
  {
    id: 'pp-pa-5',
    title: 'Quotation Approval Flow',
    steps: [
      { type: 'trigger',   icon: '⚡', label: 'PowerApps — company, file, ID',     sub: 'Power Apps' },
      { type: 'action',    icon: '✅', label: 'Start and wait — Approve quote',    sub: 'Approvals' },
      { type: 'condition', icon: '◇',  label: 'Condition: Outcome = Approve',      sub: 'Control' },
      { type: 'action',    icon: '✏️', label: 'If yes → Status = Approved',        sub: 'SharePoint' },
      { type: 'end',       icon: '✏️', label: 'If no → Status = Rejected',         sub: 'SharePoint' },
    ],
  },
  {
    id: 'pp-pa-6',
    title: 'Reportix — Dataverse to Word/PDF',
    steps: [
      { type: 'trigger',   icon: '⚡', label: 'PowerApps — ReportID',              sub: 'Power Apps' },
      { type: 'action',    icon: '🗄️', label: 'List rows — Headers',               sub: 'Dataverse' },
      { type: 'action',    icon: '🗄️', label: 'List rows — Procedures',            sub: 'Dataverse' },
      { type: 'action',    icon: '🗄️', label: 'List rows — Device particulars',   sub: 'Dataverse' },
      { type: 'action',    icon: '🗄️', label: 'List rows — Energy lines',          sub: 'Dataverse' },
      { type: 'action',    icon: '🗄️', label: 'List rows — Checklist responses',  sub: 'Dataverse' },
      { type: 'loop',      icon: '🔄', label: 'Nested loops — build sections',     sub: 'Control' },
      { type: 'action',    icon: '📄', label: 'Populate Word template',            sub: 'Word Online' },
      { type: 'action',    icon: '☁️', label: 'Save .docx to OneDrive',            sub: 'OneDrive for Business' },
      { type: 'end',       icon: '📑', label: 'Convert to PDF & store',            sub: 'OneDrive for Business' },
    ],
  },
  {
    id: 'pp-pa-7',
    title: 'AI Builder Email Auto-Reply',
    steps: [
      { type: 'trigger',   icon: '👆', label: 'Manually trigger a flow',           sub: 'Power Automate' },
      { type: 'action',    icon: '📝', label: 'Initialize — user emails array',    sub: 'Variable' },
      { type: 'action',    icon: '🔑', label: 'HTTP — get Graph access token',     sub: 'HTTP' },
      { type: 'loop',      icon: '🔄', label: 'For each user',                     sub: 'Control' },
      { type: 'action',    icon: '📧', label: 'Get unread emails',                 sub: 'Microsoft Graph' },
      { type: 'condition', icon: '📁', label: 'Ensure "AI-Replies" folder exists', sub: 'Microsoft Graph' },
      { type: 'action',    icon: '🔤', label: 'HTML → plain text',                 sub: 'Content Conversion' },
      { type: 'action',    icon: '🤖', label: 'AI Builder — generate reply',       sub: 'AI Builder' },
      { type: 'action',    icon: '💾', label: 'Create draft in AI-Replies',        sub: 'Microsoft Graph' },
      { type: 'end',       icon: '✅', label: 'Mark original as read',             sub: 'Microsoft Graph' },
    ],
  },
  {
    id: 'pp-pa-8',
    title: 'Excel Company Enrichment (CIN Lookup)',
    steps: [
      { type: 'trigger',   icon: '👆', label: 'Manually trigger a flow',           sub: 'Power Automate' },
      { type: 'action',    icon: '📊', label: 'List rows present in a table',      sub: 'Excel Online' },
      { type: 'loop',      icon: '🔄', label: 'For each company',                  sub: 'Control' },
      { type: 'action',    icon: '🌐', label: 'HTTP — search company API',         sub: 'HTTP' },
      { type: 'action',    icon: '🧩', label: 'Parse JSON — extract CIN',          sub: 'Data Operation' },
      { type: 'end',       icon: '✏️', label: 'Update a row — write CIN',          sub: 'Excel Online' },
    ],
  },
  {
    id: 'pp-pa-9',
    title: 'Excel CIN → Revenue Enrichment',
    steps: [
      { type: 'trigger',   icon: '👆', label: 'Manually trigger a flow',           sub: 'Power Automate' },
      { type: 'action',    icon: '📊', label: 'List rows present in a table',      sub: 'Excel Online' },
      { type: 'action',    icon: '📝', label: 'Collect all CIN values',            sub: 'Variable' },
      { type: 'loop',      icon: '🔄', label: 'For each CIN',                      sub: 'Control' },
      { type: 'action',    icon: '🌐', label: 'HTTP — fetch revenue',              sub: 'HTTP' },
      { type: 'end',       icon: '✏️', label: 'Update row — revenue',              sub: 'Excel Online' },
    ],
  },
  {
    id: 'pp-pa-10',
    title: 'Shared Mailbox → Planner + SharePoint + Teams',
    steps: [
      { type: 'trigger',   icon: '📧', label: 'When a new email arrives (shared)', sub: 'Office 365 Outlook' },
      { type: 'condition', icon: '◇',  label: 'Has attachments?',                  sub: 'Control' },
      { type: 'action',    icon: '📋', label: 'Create a Planner task',             sub: 'Planner' },
      { type: 'action',    icon: '📁', label: 'Create folder — subject+timestamp', sub: 'SharePoint' },
      { type: 'action',    icon: '💾', label: 'Save all attachments',              sub: 'SharePoint' },
      { type: 'action',    icon: '🔗', label: 'Create folder share link',          sub: 'SharePoint' },
      { type: 'action',    icon: '🔤', label: 'HTML → text → append to task',      sub: 'Planner' },
      { type: 'action',    icon: '📧', label: 'Send confirmation email',           sub: 'Office 365 Outlook' },
      { type: 'end',       icon: '👥', label: 'Post message in Teams',             sub: 'Microsoft Teams' },
    ],
  },
  {
    id: 'pp-pa-11',
    title: 'Partner Center Customer Sync',
    steps: [
      { type: 'trigger',   icon: '👆', label: 'Manually trigger a flow',           sub: 'Power Automate' },
      { type: 'action',    icon: '🔑', label: 'HTTP — OAuth2 token',               sub: 'HTTP' },
      { type: 'action',    icon: '🌐', label: 'HTTP — GET customers',              sub: 'Partner Center API' },
      { type: 'action',    icon: '🧩', label: 'Parse JSON — customers',            sub: 'Data Operation' },
      { type: 'action',    icon: '📝', label: 'Initialize — customers array',      sub: 'Variable' },
      { type: 'loop',      icon: '🔄', label: 'For each customer',                 sub: 'Control' },
      { type: 'end',       icon: '➕', label: 'Append Tenant ID + Company + DAP',  sub: 'Variable' },
    ],
  },
  {
    id: 'pp-pa-12',
    title: 'External Email Allowance (Azure Automation)',
    steps: [
      { type: 'trigger',   icon: '📝', label: 'When a new response is submitted',  sub: 'Microsoft Forms' },
      { type: 'action',    icon: '📋', label: 'Get response details',              sub: 'Microsoft Forms' },
      { type: 'action',    icon: '☁️', label: 'Start runbook — Create Contact',    sub: 'Azure Automation' },
      { type: 'action',    icon: '📄', label: 'Get job output',                    sub: 'Azure Automation' },
      { type: 'end',       icon: '📧', label: 'Send confirmation email',           sub: 'Office 365 Outlook' },
    ],
  },
  {
    id: 'pp-pa-13',
    title: 'GDAP Invitation Automation',
    steps: [
      { type: 'trigger',   icon: '📝', label: 'When a new response is submitted',  sub: 'Microsoft Forms' },
      { type: 'action',    icon: '📋', label: 'Get response details',              sub: 'Microsoft Forms' },
      { type: 'action',    icon: '🧩', label: 'Parse roles → Graph format',        sub: 'Data Operation' },
      { type: 'action',    icon: '🔑', label: 'HTTP — OAuth2 token',               sub: 'HTTP' },
      { type: 'action',    icon: '🌐', label: 'POST — Create GDAP relationship',   sub: 'Microsoft Graph' },
      { type: 'condition', icon: '◇',  label: 'Duplicate username?',               sub: 'Control' },
      { type: 'end',       icon: '📧', label: 'Send approval link email',          sub: 'Office 365 Outlook' },
    ],
  },
  {
    id: 'pp-pa-14',
    title: 'Manual Approval with Switch Routing',
    steps: [
      { type: 'trigger',   icon: '👆', label: 'Manually trigger a flow',           sub: 'Power Automate' },
      { type: 'action',    icon: '⏱️', label: 'Delay (short)',                     sub: 'Schedule' },
      { type: 'action',    icon: '✅', label: 'Start and wait — Text approval',    sub: 'Approvals' },
      { type: 'condition', icon: '🔀', label: 'Switch on accepted text',           sub: 'Control' },
      { type: 'action',    icon: '📦', label: 'Case "apple" → Scope',              sub: 'Control' },
      { type: 'end',       icon: '📦', label: 'Default → Scope',                   sub: 'Control' },
    ],
  },
  {
    id: 'pp-pa-15',
    title: 'Subscription Renewal Reminder',
    steps: [
      { type: 'trigger',   icon: '👆', label: 'Manually trigger a flow',           sub: 'Power Automate' },
      { type: 'action',    icon: '📊', label: 'List rows — subscriptions',         sub: 'Excel Online' },
      { type: 'loop',      icon: '🔄', label: 'For each row',                      sub: 'Control' },
      { type: 'action',    icon: '📅', label: 'Compute end date',                  sub: 'Compose' },
      { type: 'condition', icon: '◇',  label: 'Today = end date − 45?',            sub: 'Control' },
      { type: 'end',       icon: '📧', label: 'Send renewal reminder email',       sub: 'Office 365 Outlook' },
    ],
  },
  {
    id: 'pp-pa-16',
    title: 'Delegated Admin Onboarding (Graph)',
    steps: [
      { type: 'trigger',   icon: '📝', label: 'When a new response is submitted',  sub: 'Microsoft Forms' },
      { type: 'action',    icon: '📋', label: 'Get response details',              sub: 'Microsoft Forms' },
      { type: 'action',    icon: '🧩', label: 'Map roles → definition IDs',        sub: 'Data Operation' },
      { type: 'action',    icon: '🔑', label: 'HTTP — token (client creds)',       sub: 'Azure AD' },
      { type: 'action',    icon: '🌐', label: 'POST — Create delegated relation',  sub: 'Microsoft Graph' },
      { type: 'end',       icon: '📧', label: 'Send acceptance link email',        sub: 'Office 365 Outlook' },
    ],
  },
  {
    id: 'pp-pa-17',
    title: 'Leave Approval Flow',
    steps: [
      { type: 'trigger',   icon: '📝', label: 'When a new response is submitted',  sub: 'Microsoft Forms' },
      { type: 'action',    icon: '📋', label: 'Get response details',              sub: 'Microsoft Forms' },
      { type: 'action',    icon: '👤', label: 'Get user profile (V2)',             sub: 'Office 365 Users' },
      { type: 'action',    icon: '✅', label: 'Start and wait — Manager approval', sub: 'Approvals' },
      { type: 'condition', icon: '◇',  label: 'Outcome = Approve?',                sub: 'Control' },
      { type: 'action',    icon: '📊', label: 'Create item — Leave Log',           sub: 'SharePoint' },
      { type: 'end',       icon: '📧', label: 'Email requester (approve/reject)',  sub: 'Office 365 Outlook' },
    ],
  },
  {
    id: 'pp-pa-18',
    title: 'Event Registration → Calendar Event',
    steps: [
      { type: 'trigger',   icon: '📧', label: 'When a new email arrives',          sub: 'Office 365 Outlook' },
      { type: 'condition', icon: '◇',  label: 'Sender / Subject matches?',         sub: 'Control' },
      { type: 'action',    icon: '🔤', label: 'HTML body → plain text',            sub: 'Content Conversion' },
      { type: 'action',    icon: '📅', label: 'Extract event date & time',         sub: 'Compose' },
      { type: 'end',       icon: '📆', label: 'Create event (V4)',                 sub: 'Office 365 Outlook' },
    ],
  },
  {
    id: 'pp-cp-1',
    title: 'Copilot Agent — SharePoint File Counter',
    steps: [
      { type: 'trigger',   icon: '🤖', label: 'When a Copilot agent calls the flow', sub: 'Copilot Studio' },
      { type: 'action',    icon: '📊', label: 'List files (properties only)',      sub: 'SharePoint' },
      { type: 'action',    icon: '🔧', label: 'Compose — length() − 1',            sub: 'Data Operation' },
      { type: 'end',       icon: '↩️', label: 'Respond to the agent — count',      sub: 'Copilot Studio' },
    ],
  },
];

// ── SVG builder ─────────────────────────────────────────────────────────────
const TYPE_COLORS = {
  trigger:   { bg: '#FDECEA', border: '#D13438', accent: '#D13438' }, // red
  action:    { bg: '#E5F1FB', border: '#0066FF', accent: '#0066FF' }, // blue
  condition: { bg: '#FFF4CE', border: '#F0A30A', accent: '#F0A30A' }, // yellow
  loop:      { bg: '#F3E5F5', border: '#7B1FA2', accent: '#7B1FA2' }, // purple
  end:       { bg: '#DFF6DD', border: '#107C10', accent: '#107C10' }, // green
};

const TYPE_LABEL = {
  trigger: 'TRIGGER',
  action: 'ACTION',
  condition: 'CONDITION',
  loop: 'APPLY TO EACH',
  end: 'ACTION',
};

const escapeXml = (str) =>
  String(str).replace(/[<>&'"]/g, (c) => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', "'":'&apos;', '"':'&quot;' }[c]));

function buildSvg(flow) {
  const W = 420;
  const HEADER_H = 64;
  const STEP_H = 76;
  const STEP_GAP = 28;          // vertical gap between steps (connector lives here)
  const PAD_TOP = HEADER_H + 24;
  const PAD_BOTTOM = 28;
  const H = PAD_TOP + flow.steps.length * STEP_H + (flow.steps.length - 1) * STEP_GAP + PAD_BOTTOM;

  const stepX = 28;
  const stepW = W - stepX * 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Segoe UI, system-ui, -apple-system, Arial, sans-serif">`;

  // Background
  svg += `<rect width="${W}" height="${H}" fill="#F3F2F1"/>`;

  // Header bar (Power Automate brand gradient)
  svg += `<defs>
    <linearGradient id="hg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0066FF"/>
      <stop offset="100%" stop-color="#0099FF"/>
    </linearGradient>
    <filter id="cardshadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.12"/>
    </filter>
  </defs>`;

  svg += `<rect x="0" y="0" width="${W}" height="${HEADER_H}" fill="url(#hg)"/>`;

  // Power Automate logo (stylized 4-arrow diamond)
  const logoX = 18, logoY = 18, sz = 28;
  svg += `<g transform="translate(${logoX},${logoY})">
    <path d="M ${sz/2} 0 L ${sz} ${sz/2} L ${sz/2} ${sz} L 0 ${sz/2} Z" fill="#FFFFFF" opacity="0.95"/>
    <path d="M ${sz/2} 4 L ${sz-4} ${sz/2} L ${sz/2} ${sz-4} L 4 ${sz/2} Z" fill="url(#hg)"/>
    <path d="M ${sz/2} 8 L ${sz-8} ${sz/2} L ${sz/2} ${sz-8} L 8 ${sz/2} Z" fill="#FFFFFF" opacity="0.7"/>
  </g>`;

  // Header text
  svg += `<text x="${logoX + sz + 12}" y="${logoY + 13}" fill="#FFFFFF" font-size="11" font-weight="600" letter-spacing="1.2">POWER AUTOMATE</text>`;
  svg += `<text x="${logoX + sz + 12}" y="${logoY + 28}" fill="#FFFFFF" font-size="14" font-weight="700">${escapeXml(flow.title)}</text>`;

  // Steps
  flow.steps.forEach((step, i) => {
    const y = PAD_TOP + i * (STEP_H + STEP_GAP);
    const c = TYPE_COLORS[step.type] || TYPE_COLORS.action;

    // Connector line + arrow from previous step
    if (i > 0) {
      const cy1 = y - STEP_GAP;
      const cy2 = y;
      svg += `<line x1="${W/2}" y1="${cy1}" x2="${W/2}" y2="${cy2 - 6}" stroke="#A19F9D" stroke-width="2" stroke-dasharray="4 3"/>`;
      // arrowhead
      svg += `<path d="M ${W/2 - 5} ${cy2 - 6} L ${W/2 + 5} ${cy2 - 6} L ${W/2} ${cy2} Z" fill="#605E5C"/>`;
    }

    // Card
    svg += `<g filter="url(#cardshadow)">`;
    svg += `<rect x="${stepX}" y="${y}" width="${stepW}" height="${STEP_H}" rx="6" fill="#FFFFFF" stroke="${c.border}" stroke-width="1.5"/>`;
    svg += `</g>`;

    // Left color strip
    svg += `<rect x="${stepX}" y="${y}" width="6" height="${STEP_H}" rx="3" fill="${c.accent}"/>`;

    // Icon tile
    const iconX = stepX + 16;
    const iconY = y + 14;
    const iconSize = 48;
    svg += `<rect x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" rx="6" fill="${c.bg}" stroke="${c.border}" stroke-width="1"/>`;
    svg += `<text x="${iconX + iconSize / 2}" y="${iconY + iconSize / 2 + 10}" text-anchor="middle" font-size="26">${escapeXml(step.icon)}</text>`;

    // Step number badge (top-right of card)
    const badgeCX = stepX + stepW - 18;
    const badgeCY = y + 16;
    svg += `<circle cx="${badgeCX}" cy="${badgeCY}" r="10" fill="${c.accent}"/>`;
    svg += `<text x="${badgeCX}" y="${badgeCY + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="#FFFFFF">${i + 1}</text>`;

    // Type label
    const textX = iconX + iconSize + 14;
    svg += `<text x="${textX}" y="${y + 22}" font-size="9" font-weight="700" fill="${c.accent}" letter-spacing="1">${TYPE_LABEL[step.type]}</text>`;
    // Step title (truncate if very long)
    const title = step.label.length > 42 ? step.label.slice(0, 41) + '…' : step.label;
    svg += `<text x="${textX}" y="${y + 41}" font-size="13" font-weight="600" fill="#201F1E">${escapeXml(title)}</text>`;
    // Connector / service
    svg += `<text x="${textX}" y="${y + 58}" font-size="11" fill="#605E5C">${escapeXml(step.sub)}</text>`;
  });

  svg += `</svg>`;
  return svg;
}

// ── Write files ─────────────────────────────────────────────────────────────
let written = 0;
for (const flow of FLOWS) {
  const outPath = path.join(OUT_DIR, `${flow.id}.svg`);
  fs.writeFileSync(outPath, buildSvg(flow), 'utf8');
  console.log(`✅ ${flow.id}.svg  (${flow.steps.length} steps)`);
  written++;
}
console.log(`\nGenerated ${written} flow diagrams → public/power-flows/`);
