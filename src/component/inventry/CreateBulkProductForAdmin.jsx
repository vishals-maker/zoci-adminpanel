import { Button } from "antd";
import CustomButton from "../common/CustomButton";
import CustomImageUpload from "../common/CustomImageUpload";
import CustomText from "../common/CustomText";
import { ArrowDownOutlined, UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { createBulkAdminProductAsync } from "../../feature/inventaryManagement/inventarySlice";
import { toast } from "react-toastify";
const CreateBulkProductForAdmin = ({ setproductListBulkModel }) => {
    const [csvFile, setCsvFile] = useState("");
    const dispatch = useDispatch();
    const { isCreateProductLoading } = useSelector(state => state?.inventary)
    const token = Cookies.get("token");
    const csvData = `title,price,category,subCategory,sku,yearOfDesign,metalType,metalColor,size,quantity,madeFor,weight,modelImage,productImage,additional1,additional2`;
    const handleUpload = (e) => {
        const file = e.target.files[0]
        setCsvFile(file);
    }
    const createAdminBulkHandler = async () => {
        try {
            const formData = new FormData();
            formData.append("file", csvFile)
            const res = await dispatch(createBulkAdminProductAsync({ token, formData })).unwrap();
            console.log(res);

            if (res.success) {
                toast.success(res.message);
                setproductListBulkModel(false)
                setCsvFile(null)
            } else {
                toast.error(res?.response?.data?.message)
                setproductListBulkModel(false);
                setCsvFile(null)

            }
        } catch (error) {
            console.log(error);

            toast.error("Something went wrong. Please try again.");
            setproductListBulkModel(false)
            setCsvFile(null);
        }
    }
    const downlopadCsvFileUploadHandler = () => {
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
    return (

        <div className="flex  flex-col justify-center items-center gap-5">
            <CustomText className={"!text-[24px] font-semibold"} value={"Create Bulk products"} />
            <CustomText className={"!text-[16px] !text-[#214344]"} value={"Please Upload a CSV file to create bulk products."} />
            <div className="flex gap-1 items-center cursor-pointer" onClick={() => { downlopadCsvFileUploadHandler() }}>
                <ArrowDownOutlined />
                <CustomText className={"underline"} value={"Download Sample File"} />

            </div>
            <CustomImageUpload imageUploadHandler={(e) => { handleUpload(e) }} label={
                <div className="flex gap-2 items-center border-[2px] !border-[#214344] rounded-full px-10 py-5 bg-[#fff]">
                    <UploadOutlined style={{ fontSize: "24px" }} />
                    <CustomText className={"!text-[16px]"} value={"Upload CSV"} />
                </div>}

            />
            {csvFile && <CustomText className={"!text-[12px] !text-[#214344]"} value={"File successfully added Please upload"} />}

            <div className="flex justify-center items-center gap-3">
                <CustomButton onclick={() => { createAdminBulkHandler() }} className={"!text-[#fff] rounded-full"} value={isCreateProductLoading ? "...Loading" : "Yes, Create Bulk"} />
                <Button onClick={() => { setproductListBulkModel(false) }} className="rounded-full">No,Cancel</Button>
            </div>

        </div>
    )
}
export default CreateBulkProductForAdmin;