import { PlusOutlined } from "@ant-design/icons";
import { Col, Image, Row } from "antd";
import { useState } from "react";
import sort from "../../../assets/inventary/sort.png";
import CustomButton from "../../common/CustomButton";
import CustomInput from "../../common/CustomInput";
import CustomModal from "../../common/CustomModal";
import CustomText from "../../common/CustomText";
import CustomMultipleFilter from "../../common/CustumMultipleFilter";
import "../inventary.css";
import AddNewVendor from "./AddNewVendor";
import { vendorSort } from "./vendorFilterData";
const VendorFilter=({setSearch,setSort,search,sortKey,setPage,addVendorModel,setAddVendorModel,editData,setEditData})=>{
    return(
        <div className="inventary">
         <Row justify={"space-between"} gutter={[40]}>
                 <Col span={8}>
                  <div className="w-[70%]">
                   <CustomInput search name={"search"} value={search} onchange={(e)=>{setPage(1),setSearch(e.target.value)}} placeholder={"Search Vendors"} />
                   </div>
                 </Col>
                 
                 <Col span={16}>
                 <div className="flex gap-5 justify-end"> 
                     <CustomButton onclick={()=>{setAddVendorModel(true),setEditData(null)}} value={<div className="flex items-center gap-2">
                    <PlusOutlined style={{fontSize:"20px",color:"#F0D5A0"}} />
                    <CustomText className={"!text-[#fff]"} value={"Add New vendor"}/>

                  </div>}/>
                  <CustomButton value={<div className="flex items-center gap-2">
                    <Image preview={false} className="!size-[20px]" src={sort}/>
                    <CustomMultipleFilter value={sortKey} placeholder={"Sort"} onchange={(value)=>{setPage(1),setSort(value)}} option={ vendorSort}/>
                  </div>}/>
                  </div>
                  </Col>
            </Row>
            <CustomModal  footer={false} setOpen={setAddVendorModel} open={addVendorModel} modalBody={<AddNewVendor  editData={editData} setOpen={setAddVendorModel}/>} width={"1052px"}/>
        </div>
    )
}
export default VendorFilter;