<script setup lang="ts">
import C001 from "./C001.vue";

const route = useRoute();
const { code } = route.params;

// https://nuxt.com/docs/getting-started/data-fetching#useasyncdata
const { data } = await useFetch(`/api/marcap/${code}`);
</script>

<template>
  <div>Code: {{ code }}</div>
  <C001 :data="data" />
</template>
