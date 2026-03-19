import { LeftOutlined } from "@ant-design/icons";
import CustomText from "../../common/CustomText";
import VendorFilter from "./VendorFilter";
import VendorPerformanceTable from "./VendorPerformanceTable";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { vendorPerformanceAnalysis } from "../../../feature/inventaryManagement/inventarySlice";
import { useEffect, useState } from "react";
import { useDebounce } from "../../../hooks/UseDebounce";
import { toast } from "react-toastify";
const VendorPerformance=()=>{
     const [addVendorModel,setAddVendorModel]=useState(false);
     const [editData,setEditData]=useState(null);
     const token=Cookies.get("token"); 
      const navigate=useNavigate(); 
      const dispatch=useDispatch();
       const [page,setPage]=useState(1);
      const [search,setSearch]=useState("");
            const debounce=useDebounce(search,500);
            const [filter,setFilter]=useState([])
            const [sort,setSort]=useState([]) 
        const getVendorPerformance=async()=>{
           const trimSearch=search.trim();
                const data={
                  limit:10,
                  page:page,
                  ...(search && {search:trimSearch} ),
                  ...(sort?.length>0 && {[sort[0]]:sort[1]} ),
                  ...(filter?.length>0 && {[filter[0]]:filter[1]} ),

                }
              try {
          if(search && !trimSearch) return;
          const res=await dispatch(vendorPerformanceAnalysis({token,data})).unwrap();
          } catch (error) {
             toast.error("Something went wrong. Please try again.");
          }
        }
  
        useEffect(()=>{
        getVendorPerformance();
        },[page,filter,sort,debounce])
    return(
        <>
        <div className="flex flex-col gap-5 p-[24px]">
            <div className="flex gap-2 items-center">
                <div className="cursor-pointer" onClick={()=>{navigate("/admin/inventary")}}>
                <CustomText className={"!text-[#214344] !text-[20px]"} value={<LeftOutlined />}/>
                </div>
                <CustomText className={"!text-[#214344] !text-[20px]"} value={"Inventory Management & Analysis → Vendor Performance Analysis"}/>
            </div>
            <div>
                <VendorFilter setEditData={setEditData} editData={editData} addVendorModel={addVendorModel} setAddVendorModel={setAddVendorModel} filterKey={filter} sortKey={sort} setPage={setPage} search={search} setSort={setSort} setFilter={setFilter} setSearch={setSearch}/>
            </div>
            
              <div>
                <VendorPerformanceTable editData={editData} setEditData={setEditData} addVendorModel={addVendorModel} setAddVendorModel={setAddVendorModel} setPage={setPage} page={page}/>
              </div>
        
        </div>
        </>
    )
}
export default VendorPerformance;