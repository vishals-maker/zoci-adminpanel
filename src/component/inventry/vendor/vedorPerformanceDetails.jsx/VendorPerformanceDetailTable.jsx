

import { Image, Space } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomText from "../../../common/CustomText";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import deleteIcon from "../../../../assets/icons/deleteIcon.png";
import { vendorPerformanceDetailsAnalysis, vendorProductDeleteAsync } from "../../../../feature/inventaryManagement/inventarySlice";
import ConfirmationPopup from "../../../common/ConfirmationPopup";
import CustomModal from "../../../common/CustomModal";
import CustomPagination from "../../../common/CustomPagination";
import CustomTable from "../../../common/CustomTable";
import Loader from "../../../loader/Loader";

const VendorPerformanceDetailTable=({setSelectedRowKeys,selectedRowKeys,id,page,setPage})=>{
  const {vendorPerformanceAnalysisData}=useSelector(state=>state?.inventary);  
    const token=Cookies.get("token");
    const dispatch=useDispatch();
  const [deleteConfirm,setDeleteConfirm]=useState();
  const [deleteId,setDeleteId]=useState(null);
  const {isLoading}=useSelector(state=>state?.inventary)
  const vendorProductsData=vendorPerformanceAnalysisData?.data?.products?.map((item)=>{
    return {...item,key:item?._id}
  })
 
  const confirmationPopUpHandler=async()=>{
    try {
      const res=await dispatch(vendorProductDeleteAsync({token,id:deleteId})).unwrap();
      if(res?.success){
       dispatch(vendorPerformanceDetailsAnalysis({token,id}))
      }      
      if(res.success){
        toast.success(res?.message);
        setDeleteConfirm(false)
      }else{
        toast.error(res?.message);
        setDeleteConfirm(false)
      }
    } catch (error) {
       toast.error("Something went wrong. Please try again.");
       toast.error(error?.message);
       setDeleteConfirm(false);
    }
     
  }



  
     const columns = [
         {
      title: (
        <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"S No."}/>
      ),
      dataIndex: "title",
      key: "title",
      align:"center",
      width: 100,
      render: (_,record,idx) =>  <CustomText className={  " "} value={idx+1}/>
    },
    
    {
      title: (
        <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Product Image"}/>
      ),
      dataIndex: "images",
      key: "images",
      width: 200,
      render: (text) => <div className="flex justify-center"> <Image className="!size-[50px]" src={text?.productImage??"https://zoci-data.s3.ap-south-1.amazonaws.com/productImages/1770981878160_images%20%281%29.jpeg"}/></div>
    },
      {
      title: (
        <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Product Name"}/>

      ),
      dataIndex: "title",
      key: "title",
      width: 250,
      render: (text) =>  <CustomText value={text}/>
    },
    {
      title:        <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Size"}/>,
      dataIndex: "size",
      key: "size",
      width: 130,
      render: (text) =>   <CustomText value={text==""?"NA":text}/>
    },
    {
      title: (
                <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Price"}/>
      ),
      dataIndex: "price",
      key: "price",
      width: 200,
      align: "center",
      render: (text) =>  <CustomText value={`Rs. ${text}`}/>
    },
    {
      title: ( <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Available Qut."}/>),
      dataIndex: "quantity",
      key: "quantity",
      width: 200,
      align: "center",
      render: (text) => <CustomText value={text}/>
    },
    {
      title: ( <CustomText className="!text-[14px] !text-[#fff] font-semibold" value={"Metal Type"}/>),
      dataIndex: "metalType",
      key: "metalType",
      width: 200,
      align: "center",
      render: (text) => <CustomText value={text??"NA"}/>
    },
    // {
    //   title: (   <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Vendor"}/>),
    //   dataIndex: "vendor",
    //   key: "vendor",
    //   width: 300,
    //   align: "center",
    //   render: (text) =>  <CustomText value={text??"NA"}/>
    // },
    {
      title: (<CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Quantity"}/>),
      dataIndex: "quantity",
      align: "center",
      key: "quantity",
      width: 180,
      render: (text) =>  <CustomText value={text!=0?"In Stock":"Out Of Stock"}/>

     
    },
     {
      title: (<CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Action"}/>),
      dataIndex: "action",
      align: "center",
      key: "action",
      width: 130,
      render: (_, record) => (
        <Space size="middle">
          <div
            className="h-[20px] w-[20px] cursor-pointer"
            onClick={() => {
              setDeleteConfirm(true),setDeleteId(record?._id);
            }}
          >
            <img src={deleteIcon} alt="deleteIcon"/>
          </div>
         
        </Space>
      ),
     
    },
  ];

 const selectTableRowHandler = productKey => {
    setSelectedRowKeys(productKey);
  };
 const rowSelection = {
    selectedRowKeys,
    onChange: selectTableRowHandler,
  };
  if(isLoading) return <Loader/>
    return(
        <>
        <CustomTable   scroll={{x:1700}}  dataSource={vendorProductsData} columns={columns}/>
              <CustomPagination pageNumber={page} total={vendorPerformanceAnalysisData?.data?.totalProducts} onchange={(e)=>{setPage(e)}}/>
      
            <CustomModal  footer={false} setOpen={setDeleteConfirm} open={deleteConfirm} modalBody={<ConfirmationPopup confirmationPopUpHandler={confirmationPopUpHandler} setDeleteConfirm={setDeleteConfirm} />} width={"552px"} align={"center"}/>
        
        </>
    )
}
export default VendorPerformanceDetailTable;