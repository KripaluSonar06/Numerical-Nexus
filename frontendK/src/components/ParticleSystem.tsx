import React, { useEffect, useRef, FC } from 'react';

// Define the interface for a Particle's properties to ensure type safety
interface ParticleProps {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  type: 'equation' | 'dot'; // Union type for particle types
  equation: string;
  pulsePhase: number;
}

// Define the equations array outside the component to avoid re-creation on every render
const equations: string[] = ['10', '12', '18', '20', '21', '24', '27', '30', '36', '40', '42', '45', '48', '50', '54', '60', '63', '70', '72', '80', '81', '84', '90'];
const particleCount = 100;

// Use FC (Function Component) for better type inference
const ParticleSystem: FC = () => {
  // Specify the type for the useRef hook: HTMLCanvasElement or null
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    
    // Check if canvas exists and ensure context is 2D
    if (!canvas) return;
    
    // Explicitly type ctx as CanvasRenderingContext2D
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = (): void => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    const particles: Particle[] = [];

    // The Particle class implements the ParticleProps interface
    class Particle implements ParticleProps {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      type: 'equation' | 'dot';
      equation: string;
      pulsePhase: number;

      constructor() {
        // Initialize all properties in constructor/reset, as required by TS
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.size = 0;
        this.opacity = 0;
        this.rotation = 0;
        this.rotationSpeed = 0;
        this.type = 'dot';
        this.equation = '';
        this.pulsePhase = 0;
        
        this.reset();
        // Override initial y and opacity for staggered start
        this.y = Math.random() * canvas.height;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      reset(): void {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = Math.random() * 1 + 0.5;
        this.size = Math.random() * 7;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.type = Math.random() > 0.7 ? 'equation' : 'dot';
        this.equation = equations[Math.floor(Math.random() * equations.length)] as string;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update(): void {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.pulsePhase += 0.02;

        // Reset particle when it goes off screen
        if (this.y > canvas.height + 10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset();
        }

        // Subtle floating effect
        this.x += Math.sin(this.pulsePhase) * 0.1;
      }

      draw(): void {
        ctx.save();
        ctx.globalAlpha = this.opacity * (0.8 + Math.sin(this.pulsePhase) * 0.2);

        if (this.type === 'equation') {
          ctx.fillStyle = '#64B5F6';
          // Template literal for font size
          ctx.font = `${this.size * 6}px 'Times New Roman', serif`; 
          ctx.textAlign = 'center';
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rotation);
          ctx.fillText(this.equation, 0, 0);
        } else {
          // Create the radial gradient at the particle's origin (0, 0 after translate)
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
          gradient.addColorStop(0, '#64B5F6');
          gradient.addColorStop(0.5, '#42A5F5');
          // Fully transparent color at the edge
          gradient.addColorStop(1, 'rgba(66, 165, 245, 0)'); 

          ctx.fillStyle = gradient;
          ctx.translate(this.x, this.y);
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationId: number; // Type the animation ID

    function animate(): void {
      // Clear with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0e27');
      gradient.addColorStop(0.5, '#1a1a2e');
      gradient.addColorStop(1, '#16213e');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connecting lines between nearby particles
      ctx.strokeStyle = 'rgba(100, 181, 246, 0.1)';
      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const maxDistance = 150;
          if (distance < maxDistance) {
            // Adjust alpha based on distance: closer = brighter
            ctx.globalAlpha = (maxDistance - distance) / maxDistance * 0.2; 
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1; // Reset global alpha
      animationId = requestAnimationFrame(animate);
    }

    animate();

    // Type the event listener function argument
    const handleResize = (e: UIEvent): void => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default ParticleSystem;