import { useCallback, useEffect, useMemo, useState } from "react";
import { useWizard } from "./hooks/useWizard";
import { loadCatalog } from "./services/productService";
import { analytics } from "./services/analytics";
import { parseLaunchType } from "./config/embed";
import { CategorySelect, Questionnaire, Results } from "./pages/Flow";
import HomeLauncher from "./components/HomeLauncher";
import WizardModal from "./components/WizardModal";
import "./styles/app.css";
import "./styles/launcher.css";

function useCatalog() {
  const [catalog, setCatalog] = useState({
    products: [],
    loading: true,
    usingMock: false,
    source: null,
    error: null,
  });

  useEffect(() => {
    let alive = true;
    loadCatalog().then((result) => {
      if (alive) setCatalog({ ...result, loading: false });
    });
    return () => {
      alive = false;
    };
  }, []);

  return catalog;
}

function WizardBody({ wizard, catalog, onBack, onRestart }) {
  return (
    <div className="kh-root kh-embed-modal">
      <div className="kh-app">
        <header className="kh-header">
          <div className="kh-header-inner">
            <span className="kh-brand">
              <span className="kh-mark" aria-hidden>
                ▷
              </span>
              <span>
                Beamer-Winkel.nl
                <small>Keuzehulp</small>
              </span>
            </span>
          </div>
        </header>
        <main className="kh-main">
          <h2 id="bw-keuzehulp-dialog-title" className="bw-keuzehulp-sr">
            Keuzehulp
          </h2>
          {wizard.step === "category" ? (
            <CategorySelect onSelect={wizard.selectCategory} onBack={onBack} />
          ) : null}
          {wizard.step === "questions" && wizard.currentQuestion ? (
            <Questionnaire
              question={wizard.currentQuestion}
              index={wizard.questionIndex}
              total={wizard.questions.length}
              selected={wizard.answers[wizard.currentQuestion.id]}
              onAnswer={wizard.answer}
              onBack={onBack}
            />
          ) : null}
          {wizard.step === "results" ? (
            <Results
              category={wizard.category}
              answers={wizard.answers}
              catalog={catalog}
              onEdit={wizard.editAnswers}
              onRestart={onRestart}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}

function categoryForLaunch(type) {
  if (type === "beamer") return "projector";
  if (type === "screen") return "screen";
  if (type === "set") return "set";
  return null;
}

function App() {
  const wizard = useWizard();
  const catalog = useCatalog();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    analytics.bannerView();
  }, []);

  const openFlow = useCallback(
    (type) => {
      if (type === "beamer") analytics.bannerBeamerClicked();
      if (type === "screen") analytics.bannerScreenClicked();
      if (type === "set") analytics.bannerSetClicked();

      const category = categoryForLaunch(type);
      setModalOpen(true);
      const canResume =
        wizard.skipCategory &&
        wizard.category === category &&
        wizard.step !== "intro" &&
        wizard.step !== "category";
      if (canResume) return;
      if (type === "beamer") wizard.startProjector();
      if (type === "screen") wizard.startScreens();
      if (type === "set") wizard.startSet();
    },
    [wizard]
  );

  useEffect(() => {
    const type = parseLaunchType();
    if (type) openFlow(type);
    // Open from URL once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleBack = useCallback(() => {
    const firstQuestion = wizard.step === "questions" && Number(wizard.questionIndex || 0) === 0;
    if (firstQuestion && wizard.skipCategory) {
      closeModal();
      return;
    }
    if (wizard.step === "category") {
      closeModal();
      return;
    }
    wizard.back();
  }, [wizard, closeModal]);

  const handleRestart = useCallback(() => {
    wizard.restart();
    closeModal();
  }, [wizard, closeModal]);

  const dialogActive = useMemo(
    () => modalOpen && wizard.step !== "intro",
    [modalOpen, wizard.step]
  );

  return (
    <>
      <HomeLauncher
        onStartBeamer={() => openFlow("beamer")}
        onStartScreen={() => openFlow("screen")}
        onStartSet={() => openFlow("set")}
      />
      <WizardModal open={dialogActive} titleId="bw-keuzehulp-dialog-title" onClose={closeModal}>
        <WizardBody wizard={wizard} catalog={catalog} onBack={handleBack} onRestart={handleRestart} />
      </WizardModal>
    </>
  );
}

export default App;
