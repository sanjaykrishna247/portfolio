import { motion } from "framer-motion";

const SectionDivider = () => (
    <div className="flex items-center justify-center py-2 px-6 overflow-hidden">
        <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-px w-full max-w-4xl origin-left"
            style={{
                background: "linear-gradient(90deg, transparent, hsl(24 95% 53% / 0.2), hsl(24 95% 53% / 0.35), hsl(24 95% 53% / 0.2), transparent)",
            }}
        />
    </div>
);

export default SectionDivider;
