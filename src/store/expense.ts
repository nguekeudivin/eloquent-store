import { initResource, ResourceState } from "@/lib/resources";
import { create } from "zustand";
import { User } from "./user";
import { Account } from "./account";
import { Category } from "./category";

export interface Expense {
  id: string;
  user_id: number;
  account_id: number;
  category_id: number;
  amount: number;
  description?: string;
  created_at: string;
  updated_at: string;

  // relationship
  user: User;
  account: Account;
  category: Category;
}

interface ExpenseState extends ResourceState<Expense> {}

export const useExpense = create<ExpenseState>((set, get) => ({
  ...initResource("expenses", set),
  current: {} as Expense,
}));
