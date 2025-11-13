import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useCompletion } from "@/contexts/CompletionContext";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import GlareHover from "@/components/GlareHover";
import LiquidEther from "@/components/LiqEther";
import ParticleSystem from "@/components/ParticleSystem";

const AssignmentDetailsPage = () => {
  const navigate = useNavigate();
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { completedQuestions } = useCompletion();

  const assignmentQuestions = {
    "2": [
      {
        id: "2-Q1A",
        title: "Q1A: First Non-Harshad Factorial",
        description:
          "Find the first factorial which is not a Harshad number.",
      },
      {
        id: "2-Q1B",
        title: "Q1B: Consecutive Harshad Numbers",
        description: "Find n consecutive Harshad numbers within a range.",
      },
      {
        id: "2-Q2",
        title: "Q2: Modified Legendre Polynomial",
        description: "Comprehensive polynomial analysis with LU decomposition.",
      },
    ],
    "3": [
      {
        id: "3-Q1",
        title: "Q1: Gauss-Legendre Analysis",
        description: "Roots, weights, and orthogonal collocation matrices.",
      },
      {
        id: "3-Q2",
        title: "Q2: ODE by Gauss-Legendre",
        description: "Solve ODE and compare with analytical solution.",
      },
    ],
  };

  const glareColor = assignmentId === "2" ? "#00FFFF" : "#FF00FF";
  const questions =
    assignmentQuestions[assignmentId as keyof typeof assignmentQuestions] || [];
  const assignmentTitle =
    assignmentId === "2" ? "Assignment 2" : "Assignment 3";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-background p-8">
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
      <div className="max-w-6xl mx-auto">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Assignments", href: "/assignments" },
            { label: assignmentTitle, href: `/assignment/${assignmentId}` },
          ]}
        />

        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl font-bold text-gradient-cyan mb-2 pb-2">
              {assignmentTitle}
            </h1>
            <p className="text-xl text-muted-foreground">
              Select a question to begin
            </p>
          </motion.div>

          <Button
            variant="outline"
            onClick={() => navigate("/assignments")}
            className="glass"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((question, index) => {
            const isCompleted = completedQuestions[question.id];

            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="relative glass-strong p-6 cursor-pointer hover:scale-105 transition-all duration-300 group overflow-hidden"
                  onClick={() =>
                    navigate(`/assignment/${assignmentId}/question/${question.id}`)
                  }
                >
                  {/*Colored glare */}
                  <GlareHover
                    glareColor={glareColor}
                    glareOpacity={0.25}
                    glareAngle={-35}
                    glareSize={250}
                    transitionDuration={700}
                  />

                  <div className="absolute top-4 right-4">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground/50" />
                    )}
                  </div>

                  <div className="mb-4 relative z-10">
                    <h3 className="text-xl font-bold text-foreground mb-2 pr-8">
                      {question.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {question.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between relative z-10">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        isCompleted
                          ? "bg-success/20 text-success"
                          : "bg-accent/20 text-accent"
                      }`}
                    >
                      {isCompleted ? "Completed" : "Start"}
                    </span>
                    <span className="text-accent text-sm group-hover:translate-x-2 transition-transform">
                      →
                    </span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailsPage;
