/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import LoginSignUpLayout from "@/components/Layout/LoginSignUpLayout";
import InputField from "@/components/common/InputField";
import CheckboxGroup from "@/components/common/CheckboxGroup";
import Image from "next/image";
import { toast } from "react-toastify";
import apiService from "@/utils/base-services";
import { useRouter } from "next/router";

const SignUp = () => {
  const router = useRouter();
  const signUpApiCall = async (values: {
    email: string;
    password: string;
    name: string;
    hobbies: string[];
    avatar: string;
  }) => {
    try {
      const apiResponse = await apiService.post("/auth/sign-up", {
        email: values.email,
        password: values.password,
        name: values.name,
        hobbies: values.hobbies,
        avatar: values.avatar,
      });
      if (apiResponse.data.data && apiResponse.status == 200) {
        toast.success("User account created successfully");
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };
  const [hobbies, setHobbies] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    getHobbies();
  }, []);

  const getHobbies = async () => {
    try {
      const hobbiesResponse = await apiService.get("/hobbies");
      setHobbies(hobbiesResponse.data.data);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const formik = useFormik<{
    email: string;
    password: string;
    name: string;
    hobbies: string[];
    avatar: string;
  }>({
    initialValues: {
      email: "",
      password: "",
      name: "",
      hobbies: [],
      avatar: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Name is required")
        .min(3, "Minimum 3 characters are allowed")
        .max(50, "Maximum 50 characters are allowed")
        .matches(
          /^\S+(\s\S+)?$/,
          "Name must contain a space in between and no spaces at the start or end"
        )
        .matches(/^[^\d]*$/, "Name cannot contain digits")
        .trim(),
      email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
          "Password must be 8-50 characters long, include uppercase, lowercase, number, and special character"
        )
        .required("Password is required")
        .trim(),
      hobbies: Yup.array()
        .min(1, "You must select at least one hobby")
        .required("This field is required"),
      avatar: Yup.string().required("Please select an avatar"),
    }),
    onSubmit: (values) => {
      signUpApiCall(values);
    },
  });

  const AvatarImage = [
    "https://mostaql.hsoubcdn.com/uploads/thumbnails/1241455/6215569d78504/Minimal-Profile-Sketch-02.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOZWVuTyNFM0AzfnJHagm-ps3BxfzRfHnvHw&s",
  ];

  return (
    <LoginSignUpLayout>
      <div className="login-container w-full max-w-md bg-white rounded-md p-8 shadow-md">
        <form onSubmit={formik.handleSubmit} className="w-full">
          <p className="text-3xl text-center text-black">Sign Up</p>
          <br />
          <InputField
            id="name"
            autoFocus
            label="Name"
            type="text"
            formik={formik}
            labelClassName="text-black"
          />
          <InputField
            id="email"
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
          <CheckboxGroup
            name="hobbies"
            label="Hobbies"
            options={hobbies}
            formik={formik}
          />
          <div>
            <label className="text-black text-md">Select Avatar</label>
            <div className="flex align-center gap-3">
              {AvatarImage.map((image, index) => (
                <Image
                  key={index}
                  height={100}
                  width={100}
                  onClick={() => formik.setFieldValue("avatar", image)}
                  className={`rounded-full cursor-pointer ${
                    formik.values.avatar === image
                      ? "border-3 border-gray-500"
                      : ""
                  }`}
                  alt="image"
                  src={image}
                />
              ))}
            </div>
            {formik.touched.avatar && formik.errors.avatar && (
              <p className="text-red-500 text-sm">{formik.errors.avatar}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-md p-2 text-white bg-gray-500 medium mt-5"
          >
            Submit
          </button>
          <p className="text-black text-sm text-center m-2">
            Already registered? <Link href="/login">Login</Link>
          </p>
        </form>
      </div>
    </LoginSignUpLayout>
  );
};

export default SignUp;
