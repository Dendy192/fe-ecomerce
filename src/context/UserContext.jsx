import React, { createContext, useContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = (props) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  // Function to update form data
  const updateFormData = (data) => {
    setFormData((prevState) => ({ ...prevState, ...data }));
  };

  const value = {
    formData,
    updateFormData,
  };
  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};
export default UserProvider;
