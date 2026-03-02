"use client";

import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ImagePlaceholder from "./ImagePlaceholder";

const howSteps = [
  {
    title: "Cadastro e Simulação",
    text: "Você envia seus dados e recebe a simulação",
    description:
      "Informações básicas da sua conta para analisarmos seu perfil de consumo. Em pouco tempo você recebe a estimativa de desconto e todas as condições explicadas de forma clara.",
    image: "/sections/cadastro.jpg",
    alt: "Envio de dados para simulação",
  },
  {
    title: "Assinatura 100% Digital",
    text: "Adesão simples e digital",
    description:
      "Você assina o contrato online, sem papelada e sem burocracia. Nossa equipe acompanha tudo para garantir segurança e transparência.",
    image: "/sections/contrato.jpg",
    alt: "Assinatura 100% digital",
  },
  {
    title: "Energia gerada nas usinas parceiras",
    text: "Geramos energia para você",
    description:
      "A energia é produzida em usinas solares parceiras, no modelo de Geração Distribuída (GD), e injetada na rede elétrica.",
    image: "/sections/geracao.jpg",
    alt: "Energia gerada nas usinas parceiras",
  },
  {
    title: "Créditos aplicados na sua conta da Copel",
    text: "Os créditos reduzem sua conta",
    description:
      "A Copel recebe essa energia na rede e aplica os créditos diretamente na sua unidade consumidora, abatendo seu consumo mensal.",
    image: "/sections/credito.png",
    alt: "Créditos aplicados na sua conta da Copel",
  },
  {
    title: "Você paga com desconto",
    text: "Economia todos os meses",
    description:
      "Além da conta mínima da distribuidora, você recebe nossa fatura já com desconto aplicado — e começa a economizar sem mudar nada na sua estrutura.",
    image: "/sections/pagamento.jpg",
    alt: "Você paga com desconto",
  },
];

const DEFAULT_HEADER_OFFSET = 96;

// ✅ Recomendação: cooldown bem baixo + controle por acumulador de wheel
const SNAP_COOLDOWN_MS = 120;

// ✅ animação curta (se usar smooth no clique)
const SNAP_MAX_ANIM_MS = 450;

// ✅ tolerância mais folgada (smooth scroll raramente para “cravado”)
const SNAP_TARGET_TOLERANCE_PX = 12;

// ✅ Wheel accumulator (para trackpad/múltiplos wheel pequenos)
const WHEEL_RESET_MS = 120;
const WHEEL_THRESHOLD = 70; // ajuste fino: 40–90 (maior = mais “forte” precisa ser o gesto)

type SnapMetrics = {
  anchors: number[];
  stickyStartY: number;
  stickyEndY: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function readHeaderOffset() {
  if (typeof window === "undefined") return DEFAULT_HEADER_OFFSET;
  const header = document.querySelector(".header-shell") as HTMLElement | null;
  if (!header) return DEFAULT_HEADER_OFFSET;
  return Math.max(0, Math.round(header.getBoundingClientRect().height));
}

function nearestStepIndex(anchors: number[], y: number) {
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let i = 0; i < anchors.length; i += 1) {
    const distance = Math.abs(anchors[i] - y);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = i;
    }
  }

  return bestIndex;
}

export default function ComoFuncionaSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [headerOffset, setHeaderOffset] = useState(DEFAULT_HEADER_OFFSET);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);

  const rafRef = useRef(0);
  const activeStepRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const animationTargetYRef = useRef<number | null>(null);
  const animationStartedAtRef = useRef(0);
  const lastSnapTsRef = useRef(0);

  // ✅ wheel accumulator refs
  const wheelAccumRef = useRef(0);
  const lastWheelTsRef = useRef(0);

  const stepsCount = howSteps.length;
  const scrollPages = useMemo(() => stepsCount, [stepsCount]);

  useEffect(() => {
    howSteps.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  }, []);

  const getSnapMetrics = useCallback((): SnapMetrics | null => {
    const wrapEl = wrapRef.current;
    if (!wrapEl || stepsCount <= 0) return null;

    const wrapRect = wrapEl.getBoundingClientRect();
    const wrapStartY = wrapRect.top + window.scrollY;

    // Referência consistente: 100vh + innerHeight
    const viewportH = window.innerHeight;
    const wrapHeight = wrapRect.height;
    const totalScrollable = Math.max(1, wrapHeight - viewportH);

    const stepGap = stepsCount > 1 ? totalScrollable / (stepsCount - 1) : 0;

    // ✅ Âncoras compensadas pelo headerOffset
    const anchors = Array.from(
      { length: stepsCount },
      (_, index) => wrapStartY + index * stepGap - headerOffset,
    );

    const stickyStartY = anchors[0];
    const stickyEndY = anchors[anchors.length - 1];

    return { anchors, stickyStartY, stickyEndY };
  }, [headerOffset, stepsCount]);

  const isStickyActive = useCallback(() => {
    const metrics = getSnapMetrics();
    if (!metrics) return false;

    const y = window.scrollY;
    return y >= metrics.stickyStartY - 1 && y <= metrics.stickyEndY - 8;
  }, [getSnapMetrics]);

  const syncActiveStepFromScroll = useCallback(() => {
    const metrics = getSnapMetrics();
    if (!metrics) return;

    const index = nearestStepIndex(metrics.anchors, window.scrollY);
    activeStepRef.current = index;
    setActiveStep((prev) => (prev === index ? prev : index));
  }, [getSnapMetrics]);

  const finishAnimationIfNeeded = useCallback(() => {
    if (!isAnimatingRef.current) return;

    const targetY = animationTargetYRef.current;
    const timedOut =
      Date.now() - animationStartedAtRef.current > SNAP_MAX_ANIM_MS;
    const reachedTarget =
      targetY != null &&
      Math.abs(window.scrollY - targetY) <= SNAP_TARGET_TOLERANCE_PX;

    if (timedOut || reachedTarget) {
      isAnimatingRef.current = false;
      animationTargetYRef.current = null;
    }
  }, []);

  // ✅ snap com behavior configurável:
  // - wheel/teclado: "auto" (instantâneo, sem delay)
  // - clique: "smooth" (bonito)
  const snapToStep = useCallback(
    (nextIndex: number, behavior: ScrollBehavior = "auto") => {
      const metrics = getSnapMetrics();
      if (!metrics) return;

      const safeIndex = clamp(nextIndex, 0, stepsCount - 1);
      const targetY = metrics.anchors[safeIndex];

      activeStepRef.current = safeIndex;
      setActiveStep(safeIndex);

      // Só marca "animando" se for smooth
      if (behavior === "smooth") {
        isAnimatingRef.current = true;
        animationTargetYRef.current = targetY;
        animationStartedAtRef.current = Date.now();
      } else {
        isAnimatingRef.current = false;
        animationTargetYRef.current = null;
      }

      lastSnapTsRef.current = Date.now();

      window.scrollTo({ top: targetY, behavior });

      // ✅ garantia de destravar (apenas no smooth)
      if (behavior === "smooth") {
        window.setTimeout(() => {
          if (isAnimatingRef.current) {
            isAnimatingRef.current = false;
            animationTargetYRef.current = null;
          }
        }, SNAP_MAX_ANIM_MS + 50);
      }
    },
    [getSnapMetrics, stepsCount],
  );

  // ✅ gesto de 1-step (sem “travão” longo)
  const handleStepGesture = useCallback(
    (direction: 1 | -1) => {
      const metrics = getSnapMetrics();
      if (!metrics) return false;

      const now = Date.now();
      if (isAnimatingRef.current) return true;

      if (now - lastSnapTsRef.current < SNAP_COOLDOWN_MS) return false;

      // ✅ pega o step REAL baseado no scroll atual (evita step “atrasado”)
      const current = nearestStepIndex(metrics.anchors, window.scrollY);
      activeStepRef.current = current; // mantém ref alinhada

      const atTop = current === 0;
      const atBottom = current === stepsCount - 1;

      if ((direction < 0 && atTop) || (direction > 0 && atBottom)) {
        return false; // libera sair
      }

      snapToStep(current + direction, "auto");
      return true;
    },
    [getSnapMetrics, snapToStep, stepsCount],
  );
  useEffect(() => {
    activeStepRef.current = activeStep;
  }, [activeStep]);

  useEffect(() => {
    const syncOffset = () => {
      const nextOffset = readHeaderOffset();
      setHeaderOffset(nextOffset);
      document.documentElement.style.setProperty(
        "--header-offset",
        `${nextOffset}px`,
      );
    };

    syncOffset();
    window.addEventListener("resize", syncOffset);

    const header = document.querySelector(
      ".header-shell",
    ) as HTMLElement | null;
    const observer =
      header && "ResizeObserver" in window
        ? new ResizeObserver(syncOffset)
        : null;

    if (header && observer) observer.observe(header);

    return () => {
      window.removeEventListener("resize", syncOffset);
      if (observer) observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const onWindowScroll = () => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0;
        finishAnimationIfNeeded();
        syncActiveStepFromScroll();
      });
    };

    onWindowScroll();
    window.addEventListener("scroll", onWindowScroll, { passive: true });
    window.addEventListener("resize", onWindowScroll);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onWindowScroll);
      window.removeEventListener("resize", onWindowScroll);
    };
  }, [finishAnimationIfNeeded, syncActiveStepFromScroll]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (!isStickyActive()) return;

      // Se estiver animando (apenas em clique smooth), não deixa “brigar”
      if (isAnimatingRef.current) {
        event.preventDefault();
        return;
      }

      const metrics = getSnapMetrics();
      if (!metrics) return;

      const rawDir = event.deltaY > 0 ? 1 : event.deltaY < 0 ? -1 : 0;
      if (!rawDir) return;

      // ✅ step REAL no momento do wheel
      const current = nearestStepIndex(metrics.anchors, window.scrollY);
      const atTop = current === 0;
      const atBottom = current === stepsCount - 1;

      // ✅ Se está na borda tentando SAIR, não captura nada (nem threshold)
      // Isso evita “puxar de volta” e evita sensação de prender.
      if ((rawDir < 0 && atTop) || (rawDir > 0 && atBottom)) {
        wheelAccumRef.current = 0;
        return; // deixa o scroll do browser continuar
      }

      const now = Date.now();

      // Reseta acumulador se o gesto pausou
      if (now - lastWheelTsRef.current > WHEEL_RESET_MS) {
        wheelAccumRef.current = 0;
      }
      lastWheelTsRef.current = now;

      wheelAccumRef.current += event.deltaY;

      // Ainda não passou do threshold: captura para não “escorregar” dentro da seção
      if (Math.abs(wheelAccumRef.current) < WHEEL_THRESHOLD) {
        event.preventDefault();
        return;
      }

      const direction = wheelAccumRef.current > 0 ? 1 : -1;
      wheelAccumRef.current = 0;

      const captured = handleStepGesture(direction as 1 | -1);
      if (captured) event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!isStickyActive()) return;

      let direction: 1 | -1 | null = null;
      if (event.key === "ArrowDown" || event.key === "PageDown") direction = 1;
      if (event.key === "ArrowUp" || event.key === "PageUp") direction = -1;
      if (event.key === " ") direction = event.shiftKey ? -1 : 1;
      if (!direction) return;

      const captured = handleStepGesture(direction);
      if (captured) event.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [handleStepGesture, isStickyActive]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const stickyEl = stickyRef.current;
    if (!stickyEl) return;

    const checkStickyHealth = () => {
      const computed = window.getComputedStyle(stickyEl);
      if (computed.position !== "sticky") {
        console.warn(
          "[ComoFunciona][StickyDebug] sticky sem position: sticky",
          {
            position: computed.position,
            element: stickyEl,
          },
        );
      }

      const badOverflow: Array<{
        tag: string;
        className: string;
        overflow: string;
      }> = [];
      const badEffects: Array<{
        tag: string;
        className: string;
        transform: string;
        filter: string;
        perspective: string;
        backdropFilter: string;
        contain: string;
      }> = [];

      let parent = stickyEl.parentElement;
      while (parent) {
        const cs = window.getComputedStyle(parent);

        const overflowValues = [cs.overflow, cs.overflowX, cs.overflowY];
        const hasBadOverflow = overflowValues.some(
          (value) => value !== "visible" && value !== "clip",
        );

        if (hasBadOverflow) {
          badOverflow.push({
            tag: parent.tagName.toLowerCase(),
            className: parent.className,
            overflow: `${cs.overflow} / ${cs.overflowX} / ${cs.overflowY}`,
          });
        }

        if (
          cs.transform !== "none" ||
          cs.filter !== "none" ||
          cs.perspective !== "none" ||
          cs.backdropFilter !== "none" ||
          cs.contain !== "none"
        ) {
          badEffects.push({
            tag: parent.tagName.toLowerCase(),
            className: parent.className,
            transform: cs.transform,
            filter: cs.filter,
            perspective: cs.perspective,
            backdropFilter: cs.backdropFilter,
            contain: cs.contain,
          });
        }

        parent = parent.parentElement;
      }

      if (badOverflow.length) {
        console.warn(
          "[ComoFunciona][StickyDebug] ancestors com overflow não-visível",
          badOverflow,
        );
      }
      if (badEffects.length) {
        console.warn(
          "[ComoFunciona][StickyDebug] ancestors com transform/filter/contain",
          badEffects,
        );
      }
    };

    checkStickyHealth();
    window.addEventListener("resize", checkStickyHealth);

    return () => {
      window.removeEventListener("resize", checkStickyHealth);
    };
  }, []);

  const step = howSteps[activeStep];

  return (
    <div
      className="como-funciona-root"
      style={{ "--header-offset": `${headerOffset}px` } as CSSProperties}
    >
      <div
        ref={wrapRef}
        className="como-scrolly-wrap"
        style={{ height: `calc(${scrollPages} * 100vh)` }}
      >
        <div ref={stickyRef} className="como-scrolly-sticky">
          <div className="como-heading fade-in-up flex flex-col items-center mb-2">
            <p className="program-referral-kicker">Como funciona</p>
            <h2>Role para avançar as etapas do processo.</h2>
          </div>

          <div className="como-scrolly-card">
            <div className="como-scrolly-grid">
              <div className="como-content-col justify-top h-full py-8 ">
                <div
                  className="como-timeline "
                  aria-label="Linha do tempo das etapas"
                >
                  {howSteps.map((item, index) => (
                    <div className="como-timeline-item" key={item.title}>
                      <button
                        type="button"
                        className={`como-timeline-step ${index <= activeStep ? "active" : ""}`}
                        // ✅ clique: smooth
                        onClick={() => snapToStep(index, "smooth")}
                        aria-label={`Ir para etapa ${index + 1}`}
                      >
                        <span className="como-timeline-dot">{index + 1}</span>
                      </button>

                      {index < howSteps.length - 1 && (
                        <span
                          className={`como-timeline-line ${index < activeStep ? "active" : ""}`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="como-active-stage flex text-left items-center gap-3 mt-10">
                  <span className="como-stage-number">
                    {String(activeStep + 1).padStart(2, "0")}
                  </span>
                  <div className="font-bold">
                    <h3>{step.title}</h3>
                    <p className="section-text">{step.text}</p>
                  </div>
                </div>

                <p className="mini-disclaimer-p pl-24">{step.description}</p>
              </div>

              <div className="como-image-col">
                <div className="como-image-stack" aria-hidden="true">
                  {howSteps.map((s, idx) => (
                    <ImagePlaceholder
                      key={s.title}
                      src={s.image}
                      alt={s.alt}
                      fallbackLabel={s.image}
                      className={`como-step-image ${idx === activeStep ? "is-active" : ""}`}
                      // primeira etapa pode ser priority
                      priority={idx === 0}
                      // opcional: eager para as próximas (se forem poucas imagens)
                      loading={idx <= 1 ? "eager" : "lazy"}
                      sizes="(max-width: 900px) 100vw, 40vw"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
