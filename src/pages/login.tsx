/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import LoginSignUpLayout from "@/components/Layout/LoginSignUpLayout";
import InputField from "@/components/common/InputField";
import apiService from "@/utils/base-services";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();

  const loginApiCall = async (value: { email: string; password: string }) => {
    try {
      const apiResponse = await apiService.post("/auth/login", {
        email: value.email,
        password: value.password,
      });
      localStorage.setItem("token", apiResponse.data.token);
      localStorage.setItem(
        "userDetails",
        JSON.stringify(apiResponse.data.data)
      );
      toast.success("User logged in successfully");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required")
        .trim(),
      password: Yup.string().trim().required("Password is required"),
    }),
    onSubmit: (values) => {
      loginApiCall(values);
    },
  });

  return (
    <LoginSignUpLayout>
      <div className="login-container w-full max-w-md bg-white rounded-md p-8 shadow-md">
        <form onSubmit={formik.handleSubmit} className="w-full">
          <p className="text-3xl text-center text-black">Login</p>
          <br />
          <InputField
            id="email"
            autoFocus
            label="Email"
            type="email"
            formik={formik}
            labelClassName="text-black"
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            formik={formik}
            labelClassName="text-black"
          />
          <button
            type="submit"
            className="w-full rounded-md p-2 text-white bg-gray-500 medium mt-5"
          >
            Submit
          </button>
          <p className="text-black text-sm text-center m-2">
            Not account? <Link href="/sign-up">Sign up</Link>
          </p>
        </form>
      </div>
    </LoginSignUpLayout>
  );
};

export default Login;
