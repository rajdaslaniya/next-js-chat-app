import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import LoginSignUpLayout from "@/components/Layout/LoginSignUpLayout";
import Image from "next/image";
import { toast } from "react-toastify";
import apiService from "@/utils/base-services";
import { useRouter } from "next/router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormikError } from "@/components/formik-error";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const SignUp = () => {
  const router = useRouter();
  const signUpApiCall = async (values: { email: string; password: string; name: string; hobbies: string[]; avatar: string }) => {
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
        router.push("/login");
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
        .matches(/^\S+(\s\S+)?$/, "Name must contain a space in between and no spaces at the start or end")
        .matches(/^[^\d]*$/, "Name cannot contain digits")
        .trim(),
      email: Yup.string().trim().email("Invalid email address").required("Email is required"),
      password: Yup.string()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
          "Password must be 8-50 characters long, include uppercase, lowercase, number, and special character"
        )
        .required("Password is required")
        .trim(),
      hobbies: Yup.array().min(1, "You must select at least one hobby").required("This field is required"),
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
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Signup</CardTitle>
          <CardDescription>Enter your email below to signup to your account</CardDescription>
        </CardHeader>

        <CardContent>
          <form noValidate onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" placeholder="John Deo" required {...formik.getFieldProps("name")} />
                {formik.touched.name && formik.errors.name && <FormikError>{formik.errors.name}</FormikError>}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" required {...formik.getFieldProps("email")} />
                {formik.touched.email && formik.errors.email && <FormikError>{formik.errors.email}</FormikError>}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="******" required {...formik.getFieldProps("password")} />
                {formik.touched.password && formik.errors.password && <FormikError>{formik.errors.password}</FormikError>}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="hobbies">Hobbies</Label>
                <div className="flex flex-row items-start gap-x-3 space-y-1 mt-1 flex-wrap">
                  {hobbies.map((item) => {
                    return (
                      <div key={item._id} className="flex flex-row items-start gap-3">
                        <Checkbox
                          checked={formik.values.hobbies?.includes(item._id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? formik.setFieldValue("hobbies", [...formik.values.hobbies, item._id])
                              : formik.setFieldValue(
                                  "hobbies",
                                  formik.values.hobbies?.filter((value) => value !== item._id)
                                );
                          }}
                        />
                        <Label className="text-sm font-normal">{item.name}</Label>
                      </div>
                    );
                  })}
                </div>
                {formik.touched.hobbies && formik.errors.hobbies && <FormikError>{formik.errors.hobbies}</FormikError>}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="password">Avatar</Label>
                <div className="flex flex-row items-start gap-x-3 space-y-1 mt-1 flex-wrap">
                  {AvatarImage.map((image, index) => (
                    <Image
                      key={index}
                      height={50}
                      width={50}
                      onClick={() => formik.setFieldValue("avatar", image)}
                      className={`rounded-full cursor-pointer ${formik.values.avatar === image ? "border-3 border-gray-500" : ""}`}
                      alt="image"
                      src={image}
                    />
                  ))}
                </div>
                {formik.touched.avatar && formik.errors.avatar && <FormikError>{formik.errors.avatar}</FormikError>}
              </div>
              <div className="grid gap-1">
                <Button type="submit" className="w-full mt-2">
                  Signup
                </Button>
              </div>
              <p className="text-muted-foreground text-sm text-center">
                Already registered? <Link href="/login">Login</Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </LoginSignUpLayout>
  );
};

export default SignUp;
