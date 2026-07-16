import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle2, Upload, Loader2, ChevronRight, Star } from "lucide-react"

/* ─── Types ───────────────────────────────────────────────── */
type Step = "form" | "plans" | "plan-success"

interface FormData {
  nome: string; cpf: string; crp: string; estado_crp: string
  telefone: string; whatsapp: string; email: string
  cidade: string; estado: string; instagram: string; site: string
  modalidade: string; valor_sessao: string; abordagem: string
  especialidades: string; tempo_experiencia: string; formacao: string
  especializacoes_detalhe: string; curriculo: string
}

const EMPTY_FORM: FormData = {
  nome: "", cpf: "", crp: "", estado_crp: "",
  telefone: "", whatsapp: "", email: "",
  cidade: "", estado: "", instagram: "", site: "",
  modalidade: "", valor_sessao: "", abordagem: "",
  especialidades: "", tempo_experiencia: "", formacao: "",
  especializacoes_detalhe: "", curriculo: "",
}

const ESTADOS_BR = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC",
  "SP","SE","TO",
]

const ABORDAGENS = [
  "Terapia Cognitivo-Comportamental (TCC)",
  "Psicanálise",
  "Terapia Humanista / Centrada na Pessoa",
  "Terapia do Esquema",
  "EMDR",
  "Terapia Sistêmica",
  "Terapia Gestalt",
  "Terapia Comportamental Dialética (DBT)",
  "Terapia de Aceitação e Compromisso (ACT)",
  "Outra",
]

const EXPERIENCIAS = [
  "Menos de 1 ano",
  "1 a 2 anos",
  "3 a 5 anos",
  "6 a 10 anos",
  "Mais de 10 anos",
]

/* ─── File upload field ────────────────────────────────────── */
function FileField({
  id, label, required, onChange,
}: {
  id: string; label: string; required?: boolean
  onChange: (name: string) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    const name = f?.name ?? ""
    setFileName(name)
    onChange(name)
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}{required && <span className="text-primary ml-1">*</span>}
      </Label>
      <div
        className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors ${
          fileName
            ? "border-primary/40 bg-accent/30"
            : "border-border/60 bg-muted/20 hover:border-primary/40"
        }`}
        onClick={() => ref.current?.click()}
      >
        {fileName ? (
          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
        ) : (
          <Upload className="w-4 h-4 text-foreground/40 flex-shrink-0" />
        )}
        <span className={`text-sm truncate ${fileName ? "text-secondary font-medium" : "text-foreground/50"}`}>
          {fileName || "Clique para selecionar o arquivo"}
        </span>
        <input
          ref={ref}
          id={id}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          required={required}
          className="hidden"
          onChange={handleChange}
        />
      </div>
      <p className="text-xs text-foreground/40">PDF, JPG ou PNG</p>
    </div>
  )
}

/* ─── Plan card ────────────────────────────────────────────── */
function PlanCard({
  title, price, sub, features, highlight, onSelect, loading,
}: {
  title: string; price: string; sub: string; features: string[]
  highlight?: boolean; onSelect: () => void; loading: boolean
}) {
  return (
    <div className={`rounded-2xl border p-6 flex flex-col gap-4 transition-all ${
      highlight
        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
        : "border-border/50 bg-white"
    }`}>
      {highlight && (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full self-start">
          <Star className="w-3 h-3" /> Mais popular
        </span>
      )}
      <div>
        <p className="text-sm font-semibold text-foreground/60 uppercase tracking-wide">{title}</p>
        <p className="text-3xl font-bold text-secondary mt-1">{price}</p>
        <p className="text-sm text-foreground/50 mt-0.5">{sub}</p>
      </div>
      <ul className="space-y-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>
      <Button
        onClick={onSelect}
        disabled={loading}
        className={`mt-2 w-full rounded-full font-semibold ${
          highlight ? "" : "variant-outline bg-white border-secondary text-secondary hover:bg-secondary hover:text-white"
        }`}
        variant={highlight ? "default" : "outline"}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        Tenho interesse neste plano
      </Button>
    </div>
  )
}

/* ─── Main modal ───────────────────────────────────────────── */
export function PsychologistModal({
  children, open, onOpenChange,
}: {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [step, setStep] = useState<Step>("form")
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [agreedTerms, setAgreedTerms] = useState(false)
  const [agreedLGPD, setAgreedLGPD] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [planLoading, setPlanLoading] = useState<string | null>(null)
  const [chosenPlan, setChosenPlan] = useState("")

  // file names for WhatsApp notification
  const [fotoPerfil, setFotoPerfil] = useState("")
  const [diploma, setDiploma] = useState("")
  const [comprovantes, setComprovantes] = useState("")
  const [docCRP, setDocCRP] = useState("")

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const setSelect = (field: keyof FormData) => (value: string) =>
    setForm(f => ({ ...f, [field]: value }))

  const handleClose = (v: boolean) => {
    if (!v) {
      setStep("form")
      setForm(EMPTY_FORM)
      setAgreedTerms(false)
      setAgreedLGPD(false)
      setFotoPerfil(""); setDiploma(""); setComprovantes(""); setDocCRP("")
    }
    onOpenChange?.(v)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedTerms || !agreedLGPD) return
    if (!fotoPerfil || !diploma || !docCRP) {
      alert("Por favor, anexe todos os documentos obrigatórios (foto, diploma e documento CRP).")
      return
    }

    setSubmitting(true)
    try {
      await fetch("/api/candidatura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          documentos: [
            fotoPerfil && `Foto: ${fotoPerfil}`,
            diploma && `Diploma: ${diploma}`,
            comprovantes && `Comprovantes: ${comprovantes}`,
            docCRP && `Doc. CRP: ${docCRP}`,
          ].filter(Boolean).join(" | "),
        }),
      })
    } catch {
      // Notification may fail silently; submission still proceeds
    } finally {
      setSubmitting(false)
      setStep("plans")
    }
  }

  const handlePlanInterest = async (plano: string) => {
    setPlanLoading(plano)
    try {
      await fetch("/api/payment-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          whatsapp: form.whatsapp,
          plano,
        }),
      })
    } catch {
      // silent
    } finally {
      setPlanLoading(null)
      setChosenPlan(plano)
      setStep("plan-success")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden bg-white border-none shadow-2xl sm:rounded-[24px]">

        {/* ── Header ── */}
        <div className="px-6 py-5 border-b border-border/40 bg-muted/30 sticky top-0 z-10">
          <DialogHeader>
            <DialogTitle className="text-xl text-secondary font-bold">
              {step === "form" && "Candidatura para psicólogo(a)"}
              {step === "plans" && "Candidatura enviada! Conheça os planos"}
              {step === "plan-success" && "Interesse registrado!"}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto max-h-[76vh]">

          {/* ══ STEP: FORM ══ */}
          {step === "form" && (
            <form id="candidatura-form" onSubmit={handleSubmit} className="p-6 space-y-8">

              {/* 1. Dados pessoais */}
              <section className="space-y-4">
                <h3 className="font-bold text-secondary border-b border-border/40 pb-2">
                  1. Dados pessoais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="nome">Nome completo <span className="text-primary">*</span></Label>
                    <Input id="nome" required value={form.nome} onChange={set("nome")} placeholder="Ex: Dra. Ana Silva" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cpf">CPF <span className="text-primary">*</span></Label>
                    <Input id="cpf" required value={form.cpf} onChange={set("cpf")} placeholder="000.000.000-00" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">E-mail profissional <span className="text-primary">*</span></Label>
                    <Input id="email" type="email" required value={form.email} onChange={set("email")} placeholder="contato@exemplo.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="telefone">Telefone <span className="text-primary">*</span></Label>
                    <Input id="telefone" required value={form.telefone} onChange={set("telefone")} placeholder="(00) 00000-0000" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="whatsapp">WhatsApp <span className="text-primary">*</span></Label>
                    <Input id="whatsapp" required value={form.whatsapp} onChange={set("whatsapp")} placeholder="(00) 00000-0000" />
                  </div>
                </div>
              </section>

              {/* 2. Dados profissionais */}
              <section className="space-y-4">
                <h3 className="font-bold text-secondary border-b border-border/40 pb-2">
                  2. Dados profissionais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="crp">Número do CRP <span className="text-primary">*</span></Label>
                    <Input id="crp" required value={form.crp} onChange={set("crp")} placeholder="Ex: 06/12345" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="estado_crp">Estado do CRP <span className="text-primary">*</span></Label>
                    <Select required onValueChange={setSelect("estado_crp")}>
                      <SelectTrigger id="estado_crp"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {ESTADOS_BR.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="instagram">Instagram profissional</Label>
                    <Input id="instagram" value={form.instagram} onChange={set("instagram")} placeholder="@seu.perfil" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="site">Site (opcional)</Label>
                    <Input id="site" value={form.site} onChange={set("site")} placeholder="https://seuperfil.com.br" />
                  </div>
                </div>
              </section>

              {/* 3. Localização e atendimento */}
              <section className="space-y-4">
                <h3 className="font-bold text-secondary border-b border-border/40 pb-2">
                  3. Localização e atendimento
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="cidade">Cidade <span className="text-primary">*</span></Label>
                    <Input id="cidade" required value={form.cidade} onChange={set("cidade")} placeholder="Ex: São Paulo" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="estado">Estado <span className="text-primary">*</span></Label>
                    <Select required onValueChange={setSelect("estado")}>
                      <SelectTrigger id="estado"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {ESTADOS_BR.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="modalidade">Modalidade de atendimento <span className="text-primary">*</span></Label>
                    <Select required onValueChange={setSelect("modalidade")}>
                      <SelectTrigger id="modalidade"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Apenas Online</SelectItem>
                        <SelectItem value="presencial">Apenas Presencial</SelectItem>
                        <SelectItem value="ambos">Online e Presencial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="valor_sessao">Valor da sessão (R$) <span className="text-primary">*</span></Label>
                    <Input id="valor_sessao" required value={form.valor_sessao} onChange={set("valor_sessao")} placeholder="Ex: 80,00" />
                  </div>
                </div>
              </section>

              {/* 4. Formação e especialidades */}
              <section className="space-y-4">
                <h3 className="font-bold text-secondary border-b border-border/40 pb-2">
                  4. Formação e especialidades
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="abordagem">Abordagem terapêutica <span className="text-primary">*</span></Label>
                    <Select required onValueChange={setSelect("abordagem")}>
                      <SelectTrigger id="abordagem"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {ABORDAGENS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="tempo_experiencia">Tempo de experiência <span className="text-primary">*</span></Label>
                    <Select required onValueChange={setSelect("tempo_experiencia")}>
                      <SelectTrigger id="tempo_experiencia"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {EXPERIENCIAS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="formacao">Formação acadêmica <span className="text-primary">*</span></Label>
                    <Select required onValueChange={setSelect("formacao")}>
                      <SelectTrigger id="formacao"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="graduacao">Graduação</SelectItem>
                        <SelectItem value="especializacao">Especialização</SelectItem>
                        <SelectItem value="pos-graduacao">Pós-graduação</SelectItem>
                        <SelectItem value="mestrado">Mestrado</SelectItem>
                        <SelectItem value="doutorado">Doutorado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="especialidades">Especialidades <span className="text-primary">*</span></Label>
                    <Input id="especialidades" required value={form.especialidades} onChange={set("especialidades")} placeholder="Ex: Ansiedade, TCC, Depressão" />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="especializacoes_detalhe">Especializações / Pós-graduação / Mestrado / Doutorado</Label>
                    <Input id="especializacoes_detalhe" value={form.especializacoes_detalhe} onChange={set("especializacoes_detalhe")} placeholder="Descreva seus títulos e instituições" />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="curriculo">Breve currículo <span className="text-primary">*</span></Label>
                    <Textarea
                      id="curriculo"
                      required
                      value={form.curriculo}
                      onChange={set("curriculo")}
                      placeholder="Descreva sua trajetória profissional, formação, experiências relevantes e abordagem de trabalho..."
                      className="h-28 resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* 5. Documentos */}
              <section className="space-y-4">
                <h3 className="font-bold text-secondary border-b border-border/40 pb-2">
                  5. Documentos
                </h3>
                <p className="text-sm text-foreground/60">
                  Envie os documentos em PDF, JPG ou PNG. Os campos marcados com <span className="text-primary font-semibold">*</span> são obrigatórios.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FileField id="foto" label="Foto profissional" required onChange={setFotoPerfil} />
                  <FileField id="diploma" label="Diploma de graduação" required onChange={setDiploma} />
                  <FileField id="comprovantes" label="Comprovantes de especialização" onChange={setComprovantes} />
                  <FileField id="doc_crp" label="Documento do CRP / comprovação de registro" required onChange={setDocCRP} />
                </div>
              </section>

              {/* 6. Termos e LGPD */}
              <section className="space-y-4">
                <h3 className="font-bold text-secondary border-b border-border/40 pb-2">
                  6. Termos e consentimento
                </h3>

                {/* Regulation text */}
                <div className="bg-muted/30 border border-border/50 rounded-xl p-4 h-44 overflow-y-auto text-sm text-foreground/80 space-y-3 leading-relaxed">
                  <p className="font-semibold text-secondary">REGULAMENTO SELETAPSI — TERMOS DE ADESÃO PARA PSICÓLOGOS</p>
                  <p>Ao preencher este formulário e marcar sua concordância, você, profissional de psicologia, declara estar ciente e de acordo com os seguintes termos:</p>
                  <div><span className="font-semibold text-secondary block mb-1">1. Natureza do Serviço</span>A Seletapsi oferece um serviço de divulgação e visibilidade para psicólogos. Ao aderir à plataforma, o psicólogo está contratando um anúncio — um espaço de divulgação profissional — e não uma garantia de encaminhamento de pacientes.</div>
                  <div><span className="font-semibold text-secondary block mb-1">2. Sem Garantia de Pacientes</span>A Seletapsi não garante, em nenhuma hipótese, o encaminhamento ou captação de pacientes. A decisão de qual profissional contatar é exclusiva do cliente/paciente.</div>
                  <div><span className="font-semibold text-secondary block mb-1">3. Responsabilidade pelo Atendimento</span>Todo e qualquer atendimento psicológico é de inteira e exclusiva responsabilidade do psicólogo. A Seletapsi não participa, não monitora e não se responsabiliza pelos atendimentos realizados.</div>
                  <div><span className="font-semibold text-secondary block mb-1">4. Autonomia Profissional</span>O psicólogo mantém plena autonomia sobre sua agenda, valores de sessão, modalidade de atendimento e abordagem terapêutica.</div>
                  <div><span className="font-semibold text-secondary block mb-1">5. Conduta Ética</span>O psicólogo declara estar regularmente inscrito no CRP e comprometido com o Código de Ética Profissional dos Psicólogos.</div>
                  <div><span className="font-semibold text-secondary block mb-1">6. Processo Seletivo</span>O preenchimento deste formulário não garante o credenciamento imediato. Além de avaliarmos critérios técnicos, a abertura de novas vagas ocorre conforme a demanda de pacientes, para garantir uma jornada de qualidade a todos os profissionais.</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-accent/20 p-4 rounded-xl border border-primary/15">
                    <Checkbox id="terms" checked={agreedTerms} onCheckedChange={v => setAgreedTerms(v as boolean)} className="mt-0.5" />
                    <label htmlFor="terms" className="text-sm font-medium cursor-pointer text-secondary leading-snug">
                      Li e concordo com os Termos de Adesão da Seletapsi <span className="text-primary">*</span>
                    </label>
                  </div>
                  <div className="flex items-start gap-3 bg-accent/20 p-4 rounded-xl border border-primary/15">
                    <Checkbox id="lgpd" checked={agreedLGPD} onCheckedChange={v => setAgreedLGPD(v as boolean)} className="mt-0.5" />
                    <label htmlFor="lgpd" className="text-sm font-medium cursor-pointer text-secondary leading-snug">
                      Concordo com o tratamento dos meus dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018) <span className="text-primary">*</span>
                    </label>
                  </div>
                </div>
              </section>
            </form>
          )}

          {/* ══ STEP: PLANS ══ */}
          {step === "plans" && (
            <div className="p-6 space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-800">Candidatura enviada com sucesso!</p>
                  <p className="text-sm text-green-700 mt-1">
                    Nossa equipe irá analisar o seu perfil. Enquanto isso, conheça os planos disponíveis para quando sua candidatura for aprovada.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <strong>Importante:</strong> o preenchimento não garante o credenciamento imediato. Além de avaliarmos critérios técnicos, a abertura de novas vagas ocorre conforme a demanda de pacientes, para garantir uma jornada de qualidade.
              </div>

              <div>
                <h3 className="font-bold text-secondary text-lg mb-1">Planos de anúncio</h3>
                <p className="text-sm text-foreground/60 mb-4">
                  Ao clicar em "Tenho interesse", nossa equipe entrará em contato via WhatsApp para finalizar o credenciamento e o pagamento.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PlanCard
                    title="Plano Mensal"
                    price="R$ 49,00"
                    sub="por mês"
                    features={[
                      "Perfil ativo por 30 dias",
                      "Exibição na listagem de profissionais",
                      "Renovação mensal flexível",
                      "Suporte via WhatsApp",
                    ]}
                    onSelect={() => handlePlanInterest("mensal")}
                    loading={planLoading === "mensal"}
                  />
                  <PlanCard
                    title="Plano Trimestral"
                    price="R$ 117,00"
                    sub="3 meses • equivale a R$ 39,00/mês"
                    features={[
                      "Perfil ativo por 90 dias",
                      "Exibição na listagem de profissionais",
                      "Economia de R$ 30,00 vs mensal",
                      "Suporte via WhatsApp",
                    ]}
                    highlight
                    onSelect={() => handlePlanInterest("trimestral")}
                    loading={planLoading === "trimestral"}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP: PLAN SUCCESS ══ */}
          {step === "plan-success" && (
            <div className="p-6 flex flex-col items-center text-center gap-6 py-12">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-secondary">
                  Interesse registrado!
                </h3>
                <p className="text-foreground/70 max-w-sm">
                  Recebemos seu interesse no{" "}
                  <strong>
                    {chosenPlan === "mensal" ? "Plano Mensal (R$ 49,00/mês)" : "Plano Trimestral (R$ 117,00)"}
                  </strong>
                  . Nossa equipe irá entrar em contato no WhatsApp para finalizar seu credenciamento.
                </p>
              </div>
              <Button variant="outline" className="rounded-full px-8" onClick={() => handleClose(false)}>
                Fechar
              </Button>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {step === "form" && (
          <div className="p-5 border-t border-border/40 bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-foreground/50 text-center sm:text-left">
              Campos com <span className="text-primary font-semibold">*</span> são obrigatórios
            </p>
            <Button
              type="submit"
              form="candidatura-form"
              disabled={submitting || !agreedTerms || !agreedLGPD}
              size="lg"
              className="w-full sm:w-auto font-semibold px-8 h-12 text-[15px] rounded-full"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Enviando...</>
              ) : (
                <>Enviar candidatura <ChevronRight className="w-4 h-4 ml-1" /></>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
