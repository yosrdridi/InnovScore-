import React, { useState } from 'react';
import { Project, CirDimensions, FrascatiCriterion } from '../../types';
import { 
  Microscope, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Scale, 
  Info, 
  Sparkles,
  BookOpen,
  GitBranch,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  calculateCirScore, 
  detectClassicalEngineering, 
  CLASSICAL_ENGINEERING_SIGNALS 
} from '../../utils/scoring';

interface CirAnalysisViewProps {
  currentProject: Project | null;
  onSaveProject: (project: Project) => void;
  onNavigate: (view: string) => void;
}

export const CirAnalysisView: React.FC<CirAnalysisViewProps> = ({
  currentProject,
  onSaveProject,
  onNavigate,
}) => {
  const [activeSection, setActiveSection] = useState<'dimensions' | 'frascati' | 'engineering'>('dimensions');

  if (!currentProject) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
        <Microscope className="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <p>Veuillez sélectionner un projet pour accéder à la grille d'analyse CIR.</p>
      </div>
    );
  }

  const cirScore = calculateCirScore(currentProject);
  const engineering = detectClassicalEngineering(currentProject);

  const handleDimensionChange = (field: keyof CirDimensions, value: any) => {
    const updatedDims = { ...currentProject.cirDimensions, [field]: value };
    const updatedProj = { ...currentProject, cirDimensions: updatedDims };
    onSaveProject(updatedProj);
  };

  const handleFrascatiChange = (criterionKey: keyof Project['frascatiCriteria'], field: keyof FrascatiCriterion, value: any) => {
    const updatedCriteria = {
      ...currentProject.frascatiCriteria,
      [criterionKey]: {
        ...currentProject.frascatiCriteria[criterionKey],
        [field]: value,
      },
    };
    onSaveProject({ ...currentProject, frascatiCriteria: updatedCriteria });
  };

  const toggleEngineeringFlag = (flagId: string) => {
    const currentFlags = currentProject.classicEngineering?.detectedFlags || [];
    const newFlags = currentFlags.includes(flagId)
      ? currentFlags.filter(f => f !== flagId)
      : [...currentFlags, flagId];

    const updatedEngineering = {
      ...currentProject.classicEngineering,
      detectedFlags: newFlags,
      isTriggered: newFlags.length >= 2,
    };
    onSaveProject({ ...currentProject, classicEngineering: updatedEngineering });
  };

  return (
    <div className="space-y-6">
      {/* Header with CIR Score preview */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">
            Recherche & Développement · Manuel de Frascati & CGI Art. 244 quater B
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Grille Spécifique d'Analyse d'Éligibilité CIR
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Distinguer rigoureusement les travaux de R&D des travaux d'ingénierie ordinaire selon la jurisprudence fiscale.
          </p>
        </div>

        {/* Global Indicative CIR Score Card */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
          <div className="text-right">
            <div className="text-[11px] text-slate-500 font-medium">Potentiel CIR indicatif</div>
            <div className={`text-base font-bold ${
              cirScore.potentialLevel === 'Fort' ? 'text-emerald-700' :
              cirScore.potentialLevel === 'Modéré' ? 'text-teal-700' :
              cirScore.potentialLevel === 'À approfondir' ? 'text-purple-700' :
              'text-rose-700'
            }`}>
              {cirScore.potentialLevel}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="font-mono text-xl font-bold tabular-nums text-slate-900">
            {cirScore.globalCirScore.toFixed(1)} <span className="text-xs text-slate-400 font-sans font-normal">/ 4</span>
          </div>
        </div>
      </div>

      {/* Classical Engineering Detection Alert Banner (Mandatory Prompt Text) */}
      {engineering.isTriggered && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3.5 shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-amber-900">
            <span className="font-bold text-amber-950 block text-sm">
              Détection de signaux d’ingénierie classique
            </span>
            <p className="leading-relaxed">
              <strong>Attention :</strong> les travaux décrits semblent relever principalement de travaux d’ingénierie classique. Pour caractériser une éventuelle activité de R&D, il est nécessaire d’identifier les incertitudes scientifiques ou techniques rencontrées et les expérimentations conduites pour les lever.
            </p>
            <div className="text-[11px] text-amber-800 pt-1">
              Signaux identifiés : <span className="font-mono font-medium">{engineering.detectedSignals.map(s => {
                const item = CLASSICAL_ENGINEERING_SIGNALS.find(x => x.id === s);
                return item ? item.label : s;
              }).join(', ')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Sub-navigation tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveSection('dimensions')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeSection === 'dimensions'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>5 Dimensions CIR Fondamentales</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded">
            Moy. {cirScore.dimensionsAverage}/4
          </span>
        </button>

        <button
          onClick={() => setActiveSection('frascati')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeSection === 'frascati'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Les 5 Critères Frascati</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded">
            Moy. {cirScore.frascatiAverage}/4
          </span>
        </button>

        <button
          onClick={() => setActiveSection('engineering')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeSection === 'engineering'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Diagnostic Ingénierie Classique</span>
          {engineering.detectedSignals.length > 0 && (
            <span className="font-mono text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-semibold">
              {engineering.detectedSignals.length} signal(s)
            </span>
          )}
        </button>
      </div>

      {/* Content 1: 5 Dimensions CIR */}
      {activeSection === 'dimensions' && (
        <div className="space-y-6">
          {/* A. État de l'art */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-800 font-mono text-xs flex items-center justify-center font-bold">A</span>
                  État de l’art (Connaissances accessibles)
                </h3>
                <p className="text-xs text-slate-500">
                  Évaluer si l’équipe a réellement cherché à identifier les connaissances et solutions accessibles avant ou pendant les travaux.
                </p>
              </div>

              {/* Score Selector 0 to 4 */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <span className="text-xs text-slate-500 font-medium mr-1">Score :</span>
                {[0, 1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleDimensionChange('stateOfArtScore', s)}
                    className={`w-7 h-7 rounded text-xs font-mono font-bold transition-all ${
                      currentProject.cirDimensions.stateOfArtScore === s
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Score scale description */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px] p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className={currentProject.cirDimensions.stateOfArtScore === 0 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>0 =</strong> Aucun état de l’art
              </div>
              <div className={currentProject.cirDimensions.stateOfArtScore === 1 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>1 =</strong> Benchmark commercial uniquement
              </div>
              <div className={currentProject.cirDimensions.stateOfArtScore === 2 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>2 =</strong> Analyse partielle
              </div>
              <div className={currentProject.cirDimensions.stateOfArtScore === 3 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>3 =</strong> Analyse technique structurée
              </div>
              <div className={currentProject.cirDimensions.stateOfArtScore === 4 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>4 =</strong> État de l’art solide démontrant les limites des connaissances
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Quelles publications, brevets, outils ou technologies ont été étudiés ? *
                </label>
                <textarea
                  rows={2}
                  value={currentProject.cirDimensions.studiedSources || ''}
                  onChange={(e) => handleDimensionChange('studiedSources', e.target.value)}
                  placeholder="Citez les auteurs, articles scientifiques, brevets ou librairies techniques examinés..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Pourquoi ces solutions étaient-elles insuffisantes ? *
                </label>
                <textarea
                  rows={2}
                  value={currentProject.cirDimensions.whyExistingInsufficient || ''}
                  onChange={(e) => handleDimensionChange('whyExistingInsufficient', e.target.value)}
                  placeholder="Explication formelle des limites atteintes par l'existant..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-4 pt-1">
                <span className="font-medium text-slate-700">Nature de la difficulté :</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="difficultyContext"
                    checked={currentProject.cirDimensions.difficultyContext === 'interne'}
                    onChange={() => handleDimensionChange('difficultyContext', 'interne')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Difficulté propre à l'entreprise (manque de compétences internes)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="difficultyContext"
                    checked={currentProject.cirDimensions.difficultyContext === 'objective_etat_art'}
                    onChange={() => handleDimensionChange('difficultyContext', 'objective_etat_art')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-emerald-800">Difficulté objective dans l’état des connaissances (Critère CIR)</span>
                </label>
              </div>
            </div>
          </div>

          {/* B. Verrou scientifique ou technique */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-800 font-mono text-xs flex items-center justify-center font-bold">B</span>
                  Verrou Scientifique ou Technique
                </h3>
                <p className="text-xs text-slate-500">
                  Identifier les difficultés pour lesquelles aucune solution évidente ou directement accessible n’était disponible.
                </p>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <span className="text-xs text-slate-500 font-medium mr-1">Score :</span>
                {[0, 1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleDimensionChange('scientificLockScore', s)}
                    className={`w-7 h-7 rounded text-xs font-mono font-bold transition-all ${
                      currentProject.cirDimensions.scientificLockScore === s
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px] p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className={currentProject.cirDimensions.scientificLockScore === 0 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>0 =</strong> Problème courant
              </div>
              <div className={currentProject.cirDimensions.scientificLockScore === 1 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>1 =</strong> Difficulté technique classique
              </div>
              <div className={currentProject.cirDimensions.scientificLockScore === 2 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>2 =</strong> Difficulté significative mais solutions connues
              </div>
              <div className={currentProject.cirDimensions.scientificLockScore === 3 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>3 =</strong> Incertitude technique importante
              </div>
              <div className={currentProject.cirDimensions.scientificLockScore === 4 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>4 =</strong> Verrou scientifique ou technique clairement caractérisé
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Typologie précise de la difficulté :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'courant', label: 'Problème projet courant' },
                    { id: 'integration', label: 'Difficulté d’intégration' },
                    { id: 'organisation', label: 'Difficulté organisationnelle' },
                    { id: 'ingenierie', label: 'Difficulté d’ingénierie complexe' },
                    { id: 'verrou_r_et_d', label: 'Véritable verrou scientifique (R&D)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleDimensionChange('lockNature', item.id)}
                      className={`p-2 rounded text-left border transition-all ${
                        currentProject.cirDimensions.lockNature === item.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Description argumentée du verrou scientifique ou technique *
                </label>
                <textarea
                  rows={3}
                  value={currentProject.cirDimensions.scientificLockDetails || ''}
                  onChange={(e) => handleDimensionChange('scientificLockDetails', e.target.value)}
                  placeholder="Expliquez pourquoi l'état de l'art ne fournissait aucune solution directement applicable par un homme du métier..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* C. Incertitude */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-800 font-mono text-xs flex items-center justify-center font-bold">C</span>
                  Incertitude Scientifique ou Technique
                </h3>
                <p className="text-xs text-slate-500">
                  Analyser si le résultat était réellement incertain avant les travaux ou prévisible d'avance.
                </p>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <span className="text-xs text-slate-500 font-medium mr-1">Score :</span>
                {[0, 1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleDimensionChange('uncertaintyScore', s)}
                    className={`w-7 h-7 rounded text-xs font-mono font-bold transition-all ${
                      currentProject.cirDimensions.uncertaintyScore === s
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px] p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className={currentProject.cirDimensions.uncertaintyScore === 0 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>0 =</strong> Résultat prévisible
              </div>
              <div className={currentProject.cirDimensions.uncertaintyScore === 1 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>1 =</strong> Adaptation connue
              </div>
              <div className={currentProject.cirDimensions.uncertaintyScore === 2 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>2 =</strong> Plusieurs solutions envisageables
              </div>
              <div className={currentProject.cirDimensions.uncertaintyScore === 3 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>3 =</strong> Faisabilité incertaine
              </div>
              <div className={currentProject.cirDimensions.uncertaintyScore === 4 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>4 =</strong> Impossibilité de déterminer la solution sans expérimentation
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-medium text-slate-700 mb-1">
                Justification de l'aléa technique initial *
              </label>
              <textarea
                rows={2}
                value={currentProject.cirDimensions.uncertaintyDetails || ''}
                onChange={(e) => handleDimensionChange('uncertaintyDetails', e.target.value)}
                placeholder="Décrivez les risques d'échec technique réels au démarrage du projet..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* D. Démarche expérimentale */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-800 font-mono text-xs flex items-center justify-center font-bold">D</span>
                  Démarche Expérimentale & Hypothèses
                </h3>
                <p className="text-xs text-slate-500">
                  Hypothèses, prototypes, essais, benchmarks techniques, mesures, simulations, échecs, itérations.
                </p>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <span className="text-xs text-slate-500 font-medium mr-1">Score :</span>
                {[0, 1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleDimensionChange('experimentalScore', s)}
                    className={`w-7 h-7 rounded text-xs font-mono font-bold transition-all ${
                      currentProject.cirDimensions.experimentalScore === s
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px] p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className={currentProject.cirDimensions.experimentalScore === 0 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>0 =</strong> Développement direct
              </div>
              <div className={currentProject.cirDimensions.experimentalScore === 1 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>1 =</strong> Quelques tests
              </div>
              <div className={currentProject.cirDimensions.experimentalScore === 2 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>2 =</strong> Plusieurs itérations
              </div>
              <div className={currentProject.cirDimensions.experimentalScore === 3 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>3 =</strong> Démarche expérimentale structurée
              </div>
              <div className={currentProject.cirDimensions.experimentalScore === 4 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>4 =</strong> Démarche expérimentale documentée et reproductible
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">
                  Détail des protocoles d'essais et des itérations *
                </label>
                <textarea
                  rows={2}
                  value={currentProject.cirDimensions.experimentalDetails || ''}
                  onChange={(e) => handleDimensionChange('experimentalDetails', e.target.value)}
                  placeholder="Protocole d'essais, conditions opératoires, outils de simulation, bancs de test..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Nombre d'itérations / sprints scientifiques
                </label>
                <input
                  type="number"
                  min={1}
                  value={currentProject.cirDimensions.iterationsCount || 1}
                  onChange={(e) => handleDimensionChange('iterationsCount', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* E. Production de connaissances nouvelles */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-800 font-mono text-xs flex items-center justify-center font-bold">E</span>
                  Production de Connaissances Nouvelles
                </h3>
                <p className="text-xs text-slate-500">
                  Évaluer si les travaux ont permis de produire ou d’acquérir des connaissances dépassant la simple réalisation du produit.
                </p>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <span className="text-xs text-slate-500 font-medium mr-1">Score :</span>
                {[0, 1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleDimensionChange('newKnowledgeScore', s)}
                    className={`w-7 h-7 rounded text-xs font-mono font-bold transition-all ${
                      currentProject.cirDimensions.newKnowledgeScore === s
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px] p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className={currentProject.cirDimensions.newKnowledgeScore === 0 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>0 =</strong> Aucune connaissance nouvelle
              </div>
              <div className={currentProject.cirDimensions.newKnowledgeScore === 1 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>1 =</strong> Retour d’expérience interne
              </div>
              <div className={currentProject.cirDimensions.newKnowledgeScore === 2 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>2 =</strong> Amélioration technique
              </div>
              <div className={currentProject.cirDimensions.newKnowledgeScore === 3 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>3 =</strong> Acquisition de connaissances nouvelles significatives
              </div>
              <div className={currentProject.cirDimensions.newKnowledgeScore === 4 ? 'font-bold text-emerald-800' : 'text-slate-500'}>
                <strong>4 =</strong> Connaissances nouvelles clairement identifiées et réutilisables
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Formalisation des connaissances acquises *
                </label>
                <textarea
                  rows={2}
                  value={currentProject.cirDimensions.newKnowledgeDetails || ''}
                  onChange={(e) => handleDimensionChange('newKnowledgeDetails', e.target.value)}
                  placeholder="Qu'est-ce que l'équipe maîtrise désormais qu'elle ignorait au démarrage ?"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentProject.cirDimensions.reproducibilityGuaranteed}
                  onChange={(e) => handleDimensionChange('reproducibilityGuaranteed', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300"
                />
                <span className="font-semibold text-slate-800">
                  Reproductibilité garantie : Les résultats peuvent être vérifiés et réutilisés par un tiers qualifié.
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Content 2: 5 Critères Frascati */}
      {activeSection === 'frascati' && (
        <div className="space-y-5">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Norme OCDE · Manuel de Frascati (Édition 2015) : </span>
              Pour qu'une activité soit qualifiée de R&D, elle doit obligatoirement satisfaire à 5 critères cumulatifs : <strong>Nouveauté</strong>, <strong>Créativité</strong>, <strong>Incertitude</strong>, <strong>Systématicité</strong> et <strong>Transférabilité / Reproductibilité</strong>.
            </div>
          </div>

          {(['novelty', 'creativity', 'uncertainty', 'systematicity', 'transferability'] as const).map((key) => {
            const criterion = currentProject.frascatiCriteria[key];
            const titles: Record<string, string> = {
              novelty: '1. Nouveauté (Novel)',
              creativity: '2. Créativité (Creative)',
              uncertainty: '3. Incertitude (Uncertain)',
              systematicity: '4. Systématicité (Systematic)',
              transferability: '5. Transférabilité & Reproductibilité (Transferable / Reproducible)',
            };

            return (
              <div key={key} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {titles[key]}
                    </h3>
                    <p className="text-xs text-slate-500 italic mt-0.5">
                      « {criterion.definition} »
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="text-xs text-slate-500 font-medium mr-1">Note :</span>
                    {[0, 1, 2, 3, 4].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleFrascatiChange(key, 'score', s)}
                        className={`w-7 h-7 rounded text-xs font-mono font-bold transition-all ${
                          criterion.score === s
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-emerald-800 mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Éléments qui le soutiennent
                    </label>
                    <textarea
                      rows={2}
                      value={criterion.supportingElements || ''}
                      onChange={(e) => handleFrascatiChange(key, 'supportingElements', e.target.value)}
                      placeholder="Faits, preuves et arguments favorables..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-rose-800 mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Éléments qui le fragilisent
                    </label>
                    <textarea
                      rows={2}
                      value={criterion.weakeningElements || ''}
                      onChange={(e) => handleFrascatiChange(key, 'weakeningElements', e.target.value)}
                      placeholder="Faiblesses, standards existants ou risques d'audit..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-purple-800 mb-1 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Informations manquantes
                    </label>
                    <textarea
                      rows={2}
                      value={criterion.missingInformation || ''}
                      onChange={(e) => handleFrascatiChange(key, 'missingInformation', e.target.value)}
                      placeholder="Données à exiger de l'équipe pour consolider le critère..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Content 3: Détection de l'ingénierie classique */}
      {activeSection === 'engineering' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Grille de Détection des Travaux d’Ingénierie Classique
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Cochez les activités présentes dans le projet. L'accumulation de ces signaux disqualifie l'éligibilité au CIR selon le guide du Ministère de la Recherche.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CLASSICAL_ENGINEERING_SIGNALS.map((signal) => {
              const isChecked = currentProject.classicEngineering?.detectedFlags?.includes(signal.id) ||
                engineering.detectedSignals.includes(signal.id);

              return (
                <div
                  key={signal.id}
                  onClick={() => toggleEngineeringFlag(signal.id)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                    isChecked
                      ? 'border-amber-400 bg-amber-50/70 text-amber-950 font-medium'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // handled by parent div
                    className="mt-0.5 w-4 h-4 text-amber-600 rounded border-slate-300 cursor-pointer"
                  />
                  <div>
                    <span className="block font-semibold">{signal.label}</span>
                    <span className="text-[10px] text-slate-500">Mots-clés : {signal.keywords.join(', ')}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-xs space-y-2 pt-2 border-t border-slate-100">
            <label className="block font-semibold text-slate-800">
              Observations spécifiques de l'auditeur sur la part d'ingénierie :
            </label>
            <textarea
              rows={3}
              value={currentProject.classicEngineering?.customEngineeringObservation || ''}
              onChange={(e) => {
                const updated = {
                  ...currentProject.classicEngineering,
                  customEngineeringObservation: e.target.value,
                };
                onSaveProject({ ...currentProject, classicEngineering: updated });
              }}
              placeholder="Commentaires du consultant sur la frontière entre développement conventionnel et part R&D véritable..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
