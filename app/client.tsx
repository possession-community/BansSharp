/// <reference types="vinxi/types/client" />
import { StartClient } from "@tanstack/react-start";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { FontProvider } from "~/lib/context/font-context";
import { createRouter } from "./router";

const router = createRouter();

hydrateRoot(
  document,
  <StrictMode>
    <FontProvider>
      <StartClient router={router} />
    </FontProvider>
  </StrictMode>,
);
