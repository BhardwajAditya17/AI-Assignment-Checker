import { useState } from "react";

const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setValues(initialValues);
  };

  const setFormValues = (newValues) => {
    setValues(newValues);
  };

  return {
    values,
    handleChange,
    resetForm,
    setFormValues,
  };
};

export default useForm;