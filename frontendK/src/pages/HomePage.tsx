import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import MathGlobe from "@/components/MathGlobe";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import LiquidEther from "@/components/LiqEther";
import GradientText from "@/components/GradientText";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const teamMembers = [
    { name: "Malhar", roll: "ES24BTECH11018" },
    { name: "Kripalu", roll: "ES24BTECH11021" },
    { name: "Taleem", roll: "ES24BTECH11036" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* --- Background Gradient --- */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-purple-950/20 to-background" />
      <div className="fixed inset-0 -z-10">
  <div style={{ width: "100%", height: "100%", position: "relative" }}>
    <LiquidEther
      colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
      mouseForce={20}
      cursorSize={70}
      isViscous={true}
      viscous={30}
      iterationsViscous={32}
      iterationsPoisson={32}
      resolution={0.5}
      isBounce={false}
      autoDemo={true}
      autoSpeed={0.5}
      autoIntensity={2.2}
      takeoverDuration={0.25}
      autoResumeDelay={3000}
      autoRampDuration={0.6}
    />
  </div>
</div>
      {/* --- 3D Globe --- */}
      <div className="absolute inset-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          <MathGlobe />
        </Canvas>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between items-center py-12 px-4">
        {/* ---- TOP SECTION ---- */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-3 mt-2 overflow-visible"
        >
          <motion.h1
            className="text-7xl md:text-10xl font-bold text-gradient-rainbow leading-snug overflow-visible pb-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
          <GradientText
            colors={["rgba(186, 40, 172, 1)", "#4079ff", "#40ffaa", "#4079ff", "#cb25a4ff"]}
            animationSpeed={3}
            showBorder={false}
            className="custom-class"
          >
            Numerical Methods Assignment
          </GradientText>
          </motion.h1>
          {/*<motion.p
            className="text-2xl md:text-3xl text-accent font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Interactive Assignment GUI
          </motion.p>*/}
        </motion.div>

        {/* ---- LOWER SECTION ---- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center space-y-10 mb-8 w-full"
        >
          {/* CTA BUTTON */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
          >
            <Button
              size="lg"
              onClick={() => navigate("/assignments")}
              className="
                bg-gradient-to-r from-primary to-accent text-primary-foreground text-lg
                px-8 py-6 rounded-full
                shadow-lg shadow-indigo-500/40
                hover:shadow-cyan-500/60 hover:scale-110 hover:-translate-y-2
                transition-all duration-300 ease-in-out
              "
            >
              Dive In
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* --- TEAM MEMBERS BOX (bottom-right corner) --- */}
      <motion.div
        initial={{ opacity: 0, x: 50, y: 50 }}
        animate={{ opacity: 0.9, x: 0, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-6 right-6 glass-strong rounded-2xl p-4 w-52 md:w-64 backdrop-blur-2xl text-center"
      >
        <h2 className="text-lg font-semibold text-muted-foreground mb-3">Team Members</h2>
        <div className="flex flex-col gap-2 items-center">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.roll}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + index * 0.1 }}
              className="flex flex-col items-center"
            >
              <span className="text-sm font-semibold text-foreground">{member.name}</span>
              <span className="text-xs text-accent">Roll: {member.roll}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* --- Floating Math Symbols --- */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {["Σ", "π", "∫", "∞", "√"].map((symbol, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl text-accent/10 font-bold"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
