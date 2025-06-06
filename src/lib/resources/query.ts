import { getHttpClient } from '../http';

type Computed = {
    [key: string]: any;
};

export type Query = {
    clauses?: any;
    computed?: Computed;
    select?: string[];
    rels?: { [key: string]: Query };
    order?: [string, string][];
    paginate?: any[];
    limit?: any;
};

export const query = (input: any) => {
    const output: any = {};
    for (const [modelName, modelQuery] of Object.entries(input)) {
        output[modelName] = make(modelQuery);
    }
    return output;
};

export const exec = (queryObject: any) => {
    return getHttpClient().post('/query', {
        query: JSON.stringify(Object.fromEntries(Object.entries(queryObject).filter(([_, val]: [any, any]) => val != undefined))),
    });
};

export function make(modelQuery: any) {
    const query: any = {
        clauses: [],
        computed: {},
        select: [],
        rels: {},
        order: [],
        paginate: [],
    };

    for (const [key, value] of Object.entries(modelQuery) as any) {
        if (value === undefined) continue;

        // Evaluate non-chainable rules.
        if (typeof value !== 'object') {
            // Evaluate direct comparison.
            if (value !== '' && !['_limit', '_paginate'].includes(key)) {
                query.clauses.push({
                    name: 'where',
                    value: [key, '=', value],
                });
            }

            if (!['_limit', '_paginate'].includes(key)) {
                query.select.push(key);
            }
            continue;
        }

        // Evaluate computed properties
        if (typeof value === 'object' && value.type === 'computed') {
            query.computed[key] = value.values;
            continue;
        }

        // Evaluate relationship (rel type)
        if (typeof value === 'object' && value.type === 'rel') {
            query.rels[key] = make(value.value);
        }

        // If the value has a chain, process it
        if (!value.hasOwnProperty('chain')) continue;

        value.chain.forEach((item: any) => {
            // Evaluate order
            if (item.type === 'order') {
                query.order.push([key, item.value]);
            }

            // Evaluate clause object
            if (item.type === 'clause') {
                // Handle subclauses
                if (Array.isArray(item.value) && typeof item.value[0] === 'object') {
                    const subClauses = item.value.map((sub: any) => ({
                        name: sub.name,
                        value: [key, sub.operator, sub.value],
                    }));
                    query.clauses.push({ name: item.name, value: subClauses });
                } else {
                    // Regular clause
                    query.clauses.push({
                        name: 'where',
                        value: [key, item.operator, item.value],
                    });
                }
                query.select.push(key);
            }
        });
    }

    // Filter out empty query parts
    const output = Object.fromEntries(
        Object.entries(query).filter(([key, val]) =>
            typeof val === 'object' ? Object.keys(val as any).length : val != null && (val as string) !== '',
        ),
    );

    // Handle specific fields like "_select", "_limit", and "_paginate"
    if (modelQuery.hasOwnProperty('_select')) {
        output['select'] = modelQuery['_select'];
    }

    if (modelQuery.hasOwnProperty('_limit')) {
        output['limit'] = modelQuery['_limit'];
    }

    if (modelQuery.hasOwnProperty('_paginate')) {
        output['paginate'] = modelQuery['_paginate'];
    }

    if (output.hasOwnProperty('select')) {
        output['select'] = (output['select'] as string[]).filter((item) => !['_limit', '_paginate'].includes(item));
    }

    return output;
}

// Not chainable.
export const compute = (...values: any) => {
    return { type: 'computed', values };
};

export const rel = (value: any) => {
    return { type: 'rel', value };
};

// Chainable.
export const joinChain = (obj: any, chain: any = []) => {
    chain = chain || []; // Fallback to an empty array if chain is undefined or null
    chain.push(obj);
    return {
        chain,
        ...chainable(chain),
    };
};

export const order = (value: any = 'asc', chain: any = []) => {
    return joinChain({ type: 'order', value }, chain);
};

export const equal = (value: any, chain: any = []) => {
    return joinChain({ type: 'clause', name: 'where', operator: '=', value }, chain);
};

export const greaterThan = (value: any, chain: any = []) => {
    return joinChain({ type: 'clause', name: 'where', operator: '>', value }, chain);
};

export const lessThan = (value: any, chain: any = []) => {
    return joinChain({ type: 'clause', name: 'where', operator: '<', value }, chain);
};

export const like = (value: any, chain: any = []) => {
    return joinChain({ type: 'clause', name: 'where', operator: 'like', value: `%${value}%` }, chain);
};

export const before = (value: any, chain: any = []) => {
    return joinChain({ type: 'clause', name: 'where', operator: '<', value }, chain);
};

export const after = (value: any, chain: any = []) => {
    return joinChain({ type: 'clause', name: 'where', operator: '>', value }, chain);
};

export const between = (value1: any, value2: any, chain: any = []) => {
    return joinChain(
        {
            type: 'clause',
            name: 'where',
            value: [
                { name: 'where', operator: '>', value: value1 },
                { name: 'where', operator: '<', value: value2 },
            ],
        },
        chain,
    );
};

export const notEqual = (value: any, chain: any = []) => {
    return joinChain({ type: 'clause', name: 'where', operator: '!=', value }, chain);
};

export const lessThanOrEqual = (value: any, chain: any = []) => {
    return joinChain({ type: 'clause', name: 'where', operator: '<=', value }, chain);
};

export const greaterThanOrEqual = (value: any, chain: any = []) => {
    return joinChain({ type: 'clause', name: 'where', operator: '>=', value }, chain);
};

export const inOperator = (values: any, chain: any = []) => {
    return joinChain({ type: 'clause', name: 'where', operator: 'IN', value: values }, chain);
};

export const notIn = (values: any, chain: any = []) => {
    return joinChain({ type: 'clause', name: 'where', operator: 'NOT IN', value: values }, chain);
};

export const isNull = (chain: any = []) => {
    return joinChain({ type: 'clause', name: 'where', operator: 'IS NULL', value: null }, chain);
};

export const isNotNull = (chain: any = []) => {
    return joinChain({ type: 'clause', name: 'where', operator: 'IS NOT NULL', value: null }, chain);
};

export const exists = (subquery: any, chain: any = []) => {
    return joinChain({ type: 'clause', name: 'where', operator: 'EXISTS', value: subquery }, chain);
};

export const notExists = (subquery: any, chain: any = []) => {
    return joinChain({ type: 'clause', name: 'where', operator: 'NOT EXISTS', value: subquery }, chain);
};

export const betweenDates = (startDate: any, endDate: any, chain: any = []) => {
    return joinChain(
        {
            type: 'clause',
            name: 'where',
            operator: 'BETWEEN',
            value: [startDate, endDate],
        },
        chain,
    );
};

export const chainable = (chain: any) => {
    return {
        order: (value: any = 'asc') => order(value, chain),
        equal: (value: any) => equal(value, chain),
        greaterThan: (value: any) => greaterThan(value, chain),
        lessThan: (value: any) => lessThan(value, chain),
        like: (value: any) => like(value, chain),
        before: (value: any) => before(value, chain),
        after: (value: any) => after(value, chain),
        between: (value1: any, value2: any) => between(value1, value2, chain),
        notEqual: (value: any) => notEqual(value, chain),
        lessThanOrEqual: (value: any) => lessThanOrEqual(value, chain),
        greaterThanOrEqual: (value: any) => greaterThanOrEqual(value, chain),
        in: (values: any) => inOperator(values, chain),
        notIn: (values: any) => notIn(values, chain),
        isNull: () => isNull(chain),
        isNotNull: () => isNotNull(chain),
        exists: (subquery: any) => exists(subquery, chain),
        notExists: (subquery: any) => notExists(subquery, chain),
        betweenDates: (startDate: any, endDate: any) => betweenDates(startDate, endDate, chain),
    };
};
