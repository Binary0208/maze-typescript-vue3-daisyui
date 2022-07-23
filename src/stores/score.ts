import { defineStore } from "pinia";

export const useScoreStore = defineStore({
  id: "score",
  state: () => ({
    score: {
      name: '',
      time: 0,
      usedSteps: 0,
      remainSteps: 0,
    },
  }),
  getters: {},
  actions: {},
});
