import { useState } from "react";
import CustomTable from "../../common/CustomTable";
import CustomText from "../../common/CustomText";
import { useNavigate } from "react-router-dom";
import { isoToIST } from "../../../constants/constants";
import CustomPagination from "../../common/CustomPagination";
import Loader from "../../loader/Loader";
import { useSelector } from "react-redux";

const NetProfitTable=({item,setPage,page})=>{
      const {  isLoading } = useSelector((state) => state?.sales);
   const columns = [
  {
    title: <CustomText className="!text-[14px] !text-[#fff] font-semibold" value="SNo." />,
    dataIndex: "sno",
    key: "sno",
    align:"center",
    width: 80,
    render: (_, __, index) => <CustomText value={index + 1} />,
  },

  {
    title: <CustomText className="!text-[14px] !text-[#fff] font-semibold" value="Invoice Id" />,
    dataIndex: "orderId",
    key: "orderId",
    width:150, 
    align:"center",
    render: (text) => <CustomText value={text??"-"} />,
  },
// Table: invoiceId, debit, credit, packagingcharge, profit, date
// invoiceId= Order Id
// debit= Total Debit
// amount= Total Credit
  {
    title: <CustomText className="!text-[14px] !text-[#fff] font-semibold" value="Total Debit" />,
    dataIndex: "totalDebit",
    key: "totalDebit",
    width: 150,
    align:"start",
    render: (text) => (
      <CustomText
      value={`Rs. ${text}`}
      className="!text-red-500 font-semibold"
    />
    ),
  },

  {
    title: <CustomText className="!text-[14px] !text-[#fff] font-semibold" value="Total Credit" />,
    dataIndex: "amount",
    key: "amount",
    width: 150,
    align:"start",
   render: (text) => (
  <CustomText
    value={`Rs. ${text}`}
    className="!text-green-500 font-semibold"
  />
),
  },
  {
    title: <CustomText className="!text-[14px] !text-[#fff] font-semibold" value="Packaging Charge" />,
    dataIndex: "packagingCharge",
    key: "packagingCharge",
    width: 150,
    align:"start",
    render: (text) => (
      <CustomText
      value={`Rs. ${text}`}
      className="!text-red-500 font-semibold"
    />
    ),
  },

  {
    title: <CustomText className="!text-[14px] !text-[#fff] font-semibold" value="Profit" />,
    dataIndex: "profit",
    key: "profit",
    width: 150,
    align:"start",
    render: (text) => (
      <CustomText  value={`Rs. ${(text.toFixed(2))}`} />
    ),
  },
    {
    title: <CustomText className="!text-[14px] !text-[#fff] font-semibold" value="Date" />,
    dataIndex: "date",
    key: "date",
    width: 150,
    align:"center",
    render: (text) => (
      <CustomText value={isoToIST(text)} />
    ),
  },
   
];



  if (isLoading) return <Loader />;

    return(
        <>
              <CustomTable  dataSource={item?.data} columns={columns}/>
              <CustomPagination  total={item?.pagination?.totalRecords} pageNumber={page} onchange={(e)=>{setPage(e)}}/>

        </>
    )
}
export default NetProfitTable;