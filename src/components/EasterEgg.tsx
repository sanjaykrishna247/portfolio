import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

const EasterEgg = () => {
    const [keys, setKeys] = useState<string[]>([]);
    const [activated, setActivated] = useState(false);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            setKeys((prev) => {
                const next = [...prev, e.key].slice(-KONAMI.length);
                if (next.length === KONAMI.length && next.every((k, i) => k === KONAMI[i])) {
                    setActivated(true);
                    setTimeout(() => setActivated(false), 4000);
                }
                return next;
            });
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    return (
        <AnimatePresence>
            {activated && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.3, y: -100 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
                >
                    <motion.div
                        animate={{
                            boxShadow: [
                                "0 0 30px hsl(24 95% 53% / 0.3)",
                                "0 0 80px hsl(24 95% 53% / 0.5)",
                                "0 0 30px hsl(24 95% 53% / 0.3)",
                            ],
                        }}
                        transition={{ duration: 1.5, repeat: 2 }}
                        className="bg-background/95 border border-primary/40 rounded-2xl px-10 py-8 text-center backdrop-blur-xl"
                    >
                        <motion.p
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.6, repeat: 3 }}
                            className="text-5xl mb-3"
                        >
                            🔥
                        </motion.p>
                        <p className="text-xl font-bold text-primary text-glow mb-1">KONAMI UNLOCKED!</p>
                        <p className="text-sm text-muted-foreground font-mono">You found the secret. You're a real one.</p>
                        <motion.div
                            animate={{ width: ["0%", "100%"] }}
                            transition={{ duration: 3.5 }}
                            className="h-0.5 bg-primary/40 mt-4 rounded-full"
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EasterEgg;
