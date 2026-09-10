import React, { useState } from 'react';
import {
  Gift,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Shield,
  ShieldCheck,
  Building2,
  QrCode,
  Copy,
  Check,
  Eye,
  FileText,
  Lock,
  Sparkles,
  Info,
} from 'lucide-react';
import { ChurchDonationInfo } from '../../types';
import { INITIAL_DEMO_DONATION } from './demoDonationData';
import { cmsRepository } from '../../core/persistence';
import { DonationPublicPreview } from './DonationPublicPreview';
import { SettingsSectionCard } from '../settings/SettingsSectionCard';

export const DonationsView: React.FC = () => {
  // Estado principal das configurações de Doações do Tenant ('ib_central') persistido localmente
  const [donation, setDonation] = useState<ChurchDonationInfo>(() =>
    cmsRepository.loadDonations()
  );
  const [savedDonation, setSavedDonation] = useState<ChurchDonationInfo>(() =>
    cmsRepository.loadDonations()
  );

  // Estados de feedback e persistência em memória
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  // Detecção de alterações não salvas (dirty state)
  const hasUnsavedChanges =
    JSON.stringify(donation) !== JSON.stringify(savedDonation);

  // Helper para exibir notificações toast
  const showToast = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  // Helper para copiar a chave PIX
  const handleCopyPix = () => {
    if (!donation.pixKey) return;
    navigator.clipboard?.writeText(donation.pixKey).catch(() => {});
    setCopiedPix(true);
    showToast('Chave PIX copiada para a área de transferência!');
    setTimeout(() => {
      setCopiedPix(false);
    }, 2000);
  };

  // Descartar alterações pendentes
  const handleDiscard = () => {
    setDonation(JSON.parse(JSON.stringify(savedDonation)));
    showToast('Alterações descartadas com sucesso.');
  };

  // Salvar alterações em memória
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!donation.title.trim()) {
      showToast('O título das informações de doação é obrigatório.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const updated: ChurchDonationInfo = {
        ...donation,
        updatedAt: new Date().toISOString(),
      };
      cmsRepository.saveDonations(updated);
      setDonation(updated);
      setSavedDonation(JSON.parse(JSON.stringify(updated)));
      setIsSaving(false);
      showToast('Configurações de Doações salvas no armazenamento local!');
    }, 400);
  };

  // Atualização genérica de campos da interface
  const handleChange = <K extends keyof ChurchDonationInfo>(
    field: K,
    value: ChurchDonationInfo[K]
  ) => {
    setDonation((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Detecção orientativa do tipo de chave PIX para feedback visual amigável (sem alterar o contrato)
  const detectPixKeyType = (key?: string): string => {
    if (!key || !key.trim()) return 'Não informada';
    const clean = key.trim();
    if (/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/.test(clean)) return 'CNPJ';
    if (/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(clean)) return 'CPF';
    if (/^[\w.-]+@[\w.-]+\.\w+$/.test(clean)) return 'E-mail';
    if (/^\+?\d{10,14}$/.test(clean.replace(/\D/g, ''))) return 'Telefone';
    if (clean.length > 25) return 'Chave Aleatória (EVP)';
    return 'Chave Personalizada';
  };

  return (
    <div id="donations-management-view" className="space-y-6">
      {/* Toast de Notificação */}
      {feedbackToast && (
        <div
          id="donations-toast-notification"
          className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 border border-stone-800"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Cabeçalho do Módulo */}
      <div
        id="donations-header"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider">
              Fase 48
            </span>
            <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
              Tenant: {donation.tenantId}
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${
                donation.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-stone-100 text-stone-500 border-stone-200'
              }`}
            >
              {donation.status === 'active' ? 'Ativo no Site' : 'Inativo no Site'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2.5">
            <Gift className="w-6 h-6 text-amber-600" />
            Gestão Visual de Doações & PIX
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Configuração das informações de dízimos, ofertas, chave PIX oficial e
            contas bancárias para contribuições voluntárias da igreja.
          </p>
        </div>

        {/* Botões de Ação do Cabeçalho */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            id="donations-discard-btn"
            onClick={handleDiscard}
            disabled={!hasUnsavedChanges || isSaving}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 active:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Descartar
          </button>

          <button
            type="button"
            id="donations-save-btn"
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 active:bg-black text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-amber-400" />
                Salvar Configurações
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alerta de Alterações Não Salvas (Dirty State) */}
      {hasUnsavedChanges && (
        <div
          id="donations-unsaved-banner"
          className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-amber-900 animate-in fade-in duration-150"
        >
          <div className="flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Você possui <strong>alterações não salvas</strong> nas
              configurações de Doações e PIX.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDiscard}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline px-2 py-1"
            >
              Descartar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white px-3 py-1 rounded-md transition-colors"
            >
              Salvar Agora
            </button>
          </div>
        </div>
      )}

      {/* Resumo Visual / Métricas Derivadas dos Dados Reais */}
      <div
        id="donations-status-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
      >
        <div className="p-4 rounded-xl border border-stone-200 bg-white">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Status de Exibição
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                donation.status === 'active' ? 'bg-emerald-500' : 'bg-stone-400'
              }`}
            />
            <span className="text-base font-bold text-stone-900">
              {donation.status === 'active' ? 'Ativo & Visível' : 'Inativo / Oculto'}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {donation.status === 'active'
              ? 'Exibido publicamente aos visitantes'
              : 'Oculto na página pública'}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-stone-200 bg-white">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Chave PIX
          </div>
          <div className="flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span className="text-base font-bold text-stone-900 truncate">
              {donation.pixKey ? 'Configurada' : 'Não Informada'}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Tipo: {detectPixKeyType(donation.pixKey)}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-stone-200 bg-white">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Dados Bancários
          </div>
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-stone-600" />
            <span className="text-base font-bold text-stone-900">
              {donation.bankAccountInfo?.trim() ? 'Configurado' : 'Não Informado'}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {donation.bankAccountInfo?.trim()
              ? 'Transferências e depósitos disponíveis'
              : 'Sem conta cadastrada'}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-stone-200 bg-white">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Orientações de Envio
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-600" />
            <span className="text-base font-bold text-stone-900">
              {donation.instructions?.trim() ? 'Cadastradas' : 'Opcional'}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {donation.instructions?.trim()
              ? 'Instruções para a congregação'
              : 'Sem orientações adicionais'}
          </p>
        </div>
      </div>

      {/* Alternador de Visualização (Configurações vs Pré-Visualização) */}
      <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl w-fit border border-stone-200">
        <button
          type="button"
          id="donations-tab-editor"
          onClick={() => setActiveTab('editor')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'editor'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Formulário de Configuração
        </button>
        <button
          type="button"
          id="donations-tab-preview"
          onClick={() => setActiveTab('preview')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'preview'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-stone-500" />
          Pré-Visualização do Site
        </button>
      </div>

      {/* Conteúdo da Aba Ativa */}
      {activeTab === 'preview' ? (
        <DonationPublicPreview donation={donation} />
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Seção 1: Status de Publicação e Título Principal */}
          <SettingsSectionCard
            id="donations-general-settings"
            title="Informações Principais & Status"
            subtitle="Defina o título, a mensagem pastoral de acolhimento e a ativação pública."
            icon={<Gift className="w-4 h-4 text-amber-700" />}
            badge="Contrato Canônico"
          >
            {/* Ativação Global do Módulo */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-stone-200 bg-stone-50/70">
              <div>
                <span className="text-xs font-bold text-stone-900 block">
                  Exibir Módulo de Doações no Site Público
                </span>
                <p className="text-xs text-stone-500 mt-0.5">
                  Quando ativado, os dados de PIX e transferências bancárias ficam
                  visíveis para os membros e visitantes da congregação.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold ${
                    donation.status === 'active'
                      ? 'text-emerald-700'
                      : 'text-stone-500'
                  }`}
                >
                  {donation.status === 'active' ? 'Ativado' : 'Desativado'}
                </span>
                <button
                  type="button"
                  id="donation-status-toggle"
                  onClick={() =>
                    handleChange(
                      'status',
                      donation.status === 'active' ? 'inactive' : 'active'
                    )
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    donation.status === 'active' ? 'bg-emerald-600' : 'bg-stone-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      donation.status === 'active'
                        ? 'translate-x-5'
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Título do Bloco */}
            <div>
              <label
                htmlFor="donation-title-input"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
              >
                Título do Bloco / Seção <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="donation-title-input"
                value={donation.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Ex: Dízimos e Ofertas Missionárias"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Nome de exibição principal exibido no topo da seção de contribuições.
              </p>
            </div>

            {/* Descrição / Mensagem Pastoral */}
            <div>
              <label
                htmlFor="donation-description-input"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
              >
                Descrição / Mensagem Pastoral (Opcional)
              </label>
              <textarea
                id="donation-description-input"
                rows={3}
                value={donation.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Ex: Contribua com a manutenção do templo e sustento de nossas frentes missionárias..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Texto acolhedor ou versículo bíblico orientador para a congregação.
              </p>
            </div>
          </SettingsSectionCard>

          {/* Seção 2: Chave PIX */}
          <SettingsSectionCard
            id="donations-pix-settings"
            title="Chave PIX da Igreja"
            subtitle="Configuração da chave PIX oficial para contribuições instantâneas sem intermediários."
            icon={<QrCode className="w-4 h-4 text-emerald-700" />}
            badge="PIX Direto"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="donation-pixkey-input"
                  className="block text-xs font-bold text-stone-700 uppercase tracking-wider"
                >
                  Chave PIX Oficial
                </label>
                {donation.pixKey && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Tipo detectado: {detectPixKeyType(donation.pixKey)}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  id="donation-pixkey-input"
                  value={donation.pixKey || ''}
                  onChange={(e) => handleChange('pixKey', e.target.value)}
                  placeholder="Ex: contato@igrejacentral.org.br ou CNPJ 12.345.678/0001-90"
                  className="flex-1 px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />

                <button
                  type="button"
                  id="donation-copy-pix-btn"
                  onClick={handleCopyPix}
                  disabled={!donation.pixKey?.trim()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-stone-300 bg-stone-50 hover:bg-stone-100 active:bg-stone-200 text-xs font-bold text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {copiedPix ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-stone-500" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-stone-500 mt-1.5">
                Pode ser o CNPJ da igreja, e-mail institucional, celular oficial
                ou chave aleatória gerada pelo seu banco.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2.5 text-xs text-stone-600">
              <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <p>
                <strong>Recomendação de Transparência:</strong> É uma boa prática
                eclesial utilizar a chave vinculada ao <strong>CNPJ</strong> da
                congregação para que o membro confirme a titularidade oficial da
                igreja antes de concluir o envio.
              </p>
            </div>
          </SettingsSectionCard>

          {/* Seção 3: Dados Bancários Institucionais */}
          <SettingsSectionCard
            id="donations-bank-settings"
            title="Contas Bancárias & Transferências"
            subtitle="Informações de agência, conta corrente e favorecido para transferências bancárias (TED/DOC)."
            icon={<Building2 className="w-4 h-4 text-stone-700" />}
            badge="Bancário"
          >
            <div>
              <label
                htmlFor="donation-bank-input"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
              >
                Dados da Conta Bancária
              </label>
              <textarea
                id="donation-bank-input"
                rows={4}
                value={donation.bankAccountInfo || ''}
                onChange={(e) => handleChange('bankAccountInfo', e.target.value)}
                placeholder={'Banco do Brasil (001)\nAgência: 1234-5\nConta Corrente: 98765-4\nFavorecido: Igreja Batista Central\nCNPJ: 12.345.678/0001-90'}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm font-mono leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Insira o nome do banco, código de compensação, número de agência,
                conta corrente, razão social e CNPJ.
              </p>
            </div>
          </SettingsSectionCard>

          {/* Seção 4: Instruções Adicionais & Comprovantes */}
          <SettingsSectionCard
            id="donations-instructions-settings"
            title="Instruções Adicionais & Destinação"
            subtitle="Orientações aos membros sobre envio de comprovantes e finalidades de ofertas."
            icon={<FileText className="w-4 h-4 text-amber-700" />}
            badge="Secretaria"
          >
            <div>
              <label
                htmlFor="donation-instructions-input"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
              >
                Instruções para Comprovantes e Ofertas Designadas
              </label>
              <textarea
                id="donation-instructions-input"
                rows={3}
                value={donation.instructions || ''}
                onChange={(e) => handleChange('instructions', e.target.value)}
                placeholder="Ex: Caso deseje destinar sua oferta para Missões ou Ação Social, informe no comprovante enviado ao WhatsApp da secretaria..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Orientações para identificação de dízimos ou destinação de ofertas
                missionárias e de construção.
              </p>
            </div>
          </SettingsSectionCard>

          {/* Seção 5: Segurança e Fronteira Arquitetural */}
          <SettingsSectionCard
            id="donations-security-card"
            title="Segurança & Fronteira Arquitetural"
            subtitle="Garantia de conformidade, ausência de custódia e isolamento multi-tenant."
            icon={<ShieldCheck className="w-4 h-4 text-emerald-700" />}
            badge="Fase 48"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-stone-600">
              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block mb-0.5">
                    Zero Custódia & Sem Gateway
                  </span>
                  <p className="text-stone-500 text-[11px] leading-relaxed">
                    O CMS armazena exclusivamente orientações declarativas. Todas
                    as doações e transferências ocorrem diretamente entre o doador e
                    a instituição financeira da igreja, sem intermediação ou taxas.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block mb-0.5">
                    Isolamento Multi-Tenant Estrito
                  </span>
                  <p className="text-stone-500 text-[11px] leading-relaxed">
                    As informações bancárias e de PIX pertencem estritamente ao
                    tenant atual ({donation.tenantId}). Não há compartilhamento
                    cruzado de dados entre diferentes igrejas.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 flex items-center gap-2 text-xs text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Última atualização registrada no estado:{' '}
                <strong>
                  {donation.updatedAt
                    ? new Date(donation.updatedAt).toLocaleString('pt-BR')
                    : 'Não informada'}
                </strong>
              </span>
            </div>
          </SettingsSectionCard>

          {/* Botões do Rodapé do Formulário */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              id="donations-footer-discard-btn"
              onClick={handleDiscard}
              disabled={!hasUnsavedChanges || isSaving}
              className="px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 active:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Descartar Alterações
            </button>

            <button
              type="submit"
              id="donations-footer-save-btn"
              disabled={!hasUnsavedChanges || isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 active:bg-black text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Salvando Dados...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>Salvar Configurações de Doação</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
