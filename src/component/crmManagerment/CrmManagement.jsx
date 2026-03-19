import {  useNavigate } from "react-router-dom"
import CustomButton from "../common/CustomButton"
import SalesCard from "../salesManagement/SalesCard";
import CustomText from "../common/CustomText";
import { Col, Row } from "antd";
import CrmTable from "./CrmTable";
import Cookies from "js-cookie"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCrmAsync } from "../../feature/crm/crmSlice";
import CrmCard from "./CrmCard";
import Loader from "../loader/Loader";
import { toast } from "react-toastify";
const CrmManagement=()=>{
      const navigate=useNavigate();
      const token=Cookies.get("token");  
      const dispatch=useDispatch();
      const {crmDashboard,isLoading}=useSelector(state=>state?.crm);    
        const getcrmHandler=async()=>{
          try {
          const res=await dispatch(getCrmAsync({token})).unwrap();
          } catch (error) {
           toast.error("Something went wrong. Please try again.");
          }
        }
   const cardData=[
        {value:crmDashboard?.data?.anniversaryReminders,title:"Anniversary Reminders"},
        {value:crmDashboard?.data?.totalCustomers,title:"Total Custumers"},
        {value:crmDashboard?.data?.newCustomers,title:"New Custumers"},
        {value:crmDashboard?.data?.topCustomerSpend,title:"Top Customer Spend"},
        {value:crmDashboard?.data?.frequentShoppers,title:"Frequent Shoppers"},
        {value:crmDashboard?.data?.birthdayReminders,title:"Birthday Reminders"}

      ]  

        useEffect(()=>{
        getcrmHandler();
        },[])
   if(isLoading) return <Loader/>
    return(
        <div className="flex flex-col gap-5 p-5">
          <Row gutter={[20,20]}>
           {cardData?.map((item,idx)=>{
              return(
                 <Col span={8}>  
                    <CrmCard item={item} />
                  </Col>
              )
           })}
          </Row>
         <div className="flex flex-wrap gap-3 justify-between">
          <CustomButton onclick={()=>{navigate("/admin/crm-all-visitors-list")}}  className={"!text-[#fff] !w-[250px] !h-[60px]"} value={"All Visitor List"}/>
          <CustomButton onclick={()=>{navigate("/admin/crm-customer-list")}} className={"!text-[#fff] !w-[250px] !h-[60px]"}value={"Customers List "}/>
          <CustomButton onclick={()=>{navigate("/admin/crm-birthday-reminder")}} className={"!text-[#fff] !w-[250px] !h-[60px]"}value={"Birthday Reminders"}/>
          <CustomButton onclick={()=>{navigate("/admin/crm-anniversary-reminder")}} className={"!text-[#fff] !w-[250px] !h-[60px]"}value={"Anniversary Reminders"}/>
         </div>
         <div className="">
          <CrmTable  item={crmDashboard?.data?.timeWiseData}/>

         </div>
         <div>
           </div>

        </div>
    )
}
export default CrmManagement;