import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {DeleteOutlined, EditOutlined, LeftOutlined,RightOutlined} from '@ant-design/icons';
import CustomText from "./CustomText";
import { Image, Skeleton } from "antd";
import CustomModal from "./CustomModal";
import ConfirmationPopup from "./ConfirmationPopup";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { deleteEventSalesEventAsync, getSalesDashboardAsync } from "../../feature/sales/salesSlice";
import { toast } from "react-toastify";
const CustomSlider = ({EventSalesSlider,setEditData,setAddExpenseModel,setEvent}) => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [deleteEventModel,setDeleteModel]=useState(false);
  const [deletedItem,setDeletedItem]=useState({});
  const {isDashboardLoading}=useSelector(state=>state?.sales)
  const token=Cookies.get("token");
  const dispatch=useDispatch();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const eventDeleteHandler=(item)=>{
    setDeleteModel(true);
    setDeletedItem(item);
  }

  const deletEventHandler=async()=>{
   try {
      const res=await dispatch(deleteEventSalesEventAsync({id:deletedItem?._id,token})).unwrap();
        if(res.success){
          toast.success(res?.message);
          dispatch(getSalesDashboardAsync({token}))
          setDeleteModel(false);
        }

   } catch (error) {
    
   }
  }

  useEffect(() => {
    if (
      swiperInstance &&
      swiperInstance.params &&
      swiperInstance.params.navigation
    ) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;

      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);
if(isDashboardLoading) return <Skeleton.Node active={true} style={{width:"1200px"}} /> 
  return (
    <div className="relative w-[95%] mx-auto">
      {/* Custom Buttons */}
      <button
        ref={prevRef}
        className="absolute top-1/2 -left-10 z-10 transform -translate-y-1/2 cursor-pointer
                   "
      >
        <LeftOutlined  style={{fontSize:"16px",color:"#214344"}}/>
      </button>
      <button
        ref={nextRef}
        className="absolute top-1/2 -right-10 z-10 transform -translate-y-1/2 cursor-pointer"
      >
        <RightOutlined  style={{fontSize:"16px",color:"#214344"}}/>
      </button>

      <Swiper
        modules={[Navigation]}
        slidesPerView={1}
        spaceBetween={30}
        onSwiper={setSwiperInstance} // 👈 capture swiper instance
      >
       {EventSalesSlider?.map((item,idx)=>{
        console.log(item);
        
        return(
            <SwiperSlide>
          <div className=" flex justify-between items-center px-20 relative">
            <CustomText className={"!text-[24px] font-bold !text-[#214344] "} value={item?.eventName??"-"}/>
            <CustomText className={"!text-[24px] font-bold !text-[#214344] "} value={item?.city}/>
            <CustomText className={"!text-[24px] font-bold !text-[#214344] "} value={`Rs. ${item?.totalSales?.toFixed(2)}`}/>
            {/* <CustomText className={"!text-[24px] font-bold !text-[#214344] "} value={`Rs. ${item?.totalExpansions}`}/> */}
            <Image className="!size-[100px] object-cover" src={item?.image}/>
            <div className="absolute top-0 right-0">
            {/* <div className="flex gap-2">
              <div className="cursor-pointer" onClick={()=>{eventDeleteHandler(item)}}><DeleteOutlined style={{fontSize:"16px",color:"#214344"}} /></div>
              <div className="cursor-pointer" onClick={()=>{setEditData(item),setAddExpenseModel(true),setEvent(true)}}><EditOutlined  style={{fontSize:"16px",color:"#214344"}} /></div>
           </div> */}
            </div>
            </div>
        </SwiperSlide>
        )
       }) }
        
       
      </Swiper>
            <CustomModal closeIcon  footer={false} setOpen={setDeleteModel} open={deleteEventModel} modalBody={<ConfirmationPopup  confirmationPopUpHandler={deletEventHandler} setDeleteConfirm={setDeleteModel} /> } width={"800px"}  align={"center"}/>

    </div>
  );
};

export default CustomSlider;
