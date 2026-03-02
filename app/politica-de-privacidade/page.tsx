import type { Metadata } from "next";
import { getCompanyProfile } from "@/lib/company";

export const metadata: Metadata = {
  title: "Política de Privacidade | ONDESC",
  description: "Política de privacidade e proteção de dados da ONDESC.",
};

const LAST_UPDATED = "26 de fevereiro de 2026";

export default function PrivacyPolicyPage() {
  const company = getCompanyProfile();
  const companyDisplay = company.legalName || company.brandName;

  return (
    <main className="legal-page-shell">
      <div className="container legal-page-container">
        <article className="legal-page-card">
          <p className="legal-page-kicker">Documento legal</p>
          <h1>Política de Privacidade</h1>
          <p className="legal-page-subtitle">Última atualização: {LAST_UPDATED}</p>

          <section className="legal-section">
            <h2>1. Dados coletados</h2>
            <p>
              Coletamos dados fornecidos por você nos formulários do site, como
              nome, WhatsApp, e-mail, cidade, tipo de cliente e demais
              informações necessárias para atendimento e contratação.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Finalidade do tratamento</h2>
            <p>
              Os dados são utilizados para contato comercial, simulação,
              análise de elegibilidade, proposta, contratação e suporte ao
              cliente.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Compartilhamento</h2>
            <p>
              As informações podem ser compartilhadas com parceiros
              operacionais, quando necessário para execução do serviço e
              cumprimento de obrigações legais.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Armazenamento e segurança</h2>
            <p>
              Adotamos medidas técnicas e organizacionais para proteger os
              dados pessoais contra acessos não autorizados e usos indevidos.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Direitos do titular</h2>
            <p>
              Você pode solicitar acesso, correção, atualização e exclusão de
              dados, observadas as hipóteses legais de retenção.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Contato sobre privacidade</h2>
            <p>
              Solicitações relacionadas a dados pessoais podem ser feitas pelos
              canais oficiais de atendimento da {companyDisplay}.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
