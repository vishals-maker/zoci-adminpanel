import { CopyOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isoToISTDateOnly } from "../../../constants/constants";
import CustomPagination from "../../common/CustomPagination";
import CustomTable from "../../common/CustomTable";
import CustomText from "../../common/CustomText";
import Loader from "../../loader/Loader";
const AnniversaryPromotionalTable=({selectedRowKeys,setSelectedRowKeys,setPage,page})=>{
      const navigate=useNavigate();

      const {anniversary,isLoading}=useSelector(state=>state?.marketing);
          
   
       const copyTextHandler=async(text)=>{
          try {
              await navigator.clipboard.writeText(text?.address[0]?.address+", "+text?.address[0]?.state);
              toast.success("Address copied successfully");
            } catch (err) {
              console.error('Failed to copy text: ', err);
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
              render: (_,item,idx) =>  <CustomText  value={idx+1}/>
            },
            
            {
              title: (
                <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Name"}/>
              ),
              dataIndex: "firstname",
              key: "firstname",
              width: 200,
              render: (_,text) =>  <div onClick={()=>{navigate("")}}><CustomText value={`${text?.firstname} ${text?.lastname}`}/></div>
            },
              {
              title: (
                <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"WhatsApp Number"}/>

              ),
              dataIndex: "mobile",
              key: "mobile",
              align:"start",
              width: 180,
              align:"center",
              render: (text) =>  <CustomText value={text}/>
            },
            {
              title: (
                <CustomText className="!text-[14px] !text-[#fff] font-semibold" value={"Address"}/>
              ),
              dataIndex: "address",
              key: "address",
              width: 300,
              render: (_,text) =>  <div className="flex justify-between items-center" > <CustomText value={text?.address[0]?.address?.length>30?text?.address[0]?.address.slice(0,30)+"...":text?.address[0]?.address+", "+text?.address[0]?.state}/><div className="!bg-[#214344] flex justify-center items-center p-2 rounded-full" onClick={()=>{copyTextHandler(text)}}><CopyOutlined style={{fontSize:"16px" ,color:"#F0D5A0"}} /></div></div>
            },
            {
              title:        <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Anniversary Date"}/>,
              dataIndex: "anniversary",
              key: "anniversary",
              width: 180,
              align:"center",
              render: (_,text) =>   <CustomText value={isoToISTDateOnly(text?.anniversary?.date)}/>
            },
             {
              title:        <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Spouse Name"}/>,
              dataIndex: "anniversary",
              key: "anniversary",
              width: 200,
              align:"start",
              render: (_,text) =>   <CustomText value={text?.anniversary?.spouseName}/>
            },
             {
              title:        <CustomText  className="!text-[14px] !text-[#fff] font-semibold" value={"Spouse’s  Number"}/>,
              dataIndex: "anniversary",
              key: "anniversary",
              width: 250,
              align:"center",
              render: (_,text) =>   <CustomText value={text?.anniversary?.spouseNumber}/>
            }
          ];
 const onSelectChange = newSelectedRowKeys => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
 const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  if(isLoading) return <Loader/>
    return(
        <>
        <CustomTable   scroll={{x:1400}}  dataSource={anniversary?.users} columns={columns}/>
        <CustomPagination pageNumber={page} total={anniversary?.total} onchange={(e)=>{setPage(e)}}/>
       
        </>
    )
}
export default AnniversaryPromotionalTable;