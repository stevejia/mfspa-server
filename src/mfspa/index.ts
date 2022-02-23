import { clone } from "../utils";
import MfspaRouter from "./router";
import "./router/listener/historyChangeHandler";
interface MfspaOption {
  router: MfspaRouter;
}

const ccccccccccc = "ccccccccccc";

class Mfspa {
  private globalWindow: { [key: string]: any } = {};
  router: MfspaRouter;
  constructor(options: MfspaOption) {
    // await this.created();
    // await this.mounted();
    // if (options?.router) {
    // }
    // this.router = new MfspaRouter();
    this.start();
  }

  private snapshotVariables() {
    const globalVariables = Object.getOwnPropertyNames(window);
    console.time("测试foreach");
    globalVariables?.forEach((variable) => {
      let value = window[variable];
      // console.log(typeof window[variable]);
      try {
        if (typeof window[variable] === "object") {
          value = clone(window[variable]);
        }
        this.globalWindow[variable] = window[variable];
      } catch (error) {
        console.log(variable);
      }
    });
    console.timeEnd("测试foreach");
  }

  private async start() {
    await this.created();
    await this.mounted();
  }

  private created() {
    this.snapshotVariables();
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        resolve();
        console.log("created");
      }, 2000);
    });
  }
  private mounted() {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        resolve();
        console.log("mounted");
      }, 2000);
    });
  }
}

export default Mfspa;
