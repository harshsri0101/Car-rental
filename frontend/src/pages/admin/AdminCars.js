import React, { useEffect, useState } from "react";
import API from "../../services/api";

const getCarPrice = (car) => Number(car?.pricePerDay ?? car?.price);

export default function AdminCars() {
  const [cars, setCars] = useState([]);

  const fetchCars = async () => {
    const res = await API.get("/cars");
    setCars(res.data);
  };

  const deleteCar = async (id) => {
    await API.delete(`/cars/${id}`);
    fetchCars();
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div style={styles.container}>
      <h2>All Cars</h2>

      {cars.map((car) => (
        <div key={car._id} style={styles.card}>
          <img src={car.image} alt={car.name} width="150" />
          <h3>{car.name}</h3>
          <p>{car.brand}</p>
          <p>Rs. {Number.isFinite(getCarPrice(car)) ? getCarPrice(car) : "--"}</p>

          <button onClick={() => deleteCar(car._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  card: {
    border: "1px solid #ccc",
    padding: "15px",
    margin: "10px",
  },
};
