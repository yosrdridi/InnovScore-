import React from 'react';
import { Project, Company } from '../../types';
import { Printer, Download, Sparkles, Building2, FolderGit2 } from 'lucide-react';

interface NavbarProps {
  currentProject: Project | null;
  currentCompany: Company | null;
  projects: Project[];
  companies: Company[];
  onSelectProject: (projectId: string) => void;
  onNavigate: (view: string) => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProject,
  currentCompany,
  projects,
  companies,
  onSelectProject,
  onNavigate,
  activeView,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-6">
        <a 
          href="#dashboard" 
          onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }} 
          className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2 hover:text-indigo-600 transition-colors"
        >
          <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold shadow-xs">
            IS
          </span>
          <span className="text-slate-900 font-bold tracking-tight">InnovScore</span>
        </a>

        {/* Quiet context breadcrumb */}
        {currentProject && (
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 border-l border-slate-200 pl-4 py-1">
            <span className="text-slate-600 flex items-center gap-1 font-medium truncate max-w-[160px]">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {currentCompany?.name || 'Entreprise'}
            </span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold truncate max-w-[260px]">
              {currentProject.name}
            </span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span className="font-mono text-slate-500 tabular-nums">FY{currentProject.analyzedYear}</span>
          </div>
        )}
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-600">
        <button 
          onClick={() => onNavigate('dashboard')} 
          className={`hover:text-slate-900 transition-colors ${activeView === 'dashboard' ? 'text-indigo-600 font-semibold' : ''}`}
        >
          Tableau de bord
        </button>
        <button 
          onClick={() => onNavigate('cir')} 
          className={`hover:text-slate-900 transition-colors ${activeView === 'cir' ? 'text-indigo-600 font-semibold' : ''}`}
        >
          Grille CIR
        </button>
        <button 
          onClick={() => onNavigate('cii')} 
          className={`hover:text-slate-900 transition-colors ${activeView === 'cii' ? 'text-indigo-600 font-semibold' : ''}`}
        >
          Grille CII
        </button>
        <button 
          onClick={() => onNavigate('synthesis')} 
          className={`hover:text-slate-900 transition-colors ${activeView === 'synthesis' ? 'text-indigo-600 font-semibold' : ''}`}
        >
          Matrice & Synthèse
        </button>
        <button 
          onClick={() => onNavigate('evidence')} 
          className={`hover:text-slate-900 transition-colors ${activeView === 'evidence' ? 'text-indigo-600 font-semibold' : ''}`}
        >
          Preuves d'audit
        </button>
      </nav>

      {/* Zone 3: Project Selector & Actions */}
      <div className="flex items-center gap-3">
        {/* Project Selector dropdown */}
        <div className="flex items-center">
          <label htmlFor="project-select" className="sr-only">Sélectionner un projet</label>
          <div className="relative">
            <select
              id="project-select"
              value={currentProject?.id || ''}
              onChange={(e) => onSelectProject(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg px-3 py-2 pr-7 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[220px] truncate"
            >
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.name} ({proj.analyzedYear})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => onNavigate('export')}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          title="Exporter le rapport d'analyse"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Rapport d'audit</span>
        </button>
      </div>
    </header>
  );
};
