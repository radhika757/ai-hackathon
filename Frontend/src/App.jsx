import { useState } from "react";
import AdminContent from "./components/AdminContent";
import UserContent from "./components/UserContent";
import Dashboard from "./components/Dashboard";
import "./App.css";

import { Tabs } from "antd";

function App() {
  const { TabPane } = Tabs;
  const [response, setResponse] = useState("");

  return (
    <div style={{ padding: "20px" }}>
      <Tabs defaultActiveKey="admin">
        <TabPane tab="Admin" key="admin">
          <AdminContent response={response} setResponse={setResponse} />
        </TabPane>
        <TabPane tab="User" key="user">
          <UserContent />
        </TabPane>
      </Tabs>
      {response && <Dashboard />}
    </div>
  );
}

export default App;
