import CustomButton from "../common/CustomButton";


const InventoryLiveDraftButton=({setLiveProducts,liveProducts,setPage})=>{
    return(
        <div className="flex justify-center w-full ">
            <div className="flex bg-[#fff] p-1 rounded-full ">
            <CustomButton onclick={()=>{setLiveProducts(true),setPage(1)}} className={` ${liveProducts? "!bg-[#214344] !text-[#F0D5A0] hover:!text-[#F0D5A0]": "!bg-[#fff] !text-[#214344] hover:!text-[#214344]"} w-[200px] !text-[14px]`} value={"Live Products"}/>
             <CustomButton onclick={()=>{setLiveProducts(false),setPage(1)}} className={`${!liveProducts ? "!bg-[#214344] !text-[#F0D5A0]":"!bg-[#fff] !text-[#214344]" } w-[200px]  !text-[14px]`} value={"Drafts Products"}
            />
         </div>
        </div>
    )
}
export default InventoryLiveDraftButton;