import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

export async function getServerTranslation(ns: string) {
    const cookieStore = await cookies();
    const locale = cookieStore.get('i18nextLng')?.value || 'vi';

    try {
        const filePath = path.join(process.cwd(), 'public', 'locales', locale, `${ns}.json`);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const messages = JSON.parse(fileContent);

        return {
            t: (key: string) => {
                return key.split('.').reduce((obj, k) => obj?.[k], messages) || key;
            },
            locale
        };
    } catch (error) {
        console.error("Error when reading translation files:", error);
        return { t: (key: string) => key, locale };
    }
}