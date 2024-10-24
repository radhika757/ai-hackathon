/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from '../styles/AdminContent.module.css';

import axios from "axios";
import { Button, Select, Space, Spin, Table, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const AdminContent = ({ response, setResponse }) => {
  const { Option } = Select;
  const [filterType, setFilterType] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleFilter = (value) => {
    setFilterType(value);
  };

  const handleUpload = async ({ file }) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/upload",
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
    setLoader(true);
    let prompt = "";
    try {
      if (rating < 4) {
        prompt = `Explain in 2-3 points on how can the following product (ASIN: ${itemCode}) be improved based on this summary: "${summary}" and a rating of ${rating}? Add the points in new line`;
      } else {
        prompt = `Explain in 2-3 points on how I can make sell more of my already highest selling proudct (ASIN: ${itemCode}) summary: "${summary}" and a rating of ${rating}? Add the points in new line`;
      }

      const response = await axios.post(
        "http://localhost:3000/api/suggestions",
        {
          prompt,
        }
      );
      setLoader(false);
      const newSuggestion = response.data.suggestions;
      setSuggestions((prevSuggestions) => ({
        ...prevSuggestions,
        [itemCode]: newSuggestion,
      }));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setLoader(false);
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
      title: "Focus Areas",
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
            disabled={loader}
          >
            Suggestions
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <Space className={styles.filter}>
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
        <div
         className={styles.spinner}
        >
          <Spin />
        </div>
      ) : response ? (
        <Table columns={columns} dataSource={sortedData} />
      ) : (
        <div
         className={styles.upload}
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
