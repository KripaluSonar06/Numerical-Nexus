import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCompletion } from "@/contexts/CompletionContext";
import { ProgressBar } from "@/components/ui/progress-bar";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain } from "lucide-react";
import GlareHover from "@/components/GlareHover";
import LiquidEther from "@/components/LiqEther";


const AssignmentsPage = () => {
  const navigate = useNavigate();
  const { getProgress, getTotalProgress } = useCompletion();

  const assignments = [
    {
      id: "2",
      title: "Assignment 2",
      description: "Harshad Numbers & Modified Legendre Polynomial",
      icon: BookOpen,
      color: "from-cyan-400 to-blue-400",
      glareColor: "#00FFFF", // cyan
    },
    {
      id: "3",
      title: "Assignment 3",
      description: "Gaussian Quadrature & ODE Solutions",
      icon: Brain,
      color: "from-fuchsia-500 to-pink-500",
      glareColor: "#FF00FF", // magenta
    },
  ];

  const totalProgress = getTotalProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-background p-8">
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
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
      </div>  
      <div className="max-w-6xl mx-auto">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Assignments", href: "/assignments" },
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-gradient-cyan mb-4">
            Your Assignments
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Track your progress and complete numerical methods challenges
          </p>

          <div className="glass-strong rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground">
              Overall Progress
            </h2>
            <ProgressBar
              completed={totalProgress.completed}
              total={totalProgress.total}
              label="Total Completion"
            />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {assignments.map((assignment, index) => {
            const progress = getProgress(assignment.id);
            const Icon = assignment.icon;

            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card
                  className="relative glass-strong p-8 cursor-pointer hover:scale-105 hover:-translate-y-2 transition-all duration-300"
                  onClick={() => navigate(`/assignment/${assignment.id}`)}
                >
                  {/*Glare effect */}
                  <GlareHover
                    glareColor={assignment.glareColor}
                    glareOpacity={0.25}
                    glareAngle={-30}
                    glareSize={250}
                    transitionDuration={1000}
                  />

                  <div className="flex items-start justify-between mb-6 relative z-20">
                    <div className="flex-1">
                      <h2
                        className={`text-3xl font-bold mb-2 bg-gradient-to-r ${assignment.color} bg-clip-text text-transparent`}
                      >
                        {assignment.title}
                      </h2>
                      <p className="text-muted-foreground">
                        {assignment.description}
                      </p>
                    </div>
                    <Icon className="w-12 h-12 text-accent opacity-50" />
                  </div>

                  <ProgressBar
                    completed={progress.completed}
                    total={progress.total}
                    label="Progress"
                  />

                  <div className="mt-6 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {progress.completed} of {progress.total} questions
                      completed
                    </span>
                    <span className="text-accent font-medium">
                      View Details →
                    </span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {totalProgress.completed === totalProgress.total &&
          totalProgress.total > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 text-center"
            >
              <div className="glass-strong rounded-xl p-8 inline-block">
                <h2 className="text-2xl font-bold text-gradient-cyan mb-4">
                  🎉 All Assignments Completed!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Congratulations! You've finished all questions.
                </p>
                <Button
                  onClick={() => navigate("/thank-you")}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  View Completion Certificate
                </Button>
              </div>
            </motion.div>
          )}
      </div>
    </div>
  );
};

export default AssignmentsPage;
