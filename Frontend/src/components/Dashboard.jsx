
import styles from '../styles/Dashboard.module.css';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Liked', value: 400 },
  { name: 'Disliked', value: 100 },
  { name: 'Neutral', value: 200 },
];

const COLORS = ['#0088FE', '#FF8042', '#FFBB28'];

function Dashboard() {
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
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.productDescription}>
        <h2>Product Description</h2>
        <h3>Revolutionary Smart Home Assistant</h3>
        <p>
        Mamaearth ubTAN Natural Face Wash is one the best product of Mama Earthand it Suits to every skin types, it helps in removing all signs of tan.
         Liquorice helps repair the sun damage caused by exposure to the harsh rays of the sun.
        </p>
        <h4>Key Features:</h4>
        <ul>
          <li>Highly dissatisfied with the product</li>
          <li>Very Satusfied with the face wash</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;