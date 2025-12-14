import React from 'react';
import { motion } from 'framer-motion';

/**
 * PageTransition - Wrapper for page/screen transitions
 * Provides smooth fade and slide animations
 */
const PageTransition = ({
    children,
    type = 'fade', // 'fade', 'slide', 'scale', 'slideUp'
    duration = 0.3,
    delay = 0
}) => {
    const variants = {
        fade: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 }
        },
        slide: {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -20 }
        },
        slideUp: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 }
        },
        scale: {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 }
        }
    };

    const selectedVariant = variants[type] || variants.fade;

    return (
        <motion.div
            initial={selectedVariant.initial}
            animate={selectedVariant.animate}
            exit={selectedVariant.exit}
            transition={{
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1] // Smooth easing
            }}
        >
            {children}
        </motion.div>
    );
};

/**
 * AnimatedCard - Card with hover animations
 */
export const AnimatedCard = ({
    children,
    className = '',
    style = {},
    onClick,
    hoverScale = 1.02,
    tapScale = 0.98
}) => {
    return (
        <motion.div
            className={className}
            style={style}
            onClick={onClick}
            whileHover={{
                scale: hoverScale,
                y: -5,
                transition: { duration: 0.2 }
            }}
            whileTap={{
                scale: tapScale,
                transition: { duration: 0.1 }
            }}
        >
            {children}
        </motion.div>
    );
};

/**
 * AnimatedButton - Button with press animations
 */
export const AnimatedButton = ({
    children,
    className = '',
    style = {},
    onClick,
    disabled = false
}) => {
    return (
        <motion.button
            className={className}
            style={style}
            onClick={onClick}
            disabled={disabled}
            whileHover={!disabled ? {
                scale: 1.05,
                transition: { duration: 0.2 }
            } : {}}
            whileTap={!disabled ? {
                scale: 0.95,
                transition: { duration: 0.1 }
            } : {}}
        >
            {children}
        </motion.button>
    );
};

/**
 * StaggerContainer - Container for staggered children animations
 */
export const StaggerContainer = ({
    children,
    staggerDelay = 0.1,
    className = '',
    style = {}
}) => {
    return (
        <motion.div
            className={className}
            style={style}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: staggerDelay
                    }
                }
            }}
            initial="hidden"
            animate="visible"
        >
            {children}
        </motion.div>
    );
};

/**
 * StaggerItem - Individual items in a stagger container
 */
export const StaggerItem = ({ children, className = '', style = {} }) => {
    return (
        <motion.div
            className={className}
            style={style}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.3 }
                }
            }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
