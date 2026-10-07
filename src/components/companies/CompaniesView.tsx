import React, { useState } from 'react';
import { Company, Project } from '../../types';
import { Building2, Plus, ShieldCheck, ShieldAlert, Check, AlertCircle, Trash2, Edit2 } from 'lucide-react';

interface CompaniesViewProps {
  companies: Company[];
  projects: Project[];
  onSaveCompany: (company: Company) => void;
  onDeleteCompany: (companyId: string) => void;
  onSelectCompany: (companyId: string) => void;
}

export const CompaniesView: React.FC<CompaniesViewProps> = ({
  companies,
  projects,
  onSaveCompany,
  onDeleteCompany,
}) => {
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const startCreate = () => {
    setEditingCompany({
      id: `comp_${Date.now()}`,
      name: '',
      siren: '',
      sector: '',
      headcount: 15,
      turnoverMillion: 2.0,
      balanceSheetTotalMillion: 1.5,
      isPME: true,
      independenceVerified: true,
      contactName: '',
      contactEmail: '',
    });
    setIsCreating(true);
  };

  const calculateSmeStatus = (headcount: number, turnover: number, balanceSheet: number, independent: boolean) => {
    const headcountOk = headcount < 250;
    const financialOk = turnover <= 50 || balanceSheet <= 43;
    return headcountOk && financialOk && independent;
  };

  const handleFieldChange = (field: keyof Company, value: any) => {
    if (!editingCompany) return;
    const updated = { ...editingCompany, [field]: value };
    // Auto update PME status
    updated.isPME = calculateSmeStatus(
      Number(updated.headcount),
      Number(updated.turnoverMillion),
      Number(updated.balanceSheetTotalMillion),
      Boolean(updated.independenceVerified)
    );
    setEditingCompany(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany || !editingCompany.name.trim()) return;
    onSaveCompany(editingCompany);
    setEditingCompany(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Gestion des Entreprises & Qualification PME (CII)
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Suivi des structures déclarantes et vérification des critères de PME communautaire obligatoires pour le Crédit Impôt Innovation.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-2xs self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une entreprise</span>
        </button>
      </div>

      {/* Legal reminder banner */}
      <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl flex items-start gap-3 text-xs text-sky-900">
        <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Rappel doctrinal majeur : </span>
          L'article 244 quater B II k du CGI réserve expressément le <strong>Crédit Impôt Innovation (CII)</strong> aux entreprises répondant à la définition européenne de la PME (effectif &lt; 250, CA &le; 50 M€ ou total bilan &le; 43 M€, avec prise en compte des liens capitalistiques amont/aval). Une ETI ou GE ne peut en aucun cas déclarer de CII. Le CIR, quant à lui, est ouvert à toutes les tailles d'entreprises.
        </div>
      </div>

      {/* Companies List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                Entreprises enregistrées ({companies.length})
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {companies.map((comp) => {
                const compProjects = projects.filter(p => p.companyId === comp.id);
                return (
                  <div key={comp.id} className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900">{comp.name}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                          comp.isPME 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {comp.isPME ? 'PME Éligible CII & CIR' : 'ETI / GE (CIR Uniquement)'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                        <span>SIREN : <span className="font-mono">{comp.siren || 'N/A'}</span></span>
                        <span>Secteur : {comp.sector || 'Généraliste'}</span>
                        <span>Effectif : <span className="font-mono tabular-nums">{comp.headcount}</span> sal.</span>
                        <span>CA : <span className="font-mono tabular-nums">{comp.turnoverMillion}</span> M€</span>
                      </div>
                      <div className="text-xs text-slate-400 pt-1">
                        Contact : {comp.contactName || 'Non renseigné'} {comp.contactEmail ? `(${comp.contactEmail})` : ''}
                        <span className="ml-2 font-mono text-indigo-600">· {compProjects.length} projet(s) rattaché(s)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => { setEditingCompany(comp); setIsCreating(false); }}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Modifier l'entreprise"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Supprimer l'entreprise "${comp.name}" ?`)) {
                            onDeleteCompany(comp.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Supprimer l'entreprise"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Edit or Create Form */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3">
            {editingCompany 
              ? (isCreating ? 'Nouvelle Entreprise' : `Modifier ${editingCompany.name}`)
              : 'Détails & Vérification PME'
            }
          </h2>

          {editingCompany ? (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Raison sociale *</label>
                <input
                  type="text"
                  required
                  value={editingCompany.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="Ex: InnovTech Solutions SAS"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">SIREN</label>
                  <input
                    type="text"
                    value={editingCompany.siren}
                    onChange={(e) => handleFieldChange('siren', e.target.value)}
                    placeholder="9 chiffres"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Secteur d'activité</label>
                  <input
                    type="text"
                    value={editingCompany.sector}
                    onChange={(e) => handleFieldChange('sector', e.target.value)}
                    placeholder="Ex: Chimie, Logiciel..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <span className="font-semibold text-slate-800 block">
                  Données financières & seuils PME (Recommandation 2003/361/CE)
                </span>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Effectif (&lt; 250)</label>
                    <input
                      type="number"
                      min={0}
                      value={editingCompany.headcount}
                      onChange={(e) => handleFieldChange('headcount', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">CA (M€ &le; 50)</label>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      value={editingCompany.turnoverMillion}
                      onChange={(e) => handleFieldChange('turnoverMillion', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Bilan (M€ &le; 43)</label>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      value={editingCompany.balanceSheetTotalMillion}
                      onChange={(e) => handleFieldChange('balanceSheetTotalMillion', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCompany.independenceVerified}
                    onChange={(e) => handleFieldChange('independenceVerified', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                  />
                  <span className="text-[11px] text-slate-700">
                    Indépendance capitalistique vérifiée (&lt; 25% détenu par une non-PME)
                  </span>
                </label>

                <div className={`p-2 rounded text-[11px] font-semibold flex items-center gap-2 ${
                  editingCompany.isPME ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {editingCompany.isPME ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      Statut PME validé : Éligible au CII (et au CIR)
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
                      Statut ETI / GE : Inéligible au CII (Éligible CIR uniquement)
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Interlocuteur R&D / DAF</label>
                <input
                  type="text"
                  value={editingCompany.contactName}
                  onChange={(e) => handleFieldChange('contactName', e.target.value)}
                  placeholder="Nom & Titre"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-2"
                />
                <input
                  type="email"
                  value={editingCompany.contactEmail}
                  onChange={(e) => handleFieldChange('contactEmail', e.target.value)}
                  placeholder="email@entreprise.fr"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => { setEditingCompany(null); setIsCreating(false); }}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-2xs"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-10 text-slate-400 space-y-3">
              <Building2 className="w-10 h-10 mx-auto text-slate-300" />
              <p>Sélectionnez une entreprise à modifier ou cliquez sur "Ajouter une entreprise".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
