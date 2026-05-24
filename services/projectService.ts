import { db, isMock } from './db';
import { Project } from '../types';
import { PROJECTS } from '../constants';

// In-memory cache — same pattern as blogService
let projectsCache: Project[] | null = null;
let projectsLightCache: Project[] | null = null;

export const invalidateProjectCache = () => {
    projectsCache = null;
    projectsLightCache = null;
};

// Lightweight fetch — skips the large base64 `image_url` column so the admin
// list loads fast. Use `getProjectImage(id)` to lazily fetch the image when
// the user actually opens a project for editing.
export const getProjectsLight = async (): Promise<Project[]> => {
    if (isMock) return PROJECTS;
    if (projectsLightCache) return projectsLightCache;
    if (projectsCache) return projectsCache;
    try {
        const result = await db.execute(
            'SELECT id, title, description, tags, color, live_link, github_link, disabled, sort_order FROM projects ORDER BY sort_order ASC, id ASC'
        );
        if (result.rows.length === 0) return PROJECTS;

        projectsLightCache = result.rows.map((row: any) => ({
            id: String(row.id),
            title: row.title || '',
            description: row.description || '',
            image: '',
            tags: (() => { try { return JSON.parse(row.tags || '[]'); } catch { return []; } })(),
            color: row.color || '#FFD600',
            link: row.live_link || '',
            githubLink: row.github_link || '',
            disabled: row.disabled === 1 || row.disabled === true,
        }));
        return projectsLightCache;
    } catch (error) {
        console.error('Failed to fetch projects (light):', error);
        return PROJECTS;
    }
};

// Fetch only the id + image_url for every project. Used by the admin to
// hydrate thumbnails in the background after the lightweight list renders.
export const getProjectImages = async (): Promise<Record<string, string>> => {
    if (isMock) {
        return PROJECTS.reduce((acc, p) => {
            if (p.image) acc[p.id] = p.image;
            return acc;
        }, {} as Record<string, string>);
    }
    try {
        const result = await db.execute(
            'SELECT id, image_url FROM projects ORDER BY sort_order ASC, id ASC'
        );
        const map: Record<string, string> = {};
        for (const row of result.rows as any[]) {
            if (row.image_url) map[String(row.id)] = row.image_url;
        }
        return map;
    } catch (error) {
        console.error('Failed to fetch project images:', error);
        return {};
    }
};

// Fetch a single project's image_url on demand (used when editing).
export const getProjectImage = async (id: string): Promise<string> => {
    if (isMock) {
        const p = PROJECTS.find(p => p.id === id);
        return p?.image || '';
    }
    try {
        const result = await db.execute({
            sql: 'SELECT image_url FROM projects WHERE id = ? LIMIT 1',
            args: [id],
        });
        const row: any = result.rows[0];
        return row?.image_url || '';
    } catch (error) {
        console.error('Failed to fetch project image:', error);
        return '';
    }
};

// Persist a new ordering to the DB — single batched round-trip.
export const saveProjectOrder = async (orderedIds: string[]): Promise<void> => {
    if (isMock) return;
    invalidateProjectCache();
    if (orderedIds.length === 0) return;
    await (db as any).batch(
        orderedIds.map((id, i) => ({
            sql: 'UPDATE projects SET sort_order = ? WHERE id = ?',
            args: [i + 1, id],
        }))
    );
};

export const getProjects = async (): Promise<Project[]> => {
    if (isMock) return PROJECTS;
    if (projectsCache) return projectsCache;
    try {
        // Fetch only the lightweight columns — image_url stores large base64
        // data so we load it separately only when the <img> element requests it.
        const result = await db.execute(
            'SELECT id, title, description, image_url, tags, color, live_link, github_link, disabled, sort_order FROM projects ORDER BY sort_order ASC, id ASC'
        );
        if (result.rows.length === 0) return PROJECTS;

        projectsCache = result.rows.map((row: any) => {
            return {
                id: String(row.id),
                title: row.title || '',
                description: row.description || '',
                image: row.image_url || '',
                tags: (() => { try { return JSON.parse(row.tags || '[]'); } catch { return []; } })(),
                color: row.color || '#FFD600',
                link: row.live_link || '',
                githubLink: row.github_link || '',
                disabled: row.disabled === 1 || row.disabled === true,
            };
        });
        return projectsCache;
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        return PROJECTS;
    }
};

export const createProject = async (
    project: Omit<Project, 'id'>
): Promise<{ success: boolean; message: string }> => {
    if (isMock) {
        return { success: false, message: 'DB not connected! Add VITE_TURSO_DATABASE_URL to .env' };
    }
    try {
        const tagsStr = JSON.stringify(project.tags || []);
        // Shift existing rows + insert new one in a single batched round-trip
        await (db as any).batch([
            { sql: 'UPDATE projects SET sort_order = sort_order + 1', args: [] },
            {
                sql: `INSERT INTO projects (title, description, image_url, tags, color, live_link, github_link, disabled, sort_order)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
                args: [
                    project.title,
                    project.description,
                    project.image || '',
                    tagsStr,
                    project.color || '#FFD600',
                    project.link || '',
                    project.githubLink || '',
                    project.disabled ? 1 : 0,
                ],
            },
        ]);
        invalidateProjectCache();
        return { success: true, message: 'Project created successfully!' };
    } catch (error: any) {
        console.error('Failed to create project:', error);
        return { success: false, message: error.message || 'Failed to create project' };
    }
};

export const updateProject = async (
    id: string,
    project: Partial<Omit<Project, 'id'>>
): Promise<{ success: boolean; message: string }> => {
    if (isMock) {
        return { success: false, message: 'DB not connected!' };
    }
    try {
        const tagsStr = project.tags ? JSON.stringify(project.tags) : undefined;
        await db.execute({
            sql: `UPDATE projects SET
                    title       = COALESCE(?, title),
                    description = COALESCE(?, description),
                    image_url   = COALESCE(?, image_url),
                    tags        = COALESCE(?, tags),
                    color       = COALESCE(?, color),
                    live_link   = COALESCE(?, live_link),
                    github_link = COALESCE(?, github_link),
                    disabled    = COALESCE(?, disabled)
                  WHERE id = ?`,
            args: [
                project.title ?? null,
                project.description ?? null,
                project.image ?? null,
                tagsStr ?? null,
                project.color ?? null,
                project.link ?? null,
                project.githubLink ?? null,
                project.disabled !== undefined ? (project.disabled ? 1 : 0) : null,
                id,
            ],
        });
        invalidateProjectCache();
        return { success: true, message: 'Project updated!' };
    } catch (error: any) {
        console.error('Failed to update project:', error);
        return { success: false, message: error.message || 'Failed to update project' };
    }
};

export const deleteProject = async (id: string): Promise<boolean> => {
    try {
        await db.execute({ sql: 'DELETE FROM projects WHERE id = ?', args: [id] });
        invalidateProjectCache();
        return true;
    } catch (error) {
        console.error('Failed to delete project:', error);
        return false;
    }
};
