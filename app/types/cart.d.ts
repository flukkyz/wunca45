export { Cart };

declare global {
  interface Cart {
    product: Product;
    amount: number;
    select: boolean;
  }
}
