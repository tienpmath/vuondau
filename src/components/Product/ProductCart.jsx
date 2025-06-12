import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import Rating from "../Rating";
function ProductCart(item) {
  const navigate = useNavigate();
  const handleClick = (e) => {
    navigate(`/product/details/${e.item._id}`);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const productPrice = item?.item?.price * (1 - item?.item?.distCount / 100);
  return (
    <div
      className=" shadow hover:shadow-[#0e9c49] border hover:-translate-y-1 cursor-pointer bg-white"
      onClick={() => handleClick(item)}
    >
      <div className="relative py-2">
        <div className=" lg:h-[24vh] sm:h-[16vh] md:h-[18vh]  flex justify-center">
          <img
            src={item?.item?.images[0].url}
            alt=""
            className=" h-[140px] md:w-full object-contain w-[100px]"
          />
        </div>
        {item?.item?.gifts?.length > 0 ? (
          <div className="bg-[#ee4d2d] z-1 md:w-[36%] py-3 w-[40%] absolute h-[10%] left-[-8px] text-white top-0 flex flex-col justify-center text-center font-[600]  rounded-r">
            <span className="md:text-[80%] text-[60%] ">Khuyến mãi</span>
            <span
              className="absolute w-[8px]"
              style={{
                borderWidth: "  8px 0px 0px 8px",
                borderColor: "#a92d05 transparent transparent transparent",
                bottom: "-8px",
              }}
            />
          </div>
        ) : null}
        {item?.item?.quantity === 0 && (
          <div className="text-red-500 font-[500] flex justify-center items-center absolute w-full">
            Tạm hết hàng
          </div>
        )}
        {item?.item?.distCount ? (
          <div className="bg-yellow-500 z-1 w-[20%] absolute h-[22%] right-0 text-white top-0 flex flex-col justify-center text-center font-[600] ">
            <span className="md:text-[80%] text-[60%]">Giảm</span>
            <span className="md:text-[80%] text-[60%]">
              {item.item.distCount} %
            </span>
            <span
              className="absolute w-full"
              style={{
                borderWidth: "0  8px 6px",
                borderColor: "transparent  #eab308 transparent  #eab308",
                bottom: "-5px",
              }}
            />
          </div>
        ) : null}
      </div>
      <div className="flex flex-col my-[6%] md:h-[10vh]  text-[80%] md:text-[100%] px-2">
        <div className=" flex justify-center font-[500]  text-[100%] md:text-[100%] py-1">
          <p>
            {item.item.name.length > 20
              ? item.item.name.slice(0, 20) + "..."
              : item.item.name}{" "}
          </p>
        </div>
        {item?.item.ratings ? (
          <div className="flex justify-between">
            {item?.item.ratings && <Rating rating={item?.item.ratings} />}
            <span className="text-[12px] flex justify-end">
              Đã bán {item.item.sold_out}
            </span>
          </div>
        ) : (
          <div className="flex justify-end">
            <span className="text-[12px] flex justify-end">
              Đã bán {item.item.sold_out}
            </span>
          </div>
        )}
        <div className="flex justify-between font-[500]   md:text-[80%] md:px-[4%] items-center">
          <div className="md:flex py-1">
            {item?.item?.distCount > 0 && (
              <p className="text-red-600 line-through pr-2 text-[10px]">
                {item.item.price.toLocaleString()}đ
              </p>
            )}
            <p>{productPrice.toLocaleString()}đ</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCart);
