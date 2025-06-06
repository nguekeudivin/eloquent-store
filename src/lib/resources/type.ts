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

export const fakePagination = (data: any[]): Pagination => {
    return {
        current_page: 1,
        data: data,
        first_page_url: '',
        from: 0,
        last_page: 1,
        last_page_url: '',
        links: [],
        next_page_url: '',
        path: '',
        per_page: data.length,
        prev_page_url: null,
        to: data.length,
        total: data.length,
    };
};

export type ID = string | number;
export type Operation = 'create' | 'destroy' | 'update';

export interface OperationOptions {
    addFirst?: boolean;
    sync?: boolean;
    header?: any;
}

interface BaseResourceState<T> {
    current?: T;
    // Local State Change
    transform: (item: T) => T;
    setCurrent: (inputs: Partial<T>) => void;
    add: (input: T, firstPosition?: boolean) => void;
    sync: (data: Partial<T>, predicate: (item: T) => boolean) => void;
    syncWithId: (data: Partial<T>) => void;
    // Request to Server.
    create: (data: Partial<T> | FormData, options?: OperationOptions) => Promise<T>;
    update: (id: ID, data: Partial<T> | FormData, options?: OperationOptions) => Promise<T>;
    updateCurrent: (data: Partial<T>, options?: OperationOptions) => Promise<T>;
    destroyCurrent: (options?: OperationOptions) => Promise<any>;
    // Loading Mangement.
    loading: (operation: Operation, id?: ID) => boolean;
    loadingCurrent: (operation: Operation) => boolean;
}

export interface ResourceState<T> extends BaseResourceState<T> {
    pagination: Pagination;
    items: T[];
    // Client side update functions.
    setItems: (inputs: Partial<T>[]) => void;
    remove: (index: number) => void;
    filter: (predicate: (resource: T, index?: number) => boolean) => void;
    destroy: (id: ID, options?: OperationOptions) => Promise<any>;
}

export interface GroupedResourceState<T> extends BaseResourceState<T> {
    items: Record<ID, T[]>;
    pagination: Record<ID, Pagination>;
    // Local State.
    setItems: (inputs: Record<ID, T[]>) => void;
    setGroup: (groupId: ID, inputs: T[]) => void;
    remove: (groupId: ID, index: number) => void;
    filter: (groupId: ID, predicate: (item: T, index?: number) => boolean) => void;
    // Request to API
    destroy: (groupId: ID, id: ID, options?: OperationOptions) => Promise<any>;
}
