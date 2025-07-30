<template>
  <div
    class="overflow-hidden rounded-xl shadow ring-1 ring-neutral-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
  >
    <img
      :src="data.imageUrl || '/images/logo.png'"
      class="h-[270px] w-full object-cover"
    />
    <div class="flex flex-col gap-2 bg-white px-5 py-4">
      <p class="line-clamp-2 grow text-lg font-bold">{{ data.name }}</p>
      <p class="-mt-3 line-clamp-1 grow text-xs text-neutral-400">
        {{ data.category }}
      </p>

      <p class="text-right text-2xl font-bold text-red-700">
        <span class="text-xl">฿</span>{{ currencyText(data.price!) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: Product;
}>();
</script>
