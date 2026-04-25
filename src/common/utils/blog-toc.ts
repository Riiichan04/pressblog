import * as cheerio from 'cheerio';

const slugify = (text: string) => {
    return text
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-');
};

export const processContentAndGetHeadings = (html: string) => {
    const $ = cheerio.load(html);
    const headings: { id: string; text: string; level: number }[] = [];
    const idCounts: Record<string, number> = {};

    $('h1, h2, h3').each((_, el) => {
        const $el = $(el);
        const text = $el.text();
        let id = slugify(text);

        // Xử lý trùng lặp ID
        if (idCounts[id] !== undefined) {
            idCounts[id]++;
            id = `${id}-${idCounts[id]}`;
        } else {
            idCounts[id] = 0;
        }

        $el.attr('id', id);

        headings.push({
            id,
            text,
            level: parseInt(el.tagName.substring(1))
        });
    });

    return {
        processedHtml: $.html(),
        headings
    };
};