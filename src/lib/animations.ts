import type { Variants, Transition } from "framer-motion";

/* ═══════════════════════════════════════════════════════════
   LearnLoop Animation System
   ─────────────────────────────────────────────────────────
   Calm but alive. Never noisy. Always purposeful.
   ═══════════════════════════════════════════════════════════ */

/* ─── Shared Transitions ─── */
export const spring: Transition = {
  type: "spring",
  stiffness: 350,
  damping: 30,
};

export const springGentle: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 25,
};

export const easeOut: Transition = {
  duration: 0.2,
  ease: [0.25, 0.1, 0.25, 1],
};

export const easeOutSlow: Transition = {
  duration: 0.4,
  ease: [0.25, 0.1, 0.25, 1],
};

/* ─── Page / Section Entrance ─── */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
};

/* ─── Container with staggered children ─── */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

/* ─── Card hover ─── */
export const cardHover: Variants = {
  rest: { y: 0, boxShadow: "none" },
  hover: {
    y: -2,
    boxShadow: "0 4px 20px oklch(0 0 0 / 0.12)",
    transition: easeOut,
  },
};

/* ─── Notification/popup ─── */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -4,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

/* ─── Modal / sheet ─── */
export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 28 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 4,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

/* ─── Sidebar collapse ─── */
export const sidebarExpand: Variants = {
  collapsed: { width: 68 },
  expanded: { width: 240 },
};

/* ─── Tooltip / popover ─── */
export const tooltipVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 2 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.12, ease: "easeOut" },
  },
};

/* ─── Counter / number animation ─── */
export const countUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* ─── Skeleton shimmer (for loading) ─── */
export const shimmer: Variants = {
  initial: { backgroundPosition: "-200% 0" },
  animate: {
    backgroundPosition: "200% 0",
    transition: {
      repeat: Infinity,
      duration: 2.5,
      ease: "easeInOut",
    },
  },
};
