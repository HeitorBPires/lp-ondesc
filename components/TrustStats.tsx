import Image from "next/image";
import { Card, Col, Row } from "antd";
import { Icons } from "./icons";

const stats = [
  {
    title: "Atende todo o Paraná",
    text: "Cobertura para todas as cidades do PR.",
    iconSrc: "/parana.svg",
  },
  {
    title: "Para PF e PJ",
    text: "Solução para pessoa física e empresa.",
    Icon: Icons.people,
  },
  {
    title: "Processo 100% digital",
    text: "Fluxo rápido por WhatsApp e assinatura digital.",
    iconSrc: "/digital.svg",
  },
  {
    title: "Energia de usinas parceiras (GD)",
    text: "Modelo com créditos de energia conforme regras.",
    iconSrc: "/painel.svg",
  },
];

export default function TrustStats() {
  return (
    <div id="confianca" className="fade-in-up">
      <h2>Economize na sua conta de luz sem mudar nada na sua rotina</h2>
      <p className="section-text">
        Com a Ondesc, você reduz sua conta de energia sem instalar painéis
        solares, sem obras e sem investimento inicial. Tudo acontece de forma
        simples, digital e segura.
      </p>
      <p className="section-text">Simples, digital e sem burocracia</p>
      <Row gutter={[16, 16]}>
        {stats.map((stat) => (
          <Col key={stat.title} xs={24} sm={12} lg={6}>
            <Card className="stat-card" variant="borderless">
              {"iconSrc" in stat ? (
                <Image
                  src={stat.iconSrc!}
                  alt="Ícone do Paraná"
                  width={24}
                  height={24}
                  className="stat-icon-svg"
                />
              ) : (
                <stat.Icon className="stat-icon" />
              )}
              <h3>{stat.title}</h3>
              <p>{stat.text}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
