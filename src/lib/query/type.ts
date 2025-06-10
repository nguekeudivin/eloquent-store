export interface QueryObject {
  clauses?: any;
  computed?: any;
  select?: Set<string> | string[];
  rels?: Record<string, QueryObject>;
  order?: [string, string][];
  paginate?: any[];
  limit?: any;
  orderBy?: string[];
  groupBy?: string;
}

export interface QueryChain {
  queryObject: QueryObject;
  _chain: boolean;
  where: (
    attributeOrFunction: string | ((query: QueryChain) => void),
    operatorOrData?: any,
    value?: any
  ) => QueryChain;
  orWhere: (
    attributeOrFunction: string | ((query: QueryChain) => void),
    operatorOrData?: any,
    value?: any
  ) => QueryChain;
  exists: (func: (query: QueryChain) => void) => QueryChain;
  notExists: (func: (query: QueryChain) => void) => QueryChain;
  orExists: (func: (query: QueryChain) => void) => QueryChain;
  orNotExists: (func: (query: QueryChain) => void) => QueryChain;
  groupBy: (attribute: string) => QueryChain;
  select: (...attributes: any) => QueryChain;
  paginate: (page: number, perPage: number) => QueryChain;
  limit: (value: number) => QueryChain;
  orderBy: (attribute: string, direction?: "desc" | "asc") => QueryChain;
}

export interface ClauseChain {
  clauses: any[];
  _chain: boolean;
  and: (attrOrClauses?: any) => ClauseChain;
  or: (attrOrClauses?: any) => ClauseChain;
  order: (value?: any) => ClauseChain;
  equal: (value: any) => ClauseChain;
  greaterThan: (value: any) => ClauseChain;
  lessThan: (value: any) => ClauseChain;
  like: (value: any) => ClauseChain;
  between: (value1: any, value2: any) => ClauseChain;
  notBetween: (value1: any, value2: any) => ClauseChain;
  notEqual: (value: any) => ClauseChain;
  lessThanOrEqual: (value: any) => ClauseChain;
  greaterThanOrEqual: (value: any) => ClauseChain;
  in: (values: any) => ClauseChain;
  notIn: (values: any) => ClauseChain;
  isNull: () => ClauseChain;
  isNotNull: () => ClauseChain;
}
