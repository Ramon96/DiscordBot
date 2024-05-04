import { startCase, camelCase } from "lodash";

export const cleanUsername = (username: string) => {
  return startCase(camelCase(username.replace(new RegExp("_", "g"), " ")));
};
