import React, { useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import { fetchBrands, fetchTypes, fetchSalesData } from './api/api';

const DataTable = () => {
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsData, typesData, salesData] = await Promise.all([
          fetchBrands(),
          fetchTypes(),
          fetchSalesData(),
        ]);

        setBrands(brandsData);
        setTypes(typesData);
        setSalesData(salesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (brands.length > 0 && types.length > 0 && salesData.length > 0) {
        // console.log('Inside useEffect brands: ', brands);
        // console.log('Inside useEffect types: ', types);
        // console.log('Inside useEffect salesData: ', salesData);
        const formattedData = salesData.map(data => {
        const brand = brands.find((brand) => brand.id === data.brandId);
        const type = types.find((type) => type.id === data.typeId);

        return {
          date: data.date,
          brand: brand ? brand.name : "",
          type: type ? type.name : "",
          quantityBottle: data.quantity.bottle,
          quantityHalf: data.quantity.half,
          quantityQuarter: data.quantity.quarter,
          quantityNinety: data.quantity.ninety,
          soldBottle: data.sold.bottle,
          soldHalf: data.sold.half,
          soldQuarter: data.sold.quarter,
          soldNinety: data.sold.ninety,
          remainingBottle: data.quantity.bottle - data.sold.bottle,
          remainingHalf: data.quantity.half - data.sold.half,
          remainingQuarter: data.quantity.quarter - data.sold.quarter,
          remainingNinety: data.quantity.ninety - data.sold.ninety,
        };
      });

      console.log('Before setFormattedData: ', formattedData);
      setFormattedData(formattedData);
      console.log('After setFormattedData: ', formattedData);
    }
  }, [brands, types, salesData]);  

  const columns = [
    {
      name: "date",
      label: "Date",
    },
    {
      name: "brand",
      label: "Brand",
    },
    {
      name: "type",
      label: "Type",
    },
    {
      name: "quantityBottle",
      label: "Quantity (Bottle)",
    },
    {
      name: "quantityHalf",
      label: "Quantity (Half)",
    },
    {
      name: "quantityQuarter",
      label: "Quantity (Quarter)",
    },
    {
      name: "quantityNinety",
      label: "Quantity (Ninety)",
    },
    {
      name: "soldBottle",
      label: "Sold (Bottle)",
    },
    {
      name: "soldHalf",
      label: "Sold (Half)",
    },
    {
      name: "soldQuarter",
      label: "Sold (Quarter)",
    },
    {
      name: "soldNinety",
      label: "Sold (Ninety)",
    },
    {
      name: "remainingBottle",
      label: "Remaining (Bottle)",
    },
    {
      name: "remainingHalf",
      label: "Remaining (Half)",
    },
    {
      name: "remainingQuarter",
      label: "Remaining (Quarter)",
    },
    {
      name: "remainingNinety",
      label: "Remaining (Ninety)",
    },
  ];

  const options = {
    selectableRows: 'none',
    responsive: 'standard',
    onSearchChange: (searchText) => {
        console.log("search chirag: " + JSON.stringify(formattedData));
    }
  };

  console.log('Before Return: ', formattedData);

  return (
    <div>
      {loading ? (
        <p>Loading data...</p>
      ) : formattedData.length > 0 ? (
        <MUIDataTable
            title="Liquor Inventory"
            data={formattedData}
            columns={columns}
            options={options}
        />
      ): (
        <p>No data available.</p>
    )}
    </div>
  );
};

export default DataTable;