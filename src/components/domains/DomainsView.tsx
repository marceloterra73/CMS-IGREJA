import React, { useState } from 'react';
import {
  Globe,
  Plus,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Star,
  Trash2,
  Edit2,
  Shield,
  Layers,
  Info,
  Radio,
  Filter,
} from 'lucide-react';
import {
  SiteDomain,
  SiteDomainType,
  SiteDomainStatus,
} from '../../types';
import { INITIAL_DEMO_DOMAINS } from './demoDomainsData';
import { cmsRepository } from '../../core/persistence';
import { DomainEditorModal } from './DomainEditorModal';
import { DomainDeleteModal } from './DomainDeleteModal';
import { SettingsSectionCard } from '../settings/SettingsSectionCard';

export const DomainsView: React.FC = () => {
  // Estado principal dos domínios do Tenant ('ib_central') persistido localmente
  const [domains, setDomains] = useState<SiteDomain[]>(() =>
    cmsRepository.loadDomains()
  );
  const [savedDomains, setSavedDomains] = useState<SiteDomain[]>(() =>
    cmsRepository.loadDomains()
  );

  // Filtro de listagem: 'all' | 'custom_domain' | 'subdomain'
  const [typeFilter, setTypeFilter] = useState<'all' | SiteDomainType>('all');

  // Estado de modais de Edição e Exclusão
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<SiteDomain | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingDomain, setDeletingDomain] = useState<SiteDomain | null>(null);

  // Estados de feedback e persistência em memória
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [copiedHostname, setCopiedHostname] = useState<string | null>(null);

  // Detecção de alterações não salvas (dirty state)
  const hasUnsavedChanges =
    JSON.stringify(domains) !== JSON.stringify(savedDomains);

  // Identificação do domínio principal atual
  const primaryDomain =
    domains.find((d) => d.isPrimary) || domains[0];

  // Helper para exibir notificações toast
  const showToast = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  // Helper para copiar URL para a área de transferência
  const handleCopyHostname = (hostname: string) => {
    const fullUrl = `https://${hostname}`;
    navigator.clipboard?.writeText(fullUrl).catch(() => {});
    setCopiedHostname(hostname);
    showToast(`Endereço "${fullUrl}" copiado!`);
    setTimeout(() => {
      setCopiedHostname(null);
    }, 2000);
  };

  // Descartar alterações pendentes
  const handleDiscard = () => {
    setDomains(JSON.parse(JSON.stringify(savedDomains)));
    showToast('Alterações de domínios descartadas.');
  };

  // Salvar alterações em memória
  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      cmsRepository.saveDomains(domains);
      setSavedDomains(JSON.parse(JSON.stringify(domains)));
      setIsSaving(false);
      showToast('Configurações de domínios salvas no armazenamento local!');
    }, 400);
  };

  // Tornar um domínio específico como principal (isPrimary = true)
  const handleSetPrimary = (targetDomainId: string) => {
    setDomains((prev) =>
      prev.map((d) => ({
        ...d,
        isPrimary: d.id === targetDomainId,
        updatedAt: new Date().toISOString(),
      }))
    );
    const target = domains.find((d) => d.id === targetDomainId);
    showToast(
      `O domínio "${target?.hostname}" foi definido como principal da igreja.`
    );
  };

  // Alterar situação cadastral rápida (status)
  const handleQuickStatusChange = (
    domainId: string,
    newStatus: SiteDomainStatus
  ) => {
    setDomains((prev) =>
      prev.map((d) => {
        if (d.id !== domainId) return d;
        return {
          ...d,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    showToast(`Situação cadastral do domínio atualizada.`);
  };

  // Abertura do modal de criação
  const handleOpenCreateModal = () => {
    setEditingDomain(null);
    setIsEditorOpen(true);
  };

  // Abertura do modal de edição
  const handleOpenEditModal = (domain: SiteDomain) => {
    setEditingDomain(domain);
    setIsEditorOpen(true);
  };

  // Salvar novo domínio ou edição existente a partir do modal
  const handleSaveModalDomain = (domainData: {
    hostname: string;
    type: SiteDomainType;
    status: SiteDomainStatus;
    isPrimary: boolean;
  }) => {
    const now = new Date().toISOString();

    if (editingDomain) {
      // Atualização de registro existente
      setDomains((prev) => {
        const shouldSetPrimary = domainData.isPrimary;
        return prev.map((d) => {
          if (d.id === editingDomain.id) {
            return {
              ...d,
              hostname: domainData.hostname,
              type: domainData.type,
              status: domainData.status,
              isPrimary: shouldSetPrimary,
              updatedAt: now,
            };
          }
          if (shouldSetPrimary) {
            return { ...d, isPrimary: false };
          }
          return d;
        });
      });
      showToast(`Domínio "${domainData.hostname}" atualizado.`);
    } else {
      // Inclusão de novo registro canônico SiteDomain
      const newDomain: SiteDomain = {
        id: `dom_${Date.now()}`,
        tenantId: 'ib_central',
        hostname: domainData.hostname,
        type: domainData.type,
        status: domainData.status,
        isPrimary: domainData.isPrimary || domains.length === 0,
        createdAt: now,
        updatedAt: now,
      };

      setDomains((prev) => {
        if (newDomain.isPrimary) {
          return [...prev.map((d) => ({ ...d, isPrimary: false })), newDomain];
        }
        return [...prev, newDomain];
      });
      showToast(`Domínio "${domainData.hostname}" conectado com sucesso.`);
    }

    setIsEditorOpen(false);
  };

  // Abertura do modal de exclusão
  const handleOpenDeleteModal = (domain: SiteDomain) => {
    setDeletingDomain(domain);
    setIsDeleteOpen(true);
  };

  // Confirmação de exclusão
  const handleConfirmDelete = () => {
    if (!deletingDomain) return;

    setDomains((prev) => {
      const remaining = prev.filter((d) => d.id !== deletingDomain.id);
      // Se removeu o primário e ainda restam domínios, elege o primeiro como primário
      if (deletingDomain.isPrimary && remaining.length > 0) {
        remaining[0] = { ...remaining[0], isPrimary: true };
      }
      return remaining;
    });

    showToast(`Domínio "${deletingDomain.hostname}" desconectado.`);
    setIsDeleteOpen(false);
    setDeletingDomain(null);
  };

  // Filtragem da lista de domínios
  const filteredDomains = domains.filter((d) => {
    if (typeFilter === 'all') return true;
    return d.type === typeFilter;
  });

  return (
    <div id="domains-view" className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Toast de Notificação */}
      {feedbackToast && (
        <div
          id="domains-feedback-toast"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-stone-900 text-white px-4 py-3 rounded-lg shadow-lg border border-stone-800 text-sm animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Cabeçalho da Rota */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Domínios e Endereços
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              Fase 45
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Gestão visual declarativa de domínios próprios, subdomínios e endereços do portal (Fase 18).
          </p>
        </div>

        {/* Ações de Topo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={!hasUnsavedChanges || isSaving}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Descartar</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={!hasUnsavedChanges || isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 text-stone-950" />
            <span>Conectar Domínio</span>
          </button>
        </div>
      </div>

      {/* Alerta de Modificações Pendentes (Dirty State) */}
      {hasUnsavedChanges && (
        <div
          id="domains-unsaved-banner"
          className="flex items-center justify-between p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold">Existem alterações pendentes nos domínios da congregação.</span>
            <span className="hidden sm:inline text-amber-700">
              Clique em "Salvar Alterações" para persistir as modificações em memória.
            </span>
          </div>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="font-bold underline hover:text-amber-950 transition-colors"
          >
            Salvar agora
          </button>
        </div>
      )}

      {/* 1. CARD EM DESTAQUE: DOMÍNIO PRINCIPAL DA IGREJA */}
      {primaryDomain && (
        <section
          id="primary-domain-card"
          className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 rounded-2xl p-6 text-white border border-stone-800 shadow-md relative overflow-hidden"
        >
          {/* Efeito de brilho de fundo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-400 text-stone-950 shadow-2xs">
                  <Star className="w-3 h-3 fill-stone-950" />
                  <span>DOMÍNIO PRINCIPAL</span>
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                    primaryDomain.status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : primaryDomain.status === 'pending'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-stone-700 text-stone-300 border-stone-600'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      primaryDomain.status === 'active'
                        ? 'bg-emerald-400'
                        : primaryDomain.status === 'pending'
                        ? 'bg-amber-400 animate-pulse'
                        : 'bg-stone-400'
                    }`}
                  />
                  <span>
                    {primaryDomain.status === 'active'
                      ? 'Ativo & Operacional'
                      : primaryDomain.status === 'pending'
                      ? 'Aguardando DNS'
                      : 'Inativo'}
                  </span>
                </span>

                <span className="text-xs text-stone-400 font-mono">
                  {primaryDomain.type === 'custom_domain'
                    ? 'Domínio Próprio'
                    : 'Subdomínio da Plataforma'}
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-2 flex-wrap">
                  <span>https://{primaryDomain.hostname}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyHostname(primaryDomain.hostname)}
                    title="Copiar endereço"
                    className="p-1.5 text-stone-400 hover:text-amber-300 hover:bg-stone-800/80 rounded-lg transition-colors"
                  >
                    {copiedHostname === primaryDomain.hostname ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </h2>
                <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
                  Este é o endereço canônico primário associado ao Tenant <code className="text-stone-300 font-mono">ib_central</code>. Ele é exibido nos materiais de divulgação, redes sociais e navegação do portal público da igreja.
                </p>
              </div>
            </div>

            {/* Ações Rápidas do Domínio Principal */}
            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={() => handleOpenEditModal(primaryDomain)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg border border-stone-700 transition-colors shadow-xs"
              >
                <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Editar</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 2. LISTAGEM COMPLETA DE DOMÍNIOS CADASTRADOS (SiteDomain[]) */}
      <SettingsSectionCard
        id="section-domains-list"
        title="Endereços e Domínios Conectados"
        subtitle="Gerencie todos os hostnames próprios e subdomínios vinculados à congregação (Fase 18)"
        icon={<Globe className="w-4 h-4 text-amber-600" />}
        badge={`${domains.length} endereços`}
      >
        <div className="space-y-4">
          {/* Barra de Filtros */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg border border-stone-200 self-start">
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  typeFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Todos ({domains.length})
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('custom_domain')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  typeFilter === 'custom_domain'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Domínios Próprios ({domains.filter((d) => d.type === 'custom_domain').length})
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('subdomain')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  typeFilter === 'subdomain'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Subdomínios ({domains.filter((d) => d.type === 'subdomain').length})
              </button>
            </div>

            <span className="text-[11px] text-stone-500">
              Mostrando <strong>{filteredDomains.length}</strong> de {domains.length} registros
            </span>
          </div>

          {/* Tabela de Domínios */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider bg-stone-50/50">
                  <th className="py-3 px-4">Endereço (Hostname)</th>
                  <th className="py-3 px-4">Classificação</th>
                  <th className="py-3 px-4">Situação</th>
                  <th className="py-3 px-4">Data de Vínculo</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {filteredDomains.map((domain) => {
                  const isPrimary = Boolean(domain.isPrimary);

                  return (
                    <tr
                      key={domain.id}
                      className={`hover:bg-stone-50/80 transition-colors ${
                        isPrimary ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      {/* Hostname */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isPrimary
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            <Globe className="w-4 h-4" />
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-stone-900">
                                {domain.hostname}
                              </span>
                              {isPrimary && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                                  <Star className="w-2.5 h-2.5 fill-amber-700 text-amber-700" />
                                  PRINCIPAL
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-stone-400 block">
                              ID: {domain.id} • Tenant: {domain.tenantId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Tipo (SiteDomainType) */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                            domain.type === 'custom_domain'
                              ? 'bg-stone-100 text-stone-800 border-stone-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          <Layers className="w-3 h-3" />
                          <span>
                            {domain.type === 'custom_domain'
                              ? 'Domínio Próprio'
                              : 'Subdomínio'}
                          </span>
                        </span>
                      </td>

                      {/* Situação Cadastral (SiteDomainStatus) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={domain.status}
                            onChange={(e) =>
                              handleQuickStatusChange(
                                domain.id,
                                e.target.value as SiteDomainStatus
                              )
                            }
                            className={`text-xs font-semibold rounded-md border px-2 py-1 transition-colors focus:outline-hidden focus:ring-1 focus:ring-stone-900 ${
                              domain.status === 'active'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : domain.status === 'pending'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-stone-100 text-stone-600 border-stone-200'
                            }`}
                          >
                            <option value="active">Ativo</option>
                            <option value="pending">Pendente</option>
                            <option value="inactive">Inativo</option>
                          </select>
                        </div>
                      </td>

                      {/* Data de Vínculo */}
                      <td className="py-3.5 px-4 text-stone-500 font-mono text-[11px]">
                        {new Date(domain.createdAt).toLocaleDateString('pt-BR')}
                      </td>

                      {/* Ações */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Tornar Principal */}
                          {!isPrimary ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(domain.id)}
                              disabled={domain.status === 'inactive'}
                              title={
                                domain.status === 'inactive'
                                  ? 'Ative o domínio antes de defini-lo como principal'
                                  : 'Definir como domínio principal'
                              }
                              className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                            >
                              <Star className="w-4 h-4" />
                            </button>
                          ) : (
                            <span
                              title="Este é o domínio principal ativo"
                              className="p-1.5 text-amber-600"
                            >
                              <Star className="w-4 h-4 fill-amber-500" />
                            </span>
                          )}

                          {/* Copiar Hostname */}
                          <button
                            type="button"
                            onClick={() => handleCopyHostname(domain.hostname)}
                            title="Copiar endereço"
                            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                          >
                            {copiedHostname === domain.hostname ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          {/* Editar */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(domain)}
                            title="Editar configurações deste domínio"
                            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Excluir / Desconectar */}
                          <button
                            type="button"
                            onClick={() => handleOpenDeleteModal(domain)}
                            disabled={domains.length <= 1}
                            title={
                              domains.length <= 1
                                ? 'Não é possível remover o único domínio restante'
                                : 'Desconectar este domínio'
                            }
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-stone-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredDomains.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-stone-400">
                      Nenhum endereço encontrado para o filtro selecionado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </SettingsSectionCard>

      {/* 3. INSTRUÇÕES DECLARATIVAS PARA APONTAMENTO DE DNS (INFORMATIVO) */}
      <SettingsSectionCard
        id="section-dns-instructions"
        title="Orientações Técnicas para Apontamento de Domínio Próprio"
        subtitle="Instruções de configuração declarativa para o registrador de domínio da congregação"
        icon={<Info className="w-4 h-4 text-amber-600" />}
        badge="Informativo"
      >
        <div className="space-y-4 text-xs text-stone-600 leading-relaxed">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <h4 className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-600" />
              <span>Como funciona a conexão de domínio próprio?</span>
            </h4>
            <p>
              Ao utilizar um domínio registrado pela igreja (como no Registro.br, GoDaddy ou Cloudflare), acesse a zona de gerenciamento de DNS do seu registrador e configure as seguintes entradas recomendadas:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border border-stone-200 rounded-xl overflow-hidden">
              <thead className="bg-stone-100/80 text-[11px] font-bold text-stone-700 uppercase">
                <tr>
                  <th className="py-2.5 px-4 border-b border-stone-200">Tipo de Registro</th>
                  <th className="py-2.5 px-4 border-b border-stone-200">Nome / Entrada</th>
                  <th className="py-2.5 px-4 border-b border-stone-200">Destino / Valor</th>
                  <th className="py-2.5 px-4 border-b border-stone-200">Finalidade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-mono text-[11px]">
                <tr className="bg-white">
                  <td className="py-2.5 px-4 font-bold text-stone-900">CNAME</td>
                  <td className="py-2.5 px-4 text-stone-700">www</td>
                  <td className="py-2.5 px-4 text-stone-900 font-bold">cname.appigreja.com.br</td>
                  <td className="py-2.5 px-4 font-sans text-stone-600 text-[11px]">
                    Encaminha o tráfego com "www" para os servidores do portal.
                  </td>
                </tr>
                <tr className="bg-stone-50/50">
                  <td className="py-2.5 px-4 font-bold text-stone-900">A (Raiz)</td>
                  <td className="py-2.5 px-4 text-stone-700">@ (ou vazio)</td>
                  <td className="py-2.5 px-4 text-stone-900 font-bold">192.0.2.1</td>
                  <td className="py-2.5 px-4 font-sans text-stone-600 text-[11px]">
                    Aponta o domínio sem "www" para o balanceador da plataforma.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-900 text-[11px]">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Segurança e Isolamento:</strong> A plataforma do CMS não realiza alterações automáticas em provedores de DNS externos nem armazena credenciais de registradores. A propagação das entradas DNS pode levar de 30 minutos a 24 horas dependendo do seu provedor.
            </div>
          </div>
        </div>
      </SettingsSectionCard>

      {/* Modal de Criação / Edição de Domínio */}
      <DomainEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveModalDomain}
        editingDomain={editingDomain}
        existingDomains={domains}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DomainDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingDomain(null);
        }}
        onConfirm={handleConfirmDelete}
        domain={deletingDomain}
      />
    </div>
  );
};
