import React, { useState } from 'react';
import { Project, DynamicQuestionAnswer } from '../../types';
import { DRILL_DOWN_SCENARIOS } from '../../data/defaultData';
import { 
  MessageSquareCode, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  HelpCircle,
  FileCheck2,
  Send
} from 'lucide-react';

interface DynamicQuestionsViewProps {
  currentProject: Project | null;
  onSaveProject: (project: Project) => void;
  onNavigate: (view: string) => void;
}

export const DynamicQuestionsView: React.FC<DynamicQuestionsViewProps> = ({
  currentProject,
  onSaveProject,
  onNavigate,
}) => {
  if (!currentProject) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
        <MessageSquareCode className="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <p>Veuillez sélectionner un projet pour utiliser le système de questions dynamiques.</p>
      </div>
    );
  }

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(DRILL_DOWN_SCENARIOS[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [currentClaim, setCurrentClaim] = useState<string>(DRILL_DOWN_SCENARIOS[0].initialClaim);
  const [answers, setAnswers] = useState<string[]>(['', '', '', '', '', '']);
  const [activeTab, setActiveTab] = useState<'drilldown' | 'history'>('drilldown');

  const activeScenario = DRILL_DOWN_SCENARIOS.find(s => s.id === selectedScenarioId) || DRILL_DOWN_SCENARIOS[0];

  const handleScenarioChange = (id: string) => {
    setSelectedScenarioId(id);
    const scenario = DRILL_DOWN_SCENARIOS.find(s => s.id === id);
    if (scenario) {
      setCurrentClaim(scenario.initialClaim);
      setCurrentStepIndex(0);
      setAnswers(['', '', '', '', '', '']);
    }
  };

  const handleAnswerChange = (text: string) => {
    const updated = [...answers];
    updated[currentStepIndex] = text;
    setAnswers(updated);
  };

  const nextStep = () => {
    if (currentStepIndex < activeScenario.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const saveDrillDown = () => {
    const formattedQA: DynamicQuestionAnswer = {
      id: `dyn_${Date.now()}`,
      theme: activeScenario.title,
      claim: currentClaim,
      questions: activeScenario.steps.map((step, idx) => ({
        question: step.q,
        answer: answers[idx] || 'Non renseigné',
      })),
    };

    const updatedProject = {
      ...currentProject,
      dynamicAnswers: [...(currentProject.dynamicAnswers || []), formattedQA],
      // Also automatically enrich the project's concrete results & difficulties if empty
      results: currentProject.results 
        ? `${currentProject.results}\n[Faits concrets validés via interrogatoire : ${answers[5] || ''}]`
        : answers[5] || currentProject.results,
    };

    onSaveProject(updatedProject);
    setActiveTab('history');
  };

  const removeHistoryItem = (id: string) => {
    const updated = currentProject.dynamicAnswers?.filter(a => a.id !== id) || [];
    onSaveProject({ ...currentProject, dynamicAnswers: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            Approfondissement Méthodologique & Anti-Langue de Bois
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Système de Questions Dynamiques Intelligentes
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Transformer les affirmations commerciales ou marketing en faits scientifiques quantifiés et opposables à un expert fiscal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('drilldown')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'drilldown'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Nouveau Questionnement
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Historique ({currentProject.dynamicAnswers?.length || 0})
          </button>
        </div>
      </div>

      {activeTab === 'drilldown' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left panel: Scenario presets */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                1. Thème de l'affirmation à challenger
              </h2>
              <div className="space-y-2">
                {DRILL_DOWN_SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => handleScenarioChange(sc.id)}
                    className={`w-full p-3 rounded-lg border text-left text-xs transition-all ${
                      selectedScenarioId === sc.id
                        ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 font-semibold shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="font-bold">{sc.title}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 text-slate-600">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                Objectif de l'auditeur
              </span>
              <p className="leading-relaxed">
                Le Ministère de la Recherche (MESR) rejette systématiquement les termes vagues ("meilleures performances", "plus rapide", "optimisé"). Cet interrogatoire force l'équipe à fournir des grandeurs physiques et des comparatifs chiffrés.
              </p>
            </div>
          </div>

          {/* Right panel: Dynamic flow */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Affirmation initiale de l'équipe (Point de départ) :
              </label>
              <textarea
                rows={2}
                value={currentClaim}
                onChange={(e) => setCurrentClaim(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 font-medium"
              />
            </div>

            {/* Stepper indicator */}
            <div className="flex items-center justify-between text-xs border-y border-slate-100 py-3">
              <span className="font-semibold text-slate-700">
                Étape {currentStepIndex + 1} sur {activeScenario.steps.length}
              </span>
              <div className="flex items-center gap-1">
                {activeScenario.steps.map((_, i) => (
                  <div
                    key={i}
                    className={`w-5 h-1.5 rounded-full ${
                      i === currentStepIndex ? 'bg-indigo-600' :
                      answers[i] ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Active Question Prompt */}
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-xl">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                  Question de relance méthodique n°{currentStepIndex + 1} :
                </span>
                <p className="text-sm font-bold text-slate-900">
                  {activeScenario.steps[currentStepIndex].q}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Réponse factuelle de l'équipe technique :
                </label>
                <textarea
                  rows={4}
                  value={answers[currentStepIndex] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder={activeScenario.steps[currentStepIndex].placeholder}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  disabled={currentStepIndex === 0}
                  onClick={prevStep}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none"
                >
                  ← Question précédente
                </button>

                {currentStepIndex < activeScenario.steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>Question suivante</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={saveDrillDown}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Enregistrer ces faits dans le dossier</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* History of Dynamic QA sets */
        <div className="space-y-4">
          {currentProject.dynamicAnswers && currentProject.dynamicAnswers.length > 0 ? (
            <div className="space-y-4">
              {currentProject.dynamicAnswers.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-xs font-mono font-semibold text-indigo-600">{item.theme}</span>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                        « {item.claim} »
                      </h3>
                    </div>
                    <button
                      onClick={() => removeHistoryItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded"
                      title="Supprimer ce jeu de questions"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {item.questions.map((q, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs space-y-1">
                        <div className="font-semibold text-slate-800 flex items-start gap-1.5">
                          <span className="font-mono text-indigo-600 shrink-0 font-bold">Q{idx + 1}.</span>
                          <span>{q.question}</span>
                        </div>
                        <div className="text-slate-700 pl-5 leading-relaxed font-medium">
                          → {q.answer || <span className="text-slate-400 italic">Non renseigné</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
              <MessageSquareCode className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p>Aucun interrogatoire enregistré pour ce projet. Lancez votre premier approfondissement.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
