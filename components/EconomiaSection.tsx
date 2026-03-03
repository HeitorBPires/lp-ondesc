import { Card } from "antd";
import Image from "next/image";
import type { IconType } from "react-icons";
import { FaChartLine, FaLeaf, FaTree } from "react-icons/fa";
import { LuLeaf } from "react-icons/lu";
import { SiGumtree } from "react-icons/si";
import { TbPigMoney } from "react-icons/tb";

const economyCards = [
  {
    iconSrc: "/economyIcon.svg",
    title: "Desconto mensal de 20% a 90%",
    text: "Economia recorrente todos os meses. O percentual pode variar conforme perfil de consumo e disponibilidade de energia.",
  },
  {
    iconSrc: "/painel.svg",
    title: "Sem investimento em placas solares",
    text: "Você recebe créditos de energia direto na sua fatura, sem obra, sem instalação e sem mudar nada no seu imóvel.",
  },
  {
    iconSrc: "/graphicIcon.svg",
    title: "Você vê sua economia na prática",
    text: "Todo mês sua fatura apresenta o resumo do desconto e os créditos de energia aplicados.",
  },
  {
    iconSrc: "/tree.svg",
    title: "Energia limpa e sustentável",
    text: "Além de economizar, você contribui com energia renovável e reduz seu impacto ambiental.",
  },
];

type ImpactHighlight = {
  value: string;
  title: string;
  text: string;
  Icon?: IconType;
  iconSrc?: string;
};

const impactHighlights: ImpactHighlight[] = [
  {
    Icon: LuLeaf,
    value: "+ 15,2 t/ano de CO₂ evitadas",
    title: "Redução de emissões",
    text: "A utilização de energia renovável reduz a dependência de fontes convencionais e evita a emissão de toneladas de CO₂ na atmosfera.",
  },
  {
    Icon: SiGumtree,
    value: "+ 8.900 árvores/ano equivalentes",
    title: "Impacto ambiental traduzido",
    text: "A redução acumulada de emissões pode ser convertida em equivalência ambiental, representando milhares de árvores preservadas ao longo do período.",
  },
  {
    Icon: TbPigMoney,
    value: "+ R$ 2,4 milhões economizados",
    title: "Impacto financeiro coletivo",
    text: "A soma da economia mensal dos clientes gera impacto financeiro real e recorrente, fortalecendo um modelo sustentável para todos.",
  },
];

function splitImpactValue(value: string) {
  const match = value.match(
    /^(\+\s*(?:R\$\s*)?[\d.,]+(?:\s*milh(?:ão|ões))?)(.*)$/i,
  );

  if (!match) {
    return { amount: value, context: "" };
  }

  return {
    amount: match[1].trim(),
    context: match[2].trim(),
  };
}

export default function EconomiaSection() {
  return (
    <div id="economia" className="economy-hero fade-in-up">
      <div className="economy-hero-content">
        <p className="economy-kicker">Economia inteligente</p>
        <h2 className="economy-title">Economia real na sua conta de luz</h2>
        <p className="economy-subtitle">
          Desconto garantido, previsibilidade financeira e total transparência
          para PF e PJ.
        </p>

        <div className="economy-cards-grid">
          {economyCards.map((item) => (
            <Card
              className="card-economy card-economy-modern"
              variant="borderless"
              key={item.title}
            >
              <div className="economy-card-heading">
                <span className="economy-icon-wrap" aria-hidden>
                  <Image
                    src={item.iconSrc}
                    alt=""
                    aria-hidden
                    width={24}
                    height={24}
                    className="economy-svg-icon"
                  />
                </span>
                <h3 className="font-black">{item.title}</h3>
              </div>
              <p>{item.text}</p>
            </Card>
          ))}
        </div>

        <div id="impacto" className="economy-impact-strip">
          <div className="economy-impact-head"></div>

          <div className="economy-impact-grid">
            {impactHighlights.map((item) => {
              const { amount, context } = splitImpactValue(item.value);

              return (
                <article key={item.title} className="economy-impact-item">
                  <span className="economy-impact-icon-wrap" aria-hidden>
                    {item.Icon ? (
                      <item.Icon className="economy-impact-lib-icon" />
                    ) : item.iconSrc ? (
                      <Image
                        src={item.iconSrc}
                        alt=""
                        aria-hidden
                        width={44}
                        height={44}
                        className="economy-svg-icon"
                      />
                    ) : null}
                  </span>
                  <p className="economy-impact-value">
                    <span className="economy-impact-value-number">
                      {amount}
                    </span>
                    {context ? (
                      <span className="economy-impact-value-context">
                        {context}
                      </span>
                    ) : null}
                  </p>
                  <h4 className="economy-impact-item-title">{item.title}</h4>
                  <p className="economy-impact-item-text">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
