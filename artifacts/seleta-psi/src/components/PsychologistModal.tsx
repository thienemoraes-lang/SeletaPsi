import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toast } from "@/components/ui/toaster"

export function PsychologistModal({ 
  children,
  open,
  onOpenChange
}: { 
  children?: React.ReactNode,
  open?: boolean,
  onOpenChange?: (open: boolean) => void
}) {
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) return
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setAgreed(false)
      onOpenChange?.(false)
    }, 4000)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {children && <DialogTrigger asChild>{children}</DialogTrigger>}
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden bg-white border-none shadow-2xl sm:rounded-[24px]">
          <div className="px-6 py-6 border-b border-border/40 bg-muted/30">
            <DialogTitle className="text-2xl text-secondary font-bold">Quero participar</DialogTitle>
            <DialogDescription className="text-base mt-2 text-foreground/80">
              Preencha o formulário abaixo para se juntar à plataforma Seleta Psi.
            </DialogDescription>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[75vh]">
            <form id="psicologo-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input id="name" required placeholder="Ex: Dra. Ana Silva" className="bg-muted/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crp">Número do CRP</Label>
                  <Input id="crp" required placeholder="Ex: 05/12345" className="bg-muted/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail profissional</Label>
                  <Input id="email" type="email" required placeholder="contato@exemplo.com" className="bg-muted/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone / WhatsApp</Label>
                  <Input id="phone" type="tel" required placeholder="(00) 00000-0000" className="bg-muted/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidades principais</Label>
                  <Input id="specialty" required placeholder="Ex: TCC, Ansiedade, Depressão" className="bg-muted/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modality">Modalidade de atendimento</Label>
                  <Select required>
                    <SelectTrigger className="bg-muted/20">
                      <SelectValue placeholder="Selecione a modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Apenas Online</SelectItem>
                      <SelectItem value="presencial">Apenas Presencial</SelectItem>
                      <SelectItem value="ambos">Online e Presencial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">Breve apresentação</Label>
                <Textarea 
                  id="about" 
                  required 
                  placeholder="Conte um pouco sobre sua abordagem e experiência..." 
                  className="h-24 resize-none bg-muted/20"
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-border/40">
                <h4 className="font-semibold text-secondary">Termos de Adesão</h4>
                <div className="bg-muted/30 border border-border/50 rounded-xl p-4 h-48 overflow-y-auto text-sm text-foreground/80 space-y-4 leading-relaxed custom-scrollbar">
                  <p className="font-semibold text-secondary">REGULAMENTO SELETA PSI — TERMOS DE ADESÃO PARA PSICÓLOGOS</p>
                  <p>Ao preencher este formulário e marcar sua concordância, você, profissional de psicologia, declara estar ciente e de acordo com os seguintes termos:</p>
                  
                  <div>
                    <span className="font-semibold text-secondary block mb-1">1. Natureza do Serviço</span>
                    A Seleta Psi oferece um serviço de divulgação e visibilidade para psicólogos. Ao aderir à plataforma, o psicólogo está contratando um anúncio — um espaço de divulgação profissional — e não uma garantia de encaminhamento de pacientes.
                  </div>
                  
                  <div>
                    <span className="font-semibold text-secondary block mb-1">2. Sem Garantia de Pacientes</span>
                    A Seleta Psi não garante, em nenhuma hipótese, o encaminhamento ou captação de pacientes. A decisão de qual profissional contatar é exclusiva do cliente/paciente, que avaliará livremente os perfis disponíveis e selecionará o psicólogo de sua preferência.
                  </div>
                  
                  <div>
                    <span className="font-semibold text-secondary block mb-1">3. Responsabilidade pelo Atendimento</span>
                    Todo e qualquer atendimento psicológico é de inteira e exclusiva responsabilidade do psicólogo contratado pelo paciente. A Seleta Psi não participa, não monitora e não se responsabiliza pelos atendimentos realizados.
                  </div>
                  
                  <div>
                    <span className="font-semibold text-secondary block mb-1">4. Autonomia Profissional</span>
                    O psicólogo mantém plena autonomia sobre sua agenda, valores de sessão, modalidade de atendimento e abordagem terapêutica. A Seleta Psi não interfere nas condições de prestação do serviço.
                  </div>
                  
                  <div>
                    <span className="font-semibold text-secondary block mb-1">5. Conduta Ética</span>
                    O psicólogo declara estar regularmente inscrito no CRP e comprometido com o Código de Ética Profissional dos Psicólogos.
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-accent/30 p-4 rounded-xl border border-primary/20">
                  <Checkbox 
                    id="terms" 
                    checked={agreed} 
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-secondary"
                    >
                      Li e concordo com os termos de adesão da Seleta Psi
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>
          
          <div className="p-6 border-t border-border/40 bg-muted/10 flex justify-end">
            <Button 
              type="submit" 
              form="psicologo-form" 
              disabled={!agreed}
              size="lg"
              className="w-full sm:w-auto font-semibold px-8 h-12 text-[15px]"
            >
              Enviar cadastro
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {submitted && (
        <Toast 
          title="Obrigado!" 
          description="Recebemos seu cadastro e entraremos em contato em breve." 
        />
      )}
    </>
  )
}
