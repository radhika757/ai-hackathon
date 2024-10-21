import { useState } from "react";

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
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Average Rating",
    dataIndex: "averageRating",
    key: "averageRating",
    sorter: (a, b) => a.rating - b.rating,
  },
  {
    title: "Review Summary",
    dataIndex: "summary",
    key: "summary",
  },
  {
    title: "Action",
    key: "action",
    render: () => <Button type="primary">Suggestions</Button>,
  },
];

const AdminContent = () => {
  const { Option } = Select;
    const [filterType, setFilterType] = useState("highestRated");
  //   const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [uploading, setUploading] = useState(false);


    const handleFilter = (value) => {
      setFilterType(value);
    };

  const handleSearch = async (value) => {
    // setPrompt(value);
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
      setResponse(response.data);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false)
    }
  };

  const tableData = Array.isArray(response) 
  ? response.map((item, index) => ({
      ...item,
      number: index + 1,
      key: index,
    }))
  : [];

  const sortedData = [...tableData].sort((a, b) => {
    if (filterType === "highestRated") return b.averageRating - a.averageRating;
    if (filterType === "lowestRated") return a.averageRating - b.averageRating;
    return 0;
  });
  
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
