import React, { useEffect, useMemo, useState } from 'react';
import {
  Users, UsersRound, GraduationCap, WalletCards, Package, CalendarDays,
  FolderOpen, ArrowUpRight, Plus, Search, RefreshCw, Church
} from 'lucide-react';

type ModuleKey = 'people' | 'groups' | 'education' | 'finance' | 'assets' | 'calendar' | 'media';

type Person = { id: string; fullName: string; category?: string | null; role?: string | null; isActive?: boolean };
type Group = { id: string; name: string; category?: string | null; meetingDay?: string | null; location?: string | null; isActive?: boolean };
type Transaction = { id: string; description: string; kind: string; amount: string; status?: string };
type Summary = { people: number; groups: number; studies: number; transactions: number };

const modules: { key: ModuleKey; label: string; icon: React.ElementType; description: string }[] = [
  { key: 'people', label: 'Pessoas', icon: Users, description: 'Membros, contatos, cargos e categorias' },
  { key: 'groups', label: 'Grupos', icon: UsersRound, description: 'Células, ministérios, líderes e reuniões' },
  { key: 'education', label: 'Ensino', icon: GraduationCap, description: 'Estudos, escolas, turmas e discipulado' },
  { key: 'finance', label: 'Financeiro', icon: WalletCards, description: 'Receitas, despesas, contas e centros de custo' },
  { key: 'assets', label: 'Patrimônio', icon: Package, description: 'Bens, locais, responsáveis e movimentações' },
  { key: 'calendar', label: 'Agenda', icon: CalendarDays, description: 'Eventos, programas, mural e notificações' },
  { key: 'media', label: 'Mídias', icon: FolderOpen, description: 'Fotos, vídeos, documentos e certificados' },
];

async function api<T>(path: string): Promise<T> {
  const response = await fetch('/api/v1/church' + path, { credentials: 'include' });
  if (!response.ok) throw new Error('API indisponível');
  return response.json();
}

export const ChurchFlowView: React.FC = () => {
  const [active, setActive] = useState<ModuleKey>('people');
  const [query, setQuery] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({ people: 0, groups: 0, studies: 0, transactions: 0 });
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('Conectando ao núcleo ChurchFlow…');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    try {
      const [p, g, t, s] = await Promise.all([
        api<Person[]>('/people'),
        api<Group[]>('/groups'),
        api<Transaction[]>('/finance/transactions'),
        api<unknown[]>('/education/studies'),
      ]);
      setPeople(p); setGroups(g); setTransactions(t);
      setSummary({ people: p.length, groups: g.length, studies: s.length, transactions: t.length });
      setNotice('Dados carregados da API.');
    } catch {
      setNotice('Modo visual: a interface está pronta e aguarda autenticação/conexão do banco.');
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const filteredPeople = useMemo(() => people.filter(p =>
    (p.fullName || '').toLowerCase().includes(query.toLowerCase())
  ), [people, query]);

  const openCreate = () => {
    setForm({});
    setShowForm(true);
  };

  const submitCreate = async () => {
    try {
      if (active === 'people') {
        await api('/people', { method: 'POST', body: JSON.stringify({ fullName: form.fullName, preferredName: form.preferredName, phone: form.phone, email: form.email, category: form.category, role: form.role }) });
      } else if (active === 'groups') {
        await api('/groups', { method: 'POST', body: JSON.stringify({ name: form.name, category: form.category, meetingDay: form.meetingDay, meetingTime: form.meetingTime, location: form.location }) });
      } else if (active === 'education') {
        await api('/education/studies', { method: 'POST', body: JSON.stringify({ title: form.title, description: form.description, category: form.category }) });
      } else if (active === 'finance') {
        const accounts = await api<{id: string}[]>('/finance/accounts');
        const accountId = form.accountId || accounts[0]?.id;
        if (!accountId) throw new Error('Crie uma conta financeira antes do lançamento.');
        await api('/finance/transactions', { method: 'POST', body: JSON.stringify({ accountId, description: form.description, kind: form.kind || 'expense', amount: form.amount, status: 'pending' }) });
      } else {
        setNotice('Cadastro rápido deste módulo será conectado na próxima camada.');
        setShowForm(false);
        return;
      }
      setShowForm(false);
      await load();
      setNotice('Registro criado com sucesso.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Não foi possível salvar.');
    }
  };

  const cards = [
    { label: 'Pessoas', value: summary.people, icon: Users },
    { label: 'Grupos', value: summary.groups, icon: UsersRound },
    { label: 'Estudos', value: summary.studies, icon: GraduationCap },
    { label: 'Lançamentos', value: summary.transactions, icon: WalletCards },
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-stone-950 text-white p-6 sm:p-8 shadow-sm overflow-hidden relative">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-amber-500/15" />
        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold mb-3">
              <Church className="w-4 h-4" /> CHURCHFLOW
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Gestão Integrada para Igrejas</h1>
            <p className="text-stone-400 mt-2 max-w-2xl text-sm">
              Um painel único para pessoas, grupos, ensino, financeiro, patrimônio, agenda e mídias.
            </p>
          </div>
          <button onClick={() => void load()} disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-semibold text-sm hover:bg-amber-400 disabled:opacity-60">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Atualizar dados
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(card => {
          const Icon = card.icon;
          return <div key={card.label} className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center mb-3"><Icon className="w-4 h-4 text-stone-700" /></div>
            <div className="text-2xl font-bold">{card.value}</div><div className="text-xs text-stone-500 mt-1">{card.label}</div>
          </div>;
        })}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {modules.map(m => {
          const Icon = m.icon;
          return <button key={m.key} onClick={() => setActive(m.key)}
            className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition ${active === m.key ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'}`}>
            <Icon className="w-4 h-4" /> {m.label}
          </button>;
        })}
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-bold text-stone-900">{modules.find(m => m.key === active)?.label}</h2>
            <p className="text-xs text-stone-500 mt-1">{modules.find(m => m.key === active)?.description}</p>
          </div>
          <div className="flex gap-2">
            <div className="relative"><Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar…" className="pl-9 pr-3 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:border-amber-500 w-48" />
            </div>
            <button onClick={openCreate} className="px-3 py-2 rounded-lg bg-amber-500 text-stone-950 text-xs font-bold inline-flex items-center gap-1"><Plus className="w-4 h-4" /> Novo</button>
          </div>
        </div>

        {active === 'people' && <div className="divide-y divide-stone-100">
          {filteredPeople.slice(0, 10).map(p => <div key={p.id} className="p-4 flex items-center justify-between gap-4">
            <div><div className="font-semibold text-sm">{p.fullName}</div><div className="text-xs text-stone-500">{p.category || 'Sem categoria'} {p.role ? '• ' + p.role : ''}</div></div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">{p.isActive === false ? 'Inativo' : 'Ativo'}</span>
          </div>)}
          {!filteredPeople.length && <Empty notice={notice} />}
        </div>}

        {active === 'groups' && <div className="divide-y divide-stone-100">
          {groups.slice(0, 10).map(g => <div key={g.id} className="p-4 flex items-center justify-between gap-4"><div><div className="font-semibold text-sm">{g.name}</div><div className="text-xs text-stone-500">{g.category || 'Grupo'} {g.meetingDay ? '• ' + g.meetingDay : ''}</div></div><ArrowUpRight className="w-4 h-4 text-stone-400" /></div>)}
          {!groups.length && <Empty notice={notice} />}
        </div>}

        {active === 'finance' && <div className="divide-y divide-stone-100">
          {transactions.slice(0, 10).map(t => <div key={t.id} className="p-4 flex items-center justify-between"><div><div className="font-semibold text-sm">{t.description}</div><div className="text-xs text-stone-500">{t.kind} • {t.status || 'pendente'}</div></div><strong className="text-sm">{t.amount}</strong></div>)}
          {!transactions.length && <Empty notice={notice} />}
        </div>}

        {active !== 'people' && active !== 'groups' && active !== 'finance' && <div className="p-8 text-center"><div className="mx-auto w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mb-3"><ArrowUpRight className="w-5 h-5 text-stone-500" /></div><div className="font-semibold">Módulo visual preparado</div><p className="text-xs text-stone-500 mt-1">A próxima camada conecta formulários, permissões e operações deste módulo.</p></div>}
      </div>
      <p className="text-[11px] text-stone-400">{notice}</p>
    </section>
  );
};

const Empty: React.FC<{ notice: string }> = ({ notice }) => <div className="p-8 text-center text-sm text-stone-500">{notice}</div>;

const Field: React.FC<{ label: string; value?: string; onChange: (value: string) => void; required?: boolean }> = ({ label, value = '', onChange, required }) => (
  <label className="text-xs font-medium text-stone-600">
    {label}{required ? ' *' : ''}
    <input value={value} onChange={e => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-amber-500" />
  </label>
);
