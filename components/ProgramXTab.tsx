"use client";

import { Button } from "antd";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function ProgramXTab() {
  const whatsappLink = buildWhatsAppLink(
    "Olá, quero saber mais sobre o Programa Indique & Ganhe da ONDESC.",
  );

  return (
    <div className="program-referral-shell">
      <div className="program-referral-grid">
        <section className="program-referral-topic-01">
          <div className="program-topic-head ">
            <span className="program-topic-index">01</span>
            <h3>Como funciona</h3>
          </div>
          <ol className="program-referral-steps flex-1">
            <li>
              <span className="program-referral-step-number">1.</span>
              <span>Você indica pessoas interessadas.</span>
            </li>
            <li>
              <span className="program-referral-step-number">2.</span>
              <span>A ONDESC ativa os contratos elegíveis.</span>
            </li>
            <li>
              <span className="program-referral-step-number">3.</span>
              <span>
                Você recebe mensalmente um percentual sobre a fatura ONDESC dos
                indicados.
              </span>
            </li>
          </ol>
        </section>

        <section className="program-referral-topic program-referral-topic-gains">
          <div className="program-topic-head">
            <span className="program-topic-index">02</span>
            <h3>Seus ganhos</h3>
          </div>
          <div className="program-gain-tier">
            <h4>Participante</h4>
            <p>
              Recebe 1% do valor da fatura ONDESC dos indicados, podendo chegar
              a 2%.
            </p>
          </div>
          <div className="program-gain-tier program-gain-tier-premium">
            <span className="program-gain-badge">Nível Premium</span>
            <h4>Franqueado</h4>
            <p>Após 5 indicações ativas, recebe 2%, podendo chegar a 4%.</p>
          </div>
        </section>
      </div>

      <p className="program-referral-footnote">
        Você pode indicar quantas pessoas quiser e acompanhar sua evolução
        dentro do programa.
      </p>

      <div className="program-referral-cta-wrap">
        <Button
          className="program-referral-cta"
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
        >
          Quero saber mais sobre o programa
        </Button>
      </div>
    </div>
  );
}
