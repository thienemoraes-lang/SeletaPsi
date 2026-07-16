import { useState, useMemo } from "react"
import { Logo } from "@/components/Logo"
import { PsychologistModal } from "@/components/PsychologistModal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  ArrowRight, 
  BrainCircuit, 
  CloudFog, 
  BatteryWarning, 
  Repeat, 
  Frown, 
  HeartHandshake,
  MapPin,
  CheckCircle2,
  FileText,
  Search,
  ThumbsUp,
  CreditCard,
  Globe,
  Star,
  SlidersHorizontal,
  X,
  MessageCircle,
} from "lucide-react"

/* ─── Psychologist data ────────────────────────────────────── */
const psychologists = [
  {
    name: "Dra. Camila Rezende",
    crp: "CRP: 06/124893",
    line: "Terapia Cognitivo-Comportamental (TCC)",
    specialties: ["Ansiedade", "Depressão", "TOC"],
    modality: "online",
    modalityLabel: "Online",
    price: 70,
    priceLabel: "R$ 70,00",
    city: "São Paulo",
    photo: "/psicologos/camila.jpg",
    whatsapp: "5511991230001",
  },
  {
    name: "Dr. Rafael Mendes",
    crp: "CRP: 04/55217",
    line: "Psicanálise",
    specialties: ["Relacionamentos", "Luto", "Autoestima"],
    modality: "ambos",
    modalityLabel: "Online / Presencial",
    price: 70,
    priceLabel: "R$ 70,00",
    city: "Rio de Janeiro",
    photo: "/psicologos/rafael.jpg",
    whatsapp: "5521992340002",
  },
  {
    name: "Dra. Juliana Farias",
    crp: "CRP: 07/22841",
    line: "Terapia Humanista",
    specialties: ["Ansiedade", "Burnout", "Autoestima"],
    modality: "online",
    modalityLabel: "Online",
    price: 70,
    priceLabel: "R$ 70,00",
    city: "Curitiba",
    photo: "/psicologos/juliana.jpg",
    whatsapp: "5541993450003",
  },
  {
    name: "Dra. Ana Paula Costa",
    crp: "CRP: 05/91032",
    line: "Terapia do Esquema",
    specialties: ["Depressão", "TOC", "Fobia social"],
    modality: "ambos",
    modalityLabel: "Online / Presencial",
    price: 70,
    priceLabel: "R$ 70,00",
    city: "Belo Horizonte",
    photo: "/psicologos/ana.jpg",
    whatsapp: "5531994560004",
  },
  {
    name: "Dr. Lucas Brandão",
    crp: "CRP: 08/33105",
    line: "EMDR e Trauma",
    specialties: ["Trauma", "Ansiedade", "Estresse"],
    modality: "online",
    modalityLabel: "Online",
    price: 70,
    priceLabel: "R$ 70,00",
    city: "Porto Alegre",
    photo: "/psicologos/lucas.jpg",
    whatsapp: "5551995670005",
  },
  {
    name: "Dra. Fernanda Lopes",
    crp: "CRP: 06/108754",
    line: "Terapia Sistêmica",
    specialties: ["Relacionamentos", "Família", "Autoestima"],
    modality: "ambos",
    modalityLabel: "Online / Presencial",
    price: 70,
    priceLabel: "R$ 70,00",
    city: "São Paulo",
    photo: "/psicologos/fernanda.jpg",
    whatsapp: "5511996780006",
  },
]

const ESPECIALIDADES = [
  "Ansiedade", "Depressão", "Relacionamentos", "Trauma", "Burnout",
  "Luto", "Autoestima", "TOC", "Fobia social", "Família", "Estresse",
]

const LINHAS = [
  "Terapia Cognitivo-Comportamental (TCC)",
  "Psicanálise",
  "Terapia Humanista",
  "Terapia do Esquema",
  "EMDR e Trauma",
  "Terapia Sistêmica",
]

const ETAPAS = [
  { icon: <FileText className="w-5 h-5" />, label: "Candidatura", desc: "Preencha o formulário com seus dados e documentos." },
  { icon: <Search className="w-5 h-5" />, label: "Análise", desc: "Nossa equipe avalia o seu perfil e documentação." },
  { icon: <ThumbsUp className="w-5 h-5" />, label: "Aprovação", desc: "Você é notificado(a) sobre a aprovação da candidatura." },
  { icon: <CreditCard className="w-5 h-5" />, label: "Pagamento", desc: "Escolha o plano e realize o pagamento de forma simples." },
  { icon: <Globe className="w-5 h-5" />, label: "Publicação", desc: "Seu perfil é publicado automaticamente na plataforma." },
]

/* ─── Search form state ────────────────────────────────────── */
interface SearchFilters {
  especialidade: string
  linha: string
  valor: string
  modalidade: string
  cidade: string
}

const EMPTY_FILTERS: SearchFilters = {
  especialidade: "", linha: "", valor: "", modalidade: "", cidade: "",
}

/* ─── Psych photo card ─────────────────────────────────────── */
function PsychCard({ psy }: { psy: typeof psychologists[0] }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-accent shadow-sm">
          <img src={psy.photo} alt={psy.name} className="w-full h-full object-cover object-top" />
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-secondary text-base leading-tight">{psy.name}</h4>
          <p className="text-xs text-foreground/50 mt-0.5">{psy.crp}</p>
          <p className="text-xs text-primary font-medium mt-1 leading-tight">{psy.line}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {psy.specialties.map((s, j) => (
          <span key={j} className="text-xs bg-accent/70 text-secondary px-2.5 py-1 rounded-full font-medium">
            {s}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border/40">
        <div className="flex items-center gap-1 text-xs text-foreground/50">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span>{psy.city} • {psy.modalityLabel}</span>
        </div>
        <a
          href={`https://wa.me/${psy.whatsapp}?text=${encodeURIComponent("Olá! Vi seu perfil na Seletapsi e gostaria de agendar uma conversa.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba5a] px-3 py-1.5 rounded-full transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          WhatsApp
        </a>
      </div>
    </div>
  )
}

/* ─── Main page ────────────────────────────────────────────── */
export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS)
  const [activeFilters, setActiveFilters] = useState<SearchFilters>(EMPTY_FILTERS)
  const [searched, setSearched] = useState(false)

  const setF = (key: keyof SearchFilters) => (value: string) =>
    setFilters(f => ({ ...f, [key]: value }))

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveFilters(filters)
    setSearched(true)
    document.getElementById("profissionais")?.scrollIntoView({ behavior: "smooth" })
  }

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS)
    setActiveFilters(EMPTY_FILTERS)
    setSearched(false)
  }

  const filtered = useMemo(() => {
    if (!searched) return psychologists
    return psychologists.filter(p => {
      if (activeFilters.especialidade && !p.specialties.some(s => s === activeFilters.especialidade)) return false
      if (activeFilters.linha && p.line !== activeFilters.linha) return false
      if (activeFilters.modalidade && activeFilters.modalidade !== "todos") {
        if (activeFilters.modalidade === "online" && p.modality === "presencial") return false
        if (activeFilters.modalidade === "presencial" && p.modality === "online") return false
      }
      if (activeFilters.cidade && !p.city.toLowerCase().includes(activeFilters.cidade.toLowerCase())) return false
      if (activeFilters.valor) {
        const max = parseInt(activeFilters.valor)
        if (p.price > max) return false
      }
      return true
    })
  }, [activeFilters, searched])

  const scrollToSearch = () => {
    document.getElementById("busca")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-secondary font-sans overflow-x-hidden">
      
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-6">
            <PsychologistModal open={modalOpen} onOpenChange={setModalOpen}>
              <Button variant="outline" className="hidden sm:inline-flex border-primary/20 text-primary hover:bg-primary hover:text-white transition-all rounded-full px-6">
                Quero participar
              </Button>
            </PsychologistModal>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-[600px] bg-accent rounded-bl-full opacity-50 -z-10 blur-3xl transform translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-1/3 h-[400px] bg-blue-50 rounded-tr-full opacity-50 -z-10 blur-3xl transform -translate-x-1/3 translate-y-1/4" />
        
        <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
          {/* Brand mark above headline */}
          <div className="flex flex-col items-center gap-3 mb-10">
            <div className="flex items-center gap-3">
              <Logo />
            </div>
            <p className="text-sm font-medium text-foreground/50 tracking-widest uppercase">
              Psicologia com curadoria
            </p>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-secondary leading-[1.1] tracking-tight mb-8">
            Reunimos profissionais selecionados para que você encontre o{" "}
            <span className="text-primary relative whitespace-nowrap">
              apoio terapêutico
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" strokeLinecap="round" />
              </svg>
            </span>{" "}que precisa
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            Encontrar o psicólogo certo não precisa ser difícil. Conecte-se com especialistas de confiança de forma simples e acolhedora.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="rounded-full h-14 px-8 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 group w-full sm:w-auto"
              onClick={scrollToSearch}
            >
              Encontrar meu psicólogo
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <PsychologistModal open={modalOpen} onOpenChange={setModalOpen}>
              <Button variant="ghost" size="lg" className="rounded-full h-14 px-8 text-base w-full sm:w-auto">
                Sou psicólogo e quero participar
              </Button>
            </PsychologistModal>
          </div>
        </div>
      </section>

      {/* ── Por que fazer psicoterapia ── */}
      <section className="py-24 px-6 bg-muted/30 border-y border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Por que fazer psicoterapia?</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              A terapia é um espaço seguro para compreender o que você sente e desenvolver ferramentas para lidar com os desafios da vida.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: <BrainCircuit className="w-8 h-8 text-primary" />, title: "Ansiedade", desc: "Quando preocupações tomam conta do dia a dia e o corpo reage com tensão constante." },
              { icon: <CloudFog className="w-8 h-8 text-primary" />, title: "Névoa mental", desc: "Dificuldade de concentrar, memória falha e sensação de estar no piloto automático." },
              { icon: <BatteryWarning className="w-8 h-8 text-primary" />, title: "Baixa auto-estima", desc: "Quando você se critica demais e sente que não é suficiente." },
              { icon: <Repeat className="w-8 h-8 text-primary" />, title: "Piloto automático", desc: "Viver sem presença, repetindo padrões sem perceber." },
              { icon: <Frown className="w-8 h-8 text-primary" />, title: "Humor deprimido", desc: "Falta de energia, tristeza persistente e perda de interesse pelo que antes te movia." },
              { icon: <HeartHandshake className="w-8 h-8 text-primary" />, title: "Relacionamentos", desc: "Dificuldades em impor limites, conflitos constantes ou dependência emocional." },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-[24px] p-8 shadow-sm border border-border/50 hover:shadow-md transition-all hover:-translate-y-1 group">
                <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">{item.title}</h3>
                <p className="text-foreground/75 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          BUSCA DE PSICÓLOGOS
      ════════════════════════════════════════════════ */}
      <section id="busca" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-widest mb-4 bg-primary/10 px-4 py-1.5 rounded-full">
              <SlidersHorizontal className="w-4 h-4" /> Pesquisar psicólogos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-3">Encontre o profissional certo para você</h2>
            <p className="text-lg text-foreground/70">Use os filtros abaixo para refinar sua busca.</p>
          </div>

          <form
            onSubmit={handleSearch}
            className="bg-white rounded-[28px] border border-border/50 shadow-lg shadow-secondary/5 p-6 md:p-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Especialidade / assunto */}
              <div className="space-y-1.5">
                <Label htmlFor="esp">Assunto / especialidade</Label>
                <Select value={filters.especialidade} onValueChange={setF("especialidade")}>
                  <SelectTrigger id="esp" className="bg-muted/20">
                    <SelectValue placeholder="Qualquer assunto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Qualquer assunto</SelectItem>
                    {ESPECIALIDADES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Linha terapêutica */}
              <div className="space-y-1.5">
                <Label htmlFor="linha">Linha terapêutica</Label>
                <Select value={filters.linha} onValueChange={setF("linha")}>
                  <SelectTrigger id="linha" className="bg-muted/20">
                    <SelectValue placeholder="Qualquer abordagem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Qualquer abordagem</SelectItem>
                    {LINHAS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Valor máximo */}
              <div className="space-y-1.5">
                <Label htmlFor="valor">Valor máximo por sessão</Label>
                <Select value={filters.valor} onValueChange={setF("valor")}>
                  <SelectTrigger id="valor" className="bg-muted/20">
                    <SelectValue placeholder="Qualquer valor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Qualquer valor</SelectItem>
                    <SelectItem value="50">Até R$ 50,00</SelectItem>
                    <SelectItem value="70">Até R$ 70,00</SelectItem>
                    <SelectItem value="100">Até R$ 100,00</SelectItem>
                    <SelectItem value="150">Até R$ 150,00</SelectItem>
                    <SelectItem value="999">Sem limite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Modalidade */}
              <div className="space-y-1.5">
                <Label htmlFor="mod">Modalidade de atendimento</Label>
                <Select value={filters.modalidade} onValueChange={setF("modalidade")}>
                  <SelectTrigger id="mod" className="bg-muted/20">
                    <SelectValue placeholder="Online ou presencial" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Online ou presencial</SelectItem>
                    <SelectItem value="online">Apenas Online</SelectItem>
                    <SelectItem value="presencial">Apenas Presencial</SelectItem>
                    <SelectItem value="ambos">Online e Presencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Cidade */}
              <div className="space-y-1.5">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={filters.cidade}
                  onChange={e => setF("cidade")(e.target.value)}
                  placeholder="Ex: São Paulo"
                  className="bg-muted/20"
                />
              </div>

              {/* Botão */}
              <div className="flex items-end">
                <Button type="submit" className="w-full rounded-full h-10 font-semibold gap-2">
                  <Search className="w-4 h-4" />
                  Buscar psicólogo
                </Button>
              </div>
            </div>

            {searched && (
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-border/40">
                <p className="text-sm text-foreground/60">
                  <span className="font-semibold text-secondary">{filtered.length}</span> profissional{filtered.length !== 1 ? "is" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Limpar filtros
                </button>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          ANÚNCIOS EM DESTAQUE
      ════════════════════════════════════════════════ */}
      <section id="profissionais" className="py-8 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-4 bg-primary/10 px-4 py-1.5 rounded-full">
              Anúncio em destaque
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Profissional em destaque</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Conheça um dos profissionais qualificados que fazem parte da Seletapsi.
            </p>
          </div>

          {/* Featured large card */}
          <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl shadow-secondary/5 border border-border/60 flex flex-col md:flex-row items-center gap-10 md:gap-16 relative mb-16 max-w-5xl mx-auto">
            <div className="absolute -top-6 -left-6 text-primary/10">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden flex-shrink-0 border-8 border-accent shadow-inner">
              <img
                src="/psicologos/marina.jpg"
                alt="Dra. Marina Oliveira"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1 text-center md:text-left z-10">
              <blockquote className="text-xl md:text-2xl font-medium text-secondary mb-8 leading-relaxed">
                <i className="italic">"A terapia me permite acompanhar cada pessoa em um momento único de sua história. Ver o movimento de transformação acontecer é o que torna esse trabalho tão significativo."</i>
              </blockquote>
              <div className="space-y-1">
                <h4 className="font-bold text-xl text-secondary">Dra. Marina Oliveira</h4>
                <p className="text-primary font-medium">Psicóloga Clínica • CRP: 06/198743</p>
                <p className="text-foreground/60 text-sm">Terapia Cognitivo-Comportamental • Ansiedade, Depressão, Autoestima</p>
                <p className="text-foreground/60 text-sm">Online / Presencial</p>
              </div>
              <div className="mt-4">
                <a
                  href={`https://wa.me/5511997890007?text=${encodeURIComponent("Olá, Dra. Marina! Vi seu perfil na Seletapsi e gostaria de agendar uma conversa.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#25D366] hover:bg-[#20ba5a] px-5 py-2.5 rounded-full transition-colors shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-secondary mb-2">Mais profissionais disponíveis</h3>
            <p className="text-foreground/60">Veja outros psicólogos com vagas e valores acessíveis.</p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-foreground/50">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium text-secondary">Nenhum profissional encontrado com esses filtros.</p>
              <button onClick={clearFilters} className="mt-2 text-sm text-primary hover:underline">Limpar filtros</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((psy, i) => <PsychCard key={i} psy={psy} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-muted/30 border-y border-border/40">
        <div className="max-w-4xl mx-auto bg-secondary rounded-[32px] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Pronto para dar o primeiro passo?</h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Não espere a situação se agravar. O cuidado com a sua saúde mental começa com a escolha de um profissional que te entende.
            </p>
            <Button size="lg" onClick={scrollToSearch} className="rounded-full h-14 px-10 text-lg bg-primary text-white hover:bg-white hover:text-secondary transition-all shadow-xl">
              Encontrar meu psicólogo
            </Button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SOU PSICÓLOGO
      ════════════════════════════════════════════════ */}
      <section id="sou-psicologo" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-4 bg-primary/10 px-4 py-1.5 rounded-full">
              Para psicólogos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Amplie seu alcance profissional</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              A Seletapsi conecta psicólogos qualificados com pacientes que buscam um profissional de confiança. Faça parte de uma rede cuidadosamente curada.
            </p>
          </div>

          {/* Benefícios */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
            {[
              { icon: "🎯", title: "Curadoria seletiva", desc: "Só profissionais aprovados pela nossa equipe são publicados, valorizando quem já está na plataforma." },
              { icon: "📣", title: "Mais visibilidade", desc: "Seu perfil fica acessível a pacientes que buscam ativamente por psicólogos qualificados." },
              { icon: "💬", title: "Contato direto", desc: "Pacientes entram em contato diretamente com você via WhatsApp, sem intermediários." },
            ].map((b, i) => (
              <div key={i} className="bg-muted/30 rounded-2xl p-6 border border-border/40 text-center">
                <div className="text-3xl mb-3">{b.icon}</div>
                <h4 className="font-bold text-secondary mb-2">{b.title}</h4>
                <p className="text-sm text-foreground/70 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Etapas */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-secondary text-center mb-10">Como funciona</h3>
            <div className="relative">
              <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-border/60 -z-0" />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                {ETAPAS.map((et, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-white border-2 border-primary/30 shadow-sm flex items-center justify-center text-primary">
                      {et.icon}
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-wide">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h4 className="font-bold text-secondary text-sm">{et.label}</h4>
                    <p className="text-xs text-foreground/60 leading-relaxed">{et.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-5 max-w-2xl mx-auto text-sm text-amber-800">
            <strong>Importante:</strong> o preenchimento do formulário não garante o credenciamento imediato. Além de avaliarmos uma série de critérios técnicos, a abertura de novas vagas acontece conforme a demanda de pacientes nas empresas parceiras, para garantir uma jornada de qualidade a quem já está com a gente.
          </div>

          <div className="mt-14 text-center">
            <PsychologistModal open={modalOpen} onOpenChange={setModalOpen}>
              <Button size="lg" className="rounded-full h-14 px-10 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 group">
                Enviar minha candidatura
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </PsychologistModal>
          </div>
        </div>
      </section>

      {/* ── Thiene Salazar ── */}
      <section className="py-24 px-6 bg-muted/30 border-t border-border/40">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-8 border-accent shadow-xl mb-8 flex-shrink-0">
              <img src="/thiene-salazar.jpg" alt="Psicóloga Thiene Salazar" className="w-full h-full object-cover" />
            </div>
            <div className="max-w-2xl">
              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                O Seletapsi tem satisfação de ter como parceira a psicóloga{" "}
                <span className="font-bold text-secondary">Thiene Salazar</span>, psicóloga com 18 anos de experiência na área clínica, mestre em psicologia, tem apresentado contribuições significativas por meio da prática, do conhecimento e de pesquisas no campo científico. Acumula mais de 30 milhões de visualizações nas redes sociais.
              </p>
              <p className="text-base font-semibold text-secondary mb-4">Thiene entendeu a nossa visão:</p>
              <blockquote className="border-l-4 border-primary pl-6 text-left">
                <p className="text-lg text-secondary italic leading-relaxed">
                  "Tenho notado uma gama de pessoas serem privadas do acesso à psicoterapia, por outro lado muitos psicólogos reservam horários com valor social. Acredito que a SeletaPsi veio para facilitar esse encontro."
                </p>
                <footer className="mt-3 text-sm text-foreground/60 not-italic">
                  — Thiene Salazar, Psicóloga Clínica • CRP: 05/37426
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-6 border-t border-border/40">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Perguntas frequentes</h2>
            <p className="text-foreground/70">Tudo o que você precisa saber sobre como a plataforma funciona.</p>
          </div>
          <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-border/50">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Seleta Psi realiza os atendimentos?</AccordionTrigger>
                <AccordionContent>Não. Os atendimentos são realizados exclusivamente pelo psicólogo escolhido pelo paciente. A Seleta Psi é uma plataforma de conexão, não de atendimento.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>O que é a Seleta Psi?</AccordionTrigger>
                <AccordionContent>Reunimos psicólogos qualificados com disponibilidade de atendimento e valores acessíveis, facilitando que você encontre o profissional certo para o seu momento.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>A Seleta Psi gerencia os atendimentos?</AccordionTrigger>
                <AccordionContent>Não. Os atendimentos são de total responsabilidade do psicólogo escolhido pelo paciente. A plataforma apenas facilita a conexão.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>O pagamento da sessão é feito para quem?</AccordionTrigger>
                <AccordionContent>Diretamente para o psicólogo. A Seleta Psi não intermedia pagamentos entre paciente e profissional.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>O atendimento é online ou presencial?</AccordionTrigger>
                <AccordionContent>Isso varia de acordo com cada profissional. Ao ver o perfil do psicólogo, você encontra as modalidades disponíveis por ele oferecidas.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>Existe garantia de disponibilidade?</AccordionTrigger>
                <AccordionContent>Não garantimos agenda disponível, pois cada psicólogo gerencia sua própria disponibilidade. Recomendamos entrar em contato com o profissional para verificar horários.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger>Como faço para participar como psicólogo?</AccordionTrigger>
                <AccordionContent>Clique no botão "Quero participar", preencha o formulário completo com seus dados e documentos, e aceite os termos. Nossa equipe analisará o perfil e entrará em contato.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-8" className="border-b-0">
                <AccordionTrigger>O preenchimento do formulário garante minha aprovação?</AccordionTrigger>
                <AccordionContent>Não. Além de avaliarmos critérios técnicos, a abertura de novas vagas acontece conforme a demanda de pacientes, para garantir qualidade a todos os profissionais aprovados.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-border/50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Logo />
            <p className="text-sm text-foreground/60">Conectando você ao apoio psicológico ideal.</p>
          </div>
          <div className="text-sm text-foreground/50 text-center md:text-right">
            &copy; {new Date().getFullYear()} Seletapsi. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
