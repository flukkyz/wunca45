export const cart = defineStore("cart", {
  state: () => {
    return {
      cart: [] as Cart[],
    };
  },
  actions: {
    selectedProducts() {
      return this.cart.filter((ele) => ele.select);
    },
    countProducts() {
      return this.cart.length;
    },
    countSelectedProducts() {
      return this.selectedProducts().length;
    },
    countSelectedProductAmount() {
      return this.selectedProducts().reduce((total, item) => {
        return total + item.amount;
      }, 0);
    },
    totalPrice() {
      return this.cart.reduce((total, item) => {
        return total + item.product.price! * item.amount;
      }, 0);
    },
    totalSelectedPrice() {
      return this.selectedProducts().reduce((total, item) => {
        return total + item.product.price! * item.amount;
      }, 0);
    },
    addToCart(product: Product, amount: number) {
      const existingCartItem = this.cart.find(
        (item) => item.product.id === product.id,
      );

      if (existingCartItem) {
        existingCartItem.amount += amount;
      } else {
        this.cart.push({
          product,
          amount,
          select: false,
        });
      }
    },
    updateCartItem(productId: number, amount: number) {
      const cartItem = this.cart.find((item) => item.product.id === productId);
      if (cartItem) {
        cartItem.amount = amount;
      }
    },
    removeFromCart(productId: number) {
      this.cart = this.cart.filter((item) => item.product.id !== productId);
    },
    clearCart() {
      this.cart = [];
    },
    toggleSelectAll() {
      const allSelected = this.cart.every((item) => item.select);
      this.cart.forEach((item) => {
        item.select = !allSelected;
      });
    },
  },
});
