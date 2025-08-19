import axios from "axios";

export const createDemography = (data: any) =>
    axios({
      method: "post",
      url: `/api/demographics`,
      data
    });