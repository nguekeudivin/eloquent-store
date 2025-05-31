import { initResource, ResourceState } from "@/lib/resources";
import { create } from "zustand";

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface CategoryState extends ResourceState<Category> {}

export const useCategory = create<CategoryState>((set, get) => ({
  ...initResource("categories", set),
  current: {
    id: 0,
    name: "",
    created_at: "",
    updated_at: "",
  } as Category,
}));
