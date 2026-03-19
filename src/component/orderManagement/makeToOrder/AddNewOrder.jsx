import { Avatar, Col, DatePicker, Row, Select, Typography } from "antd";
import { Button, Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSku } from "../../../feature/admin/adminSlice";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { DeleteOutlined, LeftOutlined, UploadOutlined } from "@ant-design/icons";
import CustomTable from "../../common/CustomTable";
import CustomText from "../../common/CustomText";
import Loader from "../../loader/Loader";
import CustomInput from "../../common/CustomInput";
import { specialChar } from "../../../constants/regex";
import { useDebounce } from "../../../hooks/UseDebounce";
import { productBySkuAsync } from "../../../feature/inventaryManagement/inventarySlice";
import CustomSelect from "../../common/CustomSelect";
import {
  addNewOrderAsync,
  getEventTypeAsync,
  getPreviousAddressAsync,
  getPreviousBillingPlaceAsync,
} from "../../../feature/order/orderSlice";
import Cookies from "js-cookie";
import CustomImageUpload from "../../common/CustomImageUpload";
import { getImageUrlAsync } from "../../../feature/media/mediaSlice";
const { Option } = Select;
const AddnewOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const { isLoading } = useSelector((state) => state?.order);
  const { isMediaLoading } = useSelector((state) => state?.media);
  const [addressSearch, setAddressSearch] = useState({
    address: "",
    exhibition: "",
    eventType: "",
  });

  const { productBySku } = useSelector((state) => state?.inventary);
  const { previosAddressData, exhibitionPlace, eventType } = useSelector(
    (state) => state?.order,
  );
  const skuFilteredData = productBySku?.filter((item) => item?.stock > 0);
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 500);
  const previosAddressDataOption = previosAddressData?.data?.map((item) => {
    return { label: item, value: item };
  });
  const previosexhibitionPlaceOption = exhibitionPlace?.data?.map((item) => {
    return { label: item, value: item };
  });
  const eventTypePlaceOption = eventType?.data?.map((item) => {
    return { label: item, value: item };
  });
  const [invoiceInputHandler, setInvoiceInputHandler] = useState({
    customerName: "",
    customerMobile: "",
    customerAddress: "",
    billingPlace: "",
    eventType: "",
    paymentMode: "",
    advancePayment: null,
    items: [],
    comment: "",
    attachment:""
  });

  const subTotal = invoiceInputHandler?.items?.reduce(
    (accumulator, currentValue) => {
      return accumulator + currentValue?.price * currentValue?.quantity;
    },
    0,
  );
  const invoiceInputDataHandler = (e, item) => {
    if (item != "paymentMode") {
      const { name, value } = e.target;
      if (specialChar?.test(value)) return;
      if (name == "customerMobile" && value?.length > 10  ) return;
    }
    if (item == "paymentMode") {
      setInvoiceInputHandler({ ...invoiceInputHandler, [item]: e });
    } else if (item == "date") {
      setInvoiceInputHandler({
        ...invoiceInputHandler,
        [item]: e.format("YYYY-MM-DD"),
      });
    } else {
      setInvoiceInputHandler({
        ...invoiceInputHandler,
        [e.target.name]: e.target.value,
      });
    }
  };

  const quantityHandler = (record, item) => {
    if (
      (item === "minus" && record?.quantity <= 1) ||
      (item === "plus" && record?.quantity >= record?.stock)
    ) {
      return;
    } else {
      const data = [...invoiceInputHandler?.items];
      const index = data.findIndex((item) => item?.id == record?.id);
      data.splice(index, 1, {
        ...data[index],
        quantity:
          item == "plus"
            ? Math.min(data[index]?.quantity + 1, data[index]?.stock)
            : Math.max(data[index]?.quantity - 1, 1),
      });
      setInvoiceInputHandler({ ...invoiceInputHandler, items: data });
    }
  };

  const skuSearchHandler = async (e) => {
    const { value } = e.target;
    // if (specialChar?.test(value)) return;
    setSearch(value);
  };

  const getProductData = async () => {
    const trimSearch = search?.trim();
    try {
      // if (search && !trimSearch) return;

      const data = { sku: trimSearch };

      const res = await dispatch(productBySkuAsync({ data })).unwrap();
    } catch (error) {
          //  toast.error("Something went wrong. Please try again.");  

    }
  };

  const addSkuHandler = (item) => {
    setSearch("");
    const data = { ...item, quantity: 1 };
    if (
      invoiceInputHandler?.items?.some((product) => product?.sku == item?.sku)
    ) {
      return toast.error("Item already exist");
    } else {
      setInvoiceInputHandler({
        ...invoiceInputHandler,
        items: [...invoiceInputHandler?.items, data],
      });
      dispatch(addSku([]));
    }
  };
  const generateInvoiceHandler = async () => {
    if (
      invoiceInputHandler?.customerName == "" ||
      invoiceInputHandler?.customerMobile == "" ||
      invoiceInputHandler?.customerAddress == "" ||
      invoiceInputHandler?.billingPlace == "" ||
      invoiceInputHandler?.eventType == "" ||
      invoiceInputHandler?.paymentMode == "" ||
      invoiceInputHandler?.items?.length == 0
    ) {
      return toast.error("please Enter all required field");
    }
    try {
      const item = invoiceInputHandler?.items?.map((item) => {
        return {
          productName: item?.title,
          sku: item?.sku,
          size: item?.size,
          qty: item?.quantity,
          price: item?.price,
        };
      });
      const data = {
        customerName: invoiceInputHandler?.customerName,
        customerMobile: invoiceInputHandler?.customerMobile,
        customerAddress: invoiceInputHandler?.customerAddress,
        billingPlace: invoiceInputHandler?.billingPlace,
        eventType: invoiceInputHandler?.eventType,
        paymentMode: invoiceInputHandler?.paymentMode,
        advancePayment: invoiceInputHandler?.advancePayment,
        items: item,
        comment: invoiceInputHandler?.comment,
        attachment:invoiceInputHandler?.attachment
      };
      const res = await dispatch(addNewOrderAsync({ token, data })).unwrap();
      if (res.success) {
        navigate("/admin/make-order");
        toast.success(res?.message);
      }
    } catch (error) {
        toast.error("Something went wrong. Please try again.");  

    }
  };

  const removeproductHandler = (item) => {
    const data = [...invoiceInputHandler?.items];
    const index = data.findIndex((product) => product?.id == item.id);
    data.splice(index, 1);
    setInvoiceInputHandler({ ...invoiceInputHandler, items: data });
  };

  const cancelInvoiceHandler = () => {
    setInvoiceInputHandler({
      customerName: "",
      customerMobile: "",
      customerAddress: "",
      billingPlace: "",
      eventType: "",
      paymentMode: "",
      advancePayment: null,
      items: [],
      comment: "",
    });
  };

  const getPreviousAddress = async () => {
    try {
      const data = {
        ...(addressSearch?.address && { q: addressSearch?.address }),
      };
      const res = await dispatch(getPreviousAddressAsync({ token, data }));
    } catch (error) {
        toast.error("Something went wrong. Please try again.");  

    }
  };


  const getexhibitionPlace = async () => {
    try {
      const data = {
        ...(addressSearch?.eventType && { q: addressSearch?.exhibition }),
      };
      const res = await dispatch(getPreviousBillingPlaceAsync({ token, data }));
    } catch (error) {
      toast.error("Something went wrong. Please try again.");  
    }
  };
  const getEventType = async () => {
    try {
      const data = {
        ...(addressSearch?.eventType && { q: addressSearch?.eventType }),
      };
      const res = await dispatch(getEventTypeAsync({ token, data }));
    } catch (error) {
      toast.error("Something went wrong. Please try again.");  
    }
  };




   const handleUpload = async (e) => {
          const file = e.target.files[0];
            if (!file) return;
                  try {
                  const formData = new FormData();
                  formData.append("productImages", file);
                  const res=await dispatch(getImageUrlAsync({token,formData})).unwrap();
                  if(res.message){
                      toast.success(res?.message)
                      setInvoiceInputHandler({...invoiceInputHandler,attachment:res?.images[0]})
                      // setPromotion({...promotion,banner:res?.images[0]});
                     
                  }
                  } catch (err) {
                  console.error(err);
                }
          };
  const columns = [
    {
      title: (
        <CustomText
          className="!text-[14px] !text-[#fff] font-semibold"
          value={"S No."}
        />
      ),
      dataIndex: "id",
      key: "id",
      width: 160,
      align: "center",
      render: (_, record, idx) => <Typography.Text>{idx + 1}</Typography.Text>,
    },
    {
      title: (
        <CustomText
          className="!text-[14px] !text-[#fff] font-semibold"
          value={"Product Name"}
        />
      ),
      dataIndex: "title",
      key: "title",
      width: 160,
      align: "start",
      render: (_, record) => <Typography.Text>{record?.title}</Typography.Text>,
    },
    {
      title: (
        <CustomText
          className="!text-[14px] !text-[#fff] font-semibold"
          value={"SKU"}
        />
      ),
      dataIndex: "sku",
      key: "sku",
      width: 160,
      align: "center",
      render: (_, record) => <Typography.Text>{record?.sku}</Typography.Text>,
    },
    {
      title: (
        <CustomText
          className="!text-[14px] !text-[#fff] font-semibold"
          value={"Size"}
        />
      ),
      dataIndex: "size",
      key: "size",
      width: 160,
      align: "center",
      render: (_, record) => <Typography.Text>{record?.size}</Typography.Text>,
    },
    {
      title: (
        <CustomText
          className="!text-[14px] !text-[#fff] font-semibold"
          value={"Quantity"}
        />
      ),
      dataIndex: "stock",
      key: "stock",
      width: 160,
      align: "center",
      render: (_, record) => {
        return (
          <>
            <div className="flex justify-between px-[20px]">
              <Typography.Text
                onClick={() => {
                  quantityHandler(record, "minus");
                }}
                className="!text-[16px] cursor-pointer"
              >
                -
              </Typography.Text>
              <Typography.Text>{record?.quantity}</Typography.Text>
              <Typography.Text
                onClick={() => {
                  quantityHandler(record, "plus");
                }}
                className="!text-[16px] cursor-pointer"
              >
                +
              </Typography.Text>
            </div>
          </>
        );
      },
    },

    {
      title: (
        <CustomText
          className="!text-[14px] !text-[#fff] font-semibold"
          value={"Price"}
        />
      ),
      dataIndex: "price",
      key: "price",
      width: 160,
      align: "center",
      render: (_, record) => <Typography.Text>{record?.price}</Typography.Text>,
    },
    {
      title: (
        <CustomText
          className="!text-[14px] !text-[#fff] font-semibold"
          value={"Action"}
        />
      ),
      dataIndex: "price",
      key: "price",
      width: 160,
      align: "center",
      render: (_, record) => {
        return (
          <div
            onClick={() => {
              removeproductHandler(record);
            }}
          >
            <DeleteOutlined />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    setInvoiceInputHandler({ ...invoiceInputHandler, items: [] });
  }, []);

  useEffect(() => {
    getProductData();
  }, [debounceSearch]);

  useEffect(() => {
    getPreviousAddress();
    getexhibitionPlace();
    getEventType();
  }, []);
  if (isLoading) return <Loader />;
  return (
    <>
      <div className="flex flex-col gap-5 p-[24px]">
        <div className="flex gap-2 items-center">
          <div
            className="cursor-pointer"
            onClick={() => {
              navigate("/admin/order");
            }}
          >
            <CustomText
              className={"!text-[#214344] !text-[20px]"}
              value={<LeftOutlined />}
            />
          </div>
          <CustomText
            className={"!text-[#214344] !text-[20px]"}
            value={"Order Management →  Add New Order"}
          />
        </div>
      </div>
      <div className="generate-form px-20 flex flex-col gap-5">
        <Row gutter={40}>
          <Col span={12}>
            <div className="flex flex-col gap-2">
              <Typography.Text className="text-[#214344] !font-[600] !text-[14px]">
                Customer Name
              </Typography.Text>
              <CustomInput
                name="customerName"
                onchange={(e) => {
                  invoiceInputDataHandler(e);
                }}
                value={invoiceInputHandler?.customerName}
                className="rounded-full !border-[#214344] "
                placeholder="Enter Customer Name"
              />
            </div>
          </Col>
          <Col span={12}>
            <div className="flex flex-col gap-2">
              <Typography.Text className="text-[#214344] !font-[600] !text-[14px]">
                Phone No.
              </Typography.Text>
              <CustomInput
                type={"number"}
                name="customerMobile"
                onchange={(e) => {
                  invoiceInputDataHandler(e);
                }}
                value={invoiceInputHandler?.customerMobile}
                className="rounded-full !border-[#214344] "
                placeholder="Enter Mobile Number"
              />
            </div>
          </Col>
        </Row>
        <Row gutter={40}>
          <Col span={12}>
            <div className="flex flex-col gap-2">
              <Typography.Text className="text-[#214344] !font-[600] !text-[14px]">
                Customer’s Address
              </Typography.Text>
              <CustomSelect
                mode="tags"
                options={previosAddressDataOption ?? []}
                placeholder="Enter Address"
                onchange={(valueArr) => {
                  const value = valueArr?.[valueArr?.length - 1] || "";
                  setInvoiceInputHandler((prev) => ({
                    ...prev,
                    customerAddress: value,
                  }));
                }}
                value={
                  invoiceInputHandler?.customerAddress
                    ? [invoiceInputHandler?.customerAddress]
                    : []
                }
                className="rounded-full !border-[#214344]"
              />
            </div>
          </Col>
          <Col span={12}>
            <div className="flex flex-col gap-2"></div>
            <div className="flex flex-col gap-2">
              <Typography.Text className="text-[#214344] !font-[600] !text-[14px]">
                Billing Place
              </Typography.Text>
              <CustomSelect
                mode="tags"
                options={previosexhibitionPlaceOption ?? []}
                placeholder="Enter Billing Place"
                onchange={(valueArr) => {
                  const value = valueArr?.[valueArr?.length - 1] || "";
                  setInvoiceInputHandler((prev) => ({
                    ...prev,
                    billingPlace: value,
                  }));
                }}
                value={
                  invoiceInputHandler?.billingPlace
                    ? [invoiceInputHandler?.billingPlace]
                    : []
                }
                className="rounded-full !border-[#214344]"
              />
            </div>
          </Col>
        </Row>
        <Row gutter={40}>
          <Col span={12}>
            <div className="flex flex-col gap-2">
              <Typography.Text className="text-[#214344] !font-[600] !text-[14px]">
                Event Type
              </Typography.Text>
              <CustomSelect
                mode="tags"
                options={eventTypePlaceOption ?? []}
                placeholder="Enter  Event Type"
                onchange={(valueArr) => {
                  const value = valueArr?.[valueArr?.length - 1] || "";
                  setInvoiceInputHandler((prev) => ({
                    ...prev,
                    eventType: value,
                  }));
                }}
                value={
                  invoiceInputHandler?.eventType
                    ? [invoiceInputHandler?.eventType]
                    : []
                }
                className="rounded-full !border-[#214344]"
              />
            </div>
          </Col>
          <Col span={12}>
            <div className="flex flex-col gap-2">
              <Typography.Text className="text-[#214344] !font-[600] !text-[14px]">
                Date
              </Typography.Text>
              <DatePicker
                defaultValue={dayjs()}
                onchange={(e) => {
                  invoiceInputDataHandler(e, "date");
                }}
              />
            </div>
          </Col>
        </Row>
        <Row gutter={40}>
          <Col span={12}>
            <div className="flex flex-col gap-2">
              <Typography.Text className="text-[#214344] !font-[600] !text-[14px] ">
                Advance Received
              </Typography.Text>
              <CustomInput
                name="advancePayment"
                onchange={(e) => {
                  invoiceInputDataHandler(e);
                }}
                value={invoiceInputHandler?.advancePayment}
                className="rounded-full !border-[#214344] "
                placeholder="Enter Advance Payment"
              />
            </div>
          </Col>
          <Col span={12}>
            <div className="flex flex-col gap-2">
              <Typography.Text className="text-[#214344] !font-[600] !text-[14px]">
                Payment Mode
              </Typography.Text>
              <Form.Item rules={[{ required: true }]}>
                <Select
                  onChange={(e) => {
                    invoiceInputDataHandler(e, "paymentMode");
                  }}
                  value={invoiceInputHandler?.paymentMode}
                  className="rounded-full !border-[#214344] "
                  placeholder="Select Payment Method"
                >
                  <Option value="upi">UPI</Option>
                  <Option value="online">Online</Option>
                  <Option value="cash">Cash</Option>
                </Select>
              </Form.Item>
            </div>
          </Col>
        </Row>
        <Row gutter={40}>
          <Col span={12}>
            <div className="flex flex-col gap-2">
              <Typography.Text className="text-[#214344] !font-[600] !text-[14px]">
                Comment
              </Typography.Text>
              <CustomInput
                name="comment"
                onchange={(e) => {
                  invoiceInputDataHandler(e);
                }}
                value={invoiceInputHandler?.comment}
                className="rounded-full !border-[#214344] "
                placeholder="Enter Comment"
              />
            </div>
          </Col>
          <Col span={12}>
            <div className="flex flex-col gap-2 relative">
              <Typography.Text className="text-[#214344] !font-[600] !text-[14px]">
                Search Products
              </Typography.Text>
              <CustomInput
                value={search}
                onchange={(e) => {
                  skuSearchHandler(e);
                }}
                className="rounded-full !border-[#214344] "
                placeholder="Please Enter SKU"
              />
              {skuFilteredData?.length > 0 ? (
                <div className="absolute top-16 w-[100%] bg-[#ffff] z-[9999] h-[200px] overflow-auto rounded-md ">
                  {skuFilteredData?.map((item) => {
                    return (
                      <div
                        className="flex gap-3 items-center p-2 cursor-pointer"
                        onClick={() => {
                          addSkuHandler(item);
                        }}
                      >
                        <div>
                          <Avatar src={item?.image} />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Typography.Text className="!text-[14px] ">
                            Title : {item?.title}
                          </Typography.Text>
                          <Typography.Text className="!text-[14px] ">
                            SKU : {item?.sku}
                          </Typography.Text>
                          <Typography.Text className="!text-[14px] ">
                            Quantity : {item?.stock}
                          </Typography.Text>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
          <div className="flex flex-col gap-2">
           <Typography.Text className="text-[#214344] !font-[600] !text-[14px]">
                Upload File
              </Typography.Text>
                      <CustomImageUpload imageUploadHandler={(e)=>{handleUpload(e)}}  label={
                     <div className="flex gap-2 items-center  h-[46px] p-[20px]  bg-[#fff]">
                        {!invoiceInputHandler?.attachment && (<UploadOutlined style={{fontSize:"24px",color:"#214344" }} />)}
                      <CustomText  className={"!text-[16px]"} value={(isMediaLoading&& "Loading...")|| invoiceInputHandler?.attachment?"File Uploaded":"Upload attachement"}/>
                      </div>}
              />

          
          </div>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <CustomTable
              pagination={false}
              columns={columns}
              dataSource={invoiceInputHandler?.items}
            />
            {invoiceInputHandler?.items?.length > 0 && (
              <div className="flex flex-col gap-3 bg-[#fff] px-20 w-[100%] py-5">
                <Row justify={"end"}>
                  <Col span={12}>
                    <Typography.Text className="text-[16px] font-[500] text-[#214344]">
                      Sub Total
                    </Typography.Text>
                  </Col>
                  <Col span={12}>
                    <Typography.Text className="!text-end">
                      Rs. {subTotal}
                    </Typography.Text>
                  </Col>
                </Row>
                <Row justify={"end"}>
                  <Col span={12}>
                    <Typography.Text className="text-[16px] font-[500] text-[#214344]">
                      Advance Payment
                    </Typography.Text>
                  </Col>
                  <Col span={12}>
                    <Typography.Text className="!text-end">
                      Rs. {invoiceInputHandler?.advancePayment??0}
                    </Typography.Text>
                  </Col>
                </Row>
                <Row justify={"end"}>
                  <Col span={12}>
                    <Typography.Text className="text-[16px] font-[500] text-[#214344]">
                      Due Payment
                    </Typography.Text>
                  </Col>
                  <Col span={12}>
                    <Typography.Text className="!text-end">
                      Rs. {subTotal - invoiceInputHandler?.advancePayment}
                    </Typography.Text>
                  </Col>
                </Row>
              </div>
            )}
            <div className="flex justify-center items-center gap-3 py-5">
              <Button
                onClick={() => {
                  cancelInvoiceHandler();
                }}
                className=" !text-[#214344] !border-[#214344] !rounded-full !w-[250px] !text-[16px] py-3"
              >
                Cancel
              </Button>
              <div className="flex justify-center gap-3 py-5">
                <Button
                  onClick={() => {
                    generateInvoiceHandler();
                  }}
                  className="!bg-[#214344] !text-[#fff] !rounded-full !w-[250px] !text-[16px] py-3 "
                  htmlType="submit"
                >
                  Save
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AddnewOrder;
