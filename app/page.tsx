"use client";

import "@/lib/antd-react19-patch";
import { ConfigProvider } from "antd";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LeadForm from "@/components/LeadForm";
import ProgramXTab from "@/components/ProgramXTab";
import TrustStats from "@/components/TrustStats";
import EconomiaSection from "@/components/EconomiaSection";
import DiscountSimulationSection from "@/components/DiscountSimulationSection";
import ComoFuncionaSection from "@/components/ComoFuncionaSection";
import GradientBackground from "@/components/backgrounds/GradientBackground";
import SectionBackground from "@/components/backgrounds/SectionBackground";
import { ondescTheme } from "@/styles/theme";

export default function Home() {
  const goToSimulacao = (elementId: string) => {
    document
      .getElementById(elementId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <ConfigProvider
      theme={{
        token: ondescTheme,
      }}
    >
      <GradientBackground>
        <Header />
        <main>
          <Hero onSimulateClick={goToSimulacao} />

          <SectionBackground variant="light">
            <TrustStats />
          </SectionBackground>

          <SectionBackground
            id="como-funciona"
            variant="light"
            containerMode="wide"
          >
            <ComoFuncionaSection />
          </SectionBackground>

          <SectionBackground
            variant="soft"
            containerMode="none"
            className="section-economia-fullbleed"
          >
            <EconomiaSection />
          </SectionBackground>

          <SectionBackground
            variant="light"
            containerMode="none"
            className="discount-program-joined"
          >
            <div className="discount-program-stack">
              <DiscountSimulationSection />

              <div className="container pt-16">
                <div
                  id="programa-indique-ganhe"
                  className="program-referral-section fade-in-up"
                >
                  <p className="program-referral-kicker">
                    Programa Indique &amp; Ganhe
                  </p>
                  <h2 className="program-referral-title">
                    Indique. Ganhe. Cresça com a ONDESC.
                  </h2>
                  <p className="section-text program-referral-subtitle">
                    Transforme sua economia em renda recorrente indicando novos
                    clientes para a ONDESC.
                  </p>
                  <ProgramXTab />
                </div>
              </div>
            </div>
          </SectionBackground>

          <SectionBackground variant="soft">
            <LeadForm />
          </SectionBackground>
        </main>
        <Footer />
        <FloatingWhatsApp />
      </GradientBackground>
    </ConfigProvider>
  );
}
