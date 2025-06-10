import { useErrors, useLoading } from '@/hooks/use-interact';
import { createQuery, execute, shape } from '@/lib/query';
import { createPrimitive, destroyPrimitive, fakePagination, loadingKey, updatePrimitive, withLoadingAndErrors } from './primitives';
import { ID, Operation, Pagination, ResourceState } from './type';

export const initResource = <T>(index: string, set: any, get: any): ResourceState<T> => {
    const runQuery = <T>(q: any, one: boolean = false): Promise<any> => {
        return execute(q).then((res: any) => {
            // If there is no data on the result.
            if (!res.hasOwnProperty('data')) {
                return Promise.resolve(one ? {} : []);
            }

            if (res.data == undefined) return Promise.resolve(one ? {} : []);

            if (!res.data.hasOwnProperty(index)) return Promise.resolve(one ? {} : []);

            if (res.data[index].length == 0) return Promise.resolve(one ? {} : []);

            if (one) {
                set({ current: res.data[index][0], pagination: fakePagination([]) });
                return Promise.resolve(res.data[index][0]);
            } else {
                if (q[index].paginate) {
                    if (res.data[index].hasOwnProperty('data')) {
                        set(() => ({
                            items: res.data[index].data as T[],
                            pagination: res.data[index],
                        }));
                        return Promise.resolve(res.data[index].data);
                    } else {
                        return Promise.resolve([]);
                    }
                } else {
                    set(() => ({
                        items: res.data[index] as T[],
                        pagination: fakePagination(res.data[index]),
                    }));
                    return Promise.resolve(res.data[index]);
                }
            }
        });
    };

    return {
        items: [],
        pagination: fakePagination([]) as Pagination,

        fetch: (q?: any) => {
            return runQuery(createQuery({ [index]: q ?? get().query }));
        },

        fetchOne: (q?: any) => {
            return runQuery(createQuery({ [index]: shape(q ?? get().query).limit(1) }), true);
        },

        transform: (item: T) => item,

        setCurrent: (inputs: Partial<T>) =>
            set((state: any) =>
                get().transform({
                    current: {
                        ...state.current,
                        ...inputs,
                    },
                }),
            ),
        setItems: (items: Partial<T>[]) => {
            set(() => ({
                items: items.map((item) => get().transform(item)),
            }));
        },
        add: (item: T, addFirst: boolean = false) => {
            const { items, setItems } = get();
            setItems(addFirst ? [item, ...items] : [...items, item]);
        },
        filter: (predicate: (item: T, index: number) => boolean) => {
            const { items, setItems } = get();
            setItems(items.filter(predicate));
        },
        remove: (index: number) => {
            get().filter((item: T, i: number) => i != index);
        },
        sync: (data: Partial<T>, predicate: (item: T) => boolean) => {
            const { items, setItems } = get();
            setItems(items.map((item: T) => (predicate(item) ? data : item)));
        },
        syncWithId: (data: Partial<T>) => {
            get().sync(data, (item: T) => (item as any).id == (data as any).id);
        },

        update: (id: ID, data: Partial<T> | FormData, options?: any) => {
            return withLoadingAndErrors(`update_${index}_${id}`, async () => {
                const updated = await updatePrimitive<T>({ data, index, id, options });
                if (options?.sync !== false) get().syncWithId(data);
                return updated;
            });
        },

        create: (data: Partial<T> | FormData, options?: any) => {
            return withLoadingAndErrors(`create_${index}`, async () => {
                const created = await createPrimitive<T>({ index, data, options });

                if (options?.sync !== false) {
                    const addFirst = get().add(created, options?.addFirst === true);
                }

                return created;
            });
        },

        destroy: (id: ID, options?: any) => {
            return withLoadingAndErrors(loadingKey('destroy', index, id), async () => {
                const deleted = await destroyPrimitive({ index, id, options });

                if (options?.sync !== false) {
                    get().filter((item: T) => (item as any).id !== id);
                }

                return deleted;
            });
        },

        updateCurrent: (data: Partial<T>, options?: any) => {
            const current = get().current;
            if (!current) {
                useErrors.getState().set(index, 'No current element selected.');
                return Promise.reject('No current element selected.');
            }
            return get().update(current.id, data, options);
        },

        destroyCurrent: (options?: any) => {
            const current = get().current;
            if (!current) {
                useErrors.getState().set(index, 'No current element selected.');
                return Promise.reject('No current element selected.');
            }

            return get().destroy(current.id, options);
        },

        loading: (operation: Operation, id?: ID) => {
            if (id) return useLoading.getState().status[loadingKey(operation, index, id)];
            else {
                return get().loadingCurrent(operation);
            }
        },

        loadingCurrent: (operation: Operation) => {
            const current = get().current;
            if (!current) {
                return false;
            } else {
                return useLoading.getState().status[loadingKey(operation, index, current.id)];
            }
        },
    };
};
