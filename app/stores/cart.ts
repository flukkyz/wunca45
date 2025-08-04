export const cart = defineStore("cart", {
  state: () => {
    return {
      cart: [] as Cart[],
      hasCart: false,
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
      this.setCartCookie();
    },
    updateCartItem(productId: number, amount: number) {
      const cartItem = this.cart.find((item) => item.product.id === productId);
      if (cartItem) {
        cartItem.amount = amount;
      }
      this.setCartCookie();
    },
    removeFromCart(productId: number) {
      this.cart = this.cart.filter((item) => item.product.id !== productId);
      this.setCartCookie();
    },
    clearCart() {
      this.cart = [];
      this.setCartCookie();
    },
    toggleSelectAll() {
      const allSelected = this.cart.every((item) => item.select);
      this.cart.forEach((item) => {
        item.select = !allSelected;
      });
      this.setCartCookie();
    },
    setCartCookie() {
      const cartString = getCartCookie();
      cartString.value =
        this.countProducts() > 0 ? JSON.stringify(this.cart) : null;
    },
    getCartCookie() {
      if (!this.hasCart) {
        if (hasCartCookie()) {
          const cartString = getCartCookie();
          try {
            const parsedCart = cartString.value;
            this.cart = Array.isArray(parsedCart) ? parsedCart : [];
          } catch (error) {
            console.error("Error parsing cart data:", error);
            this.cart = [];
          }
          this.hasCart = true;
        }
      }
    },
  },
});

const getCartCookie = () => {
  const cartString = useCookie("cart");
  return cartString;
};
const hasCartCookie = (): boolean => {
  const cartString = getCartCookie();
  return !!cartString.value;
};
