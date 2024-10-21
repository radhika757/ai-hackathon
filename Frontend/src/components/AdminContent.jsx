import { useState } from "react";

import axios from "axios";
import { Button, Input, Select, Space, Spin, Table, Upload } from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";

const AdminContent = () => {
  const { Option } = Select;
  const [filterType, setFilterType] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [response, setResponse] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFilter = (value) => {
    setFilterType(value);
  };

  const handleSearch = async (value) => {
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
      setUploading(false);
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

  const handleSuggestions = async (itemCode, summary, rating) => {
    let prompt = "";
    try {
      if (rating < 4) {
        prompt = `Explain in 2-3 lines on how can the following product (ASIN: ${itemCode}) be improved based on this summary: "${summary}" and a rating of ${rating}?`;
      } else {
        prompt = `Explain in 2-3 lines on how I can make sell more of my already highest selling proudct (ASIN: ${itemCode}) summary: "${summary}" and a rating of ${rating}?`;
      }

      const response = await axios.post("http://localhost:3000/suggestions", {
        prompt,
      });

      const newSuggestion = response.data.suggestions;
      setSuggestions((prevSuggestions) => ({
        ...prevSuggestions,
        [itemCode]: newSuggestion,
      }));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

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
      render: (record) => {
        // Check if there is a suggestion for the current product (itemCode)
        const suggestion = suggestions[record.itemCode];

        return suggestion ? (
          <span style={{ backgroundColor: "Highlight" }}>{suggestion}</span>
        ) : (
          <Button
            type="primary"
            onClick={() =>
              handleSuggestions(
                record.itemCode,
                record.summary,
                record.averageRating
              )
            }
          >
            Suggestions
          </Button>
        );
      },
    },
  ];

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
