import { layout } from "./en/layout";
import { page_index } from "./en/page_index";
import { page_contact } from "./en/page_contact";
import { common } from "./en/common";
import { validation } from "./en/validation";
import { page_register } from "./en/page_register";
import { page_login } from "./en/page_login";

export default defineI18nLocale(async locale => {
  return {
    ...en,
  };
});

const en = {
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
  page_register: {
    ...page_register,
  },
  page_login: {
    ...page_login,
  },
};

export type tType = typeof en;
