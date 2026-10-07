export type CompanySize = 'PME' | 'ETI' | 'GE';

export interface Company {
  id: string;
  name: string;
  siren: string;
  sector: string;
  headcount: number;
  turnoverMillion: number;
  balanceSheetTotalMillion: number;
  isPME: boolean; // Must be < 250 headcount and turnover <= 50M€ or balance sheet <= 43M€, and independent (<25% held by non-PME)
  independenceVerified: boolean;
  contactName: string;
  contactEmail: string;
}

export type QualificationStatus = 'CIR_POTENTIEL' | 'CII_POTENTIEL' | 'INGENIERIE_CLASSIQUE' | 'A_APPROFONDIR';

export type CIRPotentialLevel = 'Très faible' | 'Faible' | 'À approfondir' | 'Modéré' | 'Fort';
export type CIIPotentialLevel = 'Inéligible (Non PME)' | 'Très faible' | 'Faible' | 'À approfondir' | 'Modéré' | 'Fort';
export type ConfidenceLevel = 'Faible' | 'Moyenne' | 'Élevée';

export interface TeamMember {
  name: string;
  role: string;
  qualification: 'Doctorat / PhD' | 'Ingénieur (Bac+5)' | 'Master R&D' | 'Technicien' | 'Autre';
  etp: number;
  timeSpentHours?: number;
}

export interface FrascatiCriterion {
  score: number; // 0 to 4
  definition: string;
  supportingElements: string;
  weakeningElements: string;
  missingInformation: string;
}

export interface CirDimensions {
  // A. État de l'art (0-4)
  stateOfArtScore: number;
  stateOfArtDetails: string;
  studiedSources: string; // publications, brevets, outils étudiés
  whyExistingInsufficient: string;
  difficultyContext: 'interne' | 'objective_etat_art';

  // B. Verrou scientifique ou technique (0-4)
  scientificLockScore: number;
  scientificLockDetails: string;
  lockNature: 'courant' | 'integration' | 'organisation' | 'ingenierie' | 'verrou_r_et_d';

  // C. Incertitude (0-4)
  uncertaintyScore: number;
  uncertaintyDetails: string;

  // D. Démarche expérimentale (0-4)
  experimentalScore: number;
  experimentalDetails: string;
  hypothesesFormulated: string;
  failedAttempts: string;
  iterationsCount: number;

  // E. Production de connaissances nouvelles (0-4)
  newKnowledgeScore: number;
  newKnowledgeDetails: string;
  reproducibilityGuaranteed: boolean;
}

export interface ClassicEngineeringDetection {
  detectedFlags: string[];
  customEngineeringObservation: string;
  isTriggered: boolean;
}

export interface CiiInnovationAxis {
  productPerf: string;
  competitorPerf: string;
  differenceNoted: string;
  proofsAvailable: string;
  score: number; // 0 to 4
}

export interface CiiAnalysis {
  isPmeEligible: boolean;
  developedProduct: string;
  productType: 'bien_materiel' | 'bien_immateriel_logiciel';
  targetUserPopulation: string;
  
  // Market
  competitorsIdentified: string;
  relevantMarketDescription: string;
  
  // 4 Axes of New Character
  technicalPerformances: CiiInnovationAxis;
  functionalities: CiiInnovationAxis;
  ergonomics: CiiInnovationAxis;
  ecodesign: CiiInnovationAxis;
  
  // Prototype & Pilot
  prototypesDeveloped: string;
  mvpAndDemonstrators: string;
  userTestsConducted: string;
  pilotInstallations: string;
  overallScore: number;
}

export type EvidenceType = 
  | 'documentation_technique'
  | 'rapport_essais'
  | 'benchmark'
  | 'publication_scientifique'
  | 'graphique'
  | 'ticket_jira'
  | 'git_commits'
  | 'prototype'
  | 'cahier_laboratoire'
  | 'compte_rendu'
  | 'feuilles_temps';

export interface EvidenceItem {
  id: string;
  title: string;
  type: EvidenceType;
  date: string;
  author: string;
  description: string;
  linkedAspect: 'etat_art' | 'verrou' | 'incertitude' | 'experimentation' | 'resultats' | 'cii_perfs' | 'prototypes';
  probativeStrength: 'Faible' | 'Moyenne' | 'Élevée';
  referenceOrUrl?: string;
}

export interface DynamicQuestionAnswer {
  id: string;
  theme: string;
  claim: string;
  questions: {
    question: string;
    answer: string;
  }[];
}

export interface Project {
  id: string;
  companyId: string;
  name: string;
  analyzedYear: number;
  projectLeader: string;
  team: TeamMember[];
  startDate: string;
  endDate: string;
  
  // General Info
  generalDescription: string;
  context: string;
  objectives: string;
  technologiesUsed: string;
  stateOfTheArtKnown: string;
  difficultiesEncountered: string;
  worksRealized: string;
  experimentations: string;
  results: string;
  
  // Qualification questions
  qualProblemSolved: string;
  qualWhyExistingFailed: string;
  qualPredictabilityAtStart: string;
  qualHypothesesTested: string;
  qualFailedSolutionsAbandoned: string;
  qualKnowledgeAcquired: string;
  qualOpenUncertaintiesRemaining: string;

  // CIR Analysis
  cirDimensions: CirDimensions;
  frascatiCriteria: {
    novelty: FrascatiCriterion;
    creativity: FrascatiCriterion;
    uncertainty: FrascatiCriterion;
    systematicity: FrascatiCriterion;
    transferability: FrascatiCriterion;
  };
  classicEngineering: ClassicEngineeringDetection;

  // CII Analysis
  ciiAnalysis: CiiAnalysis;

  // Dynamic Drill-Down QA
  dynamicAnswers: DynamicQuestionAnswer[];

  // Evidence
  evidence: EvidenceItem[];

  // Time & Budget
  totalEtp: number;
  totalHours: number;
  estimatedBudgetKeur: number;

  lastUpdated: string;
}

export interface MissingInfoItem {
  category: 'État de l\'art' | 'Verrous & Incertitude' | 'Démarche expérimentale' | 'Résultats & Données' | 'Marché CII' | 'Preuves documentaires';
  issue: string;
  actionRequired: string;
  priority: 'Critique' | 'Moyenne' | 'Recommandée';
}

export interface AuditRecommendation {
  title: string;
  description: string;
  riskLevel: 'Élevé' | 'Modéré' | 'Faible';
}
