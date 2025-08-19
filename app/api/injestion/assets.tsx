import axios from "axios";

export const createAssets = (data: any) =>
    axios({
      method: "post",
      url: `/api/assets`,
      data
    });