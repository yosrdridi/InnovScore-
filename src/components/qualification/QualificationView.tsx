import React from 'react';
import { Project } from '../../types';
import { HelpCircle, CheckCircle2, AlertCircle, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

interface QualificationViewProps {
  currentProject: Project | null;
  onSaveProject: (project: Project) => void;
  onNavigate: (view: string) => void;
}

export const QualificationView: React.FC<QualificationViewProps> = ({
  currentProject,
  onSaveProject,
  onNavigate,
}) => {
  if (!currentProject) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
        <HelpCircle className="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <p>Veuillez sélectionner un projet pour démarrer la qualification initiale.</p>
      </div>
    );
  }

  const handleFieldChange = (field: keyof Project, value: any) => {
    const updated = {
      ...currentProject,
      [field]: value,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    onSaveProject(updated);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            Étape 1 · Entretien & Diagnostic
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Formulaire Intelligent de Qualification du Projet
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Trame de questions ciblées pour extraire les faits techniques déterminants et orienter l'analyse vers le CIR, le CII ou l'ingénierie ordinaire.
          </p>
        </div>
        <button
          onClick={() => onNavigate('cir')}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-2xs self-start"
        >
          <span>Passer à l'analyse CIR</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Interactive Blocks */}
      <div className="space-y-6">
        {/* Block 1: Contexte et objectif */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 font-mono text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Contexte et Objectif
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">
                Quel problème l’équipe cherchait-elle à résoudre ? *
              </label>
              <textarea
                rows={3}
                value={currentProject.qualProblemSolved || ''}
                onChange={(e) => handleFieldChange('qualProblemSolved', e.target.value)}
                placeholder="Décrivez précisément le blocage concret rencontré avant le lancement..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">
                Quel était l’objectif technique, scientifique ou fonctionnel du projet ? *
              </label>
              <textarea
                rows={3}
                value={currentProject.objectives || ''}
                onChange={(e) => handleFieldChange('objectives', e.target.value)}
                placeholder="Spécifiez des cibles quantifiées (ex: bande passante, rendement, résistance, etc.)..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">
                Pourquoi les solutions existantes n’étaient-elles pas suffisantes ? *
              </label>
              <textarea
                rows={3}
                value={currentProject.qualWhyExistingFailed || ''}
                onChange={(e) => handleFieldChange('qualWhyExistingFailed', e.target.value)}
                placeholder="Expliquez en quoi les méthodes standards ou logiciels disponibles échouaient..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">
                Existe-t-il des solutions comparables sur le marché ou dans la littérature ?
              </label>
              <textarea
                rows={3}
                value={currentProject.stateOfTheArtKnown || ''}
                onChange={(e) => handleFieldChange('stateOfTheArtKnown', e.target.value)}
                placeholder="Citez les brevets, publications académiques ou produits concurrents connus..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Block 2: Difficultés rencontrées */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 font-mono text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Difficultés Rencontrées & Aléa
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">
                Quelles difficultés techniques ou scientifiques ont été rencontrées ? *
              </label>
              <textarea
                rows={3}
                value={currentProject.difficultiesEncountered || ''}
                onChange={(e) => handleFieldChange('difficultiesEncountered', e.target.value)}
                placeholder="Qu'est-ce qui résistait aux calculs et aux implémentations ?"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">
                Certaines difficultés pouvaient-elles être résolues par des pratiques connues ?
              </label>
              <textarea
                rows={3}
                value={currentProject.cirDimensions.scientificLockDetails || ''}
                onChange={(e) => {
                  const updatedDims = { ...currentProject.cirDimensions, scientificLockDetails: e.target.value };
                  handleFieldChange('cirDimensions', updatedDims);
                }}
                placeholder="Démontrez pourquoi un professionnel expérimenté du secteur était bloqué..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">
                Était-il possible de prédire facilement le résultat au démarrage ? *
              </label>
              <textarea
                rows={3}
                value={currentProject.qualPredictabilityAtStart || ''}
                onChange={(e) => handleFieldChange('qualPredictabilityAtStart', e.target.value)}
                placeholder="Détaillez le degré d'incertitude initiale sur la réussite ou la faisabilité..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">
                Quels paramètres ou phénomènes physiques / logiques étaient mal maîtrisés ?
              </label>
              <textarea
                rows={3}
                value={currentProject.cirDimensions.uncertaintyDetails || ''}
                onChange={(e) => {
                  const updatedDims = { ...currentProject.cirDimensions, uncertaintyDetails: e.target.value };
                  handleFieldChange('cirDimensions', updatedDims);
                }}
                placeholder="Variables incontrôlées, non-linéarités, explosion combinatoire, instabilité..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Block 3: Travaux réalisés */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 font-mono text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Travaux Réalisés & Démarche Expérimentale
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">
                Quelles hypothèses ont été formulées ? *
              </label>
              <textarea
                rows={3}
                value={currentProject.qualHypothesesTested || ''}
                onChange={(e) => handleFieldChange('qualHypothesesTested', e.target.value)}
                placeholder="Hypothèse 1 : ... / Hypothèse 2 : ..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">
                Quelles solutions ont été essayées puis abandonnées (échecs) ? *
              </label>
              <textarea
                rows={3}
                value={currentProject.qualFailedSolutionsAbandoned || ''}
                onChange={(e) => handleFieldChange('qualFailedSolutionsAbandoned', e.target.value)}
                placeholder="Très important pour l'audit MESR : la preuve d'échecs atteste de la R&D réelle !"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block font-semibold text-slate-700">
                Quels prototypes, bancs d'essais ou simulations ont été réalisés ? *
              </label>
              <textarea
                rows={3}
                value={currentProject.worksRealized || ''}
                onChange={(e) => handleFieldChange('worksRealized', e.target.value)}
                placeholder="Décrivez les maquettes de test, bancs de mesure, séries de simulations et itérations successives..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Block 4: Résultats */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 font-mono text-xs font-bold flex items-center justify-center">
              4
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Résultats & Connaissances Nouvelles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">
                Quels résultats et données quantitatives ont été obtenus ? *
              </label>
              <textarea
                rows={3}
                value={currentProject.results || ''}
                onChange={(e) => handleFieldChange('results', e.target.value)}
                placeholder="Fournissez des chiffres comparatifs mesurés (gains de temps, pourcentages, seuils)..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">
                Le projet a-t-il permis d’acquérir des connaissances réutilisables ?
              </label>
              <textarea
                rows={3}
                value={currentProject.qualKnowledgeAcquired || ''}
                onChange={(e) => handleFieldChange('qualKnowledgeAcquired', e.target.value)}
                placeholder="Principes théoriques, règles de dimensionnement, bibliothèques scientifiques..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block font-semibold text-slate-700">
                Certains verrous ou incertitudes restent-ils ouverts pour de futurs travaux ?
              </label>
              <textarea
                rows={2}
                value={currentProject.qualOpenUncertaintiesRemaining || ''}
                onChange={(e) => handleFieldChange('qualOpenUncertaintiesRemaining', e.target.value)}
                placeholder="Perspectives de recherche à mener sur les années suivantes..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
