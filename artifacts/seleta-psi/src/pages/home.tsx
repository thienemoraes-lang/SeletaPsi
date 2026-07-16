import { useState } from "react"
import { Logo } from "@/components/Logo"
import { PsychologistModal } from "@/components/PsychologistModal"
import { Button } from "@/components/ui/button"
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
  Star
} from "lucide-react"

// Placeholder avatar component using initials
function Avatar({ name, color = "#C1694F" }: { name: string; color?: string }) {
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("")
  return (
    <div 
      className="w-full h-full flex items-center justify-center text-white font-bold text-xl"
      style={{ background: color }}
    >
      {initials}
    </div>
  )
}

const psychologists = [
  {
    name: "Dra. Camila Rezende",
    crp: "CRP: 06/124893",
    line: "Terapia Cognitivo-Comportamental (TCC)",
    specialties: ["Ansiedade", "Depressão", "TOC"],
    modality: "Online",
    price: "R$ 70,00",
    color: "#1B2A4A",
  },
  {
    name: "Dr. Rafael Mendes",
    crp: "CRP: 04/55217",
    line: "Psicanálise",
    specialties: ["Relacionamentos", "Luto", "Autoestima"],
    modality: "Online / Presencial",
    price: "R$ 70,00",
    color: "#6B7F5A",
  },
  {
    name: "Dra. Juliana Farias",
    crp: "CRP: 07/22841",
    line: "Terapia Humanista",
    specialties: ["Transtornos alimentares", "Ansiedade", "Burnout"],
    modality: "Online",
    price: "R$ 70,00",
    color: "#8B5E52",
  },
  {
    name: "Dra. Ana Paula Costa",
    crp: "CRP: 05/91032",
    line: "Terapia do Esquema",
    specialties: ["Depressão", "TOC", "Fobia social"],
    modality: "Online / Presencial",
    price: "R$ 70,00",
    color: "#4A6741",
  },
  {
    name: "Dr. Lucas Brandão",
    crp: "CRP: 08/33105",
    line: "EMDR e Trauma",
    specialties: ["Trauma", "Ansiedade", "Estresse"],
    modality: "Online",
    price: "R$ 70,00",
    color: "#2D4E6B",
  },
  {
    name: "Dra. Fernanda Lopes",
    crp: "CRP: 06/108754",
    line: "Terapia Sistêmica",
    specialties: ["Família", "Relacionamentos", "Autoestima"],
    modality: "Online / Presencial",
    price: "R$ 70,00",
    color: "#7A5C8A",
  },
]

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-secondary font-sans overflow-x-hidden">
      
      {/* Navigation */}
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

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-[600px] bg-accent rounded-bl-full opacity-50 -z-10 blur-3xl transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-[400px] bg-blue-50 rounded-tr-full opacity-50 -z-10 blur-3xl transform -translate-x-1/3 translate-y-1/4"></div>
        
        <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
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
            <Button size="lg" className="rounded-full h-14 px-8 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 group w-full sm:w-auto" onClick={() => scrollTo('profissionais')}>
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

      {/* Por que fazer psicoterapia */}
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
              {
                icon: <BrainCircuit className="w-8 h-8 text-primary" />,
                title: "Ansiedade",
                desc: "Quando preocupações tomam conta do dia a dia e o corpo reage com tensão constante."
              },
              {
                icon: <CloudFog className="w-8 h-8 text-primary" />,
                title: "Névoa mental",
                desc: "Dificuldade de concentrar, memória falha e sensação de estar no piloto automático."
              },
              {
                icon: <BatteryWarning className="w-8 h-8 text-primary" />,
                title: "Baixa auto-estima",
                desc: "Quando você se critica demais e sente que não é suficiente."
              },
              {
                icon: <Repeat className="w-8 h-8 text-primary" />,
                title: "Piloto automático",
                desc: "Viver sem presença, repetindo padrões sem perceber."
              },
              {
                icon: <Frown className="w-8 h-8 text-primary" />,
                title: "Humor deprimido",
                desc: "Falta de energia, tristeza persistente e perda de interesse pelo que antes te movia."
              },
              {
                icon: <HeartHandshake className="w-8 h-8 text-primary" />,
                title: "Relacionamentos",
                desc: "Dificuldades em impor limites, conflitos constantes ou dependência emocional."
              }
            ].map((item, i) => (
              <div 
                key={i} 
                className="bg-white rounded-[24px] p-8 shadow-sm border border-border/50 hover:shadow-md transition-all hover:-translate-y-1 group"
              >
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

      {/* Anúncios em destaque */}
      <section id="profissionais" className="py-24 px-6">
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
              <Avatar name="Marina Oliveira" color="#1B2A4A" />
            </div>
            <div className="flex-1 text-center md:text-left z-10">
              <blockquote className="text-xl md:text-2xl font-medium text-secondary mb-8 leading-relaxed">
                <i className="italic">"A terapia me permite acompanhar cada pessoa em um momento único de sua história. Ver o movimento de transformação acontecer é o que torna esse trabalho tão significativo."</i>
              </blockquote>
              <div className="space-y-1">
                <h4 className="font-bold text-xl text-secondary">Dra. Marina Oliveira</h4>
                <p className="text-primary font-medium">Psicóloga Clínica • CRP: 06/198743</p>
                <p className="text-foreground/60 text-sm">Terapia Cognitivo-Comportamental • Ansiedade, Depressão, Autoestima</p>
                <p className="text-foreground/60 text-sm">Online / Presencial — <span className="font-semibold text-secondary">R$ 70,00 / sessão</span></p>
              </div>
            </div>
          </div>

          {/* Grid of smaller cards */}
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-secondary mb-2">Mais profissionais disponíveis</h3>
            <p className="text-foreground/60">Veja outros psicólogos com vagas e valores acessíveis.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {psychologists.map((psy, i) => (
              <div 
                key={i}
                className="bg-white rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-accent shadow-sm">
                    <Avatar name={psy.name} color={psy.color} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-secondary text-base leading-tight">{psy.name}</h4>
                    <p className="text-xs text-foreground/50 mt-0.5">{psy.crp}</p>
                    <p className="text-xs text-primary font-medium mt-1">{psy.line}</p>
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
                    <MapPin className="w-3 h-3" />
                    {psy.modality}
                  </div>
                  <span className="font-bold text-secondary text-sm">{psy.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-muted/30 border-y border-border/40">
        <div className="max-w-4xl mx-auto bg-secondary rounded-[32px] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Pronto para dar o primeiro passo?</h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Não espere a situação se agravar. O cuidado com a sua saúde mental começa com a escolha de um profissional que te entende.
            </p>
            <Button size="lg" className="rounded-full h-14 px-10 text-lg bg-primary text-white hover:bg-white hover:text-secondary transition-all shadow-xl">
              Encontrar meu psicólogo
            </Button>
          </div>
        </div>
      </section>

      {/* Thiene Salazar Partnership Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            {/* Photo */}
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-8 border-accent shadow-xl mb-8 flex-shrink-0">
              <img
                src="/thiene-salazar.jpg"
                alt="Psicóloga Thiene Salazar"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bio text */}
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

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-muted/30 border-t border-border/40">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Perguntas frequentes</h2>
            <p className="text-foreground/70">Tudo o que você precisa saber sobre como a plataforma funciona.</p>
          </div>
          
          <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-border/50">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Seleta Psi realiza os atendimentos?</AccordionTrigger>
                <AccordionContent>
                  Não. Os atendimentos são realizados exclusivamente pelo psicólogo escolhido pelo paciente. A Seleta Psi é uma plataforma de conexão, não de atendimento.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>O que é a Seleta Psi?</AccordionTrigger>
                <AccordionContent>
                  Reunimos psicólogos qualificados com disponibilidade de atendimento e valores acessíveis, facilitando que você encontre o profissional certo para o seu momento.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>A Seleta Psi gerencia os atendimentos?</AccordionTrigger>
                <AccordionContent>
                  Não. Os atendimentos são de total responsabilidade do psicólogo escolhido pelo paciente. A plataforma apenas facilita a conexão.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>O pagamento da sessão é feito para quem?</AccordionTrigger>
                <AccordionContent>
                  Diretamente para o psicólogo. A Seleta Psi não intermedia pagamentos entre paciente e profissional.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>O atendimento é online ou presencial?</AccordionTrigger>
                <AccordionContent>
                  Isso varia de acordo com cada profissional. Ao ver o perfil do psicólogo, você encontra as modalidades disponíveis por ele oferecidas.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>Existe garantia de disponibilidade?</AccordionTrigger>
                <AccordionContent>
                  Não garantimos agenda disponível, pois cada psicólogo gerencia sua própria disponibilidade. Recomendamos entrar em contato com o profissional para verificar horários.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7" className="border-b-0">
                <AccordionTrigger>Como faço para participar como psicólogo?</AccordionTrigger>
                <AccordionContent>
                  Clique no botão "Quero participar", preencha o formulário e aceite os termos de uso. Nossa equipe analisará seu perfil e entrará em contato.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
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
