import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CompletionState {
  [key: string]: boolean;
}

interface CompletionContextType {
  completedQuestions: CompletionState;
  toggleCompletion: (questionId: string) => void;
  getProgress: (assignmentId: string) => { completed: number; total: number };
  getTotalProgress: () => { completed: number; total: number };
}

const CompletionContext = createContext<CompletionContextType | undefined>(undefined);

export const useCompletion = () => {
  const context = useContext(CompletionContext);
  if (!context) {
    throw new Error('useCompletion must be used within CompletionProvider');
  }
  return context;
};

const ASSIGNMENT_QUESTIONS = {
  '2': ['2-Q1A', '2-Q1B', '2-Q2'],
  '3': ['3-Q1', '3-Q2']
};

export const CompletionProvider = ({ children }: { children: ReactNode }) => {
  const [completedQuestions, setCompletedQuestions] = useState<CompletionState>({});

  const toggleCompletion = (questionId: string) => {
    setCompletedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const getProgress = (assignmentId: string) => {
    const questions = ASSIGNMENT_QUESTIONS[assignmentId as keyof typeof ASSIGNMENT_QUESTIONS] || [];
    const completed = questions.filter(q => completedQuestions[q]).length;
    return { completed, total: questions.length };
  };

  const getTotalProgress = () => {
    const allQuestions = Object.values(ASSIGNMENT_QUESTIONS).flat();
    const completed = allQuestions.filter(q => completedQuestions[q]).length;
    return { completed, total: allQuestions.length };
  };

  return (
    <CompletionContext.Provider value={{ completedQuestions, toggleCompletion, getProgress, getTotalProgress }}>
      {children}
    </CompletionContext.Provider>
  );
};
