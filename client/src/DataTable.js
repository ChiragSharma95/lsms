import React, { useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import { fetchBrands, fetchTypes, fetchSalesData, fetchSalesDataByDate } from './api/api';
import BasicDatePicker from './components/BasicDatePicker';
import Button from '@mui/material/Button';

const DataTable = () => {
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
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

  function formatData(brands, types, salesData){
    if (brands.length > 0 && types.length > 0 && salesData.length > 0) {
        const formattedData = salesData.map(data => {
          const brand = brands.find(brand => brand.id === data.brandId);
          const type = types.find(type => type.id === data.typeId);
  
          return {
            date: data.date,
            brand: brand ? brand.name : '',
            type: type ? type.name : '',
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
        return formattedData;
  }
}
    
    useEffect(() => {

    const formattedData = formatData(brands, types, salesData)

    setFormattedData(formattedData);
    }, [brands, types, salesData]);

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  const handleFetchData = async () => {
    setLoading(true);
    try {
      console.log('selectedDate inside handleFetchData:', `${String(selectedDate.$y)}-${String((selectedDate.$M < 10) ? ('0'+ (selectedDate.$M + 1)) : (selectedDate.$M + 1))}-${String((selectedDate.$D < 10) ? ('0'+ (selectedDate.$D)) : (selectedDate.$D))}`);
      const formattedDate = `${String(selectedDate.$y)}-${String((selectedDate.$M < 10) ? ('0'+ (selectedDate.$M + 1)) : (selectedDate.$M + 1))}-${String((selectedDate.$D < 10) ? ('0'+ (selectedDate.$D)) : (selectedDate.$D))}`;
      const filteredData = await fetchSalesDataByDate(formattedDate);
      console.log('filteredData inside handleFetchData', filteredData);
      var dateWiseData = [];
      Object.keys(filteredData).forEach(key => {
        if(filteredData[key].date === formattedDate)
        {
            // console.log('key: ', key); 
            // console.log('value: ', filteredData[key].date); 
            dateWiseData.push(filteredData[key]);
        }
      });

      console.log('dateWiseData: ', dateWiseData); 

      setSalesData(dateWiseData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

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
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
            <label style={{ margin: '10px', textAlign: 'center', alignItems: 'center' }} htmlFor="date">Select Date:</label>
            <BasicDatePicker value={selectedDate} onChange={handleDateChange} style={{ margin: '10px', textAlign: 'center', alignItems: 'center' }} />
            <Button variant="contained" color="primary" onClick={handleFetchData} style={{ height: '100%', margin: '10px', textAlign: 'center', alignItems: 'center' }}>
            Fetch Data
            </Button>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <MUIDataTable
          title="Sales Data"
          data={formattedData}
          columns={columns}
          options={options}
        />
      )}
    </div>
  );
};

export default DataTable;