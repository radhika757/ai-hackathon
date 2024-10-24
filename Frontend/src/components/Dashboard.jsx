/* eslint-disable react/prop-types */
import styles from "../styles/Dashboard.module.css";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#0088FE", "#FF8042", "#FFBB28"];

function Dashboard({ selectedProduct }) {  
  const data = [
    { name: "Liked", value: selectedProduct?.liked },
    { name: "Disliked", value: selectedProduct?.disliked },
    { name: "Neutral", value: selectedProduct?.neutral },
  ];

  return (
    <div className={styles.productFeedback}>
      <div className={styles.chartContainer}>
        <h2>Product Feedback</h2>
        <p>Customer opinions on our product</p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.productDescription}>
        <h2>Product Description</h2>
        <h3>{selectedProduct?.name}</h3>
        <p>
          {selectedProduct?.summary}
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
