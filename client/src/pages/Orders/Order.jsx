import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  // Fetch order details using orderId
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation(); // Payment mutation hooks
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation(); // delivery mutation hooks

  // get user info from the Redux store's auth state
  const { userInfo } = useSelector((state) => state.auth);

  // Get PayPal script's state and dispatcher to manage PayPal integration
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  // Fetch PayPal client ID from the API
  const {
    data: paypal,
    isLoading: loadingPaypal,
    error: errorPaypal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    // Check if PayPal client ID is available and not in loading or error state
    if (!errorPaypal && !loadingPaypal && paypal.clientId) {
      const loadingPaypalScript = async () => {
        // Dispatch actions to reset PayPal options and set the script to loading
        paypalDispatch({
          // Reset PayPal options and set loading status
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      // Load PayPal script only if order is present and not paid
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadingPaypalScript();
        }
      }
    }
  }, [errorPaypal, loadingPaypal, order, paypal, paypalDispatch]);

  // Handler called when PayPal payment is approved for capturing payment details
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        // Call payOrder mutation and refetch order details upon successful payment capture
        await payOrder({ orderId, details });
        refetch();
      } catch (error) {
        toast.error(error?.data.message || error.error);
      }
    });
  }

  // Function to create a PayPal order based on the total price of the current order
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  // Error handler for PayPal-related errors
  function onError(err) {
    toast.error(err.message);
  }

  // Function to mark an order as delivered
  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch(); // Refetch order details after marking as delivered
  };

  // Render loading state while fetching order details
  if (isLoading) {
    return <Loader />;
  }

  // Render error message if there is an error fetching order details
  if (error) {
    return (
      <Message various="danger">{error?.data.message || error.error}</Message>
    );
  }

  return (
    <div className="container flex flex-col ml-[10rem] md:flex-row">
      <div className="md:w-2/3 pr-4">
        <div className=" border border-gray-500 mt-5 pb-4 mb-5">
          {order.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            // Display order details table
            <div className="overflow-x-auto flex justify-center">
              <table className="w-[80%] ">
                <thead className="border-b border-gray-500">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      </td>

                      <td className="p-2">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>
                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">{item.price}</td>
                      <td className="p-2 text-center">
                        $ {(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Display Shipping info and Order summary  */}
      <div className="md:w-1/3">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          {/* Shipping details */}
          <h2 className="text-xl font-bold mb-2">Shipping</h2>
          <p className="mb-4 mt-4">
            <strong className="text-pink-500">Order:</strong> {order._id}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Name:</strong>{" "}
            {order.userId.username}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Email:</strong>{" "}
            {order.userId.email}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Address:</strong>{" "}
            {order.shippingAddress.address}, {order.shippingAddress.city}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Method:</strong>{" "}
            {order.paymentMethod}
          </p>
          {/* Display payment status */}
          {order.isPaid ? (
            <Message variant="success">Paid on {order.paidAt}</Message>
          ) : (
            <Message variant="error">Not paid</Message>
          )}
        </div>
        {/* Order summary */}
        <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Items</span>
          <span>$ {order.itemsPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>$ {order.shippingPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>$ {order.taxPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span>$ {order.totalPrice}</span>
        </div>

        {/* Display PayPal buttons if order is not paid */}
        {!order.isPaid && (
          <div>
            {/* Display loaders during payment and PayPal script loading */}
            {loadingPay && <Loader />}{" "}
            {isPending ? (
              <Loader />
            ) : (
              <div>
                <div>
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  ></PayPalButtons>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Display loader during order delivery */}
        {loadingDeliver && <Loader />}
        {/* For Admin to mark order as delivered */}
        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
          <div>
            <button
              type="button"
              className="bg-pink-500 text-white w-full py-2"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
