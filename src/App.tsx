/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Company, Project } from './types';
import { INITIAL_COMPANIES, INITIAL_PROJECTS } from './data/defaultData';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { CompaniesView } from './components/companies/CompaniesView';
import { ProjectsView } from './components/projects/ProjectsView';
import { QualificationView } from './components/qualification/QualificationView';
import { CirAnalysisView } from './components/cir/CirAnalysisView';
import { CiiAnalysisView } from './components/cii/CiiAnalysisView';
import { SynthesisView } from './components/synthesis/SynthesisView';
import { DynamicQuestionsView } from './components/dynamicQuestions/DynamicQuestionsView';
import { EvidenceView } from './components/evidence/EvidenceView';
import { ExportView } from './components/export/ExportView';

export default function App() {
  // State for companies and projects with localStorage persistence
  const [companies, setCompanies] = useState<Company[]>(() => {
    try {
      const saved = localStorage.getItem('eligibilis_companies_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading companies from localStorage', e);
    }
    return INITIAL_COMPANIES;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('eligibilis_projects_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading projects from localStorage', e);
    }
    return INITIAL_PROJECTS;
  });

  const [currentProjectId, setCurrentProjectId] = useState<string>(() => {
    return projects[0]?.id || '';
  });

  const [activeView, setActiveView] = useState<string>('dashboard');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('eligibilis_companies_v1', JSON.stringify(companies));
    } catch (e) {
      console.error('Failed to save companies to localStorage', e);
    }
  }, [companies]);

  useEffect(() => {
    try {
      localStorage.setItem('eligibilis_projects_v1', JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage', e);
    }
  }, [projects]);

  // Derived active items
  const currentProject = projects.find(p => p.id === currentProjectId) || projects[0] || null;
  const currentCompany = currentProject
    ? companies.find(c => c.id === currentProject.companyId) || null
    : null;

  // Handlers
  const handleSaveCompany = (updatedCompany: Company) => {
    setCompanies(prev => {
      const exists = prev.some(c => c.id === updatedCompany.id);
      if (exists) {
        return prev.map(c => (c.id === updatedCompany.id ? updatedCompany : c));
      }
      return [...prev, updatedCompany];
    });
  };

  const handleDeleteCompany = (companyId: string) => {
    setCompanies(prev => prev.filter(c => c.id !== companyId));
  };

  const handleSaveProject = (updatedProject: Project) => {
    setProjects(prev => {
      const exists = prev.some(p => p.id === updatedProject.id);
      if (exists) {
        return prev.map(p => (p.id === updatedProject.id ? updatedProject : p));
      }
      return [...prev, updatedProject];
    });
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== projectId);
      if (currentProjectId === projectId) {
        setCurrentProjectId(updated[0]?.id || '');
      }
      return updated;
    });
  };

  const handleImportData = (data: { projects: Project[]; companies: Company[] }) => {
    if (data.companies && data.companies.length > 0) setCompanies(data.companies);
    if (data.projects && data.projects.length > 0) {
      setProjects(data.projects);
      setCurrentProjectId(data.projects[0].id);
    }
  };

  const handleCreateNewProject = () => {
    const defaultCompany = companies[0]?.id || 'comp_1';
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      companyId: defaultCompany,
      name: 'Nouveau projet R&D / Innovation',
      analyzedYear: new Date().getFullYear(),
      projectLeader: '',
      startDate: `${new Date().getFullYear()}-01-01`,
      endDate: `${new Date().getFullYear()}-12-31`,
      totalEtp: 1.0,
      totalHours: 1600,
      estimatedBudgetKeur: 80,
      team: [],
      generalDescription: '',
      context: '',
      objectives: '',
      technologiesUsed: '',
      stateOfTheArtKnown: '',
      difficultiesEncountered: '',
      worksRealized: '',
      experimentations: '',
      results: '',
      qualProblemSolved: '',
      qualWhyExistingFailed: '',
      qualPredictabilityAtStart: '',
      qualHypothesesTested: '',
      qualFailedSolutionsAbandoned: '',
      qualKnowledgeAcquired: '',
      qualOpenUncertaintiesRemaining: '',
      lastUpdated: new Date().toISOString().split('T')[0],
      cirDimensions: {
        stateOfArtScore: 2,
        stateOfArtDetails: '',
        studiedSources: '',
        whyExistingInsufficient: '',
        difficultyContext: 'objective_etat_art',
        scientificLockScore: 2,
        scientificLockDetails: '',
        lockNature: 'ingenierie',
        uncertaintyScore: 2,
        uncertaintyDetails: '',
        experimentalScore: 2,
        experimentalDetails: '',
        hypothesesFormulated: '',
        failedAttempts: '',
        iterationsCount: 2,
        newKnowledgeScore: 2,
        newKnowledgeDetails: '',
        reproducibilityGuaranteed: true,
      },
      frascatiCriteria: {
        novelty: { score: 2, definition: 'Viser l’acquisition de connaissances nouvelles.', supportingElements: '', weakeningElements: '', missingInformation: '' },
        creativity: { score: 2, definition: 'Concepts ou hypothèses originales.', supportingElements: '', weakeningElements: '', missingInformation: '' },
        uncertainty: { score: 2, definition: 'Résultat non prévisible.', supportingElements: '', weakeningElements: '', missingInformation: '' },
        systematicity: { score: 2, definition: 'Démarche organisée et planifiée.', supportingElements: '', weakeningElements: '', missingInformation: '' },
        transferability: { score: 2, definition: 'Résultats documentés et reproductibles.', supportingElements: '', weakeningElements: '', missingInformation: '' },
      },
      classicEngineering: {
        detectedFlags: [],
        customEngineeringObservation: '',
        isTriggered: false,
      },
      ciiAnalysis: {
        isPmeEligible: true,
        developedProduct: '',
        productType: 'bien_immateriel_logiciel',
        targetUserPopulation: '',
        competitorsIdentified: '',
        relevantMarketDescription: '',
        technicalPerformances: { productPerf: '', competitorPerf: '', differenceNoted: '', proofsAvailable: '', score: 1 },
        functionalities: { productPerf: '', competitorPerf: '', differenceNoted: '', proofsAvailable: '', score: 1 },
        ergonomics: { productPerf: '', competitorPerf: '', differenceNoted: '', proofsAvailable: '', score: 1 },
        ecodesign: { productPerf: '', competitorPerf: '', differenceNoted: '', proofsAvailable: '', score: 0 },
        prototypesDeveloped: '',
        mvpAndDemonstrators: '',
        userTestsConducted: '',
        pilotInstallations: '',
        overallScore: 1.5,
      },
      dynamicAnswers: [],
      evidence: [],
    };
    handleSaveProject(newProj);
    setCurrentProjectId(newProj.id);
    setActiveView('projects');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Top Bar with Zone 1 wordmark, Zone 2 links, Zone 3 project selector */}
      <Navbar
        currentProject={currentProject}
        currentCompany={currentCompany}
        projects={projects}
        companies={companies}
        onSelectProject={(id) => setCurrentProjectId(id)}
        onNavigate={(view) => setActiveView(view)}
        activeView={activeView}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (hidden in print mode) */}
        <div className="no-print">
          <Sidebar
            activeView={activeView}
            onNavigate={(view) => setActiveView(view)}
            currentProject={currentProject}
            currentCompany={currentCompany}
          />
        </div>

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {activeView === 'dashboard' && (
            <DashboardView
              projects={projects}
              companies={companies}
              currentProject={currentProject}
              onSelectProject={(id) => setCurrentProjectId(id)}
              onNavigate={(view) => setActiveView(view)}
              onNewProject={handleCreateNewProject}
            />
          )}

          {activeView === 'companies' && (
            <CompaniesView
              companies={companies}
              projects={projects}
              onSaveCompany={handleSaveCompany}
              onDeleteCompany={handleDeleteCompany}
              onSelectCompany={() => {}}
            />
          )}

          {activeView === 'projects' && (
            <ProjectsView
              projects={projects}
              companies={companies}
              currentProject={currentProject}
              onSelectProject={(id) => setCurrentProjectId(id)}
              onSaveProject={handleSaveProject}
              onDeleteProject={handleDeleteProject}
              onNavigate={(view) => setActiveView(view)}
            />
          )}

          {activeView === 'qualification' && (
            <QualificationView
              currentProject={currentProject}
              onSaveProject={handleSaveProject}
              onNavigate={(view) => setActiveView(view)}
            />
          )}

          {activeView === 'cir' && (
            <CirAnalysisView
              currentProject={currentProject}
              onSaveProject={handleSaveProject}
              onNavigate={(view) => setActiveView(view)}
            />
          )}

          {activeView === 'cii' && (
            <CiiAnalysisView
              currentProject={currentProject}
              currentCompany={currentCompany}
              onSaveProject={handleSaveProject}
              onNavigate={(view) => setActiveView(view)}
            />
          )}

          {activeView === 'synthesis' && (
            <SynthesisView
              currentProject={currentProject}
              currentCompany={currentCompany}
              onNavigate={(view) => setActiveView(view)}
            />
          )}

          {activeView === 'dynamic' && (
            <DynamicQuestionsView
              currentProject={currentProject}
              onSaveProject={handleSaveProject}
              onNavigate={(view) => setActiveView(view)}
            />
          )}

          {activeView === 'evidence' && (
            <EvidenceView
              currentProject={currentProject}
              onSaveProject={handleSaveProject}
              onNavigate={(view) => setActiveView(view)}
            />
          )}

          {activeView === 'export' && (
            <ExportView
              currentProject={currentProject}
              currentCompany={currentCompany}
              allProjects={projects}
              allCompanies={companies}
              onImportData={handleImportData}
            />
          )}
        </main>
      </div>
    </div>
  );
}
