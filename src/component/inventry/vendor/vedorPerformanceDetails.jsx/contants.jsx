import { toast } from "react-toastify";
import { vendordataExportInExcel } from "../../../../feature/inventaryManagement/inventarySlice";

export const VendorProductdataExportInExcelHandler = async ({dispatch,id,token}) => {
  try {
    const actionResult = await dispatch(vendordataExportInExcel({ token, id }));
    const { payload } = actionResult;

    // If payload is undefined or not blob, bail out
    if (!payload || !payload.blob) {
      toast.error("No file data returned");
      return;
    }

    const blob = payload.blob;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = payload.headers?.["content-disposition"]
      ? (payload.headers["content-disposition"].match(/filename="?(.+)"?/)?.[1] || "products.xlsx")
      : "products.xlsx";

    document.body.appendChild(link);
    link.click();

    // Clean up
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download error:", error);
  }
};