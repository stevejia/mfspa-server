import Mfspa from "../src/mfspa";

interface Window {
  mfspa: Mfspa;
  addHistoryListener: any;
  removeHistoryListener: (name: string, fn: Function) => void;
}
