import { useNavigate } from "react-router-dom";
import CustomText from "../../common/CustomText";
import { LeftOutlined } from "@ant-design/icons";

import CustomerListTable from "./CustomerListTable";
import CustomerListFilter from "./CustomerListFilter";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllCustomerList } from "../../../feature/crm/crmSlice";
import Cookies from "js-cookie"
import { useDebounce } from "../../../hooks/UseDebounce";
const CustomerList = () => {
          const navigate = useNavigate();
          const token=Cookies.get("token");  
          const dispatch=useDispatch();
          const [page,setPage]=useState(1);
      const [date,setDate]=useState([]); 
          const [search,setSearch]=useState("");
          const [sortKey,setSortKey]=useState([])
      const debounceText=useDebounce(search,500)
          const getAllCustomerListHandler=async()=>{
             const trimSearch=search.trim();
                try {
                 const data={
                ...(trimSearch && { search:trimSearch }),
                ...(sortKey?.length>0 && { [sortKey[0]]:sortKey[1] }),
            ...((date?.length>0 && date[0]!='') && {annFrom:date[0],annTo:date[1]} ),
                  page:page,
                  limit:10
             }
             if(search && !trimSearch) return;
            const res=await dispatch(getAllCustomerList({token,data})).unwrap();
            } catch (error) {
              //  toast.error("Something went wrong. Please try again.");
            }
          }


            useEffect(()=>{
                getAllCustomerListHandler();
           },[debounceText,sortKey,page,date]);             
 
  return (
    <div className="flex flex-col gap-5 p-[24px]">
      <div className="flex gap-2 items-center">
        <div
          className="cursor-pointer"
          onClick={() => {
            navigate("/admin/crm");
          }}
        >
          <CustomText
            className={"!text-[#214344] !text-[20px]"}
            value={<LeftOutlined />}
          />
        </div>
        <CustomText
          className={"!text-[#214344] !text-[20px]"}
          value={"CRM → Customers List"}
        />
      </div>
     
      <div>
        <CustomerListFilter setPage={setPage}  sortKey={sortKey} setDate={setDate} date={date} setSearch={setSearch} search={search} setSortKey={setSortKey} />
      </div>
      <div>
        <CustomerListTable page={page} setPage={setPage} />
      </div>
    </div>
  );
};
export default CustomerList;
