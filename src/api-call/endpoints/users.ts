import { httpClient } from "../request";

export function getUsers() {
  return httpClient()
    .get("users")
    .then((res: any) => {
      return Promise.resolve(res.data);
    });
}

export function getUser(userID: string | number) {
  return httpClient()
    .get("users")
    .then((res: any) => {
      return Promise.resolve(res.data);
    });
}
