import { db, isMock } from './db';
import { Achievement } from '../types';
import { ACHIEVEMENTS } from '../constants';

export const getAchievements = async (): Promise<Achievement[]> => {
    if (isMock) return ACHIEVEMENTS;
    try {
        // Try sorted by sort_order first; if that column doesn't exist yet
        // (migration not run) fall back to inserting order.
        let result;
        try {
            result = await db.execute('SELECT * FROM achievements ORDER BY sort_order ASC, id ASC');
        } catch {
            result = await db.execute('SELECT * FROM achievements ORDER BY id ASC');
        }
        if (result.rows.length === 0) return ACHIEVEMENTS;

        return result.rows.map((row: any) => ({
            id: String(row.id),
            title: row.title || '',
            issuer: row.issuer || '',
            date: row.date || '',
            icon: row.icon || '🏆',
            color: row.color || '#FFD600',
        }));
    } catch (error) {
        console.error('Failed to fetch achievements:', error);
        return ACHIEVEMENTS;
    }
};

export const createAchievement = async (
    achievement: Omit<Achievement, 'id'>
): Promise<{ success: boolean; message: string }> => {
    if (isMock) {
        return { success: false, message: 'DB not connected! Add VITE_TURSO_DATABASE_URL to .env' };
    }
    try {
        // Shift existing rows down so the new one becomes rank 1
        await db.execute('UPDATE achievements SET sort_order = sort_order + 1');
        await db.execute({
            sql: `INSERT INTO achievements (title, issuer, date, icon, color, sort_order)
                  VALUES (?, ?, ?, ?, ?, 1)`,
            args: [
                achievement.title,
                achievement.issuer || '',
                achievement.date || '',
                achievement.icon || '🏆',
                achievement.color || '#FFD600',
            ],
        });
        return { success: true, message: 'Achievement created successfully!' };
    } catch (error: any) {
        console.error('Failed to create achievement:', error);
        return { success: false, message: error.message || 'Failed to create achievement' };
    }
};

export const updateAchievement = async (
    id: string,
    achievement: Partial<Omit<Achievement, 'id'>>
): Promise<{ success: boolean; message: string }> => {
    if (isMock) return { success: false, message: 'DB not connected!' };
    try {
        await db.execute({
            sql: `UPDATE achievements SET
                    title  = COALESCE(?, title),
                    issuer = COALESCE(?, issuer),
                    date   = COALESCE(?, date),
                    icon   = COALESCE(?, icon),
                    color  = COALESCE(?, color)
                  WHERE id = ?`,
            args: [
                achievement.title ?? null,
                achievement.issuer ?? null,
                achievement.date ?? null,
                achievement.icon ?? null,
                achievement.color ?? null,
                id,
            ],
        });
        return { success: true, message: 'Achievement updated!' };
    } catch (error: any) {
        console.error('Failed to update achievement:', error);
        return { success: false, message: error.message || 'Failed to update achievement' };
    }
};

export const deleteAchievement = async (id: string): Promise<boolean> => {
    if (isMock) return false;
    try {
        await db.execute({ sql: 'DELETE FROM achievements WHERE id = ?', args: [id] });
        return true;
    } catch (error) {
        console.error('Failed to delete achievement:', error);
        return false;
    }
};

export const saveAchievementOrder = async (orderedIds: string[]): Promise<void> => {
    if (isMock) return;
    for (let i = 0; i < orderedIds.length; i++) {
        await db.execute({
            sql: 'UPDATE achievements SET sort_order = ? WHERE id = ?',
            args: [i + 1, orderedIds[i]],
        });
    }
};
