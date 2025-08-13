import cpClient from "../cpClient";

export const getAllClusters = () =>
    cpClient({
      method: "get",
      url: `/api/v1/user/clusters/`,
    });