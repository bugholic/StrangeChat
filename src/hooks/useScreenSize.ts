import { useEffect, useState } from 'react';

interface ViewportSize {
  viewportWidth: number;
  viewportHeight: number;
}

function readViewport(): ViewportSize {
  if (typeof window === 'undefined') {
    return { viewportWidth: 0, viewportHeight: 0 };
  }

  const vv = (window as any).visualViewport as VisualViewport | undefined;
  if (vv && typeof vv.width === 'number' && typeof vv.height === 'number') {
    return { viewportWidth: Math.round(vv.width), viewportHeight: Math.round(vv.height) };
  }

  // Fallbacks for browsers without VisualViewport
  const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  return { viewportWidth: Math.round(width), viewportHeight: Math.round(height) };
}

export function useScreenSize(): ViewportSize {
  const [size, setSize] = useState<ViewportSize>(() => readViewport());

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = readViewport();
        setSize(prev => (prev.viewportWidth !== next.viewportWidth || prev.viewportHeight !== next.viewportHeight ? next : prev));
        // Optional: set CSS var for 1vh workaround if needed elsewhere
        document.documentElement.style.setProperty('--vh', `${next.viewportHeight * 0.01}px`);
      });
    };

    const vv = (window as any).visualViewport as VisualViewport | undefined;
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    if (vv) {
      vv.addEventListener('resize', update);
      vv.addEventListener('scroll', update); // address iOS url bar show/hide
    }

    update();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      if (vv) {
        vv.removeEventListener('resize', update);
        vv.removeEventListener('scroll', update);
      }
    };
  }, []);

  return size;
}


