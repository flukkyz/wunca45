<script setup lang="ts">
import { AlertDialog } from "#components";

definePageMeta({
  middleware: ["auth"],
});

const { t } = useI18n();

const modelName = "รถเข็น";

useHead({
  title: modelName,
});

breadcrumbs().clear();

const columns = [
  {
    id: "select",
  },
  {
    accessorKey: "product",
    header: "สินค้า",
  },
  {
    accessorKey: "price",
    header: "ราคาต่อชิ้น",
  },
  {
    accessorKey: "amount",
    header: "จำนวน",
  },
  {
    accessorKey: "total",
    header: "ราคารวม",
  },
  {
    id: "actions",
  },
];

const ct = cart();
const openDrawer = ref<boolean>(false);
onMounted(() => {
  if (ct.countProducts() > 0) {
    openDrawer.value = true;
  }
});

const toast = useIToast();
const alertDelete = ref<InstanceType<typeof AlertDialog> | null>(null);
const deleteItem = (data: Product) => {
  alertDelete.value?.show(`สินค้า : ${data.name}`, data);
};
const onDelete = (data: Product) => {
  ct.removeFromCart(data.id!);
  toast.onDelete("ลบสินค้า", `ลบ ${data.name} ออกจากรถเข็นแล้ว`);
};
const alertDeleteSelected = ref<InstanceType<typeof AlertDialog> | null>(null);
const deleteSelectedItems = () => {
  alertDeleteSelected.value?.show(
    `${t("_SELECTED", { text: "สินค้า" })} ${ct.countSelectedProducts()} รายการ`,
  );
};
const onDeleteSelected = () => {
  const countSelectedProducts = ct.countSelectedProducts();
  for (const item of ct.selectedProducts()) {
    ct.removeFromCart(item.product.id!);
  }
  toast.onDelete(
    "ลบสินค้า",
    `ลบ ${countSelectedProducts} รายการ ออกจากรถเข็นแล้ว`,
  );
};
</script>

<template>
  <UCard
    v-if="ct.cart"
    class="mb-20 w-full"
    :ui="{
      header: 'p-4 sm:p-4',
      body: 'p-0 sm:p-0',
    }"
  >
    <template #header>
      <div class="flex flex-col gap-3">
        <div class="flex grow items-center justify-between gap-3">
          <h2
            class="shrink-0 text-xl leading-tight font-bold text-neutral-900 dark:text-white"
          >
            {{ modelName }}
          </h2>
          <!-- <UButton
            size="xs"
            icon="i-fa6-solid-plus"
            :label="$t('ADD_', { text: $t('NEW_', { text: modelName }) })"
            @click="createItem"
          /> -->
        </div>
      </div>
    </template>
    <UTable :data="ct.cart" :columns="columns">
      <template #select-header>
        <UCheckbox
          v-if="ct.countProducts() > 0"
          :model-value="
            ct.countSelectedProducts() > 0 &&
            ct.countSelectedProducts() < ct.countProducts()
              ? 'indeterminate'
              : ct.countSelectedProducts() === ct.countProducts()
          "
          @change="ct.toggleSelectAll()"
        />
      </template>
      <template #select-cell="{ row }">
        <UCheckbox v-model="row.original.select" @change="ct.setCartCookie()" />
      </template>
      <template #product-cell="{ row }">
        <div class="flex items-start gap-2">
          <img
            v-if="row.original.product.imageUrl"
            :src="row.original.product.imageUrl"
            alt="Product Image"
            class="size-20 rounded object-cover"
          />
          <div class="flex flex-col gap-1">
            <p class="text-lg">
              {{ row.original.product.name }}
            </p>
            <p class="text-sm text-neutral-500">
              {{ row.original.product.category }}
            </p>
          </div>
        </div>
      </template>

      <template #price-header="{ column }">
        <p class="text-right">{{ column.columnDef.header }}</p>
      </template>
      <template #price-cell="{ row }">
        <p class="text-right">
          <span class="text-xs">฿</span
          >{{ currencyText(row.original.product.price!) }}
        </p>
      </template>
      <template #amount-header="{ column }">
        <p class="text-right">{{ column.columnDef.header }}</p>
      </template>
      <template #amount-cell="{ row }">
        <div class="flex w-full justify-end">
          <UInputNumber
            v-model="row.original.amount"
            :min="1"
            :max="row.original.product.stock"
            class="w-28"
            :format-options="{
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }"
            @change="ct.setCartCookie()"
          />
        </div>
      </template>
      <template #total-header="{ column }">
        <p class="text-right">{{ column.columnDef.header }}</p>
      </template>
      <template #total-cell="{ row }">
        <p class="text-right">
          <span class="text-xs">฿</span
          >{{ currencyText(row.original.product.price! * row.original.amount) }}
        </p>
      </template>
      <template #actions-header>
        <div class="flex flex-1 justify-end gap-2">
          <UButton
            v-if="ct.countSelectedProducts() > 0"
            icon="i-fa6-solid-trash"
            :label="$t('_SELECTED', { text: $t('DELETE') })"
            color="error"
            size="xs"
            variant="link"
            @click="deleteSelectedItems()"
          />
        </div>
      </template>
      <template #actions-cell="{ row }">
        <div class="flex flex-1 justify-end gap-2">
          <UTooltip :text="$t('DELETE')">
            <UButton
              icon="i-fa6-solid-trash"
              color="error"
              size="xs"
              variant="link"
              @click="deleteItem(row.original.product)"
            />
          </UTooltip>
        </div>
      </template>
    </UTable>
  </UCard>
  <USlideover
    v-model:open="openDrawer"
    side="bottom"
    :dismissible="false"
    :overlay="false"
    :handle="false"
    :modal="false"
    inset
  >
    <template #content>
      <UContainer
        class="flex min-h-20 w-full items-center justify-between gap-5 p-5"
      >
        <div class="flex items-baseline gap-3">
          <UCheckbox
            v-if="ct.countProducts() > 0"
            :model-value="
              ct.countSelectedProducts() > 0 &&
              ct.countSelectedProducts() < ct.countProducts()
                ? 'indeterminate'
                : ct.countSelectedProducts() === ct.countProducts()
            "
            label="เลือกทั้งหมด"
            @change="ct.toggleSelectAll()"
          />
          <UButton
            v-if="ct.countSelectedProducts() > 0"
            icon="i-fa6-solid-trash"
            :label="$t('_SELECTED', { text: $t('DELETE') })"
            color="error"
            size="xs"
            variant="link"
            @click="deleteSelectedItems()"
          />
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-baseline gap-3">
            <p class="">
              รวม ( {{ ct.countSelectedProducts() }} รายการ{{
                ct.countSelectedProductAmount() > ct.countSelectedProducts()
                  ? ` ${ct.countSelectedProductAmount()} ชิ้น`
                  : ""
              }}
              )
            </p>
            <p
              v-if="ct.countSelectedProducts() > 0"
              class="text-right text-2xl font-bold text-red-700"
            >
              <span class="text-xl">฿</span
              >{{ currencyText(ct.totalSelectedPrice()) }}
            </p>
          </div>
          <UButton
            v-if="ct.countSelectedProducts() > 0"
            label="สั่งสินค้า"
            color="primary"
            size="xl"
          />
        </div>
      </UContainer>
    </template>
  </USlideover>
  <AlertDialog ref="alertDelete" type="delete" @confirm="onDelete" />
  <AlertDialog
    ref="alertDeleteSelected"
    type="delete"
    @confirm="onDeleteSelected"
  />
</template>
