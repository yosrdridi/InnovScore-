import React from 'react';
import { Project, Company, CiiInnovationAxis } from '../../types';
import { 
  Lightbulb, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  Scale, 
  Layers, 
  Cpu, 
  Sparkles, 
  Leaf, 
  Sliders, 
  Layout, 
  Box
} from 'lucide-react';
import { calculateCiiScore } from '../../utils/scoring';

interface CiiAnalysisViewProps {
  currentProject: Project | null;
  currentCompany: Company | null;
  onSaveProject: (project: Project) => void;
  onNavigate: (view: string) => void;
}

export const CiiAnalysisView: React.FC<CiiAnalysisViewProps> = ({
  currentProject,
  currentCompany,
  onSaveProject,
  onNavigate,
}) => {
  if (!currentProject) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
        <Lightbulb className="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <p>Veuillez sélectionner un projet pour accéder à la grille d'analyse CII.</p>
      </div>
    );
  }

  const ciiScore = calculateCiiScore(currentProject, currentCompany || undefined);
  const isPme = currentCompany ? currentCompany.isPME : currentProject.ciiAnalysis.isPmeEligible;

  const handleCiiChange = (field: keyof Project['ciiAnalysis'], value: any) => {
    const updatedCii = {
      ...currentProject.ciiAnalysis,
      [field]: value,
    };
    onSaveProject({ ...currentProject, ciiAnalysis: updatedCii });
  };

  const handleAxisChange = (axisName: 'technicalPerformances' | 'functionalities' | 'ergonomics' | 'ecodesign', field: keyof CiiInnovationAxis, value: any) => {
    const updatedAxis = {
      ...currentProject.ciiAnalysis[axisName],
      [field]: value,
    };
    const updatedCii = {
      ...currentProject.ciiAnalysis,
      [axisName]: updatedAxis,
    };
    onSaveProject({ ...currentProject, ciiAnalysis: updatedCii });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-sky-600 mb-1">
            Innovation Produit · CGI Art. 244 quater B II k · Réservé PME
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Grille Indépendante d'Analyse CII (Crédit Impôt Innovation)
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Démontrer la supériorité concrète du produit face à l'offre concurrente sur le marché de référence.
          </p>
        </div>

        {/* Global CII Score Card */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
          <div className="text-right">
            <div className="text-[11px] text-slate-500 font-medium">Potentiel CII indicatif</div>
            <div className={`text-base font-bold ${
              !isPme ? 'text-slate-400' :
              ciiScore.potentialLevel === 'Fort' ? 'text-sky-700' :
              ciiScore.potentialLevel === 'Modéré' ? 'text-teal-700' :
              ciiScore.potentialLevel === 'À approfondir' ? 'text-purple-700' :
              'text-rose-700'
            }`}>
              {ciiScore.potentialLevel}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="font-mono text-xl font-bold tabular-nums text-slate-900">
            {isPme ? `${ciiScore.scoreInnovation.toFixed(1)} / 4` : '0 / 4'}
          </div>
        </div>
      </div>

      {/* SME Eligibility Check Warning */}
      {!isPme && (
        <div className="p-4 bg-slate-100 border border-slate-300 rounded-xl flex items-start gap-3 text-xs text-slate-800">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-rose-700 block text-sm">
              Entreprise non éligible au Crédit Impôt Innovation (Non-PME)
            </span>
            <p className="mt-0.5">
              L'entreprise <strong>{currentCompany?.name || 'rattachée'}</strong> est classée comme ETI ou Grande Entreprise. Conformément aux dispositions de l'article 244 quater B II k du CGI, le CII est <strong>strictement réservé aux PME</strong> au sens du droit de l'Union européenne. Les travaux de ce projet ne peuvent être valorisés qu'au titre du CIR s'ils répondent aux critères de R&D.
            </p>
          </div>
        </div>
      )}

      {/* Section 1: Produit concerné & Marché */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Produit */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Box className="w-4 h-4 text-sky-600" />
            1. Produit Développé
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Nom ou désignation du produit développé *
              </label>
              <input
                type="text"
                value={currentProject.ciiAnalysis.developedProduct || ''}
                onChange={(e) => handleCiiChange('developedProduct', e.target.value)}
                placeholder="Ex: Boîte isotherme ThermoShield 25L"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Nature du produit
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="productType"
                    checked={currentProject.ciiAnalysis.productType === 'bien_materiel'}
                    onChange={() => handleCiiChange('productType', 'bien_materiel')}
                    className="text-sky-600"
                  />
                  <span>Bien matériel (matériau, machine, équipement)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="productType"
                    checked={currentProject.ciiAnalysis.productType === 'bien_immateriel_logiciel'}
                    onChange={() => handleCiiChange('productType', 'bien_immateriel_logiciel')}
                    className="text-sky-600"
                  />
                  <span>Bien immatériel (progiciel, application logicielle)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Population d'utilisateurs et marché cible visés *
              </label>
              <input
                type="text"
                value={currentProject.ciiAnalysis.targetUserPopulation || ''}
                onChange={(e) => handleCiiChange('targetUserPopulation', e.target.value)}
                placeholder="Ex: Laboratoires pharmaceutiques, hôpitaux, logisticiens santé..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Marché & Concurrents */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Layers className="w-4 h-4 text-sky-600" />
            2. Marché de Référence & Produits Concurrents
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Produits concurrents identifiés sur le marché de référence *
              </label>
              <textarea
                rows={2}
                value={currentProject.ciiAnalysis.competitorsIdentified || ''}
                onChange={(e) => handleCiiChange('competitorsIdentified', e.target.value)}
                placeholder="Citez au moins 2 ou 3 marques / solutions concurrentes existantes (ex: Marque A, Modèle B)..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Description du marché pertinent et limites de l'offre existante
              </label>
              <textarea
                rows={3}
                value={currentProject.ciiAnalysis.relevantMarketDescription || ''}
                onChange={(e) => handleCiiChange('relevantMarketDescription', e.target.value)}
                placeholder="Pourquoi aucun produit concurrent sur ce marché ne répondait au besoin ?"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Les 4 Axes du Caractère Nouveau (Performances, Fonctionnalités, Ergonomie, Écoconception) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              3. Analyse du Caractère Nouveau sur les 4 Axes Fiscaux
            </h2>
            <p className="text-xs text-slate-500">
              Le produit doit présenter des performances supérieures aux produits concurrents sur au moins l'un des 4 axes ci-dessous.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Axe 1: Performances techniques */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-sky-600" />
                Axe 1 · Performances Techniques
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-500 mr-1">Note :</span>
                {[0, 1, 2, 3, 4].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAxisChange('technicalPerformances', 'score', s)}
                    className={`w-6 h-6 rounded text-xs font-mono font-bold transition-all ${
                      currentProject.ciiAnalysis.technicalPerformances.score === s
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600">Performance du produit développé</label>
                <input
                  type="text"
                  value={currentProject.ciiAnalysis.technicalPerformances.productPerf || ''}
                  onChange={(e) => handleAxisChange('technicalPerformances', 'productPerf', e.target.value)}
                  placeholder="Ex: Maintien à +2/+8°C pendant 44 heures à 35°C extérieur"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600">Performance des produits concurrents</label>
                <input
                  type="text"
                  value={currentProject.ciiAnalysis.technicalPerformances.competitorPerf || ''}
                  onChange={(e) => handleAxisChange('technicalPerformances', 'competitorPerf', e.target.value)}
                  placeholder="Ex: Les concurrents maintiennent 24h au maximum"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600">Différence constatée / Gain supérieur</label>
                <input
                  type="text"
                  value={currentProject.ciiAnalysis.technicalPerformances.differenceNoted || ''}
                  onChange={(e) => handleAxisChange('technicalPerformances', 'differenceNoted', e.target.value)}
                  placeholder="Ex: +83% de durée de conservation sans rupture"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600">Preuves disponibles</label>
                <input
                  type="text"
                  value={currentProject.ciiAnalysis.technicalPerformances.proofsAvailable || ''}
                  onChange={(e) => handleAxisChange('technicalPerformances', 'proofsAvailable', e.target.value)}
                  placeholder="Ex: Rapport d'essai laboratoire COFRAC n°..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Axe 2: Fonctionnalités */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-sky-600" />
                Axe 2 · Fonctionnalités
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-500 mr-1">Note :</span>
                {[0, 1, 2, 3, 4].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAxisChange('functionalities', 'score', s)}
                    className={`w-6 h-6 rounded text-xs font-mono font-bold transition-all ${
                      currentProject.ciiAnalysis.functionalities.score === s
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600">Fonctionnalité(s) du produit développé</label>
                <input
                  type="text"
                  value={currentProject.ciiAnalysis.functionalities.productPerf || ''}
                  onChange={(e) => handleAxisChange('functionalities', 'productPerf', e.target.value)}
                  placeholder="Ex: Indicateur colorimétrique irréversible sans pile"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600">Fonctionnalités des concurrents</label>
                <input
                  type="text"
                  value={currentProject.ciiAnalysis.functionalities.competitorPerf || ''}
                  onChange={(e) => handleAxisChange('functionalities', 'competitorPerf', e.target.value)}
                  placeholder="Ex: Nécessite un datalogger USB payant et jetable"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600">Différence constatée</label>
                <input
                  type="text"
                  value={currentProject.ciiAnalysis.functionalities.differenceNoted || ''}
                  onChange={(e) => handleAxisChange('functionalities', 'differenceNoted', e.target.value)}
                  placeholder="Ex: Lecture visuelle directe sans équipement de lecture"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600">Preuves disponibles</label>
                <input
                  type="text"
                  value={currentProject.ciiAnalysis.functionalities.proofsAvailable || ''}
                  onChange={(e) => handleAxisChange('functionalities', 'proofsAvailable', e.target.value)}
                  placeholder="Ex: Fiche technique et photos du virage de couleur"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Axe 3: Ergonomie */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Layout className="w-4 h-4 text-sky-600" />
                Axe 3 · Ergonomie & Usage
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-500 mr-1">Note :</span>
                {[0, 1, 2, 3, 4].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAxisChange('ergonomics', 'score', s)}
                    className={`w-6 h-6 rounded text-xs font-mono font-bold transition-all ${
                      currentProject.ciiAnalysis.ergonomics.score === s
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600">Ergonomie du produit développé</label>
                <input
                  type="text"
                  value={currentProject.ciiAnalysis.ergonomics.productPerf || ''}
                  onChange={(e) => handleAxisChange('ergonomics', 'productPerf', e.target.value)}
                  placeholder="Ex: Montage sans ruban adhésif en 15 secondes"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600">Ergonomie des concurrents</label>
                <input
                  type="text"
                  value={currentProject.ciiAnalysis.ergonomics.competitorPerf || ''}
                  onChange={(e) => handleAxisChange('ergonomics', 'competitorPerf', e.target.value)}
                  placeholder="Ex: Montage complexe avec bandes adhésives thermiques"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600">Différence constatée</label>
                <input
                  type="text"
                  value={currentProject.ciiAnalysis.ergonomics.differenceNoted || ''}
                  onChange={(e) => handleAxisChange('ergonomics', 'differenceNoted', e.target.value)}
                  placeholder="Ex: Gain de 40% sur le temps de conditionnement"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600">Preuves disponibles</label>
                <input
                  type="text"
                  value={currentProject.ciiAnalysis.ergonomics.proofsAvailable || ''}
                  onChange={(e) => handleAxisChange('ergonomics', 'proofsAvailable', e.target.value)}
                  placeholder="Ex: Étude ergonomique en entrepôt vidéo-enregistrée"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Axe 4: Écoconception */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                Axe 4 · Écoconception & Environnement
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-500 mr-1">Note :</span>
                {[0, 1, 2, 3, 4].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAxisChange('ecodesign', 'score', s)}
                    className={`w-6 h-6 rounded text-xs font-mono font-bold transition-all ${
                      currentProject.ciiAnalysis.ecodesign.score === s
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600">Écoconception du produit développé</label>
                <input
                  type="text"
                  value={currentProject.ciiAnalysis.ecodesign.productPerf || ''}
                  onChange={(e) => handleAxisChange('ecodesign', 'productPerf', e.target.value)}
                  placeholder="Ex: 100% biosourcé et 98% recyclable filière carton"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600">Écoconception des concurrents</label>
                <input
                  type="text"
                  value={currentProject.ciiAnalysis.ecodesign.competitorPerf || ''}
                  onChange={(e) => handleAxisChange('ecodesign', 'competitorPerf', e.target.value)}
                  placeholder="Ex: Polystyrène expansé fossile enfoui ou incinéré"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600">Différence constatée</label>
                <input
                  type="text"
                  value={currentProject.ciiAnalysis.ecodesign.differenceNoted || ''}
                  onChange={(e) => handleAxisChange('ecodesign', 'differenceNoted', e.target.value)}
                  placeholder="Ex: Bilan carbone divisé par 3,5"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600">Preuves disponibles</label>
                <input
                  type="text"
                  value={currentProject.ciiAnalysis.ecodesign.proofsAvailable || ''}
                  onChange={(e) => handleAxisChange('ecodesign', 'proofsAvailable', e.target.value)}
                  placeholder="Ex: Analyse de Cycle de Vie (ACV) ISO 14040"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Prototypes & Installations Pilotes */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            4. Matérialisation des Prototypes & Installations Pilotes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pour être éligible au CII, les dépenses doivent concerner la conception de prototypes ou d'installations pilotes (BOI-BIC-RICI-10-10-45).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Prototypes développés & versions expérimentales *
            </label>
            <textarea
              rows={2}
              value={currentProject.ciiAnalysis.prototypesDeveloped || ''}
              onChange={(e) => handleCiiChange('prototypesDeveloped', e.target.value)}
              placeholder="Description des modèles physiques ou logiciels de test..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Démonstrateurs & MVP testés
            </label>
            <textarea
              rows={2}
              value={currentProject.ciiAnalysis.mvpAndDemonstrators || ''}
              onChange={(e) => handleCiiChange('mvpAndDemonstrators', e.target.value)}
              placeholder="Précisez le périmètre fonctionnel des versions démonstrateurs..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Tests utilisateurs / retours terrain
            </label>
            <textarea
              rows={2}
              value={currentProject.ciiAnalysis.userTestsConducted || ''}
              onChange={(e) => handleCiiChange('userTestsConducted', e.target.value)}
              placeholder="Protocoles de tests avec des utilisateurs pilotes et résultats..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Installations pilotes & bancs de présérie
            </label>
            <textarea
              rows={2}
              value={currentProject.ciiAnalysis.pilotInstallations || ''}
              onChange={(e) => handleCiiChange('pilotInstallations', e.target.value)}
              placeholder="Dispositifs expérimentaux de fabrication ou d'assemblage pilote..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
