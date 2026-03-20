import { Button, Col, Row, Skeleton } from "antd";
import Cookies from "js-cookie";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getNetProfitAsync, UpdateAveragePackagingChargesAsync } from "../../../feature/sales/salesSlice";
import CustomButton from "../../common/CustomButton";
import CustomInput from "../../common/CustomInput";
import CustomText from "../../common/CustomText";
const AveragePackagingCharge=({averagePackagingCharges,setProfitModel})=>{
    const [averagePackagingChargesInput,setAveragePackagingChargesInput]=useState("");
    const dispatch=useDispatch();
    const token=Cookies.get("token");
    const {isLoading}=useSelector(state=>state?.sales)
    const updatePackagingChargesHandler=async()=>{
        if(averagePackagingChargesInput===averagePackagingCharges) return toast.error("No changes shown")
        try {
            const  data={avgPackageCost:averagePackagingChargesInput}
            const res= await dispatch(UpdateAveragePackagingChargesAsync({token,data})).unwrap();
            if(res.success){
                setProfitModel(false)
                toast.success("Average Packaging Charges Update");
                dispatch(getNetProfitAsync({ token }))
            }
            
            
        } catch (error) {
            toast.error("Something went wrong!")
        }
    }
    useState(()=>{
        setAveragePackagingChargesInput(averagePackagingCharges)

    },[averagePackagingChargesInput]);
   
    return (
        <div className="flex flex-col gap-5">
         <div className="flex justify-center">
            <CustomText className={"text-[14px] font-bold "} value={"Update Avg. Packaging and shipping charges"}/>
            </div>
            <Row gutter={[20,20]}>
                    <Col span={24}>
                      <div className="flex flex-col gap-2">
                       <CustomText className={"text-[16px] "} value={"Avg. Packaging and shipping charges"}/>
                      {isLoading?<Skeleton.Node style={{width:"400px"}}/>: <CustomInput type={"number"} name={"eventName"} onchange={(e)=>{setAveragePackagingChargesInput(e.target.value)}} value={averagePackagingChargesInput} className={"h-[46px]"}/> }
                      </div>
                    </Col>

                     
                    </Row>
                    <div className="flex justify-center gap-4">
                    <CustomButton disable={isLoading?true:false} onclick={()=>{updatePackagingChargesHandler()}} className={"!text-[#fff] !bg-[#214344] w-[180px]"} value={"Yes, Update"}/>
                    <Button onClick={()=>{setProfitModel(false)}} className="!border-[2px] !border-[#214344] rounded-full  w-[180px] text-[14px]">No, Cancel</Button>

                </div>
        </div>
    )
}

export default AveragePackagingCharge;