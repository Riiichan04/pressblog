"use client";

import { ArrowRight, Bold, Code, Edit, Heading1, ImageIcon, Italic, LinkIcon, List, ListOrdered, MessageSquare, Quote, Redo, Sparkles, Strikethrough, Type, Underline, Undo } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function LandingPageComponent() {
    return (
        <>
            <HeroSection />
            <FeatureSection />
            <CtaSection />
            <EditorShowcaseSection />
            <FaqSection />
        </>
    )
}

export function HeroSection() {
    const { t } = useTranslation("landing");

    return (
        <section className="relative w-full min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 overflow-hidden">
            <div className="absolute inset-0 z-0">
                {/* FIXME: Put image here */}
                {/* <Image
                    src="/hero-bg.jpg" 
                    alt="Hero Background"
                    fill
                    priority
                    className="object-cover opacity-30 mix-blend-luminosity"
                /> */}
                <div className="absolute inset-0 bg-linear-to-b from-zinc-950/40 via-zinc-950/80 to-zinc-950" />
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-red-900/20 blur-[120px] rounded-full pointer-events-none z-0" />

            <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-sm"
                >
                    {t("hero.title")}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                    className="text-zinc-400 max-w-2xl text-lg md:text-xl leading-relaxed"
                >
                    {t("hero.subtitle")}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row items-center gap-4 pt-4"
                >
                    <Link href="/explore">
                        <Button className="rounded-full bg-white text-zinc-950 hover:bg-zinc-200 px-8 py-6 text-sm font-bold tracking-wider cursor-pointer shadow-lg hover:shadow-white/20 transition-all duration-300 hover:-translate-y-1">
                            {t("hero.start_reading")} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>

                    <Link href="/register">
                        <Button variant="outline" className="rounded-full border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 hover:text-white px-8 py-6 text-sm font-bold tracking-wider backdrop-blur-sm cursor-pointer transition-all duration-300 hover:-translate-y-1">
                            {t("hero.become_creator")} <LinkIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

export function FeatureSection() {
    const { t } = useTranslation("landing");

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <section className="w-full bg-zinc-950 flex flex-col justify-center py-20 px-4 relative z-10">
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-white mb-3">{t("features.title")}</h2>
                    <p className="text-zinc-400 text-sm">{t("features.subtitle")}</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-col justify-between rounded-3xl border border-zinc-800/50 bg-zinc-900/20 p-6 hover:bg-zinc-900/40 transition-colors"
                    >
                        <div className="h-10 w-10 rounded-xl bg-zinc-800/50 flex items-center justify-center mb-5">
                            <Sparkles className="h-5 w-5 text-zinc-100" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">{t("features.quality.title")}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {t("features.quality.desc")}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col justify-between rounded-3xl border border-zinc-800/50 bg-zinc-900/20 p-6 hover:bg-zinc-900/40 transition-colors"
                    >
                        <div className="h-10 w-10 rounded-xl bg-zinc-800/50 flex items-center justify-center mb-5">
                            <Edit className="h-5 w-5 text-zinc-100" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">{t("features.cms.title")}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {t("features.cms.desc")}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="md:col-span-2 flex flex-col md:flex-row items-center justify-between rounded-3xl border border-zinc-800/50 bg-zinc-900/20 p-6 overflow-hidden group hover:bg-zinc-900/40 transition-colors"
                    >
                        <div className="md:w-1/2 pr-6 mb-6 md:mb-0">
                            <div className="h-10 w-10 rounded-xl bg-zinc-800/50 flex items-center justify-center mb-5">
                                <MessageSquare className="h-5 w-5 text-zinc-100" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{t("features.community.title")}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {t("features.community.desc")}
                            </p>
                        </div>
                        <div className="md:w-1/2 relative h-40 md:h-full min-h-40 w-full rounded-xl overflow-hidden opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-500">
                            <div className="absolute inset-0 bg-zinc-800/50 flex items-center justify-center text-zinc-500 text-xs">
                                {/* Place image here */}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export function CtaSection() {
    const { t } = useTranslation("landing");

    return (
        <section className="w-full min-h-screen bg-background relative overflow-hidden flex items-center justify-center border-b px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[400px] font-serif font-black text-muted/20 select-none pointer-events-none leading-none"
            >
                ”
            </motion.div>

            <div className="relative z-10 text-center max-w-2xl mx-auto space-y-8">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold text-foreground tracking-tight"
                >
                    {t("cta.title", "Sẵn sàng để thể hiện tác phẩm của bạn?")}
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-muted-foreground text-lg"
                >
                    {t("cta.subtitle")}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="pt-4"
                >
                    <Link href="/register">
                        <Button className="rounded-full px-8 py-6 text-sm font-bold tracking-wider cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                            {t("cta.button")} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

export function FaqSection() {
    const { t } = useTranslation("landing");

    return (
        <section className="w-full py-24 px-4 bg-background">
            <div className="container mx-auto max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
                        {t("faq.title")}
                    </h2>
                    <p className="text-muted-foreground">
                        {t("faq.subtitle")}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-b-zinc-200 dark:border-zinc-800">
                            <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary">
                                {t("faq.q1")}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                {t("faq.a1")}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2" className="border-b-zinc-200 dark:border-zinc-800">
                            <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary">
                                {t("faq.q2")}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                {t("faq.a2")}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3" className="border-transparent">
                            <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary">
                                {t("faq.q3")}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                {t("faq.a3")}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </motion.div>
            </div>
        </section>
    );
}


export function EditorShowcaseSection() {
    const { t } = useTranslation("landing");

    const blockVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <section className="w-full min-h-screen py-24 px-4 bg-zinc-950 overflow-hidden flex flex-col justify-center">
            <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row items-center gap-12">

                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="w-full lg:w-5/12 space-y-6"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                        {t("editor_showcase.title")}
                    </h2>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        {t("editor_showcase.subtitle")}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="w-full lg:w-7/12 relative"
                >
                    <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />

                    <div className="relative rounded-2xl border border-zinc-800 bg-[#0A0A0A] shadow-2xl overflow-hidden">

                        <div className="h-12 border-b border-zinc-800 bg-zinc-900/50 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>

                        {/* Toolbar */}
                        <div className="flex items-center gap-4 px-6 py-3 border-b border-zinc-800 bg-zinc-900/30 text-zinc-400 overflow-x-auto hide-scrollbar">
                            <div className="flex items-center gap-3">
                                <Bold size={16} className="hover:text-white cursor-pointer transition-colors" />
                                <Italic size={16} className="hover:text-white cursor-pointer transition-colors" />
                                <Underline size={16} className="hover:text-white cursor-pointer transition-colors" />
                                <Strikethrough size={16} className="hover:text-white cursor-pointer transition-colors" />
                            </div>
                            <div className="w-px h-4 bg-zinc-700" />
                            <div className="flex items-center gap-3 font-mono text-sm">
                                <span className="hover:text-white cursor-pointer transition-colors">H1</span>
                                <span className="hover:text-white cursor-pointer transition-colors">H2</span>
                                <span className="hover:text-white cursor-pointer transition-colors">H3</span>
                            </div>
                            <div className="w-px h-4 bg-zinc-700" />
                            <div className="flex items-center gap-3">
                                <List size={16} className="hover:text-white cursor-pointer transition-colors" />
                                <ListOrdered size={16} className="hover:text-white cursor-pointer transition-colors" />
                                <Quote size={16} className="hover:text-white cursor-pointer transition-colors" />
                                <Code size={16} className="hover:text-white cursor-pointer transition-colors" />
                                <LinkIcon size={16} className="hover:text-white cursor-pointer transition-colors" />
                                <ImageIcon size={16} className="hover:text-white cursor-pointer transition-colors" />
                            </div>
                            <div className="w-px h-4 bg-zinc-700" />
                            <div className="flex items-center gap-3">
                                <Undo size={16} className="hover:text-white cursor-pointer transition-colors" />
                                <Redo size={16} className="hover:text-white cursor-pointer transition-colors" />
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            <motion.div
                                variants={blockVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="group flex gap-4 items-start"
                            >
                                <div className="mt-2 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity"><Heading1 size={18} /></div>
                                <h1 className="text-4xl font-bold text-white outline-none">
                                    Welcome to PressBlog
                                </h1>
                            </motion.div>

                            <motion.div
                                variants={blockVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="group flex gap-4 items-start"
                            >
                                <div className="mt-1 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity"><Type size={18} /></div>
                                <p className="text-zinc-300 text-lg leading-relaxed">
                                    A CMS and blogging website focused on UI and a clean rich-text editor.
                                </p>
                            </motion.div>

                            <motion.div
                                variants={blockVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.9 }}
                                className="group flex gap-4 items-start relative"
                            >
                                <div className="mt-1 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity"><Type size={18} /></div>
                                <div className="text-zinc-500 text-lg flex items-center">
                                    <span className="text-[#FAFAFA] bg-[#FAFAFA]/10 px-1 rounded mr-1">/image</span>
                                    <span className="w-0.5 h-5 bg-white ml-1 animate-pulse" />
                                </div>

                                <div className="absolute top-8 left-12 w-64 rounded-lg border border-zinc-700 bg-zinc-800 shadow-xl overflow-hidden z-10">
                                    <div className="p-2 border-b border-zinc-700/50 bg-zinc-700/30 flex items-center gap-3 cursor-pointer">
                                        <div className="p-2 bg-zinc-900 rounded border border-zinc-700"><ImageIcon size={18} className="text-zinc-300" /></div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{t("editor_showcase.action.title")}</p>
                                            <p className="text-xs text-zinc-400">{t("editor_showcase.action.desc")}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}