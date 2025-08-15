import cpClient from "../cpClient";

export const createAssets = (data: any) =>
    cpClient({
      method: "post",
      url: `/assets/`,
      data
    });