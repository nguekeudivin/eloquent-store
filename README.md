# **Eloquent store**

**Eloquent Store** is a project that reflects my experience working with state management and REST API integration over the years. As I worked with frontend frameworks like **React.js** and **Vue.js**, I noticed that they don’t enforce a specific way of organizing application logic or supporting a design system. This flexibility often leads to messy codebases that are hard to scale or maintain.

Since frontend applications primarily serve as consumers of API resources, it's crucial to have a **powerful and well-structured architecture** to handle this interaction. Unlike backend development, where patterns like **MVC** are common, frontend development lacks strict conventions, which leaves developers free to structure code however they like—sometimes to the detriment of maintainability.

To address this, I focused on reducing boilerplate and improving clarity using **Zustand**, a lightweight state management library. With just a few lines of code, Zustand makes state management highly efficient.

Over time, I identified a **repeating pattern** when handling REST APIs in frontend apps. This led me to build a small library, which I call `resources`, that abstracts common store logic for handling API resources. It includes CRUD operations, state synchronization, and a unified structure for working with data.

---

## 🔍 What is a Resource?

In the context of this library, a **resource** is a representation of a business-related entity. For example, in an expense tracker application, the main resources are:

- `users`: Represents users of the application.
- `accounts`: Represents financial accounts (bank, mobile money, etc.).
- `expenses`: Represents transactions or expenses.
- `categories`: Represents classifications of expenses.

Each resource typically supports standard **CRUD** operations and often follows predictable patterns. By identifying and abstracting these patterns, we can simplify the development process through a unified interface.

---

## 📦 Resource State Interface

To manage resource data effectively, I created a generic `ResourceState<T>` interface. This defines both server-side interactions (fetching data, CRUD) and client-side state updates (syncing, setting, filtering).

```ts
export interface ResourceState<T> {
  pagination: Pagination;
  items: T[];
  current: T;

  // API calls
  fetch: () => Promise<any>;
  fetchOne: (id: IdType) => Promise<any>;
  store: (data: Partial<T> | FormData, headers?: any) => Promise<any>;
  update: (
    id: string | number,
    data: Partial<T> | FormData,
    headers?: any
  ) => Promise<any>;
  destroy: (id: number | string) => Promise<any>;

  // Local state updates
  set: (inputs: Partial<T>) => void;
  setAll: (inputs: Partial<T>[]) => void;
  add: (input: T, firstPosition?: boolean) => void;
  filter: (predicate: (resource: T) => boolean) => void;
  sync: (data: Partial<T>, predicate: (item: T) => boolean) => void;
  syncWithId: (data: Partial<T>) => void;
}
```

This structure allows each resource to maintain its list of items (`items`), focus on one item (`current`), and stay in sync with the server and local store.

---

## 👤 Example: User Store

Let’s explore how a `User` store can be defined using this system.

```ts
import { initResource, ResourceState } from "@/lib/resources";
import { create } from "zustand";
import { Account } from "./account";
import { Expense } from "./expense";

export interface User {
  id: string;
  name: string;
  created_at: string;
  accounts: Account[];
  expenses: Expense[];
}

interface UserState extends ResourceState<User> {}

export const useUser = create<UserState>((set) => ({
  ...initResource("users", set),
  current: {
    id: "",
    name: "",
    created_at: "",
    accounts: [],
    expenses: [],
  } as User,
}));
```

### 🔧 Using the Store

```ts
import { useUser } from "@/store/user";

const userStore = useUser();

// Fetch all users
userStore.fetch();

// Access the user list
const list = userStore.items;

// Set the current user
userStore.set(list[0]);

// Fetch a single user by ID
await userStore.fetchOne(id);
const currentUser = userStore.current;
```

---

## 📊 Adding Custom Operations (Analytics Example)

It's good practice to group all resource-related logic—including custom operations—within the same store. Here's an example that extends the `Account` store with an `analytics` feature:

```ts
import { initResource, ResourceState } from "@/lib/resources";
import { create } from "zustand";

export interface Account {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  user: [];
}

interface AccountState extends ResourceState<Account> {
  analytics: any;
  getAnalytics: (accountId: IdType) => Promise<any>;
}

export const useAccount = create<AccountState>((set, get) => ({
  ...initResource("accounts", set),

  analytics: null,

  getAnalytics: async (accountId) => {
    const res = await getHttclient().get(`/accounts/${accountId}/analytics`);
    set({ analytics: res.data });
    return res.data;
  },
}));
```

### 📦 Using the Analytics

```ts
import { useAccount } from "@/store/account";

const accountStore = useAccount();

await accountStore.getAnalytics(15);

const analytics = accountStore.analytics;
```

---

## ✅ Why This Works

This approach to store and API management offers many benefits:

- ✅ **Consistency**: All resource stores follow the same structure.
- ✅ **Scalability**: Easy to add new resources or extend existing ones.
- ✅ **Maintainability**: Logic is modular and easy to debug or test.
- ✅ **Code Reduction**: Minimal boilerplate for setting up stores.
- ✅ **Custom Extensibility**: Easily include resource-specific actions (like analytics).

---

## 🚀 Final Thoughts

This system brings structure and predictability to frontend state management and API interactions. By leveraging **Zustand** and a reusable pattern for handling RESTful resources, we can create applications that are **scalable**, **clean**, and **easy to maintain**.

If you're building frontend apps that rely heavily on APIs, this is a pattern worth adopting.
