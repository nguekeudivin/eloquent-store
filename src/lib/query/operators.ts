import { ClauseChain } from "./type";

// Chainable.
export function evaluateClause(
  queryObject: any,
  attribute: string,
  clause: any
) {
  if (Array.isArray(clause.value) && typeof clause.value[0] === "object") {
    return clause.value.map((sub: any) => ({
      name: sub.name,
      value: evaluateClause(queryObject, attribute, sub),
    }));
  } else {
    // Regular item
    const a = clause.attr ? clause.attr : attribute;
    queryObject.select.add(a);

    const expression = [a];
    if (clause.operator) {
      expression.push(clause.operator);
    }

    if (clause.value) {
      expression.push(clause.value);
    }
    return expression;
  }
}

function joinChain(clause: any, data: any): ClauseChain {
  const clauses = data.clauses ? data.clauses || [] : [];

  if (clause) {
    const obj = clause;
    if (obj.name == undefined) {
      obj.name = "where";
    }
    clauses.push(obj);
  }

  return {
    clauses,
    ...chainable({
      ...data,
      clauses: clauses,
    }),
  };
}

const addNestedClauses = (rootName: string, nestedClauses: any, data: any) => {
  const clauses: any = [];
  for (const [attribute, chaining] of Object.entries(nestedClauses)) {
    if (typeof chaining !== "object") {
      // Direct equal comparison.
      clauses.push({
        type: "clause",
        name: "where",
        operator: "=",
        value: chaining,
      });
      continue;
    }

    if (chaining != null && typeof chaining == "object") {
      (chaining as any).chain.forEach((clause: any) => {
        clauses.push({
          ...clause,
          attr: attribute,
        });
      });
    }
  }
  return joinChain(
    {
      type: "clause",
      name: rootName,
      value: clauses,
    },
    {
      ...data,
      name: rootName,
    }
  );
};

// Not chainable.
export const compute = (...values: any) => {
  return { type: "computed", values };
};

export const equal = (value: any, data: any = {}) => {
  return joinChain(
    { type: "clause", name: data.name, attr: data.attr, operator: "=", value },
    data
  );
};

export const or = (attrOrClauses?: any, data: any = {}) => {
  if (typeof attrOrClauses == "string" || attrOrClauses == undefined) {
    // Then is an attribute
    return joinChain(undefined, {
      ...data,
      attr: attrOrClauses,
      name: "orWhere",
    });
  } else {
    return addNestedClauses("orWhere", attrOrClauses, data);
  }
};

export const and = (attrOrClauses?: any, data: any = {}) => {
  if (typeof attrOrClauses == "string" || attrOrClauses == undefined) {
    // Then is an attribute
    return joinChain(undefined, {
      ...data,
      attr: attrOrClauses,
      name: "where",
    });
  } else {
    return addNestedClauses("where", attrOrClauses, data);
  }
};

export const order = (value: any = "asc", data: any = {}) => {
  return joinChain({ type: "order", attr: data.attr, value }, data);
};

export const greaterThan = (value: any, data: any = {}) => {
  return joinChain(
    { type: "clause", name: data.name, attr: data.attr, operator: ">", value },
    data
  );
};

export const lessThan = (value: any, data: any = {}) => {
  return joinChain(
    { type: "clause", name: data.name, attr: data.attr, operator: "<", value },
    data
  );
};

export const notEqual = (value: any, data: any = {}) => {
  return joinChain(
    { type: "clause", name: data.name, attr: data.attr, operator: "!=", value },
    data
  );
};

export const lessThanOrEqual = (value: any, data: any = {}) => {
  return joinChain(
    { type: "clause", name: data.name, attr: data.attr, operator: "<=", value },
    data
  );
};

export const greaterThanOrEqual = (value: any, data: any = {}) => {
  return joinChain(
    { type: "clause", name: data.name, attr: data.attr, operator: ">=", value },
    data
  );
};

export const like = (value: any, data: any = {}) => {
  return joinChain(
    {
      type: "clause",
      name: data.name,
      attr: data.attr,
      operator: "like",
      value: `%${value}%`,
    },
    data
  );
};

export const between = (value1: any, value2: any, data: any = {}) => {
  return joinChain(
    {
      type: "clause",
      name: data.name == "where" ? "whereBetween" : "orWhereBetween",
      attr: data.attr,
      value: [value1, value2],
    },
    data
  );
};

export const notBetween = (value1: any, value2: any, data: any = {}) => {
  return joinChain(
    {
      type: "clause",
      name: data.name == "orWhere" ? "orWhereNotBetween" : "whereNotBetween",
      attr: data.attr,
      value: [value1, value2],
    },
    data
  );
};

export const isIn = (values: any, data: any = {}) => {
  return joinChain(
    {
      type: "clause",
      name: data.name == "orWhere" ? "orWhereIn" : "whereIn",
      attr: data.attr,
      value: values,
    },
    data
  );
};

export const notIn = (values: any, data: any = {}) => {
  return joinChain(
    {
      type: "clause",
      name: data.name == "orWhere" ? "orWhereNotIn" : "whereNotIn",
      attr: data.attr,
      value: values,
    },
    data
  );
};

export const isNull = (data: any = {}) => {
  return joinChain(
    {
      type: "clause",
      name: data.name == "orWhere" ? "orWhereNull" : "whereNull",
      attr: data.attr,
    },
    data
  );
};

export const isNotNull = (data: any = {}) => {
  return joinChain(
    {
      type: "clause",
      name: data.name == "orWhere" ? "orWhereNotNull" : "whereNotNull",
      attr: data.attr,
    },
    data
  );
};

const chainable = (data: any) => {
  return {
    _chain: true,
    and: (attrOrClauses?: any) => and(attrOrClauses, data),
    or: (attrOrClauses?: any) => or(attrOrClauses, data),
    order: (value: any = "asc") => order(value, data),
    equal: (value: any) => equal(value, data),
    greaterThan: (value: any) => greaterThan(value, data),
    lessThan: (value: any) => lessThan(value, data),
    like: (value: any) => like(value, data),
    between: (value1: any, value2: any) => between(value1, value2, data),
    notBetween: (value1: any, value2: any) => notBetween(value1, value2, data),
    notEqual: (value: any) => notEqual(value, data),
    lessThanOrEqual: (value: any) => lessThanOrEqual(value, data),
    greaterThanOrEqual: (value: any) => greaterThanOrEqual(value, data),
    in: (values: any) => isIn(values, data),
    notIn: (values: any) => notIn(values, data),
    isNull: () => isNull(data),
    isNotNull: () => isNotNull(data),
  };
};
