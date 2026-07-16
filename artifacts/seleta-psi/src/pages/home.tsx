import { useState, useEffect } from "react"
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
  HeartHandshake
} from "lucide-react"

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  
  // Smooth scroll helper
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
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
        {/* Soft decorative background shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-[600px] bg-accent rounded-bl-full opacity-50 -z-10 blur-3xl transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-[400px] bg-blue-50 rounded-tr-full opacity-50 -z-10 blur-3xl transform -translate-x-1/3 translate-y-1/4"></div>
        
        <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-secondary leading-[1.1] tracking-tight mb-8">
            Reunimos profissionais selecionados para que você encontre o <span className="text-primary relative whitespace-nowrap">
              apoio terapêutico
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" strokeLinecap="round" />
              </svg>
            </span> que precisa
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            Encontrar o psicólogo certo não precisa ser difícil. Conecte-se com especialistas de confiança de forma simples e acolhedora.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-full h-14 px-8 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 group w-full sm:w-auto" onClick={() => scrollTo('faq')}>
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
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
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
                desc: "Dificuldade de concentrar, memória falha e sensação de estar \"no piloto automático\"."
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
                style={{ animationDelay: `${300 + (i * 100)}ms` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">{item.title}</h3>
                <p className="text-foreground/75 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / Featured Profile */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/5 -z-10"></div>
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl shadow-secondary/5 border border-border/60 flex flex-col md:flex-row items-center gap-10 md:gap-16 relative">
            <div className="absolute -top-6 -left-6 text-primary/10">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden flex-shrink-0 border-8 border-accent shadow-inner bg-muted">
              {/* Fallback image if real is not available */}
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400" 
                alt="Dra. Thiene Salazar" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left z-10">
              <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium text-secondary mb-8 leading-relaxed">
                <i className="italic">"Acredito que o processo terapêutico é uma construção conjunta. Meu propósito é oferecer uma escuta atenta e sem julgamentos, ajudando você a reencontrar seu equilíbrio e a viver de forma mais autêntica."</i>
              </blockquote>
              <div>
                <h4 className="font-bold text-xl text-secondary">Dra. Thiene Salazar</h4>
                <p className="text-primary font-medium mt-1">Psicóloga Clínica • CRP: 05/37426</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
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

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-muted/30">
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
            <p className="text-sm text-foreground/60">
              Conectando você ao apoio psicológico ideal.
            </p>
          </div>
          <div className="text-sm text-foreground/50 text-center md:text-right">
            &copy; {new Date().getFullYear()} Seleta Psi. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
