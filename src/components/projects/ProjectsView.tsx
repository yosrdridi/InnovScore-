import React, { useState } from 'react';
import { Project, Company, TeamMember } from '../../types';
import { 
  FolderKanban, 
  Plus, 
  Trash2, 
  Edit3, 
  Users, 
  Calendar, 
  Sparkles, 
  Microscope, 
  Lightbulb, 
  ArrowRight,
  Clock,
  Euro
} from 'lucide-react';
import { determineMatrixPosition, calculateCirScore } from '../../utils/scoring';

interface ProjectsViewProps {
  projects: Project[];
  companies: Company[];
  currentProject: Project | null;
  onSelectProject: (projectId: string) => void;
  onSaveProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onNavigate: (view: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  companies,
  currentProject,
  onSelectProject,
  onSaveProject,
  onDeleteProject,
  onNavigate,
}) => {
  const [editingProject, setEditingProject] = useState<Project | null>(currentProject);
  const [filterCompany, setFilterCompany] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'general' | 'team' | 'technical'>('general');

  const filteredProjects = projects.filter(p => {
    if (filterCompany !== 'all' && p.companyId !== filterCompany) return false;
    return true;
  });

  const handleSelect = (project: Project) => {
    onSelectProject(project.id);
    setEditingProject(project);
  };

  const handleNewProject = () => {
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
      estimatedBudgetKeur: 100,
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
    onSaveProject(newProj);
    onSelectProject(newProj.id);
    setEditingProject(newProj);
  };

  const handleFieldChange = (field: keyof Project, value: any) => {
    if (!editingProject) return;
    const updated = { ...editingProject, [field]: value, lastUpdated: new Date().toISOString().split('T')[0] };
    setEditingProject(updated);
    onSaveProject(updated);
  };

  const addTeamMember = () => {
    if (!editingProject) return;
    const newMember: TeamMember = {
      name: 'Nouveau collaborateur',
      role: 'Ingénieur R&D',
      qualification: 'Ingénieur (Bac+5)',
      etp: 0.5,
      timeSpentHours: 800,
    };
    const updatedTeam = [...editingProject.team, newMember];
    const totalEtp = updatedTeam.reduce((acc, m) => acc + (m.etp || 0), 0);
    const totalHours = updatedTeam.reduce((acc, m) => acc + (m.timeSpentHours || 0), 0);
    handleFieldChange('team', updatedTeam);
    handleFieldChange('totalEtp', Number(totalEtp.toFixed(2)));
    handleFieldChange('totalHours', totalHours);
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, val: any) => {
    if (!editingProject) return;
    const updatedTeam = [...editingProject.team];
    updatedTeam[index] = { ...updatedTeam[index], [field]: val };
    const totalEtp = updatedTeam.reduce((acc, m) => acc + (m.etp || 0), 0);
    const totalHours = updatedTeam.reduce((acc, m) => acc + (m.timeSpentHours || 0), 0);
    handleFieldChange('team', updatedTeam);
    handleFieldChange('totalEtp', Number(totalEtp.toFixed(2)));
    handleFieldChange('totalHours', totalHours);
  };

  const removeTeamMember = (index: number) => {
    if (!editingProject) return;
    const updatedTeam = editingProject.team.filter((_, i) => i !== index);
    const totalEtp = updatedTeam.reduce((acc, m) => acc + (m.etp || 0), 0);
    const totalHours = updatedTeam.reduce((acc, m) => acc + (m.timeSpentHours || 0), 0);
    handleFieldChange('team', updatedTeam);
    handleFieldChange('totalEtp', Number(totalEtp.toFixed(2)));
    handleFieldChange('totalHours', totalHours);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Fiche Projet & Équipe R&D
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Enregistrement des caractéristiques techniques, objectifs, verrous, collaborateurs et temps consacrés pour l'assiette éligible.
          </p>
        </div>
        <button
          onClick={handleNewProject}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-2xs self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un projet</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Projects Selector List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Filtrer par entreprise :</span>
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="text-xs border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">Toutes les entreprises</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            {filteredProjects.map((p) => {
              const comp = companies.find(c => c.id === p.companyId);
              const isSelected = editingProject?.id === p.id;
              const matrix = determineMatrixPosition(p, comp);

              return (
                <div
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/50 border-indigo-500 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">
                      {p.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500 font-semibold shrink-0">
                      {p.analyzedYear}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1 truncate">
                    {comp?.name || 'Entreprise non définie'}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[11px]">
                    <span className={`font-semibold ${
                      matrix.status === 'CIR_POTENTIEL' ? 'text-emerald-700' :
                      matrix.status === 'CII_POTENTIEL' ? 'text-sky-700' :
                      matrix.status === 'INGENIERIE_CLASSIQUE' ? 'text-amber-700' :
                      'text-purple-700'
                    }`}>
                      {matrix.label}
                    </span>
                    <span className="text-slate-400 font-mono tabular-nums">
                      {p.team.length} pers. · {p.totalEtp} ETP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Project Details & Editor */}
        <div className="lg:col-span-8 space-y-4">
          {editingProject ? (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              {/* Top Editor Header */}
              <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/40">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {editingProject.name}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>Dernière mise à jour : <span className="font-mono">{editingProject.lastUpdated}</span></span>
                    <span>·</span>
                    <span className="text-indigo-600 font-medium">Assiette R&D : {editingProject.totalEtp} ETP</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('qualification')}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Questionnaire éligibilité</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Supprimer le projet "${editingProject.name}" ?`)) {
                        onDeleteProject(editingProject.id);
                        setEditingProject(null);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="Supprimer le projet"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sub-tabs for detailed info */}
              <div className="flex border-b border-slate-200 px-5 gap-6 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`py-3 border-b-2 transition-colors ${
                    activeTab === 'general'
                      ? 'border-indigo-600 text-indigo-600 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Général & Contexte
                </button>
                <button
                  onClick={() => setActiveTab('technical')}
                  className={`py-3 border-b-2 transition-colors ${
                    activeTab === 'technical'
                      ? 'border-indigo-600 text-indigo-600 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Objectifs, Verrous & Technologies
                </button>
                <button
                  onClick={() => setActiveTab('team')}
                  className={`py-3 border-b-2 transition-colors ${
                    activeTab === 'team'
                      ? 'border-indigo-600 text-indigo-600 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Équipe, ETP & Qualifications ({editingProject.team.length})
                </button>
              </div>

              <div className="p-5 text-xs space-y-5">
                {activeTab === 'general' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium text-slate-700 mb-1">Nom du projet *</label>
                        <input
                          type="text"
                          value={editingProject.name}
                          onChange={(e) => handleFieldChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-700 mb-1">Entreprise déclarante *</label>
                        <select
                          value={editingProject.companyId}
                          onChange={(e) => handleFieldChange('companyId', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                        >
                          {companies.map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({c.isPME ? 'PME' : 'ETI/GE'})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-medium text-slate-700 mb-1">Année fiscale analysée</label>
                        <input
                          type="number"
                          value={editingProject.analyzedYear}
                          onChange={(e) => handleFieldChange('analyzedYear', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-700 mb-1">Date début des travaux</label>
                        <input
                          type="date"
                          value={editingProject.startDate}
                          onChange={(e) => handleFieldChange('startDate', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-700 mb-1">Date fin prévisionnelle</label>
                        <input
                          type="date"
                          value={editingProject.endDate}
                          onChange={(e) => handleFieldChange('endDate', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Responsable scientifique ou technique du projet</label>
                      <input
                        type="text"
                        value={editingProject.projectLeader}
                        onChange={(e) => handleFieldChange('projectLeader', e.target.value)}
                        placeholder="Ex: Dr. Martin Dupont (Docteur en informatique)"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Description générale du projet</label>
                      <textarea
                        rows={3}
                        value={editingProject.generalDescription}
                        onChange={(e) => handleFieldChange('generalDescription', e.target.value)}
                        placeholder="Présentation synthétique du projet, de ses enjeux et de la rupture recherchée..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Contexte amont & Problématique initiale</label>
                      <textarea
                        rows={3}
                        value={editingProject.context}
                        onChange={(e) => handleFieldChange('context', e.target.value)}
                        placeholder="Pourquoi l'entreprise a-t-elle lancé ce projet ? Quelles limites physiques ou logicielles bloquaient l'équipe ?"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'technical' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Objectifs techniques et scientifiques quantifiés</label>
                      <textarea
                        rows={3}
                        value={editingProject.objectives}
                        onChange={(e) => handleFieldChange('objectives', e.target.value)}
                        placeholder="Objectifs chiffrés à atteindre (débit, latence, précision, résistance, etc.)..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Technologies, langages, solveurs & équipements utilisés</label>
                      <input
                        type="text"
                        value={editingProject.technologiesUsed}
                        onChange={(e) => handleFieldChange('technologiesUsed', e.target.value)}
                        placeholder="Ex: C++20, Gurobi, PyTorch, Banc d'essais COFRAC..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">État de l’art connu & solutions étudiées</label>
                      <textarea
                        rows={3}
                        value={editingProject.stateOfTheArtKnown}
                        onChange={(e) => handleFieldChange('stateOfTheArtKnown', e.target.value)}
                        placeholder="Publications, brevets ou solutions de marché étudiés et leurs limites démontrées..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Difficultés & verrous techniques rencontrés</label>
                      <textarea
                        rows={3}
                        value={editingProject.difficultiesEncountered}
                        onChange={(e) => handleFieldChange('difficultiesEncountered', e.target.value)}
                        placeholder="Pourquoi les solutions existantes ne permettaient pas de résoudre le problème simplement ?"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium text-slate-700 mb-1">Travaux & Démarche expérimentale</label>
                        <textarea
                          rows={3}
                          value={editingProject.worksRealized}
                          onChange={(e) => handleFieldChange('worksRealized', e.target.value)}
                          placeholder="Hypothèses formulées, plans d'expériences, simulations, itérations..."
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-700 mb-1">Résultats obtenus & Nouvelles connaissances</label>
                        <textarea
                          rows={3}
                          value={editingProject.results}
                          onChange={(e) => handleFieldChange('results', e.target.value)}
                          placeholder="Mesures chiffrées obtenues, levée des incertitudes, reproductibilité..."
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'team' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs">
                        <span>Total ETP R&D affecté : <strong className="font-mono tabular-nums text-indigo-600">{editingProject.totalEtp} ETP</strong></span>
                        <span>Total Heures : <strong className="font-mono tabular-nums text-slate-800">{editingProject.totalHours} h</strong></span>
                        <span>Budget estimé : <strong className="font-mono tabular-nums text-slate-800">{editingProject.estimatedBudgetKeur} k€</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={addTeamMember}
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ajouter un membre</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {editingProject.team.map((member, index) => (
                        <div key={index} className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center gap-3">
                          <div className="w-full sm:w-1/4">
                            <label className="block text-[10px] text-slate-500">Nom & Prénom</label>
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                              className="w-full px-2 py-1 border border-slate-300 rounded"
                            />
                          </div>
                          <div className="w-full sm:w-1/4">
                            <label className="block text-[10px] text-slate-500">Rôle dans le projet</label>
                            <input
                              type="text"
                              value={member.role}
                              onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                              className="w-full px-2 py-1 border border-slate-300 rounded"
                            />
                          </div>
                          <div className="w-full sm:w-1/4">
                            <label className="block text-[10px] text-slate-500">Diplôme / Qualification</label>
                            <select
                              value={member.qualification}
                              onChange={(e) => updateTeamMember(index, 'qualification', e.target.value)}
                              className="w-full px-2 py-1 border border-slate-300 rounded bg-white text-xs"
                            >
                              <option value="Doctorat / PhD">Doctorat / PhD (Jeune docteur possible)</option>
                              <option value="Ingénieur (Bac+5)">Ingénieur (Bac+5)</option>
                              <option value="Master R&D">Master R&D</option>
                              <option value="Technicien">Technicien R&D</option>
                              <option value="Autre">Autre</option>
                            </select>
                          </div>
                          <div className="w-full sm:w-1/6 flex items-center gap-2">
                            <div>
                              <label className="block text-[10px] text-slate-500">ETP</label>
                              <input
                                type="number"
                                step="0.1"
                                min={0}
                                max={1}
                                value={member.etp}
                                onChange={(e) => updateTeamMember(index, 'etp', Number(e.target.value))}
                                className="w-full px-2 py-1 border border-slate-300 rounded font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-500">Heures</label>
                              <input
                                type="number"
                                min={0}
                                value={member.timeSpentHours || 0}
                                onChange={(e) => updateTeamMember(index, 'timeSpentHours', Number(e.target.value))}
                                className="w-full px-2 py-1 border border-slate-300 rounded font-mono"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeTeamMember(index)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded self-end sm:self-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {editingProject.team.length === 0 && (
                        <div className="text-center py-6 text-slate-400 border border-dashed border-slate-200 rounded-lg">
                          Aucun collaborateur rattaché pour le moment.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
              <FolderKanban className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p>Sélectionnez un projet dans la colonne de gauche ou créez-en un nouveau.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
