import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BirthdayExperience } from "../app/BirthdayExperience";
import "../app/globals.css";
import { giftContent } from "../content/giftContent";

const root = document.getElementById("root");

if (!root) throw new Error("Birthday letter root was not found.");

createRoot(root).render(
  <StrictMode>
    <BirthdayExperience content={giftContent} />
  </StrictMode>,
);
