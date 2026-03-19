import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import CustomText from "../common/CustomText";
import deleteIcon from "../../assets/icons/deleteIcon.png"
import {useDispatch, useSelector} from "react-redux";
import { Image } from "antd";
import Cookies from "js-cookie"
import { useCallback, useEffect, useState } from "react";
import {  deleteItemToCollectionAsync, getSignatureAsync } from "../../feature/uiManagement/UiManagementSlice";
import ImageLoader from "../loader/ImageLoader";
import CustomModal from "../common/CustomModal";
import AddNewSignature from "./AddNewSignature";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ConfirmationPopup from "../common/ConfirmationPopup";
const SignatureUi=({collectionId})=>{
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const token=Cookies.get("token")
    const [signatureModel,setSignatureModel]=useState(false)
    const [deleteId,setDeleteId]=useState("");
   

    const {signatureItem ,isCollectionItemLoading ,isLoading}=useSelector(state=>state?.ui);
    
    const getCollectionById=async()=>{
        try {
            const res=await dispatch(getSignatureAsync({token,id:collectionId})).unwrap();
           
        } catch (error) {
        //    toast.error("Something went wrong. Please try again.");  
            
        }
    }
    const addNewItemHandler=()=>{
        if(collectionId){
            setSignatureModel(true)
        }else{
           toast.error("Please Select Collection")
        }
    }
    const deleteItemToCollectionHandler=async()=>{
       
    try {
        const res=await dispatch(deleteItemToCollectionAsync({token,collectionId:collectionId,ItemId:deleteId})).unwrap();
        
        if(res.success){
            toast.success(res.message);
            getCollectionById();
            setSignatureModel(false);
            setDeleteId(null);
        }
        
    } catch (error) {
        
    }

    }
    const deleteSignatureHandler=(id)=>{
        setSignatureModel(true)
        setDeleteId(id)
    }

    useEffect(()=>{
        if(collectionId){
          getCollectionById();
        }
    },[collectionId])



    if(isCollectionItemLoading  || isLoading) return <ImageLoader/>
    return(
        <>
       <div className="bg-[#EFE6DC]  shadow-xl">
        <div className="flex gap-2 px-[20px] bg-[#fff] py-[20px]" onClick={()=>{addNewItemHandler()}}>
            <PlusOutlined style={{fontSize:"18px" }} />
            <CustomText className={"text-[16px] font-semibold !text-[#214344] "} value={"Add New Item"}/>
        </div>
        <div className="flex flex-col gap-1 h-[40vh] overflow-auto bg-[#fff]  ">
            {signatureItem?.collection?.items?.map((item)=>{                
                return(
                    <>
                    <div className="flex justify-between items-center bg-[#fff] px-[20px]">
                        <div className="flex gap-[10px] items-center">
                            <Image preview={false} className="!size-[100px]" src={item?.images?.productImage}/>
                            <CustomText className={"text-[16px]  !text-[#214344] "} value={item?.title}/>

                        </div>
                        <div className="flex items-center gap-2">
                             <div
                                    className="h-[20px] w-[20px] cursor-pointer"
                                    onClick={()=>{deleteSignatureHandler(item?._id)}}
                                >
                                    <Image preview={false} src={deleteIcon} alt="deleteIcon"/>
                                </div>
                                <div
                                onClick={()=>{navigate("/admin/create-product",{state:{id:item?._id,draft:false}})}}
                                    className="h-[20px] w-[20px] cursor-pointer"
                                >
                                    <EditOutlined style={{ color: "#214344", fontSize: "24px" }} />
                                </div>
                        </div>
                    </div>
                    </>
                )
            })}
           <div>

           </div>
        </div>


        </div>
            <CustomModal closeIcon  footer={false} setOpen={setSignatureModel} open={signatureModel} modalBody={deleteId?<ConfirmationPopup setDeleteId={setDeleteId} setDeleteConfirm={setSignatureModel} confirmationPopUpHandler={deleteItemToCollectionHandler}/>:<AddNewSignature setSignatureModel={setSignatureModel} collectionId={collectionId} />} width={"700px"}  align={"center"}/>

        </>
    )
}
export default SignatureUi;