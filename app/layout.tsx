import type { Metadata } from "next";
import "antd/dist/reset.css";
import "./globals.css";

const siteUrl = "https://www.ondesc.com.br/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ONDESC | Desconto na conta de luz da Copel no Paraná",
  description:
    "Simule seu desconto (20% a 90%) na conta de energia da Copel. Para PF e PJ. Atendimento via WhatsApp.",
  openGraph: {
    title: "ONDESC | Desconto na conta de luz da Copel no Paraná",
    description:
      "Simule seu desconto (20% a 90%) na conta de energia da Copel. Para PF e PJ. Atendimento via WhatsApp.",
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/logoon.svg", width: 1200, height: 630, alt: "ONDESC" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
