import { EditOutlined, LeftOutlined } from "@ant-design/icons";
import { Col, Row, Skeleton } from "antd";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getNetProfitAsync } from "../../../feature/sales/salesSlice";
import { useDebounce } from "../../../hooks/UseDebounce";
import CustomModal from "../../common/CustomModal";
import CustomText from "../../common/CustomText";
import SalesCard from "../SalesCard";
import NetProfitFilter from "./NetProfitFilter";
import NetProfitTable from "./NetProfitTable";
import AveragePackagingCharge from "./UpdateAveragePackaging";
const NetProfit = () => {
   const navigate = useNavigate();
   const token = Cookies.get("token");
   const [search,setSearch]=useState("");
   const [date,setDate]=useState([]);   
   const debounce=useDebounce(search,500);
   const [netProfitModel,setProfitModel]=useState(false);
   const [sort,setSort]=useState([])    
   const [page,setPage]=useState(1)       
   const dispatch = useDispatch();
   const { netProfit,isLoading } = useSelector((state) => state?.sales);  
   const getNetProfitHanler = async () => {
      const trimSearch=search.trim();
                const data={
                  limit:10,
                  page:page,
                  ...(search && {search:trimSearch} ),
                  ...(sort?.length>0 && {[sort[0]]:sort[1]} ),
                  ...((date?.length>0 && date[0]!='') && {startDate:date[0],endDate:date[1]} )

                }
              try {
                if(search && !trimSearch) return;

      const res = await dispatch(getNetProfitAsync({ token,data })).unwrap();
    } catch (error) {
      //  toast.error("Something went wrong. Please try again.");  
    }
  };
   
  const totalNetProfit = [
   
    {
      title: "Net Profit",
      value: `Rs. ${netProfit?.cards?.netProfit}`,
    },
    {
      title: "Avg. Packaging and shipping charges",
      value: `Rs. ${netProfit?.cards?.avgPackageCost}`,
    },
   
  ];
  useEffect(() => {
    getNetProfitHanler();
  }, [debounce,sort,page,date]);

  return (
    <div className="flex flex-col gap-5 p-[24px]">
      <div className="flex gap-2 items-center">
        <div
          className="cursor-pointer"
          onClick={() => {
            navigate("/admin/sales");
          }}
        >
          <CustomText
            className={"!text-[#214344] !text-[20px]"}
            value={<LeftOutlined />}
          />
        </div>
        <CustomText
          className={"!text-[#214344] !text-[20px]"}
          value={"Sales Reports → Ledger"}
        />
      </div>
      <div>
        <Row gutter={[10,10]} >
          {totalNetProfit?.map((item) => {
            return (
              <Col span={8}>
                {isLoading? <Skeleton.Node active={"active"} className="!w-[100%] !h-[150px] rounded-xl" />:
                <div className="relative"> 
                  <SalesCard item={item}/>
                  {item?.title=="Avg. Packaging and shipping charges" && <div  onClick={()=>{setProfitModel(true)}} className="absolute top-1 right-3 cursor-pointer">
                    <EditOutlined style={{color:"#214344", fontSize:"20px"}} /></div>}
                </div>}
              </Col>
            );
          })}
        </Row>
      </div>
      <div>
        <NetProfitFilter  setPage={setPage}  sortKey={sort} setDate={setDate} date={date}  search={search} setSort={setSort} setSearch={setSearch} />
      </div>
      <div>
        <NetProfitTable  page={page} setPage={setPage} item={netProfit} />
      </div>


        <CustomModal closeIcon  footer={false} setOpen={setProfitModel} open={netProfitModel} modalBody={<AveragePackagingCharge averagePackagingCharges={netProfit?.cards?.avgPackageCost} setProfitModel={setProfitModel}  />} width={"500px"}  align={"center"}/>

    </div>
    
  );
};
export default NetProfit;
