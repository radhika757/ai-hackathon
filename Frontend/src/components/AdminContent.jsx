import { useState } from "react";
import { data } from "../dummyData/dummyData";

import axios from "axios";
import { Button, Input, Select, Space, Spin, Table, Upload } from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";

const columns = [
  {
    title: "Number",
    dataIndex: "number",
    key: "number",
    sorter: (a, b) => a.number - b.number,
  },
  {
    title: "Item Code",
    dataIndex: "itemCode",
    key: "itemCode",
  },
  {
    title: "Product Name",
    dataIndex: "productName",
    key: "productName",
  },
  {
    title: "Manufacturing Date",
    dataIndex: "manufacturingDate",
    key: "manufacturingDate",
    sorter: (a, b) =>
      new Date(a.manufacturingDate) - new Date(b.manufacturingDate),
  },
  {
    title: "Rating",
    dataIndex: "rating",
    key: "rating",
    sorter: (a, b) => a.rating - b.rating,
  },
  {
    title: "Review",
    dataIndex: "review",
    key: "review",
  },
  {
    title: "Action",
    key: "action",
    render: () => <Button type="primary">Suggestions</Button>,
  },
];

const AdminContent = () => {
  const { Option } = Select;
  const [filterType, setFilterType] = useState("");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [uploading, setUploading] = useState(false);

  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (val) =>
        typeof val === "string" &&
        val.toLowerCase().includes(prompt.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (filterType === "mostSold") return b.number - a.number;
    if (filterType === "leastSold") return a.number - b.number;
    if (filterType === "highestRated") return b.rating - a.rating;
    if (filterType === "lowestRated") return a.rating - b.rating;
    return 0;
  });

  const handleFilter = (value) => {
    setFilterType(value);
  };

  const handleSearch = async (value) => {
    setPrompt(value);
    try {
      const result = await axios.post("http://localhost:3000/generate", {
        prompt: value,
      });

      console.log(result.data);
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error generating response.");
    }
  };

  const handleUpload = async ({ file }) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Response:", response.data);
      setResponse(response.data);
      setUploading(false)
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search"
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
          disabled={!response}
        />
        <Select
          style={{ width: 200 }}
          placeholder="Filter"
          onChange={handleFilter}
          disabled={!response}
        >
          <Option value="mostSold">Most Sold</Option>
          <Option value="leastSold">Least Sold</Option>
          <Option value="highestRated">Highest Rated</Option>
          <Option value="lowestRated">Lowest Rated</Option>
        </Select>
      </Space>

      {uploading ? (
        <Space>
          <Spin />
        </Space>
      ) : response ? (
        <Table columns={columns} dataSource={sortedData} />
      ) : (
        <div
          style={{
            border: "2px dashed #d9d9d9",
            borderRadius: "8px",
            padding: "40px",
            textAlign: "center",
          }}
        >
          <Upload customRequest={handleUpload} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </div>
      )}
    </div>
  );
};

export default AdminContent;
