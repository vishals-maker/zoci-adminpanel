import { useEffect, useState } from "react";
import CustomTable from "../common/CustomTable";
import { Avatar, Image, Space } from "antd";
import CustomText from "../common/CustomText";
import { EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { deleteProductAsync, getAllProductAsync } from "../../feature/inventaryManagement/inventarySlice";
import Cookies from "js-cookie";
import deleteIcon from "../../assets/icons/deleteIcon.png"
import CustomModal from "../common/CustomModal";
import ConfirmationPopup from "../common/ConfirmationPopup";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../common/CustomPagination";

const InventaryTable=({setSelectedRowKeys,selectedRowKeys,setPage,page})=>{
  const [deleteConfirm,setDeleteConfirm]=useState();
  const [deleteId,setDeleteId]=useState(null);
  const token=Cookies.get("token");  
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const {products,isLoading}=useSelector(state=>state?.inventary);  
  const productData=products?.products?.map((item)=>{
    return {...item,key:item?._id}
  });
  const getAllProducts=async()=>{
    try {
      const data={page:page,limit:10}
    const res=await dispatch(getAllProductAsync({token,data})).unwrap();    
    } catch (error) {
       toast.error("Something went wrong. Please try again.");
    }
  }
  const confirmationPopUpHandler=async()=>{
    try {
      const res=await dispatch(deleteProductAsync({token,id:deleteId})).unwrap();
      if(res?.success){
        getAllProducts()
      }
      if(res?.success){
        toast.success(res?.message);
        setDeleteConfirm(false);
      }else{
        toast.error(res?.message);
        setDeleteConfirm(false);
      }
    } catch (error) {
        toast.error(error?.message);
        setDeleteConfirm(false)
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
      fixed:true,
      render: (_,record,idx) =>  <CustomText  value={idx+1}/>
    },
     {
      title: (
       <CustomText className="!text-[14px] !text-[#fff] font-semibold" value={"SKU"}/>

      ),
      dataIndex: "sku",
      key: "sku",
      width: 130,
      fixed:true,
      render: (text) =>  <CustomText value={text}/>
    },
    {
      title: (
        <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Product Image"}/>
      ),
      dataIndex: "images",
      key: "images",
      width: 150,
      fixed:true,
      render: (text) => <div className="flex justify-center"> <Image className="!size-[50px]" src={text?.productImage}/></div>
    },
    
      {
      title: (
        <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Product Name"}/>

      ),
      dataIndex: "title",
      key: "title",
      width: 300,
      render: (text) =>  <CustomText value={text}/>
    },
   
    {
      title: <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Size"}/>,
      dataIndex: "size",
      key: "size",
      width: 120,
      render: (text) =>   <CustomText value={text??"-"}/>
    },
    {
      title: (
                <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Price"}/>
      ),
      dataIndex: "price",
      key: "price",
      width: 150,
      render: (text) =>  <CustomText value={`Rs. ${text}`}/>
    },
    {
      title: ( <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Available Qut."}/>),
      dataIndex: "quantity",
      key: "quantity",
      width: 150,
      align: "center",
      render: (text) => <CustomText value={text}/>
    },
    {
      title: ( <CustomText className="!text-[14px] !text-[#fff] font-semibold" value={"Metal Type"}/>),
      dataIndex: "metalType",
      key: "metalType",
      width: 200,
      align: "center",
      render: (text) => <CustomText value={text??"-"}/>
    },
    {
      title: (   <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Vendor"}/>),
      dataIndex: "vendor",
      key: "vendor",
      width: 250,
      align: "center",
      render: (text) =>  <CustomText value={text??"-"}/>
    },
    {
      title: (<CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Stock"}/>),
      dataIndex: "quantity",
      align: "center",
      key: "quantity",
      width: 180,
      render: (text) =>  <CustomText value={text!=0?"In Stock":"Out Of Stock"}/>
    },
    {
      title: (<CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Rating"}/>),
      dataIndex: "totalrating",
      align: "center",
      key: "totalrating",
      width: 180,
      render: (text) =>  <CustomText value={text}/>
    },
    {
      title: (<CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Category"}/>),
      dataIndex: "category",
      align: "center",
      key: "category",
      width: 180,
      render: (text) =>  <CustomText value={text}/>
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
          <div
            className="h-[20px] w-[20px] cursor-pointer"
            onClick={()=>{navigate("/admin/create-product",{state:{id:record?._id,draft:false}})}}
          >
            <EditOutlined style={{ color: "#214344", fontSize: "24px" }} />
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
        <CustomTable   scroll={{x:1400}} rowSelection={rowSelection}  dataSource={productData} columns={columns}/>
        <CustomPagination pageNumber={page} total={products?.totalProducts} onchange={(e)=>{setPage(e)}}/>
        <CustomModal  footer={false} setOpen={setDeleteConfirm} open={deleteConfirm} modalBody={<ConfirmationPopup confirmationPopUpHandler={confirmationPopUpHandler} setDeleteConfirm={setDeleteConfirm} />} width={"552px"} align={"center"}/>
        
        </>
    )
}
export default InventaryTable;