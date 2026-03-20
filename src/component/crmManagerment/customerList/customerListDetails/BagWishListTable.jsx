




import { useEffect, useState } from "react";
import CustomTable from "../../../common/CustomTable";
import CustomText from "../../../common/CustomText";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../../common/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import {  customerWishListAndBagAsync } from "../../../../feature/crm/crmSlice";
import { isoToIST } from "../../../../constants/constants";
import { useDebounce } from "../../../../hooks/UseDebounce";
import Loader from "../../../loader/Loader";
import CustomPagination from "../../../common/CustomPagination";
import { toast } from "react-toastify";
const BagWishListTable=({id,setCustomerDetails})=>{
      const [selectedRowKeys, setSelectedRowKeys] = useState([]);
      const [page,setPage]=useState(1);
      const [search,setSearch]=useState("");
      const debounce=useDebounce(search,500)
      const navigate=useNavigate();
      const token=Cookies.get("token");  
      const dispatch=useDispatch();
      const {wishListAndBag,isLoading}=useSelector(state=>state?.crm);
      setCustomerDetails(wishListAndBag?.customer)



    
        const getBagAndWishListdata=async()=>{
          try {
            const trimSearch=search.trim();
            const data={
              limit:10,
              page:page,
              ...(search && {search:trimSearch})
            }

            if(search && !trimSearch) return;
          const res=await dispatch(customerWishListAndBagAsync({token,id,data})).unwrap();
          } catch (error) {
            // toast.error("Something went wrong. Please try again.");
          }
        }

        
        useEffect(()=>{
         getBagAndWishListdata();
        },[debounce,page])
   
 const columns = [
  {
    title: <CustomText className="!text-[14px] !text-[#fff] font-semibold" value={"S No."} />,
    dataIndex: "sno",
    key: "sno",
    width: 80,
    render: (_, __, index) => <CustomText value={index + 1} />,
  },

  {
    title: <CustomText className="!text-[14px] !text-[#fff] font-semibold" value={"Pic"} />,
    dataIndex: "productImage",
    key: "productImage",
    width: 120,
    render: (img) => (
      <img
        src={img}
        alt="product"
        className="w-[40px] h-[40px] rounded object-cover"
      />
    ),
  },

  {
    title: <CustomText className="!text-[14px] !text-[#fff] font-semibold" value={"Product Name"} />,
    dataIndex: "productName",
    key: "productName",
    width: 250,
    render: (text) => <CustomText value={text} />,
  },

  {
    title: <CustomText className="!text-[14px] !text-[#fff] font-semibold" value={"SKU"} />,
    dataIndex: "sku",
    key: "sku",
    width: 150,
    align:"start",
    render: (text) => <CustomText value={text} />,
  },

  {
    title: <CustomText className="!text-[14px] !text-[#fff] font-semibold" value={"Date"} />,
    dataIndex: "date",
    key: "date",
    width: 200,
    align: "center",
    render: (text) => <CustomText value={isoToIST(text)} />,
  },

  {
    title: <CustomText className="!text-[14px] !text-[#fff] font-semibold" value={"Bag / Wishlist/ Recently viewed"} />,
    dataIndex: "source",
    key: "source",
    width: 200,
    align: "center",
    render: (text) => ( <CustomText value={text} /> ),
  },

  {
    title: <CustomText className="!text-[14px] !text-[#fff] font-semibold" value={"Price"} />,
    dataIndex: "price",
    key: "price",
    width: 150,
    align: "center",
    render: (text) => <CustomText value={`Rs. ${text}`} />,
  },
];

 const onSelectChange = newSelectedRowKeys => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
 const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
    return(
        <div className="flex flex-col gap-5">
                   <CustomInput name={"search"}  value={search} onchange={(e)=>{setSearch(e.target.value)}} className={"!w-[300px]"} placeholder={"Search your Products"} />
              <CustomTable scroll={{x:1800}} rowSelection={rowSelection}  dataSource={wishListAndBag?.data} columns={columns}/>
              <CustomPagination onchange={(e)=>{setPage(e)}} total={wishListAndBag?.total} />

        </div>
    )
}
export default BagWishListTable;