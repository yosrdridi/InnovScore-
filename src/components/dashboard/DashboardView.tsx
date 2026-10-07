import React from 'react';
import { Project, Company } from '../../types';
import { 
  Building2, 
  FolderKanban, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  TrendingUp, 
  Microscope, 
  Lightbulb, 
  Plus, 
  ArrowUpRight, 
  FileCheck2,
  Users2
} from 'lucide-react';
import { 
  calculateCirScore, 
  calculateCiiScore, 
  determineMatrixPosition, 
  detectClassicalEngineering, 
  calculateConfidenceLevel 
} from '../../utils/scoring';

interface DashboardViewProps {
  projects: Project[];
  companies: Company[];
  currentProject: Project | null;
  onSelectProject: (projectId: string) => void;
  onNavigate: (view: string) => void;
  onNewProject: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  companies,
  currentProject,
  onSelectProject,
  onNavigate,
  onNewProject,
}) => {
  // Aggregate stats
  const totalEtp = projects.reduce((acc, p) => acc + (p.totalEtp || 0), 0);
  const totalBudgetKeur = projects.reduce((acc, p) => acc + (p.estimatedBudgetKeur || 0), 0);
  
  // Matrix breakdown
  const categorized = projects.map(p => {
    const comp = companies.find(c => c.id === p.companyId);
    return {
      project: p,
      company: comp,
      matrix: determineMatrixPosition(p, comp),
      cir: calculateCirScore(p),
      cii: calculateCiiScore(p, comp),
      eng: detectClassicalEngineering(p),
      confidence: calculateConfidenceLevel(p),
    };
  });

  const cirCount = categorized.filter(c => c.matrix.status === 'CIR_POTENTIEL').length;
  const ciiCount = categorized.filter(c => c.matrix.status === 'CII_POTENTIEL').length;
  const engCount = categorized.filter(c => c.matrix.status === 'INGENIERIE_CLASSIQUE').length;
  const toDeepenCount = categorized.filter(c => c.matrix.status === 'A_APPROFONDIR').length;

  return (
    <div className="space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Tableau de Bord & Éligibilité Fiscale R&D
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Aide à la qualification méthodique CIR (Recherche) / CII (Innovation) et détection des risques d'ingénierie ordinaire.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('projects')}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Gérer les projets ({projects.length})
          </button>
          <button
            onClick={onNewProject}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau projet</span>
          </button>
        </div>
      </div>

      {/* Metric Cards (Zero-pill, high density, single elevation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Potentiel CIR (R&D)</span>
            <Microscope className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900">
            {cirCount} <span className="text-xs font-sans text-slate-400 font-normal">/ {projects.length} projet(s)</span>
          </div>
          <div className="mt-2 text-xs text-emerald-700 font-medium">
            Verrous scientifiques & Frascati
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Potentiel CII (Produit)</span>
            <Lightbulb className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900">
            {ciiCount} <span className="text-xs font-sans text-slate-400 font-normal">/ {projects.length} projet(s)</span>
          </div>
          <div className="mt-2 text-xs text-sky-700 font-medium">
            Supériorité marché PME
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Ingénierie classique (Alerte)</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900">
            {engCount} <span className="text-xs font-sans text-slate-400 font-normal">/ {projects.length} projet(s)</span>
          </div>
          <div className="mt-2 text-xs text-amber-700 font-medium">
            Risque fiscal sans incertitude
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>À approfondir / Données</span>
            <HelpCircle className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900">
            {toDeepenCount} <span className="text-xs font-sans text-slate-400 font-normal">/ {projects.length} projet(s)</span>
          </div>
          <div className="mt-2 text-xs text-purple-700 font-medium">
            Enquête technique requise
          </div>
        </div>
      </div>

      {/* Positioning Matrix & Methodological Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Matrix Section */}
        <div className="lg:col-span-2 p-5 bg-white border border-slate-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Matrice de Qualification R&D vs Innovation vs Ingénierie
              </h2>
              <p className="text-xs text-slate-500">
                Positionnement objectif des projets selon le Manuel de Frascati et les critères fiscaux français (CGI art. 244 quater B).
              </p>
            </div>
            <button
              onClick={() => onNavigate('synthesis')}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Vue détaillée
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Quadrant 1: CIR */}
            <div className="p-3.5 bg-emerald-50/50 border border-emerald-200/80 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <Microscope className="w-3.5 h-3.5 text-emerald-700" />
                  CIR Potentiel (R&D)
                </span>
                <span className="font-mono text-xs font-bold text-emerald-800 tabular-nums">
                  {cirCount}
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Incertitude scientifique ou technique avérée, état de l’art approfondi, démarche expérimentale et création de connaissances nouvelles.
              </p>
              <div className="pt-1 text-[11px] font-medium text-emerald-900">
                {categorized.filter(c => c.matrix.status === 'CIR_POTENTIEL').map(c => (
                  <button
                    key={c.project.id}
                    onClick={() => { onSelectProject(c.project.id); onNavigate('cir'); }}
                    className="block hover:underline truncate text-left w-full text-emerald-800"
                  >
                    → {c.project.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quadrant 2: CII */}
            <div className="p-3.5 bg-sky-50/50 border border-sky-200/80 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-sky-700" />
                  CII Potentiel (Innovation)
                </span>
                <span className="font-mono text-xs font-bold text-sky-800 tabular-nums">
                  {ciiCount}
                </span>
              </div>
              <p className="text-[11px] text-sky-800 leading-relaxed">
                Réservé aux PME. Conception d’un bien nouveau supérieur aux concurrents (performances, fonctionnalités, ergonomie, écoconception).
              </p>
              <div className="pt-1 text-[11px] font-medium text-sky-900">
                {categorized.filter(c => c.matrix.status === 'CII_POTENTIEL').map(c => (
                  <button
                    key={c.project.id}
                    onClick={() => { onSelectProject(c.project.id); onNavigate('cii'); }}
                    className="block hover:underline truncate text-left w-full text-sky-800"
                  >
                    → {c.project.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quadrant 3: Ingénierie */}
            <div className="p-3.5 bg-amber-50/50 border border-amber-200/80 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  Ingénierie classique
                </span>
                <span className="font-mono text-xs font-bold text-amber-800 tabular-nums">
                  {engCount}
                </span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Mise en œuvre de règles de l’art, paramétrage, intégration d’API, refactoring, maintenance courante sans aléa de recherche.
              </p>
              <div className="pt-1 text-[11px] font-medium text-amber-900">
                {categorized.filter(c => c.matrix.status === 'INGENIERIE_CLASSIQUE').map(c => (
                  <button
                    key={c.project.id}
                    onClick={() => { onSelectProject(c.project.id); onNavigate('cir'); }}
                    className="block hover:underline truncate text-left w-full text-amber-800"
                  >
                    → {c.project.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quadrant 4: À approfondir */}
            <div className="p-3.5 bg-purple-50/50 border border-purple-200/80 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-purple-700" />
                  À approfondir
                </span>
                <span className="font-mono text-xs font-bold text-purple-800 tabular-nums">
                  {toDeepenCount}
                </span>
              </div>
              <p className="text-[11px] text-purple-800 leading-relaxed">
                Description trop floue ou manque de métriques chiffrées. Nécessite un entretien technique approfondi avec les équipes d’ingénierie.
              </p>
              <div className="pt-1 text-[11px] font-medium text-purple-900">
                {categorized.filter(c => c.matrix.status === 'A_APPROFONDIR').map(c => (
                  <button
                    key={c.project.id}
                    onClick={() => { onSelectProject(c.project.id); onNavigate('dynamic'); }}
                    className="block hover:underline truncate text-left w-full text-purple-800"
                  >
                    → {c.project.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Audit Methodology Guidance Card */}
        <div className="p-5 bg-slate-900 text-white rounded-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Doctrine MESR & DGFIP
            </div>
            <h3 className="text-base font-bold text-white">
              Les 3 piliers d’un dossier défendable
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-mono font-bold">1.</span>
                <span><strong>État de l'art étendu</strong> : citer des publications ou brevets avant les travaux pour prouver les limites des connaissances.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-mono font-bold">2.</span>
                <span><strong>Verrou caractérisé</strong> : formaliser ce qu'un homme du métier ne pouvait pas résoudre sans expérimentations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-mono font-bold">3.</span>
                <span><strong>Preuves contemporaines</strong> : commits, cahiers d'essais et feuilles de temps datées de l'exercice.</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800">
            <button
              onClick={() => onNavigate('dynamic')}
              className="w-full py-2 px-3 text-xs font-medium text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
            >
              Lancer l'interrogatoire dynamique →
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Table (Single elevation, dense, clean row alignment) */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Portefeuille des Projets Analysés
            </h2>
            <p className="text-xs text-slate-500">
              Sélectionnez un projet pour consulter ou enrichir la grille d'éligibilité.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {projects.length} projet(s) enregistrés
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-700 font-semibold">
              <tr>
                <th scope="col" className="px-4 py-3">Projet & Année</th>
                <th scope="col" className="px-4 py-3">Entreprise</th>
                <th scope="col" className="px-4 py-3">Statut Qualification</th>
                <th scope="col" className="px-4 py-3 text-right">Score CIR</th>
                <th scope="col" className="px-4 py-3 text-right">Potentiel CII</th>
                <th scope="col" className="px-4 py-3">Confiance</th>
                <th scope="col" className="px-4 py-3 text-right">Preuves</th>
                <th scope="col" className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {categorized.map(({ project, company, matrix, cir, cii, confidence }) => {
                const isSelected = currentProject?.id === project.id;
                return (
                  <tr 
                    key={project.id} 
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                      isSelected ? 'bg-indigo-50/40' : ''
                    }`}
                    onClick={() => onSelectProject(project.id)}
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <div className="font-semibold text-slate-900 truncate max-w-[280px]">
                        {project.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                        Exercice {project.analyzedYear} · {project.projectLeader}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div>{company?.name || '—'}</div>
                      <div className="text-[11px] text-slate-400">
                        {company?.isPME ? 'PME communautaire' : 'ETI / Grande Entreprise'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${
                        matrix.status === 'CIR_POTENTIEL' ? 'text-emerald-700' :
                        matrix.status === 'CII_POTENTIEL' ? 'text-sky-700' :
                        matrix.status === 'INGENIERIE_CLASSIQUE' ? 'text-amber-700' :
                        'text-purple-700'
                      }`}>
                        {matrix.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums font-semibold text-slate-800">
                      {cir.globalCirScore.toFixed(1)} / 4
                      <span className="block text-[10px] font-sans font-normal text-slate-500">
                        {cir.potentialLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-medium text-slate-800">
                        {cii.potentialLevel}
                      </span>
                      {cii.isPmeEligible && (
                        <span className="block text-[10px] font-mono text-slate-400">
                          Score: {cii.scoreInnovation.toFixed(1)}/4
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-medium ${
                          confidence.level === 'Élevée' ? 'text-emerald-600' :
                          confidence.level === 'Moyenne' ? 'text-amber-600' :
                          'text-rose-600'
                        }`}>
                          {confidence.level}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({confidence.percentage}%)
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-600">
                      {project.evidence?.length || 0}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProject(project.id);
                          onNavigate('cir');
                        }}
                        className="px-2.5 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors"
                      >
                        Auditer →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
