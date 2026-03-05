import React from "react";
import { useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm";
import { registerUser } from "../../services/userService";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const Register = () => {
  const navigate = useNavigate();

  const { values, handleChange } = useForm({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(values);
      navigate("/login");
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={values.name}
            onChange={handleChange}
          />

          <Input
            label="Email"
            name="email"
            value={values.email}
            onChange={handleChange}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
          />

          <select
            name="role"
            value={values.role}
            onChange={handleChange}
            className="border rounded-xl px-3 py-2 w-full"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <Button type="submit" fullWidth>
            Register
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Register;