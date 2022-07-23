<template>
  <input type="checkbox" :id="name" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ title }}</h3>
      <p class="py-4">
        <slot />
      </p>
      <div class="modal-action">
        <label :for="name" class="btn" @click="emits('close')">{{ btn }}</label>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

defineProps<{
  name:string;
  title: string;
  btn: string;
}>();

const emits=defineEmits(['close'])

</script>
