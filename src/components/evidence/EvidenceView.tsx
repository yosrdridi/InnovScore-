import React, { useState } from 'react';
import { Project, EvidenceItem, EvidenceType } from '../../types';
import { 
  FileCheck2, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  FileText, 
  GitBranch, 
  BookOpen, 
  FileBarChart, 
  Box, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface EvidenceViewProps {
  currentProject: Project | null;
  onSaveProject: (project: Project) => void;
  onNavigate: (view: string) => void;
}

export const EVIDENCE_TYPES: { id: EvidenceType; label: string; icon: any }[] = [
  { id: 'documentation_technique', label: 'Documentation technique', icon: FileText },
  { id: 'rapport_essais', label: 'Rapport d’essais', icon: FileCheck2 },
  { id: 'benchmark', label: 'Benchmark comparatif', icon: FileBarChart },
  { id: 'publication_scientifique', label: 'Publication scientifique / Brevet', icon: BookOpen },
  { id: 'graphique', label: 'Graphique de mesure / Dataviz', icon: FileBarChart },
  { id: 'ticket_jira', label: 'Ticket Jira / Issue tracker', icon: FileText },
  { id: 'git_commits', label: 'Git / Journal des commits', icon: GitBranch },
  { id: 'prototype', label: 'Photos / Fiche de recette Prototype', icon: Box },
  { id: 'cahier_laboratoire', label: 'Cahier de laboratoire numérique', icon: BookOpen },
  { id: 'compte_rendu', label: 'Compte-rendu de comité R&D', icon: FileText },
  { id: 'feuilles_temps', label: 'Feuilles de temps / Relevé d’heures', icon: Clock },
];

export const EvidenceView: React.FC<EvidenceViewProps> = ({
  currentProject,
  onSaveProject,
  onNavigate,
}) => {
  if (!currentProject) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
        <FileCheck2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <p>Veuillez sélectionner un projet pour gérer les éléments de preuve.</p>
      </div>
    );
  }

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newEvidence, setNewEvidence] = useState<Partial<EvidenceItem>>({
    title: '',
    type: 'rapport_essais',
    date: new Date().toISOString().split('T')[0],
    author: currentProject.projectLeader || '',
    description: '',
    linkedAspect: 'experimentation',
    probativeStrength: 'Élevée',
    referenceOrUrl: '',
  });

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidence.title?.trim()) return;

    const item: EvidenceItem = {
      id: `ev_${Date.now()}`,
      title: newEvidence.title,
      type: (newEvidence.type as EvidenceType) || 'rapport_essais',
      date: newEvidence.date || new Date().toISOString().split('T')[0],
      author: newEvidence.author || 'Inconnu',
      description: newEvidence.description || '',
      linkedAspect: newEvidence.linkedAspect || 'experimentation',
      probativeStrength: newEvidence.probativeStrength || 'Élevée',
      referenceOrUrl: newEvidence.referenceOrUrl || '',
    };

    const updatedEvidence = [...(currentProject.evidence || []), item];
    onSaveProject({ ...currentProject, evidence: updatedEvidence });
    setIsAdding(false);
    setNewEvidence({
      title: '',
      type: 'rapport_essais',
      date: new Date().toISOString().split('T')[0],
      author: currentProject.projectLeader || '',
      description: '',
      linkedAspect: 'experimentation',
      probativeStrength: 'Élevée',
      referenceOrUrl: '',
    });
  };

  const removeEvidence = (id: string) => {
    const updated = currentProject.evidence.filter(e => e.id !== id);
    onSaveProject({ ...currentProject, evidence: updated });
  };

  const highStrengthCount = currentProject.evidence.filter(e => e.probativeStrength === 'Élevée').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            Traçabilité & Preuves Contemporaines
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Registre des Éléments de Preuve et Livrables
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Consigner les pièces justificatives contemporaines datées pour sécuriser le contrôle fiscal et l'expertise du MESR.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-2xs self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une pièce justificative</span>
        </button>
      </div>

      {/* Probative strength summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-xs text-slate-500 font-medium">Total pièces enregistrées</span>
          <div className="mt-1 text-xl font-bold font-mono tabular-nums text-slate-900">
            {currentProject.evidence.length}
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-xs text-slate-500 font-medium">Force probante élevée (Certifié / Git / Lab)</span>
          <div className="mt-1 text-xl font-bold font-mono tabular-nums text-emerald-700">
            {highStrengthCount}
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <span className="text-xs text-slate-500 font-medium">Exigence de contrôle fiscal</span>
          <div className="mt-1 text-xs text-slate-700 leading-tight">
            Les documents doivent être <strong>strictement contemporains</strong> de l'exercice déclaré.
          </div>
        </div>
      </div>

      {/* Add Modal / Drawer Form */}
      {isAdding && (
        <form onSubmit={handleAddEvidence} className="p-5 bg-white border border-indigo-200 rounded-xl space-y-4 shadow-sm text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900">
              Enregistrer une nouvelle preuve technique
            </h2>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              Fermer
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Intitulé de la pièce *</label>
              <input
                type="text"
                required
                value={newEvidence.title}
                onChange={(e) => setNewEvidence({ ...newEvidence, title: e.target.value })}
                placeholder="Ex: Rapport d'essais thermiques certifiés NF S99-700"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Type de document *</label>
              <select
                value={newEvidence.type}
                onChange={(e) => setNewEvidence({ ...newEvidence, type: e.target.value as EvidenceType })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-indigo-500"
              >
                {EVIDENCE_TYPES.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Date du document (Année {currentProject.analyzedYear})</label>
              <input
                type="date"
                value={newEvidence.date}
                onChange={(e) => setNewEvidence({ ...newEvidence, date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Auteur / Rédacteur / Organisme</label>
              <input
                type="text"
                value={newEvidence.author}
                onChange={(e) => setNewEvidence({ ...newEvidence, author: e.target.value })}
                placeholder="Ex: Dr. Faure / Laboratoire LNE"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Aspect R&D ou Innovation rattaché</label>
              <select
                value={newEvidence.linkedAspect}
                onChange={(e) => setNewEvidence({ ...newEvidence, linkedAspect: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="etat_art">État de l'art</option>
                <option value="verrou">Verrou scientifique & technique</option>
                <option value="incertitude">Incertitude initiale</option>
                <option value="experimentation">Démarche expérimentale & itérations</option>
                <option value="resultats">Résultats quantitatifs obtenus</option>
                <option value="cii_perfs">CII : Performances supérieures</option>
                <option value="prototypes">CII : Matérialisation Prototypes</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Force probante devant l'administration</label>
              <select
                value={newEvidence.probativeStrength}
                onChange={(e) => setNewEvidence({ ...newEvidence, probativeStrength: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
              >
                <option value="Élevée">Élevée (Rapport labo, commits Git, cahier labo, brevets)</option>
                <option value="Moyenne">Moyenne (Comptes-rendus internes, specs, fiches recette)</option>
                <option value="Faible">Faible (Tickets simples, emails, notes de synthèse a posteriori)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">Référence du fichier / Chemin archivé</label>
              <input
                type="text"
                value={newEvidence.referenceOrUrl}
                onChange={(e) => setNewEvidence({ ...newEvidence, referenceOrUrl: e.target.value })}
                placeholder="Ex: ARCHIVE-CIR-2025/LNE-TEST-01.pdf ou git:sha1:7a8b9c"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">Description du contenu probant</label>
              <textarea
                rows={2}
                value={newEvidence.description}
                onChange={(e) => setNewEvidence({ ...newEvidence, description: e.target.value })}
                placeholder="En quoi ce document atteste-t-il directement de la démarche de recherche ou de la supériorité produit ?"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-2xs"
            >
              Enregistrer la pièce
            </button>
          </div>
        </form>
      )}

      {/* Evidence Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Pièces probantes indexées ({currentProject.evidence.length})
          </h2>
        </div>

        {currentProject.evidence.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {currentProject.evidence.map((ev) => {
              const typeInfo = EVIDENCE_TYPES.find(t => t.id === ev.type) || EVIDENCE_TYPES[0];
              const Icon = typeInfo.icon;

              return (
                <div key={ev.id} className="p-4 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="font-bold text-slate-900 text-sm">{ev.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                        ev.probativeStrength === 'Élevée' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        ev.probativeStrength === 'Moyenne' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        Force {ev.probativeStrength}
                      </span>
                    </div>

                    <p className="text-slate-600 text-xs">
                      {ev.description}
                    </p>

                    <div className="text-[11px] text-slate-400 flex flex-wrap gap-x-4 gap-y-1 pt-1 font-mono">
                      <span>Type : {typeInfo.label}</span>
                      <span>Date : {ev.date}</span>
                      <span>Auteur : {ev.author}</span>
                      {ev.referenceOrUrl && (
                        <span className="text-indigo-600">Réf : {ev.referenceOrUrl}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeEvidence(ev.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors self-end sm:self-center"
                    title="Supprimer cette preuve"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center text-slate-400 space-y-2">
            <FileCheck2 className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs">Aucune preuve rattachée à ce jour. Cliquez sur "Ajouter une pièce justificative".</p>
          </div>
        )}
      </div>
    </div>
  );
};
