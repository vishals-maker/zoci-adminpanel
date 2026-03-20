import { Col, Image, Row } from "antd";
import profile from "../../assets/crm/customerDetail.jpg"
import CustomText from "../common/CustomText";
import Loader from "../loader/Loader";
import { useSelector } from "react-redux";
import { isoToDDMMYYYY, isoToIST, isoToISTTime } from "../../constants/constants";
const CrmCustomerDetails=({item,visitors})=>{
    const {isLoading} =useSelector(state=>state?.crm);
     if(isLoading) return <Loader/>

    return(
        <Row gutter={20}>
            <Col span={6}>
               <div className="flex flex-col ps-[20px] gap-5">
                <div className="size-[200px] ">
                    <Image className="h-full w-full object-fit rounded-full " preview={false} src={profile}/>
                </div>
                <div className="flex flex-col gap-1 ps-[10px]">
                    <CustomText className={"!text-[24px] !text-[#214344] font-bold"} value={item?.name}/>
                    <CustomText className={"!text-[18px] !text-[#000] font-[300] "} value={`Customer ID : ${item?.customerId}`}/>
                </div>

               </div>
            
            </Col>
            <Col span={10}>
            <div className="flex gap-5">
            <div className="flex flex-col gap-5">
                <div><CustomText className={"!text-[#214344] !text-[18px] font-semibold"}  value={"Details"}/></div>
                <div className="flex gap-10 ">
                <div className="flex flex-col gap-2">
                    <CustomText className={"!text-[#000] !text-[18px] "}  value={"Email"}/>
                    <CustomText className={"!text-[#214344] !text-[18px] w-[] "}  value={item?.email??"N/A"}/>
               </div>
                <div className="flex flex-col gap-2">
                    <CustomText className={"!text-[#000] !text-[18px] "}  value={"Phone"}/>
                    <CustomText className={"!text-[#214344] !text-[18px] "}  value={item?.phone??"N/A"}/>
               </div>

            </div>
            <div className="flex  gap-8">
             <div className="flex flex-col gap-2">
                    <CustomText className={"!text-[#000] !text-[18px] "}  value={"Spouse Name"}/>
                    <CustomText className={"!text-[#214344] !text-[18px] "}  value={item?.spauseName}/>
               </div>
                <div className="flex flex-col gap-2">
                    <CustomText className={"!text-[#000] !text-[18px] "}  value={"Spouse Number"}/>
                    <CustomText className={"!text-[#214344] !text-[18px] "}  value={item?.spauseNumber}/>
               </div>
               </div>
               </div> 
               </div>

            </Col>
             <Col span={8}>
           {visitors && 
                       <div className="flex flex-col gap-5">
                <div><CustomText className={"!text-[#214344] !text-[18px] font-semibold"}  value={"Important Dates"}/></div>
                <div className="flex gap-10 ">
                <div className="flex flex-col gap-2">
                    <CustomText className={"!text-[#000] !text-[18px] "}  value={"Birthday"}/>
                    <CustomText className={"!text-[#214344] !text-[18px] w-[] "}  value={item?.anniversary ? isoToDDMMYYYY(item?.birthday) :"N/A"}/>
               </div>
                <div className="flex flex-col gap-2">
                    <CustomText className={"!text-[#000] !text-[18px] "}  value={"Anniversary"}/>
                    <CustomText className={"!text-[#214344] !text-[18px] "}  value={item?.anniversary ? isoToDDMMYYYY(item?.anniversary):"N/A"}/>
               </div>
               
               </div>
            </div>
           

            }
            

            </Col>
        
        </Row>
    )
}
export default CrmCustomerDetails;