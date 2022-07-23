<script lang="ts" setup>
import { ref, onMounted, reactive, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { searchRoad, type Point } from "@/utils/aStar";
import { useMapStore } from "@/stores/map";
import { useScoreStore } from "@/stores/score";
import Modal from "@/components/Modal.vue";
const mapStore = useMapStore();
const scoreStore = useScoreStore();
const inputModal = ref<HTMLElement | null>(null);
const input = ref<HTMLInputElement | null>(null);

const mazeSize = 1.75;
let timer: number | null = null;
const username = ref("");
const isPause = ref(false);
const time = ref(0);
const difficultySteps = {
  easy: 200,
  normal: 250,
  hard: 350,
};
const currentMap = ref<number[][] | null>(null);
const noWall = ref<Point[]>([]);
const optimalPath = ref<Point[]>([{ row: 1, col: 0 }]);
const key = ref<Point | null>(null);
const showTips = ref(false);
const player = reactive({
  row: 1,
  col: 0,
  hasKey: false,
});

const remainSteps = ref(0);
const steps = ref(0);
const route = useRoute();
const router = useRouter();
const showAlert = ref(false);
const isStarted=ref(false)
function confirm(){
  username.value=input.value!.value.trim()
  scoreStore.score.name=username.value
  isStarted.value=true
  generateKey();
  startTimer();

  window.addEventListener("keydown", handleKeydown);
}

onMounted(async () => {
  const difficulty = route.query.type as keyof typeof difficultySteps;

  remainSteps.value = difficultySteps[difficulty];
  steps.value = difficultySteps[difficulty];
  const { no } = route.query;
  currentMap.value = mapStore.maps[difficulty]![parseInt(no as string) - 1];

  scoreStore.score.name = "";
  scoreStore.score.time = 0;
  scoreStore.score.usedSteps = 0;
  scoreStore.score.remainSteps = difficultySteps[difficulty];
  inputModal.value?.click()
  input.value?.focus()
  
});

function handleKeydown(e: KeyboardEvent) {
  if (
    [
      "w",
      "a",
      "s",
      "d",
      "W",
      "A",
      "S",
      "D",
      "ArrowRight",
      "ArrowUp",
      "ArrowLeft",
      "ArrowDown",
    ].includes(e.key)
  ) {
    if (!isPause.value) {
      move(e);
    }
  }
}

function closeAlert() {
  showAlert.value = false;
}

function startTimer() {
  timer = setInterval(() => {
    time.value++;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer!);
  timer = null;
}

function move(e: KeyboardEvent) {
  let { row, col } = player;

  switch (e.key) {
    case "w":
    case "W":
    case "ArrowUp":
      row -= 1;
      break;
    case "a":
    case "A":
    case "ArrowLeft":
      col -= 1;
      break;
    case "s":
    case "S":
    case "ArrowDown":
      row += 1;
      break;
    case "d":
    case "D":
    case "ArrowRight":
      col += 1;
      break;
  }

  if (isInMap(row, col)) {
    if (isRoad(row, col)) {
      if (isAtDestination(row, col) && player.hasKey === false) {
        showAlert.value = true;
        return;
      }
      if (isAtDestination(row, col) && player.hasKey === true) {
        remainSteps.value--;
        stopTimer();
        player.row = row;
        player.col = col;

        const user = {
          difficulty: route.query.type as string,
          name: username.value,
          usedSteps: steps.value - remainSteps.value,
          remainSteps: remainSteps.value,
          time: time.value,
        };
        const ranking = JSON.parse(
          localStorage.getItem(user.difficulty) ?? "[]"
        );

        const allData = [...ranking];

        allData.push(user);

        scoreStore.score.time = user.time;
        scoreStore.score.usedSteps = user.usedSteps;
        scoreStore.score.remainSteps = user.remainSteps;

        localStorage.setItem(user.difficulty, JSON.stringify(allData));
        router.push({name:'win'})
        return;
      }

      if (row === key.value?.row && col === key.value?.col) {
        player.hasKey = true;
      }
      remainSteps.value--;
      player.row = row;
      player.col = col;

      if (remainSteps.value === 0) {
        stopTimer();
        router.push({ name: "lose" });
      }
    }
  }
}

function isInMap(row: number, col: number) {
  return (
    row >= 0 &&
    row <= currentMap.value?.length! - 1 &&
    col >= 0 &&
    col <= currentMap.value?.[0].length! - 1
  );
}

function isRoad(row: number, col: number) {
  return currentMap.value?.[row][col] === 0;
}

function isAtDestination(row: number, col: number) {
  return (
    row === currentMap.value?.length! - 2 &&
    col === currentMap.value?.[0].length! - 1
  );
}

onBeforeUnmount(() => {
  stopTimer();
  window.removeEventListener("keydown", handleKeydown);
});

function generateKey() {
  for (let i = 0; i < currentMap.value?.length!; i++) {
    for (let j = 0; j < currentMap.value?.[0].length!; j++) {
      if (currentMap.value?.[i][j] === 0) {
        noWall.value.push({ row: i, col: j });
      }
    }
  }

  optimalPath.value = [...optimalPath.value, ...searchRoad(currentMap.value!)];

  let noWallStr = noWall.value.map(
    (value: Point) => `${value.row},${value.col}`
  );
  let optimalPathStr = optimalPath.value.map(
    (value: Point) => `${value.row},${value.col}`
  );

  let keyPathStr = noWallStr.filter((value) => {
    return !optimalPathStr.includes(value);
  });

  let keyPath = keyPathStr.map((value) =>
    value.split(",").map((value) => {
      return parseInt(value);
    })
  );

  let random = Math.floor(Math.random() * keyPath.length);
  key.value = { row: keyPath[random][0], col: keyPath[random][1] };
}

function pauseGame() {
  stopTimer();
  isPause.value = true;
}

function continueGame() {
  isPause.value = false;
  startTimer();
}

function toggleTips() {
  showTips.value = !showTips.value;
}
</script>

<template>
  <div
    class="w-screen h-screen flex flex-col justify-center items-center box-border pr-20"
  >
    <div
      v-if="showAlert"
      class="alert alert-info shadow-lg w-1/2 absolute top-4"
    >
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="stroke-current flex-shrink-0 w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span class="font-bold">Please pick up the key first.</span>
      </div>
      <div class="flex-none">
        <button class="btn btn-xs" @click="closeAlert">×</button>
      </div>
    </div>
    <div class="w-screen h-screen flex justify-center mt-28">
      <div class="text-2xl w-64 flex flex-col gap-1 font-bold">
        <div>Name : {{ username }}</div>
        <div>Steps : {{ steps }}</div>
        <div>Remain Steps : {{ remainSteps }}</div>
        <div>Time(s) : {{ time }}</div>
        <div class="text-base mt-12 flex flex-col gap-1">
          <div class="text-2xl">Instructions:</div>
          <div class="flex gap-1">
            <div>Use</div>
            <kbd class="kbd">W</kbd>
            <kbd class="kbd">A</kbd>
            <kbd class="kbd">S</kbd>
            <kbd class="kbd">D</kbd>
          </div>
          <div class="flex gap-1">
            <div>or</div>
            <kbd class="kbd">↑</kbd>
            <kbd class="kbd">←</kbd>
            <kbd class="kbd">↓</kbd>
            <kbd class="kbd">→</kbd>
          </div>
          <div>to move.</div>
        </div>
      </div>
      <div
        class="relative mr-24  ml-8"
        :style="{
        width: `${currentMap?.[0].length!*mazeSize}rem`,
        height: `${currentMap?.length!*mazeSize}rem`,
      }"
      >
        <div
          class="z-30 bg-primary absolute rounded-full"
          :style="{
            width: `${mazeSize}rem`,
            height: `${mazeSize}rem`,
            top: `${player.row * mazeSize}rem`,
            left: `${player.col * mazeSize}rem`,
          }"
        ></div>

        <img
          class="absolute z-20"
          src="@/assets/img/destination.png"
          :style="{
          width: `${mazeSize}rem`,
          height: `${mazeSize}rem`,
          top: `${(currentMap?.length! - 2) * mazeSize}rem`,
          left: `${(currentMap?.[0].length! - 1) * mazeSize}rem`,
        }"
          alt="destination"
        />

        <img
          v-if="!player.hasKey&&isStarted"
          class="key z-20 absolute"
          alt="key"
          src="@/assets/img/key.png"
          :style="{
                width: `${mazeSize}rem`,
                height: `${mazeSize}rem`,
                top: `${(key?.row!)*mazeSize}rem`,
                left: `${(key?.col!)*mazeSize}rem`,
                }"
        />

        <template v-if="showTips">
          <div
            class="absolute bg-success z-10"
            v-for="(item, index) in optimalPath"
            :style="{
              width: `${mazeSize}rem`,
              height: `${mazeSize}rem`,
              top: `${item.row * mazeSize}rem`,
              left: `${item.col * mazeSize}rem`,
            }"
          ></div>
        </template>

        <template v-for="(item, index) in currentMap">
          <div
            v-for="(i, j) in currentMap?.[index]"
            :style="{
              width: `${mazeSize}rem`,
              height: `${mazeSize}rem`,
              top: `${index * mazeSize}rem`,
              left: `${j * mazeSize}rem`,
            }"
            :class="`absolute ${
              currentMap?.[index][j] === 1 ? 'bg-neutral' : 'bg-neutral-content'
            }`"
          ></div>
        </template>
      </div>

      <div class="flex flex-col h-48 justify-around items-center w-28">
        <label
          for="pause"
          class="btn btn-primary btn-block"
          @click="pauseGame()"
          >Pause</label
        >

        <button class="btn btn-primary btn-block" @click="toggleTips()">
          Tips
        </button>
        <button
          class="btn btn-primary btn-block"
          @click="
            $router.push({ name: 'map', query: { type: $route.query.type } })
          "
        >
          Go Back
        </button>
      </div>
    </div>
  </div>

  <Modal name="pause" title="Pausing..." btn="Back To Game" @close="continueGame">
    The game is paused!
  </Modal>
  <Modal name="input" title="Please input your name." btn="CONFIRM" @close="confirm">    
    <input ref="input" type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
  </Modal>
  <label ref="inputModal" for="input" class="hidden"></label>
</template>
