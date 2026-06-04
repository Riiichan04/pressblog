'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation('common');

    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-1">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={32}
                                height={32}
                                className="transition-transform group-hover:scale-110 rounded-md"
                                priority
                                unoptimized
                            />
                            <h2 className="text-xl font-bold uppercase">PressBlog</h2>
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">
                            {t('footer.brand.description')}
                        </p>
                    </div>

                    {/* Links Section */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                            {t('footer.sections.explore')}
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/" className="hover:text-primary">
                                    {t('footer.links.home')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/posts" className="hover:text-primary">
                                    {t('footer.links.articles')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-primary">
                                    {t('footer.links.about')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support/Legal Section */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                            {t('footer.sections.legal')}
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/contact" className="hover:text-primary">
                                    {t('footer.links.contact')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-primary">
                                    {t('footer.links.privacy')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-primary">
                                    {t('footer.links.terms')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                            {t('footer.sections.social')}
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary">GitHub</a></li>
                            <li><a href="#" className="hover:text-primary">LinkedIn</a></li>
                            <li><Link href="/rss" className="hover:text-primary">{t('footer.links.rss')}</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>{t('footer.copy')}</p>
                </div>
            </div>
        </footer>
    );
}