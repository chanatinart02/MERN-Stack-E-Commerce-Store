import Chart from "react-apexcharts";
import { useState, useEffect } from "react";
import { MdOutlinePerson, MdOutlineLocalShipping } from "react-icons/md";

import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading: salesLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: customersLoading } = useGetUsersQuery();
  const { data: orders, isLoading: ordersLoading } = useGetTotalOrdersQuery();
  const { data: salesDetails } = useGetTotalSalesByDateQuery(); // Fetch total sales by date

  // Chart state for sales trend
  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
      },
      grid: {
        borderColor: "#ccc",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Sales",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    // Update chart data when salesDetails changes
    if (salesDetails) {
      const formattedSalesDate = salesDetails.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },

        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetails]);
  return (
    <>
      <AdminMenu />

      <section className="xl:ml-[4rem] md:ml-[0rem]">
        {/* Dashboard Cards */}
        <div className="w-[80%] flex justify-around flex-wrap">
          {/* Display Total Sales */}
          <div className="rounded-lg bg-black p-5 w-[20rem] mt-5 flex">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
              $
            </div>
            <div className="ml-5">
              <p>Sales</p>
              <h1 className="text-xl font-bold">
                $ {salesLoading ? <Loader /> : sales.totalSales.toFixed(2)}
              </h1>
            </div>
          </div>

          {/*  Display Total Customers */}
          <div className="rounded-lg bg-black p-5 w-[20rem] mt-5 flex">
            <div className="rounded-full w-[3rem] h-[3rem] bg-pink-500 p-3 flex items-center justify-center">
              <MdOutlinePerson />
            </div>
            <div className="ml-5">
              <p>Customers</p>
              <h1 className="text-xl font-bold">
                {customersLoading ? <Loader /> : customers?.length}
              </h1>
            </div>
          </div>

          {/* Display Total Orders */}
          <div className="rounded-lg bg-black p-5 w-[20rem] mt-5 flex">
            <div className="font-bold rounded-full w-[3rem] h-[3rem] bg-pink-500 p-3 flex items-center justify-center">
              <MdOutlineLocalShipping />
            </div>
            <div className="ml-5">
              <p>All Orders</p>
              <h1 className="text-xl font-bold">
                {ordersLoading ? <Loader /> : orders?.totalOrders}
              </h1>
            </div>
          </div>
        </div>
        {/* Total Sales Chart */}
        <div className="ml-[10rem] mt-[4rem]">
          <Chart
            options={state.options}
            series={state.series}
            type="bar"
            width="70%"
          />
        </div>

        {/* Order List Table */}
        <div className="mt-[4rem]">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
