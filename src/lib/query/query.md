# Intuition

The query library is base on two inspirations:

- The first one was the way graphQL requests where made. In the request we describe exactly want we want to receive. And more on that in single request we may ask informations on many differents resources at the same time. No need to rely on heavy endpoints for each models or for a particular data retrieving need. <strong> We ask exactly what we want.
- The second is the Laravel eloquent builder. It's so powerfull and so cleaning.
  Hence I wanted a way combine the clearity of graphQL philosophy and the power of laravel eloquent builder in order to send request query using REST API.

# Writting query

This is a big example of what can be written.

```js
const q = createQuery({
  users: shape({
    id: "",
    age: greaterThan(10).lessThan(30).or().equal(12),
    firstname: like("divin").or("lastname").like("jordan"),
    balance: between(1000, 2000)
      .or({
        amount: 100,
        expense: lessThan(10000),
      })
      .and({
        income: greaterThan(20000),
      }),
    fullname: compute(10),
    posts: rel({
      id: "",
      title: "",
      comments: rel({
        post_id: "",
        author_id: "",
        content: "",
        author: rel({
          id: "",
          name: "",
        }),
      }),
    }),
  })
    .where("age", "=", 20)
    .where("name", "like", "divin")
    .orWhere((q: any) => {
      return q.orWhere("attribute", "=", "divin").orWhere("att", ">", 40);
    })
    .select(["age", "name"])
    .paginate(5, 10)
    .limit(5)
    .orderBy("age")
    .groupBy("user_id"),
});
```

Let break down and explain every part of the request.

## The `createQuery` function.

We create the query using the `createQuery` function. It receive and object with the corresponding to the index of the resources we target at the root. We can make a query request on many resource at the same time. We have two ways to provide model request ( or resources query) to the `createQuery` function.

```js
// Simple query.
const query = createQuery({
  users: {
    age: 16,
    name: like("D"),
    email: "",
  },
});

// Advanced
const query = createQuery(
  users: shape({
    users: {
      age: equal(26),
      name: "",
    },
  }).paginate(1, 25)
);
```

The first one is the simplest version. We just provide the shape of the instances that we want. This prevent us for receiving more that we need. On this form we can't apply any transformation on the response like pagination, ordering, grouping an more...To do that we need to wrappe the query body inside the `shape` method. Like that we can define the shape of the instance to receive and add more operation on then. But some operation could override the shape define inside `shape`. Operation like the `select`. The select define the attributes that we want to get.

### Break down on the `select`

The first goal of the library is to be able to define exactly the shape of the instances that we want to return. Hence optimizing the size of the data returned. So on the simple query above we going to receive the list of user that are 16 and that the name contains a D. And in the list we are goind to see only the `age`, `name` and `email`. So want we the request expression is what we get.

Now if we wrappe the body of the query inside `shape()` and call `select('age', 'name')` then we override the shape and will still get the users under the same conditions but we will only receive the `age` and `name`.

## The `shape()`

What does the `shape()` really do ? Well, as we said about wrapping the body of the query inside `shape` allow to apply more operations on the results. The createQuery get the models queries and build then. `shape` to the same thing and return an object on what we can chain others operations. So when `createQuery` receive the model queries it will check for the ones that are not yet build ( the one that are not wrappe inside `shape`). Hence we understand that we can direct create a query with `shape` but it's recommanded to always pass it into `createQuery` using the resources key like the case with `users`.

## Operators

### Basics

To filters the results we use operator that are apply directly on the attribute. There a many operators so most of the filters options that are available on database selection clauses.

- Here we get the user where the age is greaterThan 10 and lessThan 30 or equal to 12. This is just and example of what we can write.

```js
{
 age: greaterThan(10).lessThan(30).or().equal(12),
}
```

In this line `or` operator will always apply on the age attribute. All the clauses after the `or` are options until we and `and` to break the options chains. This is just theorical. In practice we often finish with optionnals clauses. Also in this case the `or` will apply only on the age attribute but we can start the clauses on the age but apply the `or` on different attribute like this:

```js
{
  firstname: like("divin").or("lastname").like("jordan"),
}
```

It same approach work on the `and` attributes.

```js
{
  firstname: like("divin").or("lastname").like("jordan").and('email').like('@gmail.com'),
}
```

### Nested

We can add nested clauses.The nested clauses should be add inside `or` or `and`. It's just a theorical features we do not really know if it's usefull in practice:

```js
balance: between(1000, 2000)
      .or({
        amount: 100,
        expense: lessThan(10000),
      })
      .and({
        income: greaterThan(20000),
      }),
```

### Aggregations and relationship operators

We also operators that do not define filtring clauses but are apply the same ways like them for different purpose.

**compute**
The compute operator define a callable operation on the resource. In fact there are method that are define on a model. As Example we can compute the fullname of username from it's firstname and lastname, or get a account balance of a user. The computed attributes are the one that are not define on the database schema and that it's complex to get them using a database sql request. As it's a method define on a model it's call for all instances. Then it should be use with care about the resources.

**rel**
The rel operator is use to define a relationship. This allow us to load a particular relationship directly. A rel operator receive and entire model query for the related model. The query object that is pass to rel is build recursive with the same rules at the main query. But we can wrappe it inside `shape()`. This can create an unexpected behavior.
We can have nested relations definition:

```js
{
   posts: rel({
      id: "",
      title: "",
      comments: rel({
        post_id: "",
        author_id: "",
        content: "",
        author: rel({
          id: "",
          name: "",
        }),
      }),
    }),
}
```

It's important to always add the required attributes involves in foreign keys otherwise we won't receive what want. In fact to load relationships the system rely on foreign keys. So if there are not presents in the shape the system won't know how to do that. And we the permission control is enable the we should have the view permissions on theses foreign keys attributes.

**order**
There is a `order` operation that can be call direcly on the attribute. In fact there are two ways of ordering the results.

- Directly on the attribute using the `order` operator. This is apply only and the top level, nested ordering it's not allow or won't be take into consideration.
- Chains to the `shape` method.

## The additionnals operations.

### `select`

We have already presented the `select` operation. It's override the shape define into `shape`. We can select all by using the wildcad `select('*')`.

### `where` and `orWhere`

We can define the conditions or clauses ot the request.

```js
 shape({...})
    .where("age", "=", 20)
    .orWhere("name", "like", "divin")

```

We can add nested conditions. It just theorique we do not know if there is really a practice use case for that. Whatever theses clauses are evaluated exactly how nested queries.

```js
shape()
  .where("age", "=", 20)
  .orWhere((q: any) => {
    return q.orWhere("attribute", "=", "divin").orWhere("att", ">", 40);
  });
```

The clauses define with `where` and `orWhere` are added to the one define on the attributes using the `operators`. Add the end we build ups a list of clauses that are evaluate in sequence. They are features nested clauses as see above in both cases.

### Closures dedicates operators

There are operators that automatically create closures

- `exists`
- `notExists`
- `orExists`
- `orNotExists`

### `paginate`, `orderBy`,`limit`, `groupBy`.

- `paginate`: for pagination
- `orderBy`: to order the result.
- `limit`: to apply limit on the result option with pagination.
- `groupBy`: to group using an attribute. It's not database level grouping but application level grouping. In fact there is key difference in database grouping and application level grouping. The database grouping it's only use when there is an aggregation. The groupBy is optionnal with pagination and limit.

# Query JSON

The `createQuery` function build the query and return a json object that define the query and that is ready to be send to server. Something on this shape:

```js
{
  user: {
    clauses: [
      {
        name: "where",
        value: ["gender", "male"],
      },
      {
        name: "where",
        value: ["age", ">", 30],
      },
      {
        name: "where",
        value: [
          {
            name: "orWhere",
            value: ["job", "developper"],
          },
          {
            name: "orWhere",
            value: ["city", "douala"],
          },
        ],
      },
    ],
    computed: {
      fullname: [],
      expenses: ["2024-10-01","2024-11-01"]
    },
    order: [
      ["age","desc"]
    ],
    paginate: [1,20],
    select: ["firstname", "lastname", "age", "area"],
    rels: {
      children: {
        select: ["age", "gender"]
      }
    }
  }
}
```

## Obfuscation

In order to hide the behavior and the way the query is structure we use obfuscation powered by a `XOR` encryption algorithm.

## Future.

The are still a lot of laravel query builder method that are yet to be added to the system.
Also there is at lot work to do on the typing.
