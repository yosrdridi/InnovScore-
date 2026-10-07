import React, { useState } from 'react';
import { Project, Company } from '../../types';
import { 
  Printer, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Upload, 
  Microscope, 
  Lightbulb, 
  AlertTriangle, 
  Building2, 
  FileSpreadsheet,
  ListChecks,
  CheckCircle2
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

interface ExportViewProps {
  currentProject: Project | null;
  currentCompany: Company | null;
  allProjects: Project[];
  allCompanies: Company[];
  onImportData: (data: { projects: Project[]; companies: Company[] }) => void;
}

export const ExportView: React.FC<ExportViewProps> = ({
  currentProject,
  currentCompany,
  allProjects,
  allCompanies,
  onImportData,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!currentProject) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
        <FileSpreadsheet className="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <p>Veuillez sélectionner un projet pour exporter le rapport d'éligibilité.</p>
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

  // Generate complete consultant Markdown dossier
  const generateMarkdownReport = () => {
    return `# RAPPORT D'ANALYSE D'ÉLIGIBILITÉ CIR / CII
*Outil d'aide à la décision méthodologique · Non opposable à l'administration fiscale*
Date du diagnostic : ${new Date().toLocaleDateString('fr-FR')}

---

## 1. IDENTIFICATION DU PROJET & DU DÉCLARANT
- **Projet :** ${currentProject.name}
- **Exercice analysé :** ${currentProject.analyzedYear}
- **Entreprise déclarante :** ${currentCompany?.name || 'Non spécifiée'} (SIREN : ${currentCompany?.siren || 'N/A'})
- **Statut juridique :** ${currentCompany?.isPME ? 'PME communautaire (Éligible CIR et CII)' : 'ETI / GE (Éligible CIR uniquement)'}
- **Responsable technique :** ${currentProject.projectLeader || 'Non renseigné'}
- **Période des travaux :** Du ${currentProject.startDate} au ${currentProject.endDate}
- **Équipe R&D affectée :** ${currentProject.totalEtp} ETP (${currentProject.totalHours} heures)
- **Budget estimé :** ${currentProject.estimatedBudgetKeur} k€

---

## 2. POSITIONNEMENT COLLÉGIAL & CONCLUSION D'ÉLIGIBILITÉ
- **Qualification globale :** ${matrix.label}
- **Motivation doctrinale :** ${matrix.rationale}
- **Potentiel CIR (Recherche) :** ${cir.potentialLevel} (Score indicatif : ${cir.globalCirScore}/4)
- **Potentiel CII (Innovation) :** ${cii.potentialLevel} ${cii.isPmeEligible ? `(Score : ${cii.scoreInnovation}/4)` : '(Inéligible : non-PME)'}
- **Indice de confiance de l'audit :** ${confidence.level} (${confidence.percentage}%)

${engineering.isTriggered ? `
> ⚠️ **ALERTE INGÉNIERIE CLASSIQUE DÉTECTÉE :**
> Les travaux décrits semblent relever principalement de travaux d’ingénierie classique. Pour caractériser une éventuelle activité de R&D, il est nécessaire d’identifier les incertitudes scientifiques ou techniques rencontrées et les expérimentations conduites pour les lever.
` : ''}

---

## 3. ANALYSE DÉTAILLÉE CIR (MANUEL DE FRASCATI)
### A. Dimensions Clés (Guide du CIR - MESR)
1. **État de l'art (${currentProject.cirDimensions.stateOfArtScore}/4) :**
   ${currentProject.cirDimensions.stateOfArtDetails || 'Non renseigné'}
   - Sources étudiées : ${currentProject.cirDimensions.studiedSources || 'Non renseigné'}
   - Limites de l'existant : ${currentProject.cirDimensions.whyExistingInsufficient || 'Non renseigné'}
   - Contexte : ${currentProject.cirDimensions.difficultyContext === 'objective_etat_art' ? 'Difficulté objective dans l’état des connaissances' : 'Difficulté propre à l’entreprise'}

2. **Verrou scientifique ou technique (${currentProject.cirDimensions.scientificLockScore}/4) :**
   ${currentProject.cirDimensions.scientificLockDetails || 'Non renseigné'}
   - Typologie : ${currentProject.cirDimensions.lockNature}

3. **Incertitude initiale (${currentProject.cirDimensions.uncertaintyScore}/4) :**
   ${currentProject.cirDimensions.uncertaintyDetails || 'Non renseigné'}

4. **Démarche expérimentale & Hypothèses (${currentProject.cirDimensions.experimentalScore}/4) :**
   ${currentProject.cirDimensions.experimentalDetails || 'Non renseigné'}
   - Nombre d'itérations : ${currentProject.cirDimensions.iterationsCount}
   - Hypothèses : ${currentProject.qualHypothesesTested || 'N/A'}
   - Échecs / solutions abandonnées : ${currentProject.qualFailedSolutionsAbandoned || 'N/A'}

5. **Production de connaissances nouvelles (${currentProject.cirDimensions.newKnowledgeScore}/4) :**
   ${currentProject.cirDimensions.newKnowledgeDetails || 'Non renseigné'}

### B. Évaluation des 5 Critères du Manuel de Frascati
- **Nouveauté :** ${currentProject.frascatiCriteria.novelty.score}/4
- **Créativité :** ${currentProject.frascatiCriteria.creativity.score}/4
- **Incertitude :** ${currentProject.frascatiCriteria.uncertainty.score}/4
- **Systématicité :** ${currentProject.frascatiCriteria.systematicity.score}/4
- **Transférabilité / Reproductibilité :** ${currentProject.frascatiCriteria.transferability.score}/4

---

## 4. ANALYSE DÉTAILLÉE CII (INNOVATION PRODUIT)
- **Produit développé :** ${currentProject.ciiAnalysis.developedProduct || 'N/A'} (${currentProject.ciiAnalysis.productType})
- **Marché pertinent :** ${currentProject.ciiAnalysis.relevantMarketDescription || 'N/A'}
- **Concurrents de référence :** ${currentProject.ciiAnalysis.competitorsIdentified || 'N/A'}

### Comparatif sur les 4 Axes de Nouveauté :
1. **Performances techniques (${currentProject.ciiAnalysis.technicalPerformances.score}/4) :**
   - Produit : ${currentProject.ciiAnalysis.technicalPerformances.productPerf || 'N/A'}
   - Concurrents : ${currentProject.ciiAnalysis.technicalPerformances.competitorPerf || 'N/A'}
   - Écart : ${currentProject.ciiAnalysis.technicalPerformances.differenceNoted || 'N/A'}
2. **Fonctionnalités (${currentProject.ciiAnalysis.functionalities.score}/4) :**
   - Produit : ${currentProject.ciiAnalysis.functionalities.productPerf || 'N/A'}
   - Concurrents : ${currentProject.ciiAnalysis.functionalities.competitorPerf || 'N/A'}
3. **Ergonomie (${currentProject.ciiAnalysis.ergonomics.score}/4) :**
   - Produit : ${currentProject.ciiAnalysis.ergonomics.productPerf || 'N/A'}
   - Concurrents : ${currentProject.ciiAnalysis.ergonomics.competitorPerf || 'N/A'}
4. **Écoconception (${currentProject.ciiAnalysis.ecodesign.score}/4) :**
   - Produit : ${currentProject.ciiAnalysis.ecodesign.productPerf || 'N/A'}
   - Concurrents : ${currentProject.ciiAnalysis.ecodesign.competitorPerf || 'N/A'}

- **Matérialisation du prototype / installation pilote :** ${currentProject.ciiAnalysis.prototypesDeveloped || 'Non renseigné'}

---

## 5. INFORMATIONS NÉCESSAIRES POUR SÉCURISER L'ANALYSE (PLAN D'ACTION AUDIT)
${missingInfo.map(item => `- [${item.priority.toUpperCase()}] **${item.category}** : ${item.issue}\n  → *Action requise :* ${item.actionRequired}`).join('\n')}

---

## 6. REGISTRE DES PREUVES HORODATÉES RATTACHÉES
${currentProject.evidence.map(e => `- **${e.title}** (${e.type}, Force ${e.probativeStrength}) - Réf: ${e.referenceOrUrl || 'Archive interne'} - Date: ${e.date}`).join('\n')}

---
*Rapport généré automatiquement par la plateforme InnovScore · Diagnostic CIR & CII.*
`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const exportAllJson = () => {
    const data = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      companies: allCompanies,
      projects: allProjects,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `innovscore-cir-cii-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.projects && json.companies) {
          onImportData({ projects: json.projects, companies: json.companies });
          setImportStatus('Données importées avec succès !');
        } else {
          setImportStatus('Format de fichier JSON invalide.');
        }
      } catch (err) {
        setImportStatus('Erreur de lecture du fichier JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top action bar (hidden in print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            Livrable & Restitution
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Export du Rapport d'Audit & Sauvegarde
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Imprimez en PDF le compte-rendu complet, copiez le contenu en Markdown ou exportez le classeur en JSON.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer / PDF</span>
          </button>

          <button
            onClick={copyToClipboard}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copié !' : 'Copier Markdown'}</span>
          </button>

          <button
            onClick={exportAllJson}
            className="px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5"
            title="Télécharger une sauvegarde complète JSON"
          >
            <Download className="w-4 h-4" />
            <span>Sauvegarde JSON</span>
          </button>

          <label className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs">
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Restaurer JSON</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {importStatus && (
        <div className="no-print p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium">
          {importStatus}
        </div>
      )}

      {/* Printable Executive Report Container */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 shadow-sm space-y-8 print:border-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold font-mono uppercase tracking-widest text-indigo-600 mb-1">
              Rapport d'Audit Préparatoire CIR / CII
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {currentProject.name}
            </h2>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>{currentCompany?.name} (SIREN : {currentCompany?.siren})</span>
              <span>·</span>
              <span className="font-mono">Exercice {currentProject.analyzedYear}</span>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500">
            <div>Édité le {new Date().toLocaleDateString('fr-FR')}</div>
            <div className="font-semibold text-slate-900">InnovScore R&D Studio</div>
          </div>
        </div>

        {/* Section 1: Positionnement collégial */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Conclusion Méthodologique
              </span>
              <span className="text-lg font-bold text-slate-900">
                {matrix.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div>CIR : <strong className="font-bold">{cir.potentialLevel}</strong></div>
              <div>CII : <strong className="font-bold">{cii.potentialLevel}</strong></div>
              <div>Confiance : <strong className="font-bold">{confidence.level} ({confidence.percentage}%)</strong></div>
            </div>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {matrix.rationale}
          </p>
        </div>

        {/* Classical engineering alert in print if active */}
        {engineering.isTriggered && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-900 space-y-1">
            <span className="font-bold block text-sm">
              Avertissement : Signaux d’ingénierie classique détectés
            </span>
            <p>
              Attention : les travaux décrits semblent relever principalement de travaux d’ingénierie classique. Pour caractériser une éventuelle activité de R&D, il est nécessaire d’identifier les incertitudes scientifiques ou techniques rencontrées et les expérimentations conduites pour les lever.
            </p>
          </div>
        )}

        {/* Section 2: Fiche d'identité projet */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            1. Caractéristiques Générales du Projet
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Responsable projet :</span>
              <strong className="text-slate-900">{currentProject.projectLeader || '—'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Dates de réalisation :</span>
              <strong className="text-slate-900">{currentProject.startDate} au {currentProject.endDate}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Temps affecté :</span>
              <strong className="text-slate-900 font-mono">{currentProject.totalEtp} ETP ({currentProject.totalHours} h)</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Budget estimé :</span>
              <strong className="text-slate-900 font-mono">{currentProject.estimatedBudgetKeur} k€</strong>
            </div>
          </div>

          <div className="text-xs text-slate-700 pt-2 space-y-2">
            <div>
              <strong className="text-slate-900 block">Description générale :</strong>
              <p className="leading-relaxed">{currentProject.generalDescription || 'Non renseignée'}</p>
            </div>
            <div>
              <strong className="text-slate-900 block">Contexte & Objectifs :</strong>
              <p className="leading-relaxed">{currentProject.objectives || 'Non renseignés'}</p>
            </div>
          </div>
        </div>

        {/* Section 3: Grille CIR & Frascati */}
        <div className="space-y-3 print-break-inside-avoid">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            2. Évaluation de l'Éligibilité CIR (Recherche & Développement)
          </h3>
          <table className="w-full text-xs border border-slate-200 divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50 font-semibold text-slate-700">
              <tr>
                <th className="p-2.5">Dimension R&D</th>
                <th className="p-2.5">Note</th>
                <th className="p-2.5">Observations & Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-2.5 font-semibold text-slate-900">A. État de l'art</td>
                <td className="p-2.5 font-mono font-bold text-slate-800">{currentProject.cirDimensions.stateOfArtScore}/4</td>
                <td className="p-2.5 text-slate-600">{currentProject.cirDimensions.stateOfArtDetails || currentProject.stateOfTheArtKnown || '—'}</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-slate-900">B. Verrou scientifique</td>
                <td className="p-2.5 font-mono font-bold text-slate-800">{currentProject.cirDimensions.scientificLockScore}/4</td>
                <td className="p-2.5 text-slate-600">{currentProject.cirDimensions.scientificLockDetails || currentProject.difficultiesEncountered || '—'}</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-slate-900">C. Incertitude</td>
                <td className="p-2.5 font-mono font-bold text-slate-800">{currentProject.cirDimensions.uncertaintyScore}/4</td>
                <td className="p-2.5 text-slate-600">{currentProject.cirDimensions.uncertaintyDetails || '—'}</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-slate-900">D. Démarche expérimentale</td>
                <td className="p-2.5 font-mono font-bold text-slate-800">{currentProject.cirDimensions.experimentalScore}/4</td>
                <td className="p-2.5 text-slate-600">{currentProject.cirDimensions.experimentalDetails || currentProject.worksRealized || '—'}</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-slate-900">E. Connaissances nouvelles</td>
                <td className="p-2.5 font-mono font-bold text-slate-800">{currentProject.cirDimensions.newKnowledgeScore}/4</td>
                <td className="p-2.5 text-slate-600">{currentProject.cirDimensions.newKnowledgeDetails || currentProject.results || '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 4: Grille CII */}
        <div className="space-y-3 print-break-inside-avoid">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            3. Évaluation de l'Éligibilité CII (Crédit Impôt Innovation)
          </h3>
          <div className="text-xs text-slate-700 space-y-1">
            <div><strong>Produit développé :</strong> {currentProject.ciiAnalysis.developedProduct || '—'} ({currentProject.ciiAnalysis.productType})</div>
            <div><strong>Marché de référence :</strong> {currentProject.ciiAnalysis.relevantMarketDescription || '—'}</div>
            <div><strong>Concurrents identifiés :</strong> {currentProject.ciiAnalysis.competitorsIdentified || '—'}</div>
            <div><strong>Matérialisation prototypes :</strong> {currentProject.ciiAnalysis.prototypesDeveloped || '—'}</div>
          </div>
        </div>

        {/* Section 5: Informations nécessaires pour sécuriser (Audit) */}
        <div className="space-y-3 print-break-inside-avoid">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            4. Actions Indispensables pour Sécuriser le Dossier d'Audit
          </h3>
          <div className="space-y-2 text-xs">
            {missingInfo.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-bold shrink-0">
                  {item.priority}
                </span>
                <div>
                  <span className="font-bold text-slate-900">{item.category} : </span>
                  <span className="text-slate-700">{item.issue} </span>
                  <span className="text-indigo-900 font-semibold block pt-0.5">→ Action : {item.actionRequired}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Pièces justificatives */}
        <div className="space-y-3 print-break-inside-avoid">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
            5. Registre des Éléments de Preuve Rattachés ({currentProject.evidence.length})
          </h3>
          <ul className="text-xs text-slate-700 space-y-1 list-disc pl-5">
            {currentProject.evidence.map((e) => (
              <li key={e.id}>
                <strong>{e.title}</strong> — {e.type} (Force {e.probativeStrength}) · Réf: {e.referenceOrUrl || 'Archive'} · Date: {e.date}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
