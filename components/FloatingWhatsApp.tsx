import { buildWhatsAppLink } from "@/lib/whatsapp";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsApp() {
  const whatsappLink = buildWhatsAppLink(
    "Olá, quero simular meu desconto de energia na Copel com a ONDESC.",
  );

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noreferrer"
      aria-label="Abrir WhatsApp"
      className="floating-whatsapp"
    >
      <FaWhatsapp className="floating-whatsapp-icon" />
    </a>
  );
}
