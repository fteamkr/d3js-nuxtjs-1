import { getMarcapData } from "@/utils/fetch.js";

/**
 * @see {@link https://nuxt.com/docs/guide/directory-structure/server}
 */
export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, "code");
  if (code != null) {
    const data = await getMarcapData(code);
    return data;
  } else {
    return [];
  }
});
