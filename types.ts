
export interface BlogSection {
  type: 'heading' | 'subheading' | 'paragraph' | 'markdown' | 'image' | 'image-grid' | 'code' | 'note' | 'text' | 'link';
  content: string;
  content2?: string;
  content3?: string;
  content4?: string;
  caption?: string;
  language?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content?: string; // Legacy support
  sections?: BlogSection[];
  category: string;
  color: string;
  isDraft?: boolean;
  scheduledDate?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  color: string;
  link: string;
  githubLink?: string;
  disabled: boolean;
}

export interface Skill {
  name: string;
  level: number;
}

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  icon: string;
  color: string;
}

export interface PowerPlatformItem {
  id: string;
  title: string;
  description: string;
  category: 'Power Automate' | 'Power Apps' | 'Copilot Studio' | 'Power BI';
  images?: string[];
  color: string;
  link?: string;
  /** Optional inline flow definition (overrides any data/powerFlows.ts entry) */
  flow?: import('./data/powerFlows').PowerFlow | null;
}
