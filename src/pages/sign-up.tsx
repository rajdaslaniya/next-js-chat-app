import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import LoginSignUpLayout from "@/components/Layout/LoginSignUpLayout";
import InputField from "@/components/common/InputField";
import CheckboxGroup from "@/components/common/CheckboxGroup";
import Image from "next/image";

const SignUp = () => {
  const formik = useFormik<{
    email: string;
    password: string;
    name: string;
    hobbies: string[];
    selectedUrl: string;
  }>({
    initialValues: {
      email: "",
      password: "",
      name: "",
      hobbies: [],
      selectedUrl: "",
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
      selectedUrl: Yup.string().required("Please select an avatar"),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const hobbyOptions = [
    { value: "Reading", label: "Reading" },
    { value: "Playing", label: "Playing" },
    { value: "Cooking", label: "Cooking" },
  ];

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
            options={hobbyOptions}
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
                  onClick={() => formik.setFieldValue("selectedUrl", image)}
                  className={`rounded-full cursor-pointer ${
                    formik.values.selectedUrl === image
                      ? "border-3 border-gray-500"
                      : ""
                  }`}
                  alt="image"
                  src={image}
                />
              ))}
            </div>
            {formik.touched.selectedUrl && formik.errors.selectedUrl && (
              <p className="text-red-500 text-sm">
                {formik.errors.selectedUrl}
              </p>
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
