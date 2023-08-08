import React, { useState, useEffect } from 'react';
import SearchBar from '../Search/SearchBar';
import './table.css';

// function for formatting number.
const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
};

const App = () => {
  // state declarations for setting branch data
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // state declaration for controlling search term value.
  const [searchTerm, setSearchTerm] = useState('');
  // total revenue variable
  const totalRevenue = filteredData.reduce((total, product) => total + product.revenue, 0);

  // calling api for getting branch details json.
  useEffect(() => {
    // Fetch data for all branches
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          fetch('api/branch1.json'),
          fetch('api/branch2.json'),
          fetch('api/branch3.json')
        ]);

        const branchData = await Promise.all(responses.map((response) => response.json()));
        const mergedData = mergeBranchData(branchData);
        setData(mergedData);
        setFilteredData(mergedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // function for merging branch data and calculating the total revenue based on unit price and product sold
  const mergeBranchData = (branchData) => {
    const mergedData = {};

    branchData.forEach((branch) => {
      branch.products.forEach((product) => {
        if (mergedData[product.name]) {
          mergedData[product.name].revenue += product.unitPrice * product.sold;
        } else {
          mergedData[product.name] = {
            name: product.name,
            revenue: product.unitPrice * product.sold
          };
        }
      });
    });

    return Object.values(mergedData);
  };

  // function for handling search, based on search term this function will filter the data
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filteredProducts = data.filter((product) =>
      product.name.toLowerCase().includes(searchTerm)
    );
    setFilteredData(filteredProducts);
  };

  // jsx
  return (
    <div className="app-container">
      <h1>Product Revenue Table</h1>
      <SearchBar onChange={handleSearch} value={searchTerm} />
      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((product) => (
              <tr key={product.name}>
                <td>{product.name}</td>
                <td>{formatNumber(product.revenue)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total Revenue</td>
              <td>{formatNumber(totalRevenue)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default App;
