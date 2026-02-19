import { motion, useScroll } from "framer-motion";

const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
            style={{
                scaleX: scrollYProgress,
                background: "linear-gradient(90deg, hsl(16, 90%, 48%), hsl(24, 95%, 53%), hsl(35, 100%, 55%))",
                boxShadow: "0 0 8px hsl(24 95% 53% / 0.5)",
            }}
        />
    );
};

export default ScrollProgress;
