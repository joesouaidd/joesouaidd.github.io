import React, { createContext, useState, useContext } from "react";

// Create context
const TemperatureContext = createContext();

// Provide context to the app
export const TemperatureProvider = ({ children }) => {
  const [unit, setUnit] = useState("C"); // Default to Celsius

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "C" ? "F" : "C"));
  };

  return (
    <TemperatureContext.Provider value={{ unit, toggleUnit }}>
      {children}
    </TemperatureContext.Provider>
  );
};

// Custom hook to use temperature context
export const useTemperature = () => useContext(TemperatureContext);
