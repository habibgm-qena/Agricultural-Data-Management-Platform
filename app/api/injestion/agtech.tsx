import axios from "axios";

export const createAgtechSafe = (data: any) =>
    axios({
      method: "post",
      url: `/api/agtech_safe`,
      data
    });