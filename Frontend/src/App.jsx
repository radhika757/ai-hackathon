import { useState } from "react";
import AdminContent from "./components/AdminContent";
import UserContent from "./components/UserContent";
import Dashboard from "./components/Dashboard";
import "./App.css";

import { Tabs } from "antd";

function App() {
  const { TabPane } = Tabs;
  const [response, setResponse] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="container">
      <Tabs defaultActiveKey="admin">
        <TabPane tab="Admin" key="admin">
          <AdminContent
            response={response}
            setResponse={setResponse}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
          />
        </TabPane>
        <TabPane tab="User" key="user">
          <UserContent />
        </TabPane>
      </Tabs>
      {selectedProduct && (
        <Dashboard
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />
      )}
    </div>
  );
}

export default App;
