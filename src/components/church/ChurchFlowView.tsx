import React, { useEffect, useMemo, useState } from 'react';
import { Users, UsersRound, GraduationCap, WalletCards, Package, CalendarDays, FolderOpen, ArrowUpRight, Plus, Search, RefreshCw, Church, X } from 'lucide-react';

type ModuleKey = 'people' | 'groups' | 'education' | 'finance' | 'assets' | 'calendar' | 'media';
type Person = { id: string; fullName: string; category?: string | null; role?: string | null; isActive?: boolean };
type Group = { id: string; name: string; category?: string | null; meetingDay?: string | null; location?: string | null; isActive?: boolean };
type Transaction = { id: string; description: string; kind: string; amount: string; status?: string };
type Asset = { id: string; name: string; status?: string; assetTag?: string | null };
type Event = { id: string; title: string; eventDate: string; startTime?: string | null; location?: string | null };
type Media = { id: string; title: string; mediaType: string; fileName?: string | null };
type Summary = { people: number; groups: number; studies: number; transactions: number; assets: number; events: number; media: number };

const modules: { key: ModuleKey; label: string; icon: React.ElementType; description: string }[] = [
  { key: 'people', label: 'Pessoas', icon: Users, description: 'Membros, contatos, cargos e categorias' },
  { key: 'groups', label: 'Grupos', icon: UsersRound, description: 'Células, ministérios, líderes e reuniões' },
  { key: 'education', label: 'Ensino', icon: GraduationCap, description: 'Estudos, escolas, turmas e discipulado' },
  { key: 'finance', label: 'Financeiro', icon: WalletCards, description: 'Receitas, despesas, contas e centros de custo' },
  { key: 'assets', label: 'Patrimônio', icon: Package, description: 'Bens, locais, responsáveis e movimentações' },
  { key: 'calendar', label: 'Agenda', icon: CalendarDays, description: 'Eventos, programas, mural e notificações' },
  { key: 'media', label: 'Mídias', icon: FolderOpen, description: 'Fotos, vídeos, documentos e certificados' },
];

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch('/api/v1/church' + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) throw new Error(payload?.error?.message || 'API indisponível');
  return payload.data as T;
}

const Field: React.FC<{ label: string; value?: string; onChange: (value: string) => void; required?: boolean; type?: string }> = ({ label, value = '', onChange, required, type = 'text' }) => (
  <label className="text-xs font-medium text-stone-600">{label}{required ? ' *' : ''}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-amber-500" />
  </label>
);

export const ChurchFlowView: React.FC = () => {
  const [active, setActive] = useState<ModuleKey>('people');
  const [query, setQuery] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [summary, setSummary] = useState<Summary>({ people: 0, groups: 0, studies: 0, transactions: 0, assets: 0, events: 0, media: 0 });
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('Conectando ao núcleo ChurchFlow…');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    try {
      const [p, g, t, s, a, e, m] = await Promise.all([
        api<Person[]>('/people'), api<Group[]>('/groups'), api<Transaction[]>('/finance/transactions'),
        api<unknown[]>('/education/studies'), api<Asset[]>('/assets'), api<Event[]>('/calendar/events'), api<Media[]>('/media'),
      ]);
      setPeople(p); setGroups(g); setTransactions(t); setAssets(a); setEvents(e); setMedia(m);
      setSummary({ people: p.length, groups: g.length, studies: s.length, transactions: t.length, assets: a.length, events: e.length, media: m.length });
      setNotice('Dados carregados da API.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Modo visual: conecte a autenticação e o banco para operar.');
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);
  const filteredPeople = useMemo(() => people.filter(p => (p.fullName || '').toLowerCase().includes(query.toLowerCase())), [people, query]);
  const setField = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const submitCreate = async () => {
    try {
      if (active === 'people') await api('/people', { method: 'POST', body: JSON.stringify({ fullName: form.fullName, preferredName: form.preferredName, phone: form.phone, email: form.email, category: form.category, role: form.role }) });
      else if (active === 'groups') await api('/groups', { method: 'POST', body: JSON.stringify({ name: form.name, category: form.category, meetingDay: form.meetingDay, meetingTime: form.meetingTime, location: form.location }) });
      else if (active === 'education') await api('/education/studies', { method: 'POST', body: JSON.stringify({ title: form.title, description: form.description, category: form.category }) });
      else if (active === 'finance') {
        const accounts = await api<{ id: string }[]>('/finance/accounts');
        const accountId = form.accountId || accounts[0]?.id;
        if (!accountId) throw new Error('Crie uma conta financeira antes do lançamento.');
        await api('/finance/transactions', { method: 'POST', body: JSON.stringify({ accountId, description: form.description, kind: form.kind || 'expense', amount: form.amount, status: 'pending' }) });
      } else if (active === 'assets') await api('/assets', { method: 'POST', body: JSON.stringify({ name: form.name, assetTag: form.assetTag, status: form.status || 'active', condition: form.condition || 'good', acquisitionValue: form.acquisitionValue, notes: form.notes }) });
      else if (active === 'calendar') await api('/calendar/events', { method: 'POST', body: JSON.stringify({ title: form.title, eventDate: form.eventDate, startTime: form.startTime, endTime: form.endTime, location: form.location, category: form.category }) });
      else if (active === 'media') await api('/media', { method: 'POST', body: JSON.stringify({ title: form.title, mediaType: form.mediaType || 'document', storageKey: form.storageKey || 'pending-upload', fileName: form.fileName, publicUrl: form.publicUrl, isPublic: form.isPublic === 'true' }) });
      setShowForm(false); setForm({}); await load(); setNotice('Registro criado com sucesso.');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Não foi possível salvar.'); }
  };

  const cards = [
    ['Pessoas', summary.people, Users], ['Grupos', summary.groups, UsersRound], ['Estudos', summary.studies, GraduationCap],
    ['Lançamentos', summary.transactions, WalletCards], ['Patrimônio', summary.assets, Package], ['Eventos', summary.events, CalendarDays], ['Mídias', summary.media, FolderOpen],
  ];

  const renderRows = () => {
    if (active === 'people') return <>{filteredPeople.slice(0, 10).map(p => <div key={p.id} className="p-4 flex items-center justify-between gap-4"><div><div className="font-semibold text-sm">{p.fullName}</div><div className="text-xs text-stone-500">{p.category || 'Sem categoria'} {p.role ? '• ' + p.role : ''}</div></div><span className="text-[10px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">{p.isActive === false ? 'Inativo' : 'Ativo'}</span></div>)}{!filteredPeople.length && <Empty notice={notice} />}</>;
    if (active === 'groups') return <>{groups.slice(0, 10).map(g => <div key={g.id} className="p-4 flex items-center justify-between"><div><div className="font-semibold text-sm">{g.name}</div><div className="text-xs text-stone-500">{g.category || 'Grupo'} {g.meetingDay ? '• ' + g.meetingDay : ''}</div></div><ArrowUpRight className="w-4 h-4 text-stone-400" /></div>)}{!groups.length && <Empty notice={notice} />}</>;
    if (active === 'finance') return <>{transactions.slice(0, 10).map(t => <div key={t.id} className="p-4 flex items-center justify-between"><div><div className="font-semibold text-sm">{t.description}</div><div className="text-xs text-stone-500">{t.kind} • {t.status || 'pendente'}</div></div><strong className="text-sm">{t.amount}</strong></div>)}{!transactions.length && <Empty notice={notice} />}</>;
    if (active === 'assets') return <>{assets.slice(0, 10).map(a => <div key={a.id} className="p-4 flex items-center justify-between"><div><div className="font-semibold text-sm">{a.name}</div><div className="text-xs text-stone-500">{a.assetTag || 'Sem patrimônio'} • {a.status || 'ativo'}</div></div></div>)}{!assets.length && <Empty notice={notice} />}</>;
    if (active === 'calendar') return <>{events.slice(0, 10).map(e => <div key={e.id} className="p-4 flex items-center justify-between"><div><div className="font-semibold text-sm">{e.title}</div><div className="text-xs text-stone-500">{e.eventDate} {e.startTime ? '• ' + e.startTime : ''} {e.location ? '• ' + e.location : ''}</div></div></div>)}{!events.length && <Empty notice={notice} />}</>;
    if (active === 'media') return <>{media.slice(0, 10).map(m => <div key={m.id} className="p-4 flex items-center justify-between"><div><div className="font-semibold text-sm">{m.title}</div><div className="text-xs text-stone-500">{m.mediaType} {m.fileName ? '• ' + m.fileName : ''}</div></div></div>)}{!media.length && <Empty notice={notice} />}</>;
    return <Empty notice={notice + ' — use Novo para cadastrar um estudo.'} />;
  };

  return <section className="space-y-6">
    <div className="rounded-2xl bg-stone-950 text-white p-6 sm:p-8 shadow-sm overflow-hidden relative">
      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-amber-500/15" />
      <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5"><div><div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold mb-3"><Church className="w-4 h-4" /> CHURCHFLOW</div><h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Gestão Integrada para Igrejas</h1><p className="text-stone-400 mt-2 max-w-2xl text-sm">Um painel único para pessoas, grupos, ensino, financeiro, patrimônio, agenda e mídias.</p></div><button onClick={() => void load()} disabled={loading} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-semibold text-sm hover:bg-amber-400 disabled:opacity-60"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Atualizar dados</button></div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">{cards.map(([label, value, Icon]) => <div key={String(label)} className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm"><Icon className="w-4 h-4 text-stone-700 mb-3" /><div className="text-2xl font-bold">{value as number}</div><div className="text-xs text-stone-500 mt-1">{String(label)}</div></div>)}</div>
    <div className="flex gap-2 overflow-x-auto pb-1">{modules.map(m => { const Icon=m.icon; return <button key={m.key} onClick={() => setActive(m.key)} className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border ${active===m.key?'bg-stone-900 text-white border-stone-900':'bg-white text-stone-600 border-stone-200 hover:border-stone-400'}`}><Icon className="w-4 h-4" /> {m.label}</button>; })}</div>
    <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"><div className="p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"><div><h2 className="font-bold text-stone-900">{modules.find(m=>m.key===active)?.label}</h2><p className="text-xs text-stone-500 mt-1">{modules.find(m=>m.key===active)?.description}</p></div><div className="flex gap-2"><div className="relative"><Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" /><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar…" className="pl-9 pr-3 py-2 rounded-lg border border-stone-200 text-sm outline-none focus:border-amber-500 w-48" /></div><button onClick={()=>{setForm({});setShowForm(true)}} className="px-3 py-2 rounded-lg bg-amber-500 text-stone-950 text-xs font-bold inline-flex items-center gap-1"><Plus className="w-4 h-4"/> Novo</button></div></div><div className="divide-y divide-stone-100">{renderRows()}</div></div>
    <p className="text-[11px] text-stone-400">{notice}</p>
    {showForm && <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"><div className="w-full max-w-lg bg-white rounded-2xl shadow-xl"><div className="p-5 border-b flex items-center justify-between"><div><h3 className="font-bold">Novo {modules.find(m=>m.key===active)?.label}</h3><p className="text-xs text-stone-500 mt-1">Cadastro rápido conectado à API.</p></div><button onClick={()=>setShowForm(false)}><X className="w-5 h-5"/></button></div><div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
      {active==='people' && <><Field label="Nome completo" required value={form.fullName} onChange={v=>setField('fullName',v)}/><Field label="Nome preferido" value={form.preferredName} onChange={v=>setField('preferredName',v)}/><Field label="Telefone" value={form.phone} onChange={v=>setField('phone',v)}/><Field label="E-mail" value={form.email} onChange={v=>setField('email',v)}/><Field label="Categoria" value={form.category} onChange={v=>setField('category',v)}/><Field label="Cargo" value={form.role} onChange={v=>setField('role',v)}/></>}
      {active==='groups' && <><Field label="Nome do grupo" required value={form.name} onChange={v=>setField('name',v)}/><Field label="Categoria" value={form.category} onChange={v=>setField('category',v)}/><Field label="Dia" value={form.meetingDay} onChange={v=>setField('meetingDay',v)}/><Field label="Horário" value={form.meetingTime} onChange={v=>setField('meetingTime',v)}/><Field label="Local" value={form.location} onChange={v=>setField('location',v)}/></>}
      {active==='education' && <><Field label="Título" required value={form.title} onChange={v=>setField('title',v)}/><Field label="Categoria" value={form.category} onChange={v=>setField('category',v)}/><Field label="Descrição" value={form.description} onChange={v=>setField('description',v)}/></>}
      {active==='finance' && <><Field label="Descrição" required value={form.description} onChange={v=>setField('description',v)}/><Field label="Valor" required type="number" value={form.amount} onChange={v=>setField('amount',v)}/><Field label="Tipo (income/expense)" value={form.kind||'expense'} onChange={v=>setField('kind',v)}/><Field label="ID da conta (opcional)" value={form.accountId} onChange={v=>setField('accountId',v)}/></>}
      {active==='assets' && <><Field label="Nome do bem" required value={form.name} onChange={v=>setField('name',v)}/><Field label="Patrimônio" value={form.assetTag} onChange={v=>setField('assetTag',v)}/><Field label="Condição" value={form.condition||'good'} onChange={v=>setField('condition',v)}/><Field label="Valor de aquisição" type="number" value={form.acquisitionValue} onChange={v=>setField('acquisitionValue',v)}/><Field label="Observações" value={form.notes} onChange={v=>setField('notes',v)}/></>}
      {active==='calendar' && <><Field label="Título" required value={form.title} onChange={v=>setField('title',v)}/><Field label="Data" required type="date" value={form.eventDate} onChange={v=>setField('eventDate',v)}/><Field label="Início" type="time" value={form.startTime} onChange={v=>setField('startTime',v)}/><Field label="Fim" type="time" value={form.endTime} onChange={v=>setField('endTime',v)}/><Field label="Local" value={form.location} onChange={v=>setField('location',v)}/><Field label="Categoria" value={form.category} onChange={v=>setField('category',v)}/></>}
      {active==='media' && <><Field label="Título" required value={form.title} onChange={v=>setField('title',v)}/><Field label="Tipo" value={form.mediaType||'document'} onChange={v=>setField('mediaType',v)}/><Field label="Nome do arquivo" value={form.fileName} onChange={v=>setField('fileName',v)}/><Field label="Storage key" required value={form.storageKey} onChange={v=>setField('storageKey',v)}/><Field label="URL pública" value={form.publicUrl} onChange={v=>setField('publicUrl',v)}/></>}
    </div><div className="p-5 border-t flex justify-end gap-2"><button onClick={()=>setShowForm(false)} className="px-4 py-2 rounded-lg border text-sm">Cancelar</button><button onClick={()=>void submitCreate()} className="px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-semibold">Salvar</button></div></div></div>}
  </section>;
};

const Empty: React.FC<{ notice: string }> = ({ notice }) => <div className="p-8 text-center text-sm text-stone-500">{notice}</div>;
