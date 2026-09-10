import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, MapPin, AlertCircle, Save, Check } from 'lucide-react';
import { ChurchSchedule, ScheduleStatus } from '../../types';
import { CANONICAL_WEEKDAYS } from './schedulesUtils';

interface ScheduleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: ChurchSchedule) => void;
  schedule: ChurchSchedule | null;
}

export const ScheduleEditorModal: React.FC<ScheduleEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  schedule,
}) => {
  const isEditing = Boolean(schedule);

  // Form State estritamente baseado nos campos de ChurchSchedule
  const [title, setTitle] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<string>('Domingo');
  const [customDay, setCustomDay] = useState('');
  const [isCustomDay, setIsCustomDay] = useState(false);
  const [time, setTime] = useState('10:00');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<ScheduleStatus>('active');

  // Validação
  const [errors, setErrors] = useState<{ title?: string; time?: string }>({});

  useEffect(() => {
    if (schedule) {
      setTitle(schedule.title || '');
      const isKnownDay = CANONICAL_WEEKDAYS.some(
        (w) => w.toLowerCase() === (schedule.dayOfWeek || '').toLowerCase()
      );
      if (isKnownDay) {
        setDayOfWeek(schedule.dayOfWeek || 'Domingo');
        setIsCustomDay(false);
        setCustomDay('');
      } else if (schedule.dayOfWeek) {
        setDayOfWeek('custom');
        setIsCustomDay(true);
        setCustomDay(schedule.dayOfWeek);
      } else {
        setDayOfWeek('');
        setIsCustomDay(false);
        setCustomDay('');
      }
      setTime(schedule.time || '10:00');
      setDescription(schedule.description || '');
      setLocation(schedule.location || '');
      setStatus(schedule.status || 'active');
    } else {
      // Padrão para novo registro
      setTitle('');
      setDayOfWeek('Domingo');
      setIsCustomDay(false);
      setCustomDay('');
      setTime('10:00');
      setDescription('');
      setLocation('Templo Principal');
      setStatus('active');
    }
    setErrors({});
  }, [schedule, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string; time?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'O título ou nome do culto é obrigatório.';
    }
    if (!time.trim()) {
      newErrors.time = 'O horário é obrigatório.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalDayOfWeek = isCustomDay
      ? customDay.trim() || undefined
      : dayOfWeek.trim() || undefined;

    const now = new Date().toISOString();

    const payload: ChurchSchedule = {
      id: schedule?.id || `sched_${Date.now()}`,
      tenantId: schedule?.tenantId || 'ib_central',
      title: title.trim(),
      dayOfWeek: finalDayOfWeek,
      time: time.trim(),
      description: description.trim() || undefined,
      location: location.trim() || undefined,
      status,
      createdAt: schedule?.createdAt || now,
      updatedAt: now,
    };

    onSave(payload);
    onClose();
  };

  return (
    <div
      id="schedule-editor-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="schedule-editor-modal-container"
        className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Cabeçalho do Modal */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between gap-3 bg-stone-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                {isEditing ? 'Editar Horário de Culto' : 'Novo Horário de Culto'}
              </h2>
              <span className="text-[11px] text-stone-500">
                Tenant: <code className="font-mono text-stone-700">ib_central</code> (Fase 47)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Campo 1: Título / Nome do Culto (Obrigatório) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-800">
              Nome do Culto ou Atividade <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="Ex: Culto de Celebração & Família"
              className={`w-full text-xs px-3.5 py-2.5 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white ${
                errors.title ? 'border-rose-400 focus:ring-rose-500' : 'border-stone-300'
              }`}
            />
            {errors.title && (
              <p className="text-[11px] text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Grid: Dia da Semana & Horário */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Campo 2: Dia da Semana */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-800">
                Dia da Semana
              </label>
              <select
                value={isCustomDay ? 'custom' : dayOfWeek}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'custom') {
                    setIsCustomDay(true);
                  } else {
                    setIsCustomDay(false);
                    setDayOfWeek(val);
                  }
                }}
                className="w-full text-xs px-3 py-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
              >
                <option value="">Não especificado</option>
                {CANONICAL_WEEKDAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
                <option value="custom">Outro / Recorrência especial...</option>
              </select>

              {isCustomDay && (
                <input
                  type="text"
                  value={customDay}
                  onChange={(e) => setCustomDay(e.target.value)}
                  placeholder="Ex: Todo 1º Sábado do Mês"
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white mt-1.5"
                />
              )}
            </div>

            {/* Campo 3: Horário (Obrigatório) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-800">
                Horário <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  if (errors.time) setErrors((prev) => ({ ...prev, time: undefined }));
                }}
                placeholder="Ex: 10:00 ou 19h30"
                className={`w-full text-xs font-mono px-3.5 py-2.5 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white ${
                  errors.time ? 'border-rose-400 focus:ring-rose-500' : 'border-stone-300'
                }`}
              />
              {errors.time && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.time}</span>
                </p>
              )}
            </div>
          </div>

          {/* Campo 4: Localização */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-800">
              Localização / Espaço
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Templo Principal, Salão Social ou Online"
                className="w-full text-xs pl-9 pr-3.5 py-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white"
              />
            </div>
          </div>

          {/* Campo 5: Descrição Detalhada */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-800">
              Descrição / Detalhes para o Visitante
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva as características do culto, faixas etárias atendidas (ex: EBD infantil, berçário) ou formato da reunião..."
              className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 bg-white resize-none"
            />
          </div>

          {/* Campo 6: Status (active | inactive) */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-semibold text-stone-800">
              Status de Exibição
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setStatus('active')}
                className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                  status === 'active'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Ativo (Exibido no Site)</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('inactive')}
                className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                  status === 'inactive'
                    ? 'bg-stone-200/80 text-stone-900 border-stone-400'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-stone-400" />
                <span>Inativo (Oculto)</span>
              </button>
            </div>
          </div>
        </form>

        {/* Rodapé de Ações */}
        <div className="p-4 px-5 border-t border-stone-200 bg-stone-50/80 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEditing ? 'Salvar Alterações' : 'Criar Horário'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
