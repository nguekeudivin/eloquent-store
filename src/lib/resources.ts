import { getHttpClient } from "./http";

export type IdType = number | string;

export interface Pagination {
  current_page: number;
  data: any[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ResourceState<T> {
  pagination: Pagination;
  items: T[];
  current: T;
  // Exec a query that is provide.
  // It receive a high level modelQuery.
  fetch: () => Promise<any>;

  fetchOne: (id: IdType) => Promise<any>;

  // Client side update functions.
  set: (inputs: Partial<T>) => void;
  setAll: (inputs: Partial<T>[]) => void;
  add: (input: T, firstPosition?: boolean) => void;
  filter: (predicate: (resource: T) => boolean) => void;
  // Sync method allow us to update the value of a items inside the items list.
  // It's use when send an update request for a given value and do not what load the whole list.
  // Then we just sync the old state of the item into list with the new value.
  // The precidate is the function holding the condition use to find the item.
  sync: (data: Partial<T>, predicate: (item: T) => boolean) => void;

  syncWithId: (data: Partial<T>) => void;

  // Sending request to server.
  store: (data: Partial<T> | FormData, headers?: any) => Promise<any>;
  update: (
    id: string | number,
    data: Partial<T> | FormData,
    headers?: any
  ) => Promise<any>;
  destroy: (id: number | string) => Promise<any>;
}

export const fakePagination = (data: any[]): Pagination => {
  return {
    current_page: 1,
    data: data,
    first_page_url: "",
    from: 0,
    last_page: 1,
    last_page_url: "",
    links: [],
    next_page_url: "",
    path: "",
    per_page: data.length,
    prev_page_url: null,
    to: data.length,
    total: data.length,
  };
};

export const initResource = <T>(index: string, set: any): ResourceState<T> => {
  return {
    items: [],
    current: {} as T,
    pagination: fakePagination([]) as Pagination,

    set: (inputs: Partial<T>) =>
      set((state: any) => ({
        current: {
          ...state.current,
          ...inputs,
        },
      })),
    setAll: (inputs: Partial<T>[]) => {
      set(() => ({
        items: inputs,
      }));
    },
    add: (input: T, firstPosition: boolean = true) => {
      if (firstPosition) {
        set((state: any) => ({
          items: [...[input], ...state.items],
        }));
      } else {
        set((state: any) => ({
          items: [...state.items, ...[input]],
        }));
      }
    },
    filter: (predicate: (item: T) => boolean) => {
      set((state: any) => ({
        items: state.items.filter(predicate),
      }));
    },

    fetch: () => {
      return getHttpClient()
        .get(`${index}`)
        .then((res: any) => {
          return Promise.resolve(res.data.data);
        });
    },

    fetchOne: (id: IdType) => {
      return getHttpClient()
        .get(`${index}/${id}`)
        .then((res: any) => {
          return Promise.resolve(res.data.data);
        });
    },

    store: (data: Partial<T> | FormData) => {
      return getHttpClient()
        .post(`${index}`, data)
        .then((res: any) => {
          return Promise.resolve(res.data.data);
        });
    },
    update: (id: number | string, data: Partial<T> | FormData) => {
      return getHttpClient()
        .put(`${index}/${id}`, data)
        .then((res: any) => {
          return Promise.resolve(res.data.data);
        });
    },
    sync: (data: Partial<T>, predicate: (item: T) => boolean) => {
      set((state: any) => ({
        items: state.items.map((item: T) => {
          if (predicate(item)) {
            return data;
          } else {
            return item;
          }
        }),
      }));
    },
    syncWithId: (data: Partial<T>) => {
      set((state: any) => ({
        items: state.items.map((item: T) => {
          if ((item as any).id == (data as any).id) {
            return data;
          } else {
            return item;
          }
        }),
      }));
    },
    destroy: (id: number | string) => {
      return getHttpClient()
        .delete(`${index}/${id}`)
        .then((res: any) => {
          return Promise.resolve(res.data.id);
        });
    },
  };
};
