import { useErrors, useLoading } from '@/hooks/use-interact';
import { getHttpClient } from '../http';
import { ID, Pagination } from './type';

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

export function updatePrimitive<T>({ data, index, id, options }: { id: ID; index: string; data: Partial<T> | FormData; options?: any }): Promise<T> {
    if (data instanceof FormData) {
        data.append('_method', 'PUT');
        return getHttpClient()
            .post(`/${index}/${id}`, data, {
                ...options?.request,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((res) => {
                return Promise.resolve(res.data);
            });
    } else {
        return getHttpClient()
            .put(`/${index}/${id}`, data, options)
            .then((res) => {
                return Promise.resolve(res.data);
            });
    }
}

export function createPrimitive<T>({ index, data, options }: { index: string; data: Partial<T> | FormData; options?: any }): Promise<T> {
    const client = getHttpClient();

    if (data instanceof FormData) {
        return client
            .post(`/${index}`, data, {
                ...options?.request,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((res) => Promise.resolve(res.data));
    } else {
        return client.post(`/${index}`, data, options).then((res) => Promise.resolve(res.data));
    }
}

export function destroyPrimitive<T>({ index, id, options }: { index: string; id: ID; options?: any }): Promise<any> {
    return getHttpClient()
        .delete(`/${index}/${id}`, options?.request)
        .then((res) => res.data);
}

export const withLoadingAndErrors = async <T>(key: string, fn: () => Promise<T>): Promise<T> => {
    const { start, stop } = useLoading.getState();
    const { catch: catchError } = useErrors.getState();

    start(key);
    try {
        const result = await fn();
        stop(key);
        return result;
    } catch (err) {
        stop(key);
        catchError(err);
        throw err;
    }
};

export const loadingKey = (operation: 'create' | 'update' | 'destroy', index: string, id?: ID) => {
    return id ? `${operation}_${index}_${id}` : `${operation}_${index}`;
};
