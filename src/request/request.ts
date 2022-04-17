import { getQueryString } from "./requestUtil";

interface MfspaRequestOptions {
  showLoading?: boolean;
  showMessage?: boolean;
}

class MfspaRequest {
  request(
    method: string,
    url: string,
    params?: any,
    options?: MfspaRequestOptions
  ) {
    return new Promise(async (resolve, reject) => {
      switch (method) {
        case "POST":
          break;
        case "GET":
          const urlWithQuery = getQueryString(url, params);
          const res = await fetch(urlWithQuery);
          let result = null;
          result = await res
            .clone()
            .json()
            .catch(async (e) => {
              console.log(e);
              result = await res.clone().arrayBuffer();
            });
          console.log(result);
          resolve(result);
          break;
        case "DELETE":
          const resDel = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params),
          });
          resolve(resDel.json());
          break;
        case "PUT":
          break;
        case " UPDATE":
          break;
      }
    })
      .catch((err) => console.error(err))
      .finally(() => console.log("finally todo"));
  }
  post(url, params, options) {}
  get(url, params?: any, options?: MfspaRequestOptions): any {
    return this.request("GET", url, params, options);
  }
  del(url, params?: any, options?: MfspaRequestOptions): any {
    return this.request("DELETE", url, params, options);
  }
}

export default new MfspaRequest();
