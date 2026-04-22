import { DeleteOutlined, LeftOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
  Typography
} from "antd";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { specialChar } from "../../../constants/regex";
import {
  generateInvoice,
  previewPdfHandler,
} from "../../../feature/admin/adminApi";
import { addSku } from "../../../feature/admin/adminSlice";
import { productBySkuAsync } from "../../../feature/inventaryManagement/inventarySlice";
import {
  getEventTypeAsync,
  getPreviousAddressAsync,
  getPreviousBillingPlaceAsync,
} from "../../../feature/order/orderSlice";
import { useDebounce } from "../../../hooks/UseDebounce";
import CustomInput from "../../common/CustomInput";
import CustomSelect from "../../common/CustomSelect";
import CustomTable from "../../common/CustomTable";
import CustomText from "../../common/CustomText";
import Loader from "../../loader/Loader";

const GenerateInvoiceForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const [addressSearch, setAddressSearch] = useState({
    address: "",
    exhibition: "",
    eventType: "",
  });
  const [searchType, setSearchType] = useState({
    address: "",
    exhibition: "",
    eventType: "",
  });
  const { productBySku } = useSelector((state) => state?.inventary);
  const { previosAddressData, exhibitionPlace, eventType } = useSelector((state) => state?.order);
  const skuFilteredData = productBySku.filter((item) => item?.stock > 0);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState();
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
    name: "",
    mobile: "",
    address: "",
    exhibitionPlace: "",
    eventType: "",
    date: dayjs().format("YYYY-MM-DD"),
    discount: "",
    paymentMethod: "cash",
    invoiceData: [
      {
        sku: "",
        quantity: 1,
      },
    ],
  });
  const subTotal = invoiceInputHandler?.invoiceData?.reduce(
    (accumulator, currentValue) => {
      return accumulator + currentValue?.price * currentValue?.quantity;
    },0);
  const discountPrice =subTotal - subTotal * (invoiceInputHandler?.discount / 100);

  const invoiceInputDataHandler = (e, item) => {
  if (item !== "paymentMethod") {
    const { name, value } = e.target;

    // Skip specialChar validation for discount field
    if (name !== "discount" && specialChar?.test(value)) return;

    if (name === "mobile" && value?.length > 10) return;

    if (name === "discount") {
      // Allow empty, digits, and one decimal point
      if (!/^\d*\.?\d*$/.test(value)) return;

      // Prevent more than 100
      if (value !== "" && Number(value) > 100) return;
    }
  }

  if (item === "paymentMethod") {
    setInvoiceInputHandler({
      ...invoiceInputHandler,
      [item]: e,
    });
  } else if (item === "date") {
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
      const data = [...invoiceInputHandler?.invoiceData];
      const index = data.findIndex((item) => item?.id == record.id);
      data.splice(index, 1, {
        ...data[index],
        quantity:
          item == "plus"
            ? data[index]?.quantity + 1
            : data[index]?.quantity > 1 && data[index]?.quantity - 1,
      });
      setInvoiceInputHandler({ ...invoiceInputHandler, invoiceData: data });
    }
  };

  const skuSearchHandler = async (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const getProductData = async () => {
    const trimSearch = search?.trim();
    try {
      const data = { sku: trimSearch };
      const res = await dispatch(productBySkuAsync({ data })).unwrap();
    } catch (error) {
          // toast.error("Something went wrong. Please try again.");  
    }
  };

  const previewPdf = async () => {
    try {
      const item = invoiceInputHandler?.invoiceData?.map((item) => {
        return { sku: item?.sku, quantity: item?.quantity };
      });
      if(item?.length==0) return toast.error("Please Add Item!")
      const data = {
        name: invoiceInputHandler?.name,
        mobile: invoiceInputHandler?.mobile,
        address: invoiceInputHandler?.address,
        exhibitionPlace: invoiceInputHandler?.exhibitionPlace,
        eventType: invoiceInputHandler?.eventType,
        date: invoiceInputHandler?.date,
        discount: invoiceInputHandler?.discount,
        paymentMethod: invoiceInputHandler?.paymentMethod,
        items: item,
      };
      const res = await previewPdfHandler(data);
      setIsLoading(false);
    } catch (error) {
      toast.error("Something went wrong. Please try again."); 
      setIsLoading(false);
    }
  };

  const addSkuHandler = (item) => {
    setSearch("");
    const data = { ...item, quantity: 1 };
    if (
      invoiceInputHandler.invoiceData.some(
        (product) => product?.sku == item?.sku
      )
    ) {
      return toast.error("Item already exist");
    } else {
      setInvoiceInputHandler({
        ...invoiceInputHandler,
        invoiceData: [...invoiceInputHandler?.invoiceData, data],
      });
      dispatch(addSku([]));
    }
  };
  const generateInvoiceHandler = async () => {
    setIsLoading(true);
    if (
      invoiceInputHandler?.name == "" ||
      invoiceInputHandler?.mobile == "" ||
      invoiceInputHandler?.address == "" ||
      invoiceInputHandler?.exhibitionPlace == "" ||
      invoiceInputHandler?.eventType == "" ||
      invoiceInputHandler?.date == "" ||
      invoiceInputHandler?.paymentMethod == "" ||
      invoiceInputHandler?.invoiceData?.length == 0
    ) {
      setIsLoading(false);
     return toast.error("please Enter all required field");
    }
    try {
      const item = invoiceInputHandler?.invoiceData?.map((item) => {
        return { sku: item?.sku, quantity: item?.quantity };
      });
      const data = {
        name: invoiceInputHandler?.name,
        mobile: invoiceInputHandler?.mobile,
        address: invoiceInputHandler?.address,
        exhibitionPlace: invoiceInputHandler?.exhibitionPlace,
        eventType: invoiceInputHandler?.eventType,
        date: invoiceInputHandler?.date,
        discount: invoiceInputHandler?.discount,
        paymentMethod: invoiceInputHandler?.paymentMethod,
        items: item,
      };
      const res = await generateInvoice(data);
      if (res.success) {
        toast.success(res?.message);
        setIsLoading(false);
        navigate("/admin/order")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    }
  };

  const removeproductHandler = (item) => {
    const data = [...invoiceInputHandler?.invoiceData];
    const index = data.findIndex((product) => product?.id == item.id);
    data.splice(index, 1);
    setInvoiceInputHandler({ ...invoiceInputHandler, invoiceData: data });
  };


  const cancelInvoiceHandler = () => {
    setInvoiceInputHandler({
      name: "",
      mobile: "",
      address: "",
      exhibitionPlace: "",
      eventType: "",
      date: dayjs().format("YYYY-MM-DD"),
      discount: "",
      paymentMethod: "cash",
      invoiceData: [],
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
;
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
    setInvoiceInputHandler({ ...invoiceInputHandler, invoiceData: [] });
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
            value={"Order Management → Generate Invoice Instants"}
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
                name="name"
                onchange={(e) => {
                  invoiceInputDataHandler(e);
                }}
                value={invoiceInputHandler?.name}
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
                name="mobile"
                onchange={(e) => {
                  invoiceInputDataHandler(e);
                }}
                value={invoiceInputHandler?.mobile}
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
                Address
              </Typography.Text>
              <CustomSelect
                mode="tags"
                options={previosAddressDataOption ?? []}
                placeholder="Enter Address"
                onchange={(valueArr) => {
                  const value = valueArr?.[valueArr?.length - 1] || "";
                  setInvoiceInputHandler((prev) => ({
                    ...prev,
                    address: value,
                  }));
                }}
                value={
                  invoiceInputHandler?.address
                    ? [invoiceInputHandler?.address]
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
                    exhibitionPlace: value,
                  }));
                }}
                value={
                  invoiceInputHandler?.exhibitionPlace
                    ? [invoiceInputHandler?.exhibitionPlace]
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
                value={invoiceInputHandler?.eventType ? [invoiceInputHandler?.eventType]: []}
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
  value={invoiceInputHandler?.date ? dayjs(invoiceInputHandler.date) : null}
  onChange={(date) => {
    setInvoiceInputHandler((prev) => ({
      ...prev,
      date: date ? date.format("YYYY-MM-DD") : "",
    }));
  }}
/>
            </div>
          </Col>
        </Row>
        <Row gutter={40}>
          <Col span={12}>
            <div className="flex flex-col gap-2">
              <Typography.Text className="text-[#214344] !font-[600] !text-[14px] ">
                Discount
              </Typography.Text>
              <CustomInput
                name="discount"
                type={"number"}
                onchange={(e) => {
                  invoiceInputDataHandler(e);
                }}
                value={invoiceInputHandler?.discount}
                className="rounded-full !border-[#214344] "
                placeholder="Enter Discount in %"
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
                    invoiceInputDataHandler(e, "paymentMethod");
                  }}
                  value={invoiceInputHandler?.paymentMethod}
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
                placeholder="Please Entert SKU"
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
          <Col span={24}>
            <CustomTable
            scroll={{x:1200}}
              pagination={false}
              columns={columns}
              dataSource={invoiceInputHandler?.invoiceData}
            />
            {invoiceInputHandler?.invoiceData?.length > 0 && (
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
                {invoiceInputHandler?.discount != "" && (
                  <Row justify={"end"}>
                    <Col span={12}>
                      <Typography.Text className="text-[16px] font-[500] text-[#214344]">
                        Discount
                      </Typography.Text>
                    </Col>
                    <Col span={12}>
                      <Typography.Text className="!text-end">
                        {invoiceInputHandler?.discount} %
                      </Typography.Text>
                    </Col>
                  </Row>
                )}
                <Row justify={"end"}>
                  <Col span={12}>
                    <Typography.Text className="text-[16px] font-[500] text-[#214344]">
                      Total
                    </Typography.Text>
                  </Col>
                  <Col span={12}>
                    <Typography.Text className="!text-end">
                      Rs. {discountPrice}
                    </Typography.Text>
                  </Col>
                </Row>
              </div>
            )}
            <div className="flex justify-center gap-3 py-5">
              <Button
                onClick={() => {
                  previewPdf();
                }}
                className="!bg-[#214344] !text-[#fff] !rounded-full !w-[250px] !text-[16px] py-3 "
                htmlType="submit"
              >
                Preview and Print
              </Button>
              <Button
                onClick={() => {
                  cancelInvoiceHandler();
                }}
                className=" !text-[#214344] !border-[#214344] !rounded-full !w-[250px] !text-[16px] py-3"
              >
                Cancel
              </Button>
            </div>
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
          </Col>
        </Row>
      </div>
    </>
  );
};

export default GenerateInvoiceForm;
