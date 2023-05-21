export const fetchBrands = async () => {
    return await fetch("data/brands.json", {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    })
      .then((response) => {
        const data = response.json();
        // console.log(data);
        return data;
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
        return [];
      });
  };
  
  export const fetchTypes = async () => {
    return await fetch("data/types.json", {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    })
      .then((response) => {
        const data = response.json();
        // console.log(data);
        return data;
      })
      .catch((error) => {
        console.error("Error fetching types:", error);
        return [];
      });
  };
  
  export const fetchSalesData = async () => {
    return await fetch("data/salesData.json", {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    })
      .then((response) => {
        const data = response.json();
        // console.log(data);
        return data;
      })
      .catch((error) => {
        console.error("Error fetching liquor data:", error);
        return [];
      });
  };
  