"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Checkbox, Form, Input, Select, message } from "antd";
import { paranaCities } from "@/lib/cities";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { formatWhatsAppBR, onlyDigits } from "@/lib/utm";

type LeadValues = {
  nome: string;
  whatsapp: string;
  email: string;
  cidade: string[];
  tipoCliente: "PF" | "PJ";
  uc?: string;
  website?: string;
  lgpd: boolean;
};

export default function LeadForm() {
  const [form] = Form.useForm<LeadValues>();
  const [loading, setLoading] = useState(false);
  const [apiMessage, contextHolder] = message.useMessage();
  const didUnmountRef = useRef(false);

  useEffect(() => {
    return () => {
      didUnmountRef.current = true;
    };
  }, []);

  const cityOptions = useMemo(
    () => paranaCities.map((city) => ({ label: city, value: city })),
    [],
  );

  const whatsappLink = buildWhatsAppLink(
    "Olá, quero iniciar minha contratação com a ONDESC para economizar na conta de energia da Copel.",
  );

  const onFinish = async (values: LeadValues) => {
    setLoading(true);

    try {
      const uc = values.uc?.trim();
      const payload = {
        nome: values.nome.trim(),
        email: values.email.trim(),
        telefone: onlyDigits(values.whatsapp),
        cidade: values.cidade?.[0]?.trim() ?? "",
        tipo_pessoa: values.tipoCliente,
        ...(uc ? { uc } : {}),
        website: values.website?.trim() ?? "",
        status: "novo" as const,
        origem: "LP" as const,
      };

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Falha no envio");

      if (!didUnmountRef.current) {
        apiMessage.success(
          "Solicitação recebida! A Equipe ONDESC vai falar com você no WhatsApp para seguir com a contratação.",
        );
        form.resetFields();
      }
    } catch {
      if (!didUnmountRef.current) {
        apiMessage.error("Erro ao enviar. Tente novamente em instantes.");
      }
    } finally {
      if (!didUnmountRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <div id="form-cadastro" className="lead-form-shell fade-in-up">
      {contextHolder}
      <div className="lead-content-grid">
        <div className="lead-title-wrap">
          <p className="lead-kicker">Contratação ONDESC</p>
          <h2 className="lead-title">
            Quero começar a economizar com a ONDESC
          </h2>
          <p className="section-text lead-subtitle">
            Envie seus dados para iniciarmos sua análise e contratação digital.
            Nossa equipe valida sua elegibilidade e acompanha todo o processo
            via WhatsApp.
          </p>
        </div>

        <div className="lead-form-area">
          <p className="lead-form-panel-kicker">Solicitação de contratação</p>
          <h3 className="lead-form-panel-title">
            Dados para análise da sua unidade
          </h3>

          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            className="lead-form"
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

            <Form.Item
              className="lead-field"
              name="nome"
              label="Nome completo"
              rules={[{ required: true, message: "Informe seu nome." }]}
            >
              <Input size="large" placeholder="Seu nome completo" />
            </Form.Item>

            <Form.Item
              className="lead-field"
              name="whatsapp"
              label="WhatsApp principal"
              getValueFromEvent={(event) =>
                formatWhatsAppBR(event?.target?.value ?? "")
              }
              rules={[
                { required: true, message: "Informe seu WhatsApp." },
                {
                  validator: (_, value?: string) => {
                    const digits = onlyDigits(value || "");
                    return digits.length >= 10 && digits.length <= 11
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Digite um WhatsApp válido com DDD."),
                        );
                  },
                },
              ]}
            >
              <Input size="large" placeholder="(44) 99822-2692" />
            </Form.Item>

            <Form.Item
              className="lead-field"
              name="email"
              label="E-mail"
              rules={[
                { required: true, message: "Informe seu e-mail." },
                { type: "email", message: "E-mail inválido." },
              ]}
            >
              <Input size="large" placeholder="voce@exemplo.com" />
            </Form.Item>

            <Form.Item
              className="lead-field"
              name="cidade"
              label="Cidade da unidade"
              rules={[
                { required: true, message: "Selecione ou digite sua cidade." },
              ]}
            >
              <Select
                mode="tags"
                maxCount={1}
                size="large"
                showSearch
                options={cityOptions}
                optionFilterProp="label"
                placeholder="Selecione ou digite uma cidade do PR"
              />
            </Form.Item>

            <Form.Item
              className="lead-field"
              name="tipoCliente"
              label="Perfil da contratação"
              rules={[{ required: true, message: "Selecione PF ou PJ." }]}
            >
              <Select
                size="large"
                options={[
                  { label: "Pessoa Física (PF)", value: "PF" },
                  { label: "Pessoa Jurídica (PJ)", value: "PJ" },
                ]}
              />
            </Form.Item>

            <Form.Item
              className="lead-field"
              name="uc"
              label="Número da UC (opcional)"
              rules={[
                {
                  validator: (_, value?: string) => {
                    if (!value) return Promise.resolve();
                    const digits = onlyDigits(value);
                    return digits.length >= 5 && digits.length <= 20
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("UC deve ter entre 5 e 20 números."),
                        );
                  },
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Somente números"
                onChange={(event) => {
                  form.setFieldValue("uc", onlyDigits(event.target.value));
                }}
              />
            </Form.Item>

            <Form.Item
              className="lead-lgpd-item"
              name="lgpd"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, checked: boolean) =>
                    checked
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Aceite o contato da Equipe ONDESC."),
                        ),
                },
              ]}
            >
              <Checkbox>
                Autorizo contato da Equipe ONDESC para análise, proposta e
                continuidade da contratação.
              </Checkbox>
            </Form.Item>
            <p className="mini-disclaimer lead-copy-disclaimer">
              Você continua com a Copel normalmente. A economia pode variar
              conforme perfil e disponibilidade.
            </p>

            <div className="lead-form-actions">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
              >
                Solicitar contratação
              </Button>
              <Button
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                size="large"
              >
                Falar com especialista
              </Button>
            </div>
          </Form>

          <p className="mini-disclaimer lead-panel-disclaimer">
            Atendimento humanizado por WhatsApp, com suporte da Equipe ONDESC em
            todas as etapas.
          </p>
        </div>
      </div>
    </div>
  );
}
