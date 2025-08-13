import cpClient from "../cpClient";

export const createDemography = (data: any) =>
    cpClient({
      method: "post",
      url: `/agtech_safe/`,
      data
    });