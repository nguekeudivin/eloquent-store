import { initResource, ResourceState } from "@/lib/resources";
import { create } from "zustand";

export interface Account {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  // relationship
  user: [];
}

interface AccountState extends ResourceState<Account> {}

export const useAccount = create<AccountState>((set, get) => ({
  ...initResource("accounts", set),
  current: {
    id: 0,
    name: "",
    created_at: "",
    updated_at: "",
  } as Account,
}));
