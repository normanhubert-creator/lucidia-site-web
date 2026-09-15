/* Polices auto-hébergées : Vite les copie dans dist/assets et les sert
   depuis votre domaine. Aucun appel à Google Fonts. */
import "@fontsource-variable/manrope";
import "@fontsource-variable/inter";

import { createRoot } from "react-dom/client";
import SiteLucidIA from "./LucidIA.jsx";

createRoot(document.getElementById("racine")).render(<SiteLucidIA />);
