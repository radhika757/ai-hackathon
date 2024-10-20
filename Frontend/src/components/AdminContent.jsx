import { data } from "../dummyData/dummyData";

import { Button, Input, Select, Space, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

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
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("");

  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (val) =>
        typeof val === "string" &&
        val.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (filterType === "mostSold") return b.number - a.number;
    if (filterType === "leastSold") return a.number - b.number;
    if (filterType === "highestRated") return b.rating - a.rating;
    if (filterType === "lowestRated") return a.rating - b.rating;
    return 0;
  });

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleFilter = (value) => {
    setFilterType(value);
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search"
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
        />
        <Select
          style={{ width: 200 }}
          placeholder="Filter"
          onChange={handleFilter}
        >
          <Option value="mostSold">Most Sold</Option>
          <Option value="leastSold">Least Sold</Option>
          <Option value="highestRated">Highest Rated</Option>
          <Option value="lowestRated">Lowest Rated</Option>
        </Select>
      </Space>
      <Table columns={columns} dataSource={sortedData} />
    </div>
  );
};

export default AdminContent;
