// ทำให้เป็นตัวเลขทศนิยม 2 ตำแหน่ง
export const addDecimals = (num) => {
  // นำตัวเลขมาปรับเศษที่ใกล้เคียงก่อนให้เป็นตัวเลขทศนิยม 2 ตำแหน่ง
  return (Math.round(num * 100) / 100).toFixed(2);
};

// Update the cart state based on cart items
export const updateCart = (state) => {
  // Check if cartItems array is not empty
  if (state.cartItems.length > 0) {
    // Calculate the total items price by summing up the individual item prices
    state.itemsPrice = addDecimals(
      state.cartItems.reduce((acc, item) => {
        // Accumulate the total price of each item in the cart
        acc += item.price * item.qty;
        return acc;
      }, 0)
    );
  } else {
    // If cartItems is empty, set itemsPrice to 0
    state.itemsPrice = 0;
  }

  // Calculate the shipping price based on total items price
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 100);

  // Calculate the tax price as 15% of the total items price
  state.taxPrice = addDecimals(Number(0.15 * state.itemsPrice).toFixed(2));

  // Calculate the total price including items price, shipping, and tax
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  // Update the cart information in local storage
  localStorage.setItem("cart", JSON.stringify(state));

  // Return the updated state
  return state;
};
