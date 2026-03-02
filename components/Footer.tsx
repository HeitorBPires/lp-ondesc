import { getCompanyProfile } from "@/lib/company";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const navLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Benefícios", href: "#confianca" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Economia", href: "#economia" },
  { label: "Simulador", href: "#simulador" },
  { label: "Programa Indique & Ganhe", href: "#programa-indique-ganhe" },
];

export default function Footer() {
  const company = getCompanyProfile();
  const whatsappLink = buildWhatsAppLink(
    "Olá, quero iniciar minha contratação com a ONDESC.",
  );

  return (
    <footer className="footer-shell">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-main-group">
            <div className="footer-brand-col">
              <a
                href="#inicio"
                className="footer-brand-link"
                aria-label="Voltar ao início"
              >
                <span className="footer-brand-dot" aria-hidden />
                <span>{company.brandName}</span>
              </a>
              <p className="footer-brand-text">
                Plataforma de economia de energia para PF e PJ no Paraná, com
                contratação digital e suporte especializado.
              </p>
            </div>

            <nav className="footer-col footer-nav-col" aria-label="Navegação do rodapé">
              <h3 className="footer-col-title">NAVEGAÇÃO</h3>
              <ul className="footer-link-list">
                {navLinks.map((item) => (
                  <li key={item.href}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* <nav className="footer-col" aria-label="Links jurídicos">
            <h3 className="footer-col-title">JURÍDICO</h3>
            <ul className="footer-link-list">
              <li>
                <a href={company.termsUrl} {...termsLinkProps}>
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href={company.privacyUrl} {...privacyLinkProps}>
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </nav> */}

          <div className="footer-col footer-contact-col">
            <h3 className="footer-col-title">FALE COM A EQUIPE</h3>
            <p className="footer-contact-copy">
              Tire dúvidas e solicite sua contratação pelo canal oficial.
            </p>
            <div className="footer-actions">
              <a
                className="footer-btn footer-btn-primary"
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
              >
                Falar no WhatsApp
              </a>
              <a
                className="footer-btn footer-btn-secondary"
                href="#form-cadastro"
              >
                Solicitar contratação
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-bottom-left">© 2026 ONDESC</p>
          <p className="footer-bottom-right">
            A economia pode variar conforme perfil e disponibilidade de energia.
          </p>
        </div>
      </div>
    </footer>
  );
}
