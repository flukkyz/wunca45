interface Cart {
  product: Product;
  amount: number;
  select: boolean;
}
export const cart = defineStore("cart", {
  state: () => {
    return {
      cart: [] as Cart[],
    };
  },
  actions: {
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
  },
});
