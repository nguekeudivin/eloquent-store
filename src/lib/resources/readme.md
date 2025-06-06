Resource store management system is build on top of zustand and provide a generic way to handle store management for resources of the application. This system features store handling for differents resources of an application. It also provide default crud operation implementation. It consider the way the frontend communicate with the backend an provide a good way to structure data.

# Conventions

We are familliar with the concept of model in database implementation architecture. A model is use to represent a translation of a business logic information into database storing and handling logic. It's is more frequent in backend or API development context. There a log architecture of design pattern that are base on that. In there of data providing, we can say a model represents the resources make available by the backend or the API. The frontend make requets to the API to access this resources. So the result that we get are instances of the Model from the API. In the frontend the data that are get should be organize and store in clear an accessible way. So doing that most frontend technologies use store management system. There are a lot store management system out there. Zustand is a good store management tool. It's simple to use.

## Intuition

Working with Model in backend tech like Laravel with the powerfull ORM that is build around this concept is so simple and straighfoward. Seeing that I wanted something similar for handling frontend data management. My first idea was make a port of the concept into frontend context. So for a resource make available by the API I create a corresponding Model in the frontend context. The model should be responsible of encapsulation the informations get from the API. So it then need to have the same structure as its correspondant in the API context. It's we directly port the database definition in the frontend context.

But the is a point. Frontend data handling is model complexe because is not just about data management but also UI interaction management. So we need to find a way to unify the data logic and UI interaction logic. And also the term model is not really frequent in the frontend context we mostly talk about store.

With that, we then consider creating a store for every model of the Api. So if we have a model `User` then user need to have a store `user` in the frontend. The store `user` should hold all the informations needed to perform operations on the user resources.

## REST API Communication

Most the API are REST API. And those follow some well know conventions for data operations. There is a conventionnal way to a request for a particular operation. It's a set of naming convention and http request methods. Theses the CRUD operations conventions:

- Create POST : `/users/`
- Read GET: `/users/{id}`
- Update PUT/PATCH `users/{id}`
- Delete DELETE : `/users/{id}`
  We perform a lot of task with only theses types of requests. Theses have the `users` and `{id}` in common. We can theses request are for the users resources. We take the plural name of the resources user. We can this the index. So for the `user` model the index is `users` and we can add more prefix on this index. For all the model of the applications we will always have a leat theses 4 operations most of the time for we can easy creat a generic for that.

Note: In Javascript the delete keyword is a reserve word so in order to avoid so naming issues we may replace it by 'destroy'.

# Store definition

In Zustand we need to provide a declaration for the state of our store. And also make the store accessible has a hook. We need to define this in the same file as the user model.

```js
interface User {
    id: ID;
    name: string;
    email: string;
    password: string
}

interface UserStoreState {

}

const useUserStore = create<UserStoreState>(set, get) => {

}
```

We are going to make a simplification by renaming `UserStoreState` to `UserState` and `useUserStore` to `useUser`.

# CRUD operations

In the MVC design pattern the Model is responsible for the data access layer. In frontend context to have data we make a request to the API. So the data access layer is the layer responsible of manageming the resources. So the data access operations should also be add the to store. It centralize Api request in the store. We establish this convention `NO http request written outside of a store`. No let add CRUD operations.

```js
interface UserState {
    all: (options?: any) => Promise<User>;
    read: (id: ID, options?:any) => Promise<User>;
    create: (data: Partial<User> | FormData, options?: any) => Promise<User>;
    update: (id: ID, data: Partial<User> | FormData, options?: any) => Promise<User>;
    destroy: (id: ID, options?: any) => Promise<any>;
}
```

We can add more operations to this store. And it's recommand way to handle operations in a context of UI.

If we have a second model. We are going to define the same operations for that model. We need to write less code. So we create a store use that for all the other models. Let name this `ResourceStore` for that we define a `ResourceState`

```js
interface ResourceState<T> {
    all: (options?: any) => Promise<T>;
    read: (id: ID, options?:any) => Promise<T>;
    create: (data: Partial<T> | FormData, options?: any) => Promise<T>;
    update: (id: ID, data: Partial<T> | FormData, options?: any) => Promise<T>;
    destroy: (id: ID, options?: any) => Promise<any>;
}
// Now the UserState extends the resource State
interface UserState extends ResourceState<User> {}

// We can now define other model
interface CourseState extends ResourceState<Course> {}
```

# State Management.

Now that we can get the resources from the API. We need to store them and organise them. When we get a list of user from the api we are going to save them into the UserStore. And this is still a generic behavior. It's important to keep in mind that we are building for UI interaction. Most of the time we need to have select an item from the list for some operation: view details, update, delete. So we have this:

- `items`: Represent the list of items
- `current`: Represent the current selected element. It's optionnal because at some moment we may have no element selected.
- `setCurrent`: A merging operation that set the attribut of the current item. If current is undefined it just initializes it completely otherwise it just merges the input data with the current state of current. Merge operation is good for updated where the current item state have to change directly.
- If the result you get from the Api is paginated is cool to store the pagination directly inside the store store.

```js
interface ResourceState<T> {
    //...
    pagination: Pagination;
    items: T[];
    current?: T;
    setCurrent: (data: Partial<T>) => void;
    setItems: (items: T[]) => void;
}
```

When a new elements is created the local store should reflect the database state of the API. So we could reload the items list from the database or just insert the newly created into the items list. Also some time we may just need to add or remove a new item. We could remove many item by a filtring operation.

The resource get from the API may need some processing or parsing before being store. For that we case use transform operation that will parse all item before storing them.

```js
interface ResourceState<T> {
    //...
    transform: (item: T) => T;
    add: (input: T, addFirst?: boolean) => void; // can optionnal set if the item is add on top or at the bottom.
    remove: (id: ID) => void;
    filter: (predicate: (resource: T, index?: number) => boolean) => void;

}
```

If we select an item and update it. The operation create new value for that item. The new value is hold inside the current or maybe is send to API by an update request. Then the value present in the `items` list of the store is outdate. So we need to sync the updated value with the value inside the `items` list. The `sync` operation will search for the item in list and update it. The search may use the `id` or a custom predicate.

```js
interface ResourceState<T> {
    //....
    sync: (data: Partial<T>, predicate: (item: T) => boolean) => void;
    syncWithId: (data: Partial<T>) => void;
}
```

Most of the time. To update an item we select first, apply mutation and send the update request. Also the same for delete operation.

```js
const current = userStore.current;
// now the request
userStore.update(current.id, data);
```

It's a kind of verbose. What if we just internally get the id of the current id and run the update method on it. We then create shortcut for that `updateCurrent` and it to the store. We can do the same for the delete operation by creating a `deleteCurrent` method.

# Loading an Error Management.

So all the generics operations support and error and loading mechanic using the `useErrors` and `useLoading` hooks. The useErrors hooks has the mechanism to handle an error an parse it to get or set the appropriete message. The useLoading hooks use name or key to store the loading state of operation. We can have.

- Create: `create_users` in general `create_${index}`
- Update: `update_users_{id}` then `update_${index}_{id}`
- Delete: `destory_users_{id}` then `destroy_${index}_{id}`
  We write a helper for that:

```js
loadingKey = (operation: 'create' | 'update' | 'destroy', index: string, id?: ID) => {
    return id ? `${operation}_${index}_${id}` : `${operation}_${index}`;
};

// create user loading state
loading.status[loadingKey(operation,'users')]
// update user loading state
loading.status[loadingKey(operation,'users', userId)]
```

What if want to access the loading state for a given operation directly from the store to write less code. We can also consider the case where the loading operation is on the current item.

```js
interface ResourceState<T> {
    //...
    loading: (operation: Operation, id?: ID) => boolean;
    loadingCurrent: (operation: Operation) => boolean;
}
```

# Final resource state.

```js
export interface ResourceState<T> {

    pagination: Pagination;
    items: T[];
    current?: T;

    set: (inputs: Partial<T>) => void;
    setItems: (inputs: Partial<T>[]) => void;
    add: (input: T, firstPosition?: boolean) => void;
    remove: (id: ID) => void;
    filter: (predicate: (resource: T, index?: number) => boolean) => void;

    sync: (data: Partial<T>, predicate: (item: T) => boolean) => void;
    syncWithId: (data: Partial<T>) => void;


    update: (id: ID, data: Partial<T> | FormData, options?: any) => Promise<T>;
    updateCurrent: (data: Partial<T>, options?: any) => Promise<T>;

    create: (data: Partial<T> | FormData, options?: any) => Promise<T>;

    destroy: (id: ID, options?: any) => Promise<any>;
    destroyCurrent: (options?: any) => Promise<any>;

    loading: (operation: Operation, id?: ID) => boolean;
    loadingCurrent: (operation: Operation) => boolean;

}
```

## Synchronisation

Has we start discussin about above when we send a mutation request to the API the state of the data inside the database change, we need to keep the local store in sync with the api data. By default all the operation trigger a sync process.

- The `create` operation add direcly the new elements to the store. It's possible to define the position by passing the option `addFirst` to true.
- The `update` updation sync the state of the update item with is new value inside the list.
- The `destroy` operation remove the item from the store.

We can disable the auto synchronisation by setting the `sync` option to `false`. That maybe helpfull in some situations.

## Options

we have being talking about options. Options are simple params that we pass to an operation to define his behavior. It's mainly for operations that send request to the api. This is the shape of an operations options.

```js
{
    addFirst?: boolean, // for create
    sync?: boolean,
    request?: {
        // header:
        // token:
    } // Option for the request.
}
```

# Grouped Resource

Sometimes we need to store the resources by group. The UI may require handling many list of the same resource in parallel. In use case like kanban application. In the kanband board the card may represent the same resource but the different panel represent the differents cards lists. And theses should be handle at the same time. We can use a single list items by that we need a map. Still we select only one card at the time so the current item logic stay the same.`We introduce a concept of`GroupedResourceState` to represent the fact that resources are grouped.

```js
interface GroupedResourceState{
    items: Record<ID, T[]>;
    pagination: Record<ID, Pagination>;
    current?: T;
    setCurrent: (inputs: Partial<T>) => void;
    setItems: (inputs: Record<ID, T[]>) => void;
}
```

For each card I need to know the panel it belong to. It's good store directly in the card the information of column it belongs to. We maybe consider using `col_id`. Now we building a generic system. So we need a way to know automatically the group of an item. For that we use the `transform` operation.

```js
transform = (item: T) => ({...item, groupId: item.col_id});
```

IMPORTANT: `groupId` is convention name.

## Operations

Now all the crud operations should consider the group of the item. Since the operations trigger synchronisation, the system need to know for each item where to apply the sync. They look inside the item to find for a `groupId` member. So the `transform` operation should always be define correctly. This way the operations will either find the groupId or call the `transform` operation.
The operation call the transform operation on the input. The `create` operation is not apply to a current item that may have his groupId. The `create` operation operate on the input data and should then call the transform operation on this data to get the groupId. So the data pass to the create operation should contain the required information for setting the `groupId`.
In our example to create a card we need to pass the col_id of the card inside de data.

```js
cardStore.create({
    name: '',
    descriptin: '',
    col_id: // it's convert into groupId.
})
```

So in general all the operations for the `GroupedResourceState` are define the same way as for the `ResourceState` except for the `filter` , `setGroup` and `destroy` where we need to explicitly pas the groupId.

```js
interface GroupedResourceState<T> {
    //... unchanged operations.
    setGroup: (groupId: ID, inputs: T[]) => void;
    filter: (groupId: ID, predicate: (item: T, index?: number) => boolean) => void;
    destroy: (groupId: ID, id: ID, options?: any) => Promise<any>;
}
```
