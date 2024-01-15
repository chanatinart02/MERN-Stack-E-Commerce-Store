// ทำให้เป็นตัวเลขทศนิยม 2 ตำแหน่ง
export const addDecimals = (num) => {
  // นำตัวเลขมาปรับเศษที่ใกล้เคียงก่อนให้เป็นตัวเลขทศนิยม 2 ตำแหน่ง
  return (Math.round(num * 100) / 100).toFixed(2);
};

// Update the cart state based on cart items
export const updateCart = (state) => {
  // Calculate the total items price by summing up the individual item prices
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => {
      acc + item.price * item.price * item.qty, 0;
    })
  );

  // Calculate the shipping price based on total items price
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 100);

  // Calculate the tax price as 15% of the total items price
  state.taxPrice = addDecimals(Number(0.15 * state.itemsPrice).toFixed(2));

  // Calculate total price as the sum of items price, shipping price, and tax price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  // Store the updated cart state in localStorage
  localStorage.setItem("cart", JSON.stringify(state));

  // Return the updated state
  return state;
};
