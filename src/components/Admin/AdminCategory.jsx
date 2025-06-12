import React, { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../common/Table";
import { Button, Modal, Space } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { AiOutlineCloudUpload } from "react-icons/ai";
import * as CategoryService from "../../service/categoryService";
import { toast } from "react-toastify";
import { getCaterogy } from "../../redux/action/cateroryAction";
import { handleOnchangeImage } from "../../until";
function AdminCategory() {
  const { data } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const searchInput = useRef(null);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [idCategory, setIdCategory] = useState("");
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [editcategory, setEditCategory] = useState({
    name: "",
    images: null,
  });
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tải lại
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(function () {
          if (searchInput.current) {
            searchInput.current.select();
          }
        }, 100);
      }
    },
  });
  const renderAction = (text, item) => {
    return (
      <div className="flex">
        <div
          className="mx-1 cursor-pointer"
          onClick={() => {
            setShowModalDelete(true);
            setIdCategory(item._id);
          }}
        >
          <DeleteOutlined className="text-red-600 border border-[red] py-2 px-1 rounded-[4px]" />
        </div>
        <div
          className="mx-1 cursor-pointer"
          onClick={() => {
            setShowModalEdit(true);
            setIdCategory(item._id);
            setEditCategory({
              name: item.name,
              images: item.images[0].url,
            });
          }}
        >
          <EditOutlined className="text-green-600 border border-[green] py-2 px-1 rounded-[4px]" />{" "}
        </div>
      </div>
    );
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
    },

    {
      title: "Ảnh",
      dataIndex: "image",
      render: (text, record) => (
        <img
          src={record.image}
          alt="Product"
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  let dataTable = [];
  if (data && data?.categories) {
    dataTable = data.categories.map((item, index) => {
      return {
        ...item,
        stt: index + 1,
        image: item.images[0].url,
      };
    });
  }
  const handleAddCategory = async () => {
    if (!name || !selectedImage) {
      toast.warning("Xin hãy nhập đầy đủ thông tin");
    } else {
      setIsLoading(true);
      setShowModalAdd(false);
      const category = {
        name,
        images: selectedImage,
      };
      const res = await CategoryService.createCategory(category);
      if (res.success) {
        toast.success("Tạo danh mục thành công");
        dispatch(getCaterogy());
      } else {
        toast.error("Đã có lỗi xảy ra");
      }
      setName("");
      setSelectedImage(null);
      setIsLoading(false);
    }
  };
  const handleCancel = () => {
    setShowModalAdd(false);
    setShowModalDelete(false);
    setShowModalEdit(false);
    setSelectedImage(null);
  };
  const handleDelete = async () => {
    setShowModalDelete(false);
    setIsLoading(true);
    const res = await CategoryService.deleteCategory(idCategory);
    if (res.success) {
      dispatch(getCaterogy());
      toast.success("Xóa danh mục thành công");
    } else {
      toast.error("Đã có lỗi xảy ra");
    }
    setIsLoading(false);
  };
  const okButtonAdd = {
    style: {
      color: "green",
      border: "1px solid #ccc",
    },
  };
  const okButtonDelete = {
    style: {
      color: "red",
      border: "1px solid #ccc",
    },
  };
  useEffect(() => {
    dispatch(getCaterogy());
  }, []);
  useEffect(() => {
    if (selectedImage) {
      setEditCategory({
        ...editcategory,
        images: selectedImage,
      });
    }
  }, [selectedImage]);
  const handleEditCategory = async () => {
    try {
      setShowModalEdit(false);
      setIsLoading(true);
      const res = await CategoryService.updateCategory(
        idCategory,
        editcategory
      );
      setIsLoading(false);
      if (res.success) {
        toast.success("Cập nhật danh mục thành công");
        dispatch(getCaterogy());
      }
    } catch (e) {
      setIsLoading(false);
      dispatch(getCaterogy());
    }
  };
  return (
    <div className="w-full flex flex-col">
      <div className=" flex  md:flex-row m-2 justify-between">
        <span
          className="border-[2px] flex justify-center rounded cursor-pointer items-center px-2 py-1 bg-red-500  text-white"
          onClick={() => setShowModalAdd(true)}
        >
          <AiOutlineCloudUpload className="md:text-[30px] text-[20px]" />
          <h2 className="font-[600] px-1 ">Tạo mới</h2>
        </span>
      </div>

      <TableComponent
        columns={columns}
        data={dataTable}
        isLoading={isLoading}
      />
      <Modal
        title="Thêm danh mục"
        open={showModalAdd}
        onOk={handleAddCategory}
        onCancel={handleCancel}
        okButtonProps={okButtonAdd}
        okType="none"
      >
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Tên</p>
          <input
            value={name}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên danh mục..."
          />
        </label>

        <label className="flex items-center my-8 w-[30%] ">
          <label
            htmlFor="inport"
            className="bg-[#0e9c49] text-white font-[500] hover:bg-[#2b4706] p-1 rounded-[4px] mx-2 px-2"
          >
            Ảnh
          </label>
          <input
            id="inport"
            type="file"
            hidden
            onChange={(e) => handleOnchangeImage(e, setSelectedImage)}
          />
          {selectedImage ? (
            <img
              className="w-[40px] h-[40px] object-cover rounded-full"
              src={selectedImage}
              alt=""
              value={selectedImage}
            />
          ) : null}
        </label>
      </Modal>
      <Modal
        title="Chỉnh sửa danh mục"
        open={showModalEdit}
        onOk={handleEditCategory}
        onCancel={handleCancel}
        okButtonProps={okButtonAdd}
        okType="none"
      >
        <label className="flex justify-between items-center">
          <p className="w-[20%] font-[500]">Tên</p>
          <input
            value={editcategory.name}
            className="w-[80%] md:px-4  h-auto my-1 py-2 border-[2px] sm:px-0 rounded-[4px]"
            onChange={(e) =>
              setEditCategory({ ...editcategory, name: e.target.value })
            }
            placeholder="Nhập tên danh mục..."
          />
        </label>

        <label className="flex items-center my-8 w-[30%] ">
          <label
            htmlFor="inport"
            className="bg-[#0e9c49] text-white font-[500] hover:bg-[#2b4706] p-1 rounded-[4px] mx-2 px-2"
          >
            Ảnh
          </label>
          <input
            id="inport"
            type="file"
            hidden
            onChange={(e) => handleOnchangeImage(e, setSelectedImage)}
          />
          {selectedImage ? (
            <img
              className="w-[40px] h-[40px] object-cover "
              src={selectedImage}
              alt=""
            />
          ) : (
            <img
              className="w-[50px] h-[50px]"
              src={editcategory.images}
              alt=""
            />
          )}
        </label>
      </Modal>
      <Modal
        title="Xóa danh mục"
        open={showModalDelete}
        onOk={handleDelete}
        onCancel={handleCancel}
        okButtonProps={okButtonDelete}
        okType="none"
      >
        <p>{`Bạn có muốn chăc xóa danh mục này?`} </p>
      </Modal>
    </div>
  );
}

export default memo(AdminCategory);
