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
      className="frosted-bar flex items-center justify-center gap-1 rounded-full border border-white/[0.08] px-3 py-2 transition-colors duration-300 md:px-4 md:py-3"
    >
      <ArrowButton onClick={goPrev} themeColor={theme.button}>
        <ChevronLeft size={24} strokeWidth={3} />
      </ArrowButton>

      <div className="flex items-center gap-2 px-2">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <Indicator
            key={i}
            isActive={i === currentIndex}
            theme={theme}
            autoDelay={autoDelay}
            slideKey={slideKey ?? currentIndex}
            onClick={() => onIndexChange(i)}
          />
        ))}
      </div>

      <ArrowButton onClick={goNext} themeColor={theme.button}>
        <ChevronRight size={24} strokeWidth={3} />
      </ArrowButton>
    </motion.div>
  );
};

const ArrowButton = ({
  children,
  onClick,
  themeColor,
}: {
  children: ReactNode;
  onClick: () => void;
  themeColor: string;
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className={`flex h-10 w-10 items-center justify-center rounded-full text-surface-deep shadow-sm transition-colors duration-300 md:h-11 md:w-11 ${themeColor}`}
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
}: {
  isActive: boolean;
  theme: ThemeConfig;
  autoDelay: number;
  slideKey: number | string;
  onClick: () => void;
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ borderRadius: 24 }}
      className={`relative h-3 cursor-pointer  focus:outline-none ${
        isActive ? `w-12 ${theme.progress}` : `w-3 ${theme.dot}`
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
