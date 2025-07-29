<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "admin"],
});

const localePath = useLocalePath();

useRouter().replace({
  name: localePath({ name: "products" }),
});
</script>
