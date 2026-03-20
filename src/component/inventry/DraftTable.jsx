import { EditOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { useSelector } from "react-redux";
import { data, useNavigate } from "react-router-dom";
import CustomPagination from "../common/CustomPagination";
import CustomTable from "../common/CustomTable";
import CustomText from "../common/CustomText";
import Loader from "../loader/Loader";

const DraftTable=({setPage,page,setSelectedRowKeys,selectedRowKeys})=>{
  const navigate=useNavigate();
  const {draftProducts,isLoading}=useSelector(state=>state?.inventary);  
console.log(draftProducts);

  const draftProductdata=draftProducts?.data?.map((item)=>{
     return {...item,key:item?._id} 
   })

     const columns = [
         {
      title: (
        <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"S No."}/>
      ),
      dataIndex: "serial",
      key: "serial",
      width: 70,
      render: (_,record,idx) =>  <CustomText  value={idx+1}/>
    },
     {
      title: (
       <CustomText className="!text-[14px] !text-[#fff] font-semibold" value={"Title"}/>
      ),
      dataIndex: "title",
      key: "title",
      width: 200,
      render: (text) =>  <CustomText value={text}/>
    },
    {
      title: (
        <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Price"}/>
      ),
      dataIndex: "price",
      key: "price",
      width: 150,
      align:"center",
      render: (text) =><CustomText value={text}/>
    },
    
      {
      title: (
        <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Category"}/>
      ),
      dataIndex: "category",
      key: "category",
      width: 150,
      render: (text) =>  <CustomText value={text}/>
    },
   
    {
      title:<CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Sub Category"}/>,
      dataIndex: "subCategory",
      key: "subCategory",
      width: 150,
      render: (text) =>   <CustomText value={text??"-"}/>
    },
    {
      title: (
                <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Year Of Design"}/>
      ),
      dataIndex: "yearOfDesign",
      key: "yearOfDesign",
      align:"center",
      width: 150,
      render: (text) =>  <CustomText value={`${text}`}/>
    },
    {
      title: ( <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Metal Type"}/>),
      dataIndex: "metalType",
      key: "metalType",
      width: 200,
      align: "center",
      render: (text) => <CustomText value={text}/>
    },
   
    {
      title: (   <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Metal Color"}/>),
      dataIndex: "metalColor",
      key: "metalColor",
      width: 150,
      align: "center",
      render: (text) =>  <CustomText value={text??"-"}/>
    },
    {
      title: (<CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Size"}/>),
      dataIndex: "size",
      key: "size",
      align: "center",
      width: 100,
      render: (text) =>  <CustomText value={text}/>
    },
    {
      title: (<CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Quantity"}/>),
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: 100,
      render: (text) =>  <CustomText value={text}/>
    },
    {
      title: (<CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Gender"}/>),
      dataIndex: "madefor",
      key: "madefor",
      align: "center",
      width: 150,
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
            onClick={()=>{navigate("/admin/create-product",{state:{id:record?._id,draft:true}})}}
          >
            <EditOutlined style={{ color: "#214344", fontSize: "24px" }} />
          </div>
        </Space>
      ),
     
    },
  ];


   const selectTableRowHandler = productKey => {
    console.log(productKey);
    
    setSelectedRowKeys(productKey);
   };
  const rowSelection = {
      selectedRowKeys,
      onChange: selectTableRowHandler
  };

  if(isLoading) return <Loader/>
    return(
        <>
        <CustomTable  rowSelection={rowSelection}  scroll={{x:1800}} dataSource={draftProductdata}   columns={columns}/>
        <CustomPagination pageNumber={page} total={draftProducts?.pagination?.total} onchange={(e)=>{setPage(e)}}/>
        </>
    )
}
export default DraftTable;