import React from 'react';
import { Project, Company } from '../../types';
import { 
  Compass, 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Sliders, 
  ListChecks, 
  ShieldAlert,
  Microscope,
  Lightbulb,
  Printer
} from 'lucide-react';
import { 
  calculateCirScore, 
  calculateCiiScore, 
  determineMatrixPosition, 
  detectClassicalEngineering, 
  calculateConfidenceLevel, 
  generateMissingInformation, 
  generateAuditRecommendations 
} from '../../utils/scoring';

interface SynthesisViewProps {
  currentProject: Project | null;
  currentCompany: Company | null;
  onNavigate: (view: string) => void;
}

export const SynthesisView: React.FC<SynthesisViewProps> = ({
  currentProject,
  currentCompany,
  onNavigate,
}) => {
  if (!currentProject) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
        <Compass className="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <p>Veuillez sélectionner un projet pour afficher la synthèse d'éligibilité.</p>
      </div>
    );
  }

  const cir = calculateCirScore(currentProject);
  const cii = calculateCiiScore(currentProject, currentCompany || undefined);
  const engineering = detectClassicalEngineering(currentProject);
  const matrix = determineMatrixPosition(currentProject, currentCompany || undefined);
  const confidence = calculateConfidenceLevel(currentProject);
  const missingInfo = generateMissingInformation(currentProject, currentCompany || undefined);
  const recommendations = generateAuditRecommendations(currentProject, currentCompany || undefined);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            Synthèse Stratégique & Préparation Audit
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Matrice de Positionnement & Recommandations
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Évaluation collégiale CIR / CII / Ingénierie, indicateurs de confiance et plan d'action d'audit.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('export')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-4 h-4" />
            <span>Générer le rapport complet</span>
          </button>
        </div>
      </div>

      {/* Top 3 Strategic Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Positionnement Global */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Positionnement Collégial
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xl font-bold ${
              matrix.status === 'CIR_POTENTIEL' ? 'text-emerald-700' :
              matrix.status === 'CII_POTENTIEL' ? 'text-sky-700' :
              matrix.status === 'INGENIERIE_CLASSIQUE' ? 'text-amber-700' :
              'text-purple-700'
            }`}>
              {matrix.label}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {matrix.rationale}
          </p>
        </div>

        {/* Card 2: Potentiels Fiscaux Indicatifs */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Potentiels Fiscaux Indicatifs
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Microscope className="w-4 h-4 text-emerald-600" />
                Potentiel CIR (R&D) :
              </span>
              <strong className="text-slate-900 font-semibold">{cir.potentialLevel}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-sky-600" />
                Potentiel CII (Innovation) :
              </span>
              <strong className="text-slate-900 font-semibold">{cii.potentialLevel}</strong>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 italic">
            * Avertissement : Le score numérique ne constitue en aucun cas une décision juridique définitive.
          </p>
        </div>

        {/* Card 3: Indicateur de Confiance */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Confiance de l'Analyse</span>
            <span className="font-mono tabular-nums text-slate-900">{confidence.percentage}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xl font-bold ${
              confidence.level === 'Élevée' ? 'text-emerald-700' :
              confidence.level === 'Moyenne' ? 'text-amber-700' :
              'text-rose-700'
            }`}>
              {confidence.level}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                confidence.level === 'Élevée' ? 'bg-emerald-600' :
                confidence.level === 'Moyenne' ? 'bg-amber-500' :
                'bg-rose-500'
              }`}
              style={{ width: `${confidence.percentage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            La confiance dépend du volume d'informations techniques fournies et des preuves rattachées.
          </p>
        </div>
      </div>

      {/* Section Centrale : Informations Nécessaires Pour Sécuriser L'Analyse (Section 9 Prompt) */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-indigo-600" />
              Informations Nécessaires Pour Sécuriser l’Analyse (Audit Préparatoire)
            </h2>
            <p className="text-xs text-slate-500">
              Points de fragilité détectés par le moteur d'audit. Actions indispensables pour résister à un contrôle du MESR ou de l'administration fiscale.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-600 font-semibold self-start sm:self-auto">
            {missingInfo.length} point(s) d'attention
          </span>
        </div>

        {missingInfo.length > 0 ? (
          <div className="space-y-3">
            {missingInfo.map((item, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs ${
                  item.priority === 'Critique' ? 'bg-rose-50/60 border-rose-200' :
                  item.priority === 'Moyenne' ? 'bg-amber-50/60 border-amber-200' :
                  'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono ${
                      item.priority === 'Critique' ? 'bg-rose-100 text-rose-800' :
                      item.priority === 'Moyenne' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-200 text-slate-800'
                    }`}>
                      {item.priority}
                    </span>
                    <span className="font-semibold text-slate-900">Catégorie : {item.category}</span>
                  </div>
                  <p className="text-slate-800 font-medium pt-1">
                    Constat : {item.issue}
                  </p>
                  <p className="text-indigo-900 flex items-start gap-1 font-semibold pt-0.5">
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    Action requise : {item.actionRequired}
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (item.category.includes('État de l\'art') || item.category.includes('Verrous')) onNavigate('cir');
                    else if (item.category.includes('Marché')) onNavigate('cii');
                    else if (item.category.includes('Preuves')) onNavigate('evidence');
                    else onNavigate('qualification');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-2xs self-start shrink-0"
                >
                  Compléter →
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs">
            <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-600" />
            <span className="font-bold block text-sm">Dossier technique hautement qualifié</span>
            <p>Toutes les dimensions clés (état de l'art, verrous, hypothèses, résultats chiffrés et preuves) sont documentées.</p>
          </div>
        )}
      </section>

      {/* Visualisation Grille 2D Interactive & Positionnement Matrice */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Positionnement dans la Matrice de Décision Fiscale
        </h2>
        <p className="text-xs text-slate-500">
          Ce schéma illustre la position relative du projet entre le degré d'aléa scientifique (axe R&D / CIR) et le degré d'innovation produit sur le marché (axe Innovation / CII).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Box 1: CIR */}
          <div className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
            matrix.status === 'CIR_POTENTIEL'
              ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
              : 'bg-slate-50/60 border-slate-200 opacity-70'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Microscope className="w-4 h-4 text-emerald-600" />
                CIR Potentiel (R&D Fondamentale & Appliquée)
              </span>
              {matrix.status === 'CIR_POTENTIEL' && (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Profil actuel
                </span>
              )}
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Forte incertitude scientifique ou technique + Démarche expérimentale formalisée avec hypothèses et tests + Acquisition de connaissances nouvelles dépassant l'état de l'art mondial.
            </p>
          </div>

          {/* Box 2: CII */}
          <div className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
            matrix.status === 'CII_POTENTIEL'
              ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20'
              : 'bg-slate-50/60 border-slate-200 opacity-70'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-sky-600" />
                CII Potentiel (Innovation Produit Supérieure au Marché)
              </span>
              {matrix.status === 'CII_POTENTIEL' && (
                <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                  Profil actuel
                </span>
              )}
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Réservé aux PME. Dépassement des performances concurrentes sur les fonctionnalités, l'ergonomie, la technique ou l'écoconception, mené jusqu'au prototype sans verrou scientifique fondamental.
            </p>
          </div>

          {/* Box 3: Ingénierie */}
          <div className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
            matrix.status === 'INGENIERIE_CLASSIQUE'
              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
              : 'bg-slate-50/60 border-slate-200 opacity-70'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Ingénierie Classique (Règles de l'Art)
              </span>
              {matrix.status === 'INGENIERIE_CLASSIQUE' && (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Profil actuel
                </span>
              )}
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Développement utilisant des solutions connues, intégration d'API standards, paramétrage, refactoring ou maintenance. Inéligible au CIR. Risque fiscal de rejet direct en cas de contrôle.
            </p>
          </div>

          {/* Box 4: À approfondir */}
          <div className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
            matrix.status === 'A_APPROFONDIR'
              ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/20'
              : 'bg-slate-50/60 border-slate-200 opacity-70'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                À Approfondir (Données Insuffisantes)
              </span>
              {matrix.status === 'A_APPROFONDIR' && (
                <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                  Profil actuel
                </span>
              )}
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Dossier incomplet, absence de métriques quantitatives ou vocabulaire trop promotionnel. Nécessite un entretien technique de qualification approfondi avec les ingénieurs.
            </p>
          </div>
        </div>
      </section>

      {/* Recommandations Stratégiques pour le Consultant */}
      <section className="bg-slate-900 text-white rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              Conseils & Recommandations d'Audit pour le Consultant
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="p-4 bg-slate-800/80 border border-slate-700 rounded-lg space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-300">{rec.title}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                  rec.riskLevel === 'Élevé' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                  rec.riskLevel === 'Modéré' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  Risque {rec.riskLevel}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {rec.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
