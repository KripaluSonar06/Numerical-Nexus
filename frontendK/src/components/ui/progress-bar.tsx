import { motion } from 'framer-motion';

interface ProgressBarProps {
  completed: number;
  total: number;
  label?: string;
}

export const ProgressBar = ({ completed, total, label }: ProgressBarProps) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{label}</span>
          <span>{completed}/{total}</span>
        </div>
      )}
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-accent via-primary to-[hsl(330,100%,60%)] glow-cyan"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <p className="text-xs text-right text-muted-foreground">{Math.round(percentage)}%</p>
    </div>
  );
};
