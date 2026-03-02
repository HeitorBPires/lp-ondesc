"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";
import { Form, Input, Select } from "antd";
import { z } from "zod";
import { paranaCities } from "@/lib/cities";
import { formatWhatsAppBR, onlyDigits } from "@/lib/utm";

type BillingMode = "ANUAL" | "MENSAL";
type DiscountFormValues = {
  city: string;
  name: string;
  cellphone: string;
  website?: string;
};

type CityOption = {
  label: string;
  value: string;
};

const SLIDER_MIN = 100;
const SLIDER_MAX = 2000;
const SLIDER_STEP = 10;
const DEFAULT_CONSUMO = 350;

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function formatCurrencyBR(value: number) {
  return currencyFormatter.format(value);
}

function buildCityOptions(cities: string[]): CityOption[] {
  return [...new Set(cities)]
    .sort((a, b) => a.localeCompare(b, "pt-BR"))
    .map((city) => ({ label: city, value: city }));
}

const citySchema = z
  .string({ message: "Cidade é obrigatória." })
  .trim()
  .min(1, "Cidade é obrigatória.");

const nameSchema = z
  .string({ message: "Nome é obrigatório." })
  .trim()
  .min(1, "Nome é obrigatório.")
  .refine(
    (value) => value.split(/\s+/).filter(Boolean).length >= 2,
    "Digite nome e sobrenome.",
  );

const cellphoneSchema = z
  .string({ message: "Celular é obrigatório." })
  .trim()
  .min(1, "Celular é obrigatório.")
  .refine((value) => {
    const digits = onlyDigits(value);

    if (digits.length === 11) {
      return /^[1-9]{2}9\d{8}$/.test(digits);
    }

    if (digits.length === 10) {
      return /^[1-9]{2}[2-9]\d{7}$/.test(digits);
    }

    return false;
  }, "Digite um celular válido com DDD.");

function validateWithSchema<T>(
  schema: z.ZodType<T>,
  value: unknown,
): Promise<void> {
  const parsed = schema.safeParse(value);

  if (parsed.success) {
    return Promise.resolve();
  }

  return Promise.reject(
    new Error(parsed.error.issues[0]?.message || "Campo inválido."),
  );
}

export default function DiscountSimulationSection() {
  const [form] = Form.useForm<DiscountFormValues>();
  const [mode, setMode] = useState<BillingMode>("ANUAL");
  const [cityOptions, setCityOptions] = useState<CityOption[]>(
    buildCityOptions(paranaCities),
  );
  const [consumoMensal, setConsumoMensal] = useState(DEFAULT_CONSUMO);
  const [showResult, setShowResult] = useState(false);

  const sliderProgress = useMemo(
    () => ((consumoMensal - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100,
    [consumoMensal],
  );

  const multiplier = mode === "MENSAL" ? 1 : 12;
  const economyPeriodText = mode === "MENSAL" ? "por mês" : "por ano";
  const economiaHoje = consumoMensal * 0.2 * multiplier;
  const economiaMax = consumoMensal * 0.9 * multiplier;
  const sliderValueLabel = `${formatCurrencyBR(consumoMensal)}/mês`;

  const cardModeClass = mode === "ANUAL" ? "mode-annual" : "mode-monthly";

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function loadParanaCities() {
      try {
        const response = await fetch(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados/PR/municipios",
          { signal: controller.signal },
        );

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as Array<{ nome: string }>;
        const cities = data.map((city) => city.nome).filter(Boolean);

        if (!cancelled && !controller.signal.aborted && cities.length > 0) {
          setCityOptions(buildCityOptions(cities));
        }
      } catch {
        // Keep fallback local list when the external source is unavailable.
      }
    }

    loadParanaCities();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const sliderStyle = {
    "--discount-slider-progress": `${sliderProgress}%`,
  } as CSSProperties;

  const handleSubmit = async (values: DiscountFormValues) => {
    setShowResult(true);

    const payload = {
      nome: values.name.trim(),
      cidade: values.city.trim(),
      telefone: onlyDigits(values.cellphone),
      valor_fatura: consumoMensal,
      website: values.website?.trim() ?? "",
      status: "novo" as const,
      origem: "LP-Simulação" as const,
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Falha ao registrar simulação.");
      }
    } catch (error) {
      console.error("Erro ao enviar simulação:", error);
    }
  };

  return (
    <div id="simulador" className="discount-simulation-section fade-in-up">
      <div className={`discount-simulation-card ${cardModeClass}`}>
        <div
          className="discount-simulation-toggle"
          role="tablist"
          aria-label="Período da simulação"
        >
          <button
            type="button"
            className={`discount-toggle-option ${mode === "ANUAL" ? "active" : ""}`}
            onClick={() => setMode("ANUAL")}
          >
            ANUAL
          </button>
          <button
            type="button"
            className={`discount-toggle-option ${mode === "MENSAL" ? "active" : ""}`}
            onClick={() => setMode("MENSAL")}
          >
            MENSAL
          </button>
        </div>

        <h2 className="discount-simulation-title">
          Descubra quanto você pode economizar
        </h2>
        <p className="discount-simulation-subtitle">
          Simule em poucos segundos e veja o valor estimado do seu desconto com
          energia renovável.
        </p>

        <Form
          layout="vertical"
          form={form}
          className="discount-simulation-form"
          onFinish={handleSubmit}
          onFinishFailed={() => setShowResult(false)}
        >
          <Form.Item
            name="website"
            style={{
              position: "absolute",
              left: "-9999px",
              opacity: 0,
              height: 0,
              overflow: "hidden",
            }}
          >
            <Input
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              placeholder="Seu site"
            />
          </Form.Item>

          <div className="discount-form-grid">
            <Form.Item
              className="discount-field"
              name="city"
              label="Cidade"
              rules={[
                {
                  validator: (_, value?: string) =>
                    validateWithSchema(citySchema, value),
                },
              ]}
            >
              <Select
                size="large"
                showSearch
                optionFilterProp="label"
                options={cityOptions}
                placeholder="Digite sua cidade"
                getPopupContainer={(triggerNode) =>
                  triggerNode.parentElement || document.body
                }
              />
            </Form.Item>

            <Form.Item
              className="discount-field"
              name="name"
              label="Nome"
              rules={[
                {
                  validator: (_, value?: string) =>
                    validateWithSchema(nameSchema, value),
                },
              ]}
            >
              <Input size="large" placeholder="Seu nome completo" />
            </Form.Item>

            <Form.Item
              className="discount-field"
              name="cellphone"
              label="Celular"
              getValueFromEvent={(event) =>
                formatWhatsAppBR(event?.target?.value ?? "")
              }
              rules={[
                {
                  validator: (_, value?: string) =>
                    validateWithSchema(cellphoneSchema, value),
                },
              ]}
            >
              <Input
                size="large"
                inputMode="numeric"
                placeholder="(00) 00000-0000"
              />
            </Form.Item>
          </div>

          <div className="discount-slider-wrap">
            <p className="discount-slider-label">
              Qual é o seu gasto médio mensal com energia?
            </p>
            <p className="discount-slider-value">{sliderValueLabel}</p>
            <input
              className="discount-range"
              type="range"
              min={SLIDER_MIN}
              max={SLIDER_MAX}
              step={SLIDER_STEP}
              value={consumoMensal}
              onChange={(event) => setConsumoMensal(Number(event.target.value))}
              style={sliderStyle}
            />
          </div>

          <button
            disabled={showResult}
            type="submit"
            className="discount-submit-button"
          >
            Calcular meu desconto
          </button>
        </Form>

        <div
          className={`discount-result-wrap ${showResult ? "is-visible" : ""}`}
        >
          <div className="discount-result-content">
            <p className="discount-result-title">
              A partir de hoje, você pode economizar:
            </p>
            <p className="discount-result-value">
              {formatCurrencyBR(economiaHoje)} {economyPeriodText}
            </p>
            <p className="discount-result-caption">
              Com adesão ao modelo de créditos de energia renovável.
            </p>

            <p className="discount-result-secondary-title">
              E pode chegar até:
            </p>
            <p className="discount-result-secondary-value">
              {formatCurrencyBR(economiaMax)} {economyPeriodText}
            </p>
            <p className="discount-result-secondary-caption">
              Esse valor máximo depende de um processo mais avançado, como
              instalação de usina própria, e não é imediato.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
