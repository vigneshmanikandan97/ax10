import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type FC, type ReactNode } from "react";

type ThemeConfig = {
  bg: string;
  button: string;
  dot: string;
  progress: string;
};

interface CarouselNavigatorProps {
  totalSlides?: number;
  autoDelay?: number;
  themes?: ThemeConfig[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  slideKey?: number | string;
  compact?: boolean;
}

const DEFAULT_TOTAL_SLIDES = 4;
const DEFAULT_AUTO_DELAY = 5000;

const DEFAULT_THEMES: ThemeConfig[] = [
  {
    bg: "bg-zinc-100",
    button: "bg-zinc-900",
    dot: "bg-zinc-300",
    progress: "bg-zinc-300",
  },
  {
    bg: "bg-blue-100",
    button: "bg-blue-600",
    dot: "bg-blue-300",
    progress: "bg-blue-300",
  },
  {
    bg: "bg-green-100",
    button: "bg-green-600",
    dot: "bg-green-400",
    progress: "bg-green-400",
  },
  {
    bg: "bg-yellow-100",
    button: "bg-yellow-400",
    dot: "bg-yellow-300",
    progress: "bg-yellow-300",
  },
];

export const CarouselNavigator: FC<CarouselNavigatorProps> = ({
  totalSlides = DEFAULT_TOTAL_SLIDES,
  autoDelay = DEFAULT_AUTO_DELAY,
  themes = DEFAULT_THEMES,
  currentIndex,
  onIndexChange,
  slideKey,
  compact = false,
}) => {
  const theme = themes[currentIndex];

  const goPrev = () =>
    onIndexChange((currentIndex - 1 + totalSlides) % totalSlides);

  const goNext = () => onIndexChange((currentIndex + 1) % totalSlides);

  return (
    <motion.div
      animate={{
        backgroundColor: theme.bg.replace("bg-[", "").replace("]", ""),
      }}
      className={`frosted-bar flex items-center justify-center rounded-full border border-white/[0.08] transition-colors duration-300 ${
        compact
          ? "gap-0.5 px-2 py-1 md:px-2.5 md:py-1.5"
          : "gap-1 px-3 py-2 md:px-4 md:py-3"
      }`}
    >
      <ArrowButton compact={compact} onClick={goPrev} themeColor={theme.button}>
        <ChevronLeft size={compact ? 16 : 24} strokeWidth={3} />
      </ArrowButton>

      <div className={`flex items-center ${compact ? "gap-1 px-1" : "gap-2 px-2"}`}>
        {Array.from({ length: totalSlides }).map((_, i) => (
          <Indicator
            key={i}
            compact={compact}
            isActive={i === currentIndex}
            theme={theme}
            autoDelay={autoDelay}
            slideKey={slideKey ?? currentIndex}
            onClick={() => onIndexChange(i)}
          />
        ))}
      </div>

      <ArrowButton compact={compact} onClick={goNext} themeColor={theme.button}>
        <ChevronRight size={compact ? 16 : 24} strokeWidth={3} />
      </ArrowButton>
    </motion.div>
  );
};

const ArrowButton = ({
  children,
  onClick,
  themeColor,
  compact = false,
}: {
  children: ReactNode;
  onClick: () => void;
  themeColor: string;
  compact?: boolean;
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className={`flex items-center justify-center rounded-full text-surface-deep shadow-sm transition-colors duration-300 ${themeColor} ${
        compact ? "h-7 w-7 md:h-8 md:w-8" : "h-10 w-10 md:h-11 md:w-11"
      }`}
    >
      {children}
    </motion.button>
  );
};

const Indicator = ({
  isActive,
  theme,
  autoDelay,
  slideKey,
  onClick,
  compact = false,
}: {
  isActive: boolean;
  theme: ThemeConfig;
  autoDelay: number;
  slideKey: number | string;
  onClick: () => void;
  compact?: boolean;
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ borderRadius: 24 }}
      className={`relative cursor-pointer focus:outline-none ${
        compact ? "h-2" : "h-3"
      } ${
        isActive
          ? compact
            ? `w-8 ${theme.progress}`
            : `w-12 ${theme.progress}`
          : compact
            ? `w-2 ${theme.dot}`
            : `w-3 ${theme.dot}`
      } transition-colors duration-300`}
    >
      {isActive && (
        <motion.div
          key={slideKey}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: autoDelay / 1000, ease: "linear" }}
          className="absolute inset-0 rounded-full bg-mint-bright shadow-[0_0_8px_rgba(105,201,145,0.45)]"
        />
      )}
    </motion.button>
  );
};
