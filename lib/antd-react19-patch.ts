"use client";

import { unstableSetRender } from "antd";
import { createRoot, type Root } from "react-dom/client";

declare global {
  var __ondescAntdReact19Patched__: boolean | undefined;
}

if (typeof window !== "undefined" && !globalThis.__ondescAntdReact19Patched__) {
  const roots = new Map<HTMLElement, Root>();

  unstableSetRender((node, container) => {
    const htmlContainer = container as HTMLElement;
    let root = roots.get(htmlContainer);

    if (!root) {
      root = createRoot(htmlContainer);
      roots.set(htmlContainer, root);
    }

    root.render(node);

    return async () => {
      await Promise.resolve();
      root.unmount();
      roots.delete(htmlContainer);
    };
  });

  globalThis.__ondescAntdReact19Patched__ = true;
}
