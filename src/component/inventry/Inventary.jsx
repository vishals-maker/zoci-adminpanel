import { Col, Row } from "antd";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteSelectedDraftProducts, getAllProductAsync, getDraftProductAsync, getInventaryDashbordAsync } from "../../feature/inventaryManagement/inventarySlice.js";
import Loader from "../loader/Loader.jsx";
import { dataExportInExcelHandler } from "./constants.jsx";
import InventaryCountCards from "./InventaryCountCards.jsx";
import InventaryTable from "./InventaryTable.jsx";
import InventaryTopButton from "./InventaryTopButton";
import ProductList from "./ProductList.jsx";
import UnitSoldByCategary from "./UnitSoldByCategary";
import UnitSoldChart from "./UnitSoldChart";
import { useDebounce } from "../../hooks/UseDebounce.jsx";
import { toast } from "react-toastify";
import InventoryLiveDraftButton from "./InventoryLiveDraftButton.jsx";
import DraftTable from "./DraftTable.jsx";
import CustomButton from "../common/CustomButton.jsx";
import CustomInput from "../common/CustomInput.jsx";
import CustomModal from "../common/CustomModal.jsx";
import ConfirmationPopup from "../common/ConfirmationPopup.jsx";

const Inventary=()=>{
  const [deleteProductsModel,setDeleteProductsModel]=useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); 
  const token=Cookies.get("token");
  const [search,setSearch]=useState("");
  const [filterKey,setFilter]=useState([])
  const [sortKey,setSort]=useState([]);
  const [page,setPage]=useState(1)
  const debouncedText = useDebounce(search, 500); 
  const [liveProducts,setLiveProducts]=useState(true);
  const dispatch=useDispatch();
  const {inventaryDashboard,isDashboardLoading}=useSelector(state=>state?.inventary);
  
  
  const getInventary=async()=>{
    try {
    const res=await dispatch(getInventaryDashbordAsync({token})).unwrap();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  }

const exportProductHandler = async () => {
    const data = { productIds: selectedRowKeys };
    dataExportInExcelHandler({dispatch,token,data})
};

const draftsearchHandler=(e)=>{
  setSearch(e.target.value)
}
 const getAllProducts=async()=>{
  const trimSearch=search.trim();
  const data={
    page:page,
       ...(trimSearch && { search:trimSearch }),
       ...(sortKey?.length>0 && { sort:sortKey[0] }),
       ...(filterKey?.length>0 && { [filterKey[0]]:filterKey[1] }),
  }
  if (search && !trimSearch) {
    return; 
  }
    try {
    const res=await dispatch(getAllProductAsync({token,data})).unwrap();
    } catch (error) {
      //  toast.error("Something went wrong. Please try again.");

    }
  }

  const getDraftTable=async()=>{
     const trimSearch=search.trim();
    try {
      const data={page:page,limit:10,
         ...(trimSearch && { search:trimSearch })
      }
      if (search && !trimSearch) {
       return; 
      }
      const res=await dispatch(getDraftProductAsync({token,data})).unwrap();
     } catch (error) {
         
    }

  }
  const deletseDraftProduct=async()=>{
    try {
      const data={ids:[...selectedRowKeys]};
      console.log(data);
      
      const res=await dispatch(deleteSelectedDraftProducts({token,data})).unwrap();
      if(res.success){
        toast.success("Product deleted successfully");
        setDeleteProductsModel(false);
        getDraftTable()
      }
      
    } catch (error) {
      toast.error("Something went Wrong");
      setDeleteProductsModel(false)
    }
  }
  
  useEffect(() => {
    if(liveProducts){
      getAllProducts();

    }else{
      getDraftTable()
    }
}, [debouncedText,filterKey,sortKey,page,liveProducts]);
  useEffect(()=>{
     getInventary();
  },[])
  if(isDashboardLoading) return  <Loader/>
    return(
        <div className="flex flex-col gap-5 p-5">
          <InventaryTopButton totalVendor={inventaryDashboard?.vendor?.totalVendors}/>
          <Row gutter={[20,20]}>
            <Col span={12} >
            <div className=" !w-auto">
          <UnitSoldChart unitSold={inventaryDashboard?.charts?.unitSold}/>
          </div>
            </Col>
            <Col span={12}>
            <div className=" !w-auto">
          <UnitSoldByCategary unitSoldByCategory={inventaryDashboard?.charts?.unitSoldByCategory}/>
          </div>
            </Col>
          </Row>
          <InventaryCountCards cardData={inventaryDashboard?.cards}/>
         {liveProducts && <ProductList  setPage={setPage} filterKey={filterKey} sortKey={sortKey} setFilter={setFilter} setSearch={setSearch} setSort={setSort} exportProductHandler={exportProductHandler}/>}
          <div>
            <InventoryLiveDraftButton setPage={setPage} liveProducts={liveProducts} setLiveProducts={setLiveProducts} /> 
          </div>

          {liveProducts?(
            <InventaryTable setPage={setPage} page={page} selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys}/>):
          (
             <>
           <div className="flex gap-3">
            <CustomButton  onclick={()=>{setDeleteProductsModel(true)}} className={"!text-[#fff]"}  value={"Delete Products"}/>
            <CustomInput search={true} onchange={(e)=>{draftsearchHandler(e)}} className={"!w-[300px]"} placeholder={"Search your products"}/>
             </div>
            <DraftTable  setSelectedRowKeys={setSelectedRowKeys}  selectedRowKeys={selectedRowKeys} setPage={setPage} page={page}/>
            </>
          )}

            <CustomModal closeIcon  footer={false} setOpen={setDeleteProductsModel} open={deleteProductsModel} modalBody={<ConfirmationPopup  confirmationPopUpHandler={deletseDraftProduct} setDeleteConfirm={setDeleteProductsModel} /> } width={"800px"}  align={"center"}/>

        </div>

        
    )
}
export default Inventary;