const DEFAULT_NUMBER = "5541991799897";

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${DEFAULT_NUMBER}?text=${encodeURIComponent(message)}`;
}
