import axios from "axios";

export const createPsychometric = (data: any) =>
    axios({
      method: "post",
      url: `/api/psychometric_info`,
      data
    });