import cpClient from "../cpClient";

export const createAgtechSafe = (data: any) =>
    cpClient({
      method: "post",
      url: `/agtech_safe/`,
      data
    });