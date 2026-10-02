import { useEffect, useRef } from 'react';

/**
 * UnifiedBackground renders a single, continuous, hardware-accelerated ambient
 * background canvas behind the entire application.
 *
 * By maintaining a single unified background layer in a parent container rather than
 * multiple isolated instances per section, the browser eliminates repeated layer re-creation,
 * prevents clipping-boundary repaint stutter, and delivers a seamless, flicker-free scroll.
 *
 * The orb float animation is paused while the page is actively scrolling (and left paused
 * under prefers-reduced-motion) — a `fixed` background keeps re-compositing against the
 * viewport on every scroll frame, so pausing the transform animation during that window
 * cuts the compositor work layered on top of scroll itself.
 */
export const UnifiedBackground = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    let scrollTimeout = null;
    const handleScroll = () => {
      el.classList.add('is-scrolling');
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => el.classList.remove('is-scrolling'), 160);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div ref={rootRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none ambient-bg-layer" aria-hidden="true">
      {/* Continuous, high-precision technical dot matrix across the entire viewport */}
      <div className="absolute inset-0 bg-dots-subtle opacity-70" />

      {/* Primary Champagne/Gold Ambient Glow Top-Right */}
      <div className="absolute -top-28 -right-20 w-[580px] h-[580px] rounded-full glow-orb-accent animate-float-slow" />

      {/* Secondary Ambient Glow Mid-Left */}
      <div className="absolute top-1/3 -left-28 w-[500px] h-[500px] rounded-full glow-orb-primary animate-float-reverse" />

      {/* Soft Fill Ambient Glow Bottom-Right */}
      <div className="absolute -bottom-28 right-1/4 w-[540px] h-[540px] rounded-full glow-orb-soft animate-float-slow" />
    </div>
  );
};
