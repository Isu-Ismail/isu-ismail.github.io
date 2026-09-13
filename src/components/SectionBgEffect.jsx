import React from 'react';

/**
 * SectionBgEffect provides hardware-accelerated ambient background textures
 * and glowing radial orbs. Designed for effortless 120fps native scrolling.
 */
export const SectionBgEffect = ({ variant = 'hero' }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none ambient-bg-layer" aria-hidden="true">
      {/* Pattern Texture Layer */}
      {(variant === 'hero' || variant === 'about' || variant === 'education' || variant === 'experience' || variant === 'contact') && (
        <div className="absolute inset-0 bg-dots-subtle opacity-75" />
      )}

      {(variant === 'projects' || variant === 'skills' || variant === 'certificates' || variant === 'detail') && (
        <div className="absolute inset-0 bg-grid-subtle opacity-80" />
      )}

      {/* Pure Hardware-Composited Radial Glow Orbs */}
      {variant === 'hero' && (
        <>
          <div className="absolute -top-24 -right-16 w-[480px] h-[480px] rounded-full glow-orb-accent animate-float-slow" />
          <div className="absolute -bottom-24 -left-16 w-[420px] h-[420px] rounded-full glow-orb-primary animate-float-reverse" />
        </>
      )}

      {variant === 'about' && (
        <>
          <div className="absolute top-1/4 -left-16 w-[420px] h-[420px] rounded-full glow-orb-accent animate-float-slow" />
          <div className="absolute -bottom-16 -right-16 w-[360px] h-[360px] rounded-full glow-orb-soft animate-float-reverse" />
        </>
      )}

      {variant === 'projects' && (
        <>
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[520px] h-[320px] rounded-full glow-orb-accent" />
          <div className="absolute top-1/2 -left-16 w-[380px] h-[380px] rounded-full glow-orb-soft animate-float-slow" />
          <div className="absolute -bottom-16 -right-16 w-[380px] h-[380px] rounded-full glow-orb-soft animate-float-reverse" />
        </>
      )}

      {variant === 'education' && (
        <>
          <div className="absolute top-1/4 left-[10%] w-[380px] h-[420px] rounded-full glow-orb-primary animate-float-slow" />
          <div className="absolute -bottom-16 -right-16 w-[340px] h-[340px] rounded-full glow-orb-soft animate-float-reverse" />
        </>
      )}

      {variant === 'experience' && (
        <>
          <div className="absolute top-1/3 left-[12%] w-[400px] h-[420px] rounded-full glow-orb-primary animate-float-slow" />
          <div className="absolute -top-16 -right-16 w-[360px] h-[360px] rounded-full glow-orb-accent animate-float-reverse" />
        </>
      )}

      {variant === 'certificates' && (
        <>
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[460px] h-[320px] rounded-full glow-orb-accent animate-float-slow" />
        </>
      )}

      {variant === 'skills' && (
        <>
          <div className="absolute -top-16 -left-16 w-[400px] h-[400px] rounded-full glow-orb-primary animate-float-slow" />
          <div className="absolute -bottom-16 -right-16 w-[400px] h-[400px] rounded-full glow-orb-accent animate-float-reverse" />
        </>
      )}

      {variant === 'contact' && (
        <>
          <div className="absolute top-1/4 right-[5%] w-[440px] h-[440px] rounded-full glow-orb-accent animate-float-slow" />
          <div className="absolute -bottom-16 -left-16 w-[380px] h-[380px] rounded-full glow-orb-primary animate-float-reverse" />
        </>
      )}

      {variant === 'detail' && (
        <>
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[550px] h-[350px] rounded-full glow-orb-accent" />
          <div className="absolute bottom-20 -left-16 w-[380px] h-[380px] rounded-full glow-orb-primary animate-float-slow" />
        </>
      )}
    </div>
  );
};
