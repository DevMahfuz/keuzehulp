import { useCallback, useEffect, useMemo, useState } from "react";
import { getQuestionsForCategory } from "../data/questions";
import { analytics } from "../services/analytics";
import { clearWizardState, loadWizardState, saveWizardState } from "../utils/storage";

const initial = {
  category: null,
  answers: {},
  step: "intro",
  skipCategory: false,
};

export function useWizard() {
  const [state, setState] = useState(() => loadWizardState() || initial);

  useEffect(() => {
    saveWizardState(state);
  }, [state]);

  const questions = useMemo(
    () => getQuestionsForCategory(state.category, state.answers),
    [state.category, state.answers]
  );

  const questionIndex = Number(state.questionIndex || 0);
  const currentQuestion = questions[questionIndex] || null;

  const start = useCallback(() => {
    analytics.started({ entry: "start" });
    setState((s) => ({ ...s, step: "category" }));
  }, []);

  const startCategory = useCallback((category, entry) => {
    analytics.started({ entry });
    analytics.categorySelected(category);
    setState((s) => ({
      ...s,
      category,
      step: "questions",
      questionIndex: 0,
      skipCategory: true,
      answers: s.category === category ? s.answers : {},
    }));
  }, []);

  const startScreens = useCallback(() => startCategory("screen", "screens"), [startCategory]);
  const startProjector = useCallback(() => startCategory("projector", "projector"), [startCategory]);
  const startSet = useCallback(() => startCategory("set", "set"), [startCategory]);

  const selectCategory = useCallback((category) => {
    analytics.categorySelected(category);
    setState((s) => ({
      ...s,
      category,
      step: "questions",
      questionIndex: 0,
      skipCategory: false,
      answers: s.category === category ? s.answers : {},
    }));
  }, []);

  const answer = useCallback((questionId, value) => {
    setState((s) => {
      analytics.questionAnswered(questionId, value, { category: s.category });
      const answers = { ...s.answers, [questionId]: value };
      const nextQuestions = getQuestionsForCategory(s.category, answers);
      const idx = nextQuestions.findIndex((q) => q.id === questionId);
      const isLast = idx >= nextQuestions.length - 1;
      if (isLast) {
        return { ...s, answers, step: "results", questionIndex: idx };
      }
      return { ...s, answers, questionIndex: idx + 1, step: "questions" };
    });
  }, []);

  const back = useCallback(() => {
    setState((s) => {
      if (s.step === "results") {
        const qs = getQuestionsForCategory(s.category, s.answers);
        return { ...s, step: "questions", questionIndex: Math.max(0, qs.length - 1) };
      }
      if (s.step === "questions" && s.questionIndex > 0) {
        return { ...s, questionIndex: s.questionIndex - 1 };
      }
      if (s.step === "questions") {
        if (s.skipCategory) return s;
        return { ...s, step: "category" };
      }
      if (s.step === "category") {
        return { ...s, step: "intro" };
      }
      return s;
    });
  }, []);

  const editAnswers = useCallback(() => {
    setState((s) => ({ ...s, step: "questions", questionIndex: 0 }));
  }, []);

  const restart = useCallback(() => {
    analytics.restart();
    clearWizardState();
    setState({ ...initial });
  }, []);

  return {
    ...state,
    questions,
    questionIndex,
    currentQuestion,
    start,
    startScreens,
    startProjector,
    startSet,
    selectCategory,
    answer,
    back,
    editAnswers,
    restart,
  };
}
