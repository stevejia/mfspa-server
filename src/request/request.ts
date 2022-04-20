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
      try {
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
            const urlWithDelQuery = getQueryString(url, params);
            const resDel = await fetch(urlWithDelQuery, {
              method,
            });
            resolve(resDel.json());
            break;
          case "PUT":
            break;
          case " UPDATE":
            break;
        }
      } catch (error) {
        reject(error);
      }
    })
      .catch((err) => {
        console.error(err);
        throw err;
      })
      .finally(() => console.log("finally todo"));
  }
  post(url, params, options) {}
  get(url, params?: any, options?: MfspaRequestOptions): Promise<any> {
    return this.request("GET", url, params, options);
  }
  del(url, params?: any, options?: MfspaRequestOptions): Promise<any> {
    return this.request("DELETE", url, params, options);
  }
}

export default new MfspaRequest();
