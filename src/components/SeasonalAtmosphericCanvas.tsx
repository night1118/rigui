import React, { useEffect, useRef } from 'react';
import { HandData } from './HandTracker';

interface SeasonalAtmosphericCanvasProps {
  handPointer: HandData | null;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  termColor?: string;
  className?: string; // Custom z-index class or positioning styles
  onRightTrigger?: () => void; // Trigger page transition when pointer is held in the right sidebar
}

export default function SeasonalAtmosphericCanvas({
  handPointer,
  season,
  termColor = '#3b82f6',
  className = "absolute inset-0 w-full h-full pointer-events-none z-0",
  onRightTrigger,
}: SeasonalAtmosphericCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000, isOverRight: false });
  const handPointerRef = useRef<HandData | null>(null);
  const hoverStartTimeRef = useRef<number | null>(null);

  // Decoupled synchronizer: Keep handPointer coordinate changes synced in a ref.
  // This prevents the main canvas tick loop from repeatedly tearing down and starting over!
  useEffect(() => {
    handPointerRef.current = handPointer;
    if (handPointer && handPointer.isActive) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const xPx = handPointer.x * window.innerWidth;
        const yPx = handPointer.y * window.innerHeight;
        // Project screen coordinates into components boundary box space
        pointerRef.current.targetX = (xPx - rect.left) / rect.width;
        pointerRef.current.targetY = (yPx - rect.top) / rect.height;
      } else {
        pointerRef.current.targetX = handPointer.x;
        pointerRef.current.targetY = handPointer.y;
      }
    }
  }, [handPointer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Mouse Fallback Listener (only if hand tracking is inactive)
    const handleMouseMove = (e: MouseEvent) => {
      if (handPointerRef.current && handPointerRef.current.isActive) return;
      const rect = canvas.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;

      pointerRef.current.targetX = rawX / rect.width;
      pointerRef.current.targetY = rawY / rect.height;
    };

    // Touch Fallback Listener for mobile fingers
    const handleTouchMove = (e: TouchEvent) => {
      if (handPointerRef.current && handPointerRef.current.isActive) return;
      if (e.touches && e.touches[0]) {
        const rect = canvas.getBoundingClientRect();
        const rawX = e.touches[0].clientX - rect.left;
        const rawY = e.touches[0].clientY - rect.top;

        pointerRef.current.targetX = rawX / rect.width;
        pointerRef.current.targetY = rawY / rect.height;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Particle definition
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      spin: number;
      spinSpeed: number;
      color: string;
      customData?: any; // For custom properties distinct per particle simulation
    }

    const particles: Particle[] = [];
    const maxParticles = 90;

    // Helper functions to generate seasonal particles
    const generateParticle = (initRandomY = false): Particle => {
      const startY = initRandomY ? Math.random() * canvas.height : (season === 'summer' ? canvas.height + 15 : -15);
      const startX = Math.random() * canvas.width;

      if (season === 'spring') {
        // Cherry blossoms (Sakura petals)
        const pinks = ['#fbcfe8', '#f472b6', '#ec4899', '#fce7f3'];
        return {
          x: startX,
          y: startY,
          vx: Math.random() * 1.5 - 0.5, // drift right-ish
          vy: Math.random() * 1.0 + 0.5,
          size: Math.random() * 5 + 4,
          opacity: Math.random() * 0.4 + 0.4,
          spin: Math.random() * 360,
          spinSpeed: Math.random() * 2.5 - 1.25,
          color: pinks[Math.floor(Math.random() * pinks.length)],
        };
      } else if (season === 'summer') {
        // Glowing Fireflies rising up
        const neonGreens = ['#a7f3d0', '#6ee7b7', '#34d399', '#fef08a', '#fbbf24'];
        return {
          x: startX,
          y: startY,
          vx: Math.random() * 1.2 - 0.6,
          vy: -(Math.random() * 0.8 + 0.3), // upward motion
          size: Math.random() * 2.5 + 1.2,
          opacity: Math.random() * 0.6 + 0.3,
          spin: 0,
          spinSpeed: 0,
          color: neonGreens[Math.floor(Math.random() * neonGreens.length)],
          customData: {
            waveSpeed: Math.random() * 0.02 + 0.01,
            waveAmplitude: Math.random() * 1.5 + 0.5,
            angle: Math.random() * Math.PI,
          },
        };
      } else if (season === 'autumn') {
        // Golden Gingko & Maple leaves
        const autumnColors = ['#f59e0b', '#d97706', '#b45309', '#f97316', '#ea580c', '#ca8a04'];
        return {
          x: startX,
          y: startY,
          vx: Math.random() * 1.8 - 0.9,
          vy: Math.random() * 1.2 + 0.8,
          size: Math.random() * 8 + 6,
          opacity: Math.random() * 0.5 + 0.4,
          spin: Math.random() * 360,
          spinSpeed: Math.random() * 3 - 1.5,
          color: autumnColors[Math.floor(Math.random() * autumnColors.length)],
          customData: {
            swingSeed: Math.random() * 100,
            swingSpeed: Math.random() * 0.03 + 0.01,
          },
        };
      } else {
        // Winter Snowflakes: Beautiful varying shades of Ice Blue
        const iceBlues = ['#e0f2fe', '#bae6fd', '#7dd3fc', '#a5f3fc', '#cffafe', '#e0f7fa', '#ffffff'];
        return {
          x: startX,
          y: startY,
          vx: Math.random() * 1.0 - 0.5 - 0.8, // wind blows left
          vy: Math.random() * 1.3 + 0.6,
          size: Math.random() * 3.5 + 1.2,
          opacity: Math.random() * 0.5 + 0.3,
          spin: Math.random() * 360,
          spinSpeed: Math.random() * 1.5 - 0.75,
          color: iceBlues[Math.floor(Math.random() * iceBlues.length)],
        };
      }
    };

    // Populate initial items distributed across page height
    for (let i = 0; i < maxParticles; i++) {
      particles.push(generateParticle(true));
    }

    let animationFrameId: number;

    const tick = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear layout
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth coordinate interpolation -> Faster following response (0.45 simulated, 0.55 real-time target)
      const p = pointerRef.current;
      if (p.targetX !== -1000) {
        if (p.x === -1000) {
          p.x = p.targetX;
          p.y = p.targetY;
        } else {
          p.x = p.x * 0.45 + p.targetX * 0.55;
          p.y = p.y * 0.45 + p.targetY * 0.55;
        }
      }

      const pointerPx_X = p.x * canvas.width;
      const pointerPx_Y = p.y * canvas.height;

      // Add trail sparkles as the user moves hand
      if (p.x !== -1000 && Math.random() < 0.4) {
        const extraSparkle: Particle = {
          x: pointerPx_X + (Math.random() * 16 - 8),
          y: pointerPx_Y + (Math.random() * 16 - 8),
          vx: Math.random() * 0.8 - 0.4,
          vy: Math.random() * 0.8 - 0.4,
          size: Math.random() * 2 + 1,
          opacity: 0.95,
          spin: 0,
          spinSpeed: 0,
          color: season === 'spring' ? '#f472b6' : season === 'summer' ? '#f59e0b' : season === 'autumn' ? '#ea580c' : '#a5f3fc',
          customData: { isTrail: true },
        };
        particles.push(extraSparkle);
      }

      // Update and draw each particle
      for (let i = 0; i < particles.length; i++) {
        const part = particles[i];

        // Core attraction / swirling influence under gesture focus pointer
        let attractionX = 0;
        let attractionY = 0;

        if (p.x !== -1000) {
          const dx = pointerPx_X - part.x; // Pointing towards the finger
          const dy = pointerPx_Y - part.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Full-page attraction range (uses the maximum length of window diagonal)
          const maxDist = Math.max(canvas.width, canvas.height, 1400);
          
          // Linear / custom decay force covering the whole page
          const force = Math.max(0, (maxDist - dist) / maxDist);
          
          // Snappy speeds & strong dramatic response
          const speedFactor = force * 6.5; // Faster gravity acceleration
          const pullX = (dx / (dist || 1)) * speedFactor;
          const pullY = (dy / (dist || 1)) * speedFactor;

          // Stronger vortex swirl effect
          const swirlX = (-dy / (dist || 1)) * force * 2.8;
          const swirlY = (dx / (dist || 1)) * force * 2.8;

          attractionX = pullX + swirlX;
          attractionY = pullY + swirlY;

          // Increase opacity for particles clustering near the finger
          part.opacity = Math.min(part.opacity + 0.15, 0.98);

          // Dynamically scale size beautifully near the center point
          if (part.customData && typeof part.customData === 'object') {
            if (part.customData.baseSize === undefined) {
              part.customData.baseSize = part.size;
            }
            part.size = part.customData.baseSize * (1.0 + force * 0.5);
          } else {
            part.customData = { baseSize: part.size };
            part.size = part.size * (1.0 + force * 0.5);
          }
        }

        // Apply velocities & custom mechanics
        if (season === 'spring') {
          // Spring: fluttery flow + natural sink
          part.x += part.vx + attractionX + 0.2; // slight spring drift
          part.y += part.vy + attractionY;
          part.spin += part.spinSpeed;
        } else if (season === 'summer') {
          // Summer: wavy rising fireflies
          if (part.customData && typeof part.customData === 'object' && !part.customData.isTrail) {
            if (part.customData.angle === undefined) part.customData.angle = Math.random() * Math.PI;
            part.customData.angle += part.customData.waveSpeed || 0.02;
            part.x += Math.sin(part.customData.angle) * (part.customData.waveAmplitude || 1) + attractionX;
          } else {
            part.x += part.vx + attractionX;
          }
          part.y += part.vy + attractionY;
        } else if (season === 'autumn') {
          // Autumn: fluttering sinusoidal falling leaves
          if (part.customData && typeof part.customData === 'object' && !part.customData.isTrail) {
            if (part.customData.swingSeed === undefined) part.customData.swingSeed = Math.random() * 100;
            part.customData.swingSeed += part.customData.swingSpeed || 0.02;
            part.x += Math.sin(part.customData.swingSeed) * 1.2 + attractionX;
          } else {
            part.x += part.vx + attractionX;
          }
          part.y += part.vy + attractionY;
          part.spin += part.spinSpeed;
        } else {
          // Winter: Leftward heavy snow drift
          part.x += part.vx + attractionX;
          part.y += part.vy + attractionY;
          part.spin += part.spinSpeed;
        }

        // Lower opacity for trail sparkles
        if (part.customData?.isTrail) {
          part.opacity -= 0.025;
        }

        // Draw particle representation
        ctx.save();
        ctx.translate(part.x, part.y);
        ctx.rotate((part.spin * Math.PI) / 180);

        ctx.beginPath();
        if (season === 'spring') {
          // Draw cute cherry petal shapes (elliptic crescent)
          ctx.ellipse(0, 0, part.size, part.size * 0.5, 0, 0, 2 * Math.PI);
          ctx.fillStyle = part.color;
          ctx.globalAlpha = part.opacity;
          ctx.fill();
        } else if (season === 'summer') {
          // Firefly neon glow
          ctx.arc(0, 0, part.size, 0, 2 * Math.PI);
          ctx.fillStyle = part.color;
          ctx.globalAlpha = part.opacity;
          ctx.shadowColor = part.color;
          ctx.shadowBlur = 6;
          ctx.fill();
        } else if (season === 'autumn') {
          // Ginkgo leaf shape (Draw wedge fan)
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, part.size, 0.2 * Math.PI, 0.8 * Math.PI);
          ctx.closePath();
          ctx.fillStyle = part.color;
          ctx.globalAlpha = part.opacity;
          ctx.fill();
        } else {
          // Winter snowflake crystals (Draw small elegant star dots or real 6-branch snowflake structures)
          if (part.size > 2.8) {
            ctx.strokeStyle = part.color || '#a5f3fc';
            ctx.lineWidth = 1.0;
            ctx.globalAlpha = part.opacity;
            // Draw a delicate 6-branch crystal
            for (let j = 0; j < 3; j++) {
              ctx.rotate(Math.PI / 3);
              ctx.beginPath();
              ctx.moveTo(-part.size, 0);
              ctx.lineTo(part.size, 0);
              ctx.stroke();
              
              // Draw small sub-branches (crystal points)
              ctx.beginPath();
              ctx.moveTo(-part.size * 0.6, -part.size * 0.3);
              ctx.lineTo(-part.size * 0.6, part.size * 0.3);
              ctx.moveTo(part.size * 0.6, -part.size * 0.3);
              ctx.lineTo(part.size * 0.6, part.size * 0.3);
              ctx.stroke();
            }
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, part.size, 0, 2 * Math.PI);
            ctx.fillStyle = part.color;
            ctx.globalAlpha = part.opacity;
            if (part.size > 2.0) {
              ctx.shadowColor = part.color || '#e0f2fe';
              ctx.shadowBlur = 4;
            }
            ctx.fill();
          }
        }
        ctx.restore();

        // Recycle / Purge out of bounds particles
        const isOutOfScreen = (
          part.opacity <= 0 ||
          part.x < -30 ||
          part.x > canvas.width + 30 ||
          (season === 'summer' ? part.y < -30 : part.y > canvas.height + 30)
        );

        if (isOutOfScreen) {
          if (part.customData?.isTrail) {
            // Trim trails
            particles.splice(i, 1);
            i--;
          } else {
            // Re-generate stable environment particles with proximity preference
            if (p.x !== -1000 && Math.random() < 0.6) {
              const angle = Math.random() * Math.PI * 2;
              const radius = Math.random() * 80 + 10; // cluster close (10px to 90px)
              const spawnX = pointerPx_X + Math.cos(angle) * radius;
              const spawnY = pointerPx_Y + Math.sin(angle) * radius;

              const newPart = generateParticle(true);
              newPart.x = Math.max(0, Math.min(canvas.width, spawnX));
              newPart.y = Math.max(0, Math.min(canvas.height, spawnY));
              // Give them slowed down drift velocities so they swarm visually
              newPart.vx *= 0.5;
              newPart.vy *= 0.5;
              particles[i] = newPart;
            } else {
              particles[i] = generateParticle();
            }
          }
        }
      }

      // Limit array cap for high frames performance
      if (particles.length > maxParticles + 40) {
        particles.splice(maxParticles + 40);
      }

      // Draw interactive pointer visual feedback circle
      if (p.x !== -1000) {
        ctx.beginPath();
        ctx.arc(pointerPx_X, pointerPx_Y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = `${termColor}dd`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pointerPx_X, pointerPx_Y, 20, 0, 2 * Math.PI);
        ctx.strokeStyle = `${termColor}44`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [season, termColor, onRightTrigger]);

  return <canvas ref={canvasRef} className={className} />;
}
