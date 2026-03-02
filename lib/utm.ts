export type UtmData = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

const UTM_KEYS: Array<keyof UtmData> = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

export function extractUtmsFromSearchParams(searchParams: URLSearchParams): UtmData {
  const utms: UtmData = {};

  UTM_KEYS.forEach((key) => {
    const value = searchParams.get(key);
    if (value) {
      utms[key] = value;
    }
  });

  return utms;
}

export function formatWhatsAppBR(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}
