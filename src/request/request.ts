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
            let res;
            if (urlWithQuery.indexOf(".js") > -1) {
              res = await fetch(urlWithQuery, {
                mode: "no-cors",
                headers: {
                  "Access-Control-Allow-Private-Network": "true",
                },
              });
              // resolve('dd');
              console.log(await res.text());
            } else {
              res = await fetch(urlWithQuery, {
                headers: {
                  accept: "application/json",
                },
                mode: urlWithQuery.indexOf(".js") > -1 ? "no-cors" : undefined,
              });
            }

            let result = null;
            let resClone = res.clone();
            console.log(resClone);
            const contentType = resClone.headers.get("content-type") || "";
            console.log(url, contentType);
            if (contentType.indexOf("application/json") > -1) {
              result = await resClone.json().catch(async (e) => {
                console.log(e);
                reject(e);
                return;
              });
            } else if (
              contentType.indexOf("application/javascript") > -1 ||
              contentType.indexOf("text/plain") > -1
            ) {
              result = await resClone.text();
            } else {
              result = await resClone.text();
            }

            console.log(result);
            resolve(result);
            break;
          case "DELETE":
            const urlWithDelQuery = getQueryString(url, params);
            const resDel = await fetch(urlWithDelQuery, {
              method,
              headers: {
                accept: "application/json",
              },
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
