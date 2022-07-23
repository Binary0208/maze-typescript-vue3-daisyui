import { defineStore } from "pinia";

export const useMapStore = defineStore({
  id: "map",
  state: () => ({
    maps: {
      easy: null,
      normal: null,
      hard: null,
    },
  }),
  getters: {},
  actions: {},
  persist: true,
});
