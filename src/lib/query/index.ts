export * from './operators';
import { getHttpClient } from '../http';
import { evaluateClause } from './operators';
import { QueryChain, QueryObject } from './type';

export const createQuery = (input: any) => {
    const output: Record<string, QueryObject> = {};
    for (const [modelName, queryDefinition] of Object.entries(input)) {
        if ((queryDefinition as any).hasOwnProperty('_chain')) {
            output[modelName] = (queryDefinition as QueryChain).queryObject;
        } else {
            output[modelName] = buildModelQuery(queryDefinition);
        }
    }
    return output;
};

function xorEncrypt(str: string, key: string) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
}

export const execute = (queryObject: any) => {
    return getHttpClient().post('/query', {
        query: xorEncrypt(
            JSON.stringify(Object.fromEntries(Object.entries(queryObject).filter(([_, val]: [any, any]) => val != undefined))),
            'orion-key',
        ),
    });
};

function buildModelQuery(queryDefinition: any) {
    const query: any = {
        clauses: [],
        computed: {},
        select: new Set(),
        rels: {},
        order: [],
    };

    for (const [attribute, value] of Object.entries(queryDefinition) as any) {
        if (value === undefined) continue;

        // Check if it's a rel query. A rel query is define using the shape operator.
        // In this case it most have a chain
        if (value.hasOwnProperty('_chain')) {
            query.rels[attribute] = value.queryObject;
            continue;
        }

        // Evaluate non-chainable rules.
        if (typeof value !== 'object') {
            // Evaluate direct comparison.
            if (value !== '') {
                query.clauses.push({
                    name: 'where',
                    value: [attribute, '=', value],
                });
            } else {
                query.select.add(attribute);
            }
            continue;
        }

        // Evaluate computed properties
        if (typeof value === 'object' && value.type === 'computed') {
            query.computed[attribute] = value.values;
            continue;
        }

        // If the value has a chain, process it
        if (!value.hasOwnProperty('chain')) continue;

        // Evaluate order in chain.
        value.chain
            .filter((item: any) => item.type == 'order')
            .forEach((item: any) => {
                query.order.push([attribute, item.value]);
            });

        // Evaluate clause in chain.
        value.chain
            .filter((item: any) => item.type == 'clause')
            .forEach((item: any) => {
                query.clauses.push({
                    name: item.name,
                    value: evaluateClause(query, attribute, item),
                });
            });
    }

    query.select = Array.from(query.select);

    // Filter out empty query parts
    const output = Object.fromEntries(
        Object.entries(query).filter(([key, val]) =>
            typeof val === 'object' ? Object.keys(val as any).length : val != null && (val as string) !== '',
        ),
    );

    return output;
}

function chains(updates: any, data: any = { queryObject: {} }): QueryChain {
    let queryObject = {
        ...data.queryObject,
    };

    if (updates.hasOwnProperty('clauses')) {
        queryObject = {
            ...queryObject,
            ...updates,
            clauses: queryObject.clauses ? [...queryObject.clauses, ...updates.clauses] : updates.clauses,
        };
    } else {
        queryObject = {
            ...queryObject,
            ...updates,
        };
    }

    return {
        queryObject,
        ...chainable({
            ...data,
            queryObject,
        }),
    };
}

export function shape(queryDefinition: any): QueryChain {
    const queryObject = buildModelQuery(queryDefinition);
    return chains(queryObject);
}

const select = (attributes: string[] | string, data: any = {}) => {
    return chains(
        {
            select: Array.isArray(attributes) ? attributes : [attributes],
        },
        data,
    );
};

const paginate = (page: number, perPage: number, data: any = {}) => {
    return chains(
        {
            paginate: [page, perPage],
        },
        data,
    );
};

const limit = (value: number, data: any = {}) => {
    return chains(
        {
            limit: value,
        },
        data,
    );
};

const orderBy = (attribute: string, direction: 'desc' | 'asc', data: any = {}) => {
    return chains(
        {
            order: [attribute, direction],
        },
        data,
    );
};

const groupBy = (attribute: string, data: any = {}) => {
    return chains({ groupBy: attribute }, data);
};

const closure = (name: string, func: any, data: any) => {
    const chain = func(chains({}));
    if (!chain.queryObject.clauses) {
        return chains({}, data);
    }
    return chains(
        {
            clauses: [
                {
                    name: name,
                    value: chain.queryObject.clauses,
                },
            ],
        },
        data,
    );
};

const clause = (name: string = 'where', attribute: any, operator: any, value: any, data: any) => {
    return chains(
        {
            clauses: [
                {
                    name,
                    value: [attribute, operator, value],
                },
            ],
        },
        data,
    );
};

const chainable = (data: any) => {
    return {
        _chain: true,
        where: (attributeOrFunction: any, operatorOrData?: any, value?: any) => {
            if (typeof attributeOrFunction !== 'function') {
                return clause('where', attributeOrFunction, operatorOrData, value, data);
            } else {
                return closure('where', attributeOrFunction, data);
            }
        },
        orWhere: (attributeOrFunction: any, operatorOrData?: any, value?: any) => {
            if (typeof attributeOrFunction !== 'function') {
                return clause('orWhere', attributeOrFunction, operatorOrData, value, data);
            } else {
                return closure('orWhere', attributeOrFunction, data);
            }
        },
        exists: (func: any) => closure('whereExists', func, data),
        notExists: (func: any) => closure('whereExists', func, data),
        orExists: (func: any) => closure('orWhereExists', func, data),
        orNotExists: (func: any) => closure('orWhereNotExists', func, data),
        groupBy: (attribute: string) => groupBy(attribute, data),
        select: (...attributes: any) => select(attributes, data),
        paginate: (page: number, perPage: number) => paginate(page, perPage, data),
        limit: (value: number) => limit(value, data),
        orderBy: (attribute: string, direction: 'desc' | 'asc' = 'desc') => orderBy(attribute, direction, data),
    };
};
