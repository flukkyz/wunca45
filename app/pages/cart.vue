<template>
  <div>
    {{ ct.cart }}
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const ct = cart();

const modelName = "รถเข็น";

useHead({
  title: modelName,
});

breadcrumbs().clear();
</script>
