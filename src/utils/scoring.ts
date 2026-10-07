import {
  Project,
  Company,
  CIRPotentialLevel,
  CIIPotentialLevel,
  ConfidenceLevel,
  QualificationStatus,
  MissingInfoItem,
  AuditRecommendation,
} from '../types';

export const CLASSICAL_ENGINEERING_SIGNALS = [
  { id: 'dev_standard', label: 'Développement logiciel standard', keywords: ['crud', 'développement logiciel', 'standard', 'framework standard', 'site web'] },
  { id: 'api_integration', label: 'Intégration d’API / Webhooks', keywords: ['api', 'intégration api', 'connecteur', 'webhook', 'rest api', 'soap'] },
  { id: 'migration', label: 'Migration de données ou de versions', keywords: ['migration', 'montée de version', 'portage', 'upgrade'] },
  { id: 'infra_change', label: 'Changement d’infrastructure / Cloud', keywords: ['infrastructure', 'cloud', 'aws', 'azure', 'docker', 'kubernetes', 'serveur'] },
  { id: 'software_config', label: 'Paramétrage logiciel / CRM / ERP', keywords: ['paramétrage', 'configuration', 'salesforce', 'odoo', 'sap', 'erp', 'crm'] },
  { id: 'refactoring', label: 'Refactoring ou nettoyage de code', keywords: ['refactoring', 'nettoyage', 'dette technique', 'réécriture simple'] },
  { id: 'maintenance', label: 'Maintenance corrective ou évolutive', keywords: ['maintenance', 'patch', 'maintien en condition'] },
  { id: 'routine_opt', label: 'Optimisation courante', keywords: ['optimisation courante', 'indexation base', 'cache redis', 'vitesse'] },
  { id: 'bug_fixing', label: 'Correction de bugs', keywords: ['correction bugs', 'ticket support', 'anomalie', 'hotfix'] },
  { id: 'ui_creation', label: 'Création d’interfaces / Maquettage UX', keywords: ['création d’interfaces', 'maquette', 'figma', 'ui/ux', 'front-end simple', 'css'] },
  { id: 'automation_standard', label: 'Automatisation standard de processus', keywords: ['automatisation standard', 'script bash', 'cron', 'rpa standard'] },
  { id: 'solution_adaptation', label: 'Adaptation d’une solution existante', keywords: ['adaptation', 'module standard', 'plugin'] },
  { id: 'compliance', label: 'Mise en conformité réglementaire standard', keywords: ['mise en conformité', 'rgpd', 'norme standard'] },
  { id: 'deployment', label: 'Déploiement et chaîne CI/CD classique', keywords: ['déploiement', 'ci/cd', 'github actions', 'jenkins standard'] },
  { id: 'industrialisation', label: 'Industrialisation standard', keywords: ['industrialisation', 'recette', 'mise en prod'] },
];

export function detectClassicalEngineering(project: Project): {
  detectedSignals: string[];
  isTriggered: boolean;
  scoreEngineering: number;
} {
  const combinedText = `
    ${project.generalDescription || ''}
    ${project.objectives || ''}
    ${project.technologiesUsed || ''}
    ${project.worksRealized || ''}
    ${project.difficultiesEncountered || ''}
    ${project.cirDimensions.scientificLockDetails || ''}
  `.toLowerCase();

  const detectedSignals: string[] = [];

  // Check automated keyword occurrence
  for (const signal of CLASSICAL_ENGINEERING_SIGNALS) {
    const hasManual = project.classicEngineering?.detectedFlags?.includes(signal.id);
    const hasKeyword = signal.keywords.some(kw => combinedText.includes(kw));
    if (hasManual || hasKeyword) {
      detectedSignals.push(signal.id);
    }
  }

  // Also include any user-selected flags
  if (project.classicEngineering?.detectedFlags) {
    for (const flag of project.classicEngineering.detectedFlags) {
      if (!detectedSignals.includes(flag)) {
        detectedSignals.push(flag);
      }
    }
  }

  const isTriggered = detectedSignals.length >= 2 || 
    (project.cirDimensions.scientificLockScore <= 1 && detectedSignals.length >= 1) ||
    project.cirDimensions.lockNature === 'ingenierie' ||
    project.cirDimensions.lockNature === 'courant';

  const scoreEngineering = Math.min(4, Math.round((detectedSignals.length / 3) * 4));

  return {
    detectedSignals,
    isTriggered,
    scoreEngineering,
  };
}

export function calculateCirScore(project: Project): {
  dimensionsAverage: number; // /4
  frascatiAverage: number; // /4
  globalCirScore: number; // /4
  potentialLevel: CIRPotentialLevel;
  breakdown: Record<string, number>;
} {
  const cd = project.cirDimensions;
  const fc = project.frascatiCriteria;

  const dimAvg = (
    cd.stateOfArtScore +
    cd.scientificLockScore +
    cd.uncertaintyScore +
    cd.experimentalScore +
    cd.newKnowledgeScore
  ) / 5;

  const frascatiAvg = (
    fc.novelty.score +
    fc.creativity.score +
    fc.uncertainty.score +
    fc.systematicity.score +
    fc.transferability.score
  ) / 5;

  // Global weighted CIR score
  // Note: Scientific lock and uncertainty are eliminatory in French tax jurisprudence (Conseil d'État & Guide du CIR)
  let penalty = 0;
  if (cd.scientificLockScore <= 1) penalty += 0.8;
  if (cd.stateOfArtScore === 0) penalty += 0.5;
  if (cd.experimentalScore <= 1) penalty += 0.5;

  const globalCirScore = Math.max(0, Math.min(4, ((dimAvg * 0.55) + (frascatiAvg * 0.45)) - penalty));

  let potentialLevel: CIRPotentialLevel = 'À approfondir';
  if (globalCirScore >= 3.0 && cd.scientificLockScore >= 3 && cd.experimentalScore >= 3) {
    potentialLevel = 'Fort';
  } else if (globalCirScore >= 2.2 && cd.scientificLockScore >= 2) {
    potentialLevel = 'Modéré';
  } else if (globalCirScore >= 1.4) {
    potentialLevel = 'À approfondir';
  } else if (globalCirScore >= 0.8) {
    potentialLevel = 'Faible';
  } else {
    potentialLevel = 'Très faible';
  }

  return {
    dimensionsAverage: Number(dimAvg.toFixed(2)),
    frascatiAverage: Number(frascatiAvg.toFixed(2)),
    globalCirScore: Number(globalCirScore.toFixed(2)),
    potentialLevel,
    breakdown: {
      etatArt: cd.stateOfArtScore,
      verrou: cd.scientificLockScore,
      incertitude: cd.uncertaintyScore,
      demarche: cd.experimentalScore,
      connaissances: cd.newKnowledgeScore,
      frascatiNouveaute: fc.novelty.score,
      frascatiCreativite: fc.creativity.score,
      frascatiIncertitude: fc.uncertainty.score,
      frascatiSystematicite: fc.systematicity.score,
      frascatiTransferabilite: fc.transferability.score,
    },
  };
}

export function calculateCiiScore(project: Project, company?: Company): {
  isPmeEligible: boolean;
  scoreInnovation: number; // /4
  potentialLevel: CIIPotentialLevel;
  hasPrototypes: boolean;
} {
  const cii = project.ciiAnalysis;
  const isPme = company ? company.isPME : cii.isPmeEligible;

  if (!isPme) {
    return {
      isPmeEligible: false,
      scoreInnovation: 0,
      potentialLevel: 'Inéligible (Non PME)',
      hasPrototypes: false,
    };
  }

  // Average of 4 axes (0-4)
  const axesScores = [
    cii.technicalPerformances.score,
    cii.functionalities.score,
    cii.ergonomics.score,
    cii.ecodesign.score,
  ];
  
  // CII requires superiority on at least one axis compared to competitors
  const maxAxisScore = Math.max(...axesScores);
  const avgAxesScore = axesScores.reduce((a, b) => a + b, 0) / 4;

  const hasPrototypes = Boolean(
    cii.prototypesDeveloped?.trim() ||
    cii.mvpAndDemonstrators?.trim() ||
    cii.pilotInstallations?.trim()
  );

  let scoreInnovation = (maxAxisScore * 0.6) + (avgAxesScore * 0.4);
  if (!hasPrototypes) scoreInnovation *= 0.6; // Prototypes/pilots are legally required for CII!

  let potentialLevel: CIIPotentialLevel = 'À approfondir';
  if (maxAxisScore >= 3 && hasPrototypes && cii.competitorsIdentified) {
    potentialLevel = 'Fort';
  } else if (maxAxisScore >= 2 && hasPrototypes) {
    potentialLevel = 'Modéré';
  } else if (maxAxisScore >= 1) {
    potentialLevel = 'À approfondir';
  } else {
    potentialLevel = 'Faible';
  }

  return {
    isPmeEligible: true,
    scoreInnovation: Number(scoreInnovation.toFixed(2)),
    potentialLevel,
    hasPrototypes,
  };
}

export function determineMatrixPosition(
  project: Project,
  company?: Company
): {
  status: QualificationStatus;
  label: string;
  rationale: string;
} {
  const cir = calculateCirScore(project);
  const cii = calculateCiiScore(project, company);
  const engineering = detectClassicalEngineering(project);

  // Check completeness first
  const hasMinInfo = 
    project.generalDescription?.length > 40 &&
    project.worksRealized?.length > 40 &&
    (project.cirDimensions.scientificLockDetails?.length > 20 || project.difficultiesEncountered?.length > 20);

  if (!hasMinInfo) {
    return {
      status: 'A_APPROFONDIR',
      label: 'À approfondir',
      rationale: 'Informations descriptives insuffisantes pour statuer de manière sécurisée. Des éléments clés manquent sur les verrous et la démarche.',
    };
  }

  // Strong CIR: High lock, experimental approach, uncertainty
  if (
    project.cirDimensions.scientificLockScore >= 3 &&
    project.cirDimensions.experimentalScore >= 2 &&
    project.cirDimensions.stateOfArtScore >= 2
  ) {
    return {
      status: 'CIR_POTENTIEL',
      label: 'CIR potentiel (R&D)',
      rationale: 'Forte incertitude scientifique ou technique, démarche expérimentale structurée et volonté avérée de dépassement de l’état des connaissances.',
    };
  }

  // Classical engineering dominance
  if (
    engineering.isTriggered &&
    project.cirDimensions.scientificLockScore <= 1 &&
    project.cirDimensions.experimentalScore <= 1
  ) {
    return {
      status: 'INGENIERIE_CLASSIQUE',
      label: 'Ingénierie classique',
      rationale: 'Les travaux relèvent de la mise en œuvre de solutions connues, d’intégration d’outils ou d’optimisations standard sans verrou R&D.',
    };
  }

  // CII: Product innovation superiority over market without R&D lock
  if (
    cii.isPmeEligible &&
    (cii.potentialLevel === 'Fort' || cii.potentialLevel === 'Modéré') &&
    project.cirDimensions.scientificLockScore < 3
  ) {
    return {
      status: 'CII_POTENTIEL',
      label: 'CII potentiel (Innovation Produit)',
      rationale: 'Innovation fonctionnelle, ergonomique ou technique supérieure à l’offre concurrente sur le marché de référence, menée jusqu’au prototype/installation pilote.',
    };
  }

  // Default to A_APPROFONDIR
  return {
    status: 'A_APPROFONDIR',
    label: 'À approfondir',
    rationale: 'Signaux mixtes nécessitant des investigations complémentaires (état de l’art, quantification des résultats ou confrontation au marché).',
  };
}

export function calculateConfidenceLevel(project: Project): {
  level: ConfidenceLevel;
  percentage: number;
  factors: string[];
} {
  let score = 0;
  const factors: string[] = [];

  // Description richness
  if (project.generalDescription?.length > 80) { score += 15; factors.push('Description générale détaillée'); }
  if (project.context?.length > 60) { score += 10; factors.push('Contexte initial précisé'); }
  if (project.difficultiesEncountered?.length > 60) { score += 15; factors.push('Difficultés techniques renseignées'); }
  if (project.worksRealized?.length > 60) { score += 15; factors.push('Travaux & itérations décrits'); }
  if (project.results?.length > 40) { score += 10; factors.push('Résultats obtenus documentés'); }
  
  // Evidence presence
  const highQualityProofs = project.evidence?.filter(e => e.probativeStrength === 'Élevée').length || 0;
  if (project.evidence?.length > 0) {
    score += Math.min(25, project.evidence.length * 5);
    factors.push(`${project.evidence.length} pièce(s) de preuve rattachée(s)`);
  }
  if (highQualityProofs >= 2) {
    score += 10;
    factors.push('Preuves à force probante élevée présentes');
  }

  const percentage = Math.min(100, score);
  let level: ConfidenceLevel = 'Faible';
  if (percentage >= 75) level = 'Élevée';
  else if (percentage >= 45) level = 'Moyenne';

  return { level, percentage, factors };
}

export function generateMissingInformation(project: Project, company?: Company): MissingInfoItem[] {
  const items: MissingInfoItem[] = [];

  // 1. État de l'art
  if (project.cirDimensions.stateOfArtScore < 2) {
    items.push({
      category: 'État de l\'art',
      issue: 'État de l’art insuffisamment documenté ou réduit à une étude de marché commerciale.',
      actionRequired: 'Demander les benchmarks techniques, publications scientifiques, brevets ou documentations spécialisées étudiés avant le démarrage du projet.',
      priority: 'Critique',
    });
  } else if (!project.cirDimensions.studiedSources) {
    items.push({
      category: 'État de l\'art',
      issue: 'Sources de l’état de l’art non citées nominativement.',
      actionRequired: 'Lister les références précises (auteurs, brevets, librairies open-source, normes) et formaliser pourquoi leurs limites ont été atteintes.',
      priority: 'Moyenne',
    });
  }

  // 2. Verrous & Incertitude
  if (project.cirDimensions.scientificLockScore < 2) {
    items.push({
      category: 'Verrous & Incertitude',
      issue: 'Verrou technique mal défini ou assimilable à un aléa projet d’ingénierie ordinaire.',
      actionRequired: 'Demander explicitement ce que l’équipe ne savait pas faire au démarrage et pourquoi un spécialiste du domaine n’avait pas de solution immédiate.',
      priority: 'Critique',
    });
  }

  if (project.cirDimensions.uncertaintyScore < 2) {
    items.push({
      category: 'Verrous & Incertitude',
      issue: 'Incertitude initiale non matérialisée.',
      actionRequired: 'Prouver que le résultat n’était pas garanti et détailler les hypothèses concurrentes qui ont dû être mises à l’épreuve.',
      priority: 'Moyenne',
    });
  }

  // 3. Démarche expérimentale
  if (project.cirDimensions.experimentalScore < 2) {
    items.push({
      category: 'Démarche expérimentale',
      issue: 'Expérimentations et démarche scientifique insuffisamment décrites.',
      actionRequired: 'Demander le protocole d’essai, les hypothèses de départ, les échecs rencontrés, les solutions abandonnées et les itérations successives.',
      priority: 'Critique',
    });
  }

  // 4. Résultats & Données
  if (!project.results || project.results.length < 50 || !/\d/.test(project.results)) {
    items.push({
      category: 'Résultats & Données',
      issue: 'Résultats trop qualitatifs ou narratifs sans métriques chiffrées.',
      actionRequired: 'Demander des données quantitatives et comparatives illustrant les gains réels (latence, rendement, consommation, débit, précision).',
      priority: 'Critique',
    });
  }

  // 5. Preuves documentaires
  if (!project.evidence || project.evidence.length === 0) {
    items.push({
      category: 'Preuves documentaires',
      issue: 'Aucun livrable contemporain daté rattaché au dossier.',
      actionRequired: 'Collecter des preuves datées de l’année analysée : cahiers de laboratoire, commits Git, comptes-rendus de comités R&D, rapports d’essais.',
      priority: 'Critique',
    });
  } else if (!project.evidence.some(e => e.type === 'cahier_laboratoire' || e.type === 'rapport_essais' || e.type === 'git_commits')) {
    items.push({
      category: 'Preuves documentaires',
      issue: 'Absence de preuves techniques contemporaines directes de la réalisation des travaux.',
      actionRequired: 'Compléter avec des extraits de commits / branches Git, tickets d’incidents techniques résolus ou rapports d’essais expérimentaux.',
      priority: 'Moyenne',
    });
  }

  // 6. CII (if SME)
  const isPme = company ? company.isPME : project.ciiAnalysis.isPmeEligible;
  if (isPme) {
    if (!project.ciiAnalysis.competitorsIdentified) {
      items.push({
        category: 'Marché CII',
        issue: 'Produits concurrents et marché de référence non identifiés.',
        actionRequired: 'Établir une grille comparative face à 2 ou 3 concurrents précis du marché pour justifier de la supériorité technique, fonctionnelle ou ergonomique.',
        priority: 'Moyenne',
      });
    }
    if (!project.ciiAnalysis.prototypesDeveloped && !project.ciiAnalysis.pilotInstallations) {
      items.push({
        category: 'Marché CII',
        issue: 'Matérialisation du prototype ou de l’installation pilote manquante.',
        actionRequired: 'Démontrer l’existence d’un prototype ou démonstrateur fonctionnel non commercialisé lors de la phase de R&D/conception.',
        priority: 'Moyenne',
      });
    }
  }

  return items;
}

export function generateAuditRecommendations(
  project: Project,
  company?: Company
): AuditRecommendation[] {
  const recs: AuditRecommendation[] = [];
  const cir = calculateCirScore(project);
  const engineering = detectClassicalEngineering(project);
  const matrix = determineMatrixPosition(project, company);

  if (matrix.status === 'CIR_POTENTIEL') {
    recs.push({
      title: 'Sécurisation du mémoire technique R&D (Guide du CIR)',
      description: 'Structurer le dossier technique selon la trame officielle du Ministère de la Recherche (État de l\'art → Verrous → Travaux → Résultats). Mettre en avant le personnel qualifié (docteurs, ingénieurs).',
      riskLevel: 'Faible',
    });
    if (project.cirDimensions.stateOfArtScore < 3) {
      recs.push({
        title: 'Renforcer la bibliographie académique / brevets',
        description: 'En cas de contrôle d\'un expert du MESR, l\'absence de bibliographie académique ou de brevets analysés est le premier motif de rejet.',
        riskLevel: 'Élevé',
      });
    }
  } else if (matrix.status === 'INGENIERIE_CLASSIQUE') {
    recs.push({
      title: 'Risque majeur de redressement fiscal en cas de déclaration CIR',
      description: 'Les travaux relèvent de la mise en œuvre de savoir-faire standard d\'ingénierie. Un expert MESR conclura à l\'absence d\'aléa scientifique. Envisager un repli sur le CII si l\'entreprise est PME et qu\'un produit nouveau est créé.',
      riskLevel: 'Élevé',
    });
  } else if (matrix.status === 'CII_POTENTIEL') {
    recs.push({
      title: 'Formalisation de la grille d\'écart concurrentiel (CII)',
      description: 'Rédiger une étude de benchmark marché exhaustive démontrant que les performances du produit dépassent objectivement l\'état de l\'offre concurrente à la date de conception.',
      riskLevel: 'Modéré',
    });
    recs.push({
      title: 'Vérification de la qualité de PME communautaire au sens fiscal',
      description: 'Contrôler les liens capitalistiques (entreprises associées / liées) pour s\'assurer que l\'entreprise ne dépasse pas les seuils de 250 salariés et 50M€ de CA au niveau du groupe.',
      riskLevel: 'Modéré',
    });
  } else {
    recs.push({
      title: 'Audit préalable d\'approfondissement nécessaire',
      description: 'Planifier un entretien technique avec les ingénieurs pour identifier si des sous-modules spécifiques ont fait l\'objet d\'une démarche expérimentale véritable.',
      riskLevel: 'Modéré',
    });
  }

  if (engineering.detectedSignals.length > 0) {
    recs.push({
      title: 'Nettoyage du vocabulaire "ingénierie classique"',
      description: 'Remplacer les formulations de type "intégration", "paramétrage", "optimisation courante" par des descriptions axées sur les verrous fondamentaux et les limites des modèles.',
      riskLevel: 'Modéré',
    });
  }

  return recs;
}
