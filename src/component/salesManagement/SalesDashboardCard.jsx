import { Card } from "antd";
import CustomText from "../common/CustomText";

const SalesDashboardCard=({item})=>{
    
    return(
        <>
        <Card >
            <div className="flex flex-col items-between min-h-[100px] gap-3">
           <CustomText className={"!text-[16px]"} value={item?.title}/>
           <CustomText className={"!text-[20px] font-bold"} value={
            (item?.title=="Total Sales" ||
            item?.title=="Total Expenditure" ||
            item?.title=="Average Order Value" ||  
            item?.title=="Net Profit")   ?`Rs. ${item?.value?.toFixed(2)}`:item?.value
           }/>
           <CustomText className={`!text-[16px] ${item?.percent>=0?"!text-[#088738]":"!text-[red]"}`} value={`${item?.percent}%`}/>
           </div>
         </Card>
        </>
    )
}
export default SalesDashboardCard;