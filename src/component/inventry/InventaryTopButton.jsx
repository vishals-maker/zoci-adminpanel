import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CustomButton from "../common/CustomButton";
import CustomText from "../common/CustomText";

const InventaryTopButton = ({ totalVendor }) => {
  const navigate = useNavigate();

  // 🔹 Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Title */}
      <div>
        <CustomText
          value={"Inventory Management & Analysis"}
          className={"!text-[#214344] !text-[20px] "}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-5">
        <CustomButton
          onclick={() => navigate("/admin/stock-alert")}
          className={
            "!text-[14px] font-semibold w-[330px] !h-[50px] !text-[#fff]"
          }
          value={"Stock Level Alerts & Notify Me"}
        />

        <CustomButton
          onclick={() => navigate("/admin/vendor-performance")}
          className={"w-[330px] !h-[50px]"}
          value={
            <div className="flex flex-col items-center">
              <CustomText
                value={"Vendor Performance Analysis"}
                className={"!text-[#fff] !text-[14px]"}
              />
              <CustomText
                value={`Total No. of Vendors: ${totalVendor}`}
                className={"!text-[#fff] !text-[12px]"}
              />
            </div>
          }
        />

        <CustomButton
          onclick={() => navigate("/admin/best-seller")}
          className={
            "!text-[14px] font-semibold w-[330px] !h-[50px] !text-[#fff]"
          }
          value={"Best-selling Product"}
        />

        {/* 🔹 New Button */}
        <CustomButton
          onclick={() => setIsModalOpen(true)}
          className={
            "!text-[14px] font-semibold w-[330px] !h-[50px] !text-[#fff]"
          }
          value={"Metal Rate Configurator"}
        />
      </div>

      {/* 🔹 Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          
          <div className="bg-white w-[900px] rounded-xl p-6 relative shadow-lg">

            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-4 text-xl font-bold"
            >
              ✕
            </button>

            {/* Header */}
            <h2 className="text-[20px] font-semibold text-[#214344]">
              Metal Rates Configurator
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Manage and update metal rates based on purity percentage.
            </p>

            {/* Tabs */}
            <div className="flex gap-3 mb-4">
              <button className="bg-[#214344] text-white px-4 py-2 rounded">
                Gold
              </button>
              <button className="border px-4 py-2 rounded">
                Silver
              </button>
              <button className="border px-4 py-2 rounded">
                + Add Metal
              </button>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden mb-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-3">Purity / Karat</th>
                    <th className="p-3">Percentage</th>
                    <th className="p-3">Rate (₹)</th>
                    <th className="p-3">Base</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3">24K (Pure Gold)</td>
                    <td className="p-3">100%</td>
                    <td className="p-3">100,000</td>
                    <td className="p-3">
                      <span className="bg-[#214344] text-white px-2 py-1 rounded text-xs">
                        BASE
                      </span>
                    </td>
                  </tr>

                  <tr className="border-t">
                    <td className="p-3">22K</td>
                    <td className="p-3">91.7%</td>
                    <td className="p-3">91,700</td>
                    <td className="p-3">✏️</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer Button */}
            <div className="flex justify-center">
              <button className="bg-[#214344] text-white px-6 py-2 rounded">
                UPDATE RATE
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default InventaryTopButton;