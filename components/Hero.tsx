"use client";

import { Button } from "antd";
import ImagePlaceholder from "./ImagePlaceholder";

type HeroProps = {
  onSimulateClick: (elementId: string) => void;
};

export default function Hero({ onSimulateClick }: HeroProps) {
  return (
    <section id="inicio" className="hero-section">
      <div className="container hero-grid">
        <div className="fade-in-up ">
          <p className="eyebrow">
            Desconto na energia da Copel em todo o Paraná
          </p>
          <h1>
            Economize até{" "}
            <span className="text-[#8dbb47]">
              <span className="font-bold">90%</span> na conta de luz da Copel
            </span>{" "}
            no Paraná.
          </h1>
          <div className="pt-10 ">
            <p className="lead-text ">
              Sem troca de unidade consumidora, sem trocar titularidade e sem
              mudar sua relação com a Copel. A Equipe ONDESC acompanha você de
              forma simples e transparente.
            </p>
            <p className="mini-disclaimer">
              A economia pode variar conforme perfil e disponibilidade.
            </p>
          </div>
          <div className="mt-10 flex flex-col gap-4 items-start">
            <Button
              type="primary"
              size="large"
              onClick={() => onSimulateClick("form-cadastro")}
              style={{ fontWeight: 700, padding: "1.5rem 2.5rem" }}
            >
              Quero começar a economizar
            </Button>
            <Button
              type="default"
              size="large"
              onClick={() => onSimulateClick("simulador")}
              style={{ fontWeight: 700, padding: "1.3rem" }}
            >
              Simular meu desconto
            </Button>
          </div>
        </div>

        <div className="fade-in-up delay-1">
          <ImagePlaceholder
            src="/hero.png"
            alt="Equipe analisando economia de energia"
            fallbackLabel="/public/hero.png"
            className="hero-image"
            priority
          />
        </div>
      </div>
    </section>
  );
}
