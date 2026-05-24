import { db, isMock } from './db';
import { PowerPlatformItem } from '../types';
import { POWER_PLATFORM_ITEMS } from '../constants';

let cache: PowerPlatformItem[] | null = null;

export const invalidatePowerPlatformCache = () => {
    cache = null;
};

export const savePowerPlatformOrder = async (orderedIds: string[]): Promise<void> => {
    if (isMock) return;
    invalidatePowerPlatformCache();
    if (orderedIds.length === 0) return;
    await (db as any).batch(
        orderedIds.map((id, i) => ({
            sql: 'UPDATE power_platform SET sort_order = ? WHERE id = ?',
            args: [i + 1, id],
        }))
    );
};

export const getPowerPlatformItems = async (): Promise<PowerPlatformItem[]> => {
    if (isMock) return POWER_PLATFORM_ITEMS;
    if (cache) return cache;
    try {
        const result = await db.execute(
            'SELECT id, title, description, category, image_url, color, link, sort_order, flow_json FROM power_platform ORDER BY sort_order ASC, id ASC'
        );
        if (result.rows.length === 0) return POWER_PLATFORM_ITEMS;

        const parseImages = (raw: string): string[] => {
            if (!raw) return [];
            try {
                const parsed = JSON.parse(raw);
                return Array.isArray(parsed) ? parsed.filter(Boolean) : [raw].filter(Boolean);
            } catch {
                return [raw].filter(Boolean);
            }
        };

        const parseFlow = (raw: any) => {
            if (!raw) return null;
            try {
                const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                if (parsed && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
                    return parsed;
                }
                return null;
            } catch {
                return null;
            }
        };

        cache = result.rows.map((row: any) => ({
            id: String(row.id),
            title: row.title || '',
            description: row.description || '',
            category: row.category || 'Power Automate',
            images: parseImages(row.image_url || ''),
            color: row.color || '#0066FF',
            link: row.link || '',
            flow: parseFlow(row.flow_json),
        }));
        return cache;
    } catch (error) {
        console.error('Failed to fetch power platform items:', error);
        return POWER_PLATFORM_ITEMS;
    }
};

export const createPowerPlatformItem = async (
    item: Omit<PowerPlatformItem, 'id'>
): Promise<{ success: boolean; message: string }> => {
    if (isMock) {
        return { success: false, message: 'DB not connected! Add VITE_TURSO_DATABASE_URL to .env' };
    }
    try {
        await (db as any).batch([
            { sql: 'UPDATE power_platform SET sort_order = sort_order + 1', args: [] },
            {
                sql: `INSERT INTO power_platform (title, description, category, image_url, color, link, sort_order, flow_json)
                      VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
                args: [
                    item.title,
                    item.description,
                    item.category,
                    JSON.stringify(item.images ?? []),
                    item.color || '#0066FF',
                    item.link || '',
                    item.flow ? JSON.stringify(item.flow) : null,
                ],
            },
        ]);
        invalidatePowerPlatformCache();
        return { success: true, message: 'Power Platform item created!' };
    } catch (error: any) {
        console.error('Failed to create power platform item:', error);
        return { success: false, message: error.message || 'Failed to create item' };
    }
};

export const updatePowerPlatformItem = async (
    id: string,
    item: Partial<Omit<PowerPlatformItem, 'id'>>
): Promise<{ success: boolean; message: string }> => {
    if (isMock) {
        return { success: false, message: 'DB not connected!' };
    }
    try {
        await db.execute({
            sql: `UPDATE power_platform SET
                    title       = COALESCE(?, title),
                    description = COALESCE(?, description),
                    category    = COALESCE(?, category),
                    image_url   = COALESCE(?, image_url),
                    color       = COALESCE(?, color),
                    link        = COALESCE(?, link),
                    flow_json   = CASE WHEN ? = 1 THEN ? ELSE flow_json END
                  WHERE id = ?`,
            args: [
                item.title ?? null,
                item.description ?? null,
                item.category ?? null,
                item.images !== undefined ? JSON.stringify(item.images) : null,
                item.color ?? null,
                item.link ?? null,
                item.flow !== undefined ? 1 : 0,
                item.flow ? JSON.stringify(item.flow) : null,
                id,
            ],
        });
        invalidatePowerPlatformCache();
        return { success: true, message: 'Item updated!' };
    } catch (error: any) {
        console.error('Failed to update power platform item:', error);
        return { success: false, message: error.message || 'Failed to update item' };
    }
};

export const deletePowerPlatformItem = async (id: string): Promise<boolean> => {
    try {
        await db.execute({ sql: 'DELETE FROM power_platform WHERE id = ?', args: [id] });
        invalidatePowerPlatformCache();
        return true;
    } catch (error) {
        console.error('Failed to delete power platform item:', error);
        return false;
    }
};
