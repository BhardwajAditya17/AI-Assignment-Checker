import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useForm from "../../hooks/useForm";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { values, handleChange } = useForm({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Wait for login to finish and get the user data
      const data = await login(values); 
      
      // 2. Check the role and navigate to the correct Dashboard
      if (data.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/student");
      }
      
    } catch (error) {
      console.error(error);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button type="submit" fullWidth>
            Login
          </Button>

          <p className="text-sm text-center mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default Login;