import { createRoot } from "react-dom/client";
import { BridgeCommunity } from "./BridgeCommunity";
import "./globals.css";

const container = document.getElementById("root");
if (container) createRoot(container).render(<BridgeCommunity />);
