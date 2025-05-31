import { initResource, ResourceState } from "@/lib/resources";
import { create } from "zustand";
import { Account } from "./account";
import { Expense } from "./expense";

export interface User {
  id: string;
  name: string;
  created_at: string;
  // relationships
  accounts: Account[];
  expenses: Expense[];
}

// User state for storing and managing user data
interface UserState extends ResourceState<User> {}

export const useUser = create<UserState>((set) => ({
  ...initResource("users", set),

  current: {
    id: "",
    name: "",
    created_at: "",
    accounts: [],
    expenses: [],
  } as User,
}));
