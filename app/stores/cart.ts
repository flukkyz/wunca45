export const cart = defineStore("cart", {
  state: () => {
    return {
      cart: [] as Cart[],
      shippingAddress: "",
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
    countSelectedProductQuantity() {
      return this.selectedProducts().reduce((total, item) => {
        return total + item.quantity;
      }, 0);
    },
    totalPrice() {
      return this.cart.reduce((total, item) => {
        return total + item.product.price! * item.quantity;
      }, 0);
    },
    totalSelectedPrice() {
      return this.selectedProducts().reduce((total, item) => {
        return total + item.product.price! * item.quantity;
      }, 0);
    },
    addToCart(product: Product, quantity: number) {
      const existingCartItem = this.cart.find(
        (item) => item.product.id === product.id,
      );

      if (existingCartItem) {
        existingCartItem.quantity += quantity;
        if (existingCartItem.quantity > product.stock!) {
          existingCartItem.quantity = product.stock!;
        }
      } else {
        this.cart.push({
          product,
          quantity,
          select: false,
        });
      }
      this.setCartCookie();
    },
    updateCartItem(productId: number, quantity: number) {
      const cartItem = this.cart.find((item) => item.product.id === productId);
      if (cartItem) {
        cartItem.quantity = quantity;
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
    clearSelectItems() {
      this.cart = this.cart.filter((item) => !item.select);
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
        this.countProducts() > 0
          ? JSON.stringify({
              cart: this.cart,
              shippingAddress: this.shippingAddress,
            })
          : null;
    },
    getCartCookie() {
      if (!this.hasCart) {
        if (hasCartCookie()) {
          const cartString = getCartCookie();
          try {
            const parsedCart = cartString.value;
            if (parsedCart) {
              const { cart, shippingAddress } =
                typeof parsedCart !== "string"
                  ? (parsedCart as { cart: Cart[]; shippingAddress: string })
                  : JSON.parse(parsedCart);
              this.cart = cart || [];
              this.shippingAddress = shippingAddress || "";
            } else {
              this.cart = [];
              this.shippingAddress = "";
            }
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
  const auth = authen();
  const cartString = useCookie(
    `cart${auth.loggedIn ? `-${auth.user?.username}` : "guest"}`,
  );
  return cartString;
};
const hasCartCookie = (): boolean => {
  const cartString = getCartCookie();
  return !!cartString.value;
};
