import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as OrderService from "../../service/orderService";
import Loading from "../../components/common/Loading";
import Footer from "../../components/Layout/Footer";
import { Button, Modal, Rate } from "antd";
import TextArea from "antd/es/input/TextArea";
import { toast } from "react-toastify";
import * as ProductService from "../../service/productService";
import { useDispatch } from "react-redux";
import { getAllProductRd } from "../../redux/action/productAction";
import { FaArrowLeftLong } from "react-icons/fa6";

function InfomationOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [orders, setOrders] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderCart, setOrderCart] = useState();
  const [showModalCancel, setShowModalCancel] = useState(false);
  const [showModalReview, setShowModalReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [priceProduct, setPriceProduct] = useState(0);
  const getOrder = async () => {
    try {
      setIsLoading(true);
      const res = await OrderService.getAOrder(id);
      setIsLoading(false);

      setOrders(res.order);
    } catch (err) {
      console.error("Error fetching order:", err);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      getOrder();
    }
  }, [id]);
  useEffect(() => {
    if (orders && orders !== null) {
      const data = orders?.cart.map((order) => {
        return {
          id: order._id,
          name: order?.name,
          price: order?.price,
          quantity: order?.quantity,
          image: order?.image,
        };
      });
      setOrderCart(data);
    }
  }, [orders]);

  const handleCancelOrder = async () => {
    const id = orders._id;
    const status = {
      status: "Cancel",
    };
    const res = await OrderService.cancelOrder(id, status);
    if (res.success) {
      dispatch(getAllProductRd());
      navigate(`/profile?${2}`);
    }
  };
  const handleCancel = () => {
    setShowModalCancel(false);
    setShowModalReview(false);
  };

  const okButtonDelete = {
    style: {
      color: "red",
      border: "1px solid #ccc",
    },
  };
  const handleCreateReview = async () => {
    setShowModalReview(false);
    if (!rating || !comment) {
      toast.warning("Hãy nhập đầy đủ thông tin");
    } else {
      const review = {
        _id: orders._id,
        user: orders.user,
        comment: comment,
        rating: rating,
        cart: orders.cart,
      };
      const res = await ProductService.reviewProduct(review);
      if (res.success) {
        dispatch(getAllProductRd());
        toast.success("Đánh giá thành công");
        getOrder();
        localStorage.setItem("hasReviewed", review._id);
      }
    }
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };
  useEffect(() => {
    const total = orders?.cart.reduce((acc, item) => {
      const price = isNaN(item.price) ? 0 : item.price;
      const quantity = isNaN(item.quantity) ? 0 : item.quantity;
      return acc + price * quantity;
    }, 0);

    setPriceProduct(total);
  }, [orders]);
  const handleNavigateOrder = () => {
    navigate(`/profile?${2}`);
  };
  return (
    <Loading isLoading={isLoading}>
      <div className="bg-[#f4f1f4]">
        <div className="w-full p-5 px-[10%]">
          <div
            className=" flex  items-center pb-2 cursor-pointer hover:text-[#009b49] w-[10%]"
            onClick={handleNavigateOrder}
          >
            <FaArrowLeftLong className="text-[18px]" />
            <p className="px-1 font-[500] text-[18px] md:block hidden">
              Trở lại
            </p>
          </div>
          {orderCart?.length > 0 ? (
            <div>
              {orderCart.map((item) => {
                return (
                  <div key={item.id} className="flex border-t py-2">
                    <div className="md:w-[10%] w-[30%]">
                      <img
                        src={item.image}
                        alt=""
                        className="md:w-[80px] md:h-[80px] w-[60px] h-[60px] "
                      />
                    </div>
                    <div className="md:w-[90%] w-[70%] flex md:items-center md:justify-between  flex-col md:flex-row ">
                      <p className=" text-[100%] px-4 md:w-[30%] ">
                        {item.name}
                      </p>
                      <div className="flex items-center md:justify-center  ml-2 md:w-[50%]  ">
                        <p className=" text-[100%] px-2">Số lượng:</p>
                        <p className="px-2  text-[100%]">{item.quantity}</p>
                      </div>
                      <div className="flex md:items-center md:justify-center  ml-2 md:w-[30%] ">
                        <p className=" text-[100%] px-2">Giá tiền:</p>
                        <p className=" text-[100%]">
                          {`${(isNaN(item.price) || isNaN(item.quantity)
                            ? 0
                            : item.price * item.quantity
                          ).toLocaleString()} đ`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
        <div className="w-auto  items-center bg-white px-[10%] my-2  md:flex md:justify-between">
          <div>
            <p className=" text-[100%] font-[600] pt-2 ">Chi tiết thanh toán</p>
            <div className="flex items-center pt-2">
              <p className=" text-[100%] font-[600] pr-2">Giá sản phẩm:</p>
              <p className=" text-[100%] font-[600]  text-red-600">
                {priceProduct?.toLocaleString()} đ
              </p>
            </div>

            <div className="flex items-center pt-2">
              <p className=" text-[100%] font-[600] pr-2">Thành tiền:</p>
              <p className=" text-[100%] font-[600]  text-red-600">
                {orders?.totalPrice.toLocaleString()} đ
              </p>
            </div>
          </div>
          <div className="bg-[#0e9c49] text-white rounded">
            {orders?.status === "Processing" ? (
              <p className="px-2 py-1  text-[100%] font-[600]">Chờ xử lý</p>
            ) : orders?.status === "Transferred" ? (
              <p className="px-2 py-1  text-[100%] font-[600]">
                Đang vận chuyển
              </p>
            ) : (
              <p className="px-2 py-1  text-[100%] font-[600]">Đã giao hàng</p>
            )}
          </div>
        </div>
        {orders?.status === "Delivered" && (
          <div className="w-auto items-center bg-white px-[10%] my-1 md:flex md:justify-between">
            {orders?.status === "Delivered" && !orders?.iscomment ? (
              <div className="bg-[#0e9c49] text-white rounded flex justify-center items-center my-2">
                <button
                  className=" text-[100%] font-[600] px-2 py-1 "
                  onClick={() => setShowModalReview(true)}
                >
                  Đánh giá
                </button>
              </div>
            ) : (
              <div className="bg-[#0e9c49] text-white rounded flex justify-center items-center my-2">
                <p className=" text-[100%] font-[600] px-2 py-1 ">
                  Đã đánh giá
                </p>
              </div>
            )}
          </div>
        )}{" "}
        {orders?.status === "Processing" &&
        orders.paymentInfo.type !== "onlinePayment" ? (
          <div className="w-auto  items-center bg-white px-[10%] my-1  md:flex md:justify-between">
            <div className="bg-red-600 text-white rounded flex justify-center items-center my-2">
              <button
                className=" text-[100%] font-[600] px-2 py-1 "
                onClick={() => setShowModalCancel(true)}
              >
                Hủy đơn
              </button>
            </div>
          </div>
        ) : null}
        <Footer />
        <Modal
          title="Hủy đơn"
          open={showModalCancel}
          onOk={handleCancelOrder}
          onCancel={handleCancel}
          okButtonProps={okButtonDelete}
          okType="none"
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Hủy
            </Button>,
            <Button key="submit" onClick={handleCancelOrder}>
              Xác nhận
            </Button>,
          ]}
        >
          <p>{`Bạn có muốn chăc hủy đơn này?`} </p>
        </Modal>
        <Modal
          title="Đánh giá"
          open={showModalReview}
          onOk={handleCreateReview}
          onCancel={handleCancel}
          width={600}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Hủy
            </Button>,
            <Button key="submit" onClick={() => handleCreateReview(rating)}>
              Gửi đánh giá
            </Button>,
          ]}
        >
          <div>
            <div className="mb-2">
              <span>Đánh giá </span>
              <Rate
                className="pl-2"
                allowHalf
                onChange={handleRatingChange}
                value={rating}
              />
            </div>
            <TextArea
              placeholder="Hãy chia sẽ nhận xét của bạn"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></TextArea>
          </div>
        </Modal>
      </div>
      ;
    </Loading>
  );
}

export default InfomationOrder;
