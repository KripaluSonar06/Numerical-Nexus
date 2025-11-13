import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCompletion } from '@/contexts/CompletionContext';
import { Button } from '@/components/ui/button';
import { Trophy, Sparkles, Home } from 'lucide-react';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import LiquidEther from '@/components/LiqEther';
import ParticleSystem from '@/components/ParticleSystem';

const ThankYouPage = () => {
  const navigate = useNavigate();
  const { getTotalProgress } = useCompletion();
  const progress = getTotalProgress();

  useEffect(() => {
    // Confetti animation on mount
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#00d9ff', '#4f46e5', '#ff00ff']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#00d9ff', '#4f46e5', '#ff00ff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Play celebration sound (add your own sound file)
    const audio = new Audio('/celebration.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  }, []);

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-background p-8 flex items-center justify-center">
       <div className="absolute inset-0 -z-10">
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <ParticleSystem
      
          />
        </div>
      </div> 
      
      <div className="absolute inset-0 -z-10">
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <LiquidEther
            colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
            mouseForce={20}
            cursorSize={70}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={1}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
      </div> 

      <div className="max-w-4xl mx-auto text-center">
        {/* Trophy Icon with Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 1, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <Trophy className="w-32 h-32 text-accent mx-auto" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-4 -right-4"
            >
              <Sparkles className="w-12 h-12 text-primary" />
            </motion.div>
          </div>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-6xl font-bold text-gradient-cyan mb-6 pb-2">
            Congratulations!
          </h1>
          <p className="text-2xl text-muted-foreground mb-8">
            You've completed all assignments
          </p>
        </motion.div>

        {/* Progress Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-strong rounded-xl p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Final Score
          </h2>
          <div className="text-6xl font-bold text-gradient-cyan mb-2">
            {progress.completed}/{progress.total}
          </div>
          <p className="text-lg text-muted-foreground">
            Questions Completed
          </p>
          
          {/* Progress Bar */}
          <div className="mt-6 w-full bg-card/30 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(progress.completed / progress.total) * 100}%` }}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="h-full bg-gradient-to-r from-accent via-primary to-[hsl(330,100%,60%)] rounded-full"
            />
          </div>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="glass-strong rounded-xl p-6 mb-8"
        >
          <p className="text-lg italic text-muted-foreground">
            "Mathematics is not about numbers, equations, computations, or algorithms: 
            it is about understanding."
          </p>
          <p className="text-sm text-accent mt-2">— William Paul Thurston</p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
          <Button
            onClick={() => navigate('/assignments')}
            variant="outline"
            size="lg"
            className="glass"
          >
            Review Assignments
          </Button>
        </motion.div>

        {/* Add sound file note in comment */}
        {/* 
          TODO: Add celebration sound file
          1. Add celebration.mp3 to public folder
          2. Uncomment the audio play code in useEffect
        */}
      </div>
    </div>
  );
};

export default ThankYouPage;
