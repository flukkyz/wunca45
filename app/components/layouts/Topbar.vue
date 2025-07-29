<script setup lang="ts">
import { capitalize } from "lodash";
const { t } = useI18n();
const localePath = useLocalePath();
const side = sidebar();
const auth = authen();

const breadcrumbItems = breadcrumbs();

const toggleDrawer = () => {
  side.drawer = !side.drawer;
};

const profileItems = [
  [
    {
      slot: "account",
      disabled: true,
      label: "",
    },
    {
      label: t("LOGOUT"),
      icon: "i-fa6-solid-right-from-bracket",
      to: localePath({ name: "logout" }),
    },
  ],
];
</script>

<template>
  <div
    class="sticky top-0 z-10 flex flex-col bg-neutral-50/40 backdrop-blur-xl"
  >
    <div class="flex items-center justify-between bg-white px-5 py-2 shadow-sm">
      <div class="flex items-center gap-3">
        <UButton
          v-if="auth.isAdmin()"
          class="lg:hidden"
          color="neutral"
          variant="ghost"
          icon="i-fa6-solid-bars"
          @click="toggleDrawer"
        />
        <NuxtLink :to="useLocalePath()({ name: 'index' })">
          <img src="/images/logo.png" class="h-[30px] shrink-0" />
        </NuxtLink>
      </div>
      <div class="flex items-center gap-2">
        <UDropdownMenu
          :items="profileItems"
          :content="{
            align: 'end',
            side: 'bottom',
          }"
          :ui="{
            content: 'w-64 ring-0 rounded-lg bg-neutral-50 shadow-xl',
            item: 'data-disabled:cursor-text select-text',
          }"
        >
          <UButton
            icon="i-fa6-solid-user"
            variant="soft"
            color="neutral"
            :ui="{
              base: 'rounded-full p-2 shadow-md',
              leadingIcon: 'size-4.5',
            }"
          />

          <template #account="{}">
            <div class="w-full text-left">
              <div class="flex w-full items-baseline justify-between gap-2">
                <p class="truncate font-bold">
                  {{ capitalize(auth.user?.fullName || auth.user?.username) }}
                </p>
                <UBadge v-if="auth.isAdmin()" color="primary" label="Admin" />
              </div>
            </div>
          </template>

          <template #item="{ item }">
            <span class="truncate">{{ item.label }}</span>

            <UIcon
              :name="item.icon!"
              class="ms-auto h-4 w-4 flex-shrink-0 text-neutral-400 dark:text-neutral-500"
            />
          </template>
        </UDropdownMenu>
      </div>
    </div>
    <UBreadcrumb
      v-if="breadcrumbItems.hasItem()"
      :items="breadcrumbItems.items"
      :class="['px-10 py-1.5', auth.isAdmin() ? 'lg:ml-72' : '']"
    />
  </div>
</template>
