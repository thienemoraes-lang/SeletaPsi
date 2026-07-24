import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/Logo"
import { CheckCircle2, XCircle, Clock, Eye, Trash2, LogOut, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "")

interface Candidatura {
  id: number
  nome: string
  crp: string
  estado_crp: string | null
  email: string
  whatsapp: string
  telefone: string | null
  cidade: string | null
  estado: string | null
  modalidade: string | null
  valor_sessao: string | null
  abordagem: string | null
  especialidades: string | null
  tempo_experiencia: string | null
  formacao: string | null
  especializacoes_detalhe: string | null
  curriculo: string | null
  instagram: string | null
  site: string | null
  status: string
  criado_em: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pendente: {
    label: "Pendente",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  aprovado: {
    label: "Aprovado",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  rejeitado: {
    label: "Rejeitado",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pendente
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  )
}

function CandidaturaCard({
  c,
  onApprove,
  onReject,
  onDelete,
}: {
  c: Candidatura
  onApprove: (id: number) => void
  onReject: (id: number) => void
  onDelete: (id: number) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const date = new Date(c.criado_em).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  })

  return (
    <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-bold text-secondary text-base leading-tight">{c.nome}</h3>
            <StatusBadge status={c.status} />
          </div>
          <p className="text-xs text-foreground/50 mt-1">
            CRP {c.crp}{c.estado_crp ? `/${c.estado_crp}` : ""} · {c.email} · {date}
          </p>
          {c.cidade && (
            <p className="text-xs text-foreground/60 mt-0.5">
              {c.cidade}{c.estado ? `, ${c.estado}` : ""} · {c.modalidade ?? "-"} · {c.valor_sessao ?? "-"}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {c.status === "pendente" && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 h-8 text-xs"
                onClick={() => onReject(c.id)}
              >
                <XCircle className="w-3.5 h-3.5 mr-1" /> Rejeitar
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 h-8 text-xs"
                onClick={() => onApprove(c.id)}
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Aprovar
              </Button>
            </>
          )}
          {c.status !== "pendente" && (
            <Button
              size="sm"
              variant="outline"
              className="text-foreground/50 h-8 text-xs"
              onClick={() => onDelete(c.id)}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Excluir
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Expandable detail */}
      {expanded && (
        <div className="border-t border-border/40 px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 bg-muted/20 text-sm">
          {[
            ["Abordagem", c.abordagem],
            ["Especialidades", c.especialidades],
            ["Experiência", c.tempo_experiencia],
            ["Formação", c.formacao],
            ["Especializações", c.especializacoes_detalhe],
            ["WhatsApp", c.whatsapp],
            ["Instagram", c.instagram],
            ["Site", c.site],
          ].map(([label, val]) =>
            val ? (
              <div key={label as string}>
                <span className="font-semibold text-foreground/60 text-xs">{label}: </span>
                <span className="text-foreground/80 text-xs">{val}</span>
              </div>
            ) : null
          )}
          {c.curriculo && (
            <div className="sm:col-span-2">
              <p className="font-semibold text-foreground/60 text-xs mb-1">Currículo:</p>
              <p className="text-xs text-foreground/70 whitespace-pre-wrap leading-relaxed bg-white rounded-lg p-3 border border-border/40">
                {c.curriculo}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
export default function Admin() {
  const [password, setPassword] = useState(() => localStorage.getItem("admin_pw") ?? "")
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState("")
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<"todos" | "pendente" | "aprovado" | "rejeitado">("todos")
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const headers = { "x-admin-password": password }

  const fetchCandidaturas = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE}/api/admin/candidaturas`, { headers })
      if (res.status === 401) { setAuthed(false); localStorage.removeItem("admin_pw"); return }
      if (!res.ok) throw new Error("Erro ao carregar")
      setCandidaturas(await res.json())
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }, [password]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (authed) fetchCandidaturas()
  }, [authed, fetchCandidaturas])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    const res = await fetch(`${BASE}/api/admin/candidaturas`, {
      headers: { "x-admin-password": password },
    })
    if (res.ok) {
      localStorage.setItem("admin_pw", password)
      setAuthed(true)
      setCandidaturas(await res.json())
    } else {
      setAuthError("Senha incorreta. Tente novamente.")
    }
  }

  const act = async (id: number, path: string) => {
    setActionLoading(id)
    try {
      await fetch(`${BASE}/api/admin/candidaturas/${id}/${path}`, { method: "PUT", headers })
      await fetchCandidaturas()
    } finally {
      setActionLoading(null)
    }
  }

  const del = async (id: number) => {
    if (!confirm("Excluir esta candidatura permanentemente?")) return
    setActionLoading(id)
    try {
      await fetch(`${BASE}/api/admin/candidaturas/${id}`, { method: "DELETE", headers })
      await fetchCandidaturas()
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = candidaturas.filter(
    (c) => filter === "todos" || c.status === filter
  )

  const counts = {
    todos: candidaturas.length,
    pendente: candidaturas.filter((c) => c.status === "pendente").length,
    aprovado: candidaturas.filter((c) => c.status === "aprovado").length,
    rejeitado: candidaturas.filter((c) => c.status === "rejeitado").length,
  }

  /* ── Login screen ─────────────────────────────────────────── */
  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary/5 to-primary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl border border-border/50 shadow-lg p-8 space-y-6">
          <div className="flex flex-col items-center gap-2">
            <Logo />
            <p className="text-sm text-foreground/50 font-medium">Painel Administrativo</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground/70 block mb-1.5">
                Senha de acesso
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                required
                className="h-11"
              />
              {authError && (
                <p className="text-xs text-red-600 mt-1.5">{authError}</p>
              )}
            </div>
            <Button type="submit" className="w-full h-11 font-semibold rounded-full">
              Entrar
            </Button>
          </form>
        </div>
      </div>
    )
  }

  /* ── Admin panel ──────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-muted/20">
      {/* Top bar */}
      <div className="bg-white border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-sm font-semibold text-foreground/50 hidden sm:block">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchCandidaturas}
              disabled={loading}
              className="h-8 gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setAuthed(false); localStorage.removeItem("admin_pw") }}
              className="h-8 gap-1.5 text-foreground/50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* Stats + filter */}
        <div className="flex flex-wrap gap-2">
          {(["todos", "pendente", "aprovado", "rejeitado"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-sm font-semibold px-4 py-2 rounded-full border transition-all ${
                filter === s
                  ? "bg-secondary text-white border-secondary"
                  : "bg-white text-foreground/60 border-border/50 hover:border-secondary/40"
              }`}
            >
              {s === "todos" ? "Todas" : STATUS_CONFIG[s]?.label}
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${filter === s ? "bg-white/20 text-white" : "bg-muted text-foreground/50"}`}>
                {counts[s]}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <RefreshCw className="w-6 h-6 animate-spin text-foreground/30" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-foreground/40">
            <Eye className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Nenhuma candidatura encontrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((c) => (
              <div key={c.id} className={actionLoading === c.id ? "opacity-50 pointer-events-none" : ""}>
                <CandidaturaCard
                  c={c}
                  onApprove={(id) => act(id, "aprovar")}
                  onReject={(id) => act(id, "rejeitar")}
                  onDelete={del}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
