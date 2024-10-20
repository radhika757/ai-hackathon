import AdminContent from "./components/AdminContent";
import UserContent from "./components/UserContent";
import "./App.css";

import {  Tabs } from "antd";


function App() {
  const { TabPane } = Tabs;

  return (
    <div style={{ padding: '20px' }}>
    <Tabs defaultActiveKey="admin">
      <TabPane tab="Admin" key="admin">
        <AdminContent />
      </TabPane>
      <TabPane tab="User" key="user">
        <UserContent />
      </TabPane>
    </Tabs>
  </div>
  );
}

export default App;
