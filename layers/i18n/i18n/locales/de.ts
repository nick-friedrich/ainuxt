// AI Generation Reference: See /ai/README.md for guidelines and patterns.
import { layout } from "./de/layout";
import { page_index } from "./de/page_index";
import { page_contact } from "./de/page_contact";
import { common } from "./de/common";
import { validation } from "./de/validation";
import { page_login } from "./de/page_login";
import { page_register } from "./de/page_register";

// Combine all German translations
const de = {
  layout: {
    ...layout,
  },
  page_index: {
    ...page_index,
  },
  page_contact: {
    ...page_contact,
  },
  common: {
    ...common,
  },
  validation: {
    ...validation,
  },
  page_login: {
    ...page_login,
  },
  page_register: {
    ...page_register,
  },
};

export default defineI18nLocale(async locale => {
  // Return the combined object
  return de;
});
