import React, { useState, useEffect } from 'react';
import {
  Globe,
  X,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Layers,
} from 'lucide-react';
import {
  SiteDomain,
  SiteDomainType,
  SiteDomainStatus,
} from '../../types';

interface DomainEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (domainData: {
    hostname: string;
    type: SiteDomainType;
    status: SiteDomainStatus;
    isPrimary: boolean;
  }) => void;
  editingDomain?: SiteDomain | null;
  existingDomains: SiteDomain[];
}

export const DomainEditorModal: React.FC<DomainEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingDomain,
  existingDomains,
}) => {
  const [hostname, setHostname] = useState('');
  const [type, setType] = useState<SiteDomainType>('custom_domain');
  const [status, setStatus] = useState<SiteDomainStatus>('active');
  const [isPrimary, setIsPrimary] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingDomain) {
      setHostname(editingDomain.hostname);
      setType(editingDomain.type);
      setStatus(editingDomain.status);
      setIsPrimary(editingDomain.isPrimary ?? false);
      setError(null);
    } else {
      setHostname('');
      setType('custom_domain');
      setStatus('active');
      setIsPrimary(false);
      setError(null);
    }
  }, [editingDomain, isOpen]);

  if (!isOpen) return null;

  // Sanitizador de hostname: remove https://, http://, espaços e barras finais
  const sanitizeHostname = (input: string): string => {
    return input
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//i, '')
      .replace(/\/+$/, '');
  };

  const handleHostnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHostname(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHostname = sanitizeHostname(hostname);

    if (!cleanHostname) {
      setError('Por favor, informe o endereço de domínio ou subdomínio.');
      return;
    }

    // Validação de formato básico de domínio (ex: igreja.com.br ou sub.igreja.com)
    const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/i;
    if (!domainRegex.test(cleanHostname)) {
      setError(
        'Formato de domínio inválido. Exemplo correto: "www.igrejacentral.com.br" ou "central.appigreja.com.br" (sem http:// ou barras).'
      );
      return;
    }

    // Verificar se o hostname já existe em outro registro (exceto no próprio em caso de edição)
    const isDuplicate = existingDomains.some(
      (d) =>
        d.hostname.toLowerCase() === cleanHostname &&
        (!editingDomain || d.id !== editingDomain.id)
    );

    if (isDuplicate) {
      setError(`O domínio "${cleanHostname}" já está cadastrado para esta congregação.`);
      return;
    }

    onSave({
      hostname: cleanHostname,
      type,
      status,
      isPrimary,
    });
  };

  return (
    <div
      id="domain-editor-modal-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="domain-editor-modal"
        className="bg-white rounded-2xl border border-stone-200 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-stone-900">
                {editingDomain ? 'Editar Endereço de Domínio' : 'Conectar Novo Domínio'}
              </h2>
              <p className="text-xs text-stone-500">
                Contrato Canônico <code className="font-mono text-stone-700">SiteDomain</code> (Fase 18)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Mensagem de Erro se houver */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Campo: Hostname */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Endereço do Domínio (hostname) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={hostname}
                onChange={handleHostnameChange}
                placeholder="ex: www.igrejabatistacentral.com.br"
                className="w-full text-xs font-mono px-3.5 py-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
                required
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Informe apenas o nome do domínio (sem <code className="font-mono text-stone-600">https://</code> ou caminhos).
            </p>
          </div>

          {/* Campo: Tipo (SiteDomainType) */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Classificação do Endereço (type)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  type === 'custom_domain'
                    ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="domainType"
                  value="custom_domain"
                  checked={type === 'custom_domain'}
                  onChange={() => setType('custom_domain')}
                  className="mt-0.5 text-stone-900 focus:ring-stone-900 border-stone-300"
                />
                <div>
                  <span className="text-xs font-bold text-stone-900 block">
                    Domínio Próprio
                  </span>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    Registrado pela igreja (ex: meudominio.com.br)
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  type === 'subdomain'
                    ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="domainType"
                  value="subdomain"
                  checked={type === 'subdomain'}
                  onChange={() => setType('subdomain')}
                  className="mt-0.5 text-stone-900 focus:ring-stone-900 border-stone-300"
                />
                <div>
                  <span className="text-xs font-bold text-stone-900 block">
                    Subdomínio
                  </span>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    Endereço na plataforma (ex: nome.appigreja.com.br)
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Campo: Status (SiteDomainStatus) */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Situação Cadastral (status)
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as SiteDomainStatus)}
              className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
            >
              <option value="active">Ativo (Pronto para receber acessos)</option>
              <option value="pending">Pendente (Aguardando propagação de DNS)</option>
              <option value="inactive">Inativo (Temporariamente desativado)</option>
            </select>
          </div>

          {/* Campo: isPrimary */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 flex items-start gap-3">
            <input
              type="checkbox"
              id="is-primary-checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded text-stone-900 focus:ring-stone-900 border-stone-300"
            />
            <div>
              <label
                htmlFor="is-primary-checkbox"
                className="text-xs font-bold text-stone-900 block cursor-pointer"
              >
                Definir como Domínio Principal da Igreja (isPrimary)
              </label>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                Este endereço será a URL canônica padrão utilizada nos links públicos, materiais e comunicações oficiais da congregação.
              </p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs"
            >
              {editingDomain ? 'Salvar Alterações' : 'Conectar Domínio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
