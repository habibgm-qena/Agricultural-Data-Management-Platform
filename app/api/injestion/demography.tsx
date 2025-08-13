import cpClient from "../cpClient";

export const createDemography = (data: any) =>
    cpClient({
      method: "post",
      url: `/demographics/`,
      data
    });