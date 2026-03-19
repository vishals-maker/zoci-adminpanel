import { Button, Col, Image, Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import CustomText from "../../common/CustomText";
import CustomInput from "../../common/CustomInput";
import CustomButton from "../../common/CustomButton";
import CustomImageUpload from "../../common/CustomImageUpload";
import blogUpload from "../../../assets/icons/blogUpload.png"
import { toast } from "react-toastify";
import ImageLoader from "../../loader/ImageLoader";
import { useEffect, useState } from "react";
import { addEssanceVideoAsync, getHomeVideosAsync, updateHomeVideoAsync } from "../../../feature/uiManagement/UiManagementSlice";
const AddVideoModel = ({ setOpen,bannerVideo,essance,editData,edit,setEdit}) => {
 
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const {isLoading}=useSelector(state=>state?.ui);
  const [essanceTitle,setEssanceTitle]=useState("")
  const [uploadeFle,setUploadFile]=useState(null);
  const [previewfile,setPreviewFile]=useState(null);
const handleUpload = async (e) => {
     const file = e.target.files[0];
     setUploadFile(file)
     const videoUrl = URL.createObjectURL(file);
     setPreviewFile(videoUrl)
     };
    const uploadVideoHandler=async()=>{
       try {
        const formData=new FormData();        
        formData.append("video",uploadeFle);
       {essance &&  formData.append("title",essanceTitle);}
        const res= await dispatch(updateHomeVideoAsync({token,id:bannerVideo?.[0]?._id,formData})).unwrap();
        if(res?.success){
          toast.success(res.message);
          dispatch(getHomeVideosAsync({token}))
          setOpen(false);
          setEssanceTitle("");
          setEdit(false)
          
        }                
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        
      }

    }

    const addEssanceVideoHandler=async()=>{
       if(!essanceTitle || !uploadeFle)  return  toast.error("Please enter all required field")
       try {
         const formData=new FormData();        
        formData.append("video",uploadeFle);
        formData.append("title",essanceTitle);
        const res=await dispatch(addEssanceVideoAsync({token,formData})).unwrap();
        console.log(res);
        
        if(res.success){
          toast.success(res.message);
          setOpen(false);
          setEssanceTitle("")
          dispatch(getHomeVideosAsync({token}));
        }
        
        
       } catch (error) {
        console.log(error);
        
          toast.error("Something went wrong. Please try again.");
          
       }
    }
       
useEffect(()=>{
   if(essance){
    setEssanceTitle(bannerVideo[0]?.title)
   }

},[editData])
    

  return (
    <div>
      <div className="flex justify-center">
        
        <CustomText
          className={"text-[14px] font-bold "}
          value={`${essance?"Add New Essance":"Add  New Carousel Item"}`}
        />
       
      </div>
      <div className="flex flex-col gap-5 pt-10">
        <Row gutter={[20, 20]}>
          <Col span={24}>
           
          </Col>
         
          <Col span={24}>
           {essance && <div className="py-4"><CustomInput value={essanceTitle} onchange={(e)=>{setEssanceTitle(e.target.value)}} className={"h-[46px] "} placeholder={"Please Enter Title"}/></div>}
            <div className="flex flex-col gap-2">
              {/* <CustomText
                className={"text-[16px] font-semibold !text-[#214344]"}
                value={"Category Image"}
              /> */}
               {isLoading?<ImageLoader/>:<CustomImageUpload  imageUploadHandler={handleUpload} label={
            (!previewfile && !bannerVideo?.[0]?.videoUrl )?  <div className="flex flex-col gap-3 items-center cursor-pointer ">
                   <Image preview={false} className="!size-[30px]" src={blogUpload}/>
                <CustomText className={"!text-[#4C7399] !text-[24px] font-bold"} value={"Tap to upload Video"}/>
                <CustomText className={"!text-[#4C7399] text-[16px] "} value={"JPG, PNG up to 5 MB"}/>
                </div> :<div className="h-[200px] !w-[200px]">
                        <video className="h-full w-full object-cover rounded-2xl"  src={previewfile??bannerVideo?.[0]?.videoUrl} muted autoPlay  />
                  </div>  
             }
              />}
             
            </div>
          </Col>
        </Row>

        <div className="flex justify-center gap-4 pt-10">
          <CustomButton
          onclick={()=>{essance && !edit?addEssanceVideoHandler():uploadVideoHandler()}}
            className={"!text-[#fff] !bg-[#214344] w-[180px]"}
            value={isLoading?"Loading...":essance?`Yes, Submit Essance`:"Yes, Add New Video"}
          />
          <Button
            onClick={() => {
              setOpen(false);
            }}
            className="!border-[2px] !border-[#214344] rounded-full  w-[180px] text-[14px]"
          >
            No, Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
export default AddVideoModel;
