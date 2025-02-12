import { ReactNode } from "react";

export interface MenuItem {
  label: string;
  icon?: ReactNode;
  route?: string;
  badge?: string | number;
  menu?: MenuItem[];
}

export type MenuOpenStatus = Record<string, boolean>;
