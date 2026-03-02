"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "antd";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const menu = [
  { label: "Início", id: "inicio" },
  { label: "Benefícios", id: "confianca" },
  { label: "Como funciona", id: "como-funciona" },
  { label: "Economia", id: "economia" },
  { label: "Simulador", id: "simulador" },
];

export default function Header() {
  const [logoFailed, setLogoFailed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const whatsappLink = buildWhatsAppLink(
    "Olá, quero iniciar minha contratação com a ONDESC.",
  );

  const goTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  return (
    <header className="header-shell">
      <div className="container header-inner">
        <div className="header-left">
          <a href="#inicio" className="header-brand" aria-label="Início">
            {logoFailed ? (
              <span className="logo-fallback">ONDESC</span>
            ) : (
              <Image
                src="/logo.svg"
                alt="ONDESC"
                width={66}
                height={8}
                className="logo-img"
                onError={() => setLogoFailed(true)}
              />
            )}
          </a>
          <p className="header-subtitle">Ondesc Energy</p>
        </div>

        <nav className="header-menu" aria-label="Navegação principal">
          {menu.map((item) => (
            <button
              key={item.id}
              type="button"
              className="header-link"
              onClick={() => goTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <Button
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="header-btn header-btn-secondary"
          >
            Falar no WhatsApp
          </Button>
          <Button
            type="primary"
            className="header-btn header-btn-primary"
            onClick={() => goTo("form-cadastro")}
          >
            Solicitar contratação
          </Button>
        </div>

        <button
          type="button"
          className={`header-mobile-toggle ${mobileOpen ? "is-open" : ""}`}
          aria-label="Abrir menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`header-mobile-panel ${mobileOpen ? "is-open" : ""}`}>
        <div className="container header-mobile-content">
          <nav className="header-mobile-nav" aria-label="Navegação mobile">
            {menu.map((item) => (
              <button
                key={item.id}
                type="button"
                className="header-mobile-link"
                onClick={() => goTo(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="header-mobile-actions">
            <Button
              type="primary"
              className="header-btn header-btn-primary"
              onClick={() => goTo("form-cadastro")}
            >
              Solicitar contratação
            </Button>
            <Button
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="header-btn header-btn-secondary"
              onClick={() => setMobileOpen(false)}
            >
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
