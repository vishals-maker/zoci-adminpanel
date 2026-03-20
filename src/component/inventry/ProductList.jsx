import { Col, Image, Row } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import filter from "../../assets/inventary/filter.png";
import sort from "../../assets/inventary/sort.png";
import CustomButton from "../common/CustomButton";
import CustomInput from "../common/CustomInput";
import CustomModal from "../common/CustomModal";
import CustomText from "../common/CustomText";
import CustomMultipleFilter from "../common/CustumMultipleFilter";
import "./inventary.css";
import { filterOptions, sortOption } from "./inventaryFilterData";
import CreateBulkProductForAdmin from "./CreateBulkProductForAdmin";
import InventoryLiveDraftButton from "./InventoryLiveDraftButton";
const ProductList=({exportProductHandler,setFilter,setSearch,setSort,sortKey,filterKey,setPage})=>{
  const [productListBulkModel,setproductListBulkModel]=useState(false)
  const navigate=useNavigate();
    return(
      <div className="inventary">
            <Row justify={"center"} gutter={[40,20]}>
                 <Col span={24}>
                 <div className="flex  gap-20 items-center">
                    <div >
                   <CustomText className={"font-bold !text-[#214344]"} value={"Entire Product list"}/>
                   </div>
                   <div >
                   <CustomInput search className={"!w-[350px]"}  onchange={(e)=>{setPage(1),setSearch(e.target.value)}}  placeholder={"Search your product"} />
                   </div>
                   </div>
                 </Col>
                 <Col span={24}>
                 <div className="flex flex-wrap gap-2"> 
                  <CustomButton onclick={()=>{setproductListBulkModel(true)}}   className={"!text-[#fff]"} value={"Import bulk product"}/>
                  <CustomButton onclick={()=>{navigate("/admin/create-product")}} className={"!text-[#fff]"} value={"Create individual product"}/>
                  <CustomButton value={<div className="flex items-center justify-between gap-1 ">
                    <Image preview={false} className="!size-[16px]" src={filter}/>
                   <CustomMultipleFilter value={filterKey} placeholder={"Filter"}  onchange={(value)=>{setPage(1),setFilter(value)}} option={filterOptions}/>
                  </div>}/>
                  <CustomButton value={<div className="flex items-center gap-1">
                    <Image preview={false} className="!size-[20px]" src={sort}/>
                   <CustomMultipleFilter value={sortKey} placeholder={"Sort"} onchange={(value)=>{setPage(1),setSort(value)}} option={sortOption}/>
                  </div>}/>
                  <CustomButton onclick={()=>{exportProductHandler()}} value={<div className="flex items-center gap-1">
                    <Image preview={false} className="!size-[20px]" src={sort}/>
                    <CustomText className={"!text-[#fff]"} value={"Export in Excel"}/>
                  </div>}/>
                  </div>
                  </Col>
            </Row>
            <CustomModal closeIcon  footer={false} setOpen={setproductListBulkModel} open={productListBulkModel} modalBody={<CreateBulkProductForAdmin setproductListBulkModel={setproductListBulkModel}/>} width={"490px"}  align={"center"}/>
            </div>
        
    )
}
export default ProductList;