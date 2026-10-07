import React from 'react';
import { Project, Company } from '../../types';
import { 
  LayoutDashboard, 
  Building2, 
  FolderKanban, 
  HelpCircle, 
  Microscope, 
  Lightbulb, 
  Compass, 
  MessageSquareCode, 
  FileCheck2, 
  FileSpreadsheet,
  AlertTriangle,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { 
  calculateCirScore, 
  calculateCiiScore, 
  determineMatrixPosition, 
  detectClassicalEngineering,
  generateMissingInformation 
} from '../../utils/scoring';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  currentProject: Project | null;
  currentCompany: Company | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  currentProject,
  currentCompany,
}) => {
  const missingItems = currentProject 
    ? generateMissingInformation(currentProject, currentCompany || undefined)
    : [];
  const criticalMissing = missingItems.filter(i => i.priority === 'Critique').length;
  
  const engineering = currentProject ? detectClassicalEngineering(currentProject) : null;
  const matrix = currentProject ? determineMatrixPosition(currentProject, currentCompany || undefined) : null;

  const navItems = [
    { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'companies', label: '2. Entreprises', icon: Building2, badge: null },
    { id: 'projects', label: '3. Fiche Projets', icon: FolderKanban, badge: null },
    { id: 'qualification', label: '4. Qualification Initiale', icon: HelpCircle, badge: null },
    { 
      id: 'cir', 
      label: '5. Analyse CIR & Frascati', 
      icon: Microscope, 
      badge: engineering?.isTriggered ? 'Alerte' : null, 
      badgeColor: 'text-amber-700 bg-amber-50' 
    },
    { 
      id: 'cii', 
      label: '6. Analyse CII (Innovation)', 
      icon: Lightbulb, 
      badge: currentCompany && !currentCompany.isPME ? 'Non PME' : null,
      badgeColor: 'text-slate-600 bg-slate-100'
    },
    { 
      id: 'synthesis', 
      label: '7. Synthèse & Matrice', 
      icon: Compass, 
      badge: criticalMissing > 0 ? `${criticalMissing} manquant(s)` : null,
      badgeColor: 'text-rose-700 bg-rose-50'
    },
    { id: 'dynamic', label: '8. Questions Dynamiques', icon: MessageSquareCode, badge: null },
    { 
      id: 'evidence', 
      label: '9. Preuves & Documents', 
      icon: FileCheck2, 
      badge: currentProject ? `${currentProject.evidence.length}` : null,
      badgeColor: 'text-slate-600 bg-slate-100'
    },
    { id: 'export', label: '10. Export du Rapport', icon: FileSpreadsheet, badge: null },
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-slate-300 flex flex-col min-h-[calc(100vh-4rem)] border-r border-slate-800">
      {/* Consultant context card */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-medium">Projet actif</span>
          {matrix && (
            <span className={`text-[11px] font-semibold ${
              matrix.status === 'CIR_POTENTIEL' ? 'text-emerald-400' :
              matrix.status === 'CII_POTENTIEL' ? 'text-sky-400' :
              matrix.status === 'INGENIERIE_CLASSIQUE' ? 'text-amber-400' :
              'text-purple-400'
            }`}>
              {matrix.status === 'CIR_POTENTIEL' ? 'CIR' :
               matrix.status === 'CII_POTENTIEL' ? 'CII' :
               matrix.status === 'INGENIERIE_CLASSIQUE' ? 'Ingénierie' : 'À creuser'}
            </span>
          )}
        </div>
        <p className="text-sm font-semibold text-white truncate" title={currentProject?.name}>
          {currentProject?.name || 'Aucun projet sélectionné'}
        </p>
        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
          <span className="truncate">{currentCompany?.name || 'Sans entreprise'}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums text-slate-300">{currentProject?.analyzedYear}</span>
        </div>

        {/* Engineering warning in sidebar if detected */}
        {engineering?.isTriggered && (
          <div className="mt-3 p-2 bg-amber-950/40 border border-amber-600/40 rounded text-[11px] text-amber-200 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>Signaux d'ingénierie ordinaire détectés.</span>
          </div>
        )}
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Processus d'analyse
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium shrink-0 ${
                  isActive ? 'bg-indigo-700 text-indigo-100' : item.badgeColor
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom disclaimer footer */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
          <span>Aide à la décision</span>
        </div>
        <p className="leading-tight text-slate-400">
          Outil d'aide méthodologique aux audits R&D. Ne constitue pas un rescrit ou un avis fiscal opposable.
        </p>
      </div>
    </aside>
  );
};
