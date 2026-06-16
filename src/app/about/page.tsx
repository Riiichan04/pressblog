"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function AboutUsPage() {
    const { t } = useTranslation("common");

    return (
        <main className="min-h-screen bg-background pt-32 pb-24 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="container mx-auto max-w-3xl space-y-12"
            >
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                            {t("about.title")}
                        </h1>
                    </div>
                    <p className="text-xl text-muted-foreground">
                        {t("about.subtitle")}
                    </p>
                </div>

                <div className="h-px w-full bg-border" />

                <div className="space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">
                            {t("about.mission_title")}
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {t("about.mission_desc")}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground">
                            {t("about.vision_title")}
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {t("about.vision_desc")}
                        </p>
                    </section>
                </div>
            </motion.div>
        </main>
    );
}