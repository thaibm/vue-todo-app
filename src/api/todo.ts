import request from "@/utils/request";

export const gettodos = () =>
  request({
    url: "/gettodos",
    method: "GET"
  });
