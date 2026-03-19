import { LeftOutlined } from "@ant-design/icons";
import { Button, Col, Image, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { compareNewAndOldObject } from "../../constants/constants";
import { specialChar } from "../../constants/regex";
import { createProductHandlerAsync, deleteDraftProductsById, getAllProductByIdAsync, getDraftProductsById, updateProductAsync } from "../../feature/inventaryManagement/inventarySlice";
import { getImageUrlAsync } from "../../feature/media/mediaSlice";
import CustomButton from "../common/CustomButton";
import CustomImageUpload from "../common/CustomImageUpload";
import CustomInput from "../common/CustomInput";
import CustomLabel from "../common/CustomLabel";
import CustomRadio from "../common/CustomRadio";
import CustomSelect from "../common/CustomSelect";
import CustomText from "../common/CustomText";
import Loader from "../loader/Loader";
import "./inventary.css";
import { metalColor, subCategoryOption } from "./inventaryFilterData";
import CustomModal from "../common/CustomModal";
import ConfirmationPopup from "../common/ConfirmationPopup";
const CreateNewProduct = () => {
  const [productModel,setProductModel]=useState(false);
  const {state}=useLocation();  
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const token=Cookies.get("token");
  const {category}=useSelector(state=>state?.ui);
  const {isCreateProductLoading,productById,error,draftById}=useSelector(state=>state?.inventary);
  const {isMediaLoading}=useSelector(state=>state?.media);  
  const [productInput,setProductInput]=useState({
    title: "",
    description: "",
    price: null,
    otherCharges: null,
    productionSource:"",
    category: "",
    subCategory: "",
    yearOfDesign: new Date().getFullYear(),
    collection: "",
    metalType: "",
    metalColor: "",
    stone: "",
    designTags:[],
    weight: "",
    size: "",
    quantity: null,
    hudNo: "",
    madefor: "",
    exclusive: "",
    images: {
        modalImage: "",
        productImage: "",
        additional1: "",
        additional2: ""
    },
    video: []
  });
  const madeForOption = [
    { label: "Men", value: "Men" },
    { label: "Women", value: "Women" },
    { label: "Unisex", value: "Unisex" },
  ];
  const exclusiveSelect = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];
  const stoneTypeOption=[
    {label:"Natural Diamond",value:"Natural Diamond"},
    {label:"Lab Grown Diamond",value:"Lab Grown Diamond"},
    {label:"Gemstone",value:"Gemstone"},
    {label:"Synthetic",value:"Synthetic"}
  ]
const baseMetalTypeOption = [
  { label: "Y22K", value: "Y22K" },
  { label: "Y18K", value: "Y18K" },
  { label: "Y14K", value: "Y14K" },
  { label: "Y9K", value: "Y9K" },

  { label: "W18K", value: "W18K" },
  { label: "W14K", value: "W14K" },
  { label: "W9K", value: "W9K" },

  { label: "R18K", value: "R18K" },
  { label: "R14K", value: "R14K" },
  { label: "R9K", value: "R9K" },

  { label: "G18K", value: "G18K" },
  { label: "G14K", value: "G14K" },
  { label: "G9K", value: "G9K" },

  { label: "STERLING SILVER (925)", value: "STERLING SILVER (925)" },
  { label: "ARGENTIUM SILVER (935)", value: "ARGENTIUM SILVER (935)" },
  { label: "PLATINUM (950)", value: "PLATINUM (950)" },
];
  const tagOptions=[
  { label: "Gold", value: "gold" },
  { label: "Lariat", value: "lariat" },
  { label: "Necklace", value: "necklace" },
  { label: "Premium", value: "premium" },
  { label: "Exclusive", value: "exclusive" },
  { label: "Women", value: "women" },
  { label: "Jewelry", value: "jewelry" },
  { label: "Fashion", value: "fashion" },
  { label: "Luxury", value: "luxury" },
  { label: "Handmade", value: "handmade" },
  { label: "Yellow", value: "yellow" },
  { label: "Elegant", value: "elegant" },
  { label: "Party", value: "party" },
  { label: "Gift", value: "gift" },
  { label: "Durable", value: "durable" }
];
  const categoryData=category?.categories?.map((item)=>{
    return {label:item?.title,value:item?.title}
  });
   const productInputHandler=(e)=>{
      const {name,value}=e.target;
     if(specialChar?.test(value) && name!="weight" && name!="description") return ;
     
      setProductInput({...productInput,[name]:value})
      
   }
  



   const handleUpload = async (e,status) => {    
      const file = e.target.files[0];
        if (!file) return;
              try {
              const formData = new FormData();
              formData.append("productImages", file);
              const res=await dispatch(getImageUrlAsync({token,formData})).unwrap();
              if(res.message){
                  toast.success(res?.message)                   
                 switch(status){
                  case "modelImage":
                           setProductInput({...productInput,images:{...productInput?.images,modalImage:res?.images[0]}})
                           break;
                  case "productImage":
                           setProductInput({...productInput,images:{...productInput?.images,productImage:res?.images[0]}})
                           break;
                 case "additionalImage1":
                           setProductInput({...productInput,images:{...productInput?.images,additional1:res?.images[0]}})
                           break;
                 case "additionalImage2":
                           setProductInput({...productInput,images:{...productInput?.images,additional2:res?.images[0]}})
                           break;
                 case "video":
                           setProductInput({...productInput,video:res?.images})
                           break;   
                 }
              }
              } catch (error) {                
                 toast.error("Something went wrong! or Image size is larger")
            }
      };
  const createProductHandler=async()=>{
    
    if(((productInput?.metalType=="G18K" || productInput?.metalType=="G14K" || productInput?.metalType=="G9K") && !productInput?.hudNo) ) return toast.error("Base metal type is missing ")
    if((productInput?.category=="Rings" || productInput?.category=="Bracelets") && productInput?.size=="") return toast.error("Please enter size")
   try {
    if(!state?.id  || state.draft){
    const data={...productInput}
       const res=await dispatch(createProductHandlerAsync({token,data})).unwrap();
        if(res.status && res.status_code==201){
      toast.success(res.message);
      navigate("/admin/inventary")
       if(state?.draft){
          dispatch(deleteDraftProductsById({id:state?.id,token}))
          }
        }else{
      {res?.response?.data?.errors.map((item)=>{
        return( toast.error(item))
      })} 
    }
    }else{
      const updatedData=compareNewAndOldObject({oldObj:productById?.product,newObj:productInput})
       const res=await dispatch(updateProductAsync({token,data:updatedData,id:productById?.product?._id})).unwrap();
       if(res.status){
          toast.success(res.message);
          navigate("/admin/inventary")
      }
    }
   } catch (error) {
    
     toast.error("Something went wrong. Please try again.");
   }
    
  }


  const getProductByIdData=async()=>{
    try {

      const res=await dispatch(getAllProductByIdAsync({token,id:state?.id})).unwrap();
      
      if(res.success){
        setProductInput({...res?.product})
      }
   }
     catch (error) {
       
    }
  }

  const getDraftProductById=async()=>{
    try {

      const res=await dispatch(getDraftProductsById({token,id:state?.id})).unwrap();
      
      if(res.success){
        setProductInput(res.data)
      }
   }
     catch (error) {
      
    }
  }

  const cancelConfirmHandler=()=>{
    setProductInput({ title: "",
    description: "",
    price: null,
    otherCharges: null,
    productionSource:"",
    category: "",
    subCategory: "",
    yearOfDesign: new Date().getFullYear(),
    collection: "",
    metalType: "",
    metalColor: "",
    stone: "",
    designTags:[],
    weight: "",
    size: "",
    quantity: null,
    hudNo: "",
    madefor: "",
    exclusive: "",
    images: {
        modalImage: "",
        productImage: "",
        additional1: "",
        additional2: ""
    },
    video: []});
    setProductModel(false)
  }
  
  useEffect(()=>{
    if(state){

    if(state.draft){
      getDraftProductById();
    }else{
      getProductByIdData();
    }
    }

  },[]);

  if(isMediaLoading || isCreateProductLoading) return <Loader/>
  return (
    <>
      <div className="flex flex-col gap-5 p-[24px]">
        <div className="flex gap-2 items-center">
          <div
            className="cursor-pointer"
            onClick={() => {
              navigate("/admin/inventary",{state:{}});
            }}
          >
            <CustomText
              className={"!text-[#214344] !text-[20px]"}
              value={<LeftOutlined />}
            />
          </div>
          <CustomText
            className={"!text-[#214344] !text-[20px]"}
            value={
              "Inventory Management & Analysis → Create Products Individually "
            }
          />
        </div>
        <div className="product-form  xl:!w-[1024px] md:!w-[800px] sm:!w-[500px] !w-[400px]  mx-auto ">
          <div className="flex flex-col gap-[30px]">
            <div className="flex justify-center">
              <CustomText
                className={"!text-[#214344] !text-[30px] font-[500]"}
                value={"Create Product"}
              />
            </div>
            <Row gutter={[40, 40]}>
              <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
                <div className="flex flex-col gap-2">
                   <CustomLabel required value={"Product Source"} />
                   <CustomSelect value={productInput?.productionSource} onchange={(e)=>{setProductInput({...productInput,productionSource:e})}} options={[{label:"Company Custom",value:"Company Custom"},{label:"Procured",value:"Vendor Custom"}]} className="!rounded-full" />
                </div>
              </Col>
              <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
                <div className="flex flex-col gap-2">
                  <CustomLabel required value={"Product Category"} />
                  <CustomSelect value={productInput?.category} onchange={(e)=>{setProductInput({...productInput,subCategory:"",category:e})}} options={categoryData} className="!rounded-full" />
                </div>
              </Col>
            </Row>
            <Row gutter={[40, 40]}>
              <Col span={12}>
                <div className="flex flex-col gap-2">
                  <CustomLabel required value={"Sub Category"} />
                  <CustomSelect value={productInput?.subCategory} onchange={(e)=>{setProductInput({...productInput,subCategory:e})}} options={subCategoryOption[productInput?.category]} className="!rounded-full" />
                   {/* <CustomInput name={"subCategory"} value={productInput?.subCategory} onchange={(e)=>{productInputHandler(e)}}  className="!rounded-full" /> */}
                </div>
              </Col>
              <Col span={12}>
                <div className="flex flex-col gap-2">
                  <CustomLabel required value={"Year of Design"} />
                     <CustomInput
                        name="yearOfDesign"
                        value={productInput.yearOfDesign}
                        onchange={productInputHandler}
                        className="!rounded-full"
                      />

                </div>
              </Col>
            </Row>
            <Row gutter={[40, 40]}>
              <Col span={12}>
                <div className="flex flex-col gap-2">
                  <CustomLabel required value={"Base Metal Type"} />
                   
                   <CustomSelect value={productInput?.metalType} onchange={(e)=>{setProductInput({...productInput,metalType:e})}} options={baseMetalTypeOption} className="!rounded-full" />


                </div>
              </Col>
              <Col span={12}>
                <div className="flex flex-col gap-2">
                  <CustomLabel required value={"Metal Color"} />
                  {/* <CustomInput 
                   name="metalColor"
                    value={productInput.metalColor}
                    onchange={productInputHandler}
                      className="!rounded-full" /> */}

                   <CustomSelect value={productInput?.metalColor} onchange={(e)=>{setProductInput({...productInput,metalColor:e})}} options={metalColor} className="!rounded-full" />

                </div>
              </Col>
            </Row>
            <Row gutter={[40, 40]}>
              <Col span={12}>
                <div className="flex flex-col gap-2">
                  <CustomLabel value={"Stone(if Any)"} />
                  {/* <CustomInput name="stone"
                    value={productInput.stone}
                    onchange={productInputHandler} 
                    className="!rounded-full" /> */}
                   <CustomSelect value={productInput?.stone} onchange={(e)=>{setProductInput({...productInput,stone:e})}} options={stoneTypeOption} className="!rounded-full" />
                </div>
              </Col>
              <Col span={12}>
                <div className="flex flex-col gap-2">
                  <CustomLabel required={(productInput?.category=="Rings" || productInput?.category=="Bracelets" )?true:false}  value={"Size"} />
                  <CustomInput
                  type={"text"}
                  name="size"
                  value={productInput?.size}
                  onchange={productInputHandler}
                  className="!rounded-full" />
                </div>
              </Col>
            </Row>
            <Row gutter={[40, 40]}>
              <Col span={12}>
                <div className="flex flex-col gap-2">
                  <CustomLabel value={"Part of any Collection(if any)"} />
                  <CustomInput  name="collection"
                       onchange={productInputHandler}
                       value={productInput?.collection}
                        className="!rounded-full" />
                </div>
              </Col>
              <Col span={12}>
                <div className="flex flex-col gap-2">
                  <CustomLabel required value={"Quantity Avaliable"} />
                  <CustomInput
                  type={"number"}
                  name="quantity"
                      value={productInput?.quantity}
                      onchange={productInputHandler}
                      className="!rounded-full" />
                </div>
              </Col>
            </Row>
            <Row gutter={[40, 40]}>
              <Col span={12}>
                <div className="flex flex-col gap-2">
                  <CustomLabel value={"Weight in Grams"} />
                  <CustomInput name="weight"
                    type={"text"}
                      value={productInput?.weight}
                      onchange={productInputHandler}
                      className="!rounded-full" />
                </div>
              </Col>
              <Col span={12}>
                <div className="flex flex-col gap-2">
                  <CustomLabel required value={"Price"} />
                  <CustomInput 
                  type={"number"}
                   name="price"
                    value={productInput?.price}
                    onchange={productInputHandler}
                    className="!rounded-full" />
                </div>
              </Col>
            </Row>
            <Row gutter={[40, 40]}>
              <Col span={12}>
                <div className="flex flex-col gap-2">
                  <CustomLabel required={(productInput?.baseMetalType=="G18K" || productInput?.baseMetalType=="G14K" || productInput?.baseMetalType=="G9K") ?true:false} value={"HUID No."} />
                    <CustomInput name="hudNo"
                        value={productInput.hudNo}
                        onchange={productInputHandler}
                        className="!rounded-full" />
                </div>
              </Col>
                <Col span={12}>
                <div className="flex flex-col gap-2">
                  <CustomLabel value={"Other charges (If any)"} />
                  <CustomInput 
                  type={"number"}
                  name="otherCharges"
                  value={productInput?.otherCharges}
                  onchange={productInputHandler}
                   
                  />
                </div>
              </Col>
             
            </Row>
          
            <Row gutter={[40, 40]}>
              <Col span={12}>
                <div className="flex flex-col gap-2">
                  <CustomLabel required value={"Made For"} />
                  <CustomRadio name={"madefor"} value={productInput?.madefor} defaultValue={"Men"} onchange={productInputHandler}  options={madeForOption} />
                </div>
              </Col>
              <Col span={12}>
                <div className="flex flex-col gap-2">
                  <CustomLabel required={true} value={"Exclusive"} />
                  <CustomRadio name={"exclusive"} value={productInput?.exclusive} defaultValue={true} onchange={productInputHandler} options={exclusiveSelect} />
                </div>
              </Col>
            </Row>
            <div className="flex flex-col gap-[30px] bg-[#fff] p-[30px] rounded-md">
              <CustomText
                className={"!text-[18px] font-[500]"}
                value={"Upload Media Files"}
              />
              <Row gutter={[40, 40]}>
                <Col span={12}>
                  <div className="flex flex-col gap-2">
                    <CustomText
                      className={"!text-[#214344] !text-[16px]"}
                      value={"Model Image"}
                    />
                    <CustomImageUpload
                     imageUploadHandler={(e)=>{handleUpload(e,"modelImage")}}
                      label={
                        <div className="relative w-[20%]">
                        <Image
                          className="!size-[100px]"
                          preview={false}
                           src={!productInput?.images?.modalImage?
                            "https://zoci-data.s3.ap-south-1.amazonaws.com/productImages/1764011866002_add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg":
                            productInput?.images?.modalImage
                          }
                        />
                        </div>
                      }
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex flex-col gap-2">
                    <CustomText
                      className={"!text-[#214344] !text-[16px]"}
                      value={"Product Image"}
                    />
                    <CustomImageUpload
                     imageUploadHandler={(e)=>{handleUpload(e,"productImage")}}c
                      label={
                        <Image
                          className="!size-[100px]"
                          preview={false}
                          src={!productInput?.images?.productImage?
                            "https://zoci-data.s3.ap-south-1.amazonaws.com/productImages/1764011866002_add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg":
                            productInput?.images?.productImage
                          }
                        />
                      }
                    />
                  </div>
                </Col>
              </Row>
              <Row gutter={[40, 40]}>
                <Col span={12}>
                  <div className="flex flex-col gap-2">
                    <CustomText
                      className={"!text-[#214344] !text-[16px]"}
                      value={"Additional Image 1"}
                    />
                    <CustomImageUpload
                     imageUploadHandler={(e)=>{handleUpload(e,"additionalImage1")}}
                      label={
                        <Image
                          className="!size-[100px]"
                          preview={false}
                           src={!productInput?.images?.additional1?
                            "https://zoci-data.s3.ap-south-1.amazonaws.com/productImages/1764011866002_add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg":
                            productInput?.images?.additional1
                          }
                        />
                      }
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex flex-col gap-2">
                    <CustomText
                      className={"!text-[#214344] !text-[16px]"}
                      value={"Additional Image 2"}
                    />
                    <CustomImageUpload
                     imageUploadHandler={(e)=>{handleUpload(e,"additionalImage2")}}
                      label={
                        <Image
                          className="!size-[100px]"
                          preview={false}
                           src={!productInput?.images?.additional2?
                            "https://zoci-data.s3.ap-south-1.amazonaws.com/productImages/1764011866002_add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg":
                            productInput?.images?.additional2
                          }
                        />
                      }
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <div className="flex flex-col gap-2">
                    <CustomText
                      className={"!text-[#214344] !text-[16px]"}
                      value={"Upload Video"}
                    />
                    <CustomImageUpload
                     imageUploadHandler={(e)=>{handleUpload(e,"video")}}
                      label={
                        !productInput?.video?.length ?
                        (<Image
                          className="!size-[100px]"
                          preview={false}
                          src={
                            "https://zoci-data.s3.ap-south-1.amazonaws.com/productImages/1764011866002_add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg"
                          }
                        />):( <video className="rounded-xl" autoPlay width="250">
                                <source src={productInput?.video?.length && productInput?.video[0]} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>)
                      }
                    />
                  </div>
                </Col>
              </Row>
            </div>
            <Row gutter={[40, 40]}>
              <Col span={12}>
                <div className="flex flex-col gap-2">
                  <CustomLabel required value={"Product Name"} />
                  <div className="relative">
                    <CustomInput 
                        name="title"
                        value={productInput?.title}
                        onchange={productInputHandler}
                    className="!rounded-full" />
                    <div className="absolute top-1 right-1">
                      <CustomButton
                      onclick={()=>{setProductInput({...productInput,title:null})}}
                        className={"!text-[#fff] !h-[24px] "}
                        value={"Refresh"}
                      />
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="flex flex-col gap-2 relative">
                  <CustomLabel required value={"Design Tags "} />
                   <CustomSelect mode={"tags"} value={productInput?.designTags} onchange={(e)=>{setProductInput({...productInput,designTags:e})}} options={tagOptions} className="!rounded-full" />
                    <div className="absolute top-8.5 right-1">
                      <CustomButton
                      onclick={()=>{setProductInput({...productInput,designTags:null})}}
                        className={"!text-[#fff] !h-[24px] "}
                        value={"Refresh"}
                      />
                    </div>
                </div>
              </Col>
            </Row>
            <Row gutter={[40, 40]}>
              <Col span={24}>
                <div className="flex flex-col gap-2">
                  <CustomLabel required value={"Description"} />
                   <div className="relative">
                   <TextArea name="description" value={productInput?.description} onChange={productInputHandler} className="!min-h-[150px]" />
                    <div className="absolute bottom-2 right-2">
                      <CustomButton
                      onclick={()=>{setProductInput({...productInput,description:null})}}
                        className={"!text-[#fff] !h-[24px] "}
                        value={"Refresh"}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
           <div className="flex justify-center gap-[20px]">
              <CustomButton onclick={()=>{createProductHandler()}} className={"!text-[#fff] w-[300px]"} value={"Submit"}/>
              <Button onClick={()=>{setProductModel(true)}} className={"!text-[#214344] rounded-full w-[300px]"}>Cancel</Button>
           </div>
          </div>
        </div>
      </div>


            <CustomModal closeIcon  footer={false} setOpen={setProductModel} open={productModel} modalBody={<ConfirmationPopup  confirmationPopUpHandler={cancelConfirmHandler} setDeleteConfirm={setProductModel} /> } width={"800px"}  align={"center"}/>
     
    </>
  );
};
export default CreateNewProduct;
