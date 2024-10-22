
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Liked', value: 400 },
  { name: 'Disliked', value: 100 },
  { name: 'Neutral', value: 200 },
];

const COLORS = ['#0088FE', '#FF8042', '#FFBB28'];

function Dashboard() {
  return (
    <div className="product-feedback">
      <div className="chart-container">
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
      <div className="product-description">
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
      <style>{`
        .product-feedback {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 1rem;
          font-family: Arial, sans-serif;
        }
        
        @media (min-width: 768px) {
          .product-feedback {
            flex-direction: row;
          }
        }
        
        .chart-container, .product-description {
          flex: 1;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 1rem;
        }
        
        h2 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        
        h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }
        
        h4 {
          font-size: 1rem;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        
        p {
          margin-bottom: 1rem;
        }
        
        ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }
        
        li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;