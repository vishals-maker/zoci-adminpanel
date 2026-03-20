import { useEffect, useState } from "react";
import CustomTable from "../../common/CustomTable";
import CustomText from "../../common/CustomText";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomerList } from "../../../feature/crm/crmSlice";
import Cookies from "js-cookie";
import Loader from "../../loader/Loader";
import { CopyOutlined, EyeOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import CustomPagination from "../../common/CustomPagination";
const CustomerListTable = ({ page, setPage }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { customerList, isLoading } = useSelector((state) => state?.crm);
  const navigate = useNavigate();
  const copyTextHandler = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Address copied successfully");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  const columns = [
    {
      title: (
        <CustomText
          className="!text-[14px] !text-[#fff] font-semibold"
          value={"S No."}
        />
      ),
      dataIndex: "title",
      key: "title",
      width: 100,
      render: (_, text, idx) => <CustomText value={idx + 1} />,
    },
   

    {
      title: (
        <CustomText
          className="!text-[14px] !text-[#fff] font-semibold"
          value={"Name"}
        />
      ),
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (_, text) => (
        <div
          className="cursor-pointer"
          onClick={() => {text?.source!="MakeToOrder"  && 
            navigate(`/admin/crm-customer-list/${text?.id}`);
          }}
        >
          <CustomText value={text?.name ?? "NA"} />
        </div>
      ),
    },
     {
      title: (
        <CustomText
          className="!text-[14px] !text-[#fff] font-semibold"
          value={"Source"}
        />
      ),
      dataIndex: "source",
      key: "source",
      width: 150,
      align:"center",
      render: (text) => <CustomText value={text=="MakeToOrder"?"Offline":"Online"} />,
    },
    {
      title: (
        <CustomText
          className="!text-[14px] !text-[#fff] font-semibold"
          value={"WhatsApp Number"}
        />
      ),
      dataIndex: "mobile",
      key: "mobile",
      width: 250,
      render: (text) => <CustomText value={text} />,
    },
    {
      title: (
        <CustomText
          className="!text-[14px] !text-[#fff] font-semibold"
          value={"Address"}
        />
      ),
      dataIndex: "address",
      key: "address",
      width: 350,
      render: (text) => (
        <div className="flex justify-between items-center">
          <CustomText value={text?.length>30?text?.slice(0, 30) + "...":text} />
          <div
            className="!bg-[#214344] flex justify-center items-center p-2 rounded-full"
            onClick={() => {
              copyTextHandler(text);
            }}
          >
            <CopyOutlined style={{ fontSize: "16px", color: "#F0D5A0" }} />
          </div>
        </div>
      ),
    },
    {
      title: (
        <CustomText
          className="!text-[14px] !text-[#fff] font-semibold"
          value={"DOB"}
        />
      ),
      dataIndex: "dob",
      key: "dob",
      width: 200,
      align: "center",
      render: (text) => <CustomText value={text} />,
    },
    {
      title: (
        <CustomText
          className="!text-[14px] !text-[#fff] font-semibold"
          value={"Anniversary"}
        />
      ),
      dataIndex: "anniversary",
      key: "anniversary",
      width: 200,
      align: "center",
      render: (text) => <CustomText value={text} />,
    },
    {
      title: (
        <CustomText
          className="!text-[14px] !text-[#fff] font-semibold"
          value={"Last Purchase Date "}
        />
      ),
      dataIndex: "lastPurchase",
      key: "lastPurchase",
      width: 250,
      align: "center",
      render: (text) => <CustomText value={text} />,
    },
    {
      title: (
        <CustomText
          className="!text-[14px] !text-[#fff] font-semibold"
          value={"Total orders"}
        />
      ),
      dataIndex: "totalOrders",
      key: "totalOrders",
      width: 200,
      align: "center",
      render: (text) => <CustomText value={text} />,
    },
    {
      title: (
        <CustomText
          className="!text-[14px] !text-[#fff] font-semibold"
          value={"Total Spends"}
        />
      ),
      dataIndex: "totalSpends",
      key: "totalSpends",
      width: 200,
      align: "center",
      render: (text) => <CustomText value={`Rs. ${text}`} />,
    },
  ];
  if (isLoading) return <Loader />;
  return (
    <>
      <CustomTable
        scroll={{ x: 1800 }}
        dataSource={customerList?.data}
        columns={columns}
      />
      <CustomPagination
        pageNumber={page}
        total={customerList?.total}
        onchange={(e) => {
          setPage(e);
        }}
      />
    </>
  );
};
export default CustomerListTable;
