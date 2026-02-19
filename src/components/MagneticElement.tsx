import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticElementProps {
    children: React.ReactNode;
    className?: string;
    strength?: number;
    radius?: number;
}

const MagneticElement = ({
    children,
    className = "",
    strength = 0.3,
    radius = 100,
}: MagneticElementProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        if (distance < radius) {
            const pull = (1 - distance / radius) * strength;
            setPosition({ x: distanceX * pull, y: distanceY * pull });
        }
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
        >
            {children}
        </motion.div>
    );
};

export default MagneticElement;
