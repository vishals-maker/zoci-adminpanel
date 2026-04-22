import { useNavigate } from "react-router-dom";
import CustomButton from "../common/CustomButton";
import CustomText from "../common/CustomText";
const InventaryTopButton = ({totalVendor}) => {
  const navigate=useNavigate();
  return (
    <>
      <div>
        <CustomText
          value={"Inventory Management & Analysis"}
          className={"!text-[#214344] !text-[20px] "}
        />
      </div>
      <div className="flex flex-wrap gap-5">
        <CustomButton
          onclick={()=>{navigate("/admin/stock-alert")}}
          className={"!text-[14px] font-semibold  w-[330px]  !h-[50px] !text-[#fff]"}
          value={"Stock Level Alerts & Notify Me"}
        />
        <CustomButton
          onclick={()=>{navigate("/admin/vendor-performance")}}
          className={" w-[330px] !h-[50px]"}
          value={
            <div className="flex flex-col  items-center ">
              <CustomText
                value={"Vendor Performance Analysis"}
                className={"!text-[#fff] !text-[14px]"}
              />
              <CustomText
                value={`Total No. of Vendors: ${totalVendor}`}
                className={"!text-[#fff] !text-[12px]"}
              />
            </div>
          }
        />
        <CustomButton
          onclick={()=>{navigate("/admin/best-seller")}}
          className={"!text-[14px] font-semibold  w-[330px] !h-[50px] !text-[#fff]"}
          value={"Best-selling Product "}
        />
      </div>
    </>
  );
};
export default InventaryTopButton;
