import type { Metadata } from "next";
import { getCompanyProfile } from "@/lib/company";

export const metadata: Metadata = {
  title: "Termos de Uso | ONDESC",
  description: "Termos de uso dos canais e serviços da ONDESC.",
};

const LAST_UPDATED = "26 de fevereiro de 2026";

export default function TermsPage() {
  const company = getCompanyProfile();
  const companyDisplay = company.legalName || company.brandName;

  return (
    <main className="legal-page-shell">
      <div className="container legal-page-container">
        <article className="legal-page-card">
          <p className="legal-page-kicker">Documento legal</p>
          <h1>Termos de Uso</h1>
          <p className="legal-page-subtitle">Última atualização: {LAST_UPDATED}</p>

          <section className="legal-section">
            <h2>1. Aceitação</h2>
            <p>
              Ao navegar neste site e utilizar os canais de contato da ONDESC,
              você declara ciência destes termos e concorda com as condições
              aqui apresentadas.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Finalidade do site</h2>
            <p>
              O site tem caráter informativo e comercial, com foco em
              apresentação dos serviços de economia de energia, simulação e
              solicitação de contratação.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Cadastro e veracidade das informações</h2>
            <p>
              Ao enviar dados em formulários, você se compromete a fornecer
              informações verdadeiras, atualizadas e completas para análise de
              elegibilidade e continuidade do atendimento.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Simulações e estimativas</h2>
            <p>
              Resultados de simulação e projeções de economia possuem caráter
              estimativo e podem variar conforme perfil de consumo, unidade
              consumidora e disponibilidade de energia.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Canais oficiais</h2>
            <p>
              O contato oficial é realizado pelos canais divulgados neste site,
              especialmente WhatsApp e e-mail institucional, quando informado.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Alterações destes termos</h2>
            <p>
              {companyDisplay} pode atualizar estes termos a qualquer momento.
              Recomendamos consulta periódica desta página.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
