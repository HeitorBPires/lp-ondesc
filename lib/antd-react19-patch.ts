"use client";

import { unstableSetRender } from "antd";
import { createRoot, type Root } from "react-dom/client";

declare global {
  var __ondescAntdReact19Patched__: boolean | undefined;
}

if (
  typeof window !== "undefined" &&
  !globalThis.__ondescAntdReact19Patched__
) {
  const roots = new Map<HTMLElement, Root>();

  unstableSetRender((node, container) => {
    let root = roots.get(container);

    if (!root) {
      root = createRoot(container);
      roots.set(container, root);
    }

    root.render(node);

    return async () => {
      await Promise.resolve();
      root.unmount();
      roots.delete(container);
    };
  });

  globalThis.__ondescAntdReact19Patched__ = true;
}
