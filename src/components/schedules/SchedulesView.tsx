import React, { useState, useMemo } from 'react';
import {
  Clock,
  Calendar,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  CalendarDays,
  SunMedium,
  CheckCheck,
} from 'lucide-react';
import { ChurchSchedule } from '../../types';
import { INITIAL_DEMO_SCHEDULES } from './demoSchedulesData';
import { cmsRepository } from '../../core/persistence';
import { sortSchedules } from './schedulesUtils';
import {
  SchedulesToolbar,
  ScheduleStatusFilter,
  ScheduleSortOption,
  ScheduleViewMode,
} from './SchedulesToolbar';
import { ScheduleCard } from './ScheduleCard';
import { ScheduleTable } from './ScheduleTable';
import { ScheduleEditorModal } from './ScheduleEditorModal';
import { DeleteScheduleConfirmModal } from './DeleteScheduleConfirmModal';

export const SchedulesView: React.FC = () => {
  // Estado principal da grade de cultos persistido localmente
  const [schedulesList, setSchedulesList] = useState<ChurchSchedule[]>(() =>
    cmsRepository.loadSchedules()
  );

  // Snapshot salvo para detecção de alterações pendentes (dirty state)
  const [savedSnapshot, setSavedSnapshot] = useState<ChurchSchedule[]>(() =>
    cmsRepository.loadSchedules()
  );

  // Filtros, Busca, Ordenação e Modo de Visualização
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<ScheduleStatusFilter>('all');
  const [dayFilter, setDayFilter] = useState('all');
  const [sortBy, setSortBy] = useState<ScheduleSortOption>('day_asc');
  const [viewMode, setViewMode] = useState<ScheduleViewMode>('cards');

  // Modais
  const [editingSchedule, setEditingSchedule] =
    useState<ChurchSchedule | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [deletingSchedule, setDeletingSchedule] =
    useState<ChurchSchedule | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Verificação de alterações não salvas
  const isDirty = useMemo(() => {
    return JSON.stringify(schedulesList) !== JSON.stringify(savedSnapshot);
  }, [schedulesList, savedSnapshot]);

  // Lista de dias únicos presentes nos registros para o filtro
  const availableDays = useMemo(() => {
    const set = new Set<string>();
    schedulesList.forEach((s) => {
      if (s.dayOfWeek?.trim()) {
        set.add(s.dayOfWeek.trim());
      }
    });
    return Array.from(set);
  }, [schedulesList]);

  // Estatísticas calculadas estritamente dos dados reais
  const stats = useMemo(() => {
    const total = schedulesList.length;
    let active = 0;
    let inactive = 0;
    let sundayCount = 0;
    const distinctDays = new Set<string>();

    for (const item of schedulesList) {
      if (item.status === 'active') active++;
      else if (item.status === 'inactive') inactive++;

      if (item.dayOfWeek?.toLowerCase() === 'domingo') {
        sundayCount++;
      }

      if (item.dayOfWeek?.trim()) {
        distinctDays.add(item.dayOfWeek.trim().toLowerCase());
      }
    }

    return {
      total,
      active,
      inactive,
      sundayCount,
      daysCount: distinctDays.size,
    };
  }, [schedulesList]);

  // Filtragem estritamente baseada nos dados
  const filteredSchedules = useMemo(() => {
    return schedulesList.filter((item) => {
      // Filtro por Status
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      // Filtro por Dia da Semana
      if (
        dayFilter !== 'all' &&
        item.dayOfWeek?.trim().toLowerCase() !== dayFilter.trim().toLowerCase()
      ) {
        return false;
      }

      // Filtro por Busca Textual
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDay = item.dayOfWeek
          ? item.dayOfWeek.toLowerCase().includes(query)
          : false;
        const matchTime = item.time.toLowerCase().includes(query);
        const matchLoc = item.location
          ? item.location.toLowerCase().includes(query)
          : false;
        const matchDesc = item.description
          ? item.description.toLowerCase().includes(query)
          : false;

        if (
          !matchTitle &&
          !matchDay &&
          !matchTime &&
          !matchLoc &&
          !matchDesc
        ) {
          return false;
        }
      }

      return true;
    });
  }, [schedulesList, statusFilter, dayFilter, searchTerm]);

  // Ordenação
  const sortedSchedules = useMemo(() => {
    return sortSchedules(filteredSchedules, sortBy);
  }, [filteredSchedules, sortBy]);

  // Handlers
  const handleOpenCreateModal = () => {
    setEditingSchedule(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (schedule: ChurchSchedule) => {
    setEditingSchedule(schedule);
    setIsEditorOpen(true);
  };

  const handleOpenDeleteModal = (schedule: ChurchSchedule) => {
    setDeletingSchedule(schedule);
    setIsDeleteOpen(true);
  };

  const handleSaveSchedule = (savedItem: ChurchSchedule) => {
    setSchedulesList((prev) => {
      const exists = prev.some((s) => s.id === savedItem.id);
      if (exists) {
        return prev.map((s) => (s.id === savedItem.id ? savedItem : s));
      }
      return [savedItem, ...prev];
    });
    showToast(
      editingSchedule
        ? 'Horário de culto atualizado com sucesso!'
        : 'Novo horário de culto adicionado com sucesso!'
    );
  };

  const handleConfirmDelete = () => {
    if (!deletingSchedule) return;
    setSchedulesList((prev) =>
      prev.filter((s) => s.id !== deletingSchedule.id)
    );
    setIsDeleteOpen(false);
    setDeletingSchedule(null);
    showToast('Horário de culto removido da grade.');
  };

  const handleToggleStatus = (schedule: ChurchSchedule) => {
    const nextStatus = schedule.status === 'active' ? 'inactive' : 'active';
    setSchedulesList((prev) =>
      prev.map((s) =>
        s.id === schedule.id
          ? {
              ...s,
              status: nextStatus,
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    );
    showToast(
      nextStatus === 'active'
        ? `"${schedule.title}" foi ativado.`
        : `"${schedule.title}" foi pausado.`
    );
  };

  const handleSaveAll = () => {
    cmsRepository.saveSchedules(schedulesList);
    setSavedSnapshot(schedulesList);
    showToast('Todas as alterações na grade de cultos foram salvas no armazenamento local!');
  };

  const handleDiscardChanges = () => {
    setSchedulesList(savedSnapshot);
    showToast('Alterações pendentes foram descartadas.');
  };

  return (
    <div id="schedules-view" className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="schedules-toast"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-stone-900 text-white rounded-xl shadow-xl border border-stone-800 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-stone-900 tracking-tight">
                Horários & Cultos
              </h1>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                Fase 47 (ChurchSchedule)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                Tenant: ib_central
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Programação de cultos regulares, reuniões de oração e atividades eclesiais
            </p>
          </div>
        </div>

        {/* Ações de Estado Salvo / Descarte */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {isDirty && (
            <button
              type="button"
              onClick={handleDiscardChanges}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200"
              title="Descartar alterações não salvas"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Descartar</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={!isDirty}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors shadow-2xs ${
              isDirty
                ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isDirty ? 'Salvar Alterações' : 'Salvo'}</span>
          </button>
        </div>
      </div>

      {/* Banner de Alterações Pendentes */}
      {isDirty && (
        <div className="flex items-center justify-between gap-3 p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium">
              Você possui alterações não salvas na grade de horários. Clique em{' '}
              <strong>Salvar Alterações</strong> para consolidar.
            </span>
          </div>
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-md shadow-2xs transition-colors shrink-0"
          >
            Salvar Agora
          </button>
        </div>
      )}

      {/* Cards de Métricas / Resumo Estatístico */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total de Horários */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Total Cadastrado</span>
            <Clock className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold text-stone-900 tracking-tight">
            {stats.total}
          </div>
          <p className="text-[11px] text-stone-500">Cultos e reuniões no catálogo</p>
        </div>

        {/* Horários Ativos */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Horários Ativos</span>
            <CheckCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 tracking-tight">
            {stats.active}
          </div>
          <p className="text-[11px] text-stone-500">
            {stats.inactive > 0
              ? `${stats.inactive} inativo(s)`
              : 'Todos os cultos visíveis'}
          </p>
        </div>

        {/* Cultos de Domingo */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Cultos Dominicais</span>
            <SunMedium className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-700 tracking-tight">
            {stats.sundayCount}
          </div>
          <p className="text-[11px] text-stone-500">Celebrações de domingo</p>
        </div>

        {/* Dias Atendidos na Semana */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Dias na Semana</span>
            <CalendarDays className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-700 tracking-tight">
            {stats.daysCount}
          </div>
          <p className="text-[11px] text-stone-500">Dias com programação ativa</p>
        </div>
      </div>

      {/* Barra de Ferramentas / Filtros / Ações */}
      <SchedulesToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dayFilter={dayFilter}
        onDayFilterChange={setDayFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddNew={handleOpenCreateModal}
        availableDays={availableDays}
      />

      {/* Lista / Grade de Horários */}
      {sortedSchedules.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-stone-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-stone-900">
            Nenhum horário encontrado
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'all' || dayFilter !== 'all'
              ? 'Nenhum culto corresponde aos filtros e termos de busca aplicados.'
              : 'Nenhum horário cadastrado para esta congregação ainda.'}
          </p>
          <div className="pt-2 flex items-center justify-center gap-2">
            {searchTerm || statusFilter !== 'all' || dayFilter !== 'all' ? (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setDayFilter('all');
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                Limpar Filtros
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
              >
                + Adicionar Primeiro Horário
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedSchedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      ) : (
        <ScheduleTable
          schedules={sortedSchedules}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Modais de Edição e Confirmação de Exclusão */}
      <ScheduleEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveSchedule}
        schedule={editingSchedule}
      />

      <DeleteScheduleConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        schedule={deletingSchedule}
      />
    </div>
  );
};
