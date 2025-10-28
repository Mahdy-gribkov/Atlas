import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { Loader2, AlertCircle, CheckCircle, Info, Sparkles, Star, Heart, Shield, Zap, Crown, Gem, Award, Trophy } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const progressVariants = cva(
  'relative w-full overflow-hidden bg-atlas-border-subtle',
  {
    variants: {
      variant: {
        default: 'bg-atlas-border-subtle',
        primary: 'bg-atlas-primary/20',
        secondary: 'bg-atlas-secondary/20',
        ai: 'bg-atlas-ai/20',
        success: 'bg-atlas-success/20',
        error: 'bg-atlas-error/20',
        warning: 'bg-atlas-warning/20',
        info: 'bg-atlas-info/20',
        gradient: 'bg-gradient-to-r from-atlas-primary/20 to-atlas-secondary/20',
        glass: 'bg-white/10 backdrop-blur-sm border border-white/20',
        neon: 'bg-atlas-primary/10 border border-atlas-primary/30 shadow-lg shadow-atlas-primary/20',
        metallic: 'bg-gradient-to-r from-gray-300/20 to-gray-500/20',
        rainbow: 'bg-gradient-to-r from-red-500/20 via-yellow-500/20 via-green-500/20 via-blue-500/20 to-purple-500/20',
        fire: 'bg-gradient-to-r from-red-500/20 to-orange-500/20',
        ice: 'bg-gradient-to-r from-blue-400/20 to-cyan-400/20',
        earth: 'bg-gradient-to-r from-green-600/20 to-yellow-600/20',
        sky: 'bg-gradient-to-r from-blue-500/20 to-sky-400/20',
        ocean: 'bg-gradient-to-r from-blue-600/20 to-teal-500/20',
        sunset: 'bg-gradient-to-r from-orange-500/20 to-pink-500/20',
        aurora: 'bg-gradient-to-r from-green-400/20 via-blue-500/20 to-purple-500/20',
        cosmic: 'bg-gradient-to-r from-purple-600/20 to-pink-600/20',
        galaxy: 'bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20',
        solar: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20',
        lunar: 'bg-gradient-to-r from-gray-400/20 to-blue-400/20',
        stellar: 'bg-gradient-to-r from-blue-500/20 to-indigo-600/20',
        nebula: 'bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20',
        quantum: 'bg-gradient-to-r from-cyan-400/20 to-emerald-400/20',
        crystal: 'bg-gradient-to-r from-purple-400/20 to-pink-400/20',
        diamond: 'bg-gradient-to-r from-blue-300/20 to-cyan-300/20',
        pearl: 'bg-gradient-to-r from-gray-200/20 to-white/20',
        gold: 'bg-gradient-to-r from-yellow-400/20 to-yellow-600/20',
        silver: 'bg-gradient-to-r from-gray-300/20 to-gray-500/20',
        bronze: 'bg-gradient-to-r from-orange-400/20 to-orange-600/20',
        platinum: 'bg-gradient-to-r from-gray-200/20 to-gray-400/20',
        titanium: 'bg-gradient-to-r from-gray-400/20 to-gray-600/20',
        steel: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        copper: 'bg-gradient-to-r from-orange-500/20 to-red-500/20',
        iron: 'bg-gradient-to-r from-gray-600/20 to-gray-800/20',
        aluminum: 'bg-gradient-to-r from-gray-300/20 to-gray-500/20',
        zinc: 'bg-gradient-to-r from-gray-400/20 to-gray-600/20',
        nickel: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        chrome: 'bg-gradient-to-r from-gray-400/20 to-gray-600/20',
        brass: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20',
        pewter: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        lead: 'bg-gradient-to-r from-gray-600/20 to-gray-800/20',
        tin: 'bg-gradient-to-r from-gray-400/20 to-gray-600/20',
        mercury: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        arsenic: 'bg-gradient-to-r from-gray-600/20 to-gray-800/20',
        antimony: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        bismuth: 'bg-gradient-to-r from-gray-400/20 to-gray-600/20',
        polonium: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        astatine: 'bg-gradient-to-r from-gray-600/20 to-gray-800/20',
        radon: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        francium: 'bg-gradient-to-r from-gray-400/20 to-gray-600/20',
        radium: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        actinium: 'bg-gradient-to-r from-gray-600/20 to-gray-800/20',
        thorium: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        protactinium: 'bg-gradient-to-r from-gray-400/20 to-gray-600/20',
        uranium: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        neptunium: 'bg-gradient-to-r from-gray-600/20 to-gray-800/20',
        plutonium: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        americium: 'bg-gradient-to-r from-gray-400/20 to-gray-600/20',
        curium: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        berkelium: 'bg-gradient-to-r from-gray-600/20 to-gray-800/20',
        californium: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        einsteinium: 'bg-gradient-to-r from-gray-400/20 to-gray-600/20',
        fermium: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        mendelevium: 'bg-gradient-to-r from-gray-600/20 to-gray-800/20',
        nobelium: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        lawrencium: 'bg-gradient-to-r from-gray-400/20 to-gray-600/20',
        rutherfordium: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        dubnium: 'bg-gradient-to-r from-gray-600/20 to-gray-800/20',
        seaborgium: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        bohrium: 'bg-gradient-to-r from-gray-400/20 to-gray-600/20',
        hassium: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        meitnerium: 'bg-gradient-to-r from-gray-600/20 to-gray-800/20',
        darmstadtium: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        roentgenium: 'bg-gradient-to-r from-gray-400/20 to-gray-600/20',
        copernicium: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        nihonium: 'bg-gradient-to-r from-gray-600/20 to-gray-800/20',
        flerovium: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        moscovium: 'bg-gradient-to-r from-gray-400/20 to-gray-600/20',
        livermorium: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
        tennessine: 'bg-gradient-to-r from-gray-600/20 to-gray-800/20',
        oganesson: 'bg-gradient-to-r from-gray-500/20 to-gray-700/20',
      },
      size: {
        xs: 'h-1',
        sm: 'h-2',
        default: 'h-4',
        lg: 'h-6',
        xl: 'h-8',
        '2xl': 'h-10',
        '3xl': 'h-12',
        '4xl': 'h-16',
      },
      shape: {
        rounded: 'rounded-full',
        square: 'rounded-none',
        pill: 'rounded-full',
        soft: 'rounded-lg',
        sharp: 'rounded-sm',
        none: 'rounded-none',
      },
      animation: {
        none: '',
        pulse: 'animate-pulse',
        bounce: 'animate-bounce',
        spin: 'animate-spin',
        ping: 'animate-ping',
        fade: 'animate-fade-in',
        slide: 'animate-slide-in',
        scale: 'animate-scale-in',
        spring: 'animate-spring',
        glow: 'animate-glow',
        shimmer: 'animate-shimmer',
        wave: 'animate-wave',
        ripple: 'animate-ripple',
        float: 'animate-float',
        wiggle: 'animate-wiggle',
        heartbeat: 'animate-heartbeat',
        breathe: 'animate-breathe',
        orbit: 'animate-orbit',
        rotate: 'animate-rotate',
        flip: 'animate-flip',
        zoom: 'animate-zoom',
        shake: 'animate-shake',
        wobble: 'animate-wobble',
        jello: 'animate-jello',
        hinge: 'animate-hinge',
        jackInTheBox: 'animate-jack-in-the-box',
        rollIn: 'animate-roll-in',
        rollOut: 'animate-roll-out',
        lightSpeedIn: 'animate-light-speed-in',
        lightSpeedOut: 'animate-light-speed-out',
        rubberBand: 'animate-rubber-band',
        tada: 'animate-tada',
        flash: 'animate-flash',
        headShake: 'animate-head-shake',
        swing: 'animate-swing',
        flipInX: 'animate-flip-in-x',
        flipInY: 'animate-flip-in-y',
        flipOutX: 'animate-flip-out-x',
        flipOutY: 'animate-flip-out-y',
        slideInDown: 'animate-slide-in-down',
        slideInLeft: 'animate-slide-in-left',
        slideInRight: 'animate-slide-in-right',
        slideInUp: 'animate-slide-in-up',
        slideOutDown: 'animate-slide-out-down',
        slideOutLeft: 'animate-slide-out-left',
        slideOutRight: 'animate-slide-out-right',
        slideOutUp: 'animate-slide-out-up',
        zoomIn: 'animate-zoom-in',
        zoomInDown: 'animate-zoom-in-down',
        zoomInLeft: 'animate-zoom-in-left',
        zoomInRight: 'animate-zoom-in-right',
        zoomInUp: 'animate-zoom-in-up',
        zoomOut: 'animate-zoom-out',
        zoomOutDown: 'animate-zoom-out-down',
        zoomOutLeft: 'animate-zoom-out-left',
        zoomOutRight: 'animate-zoom-out-right',
        zoomOutUp: 'animate-zoom-out-up',
        fadeIn: 'animate-fade-in',
        fadeInDown: 'animate-fade-in-down',
        fadeInDownBig: 'animate-fade-in-down-big',
        fadeInLeft: 'animate-fade-in-left',
        fadeInLeftBig: 'animate-fade-in-left-big',
        fadeInRight: 'animate-fade-in-right',
        fadeInRightBig: 'animate-fade-in-right-big',
        fadeInUp: 'animate-fade-in-up',
        fadeInUpBig: 'animate-fade-in-up-big',
        fadeOut: 'animate-fade-out',
        fadeOutDown: 'animate-fade-out-down',
        fadeOutDownBig: 'animate-fade-out-down-big',
        fadeOutLeft: 'animate-fade-out-left',
        fadeOutLeftBig: 'animate-fade-out-left-big',
        fadeOutRight: 'animate-fade-out-right',
        fadeOutRightBig: 'animate-fade-out-right-big',
        fadeOutUp: 'animate-fade-out-up',
        fadeOutUpBig: 'animate-fade-out-up-big',
        bounceIn: 'animate-bounce-in',
        bounceInDown: 'animate-bounce-in-down',
        bounceInLeft: 'animate-bounce-in-left',
        bounceInRight: 'animate-bounce-in-right',
        bounceInUp: 'animate-bounce-in-up',
        bounceOut: 'animate-bounce-out',
        bounceOutDown: 'animate-bounce-out-down',
        bounceOutLeft: 'animate-bounce-out-left',
        bounceOutRight: 'animate-bounce-out-right',
        bounceOutUp: 'animate-bounce-out-up',
      },
      shadow: {
        none: '',
        sm: 'shadow-sm',
        default: 'shadow',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
        '2xl': 'shadow-2xl',
        inner: 'shadow-inner',
        glow: 'shadow-glow',
        neon: 'shadow-neon',
        soft: 'shadow-soft',
        hard: 'shadow-hard',
        colored: 'shadow-colored',
        rainbow: 'shadow-rainbow',
        fire: 'shadow-fire',
        ice: 'shadow-ice',
        earth: 'shadow-earth',
        sky: 'shadow-sky',
        ocean: 'shadow-ocean',
        sunset: 'shadow-sunset',
        aurora: 'shadow-aurora',
        cosmic: 'shadow-cosmic',
        galaxy: 'shadow-galaxy',
        solar: 'shadow-solar',
        lunar: 'shadow-lunar',
        stellar: 'shadow-stellar',
        nebula: 'shadow-nebula',
        quantum: 'shadow-quantum',
        crystal: 'shadow-crystal',
        diamond: 'shadow-diamond',
        pearl: 'shadow-pearl',
        gold: 'shadow-gold',
        silver: 'shadow-silver',
        bronze: 'shadow-bronze',
        platinum: 'shadow-platinum',
        titanium: 'shadow-titanium',
        steel: 'shadow-steel',
        copper: 'shadow-copper',
        iron: 'shadow-iron',
        aluminum: 'shadow-aluminum',
        zinc: 'shadow-zinc',
        nickel: 'shadow-nickel',
        chrome: 'shadow-chrome',
        brass: 'shadow-brass',
        pewter: 'shadow-pewter',
        lead: 'shadow-lead',
        tin: 'shadow-tin',
        mercury: 'shadow-mercury',
        arsenic: 'shadow-arsenic',
        antimony: 'shadow-antimony',
        bismuth: 'shadow-bismuth',
        polonium: 'shadow-polonium',
        astatine: 'shadow-astatine',
        radon: 'shadow-radon',
        francium: 'shadow-francium',
        radium: 'shadow-radium',
        actinium: 'shadow-actinium',
        thorium: 'shadow-thorium',
        protactinium: 'shadow-protactinium',
        uranium: 'shadow-uranium',
        neptunium: 'shadow-neptunium',
        plutonium: 'shadow-plutonium',
        americium: 'shadow-americium',
        curium: 'shadow-curium',
        berkelium: 'shadow-berkelium',
        californium: 'shadow-californium',
        einsteinium: 'shadow-einsteinium',
        fermium: 'shadow-fermium',
        mendelevium: 'shadow-mendelevium',
        nobelium: 'shadow-nobelium',
        lawrencium: 'shadow-lawrencium',
        rutherfordium: 'shadow-rutherfordium',
        dubnium: 'shadow-dubnium',
        seaborgium: 'shadow-seaborgium',
        bohrium: 'shadow-bohrium',
        hassium: 'shadow-hassium',
        meitnerium: 'shadow-meitnerium',
        darmstadtium: 'shadow-darmstadtium',
        roentgenium: 'shadow-roentgenium',
        copernicium: 'shadow-copernicium',
        nihonium: 'shadow-nihonium',
        flerovium: 'shadow-flerovium',
        moscovium: 'shadow-moscovium',
        livermorium: 'shadow-livermorium',
        tennessine: 'shadow-tennessine',
        oganesson: 'shadow-oganesson',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'rounded',
      animation: 'none',
      shadow: 'none',
    },
  }
);

export interface ProgressProps extends Omit<React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>, 'content'>, VariantProps<typeof progressVariants> {
  // Basic props
  value?: number;
  max?: number;
  
  // Content props
  label?: string;
  subtitle?: string;
  description?: string;
  content?: React.ReactNode;
  
  // Display props
  showLabel?: boolean;
  showSubtitle?: boolean;
  showDescription?: boolean;
  showPercentage?: boolean;
  showValue?: boolean;
  showIcon?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom' | 'center';
  
  // Interactive props
  clickable?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  
  // Animation props
  animationDuration?: number;
  animationEasing?: string;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  
  // Custom styling
  customStyles?: React.CSSProperties;
  customClasses?: string;
  
  // Accessibility
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-valuemin'?: number;
  'aria-valuemax'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;
}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({
    className,
    size,
    variant,
    shape,
    animation,
    shadow,
    value = 0,
    max = 100,
    label,
    subtitle,
    description,
    content,
    showLabel = false,
    showSubtitle = false,
    showDescription = false,
    showPercentage = false,
    showValue = false,
    showIcon = false,
    icon,
    iconPosition = 'left',
    clickable = false,
    onClick,
    disabled = false,
    loading = false,
    loadingText = 'Loading...',
    animationDuration = 300,
    animationEasing = 'ease-in-out',
    onAnimationStart,
    onAnimationEnd,
    customStyles,
    customClasses,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-valuemin': ariaValueMin = 0,
    'aria-valuemax': ariaValueMax = 100,
    'aria-valuenow': ariaValueNow,
    'aria-valuetext': ariaValueText,
    ...props
  }, ref) => {
    const [isAnimating, setIsAnimating] = React.useState(false);
    const percentage = Math.round((value / max) * 100);
    
    const getDefaultIcon = () => {
      switch (variant) {
        case 'success':
          return <CheckCircle className="h-4 w-4" />;
        case 'error':
          return <AlertCircle className="h-4 w-4" />;
        case 'warning':
          return <AlertCircle className="h-4 w-4" />;
        case 'info':
          return <Info className="h-4 w-4" />;
        case 'ai':
          return <Sparkles className="h-4 w-4" />;
        case 'primary':
          return <Star className="h-4 w-4" />;
        case 'secondary':
          return <Heart className="h-4 w-4" />;
        case 'gradient':
          return <Zap className="h-4 w-4" />;
        case 'glass':
          return <Shield className="h-4 w-4" />;
        case 'neon':
          return <Crown className="h-4 w-4" />;
        case 'metallic':
          return <Gem className="h-4 w-4" />;
        case 'rainbow':
          return <Award className="h-4 w-4" />;
        case 'fire':
          return <Trophy className="h-4 w-4" />;
        default:
          return <Loader2 className="h-4 w-4" />;
      }
    };

    const handleAnimationStart = React.useCallback(() => {
      setIsAnimating(true);
      onAnimationStart?.();
    }, [onAnimationStart]);

    const handleAnimationEnd = React.useCallback(() => {
      setIsAnimating(false);
      onAnimationEnd?.();
    }, [onAnimationEnd]);

    const handleClick = React.useCallback(() => {
      if (clickable && !disabled && !loading && onClick) {
        onClick();
      }
    }, [clickable, disabled, loading, onClick]);

    React.useEffect(() => {
      if (animation !== 'none') {
        handleAnimationStart();
        const timer = setTimeout(handleAnimationEnd, animationDuration);
        return () => clearTimeout(timer);
      }
      return undefined;
    }, [animation, animationDuration, handleAnimationStart, handleAnimationEnd]);

    const progressClasses = cn(
      progressVariants({ size, variant, shape, animation, shadow }),
      clickable && !disabled && !loading && 'cursor-pointer hover:opacity-80',
      disabled && 'opacity-50 cursor-not-allowed',
      loading && 'opacity-75 cursor-wait',
      customClasses,
      className
    );

    const indicatorClasses = cn(
      'h-full w-full flex-1 transition-all duration-300 ease-in-out',
      variant === 'default' && 'bg-atlas-primary-main',
      variant === 'primary' && 'bg-atlas-primary-main',
      variant === 'secondary' && 'bg-atlas-secondary-main',
      variant === 'ai' && 'bg-atlas-ai-main',
      variant === 'success' && 'bg-atlas-success-main',
      variant === 'error' && 'bg-atlas-error-main',
      variant === 'warning' && 'bg-atlas-warning-main',
      variant === 'info' && 'bg-atlas-info-main',
      variant === 'gradient' && 'bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main',
      variant === 'glass' && 'bg-white/20 backdrop-blur-sm',
      variant === 'neon' && 'bg-atlas-primary-main shadow-lg shadow-atlas-primary-main/50',
      variant === 'metallic' && 'bg-gradient-to-r from-gray-400 to-gray-600',
      variant === 'rainbow' && 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
      variant === 'fire' && 'bg-gradient-to-r from-red-500 to-orange-500',
      variant === 'ice' && 'bg-gradient-to-r from-blue-400 to-cyan-400',
      variant === 'earth' && 'bg-gradient-to-r from-green-600 to-yellow-600',
      variant === 'sky' && 'bg-gradient-to-r from-blue-500 to-sky-400',
      variant === 'ocean' && 'bg-gradient-to-r from-blue-600 to-teal-500',
      variant === 'sunset' && 'bg-gradient-to-r from-orange-500 to-pink-500',
      variant === 'aurora' && 'bg-gradient-to-r from-green-400 via-blue-500 to-purple-500',
      variant === 'cosmic' && 'bg-gradient-to-r from-purple-600 to-pink-600',
      variant === 'galaxy' && 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600',
      variant === 'solar' && 'bg-gradient-to-r from-yellow-500 to-orange-500',
      variant === 'lunar' && 'bg-gradient-to-r from-gray-400 to-blue-400',
      variant === 'stellar' && 'bg-gradient-to-r from-blue-500 to-indigo-600',
      variant === 'nebula' && 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500',
      variant === 'quantum' && 'bg-gradient-to-r from-cyan-400 to-emerald-400',
      variant === 'crystal' && 'bg-gradient-to-r from-purple-400 to-pink-400',
      variant === 'diamond' && 'bg-gradient-to-r from-blue-300 to-cyan-300',
      variant === 'pearl' && 'bg-gradient-to-r from-gray-200 to-white',
      variant === 'gold' && 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      variant === 'silver' && 'bg-gradient-to-r from-gray-300 to-gray-500',
      variant === 'bronze' && 'bg-gradient-to-r from-orange-400 to-orange-600',
      variant === 'platinum' && 'bg-gradient-to-r from-gray-200 to-gray-400',
      variant === 'titanium' && 'bg-gradient-to-r from-gray-400 to-gray-600',
      variant === 'steel' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'copper' && 'bg-gradient-to-r from-orange-500 to-red-500',
      variant === 'iron' && 'bg-gradient-to-r from-gray-600 to-gray-800',
      variant === 'aluminum' && 'bg-gradient-to-r from-gray-300 to-gray-500',
      variant === 'zinc' && 'bg-gradient-to-r from-gray-400 to-gray-600',
      variant === 'nickel' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'chrome' && 'bg-gradient-to-r from-gray-400 to-gray-600',
      variant === 'brass' && 'bg-gradient-to-r from-yellow-500 to-orange-500',
      variant === 'pewter' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'lead' && 'bg-gradient-to-r from-gray-600 to-gray-800',
      variant === 'tin' && 'bg-gradient-to-r from-gray-400 to-gray-600',
      variant === 'mercury' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'arsenic' && 'bg-gradient-to-r from-gray-600 to-gray-800',
      variant === 'antimony' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'bismuth' && 'bg-gradient-to-r from-gray-400 to-gray-600',
      variant === 'polonium' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'astatine' && 'bg-gradient-to-r from-gray-600 to-gray-800',
      variant === 'radon' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'francium' && 'bg-gradient-to-r from-gray-400 to-gray-600',
      variant === 'radium' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'actinium' && 'bg-gradient-to-r from-gray-600 to-gray-800',
      variant === 'thorium' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'protactinium' && 'bg-gradient-to-r from-gray-400 to-gray-600',
      variant === 'uranium' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'neptunium' && 'bg-gradient-to-r from-gray-600 to-gray-800',
      variant === 'plutonium' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'americium' && 'bg-gradient-to-r from-gray-400 to-gray-600',
      variant === 'curium' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'berkelium' && 'bg-gradient-to-r from-gray-600 to-gray-800',
      variant === 'californium' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'einsteinium' && 'bg-gradient-to-r from-gray-400 to-gray-600',
      variant === 'fermium' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'mendelevium' && 'bg-gradient-to-r from-gray-600 to-gray-800',
      variant === 'nobelium' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'lawrencium' && 'bg-gradient-to-r from-gray-400 to-gray-600',
      variant === 'rutherfordium' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'dubnium' && 'bg-gradient-to-r from-gray-600 to-gray-800',
      variant === 'seaborgium' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'bohrium' && 'bg-gradient-to-r from-gray-400 to-gray-600',
      variant === 'hassium' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'meitnerium' && 'bg-gradient-to-r from-gray-600 to-gray-800',
      variant === 'darmstadtium' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'roentgenium' && 'bg-gradient-to-r from-gray-400 to-gray-600',
      variant === 'copernicium' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'nihonium' && 'bg-gradient-to-r from-gray-600 to-gray-800',
      variant === 'flerovium' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'moscovium' && 'bg-gradient-to-r from-gray-400 to-gray-600',
      variant === 'livermorium' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      variant === 'tennessine' && 'bg-gradient-to-r from-gray-600 to-gray-800',
      variant === 'oganesson' && 'bg-gradient-to-r from-gray-500 to-gray-700',
      loading && 'animate-pulse',
      isAnimating && 'animate-pulse'
    );

    return (
      <div className="space-y-2">
        {/* Header with label, subtitle, description, and icons */}
        {(showLabel || showSubtitle || showDescription || showIcon || label || subtitle || description) && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {showIcon && (
                <div className={cn(
                  'flex items-center justify-center',
                  iconPosition === 'left' && 'order-first',
                  iconPosition === 'right' && 'order-last',
                  iconPosition === 'top' && 'order-first flex-col',
                  iconPosition === 'bottom' && 'order-last flex-col',
                  iconPosition === 'center' && 'order-first'
                )}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    icon || getDefaultIcon()
                  )}
                </div>
              )}
              
              <div className="flex flex-col">
                {showLabel && label && (
                  <span className="text-sm font-medium text-atlas-text-primary">
                    {label}
                  </span>
                )}
                {showSubtitle && subtitle && (
                  <span className="text-xs text-atlas-text-secondary">
                    {subtitle}
                  </span>
                )}
                {showDescription && description && (
                  <span className="text-xs text-atlas-text-tertiary">
                    {description}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {showValue && (
                <span className="text-sm text-atlas-text-secondary">
                  {value}/{max}
                </span>
              )}
              {showPercentage && (
                <span className="text-sm font-medium text-atlas-text-primary">
                  {percentage}%
                </span>
              )}
            </div>
          </div>
        )}

        {/* Progress bar */}
        <ProgressPrimitive.Root
          ref={ref}
          className={progressClasses}
          style={customStyles}
          onClick={handleClick}
          aria-label={ariaLabel || label || `Progress: ${percentage}%`}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-valuemin={ariaValueMin}
          aria-valuemax={ariaValueMax}
          aria-valuenow={ariaValueNow || value}
          aria-valuetext={ariaValueText || `${percentage}% complete`}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={indicatorClasses}
            style={{ 
              transform: `translateX(-${100 - percentage}%)`,
              transitionDuration: `${animationDuration}ms`,
              transitionTimingFunction: animationEasing
            }}
          />
          
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm">
              <div className="flex items-center space-x-2 text-sm text-atlas-text-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{loadingText}</span>
              </div>
            </div>
          )}
        </ProgressPrimitive.Root>

        {/* Custom content */}
        {content && (
          <div className="text-sm text-atlas-text-secondary">
            {content}
          </div>
        )}
      </div>
    );
  }
);
Progress.displayName = ProgressPrimitive.Root.displayName;

// Enhanced ProgressBar with comprehensive features
export interface ProgressBarProps extends Omit<ProgressProps, 'value'> {
  value: number;
  max?: number;
  label?: string;
  subtitle?: string;
  description?: string;
  showPercentage?: boolean;
  showValue?: boolean;
  showLabel?: boolean;
  showSubtitle?: boolean;
  showDescription?: boolean;
  showIcon?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom' | 'center';
  animated?: boolean;
  striped?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  animationDuration?: number;
  animationEasing?: string;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  customStyles?: React.CSSProperties;
  customClasses?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-valuemin'?: number;
  'aria-valuemax'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;
}

const ProgressBar = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressBarProps
>(({
  value,
  max = 100,
  label,
  subtitle,
  description,
  showPercentage = true,
  showValue = false,
  showLabel = true,
  showSubtitle = false,
  showDescription = false,
  showIcon = false,
  icon,
  iconPosition = 'left',
  size = 'default',
  variant = 'default',
  shape = 'rounded',
  animation = 'none',
  shadow = 'none',
  className,
  animated = false,
  striped = false,
  clickable = false,
  onClick,
  disabled = false,
  loading = false,
  loadingText = 'Loading...',
  animationDuration = 300,
  animationEasing = 'ease-in-out',
  onAnimationStart,
  onAnimationEnd,
  customStyles,
  customClasses,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-valuemin': ariaValueMin = 0,
  'aria-valuemax': ariaValueMax = 100,
  'aria-valuenow': ariaValueNow,
  'aria-valuetext': ariaValueText,
  ...props
}, ref) => {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <Progress
      ref={ref}
      value={percentage}
      max={100}
      label={label}
      subtitle={subtitle}
      description={description}
      showLabel={showLabel}
      showSubtitle={showSubtitle}
      showDescription={showDescription}
      showPercentage={showPercentage}
      showValue={showValue}
      showIcon={showIcon}
      icon={icon}
      iconPosition={iconPosition}
      size={size}
      variant={variant}
      shape={shape}
      animation={animated ? 'pulse' : animation}
      shadow={shadow}
      className={cn(
        striped && 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_20px]',
        className
      )}
      clickable={clickable}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      loadingText={loadingText}
      animationDuration={animationDuration}
      animationEasing={animationEasing}
      onAnimationStart={onAnimationStart}
      onAnimationEnd={onAnimationEnd}
      customStyles={customStyles}
      customClasses={customClasses}
      aria-label={ariaLabel || label || `Progress: ${percentage}%`}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-valuemin={ariaValueMin}
      aria-valuemax={ariaValueMax}
      aria-valuenow={ariaValueNow || value}
      aria-valuetext={ariaValueText || `${percentage}% complete`}
      {...props}
    />
  );
});
ProgressBar.displayName = 'ProgressBar';

// Enhanced Circular Progress with comprehensive features
export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  subtitle?: string;
  description?: string;
  showPercentage?: boolean;
  showValue?: boolean;
  showLabel?: boolean;
  showSubtitle?: boolean;
  showDescription?: boolean;
  showIcon?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  variant?: 'default' | 'primary' | 'secondary' | 'ai' | 'success' | 'error' | 'warning' | 'info' | 'gradient' | 'glass' | 'neon' | 'metallic' | 'rainbow' | 'fire' | 'ice' | 'earth' | 'sky' | 'ocean' | 'sunset' | 'aurora' | 'cosmic' | 'galaxy' | 'solar' | 'lunar' | 'stellar' | 'nebula' | 'quantum' | 'crystal' | 'diamond' | 'pearl' | 'gold' | 'silver' | 'bronze' | 'platinum' | 'titanium' | 'steel' | 'copper' | 'iron' | 'aluminum' | 'zinc' | 'nickel' | 'chrome' | 'brass' | 'pewter' | 'lead' | 'tin' | 'mercury' | 'arsenic' | 'antimony' | 'bismuth' | 'polonium' | 'astatine' | 'radon' | 'francium' | 'radium' | 'actinium' | 'thorium' | 'protactinium' | 'uranium' | 'neptunium' | 'plutonium' | 'americium' | 'curium' | 'berkelium' | 'californium' | 'einsteinium' | 'fermium' | 'mendelevium' | 'nobelium' | 'lawrencium' | 'rutherfordium' | 'dubnium' | 'seaborgium' | 'bohrium' | 'hassium' | 'meitnerium' | 'darmstadtium' | 'roentgenium' | 'copernicium' | 'nihonium' | 'flerovium' | 'moscovium' | 'livermorium' | 'tennessine' | 'oganesson';
  className?: string;
  animated?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  animationDuration?: number;
  animationEasing?: string;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  customStyles?: React.CSSProperties;
  customClasses?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-valuemin'?: number;
  'aria-valuemax'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  ({
    value,
    max = 100,
    size = 120,
    strokeWidth = 8,
    label,
    subtitle,
    description,
    showPercentage = true,
    showValue = false,
    showLabel = true,
    showSubtitle = false,
    showDescription = false,
    showIcon = false,
    icon,
    iconPosition = 'center',
    variant = 'default',
    className,
    animated = false,
    clickable = false,
    onClick,
    disabled = false,
    loading = false,
    loadingText = 'Loading...',
    animationDuration = 300,
    animationEasing = 'ease-in-out',
    onAnimationStart,
    onAnimationEnd,
    customStyles,
    customClasses,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-valuemin': ariaValueMin = 0,
    'aria-valuemax': ariaValueMax = 100,
    'aria-valuenow': ariaValueNow,
    'aria-valuetext': ariaValueText,
  }, ref) => {
    const [isAnimating, setIsAnimating] = React.useState(false);
    const percentage = Math.round((value / max) * 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    const getDefaultIcon = () => {
      switch (variant) {
        case 'success':
          return <CheckCircle className="h-6 w-6" />;
        case 'error':
          return <AlertCircle className="h-6 w-6" />;
        case 'warning':
          return <AlertCircle className="h-6 w-6" />;
        case 'info':
          return <Info className="h-6 w-6" />;
        case 'ai':
          return <Sparkles className="h-6 w-6" />;
        case 'primary':
          return <Star className="h-6 w-6" />;
        case 'secondary':
          return <Heart className="h-6 w-6" />;
        case 'gradient':
          return <Zap className="h-6 w-6" />;
        case 'glass':
          return <Shield className="h-6 w-6" />;
        case 'neon':
          return <Crown className="h-6 w-6" />;
        case 'metallic':
          return <Gem className="h-6 w-6" />;
        case 'rainbow':
          return <Award className="h-6 w-6" />;
        case 'fire':
          return <Trophy className="h-6 w-6" />;
        default:
          return <Loader2 className="h-6 w-6" />;
      }
    };

    const handleAnimationStart = React.useCallback(() => {
      setIsAnimating(true);
      onAnimationStart?.();
    }, [onAnimationStart]);

    const handleAnimationEnd = React.useCallback(() => {
      setIsAnimating(false);
      onAnimationEnd?.();
    }, [onAnimationEnd]);

    const handleClick = React.useCallback(() => {
      if (clickable && !disabled && !loading && onClick) {
        onClick();
      }
    }, [clickable, disabled, loading, onClick]);

    React.useEffect(() => {
      if (animated) {
        handleAnimationStart();
        const timer = setTimeout(handleAnimationEnd, animationDuration);
        return () => clearTimeout(timer);
      }
      return undefined;
    }, [animated, animationDuration, handleAnimationStart, handleAnimationEnd]);

    const colorClasses = {
      default: 'text-atlas-primary-main',
      primary: 'text-atlas-primary-main',
      secondary: 'text-atlas-secondary-main',
      ai: 'text-atlas-ai-main',
      success: 'text-atlas-success-main',
      error: 'text-atlas-error-main',
      warning: 'text-atlas-warning-main',
      info: 'text-atlas-info-main',
      gradient: 'text-transparent bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main bg-clip-text',
      glass: 'text-white/80',
      neon: 'text-atlas-primary-main drop-shadow-lg',
      metallic: 'text-gray-600',
      rainbow: 'text-transparent bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text',
      fire: 'text-transparent bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text',
      ice: 'text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text',
      earth: 'text-transparent bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text',
      sky: 'text-transparent bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text',
      ocean: 'text-transparent bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text',
      sunset: 'text-transparent bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text',
      aurora: 'text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text',
      cosmic: 'text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text',
      galaxy: 'text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text',
      solar: 'text-transparent bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text',
      lunar: 'text-transparent bg-gradient-to-r from-gray-400 to-blue-400 bg-clip-text',
      stellar: 'text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text',
      nebula: 'text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text',
      quantum: 'text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text',
      crystal: 'text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text',
      diamond: 'text-transparent bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text',
      pearl: 'text-transparent bg-gradient-to-r from-gray-200 to-white bg-clip-text',
      gold: 'text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text',
      silver: 'text-transparent bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text',
      bronze: 'text-transparent bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text',
      platinum: 'text-transparent bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text',
      titanium: 'text-transparent bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text',
      steel: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      copper: 'text-transparent bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text',
      iron: 'text-transparent bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text',
      aluminum: 'text-transparent bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text',
      zinc: 'text-transparent bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text',
      nickel: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      chrome: 'text-transparent bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text',
      brass: 'text-transparent bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text',
      pewter: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      lead: 'text-transparent bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text',
      tin: 'text-transparent bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text',
      mercury: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      arsenic: 'text-transparent bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text',
      antimony: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      bismuth: 'text-transparent bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text',
      polonium: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      astatine: 'text-transparent bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text',
      radon: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      francium: 'text-transparent bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text',
      radium: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      actinium: 'text-transparent bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text',
      thorium: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      protactinium: 'text-transparent bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text',
      uranium: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      neptunium: 'text-transparent bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text',
      plutonium: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      americium: 'text-transparent bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text',
      curium: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      berkelium: 'text-transparent bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text',
      californium: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      einsteinium: 'text-transparent bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text',
      fermium: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      mendelevium: 'text-transparent bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text',
      nobelium: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      lawrencium: 'text-transparent bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text',
      rutherfordium: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      dubnium: 'text-transparent bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text',
      seaborgium: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      bohrium: 'text-transparent bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text',
      hassium: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      meitnerium: 'text-transparent bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text',
      darmstadtium: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      roentgenium: 'text-transparent bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text',
      copernicium: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      nihonium: 'text-transparent bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text',
      flerovium: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      moscovium: 'text-transparent bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text',
      livermorium: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
      tennessine: 'text-transparent bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text',
      oganesson: 'text-transparent bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text',
    };

    return (
      <div 
        ref={ref} 
        className={cn(
          'flex flex-col items-center space-y-2',
          clickable && !disabled && !loading && 'cursor-pointer hover:opacity-80',
          disabled && 'opacity-50 cursor-not-allowed',
          loading && 'opacity-75 cursor-wait',
          customClasses,
          className
        )}
        onClick={handleClick}
        style={customStyles}
        aria-label={ariaLabel || label || `Circular progress: ${percentage}%`}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-valuemin={ariaValueMin}
        aria-valuemax={ariaValueMax}
        aria-valuenow={ariaValueNow || value}
        aria-valuetext={ariaValueText || `${percentage}% complete`}
      >
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            className={cn(
              'transform -rotate-90',
              animated && 'animate-spin',
              isAnimating && 'animate-pulse'
            )}
            aria-hidden="true"
          >
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              className="text-atlas-border-subtle"
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={cn(
                'transition-all ease-in-out',
                colorClasses[variant],
                `duration-${animationDuration}`
              )}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {showIcon && iconPosition === 'center' && (
                <div className="mb-2">
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    icon || getDefaultIcon()
                  )}
                </div>
              )}
              
              {showPercentage && (
                <div className={cn('text-lg font-semibold', colorClasses[variant])}>
                  {percentage}%
                </div>
              )}
              
              {showValue && (
                <div className={cn('text-sm', colorClasses[variant])}>
                  {value}/{max}
                </div>
              )}
              
              {showLabel && label && (
                <div className="text-xs text-atlas-text-tertiary mt-1">
                  {label}
                </div>
              )}
              
              {showSubtitle && subtitle && (
                <div className="text-xs text-atlas-text-tertiary">
                  {subtitle}
                </div>
              )}
              
              {showDescription && description && (
                <div className="text-xs text-atlas-text-tertiary">
                  {description}
                </div>
              )}
            </div>
          </div>
          
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full">
              <div className="flex items-center space-x-2 text-sm text-atlas-text-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{loadingText}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* External labels */}
        {(showLabel || showSubtitle || showDescription || showIcon) && (
          <div className="text-center space-y-1">
            {showIcon && iconPosition !== 'center' && (
              <div className="flex justify-center">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  icon || getDefaultIcon()
                )}
              </div>
            )}
            
            {showLabel && label && iconPosition !== 'center' && (
              <div className="text-sm font-medium text-atlas-text-primary">
                {label}
              </div>
            )}
            
            {showSubtitle && subtitle && (
              <div className="text-xs text-atlas-text-secondary">
                {subtitle}
              </div>
            )}
            
            {showDescription && description && (
              <div className="text-xs text-atlas-text-tertiary">
                {description}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);
CircularProgress.displayName = 'CircularProgress';

// Enhanced Step Progress with comprehensive features
export interface StepProgressProps {
  steps: string[];
  currentStep: number;
  completedSteps?: number[];
  variant?: 'default' | 'primary' | 'secondary' | 'ai' | 'success' | 'error' | 'warning' | 'info' | 'gradient' | 'glass' | 'neon' | 'metallic' | 'rainbow' | 'fire' | 'ice' | 'earth' | 'sky' | 'ocean' | 'sunset' | 'aurora' | 'cosmic' | 'galaxy' | 'solar' | 'lunar' | 'stellar' | 'nebula' | 'quantum' | 'crystal' | 'diamond' | 'pearl' | 'gold' | 'silver' | 'bronze' | 'platinum' | 'titanium' | 'steel' | 'copper' | 'iron' | 'aluminum' | 'zinc' | 'nickel' | 'chrome' | 'brass' | 'pewter' | 'lead' | 'tin' | 'mercury' | 'arsenic' | 'antimony' | 'bismuth' | 'polonium' | 'astatine' | 'radon' | 'francium' | 'radium' | 'actinium' | 'thorium' | 'protactinium' | 'uranium' | 'neptunium' | 'plutonium' | 'americium' | 'curium' | 'berkelium' | 'californium' | 'einsteinium' | 'fermium' | 'mendelevium' | 'nobelium' | 'lawrencium' | 'rutherfordium' | 'dubnium' | 'seaborgium' | 'bohrium' | 'hassium' | 'meitnerium' | 'darmstadtium' | 'roentgenium' | 'copernicium' | 'nihonium' | 'flerovium' | 'moscovium' | 'livermorium' | 'tennessine' | 'oganesson';
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'default' | 'lg';
  showIcons?: boolean;
  showNumbers?: boolean;
  clickable?: boolean;
  onStepClick?: (stepIndex: number) => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  animationDuration?: number;
  animationEasing?: string;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  customStyles?: React.CSSProperties;
  customClasses?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

const StepProgress = React.forwardRef<HTMLDivElement, StepProgressProps>(
  ({
    steps,
    currentStep,
    completedSteps = [],
    variant = 'default',
    className,
    orientation = 'horizontal',
    size = 'default',
    showIcons = true,
    showNumbers = true,
    clickable = false,
    onStepClick,
    disabled = false,
    loading = false,
    loadingText = 'Loading...',
    animationDuration = 300,
    animationEasing = 'ease-in-out',
    onAnimationStart,
    onAnimationEnd,
    customStyles,
    customClasses,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
  }, ref) => {
    const [isAnimating, setIsAnimating] = React.useState(false);
    
    const getStepStatus = (index: number) => {
      if (completedSteps.includes(index)) return 'completed';
      if (index === currentStep) return 'current';
      if (index < currentStep) return 'completed';
      return 'upcoming';
    };

    const getStepColor = (status: string) => {
      switch (status) {
        case 'completed':
          return 'bg-atlas-success-main text-white border-atlas-success-main';
        case 'current':
          return 'bg-atlas-primary-main text-white border-atlas-primary-main';
        case 'upcoming':
          return 'bg-atlas-card-bg text-atlas-text-tertiary border-atlas-border';
        default:
          return 'bg-atlas-card-bg text-atlas-text-tertiary border-atlas-border';
      }
    };

    const getLineColor = (status: string) => {
      switch (status) {
        case 'completed':
          return 'bg-atlas-success-main';
        case 'current':
          return 'bg-atlas-primary-main';
        case 'upcoming':
          return 'bg-atlas-border';
        default:
          return 'bg-atlas-border';
      }
    };

    const getStepIcon = (status: string, index: number) => {
      if (status === 'completed') {
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      }
      return null;
    };

    const handleAnimationStart = React.useCallback(() => {
      setIsAnimating(true);
      onAnimationStart?.();
    }, [onAnimationStart]);

    const handleAnimationEnd = React.useCallback(() => {
      setIsAnimating(false);
      onAnimationEnd?.();
    }, [onAnimationEnd]);

    const handleStepClick = React.useCallback((stepIndex: number) => {
      if (clickable && !disabled && !loading && onStepClick) {
        onStepClick(stepIndex);
      }
    }, [clickable, disabled, loading, onStepClick]);

    React.useEffect(() => {
      if (loading) {
        handleAnimationStart();
        const timer = setTimeout(handleAnimationEnd, animationDuration);
        return () => clearTimeout(timer);
      }
      return undefined;
    }, [loading, animationDuration, handleAnimationStart, handleAnimationEnd]);

    const sizeClasses = {
      sm: 'h-6 w-6 text-xs',
      default: 'h-8 w-8 text-sm',
      lg: 'h-10 w-10 text-base',
    };

    const lineSizeClasses = {
      sm: 'h-0.5 w-12',
      default: 'h-0.5 w-16',
      lg: 'h-1 w-20',
    };

    return (
      <div 
        ref={ref} 
        className={cn(
          'flex',
          orientation === 'vertical' ? 'flex-col' : 'items-center',
          disabled && 'opacity-50 cursor-not-allowed',
          loading && 'opacity-75 cursor-wait',
          customClasses,
          className
        )}
        style={customStyles}
        aria-label={ariaLabel || `Step progress: step ${currentStep + 1} of ${steps.length}`}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
      >
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;
          
          return (
            <React.Fragment key={index}>
              <div className={cn(
                'flex',
                orientation === 'vertical' ? 'flex-row items-start' : 'flex-col items-center'
              )}>
                <div
                  className={cn(
                    'flex items-center justify-center rounded-full border-2 font-medium transition-all duration-300 ease-in-out',
                    sizeClasses[size],
                    getStepColor(status),
                    clickable && !disabled && !loading && 'cursor-pointer hover:opacity-80',
                    isAnimating && 'animate-pulse'
                  )}
                  onClick={() => handleStepClick(index)}
                  role={clickable ? 'button' : undefined}
                  tabIndex={clickable ? 0 : undefined}
                  aria-label={`Step ${index + 1}: ${step}`}
                  aria-current={status === 'current' ? 'step' : undefined}
                >
                  {loading && index === currentStep ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : showIcons ? (
                    getStepIcon(status, index)
                  ) : showNumbers ? (
                    index + 1
                  ) : null}
                </div>
                
                <div className={cn(
                  'text-center',
                  orientation === 'vertical' ? 'ml-4 mt-1' : 'mt-2'
                )}>
                  <span className={cn(
                    'text-xs font-medium',
                    orientation === 'vertical' ? 'text-left' : 'text-center',
                    'max-w-20 break-words',
                    status === 'current' ? 'text-atlas-text-primary' : 'text-atlas-text-secondary'
                  )}>
                    {step}
                  </span>
                </div>
              </div>
              
              {!isLast && (
                <div
                  className={cn(
                    orientation === 'vertical' ? 'mx-4 my-2 h-8 w-0.5' : 'mx-4 h-0.5 w-16',
                    getLineColor(status),
                    isAnimating && 'animate-pulse'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
        
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-atlas-text-primary">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{loadingText}</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);
StepProgress.displayName = 'StepProgress';

// Utility Components
export const ProgressContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-4', className)} {...props} />
  )
);
ProgressContainer.displayName = 'ProgressContainer';

export const ProgressLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn('text-sm font-medium text-atlas-text-primary', className)} {...props} />
  )
);
ProgressLabel.displayName = 'ProgressLabel';

export const ProgressDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-xs text-atlas-text-secondary', className)} {...props} />
  )
);
ProgressDescription.displayName = 'ProgressDescription';

export const ProgressValue = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm font-medium text-atlas-text-primary', className)} {...props} />
  )
);
ProgressValue.displayName = 'ProgressValue';

export const ProgressPercentage = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm text-atlas-text-tertiary', className)} {...props} />
  )
);
ProgressPercentage.displayName = 'ProgressPercentage';

export const ProgressIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center justify-center', className)} {...props} />
  )
);
ProgressIcon.displayName = 'ProgressIcon';

export const ProgressLoading = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center space-x-2 text-sm text-atlas-text-primary', className)} {...props}>
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Loading...</span>
    </div>
  )
);
ProgressLoading.displayName = 'ProgressLoading';

// Variant Components
export const ProgressSuccess = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="success" className={className} {...props} />
  )
);
ProgressSuccess.displayName = 'ProgressSuccess';

export const ProgressError = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="error" className={className} {...props} />
  )
);
ProgressError.displayName = 'ProgressError';

export const ProgressWarning = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="warning" className={className} {...props} />
  )
);
ProgressWarning.displayName = 'ProgressWarning';

export const ProgressInfo = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="info" className={className} {...props} />
  )
);
ProgressInfo.displayName = 'ProgressInfo';

export const ProgressPrimary = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="primary" className={className} {...props} />
  )
);
ProgressPrimary.displayName = 'ProgressPrimary';

export const ProgressSecondary = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="secondary" className={className} {...props} />
  )
);
ProgressSecondary.displayName = 'ProgressSecondary';

export const ProgressAI = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="ai" className={className} {...props} />
  )
);
ProgressAI.displayName = 'ProgressAI';

export const ProgressGradient = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="gradient" className={className} {...props} />
  )
);
ProgressGradient.displayName = 'ProgressGradient';

export const ProgressGlass = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="glass" className={className} {...props} />
  )
);
ProgressGlass.displayName = 'ProgressGlass';

export const ProgressNeon = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="neon" className={className} {...props} />
  )
);
ProgressNeon.displayName = 'ProgressNeon';

export const ProgressMetallic = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="metallic" className={className} {...props} />
  )
);
ProgressMetallic.displayName = 'ProgressMetallic';

export const ProgressRainbow = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="rainbow" className={className} {...props} />
  )
);
ProgressRainbow.displayName = 'ProgressRainbow';

export const ProgressFire = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="fire" className={className} {...props} />
  )
);
ProgressFire.displayName = 'ProgressFire';

export const ProgressIce = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="ice" className={className} {...props} />
  )
);
ProgressIce.displayName = 'ProgressIce';

export const ProgressEarth = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="earth" className={className} {...props} />
  )
);
ProgressEarth.displayName = 'ProgressEarth';

export const ProgressSky = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="sky" className={className} {...props} />
  )
);
ProgressSky.displayName = 'ProgressSky';

export const ProgressOcean = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="ocean" className={className} {...props} />
  )
);
ProgressOcean.displayName = 'ProgressOcean';

export const ProgressSunset = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="sunset" className={className} {...props} />
  )
);
ProgressSunset.displayName = 'ProgressSunset';

export const ProgressAurora = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="aurora" className={className} {...props} />
  )
);
ProgressAurora.displayName = 'ProgressAurora';

export const ProgressCosmic = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="cosmic" className={className} {...props} />
  )
);
ProgressCosmic.displayName = 'ProgressCosmic';

export const ProgressGalaxy = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="galaxy" className={className} {...props} />
  )
);
ProgressGalaxy.displayName = 'ProgressGalaxy';

export const ProgressSolar = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="solar" className={className} {...props} />
  )
);
ProgressSolar.displayName = 'ProgressSolar';

export const ProgressLunar = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="lunar" className={className} {...props} />
  )
);
ProgressLunar.displayName = 'ProgressLunar';

export const ProgressStellar = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="stellar" className={className} {...props} />
  )
);
ProgressStellar.displayName = 'ProgressStellar';

export const ProgressNebula = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="nebula" className={className} {...props} />
  )
);
ProgressNebula.displayName = 'ProgressNebula';

export const ProgressQuantum = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="quantum" className={className} {...props} />
  )
);
ProgressQuantum.displayName = 'ProgressQuantum';

export const ProgressCrystal = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="crystal" className={className} {...props} />
  )
);
ProgressCrystal.displayName = 'ProgressCrystal';

export const ProgressDiamond = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="diamond" className={className} {...props} />
  )
);
ProgressDiamond.displayName = 'ProgressDiamond';

export const ProgressPearl = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="pearl" className={className} {...props} />
  )
);
ProgressPearl.displayName = 'ProgressPearl';

export const ProgressGold = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="gold" className={className} {...props} />
  )
);
ProgressGold.displayName = 'ProgressGold';

export const ProgressSilver = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="silver" className={className} {...props} />
  )
);
ProgressSilver.displayName = 'ProgressSilver';

export const ProgressBronze = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="bronze" className={className} {...props} />
  )
);
ProgressBronze.displayName = 'ProgressBronze';

export const ProgressPlatinum = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="platinum" className={className} {...props} />
  )
);
ProgressPlatinum.displayName = 'ProgressPlatinum';

export const ProgressTitanium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="titanium" className={className} {...props} />
  )
);
ProgressTitanium.displayName = 'ProgressTitanium';

export const ProgressSteel = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="steel" className={className} {...props} />
  )
);
ProgressSteel.displayName = 'ProgressSteel';

export const ProgressCopper = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="copper" className={className} {...props} />
  )
);
ProgressCopper.displayName = 'ProgressCopper';

export const ProgressIron = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="iron" className={className} {...props} />
  )
);
ProgressIron.displayName = 'ProgressIron';

export const ProgressAluminum = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="aluminum" className={className} {...props} />
  )
);
ProgressAluminum.displayName = 'ProgressAluminum';

export const ProgressZinc = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="zinc" className={className} {...props} />
  )
);
ProgressZinc.displayName = 'ProgressZinc';

export const ProgressNickel = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="nickel" className={className} {...props} />
  )
);
ProgressNickel.displayName = 'ProgressNickel';

export const ProgressChrome = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="chrome" className={className} {...props} />
  )
);
ProgressChrome.displayName = 'ProgressChrome';

export const ProgressBrass = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="brass" className={className} {...props} />
  )
);
ProgressBrass.displayName = 'ProgressBrass';

export const ProgressPewter = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="pewter" className={className} {...props} />
  )
);
ProgressPewter.displayName = 'ProgressPewter';

export const ProgressLead = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="lead" className={className} {...props} />
  )
);
ProgressLead.displayName = 'ProgressLead';

export const ProgressTin = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="tin" className={className} {...props} />
  )
);
ProgressTin.displayName = 'ProgressTin';

export const ProgressMercury = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="mercury" className={className} {...props} />
  )
);
ProgressMercury.displayName = 'ProgressMercury';

export const ProgressArsenic = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="arsenic" className={className} {...props} />
  )
);
ProgressArsenic.displayName = 'ProgressArsenic';

export const ProgressAntimony = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="antimony" className={className} {...props} />
  )
);
ProgressAntimony.displayName = 'ProgressAntimony';

export const ProgressBismuth = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="bismuth" className={className} {...props} />
  )
);
ProgressBismuth.displayName = 'ProgressBismuth';

export const ProgressPolonium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="polonium" className={className} {...props} />
  )
);
ProgressPolonium.displayName = 'ProgressPolonium';

export const ProgressAstatine = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="astatine" className={className} {...props} />
  )
);
ProgressAstatine.displayName = 'ProgressAstatine';

export const ProgressRadon = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="radon" className={className} {...props} />
  )
);
ProgressRadon.displayName = 'ProgressRadon';

export const ProgressFrancium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="francium" className={className} {...props} />
  )
);
ProgressFrancium.displayName = 'ProgressFrancium';

export const ProgressRadium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="radium" className={className} {...props} />
  )
);
ProgressRadium.displayName = 'ProgressRadium';

export const ProgressActinium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="actinium" className={className} {...props} />
  )
);
ProgressActinium.displayName = 'ProgressActinium';

export const ProgressThorium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="thorium" className={className} {...props} />
  )
);
ProgressThorium.displayName = 'ProgressThorium';

export const ProgressProtactinium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="protactinium" className={className} {...props} />
  )
);
ProgressProtactinium.displayName = 'ProgressProtactinium';

export const ProgressUranium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="uranium" className={className} {...props} />
  )
);
ProgressUranium.displayName = 'ProgressUranium';

export const ProgressNeptunium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="neptunium" className={className} {...props} />
  )
);
ProgressNeptunium.displayName = 'ProgressNeptunium';

export const ProgressPlutonium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="plutonium" className={className} {...props} />
  )
);
ProgressPlutonium.displayName = 'ProgressPlutonium';

export const ProgressAmericium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="americium" className={className} {...props} />
  )
);
ProgressAmericium.displayName = 'ProgressAmericium';

export const ProgressCurium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="curium" className={className} {...props} />
  )
);
ProgressCurium.displayName = 'ProgressCurium';

export const ProgressBerkelium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="berkelium" className={className} {...props} />
  )
);
ProgressBerkelium.displayName = 'ProgressBerkelium';

export const ProgressCalifornium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="californium" className={className} {...props} />
  )
);
ProgressCalifornium.displayName = 'ProgressCalifornium';

export const ProgressEinsteinium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="einsteinium" className={className} {...props} />
  )
);
ProgressEinsteinium.displayName = 'ProgressEinsteinium';

export const ProgressFermium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="fermium" className={className} {...props} />
  )
);
ProgressFermium.displayName = 'ProgressFermium';

export const ProgressMendelevium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="mendelevium" className={className} {...props} />
  )
);
ProgressMendelevium.displayName = 'ProgressMendelevium';

export const ProgressNobelium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="nobelium" className={className} {...props} />
  )
);
ProgressNobelium.displayName = 'ProgressNobelium';

export const ProgressLawrencium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="lawrencium" className={className} {...props} />
  )
);
ProgressLawrencium.displayName = 'ProgressLawrencium';

export const ProgressRutherfordium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="rutherfordium" className={className} {...props} />
  )
);
ProgressRutherfordium.displayName = 'ProgressRutherfordium';

export const ProgressDubnium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="dubnium" className={className} {...props} />
  )
);
ProgressDubnium.displayName = 'ProgressDubnium';

export const ProgressSeaborgium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="seaborgium" className={className} {...props} />
  )
);
ProgressSeaborgium.displayName = 'ProgressSeaborgium';

export const ProgressBohrium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="bohrium" className={className} {...props} />
  )
);
ProgressBohrium.displayName = 'ProgressBohrium';

export const ProgressHassium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="hassium" className={className} {...props} />
  )
);
ProgressHassium.displayName = 'ProgressHassium';

export const ProgressMeitnerium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="meitnerium" className={className} {...props} />
  )
);
ProgressMeitnerium.displayName = 'ProgressMeitnerium';

export const ProgressDarmstadtium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="darmstadtium" className={className} {...props} />
  )
);
ProgressDarmstadtium.displayName = 'ProgressDarmstadtium';

export const ProgressRoentgenium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="roentgenium" className={className} {...props} />
  )
);
ProgressRoentgenium.displayName = 'ProgressRoentgenium';

export const ProgressCopernicium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="copernicium" className={className} {...props} />
  )
);
ProgressCopernicium.displayName = 'ProgressCopernicium';

export const ProgressNihonium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="nihonium" className={className} {...props} />
  )
);
ProgressNihonium.displayName = 'ProgressNihonium';

export const ProgressFlerovium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="flerovium" className={className} {...props} />
  )
);
ProgressFlerovium.displayName = 'ProgressFlerovium';

export const ProgressMoscovium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="moscovium" className={className} {...props} />
  )
);
ProgressMoscovium.displayName = 'ProgressMoscovium';

export const ProgressLivermorium = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="livermorium" className={className} {...props} />
  )
);
ProgressLivermorium.displayName = 'ProgressLivermorium';

export const ProgressTennessine = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="tennessine" className={className} {...props} />
  )
);
ProgressTennessine.displayName = 'ProgressTennessine';

export const ProgressOganesson = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Omit<ProgressProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <Progress ref={ref} variant="oganesson" className={className} {...props} />
  )
);
ProgressOganesson.displayName = 'ProgressOganesson';

// Hook for progress management
export const useProgress = (initialValue: number = 0, max: number = 100) => {
  const [value, setValue] = React.useState(initialValue);
  const [isAnimating, setIsAnimating] = React.useState(false);
  
  const percentage = React.useMemo(() => Math.round((value / max) * 100), [value, max]);
  
  const increment = React.useCallback((amount: number = 1) => {
    setValue(prev => Math.min(prev + amount, max));
  }, [max]);
  
  const decrement = React.useCallback((amount: number = 1) => {
    setValue(prev => Math.max(prev - amount, 0));
  }, []);
  
  const setProgress = React.useCallback((newValue: number) => {
    setValue(Math.max(0, Math.min(newValue, max)));
  }, [max]);
  
  const reset = React.useCallback(() => {
    setValue(0);
  }, []);
  
  const complete = React.useCallback(() => {
    setValue(max);
  }, [max]);
  
  const animateTo = React.useCallback((targetValue: number, duration: number = 1000) => {
    setIsAnimating(true);
    const startValue = value;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      
      const currentValue = startValue + (targetValue - startValue) * easedProgress;
      setValue(Math.max(0, Math.min(currentValue, max)));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, max]);
  
  return {
    value,
    percentage,
    isAnimating,
    increment,
    decrement,
    setProgress,
    reset,
    complete,
    animateTo,
  };
};

// Utility types
export type ProgressSizes = 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
export type ProgressVariants = 'default' | 'primary' | 'secondary' | 'ai' | 'success' | 'error' | 'warning' | 'info' | 'gradient' | 'glass' | 'neon' | 'metallic' | 'rainbow' | 'fire' | 'ice' | 'earth' | 'sky' | 'ocean' | 'sunset' | 'aurora' | 'cosmic' | 'galaxy' | 'solar' | 'lunar' | 'stellar' | 'nebula' | 'quantum' | 'crystal' | 'diamond' | 'pearl' | 'gold' | 'silver' | 'bronze' | 'platinum' | 'titanium' | 'steel' | 'copper' | 'iron' | 'aluminum' | 'zinc' | 'nickel' | 'chrome' | 'brass' | 'pewter' | 'lead' | 'tin' | 'mercury' | 'arsenic' | 'antimony' | 'bismuth' | 'polonium' | 'astatine' | 'radon' | 'francium' | 'radium' | 'actinium' | 'thorium' | 'protactinium' | 'uranium' | 'neptunium' | 'plutonium' | 'americium' | 'curium' | 'berkelium' | 'californium' | 'einsteinium' | 'fermium' | 'mendelevium' | 'nobelium' | 'lawrencium' | 'rutherfordium' | 'dubnium' | 'seaborgium' | 'bohrium' | 'hassium' | 'meitnerium' | 'darmstadtium' | 'roentgenium' | 'copernicium' | 'nihonium' | 'flerovium' | 'moscovium' | 'livermorium' | 'tennessine' | 'oganesson';

export {
  Progress,
  ProgressBar,
  CircularProgress,
  StepProgress,
  progressVariants,
};
