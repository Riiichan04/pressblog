import * as cheerio from 'cheerio';

export const processHtmlContent = (html: string) => {
    const $ = cheerio.load(html);

    $('h1, h2, h3').each((_, el) => {
        const text = $(el).text();
        const id = text
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');

        $(el).attr('id', id);
    });

    return $.html();
};

export const getHeadings = (html: string) => {
    const $ = cheerio.load(html);
    const headings: { id: string; text: string; level: number }[] = [];

    $('h1, h2, h3').each((_, el) => {
        const $el = $(el);
        const text = $el.text();
        const id = $el.attr('id') || text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');

        headings.push({
            id,
            text,
            level: parseInt(el.tagName.substring(1))
        });
    });

    return headings;
};