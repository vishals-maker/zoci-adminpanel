import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../common/CustomPagination";
import CustomTable from "../../common/CustomTable";
import CustomText from "../../common/CustomText";
import Loader from "../../loader/Loader";
import { Space } from "antd";
import { EditOutlined } from "@ant-design/icons";
import deleteIcon from "../../../assets/icons/deleteIcon.png"
import { useState } from "react";
import CustomModal from "../../common/CustomModal";
import ConfirmationPopup from "../../common/ConfirmationPopup";
import { deleteVendorAsync, vendorPerformanceAnalysis } from "../../../feature/inventaryManagement/inventarySlice";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
const VendorPerformanceTable=({page,setPage,setAddVendorModel,setEditData})=>{
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const token=Cookies.get("token");
  const [confirmVendorModel,setConfirmVendorModel]=useState(false)
  const [deletedId,setDeletedId]=useState(null);
      const {vendorPerformance,isLoading}=useSelector(state=>state?.inventary);            
      const vendorData=vendorPerformance?.data?.map((item)=>{
    return {...item,key:item?.vendorId}
  });


  const vendorDeleteHandler=(item)=>{
    setConfirmVendorModel(true)
     setDeletedId(item?.vendorId)
     
  }



  const deleteVendorHandler=async()=>{
  console.log(deletedId);
  try {
    const res=await dispatch(deleteVendorAsync({token,id:deletedId})).unwrap();
    if(res?.success){
      setConfirmVendorModel(false)
      toast.success(res.message);
      const data={page:page,limit:10}
      dispatch(vendorPerformanceAnalysis({token,data}));
    }
    
    
  } catch (error) {
     toast.error("Something went Wrong");
      setConfirmVendorModel(false)

  }


  }
  
    const columns = [
         {
      title: (
        <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"S No."}/>
      ),
      dataIndex: "title",
      key: "title",
      width: 70,
      align:"center",
      render: (_,text,idx) =>  <CustomText  value={idx+1}/>
    },
   
      {
      title: (
       <div > <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Vendor"}/></div>

      ),
      dataIndex: "vendorName",
      key: "vendorName",
      width: 200,
      render: (_,text) => {        
        return (
            <div className="cursor-pointer" onClick={()=>{navigate(`/admin/vendor-performance/${text?.phoneNumber}`)}}><CustomText value={text?.vendorName}/></div>
        )
      } 
    },
    {
      title: (
       <CustomText className="!text-[14px] !text-[#fff] font-semibold" value={"SKU Quantity"}/>

      ),
      dataIndex: "skuQuantity",
      key: "skuQuantity",
      width: 180,
      align:"center",
      render: (text) =>  <CustomText value={text}/>
    },
  
    {
      title: (
                <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Product Quantity"}/>
      ),
      dataIndex: "productQuantity",
      key: "productQuantity",
      width: 180,
      align: "center",
      render: (text) =>  <CustomText value={` ${text}`}/>
    },
    {
      title: ( <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Average Rating"}/>),
      dataIndex: "averageRating",
      key: "averageRating",
      width: 150,
      align: "center",
      render: (text) => <CustomText value={text}/>
    },
    {
      title: ( <CustomText className="!text-[14px] !text-[#fff] font-semibold" value={"Total Sales"}/>),
      dataIndex: "totalSales",
      key: "totalSales",
      width: 180,
      align: "center",
      render: (text) => <CustomText value={text}/>
    },
    {
      title: (   <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Revenue"}/>),
      dataIndex: "revenue",
      key: "revenue",
      width: 300,
      align: "center",
      render: (text) =>  <CustomText value={`Rs. ${text}`}/>
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
            className=" cursor-pointer flex gap-1 items-center"
            onClick={() => {
              vendorDeleteHandler(record)
            }}
          >
            <img src={deleteIcon} className="!h-[18px] !w-[18px]" alt="deleteIcon"/>
          </div>
          <div
            className="h-[18px] w-[18px] cursor-pointer"
            onClick={()=>{
              setAddVendorModel(true),
              setEditData(record)
            }}
          >
            <EditOutlined style={{ color: "#214344", fontSize: "18px" }} />
          </div>
        </Space>
      ),
     
    },
  
     
  ];
  if(isLoading) return <Loader/>
    return(
        <>
              <CustomTable scroll={{x:1400}} dataSource={vendorData} columns={columns}/>
              <CustomPagination pageNumber={page} total={vendorPerformance?.totalVendors} onchange={(e)=>{setPage(e)}}/>
            <CustomModal closeIcon  footer={false} setOpen={setConfirmVendorModel} open={confirmVendorModel} modalBody={<ConfirmationPopup  confirmationPopUpHandler={deleteVendorHandler} setDeleteConfirm={setConfirmVendorModel} /> } width={"800px"}  align={"center"}/>


        </>
    )
}
export default VendorPerformanceTable;