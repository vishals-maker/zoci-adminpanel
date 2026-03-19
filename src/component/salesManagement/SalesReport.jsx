

import { Col, Row } from "antd";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getSalesDashboardAsync, getSalesTimeAsync } from "../../feature/sales/salesSlice";
import CustomButton from "../common/CustomButton";
import CustomModal from "../common/CustomModal";
import CustomText from "../common/CustomText";
import Loader from "../loader/Loader";
import AddExpense from "./addNewExpense/AddExpence";
import EventSales from "./EventSales";
import MonthlySalesChart from "./MonthLySalesChart";
import ProductSalesChart from "./ProductSalesChart";
import SalesCard from "./SalesCard";
import SalesReportTable from "./SalesReportTable";
import SalesDashboardCard from "./SalesDashboardCard";
import { toast } from "react-toastify";
import AddEvent from "./AddEvent";
const SalesReport=()=>{
  const [addExpenseModel,setAddExpenseModel]=useState(false);
  const [salesDateOptionValue,setSalesDateOptionValue]=useState({});
  const [salesChartValue,setSalesChartValue]=useState("");  
  const [event,setEvent]=useState(false);
  const navigate=useNavigate();
  const token=Cookies.get("token");  
  const dispatch=useDispatch();
  const {slaesDashboard,isLoading}=useSelector(state=>state?.sales);
  const [editData,setEditData]=useState(null);

   const handleSalesReport=(e)=>{
    setSalesChartValue(e)
    const endDate = dayjs(); // today
  let startDate = dayjs();

  if (e === "oneYear") {
    startDate = endDate.subtract(1, "year");
  }
  if (e === "oneMonth") {
    startDate = endDate.subtract(1, "month");
  }

  if (e === "sixMonth") {
    startDate = endDate.subtract(6, "month");
  }

  if (e === "threeMonth") {
    startDate = endDate.subtract(3, "month");
  }

  const payload = {
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD")
  };
  setSalesDateOptionValue(payload)

  }
        const getSalesDashboard=async()=>{
          try {
            const data={...salesDateOptionValue}
          const res=await dispatch(getSalesDashboardAsync({token,data})).unwrap();
          } catch (error) {
            toast.error("Something went wrong. Please try again.");  
          }
        }
        const getSalesRevenue=async()=>{
            try {
              const res=await dispatch(getSalesTimeAsync({token}))
            } catch (error) {
              toast.error("Something went wrong. Please try again.");  
              
            }
          }

        useEffect(()=>{
        getSalesDashboard();

     
        },[salesDateOptionValue]);
        useEffect(()=>{
               getSalesRevenue()
          },[])
        if(isLoading) return <Loader/>

        const dashboardData = [
      {
        title: "Total Sales",
        value: slaesDashboard?.summary?.totalSales,
        percent:slaesDashboard?.summary?.totalSalesPercent??0
      },
      {
        title: "Total Expenditure",
        value: slaesDashboard?.summary?.totalExpenditure,
        percent: slaesDashboard?.summary?.totalExpenditurePercent??0
      },
      {
        title: "Net Profit",
        value: slaesDashboard?.summary?.netProfit,
        percent:slaesDashboard?.summary?.netProfitPercent??0
      },
      {
        title: "Total Orders",
        value: slaesDashboard?.summary?.totalOrders,
        percent:slaesDashboard?.summary?.totalOrdersPercent??0
      },
      {
        title: "Total Orders Value",
        value: slaesDashboard?.summary?.totalOrderValue??0,
        percent: slaesDashboard?.summary?.totalOrderAmountPercent??0
      },
      {
        title: "Average Order Value",
        value: slaesDashboard?.summary?.avgOrderValue,
        percent: slaesDashboard?.summary?.avgOrderValuePercent??0
      },
      {
        title: "Top-Selling Category",
        value: slaesDashboard?.summary?.topCategory,
        percent: slaesDashboard?.summary?.topCategoryPercentage??0
      },
      {
        title: "Returning Order",
        value: slaesDashboard?.summary?.returningCustomers,
        percent:slaesDashboard?.summary?.returningCustomersPercent??0
      }
    ];

if(isLoading ) return <Loader/>
    return(
       <div className="flex flex-col gap-5 p-5">
        <CustomText value={"Sales Reports"}/>
           <Row gutter={[20,20]}>
            <Col span={12}>
            <div className="w-auto">
                {/* {isDashboardLoading?<Skeleton.Node active style={{ width: 680,height:430 }} /> */}
         <MonthlySalesChart salesChartValue={salesChartValue} handleSalesReport={handleSalesReport}  item={slaesDashboard?.monthlySales}/>
          </div>
            </Col>
            <Col span={12}>
            <div className="w-auto">
          <ProductSalesChart salesChartValue={salesChartValue} handleSalesReport={handleSalesReport}  item={slaesDashboard?.productSoldByCategory} />
          </div>
            </Col>
          </Row>
          <Row gutter={[20,20]}>
           {dashboardData.map((item,idx)=>{            
              return(
                 <Col span={6}>
                    <Link to={
                        idx==0 && "/admin/total-sales" || 
                        idx==1 && "/admin/total-expenditure" || 
                        idx==2 && "/admin/net-profit" || 
                        idx==3 && "/admin/total-order" || 
                        idx==4 && "/admin/sales" || 
                        idx==5 && "/admin/sales" || 
                        idx==6 && "/admin/sales" || 
                        idx==7 && "/admin/returning-customer" 
                        }>
                          
                    <SalesDashboardCard item={item} />
                    </Link>
                  </Col>
              )
           })}
          </Row>
          <Row>
            <Col span={24}>
           <EventSales setEvent={setEvent} setAddExpenseModel={setAddExpenseModel} setEditData={setEditData} item={slaesDashboard?.events}/>
             </Col>
          </Row>
         <div className="flex flex-wrap justify-between gap-5">
            <CustomButton onclick={()=>{navigate("/admin/online-sales")}}  className={"!text-[#fff] !w-[250px] !h-[60px]"} value={"Online Sales List"}/>
            <CustomButton onclick={()=>{navigate("/admin/make-order-list")}} className={"!text-[#fff] !w-[250px] !h-[60px]"}value={"Make To Order List "}/>
            <CustomButton onclick={()=>{navigate("/admin/offline-sales-list")}} className={"!text-[#fff] !w-[250px] !h-[60px]"}value={"Offline Sales List"}/>
            {/* <CustomButton onclick={()=>{setEditData(null),setAddExpenseModel(true),setEvent(true)}} className={"!text-[#fff] !w-[250px] !h-[60px]"}value={"Add Event"}/> */}
            <CustomButton onclick={()=>{setAddExpenseModel(true),setEvent(false)}} className={"!text-[#fff] !w-[250px] !h-[60px]"}value={"Add Expenses"}/>
         </div>
         <div>
            <SalesReportTable  />
           </div>

           <CustomModal open={addExpenseModel} setOpen={setAddExpenseModel} modalBody={event?<AddEvent editData={editData} setOpen={setAddExpenseModel}/>:<AddExpense setOpen={setAddExpenseModel}/>} width={800} />
        </div>
    )
}
export default SalesReport;