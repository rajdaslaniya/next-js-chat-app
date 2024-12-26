import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import LoginSignUpLayout from "@/components/Layout/LoginSignUpLayout";
import apiService from "@/utils/base-services";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormikError } from "@/components/formik-error";
import { Button } from "@/components/ui/button";

const Login = () => {
  const router = useRouter();

  const loginApiCall = async (value: { email: string; password: string }) => {
    try {
      const apiResponse = await apiService.post("/auth/login", {
        email: value.email,
        password: value.password,
      });
      localStorage.setItem("token", apiResponse.data.token);
      localStorage.setItem("userDetails", JSON.stringify(apiResponse.data.data));
      toast.success("User logged in successfully", { duration: 3000 });
      router.push("/");
    } catch (error: any) {
      toast.error(error.response.data.message, { duration: 3000 });
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required").trim(),
      password: Yup.string().trim().required("Password is required"),
    }),
    onSubmit: (values) => {
      loginApiCall(values);
    },
  });

  return (
    <LoginSignUpLayout>
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={formik.handleSubmit} noValidate>
            <div className="flex flex-col gap-4">
              <div className="grid gap-1">
                <Label htmlFor="email">Name</Label>
                <Input id="email" type="email" placeholder="john@example.com" required {...formik.getFieldProps("email")} />
                {formik.touched.email && formik.errors.email && <FormikError>{formik.errors.email}</FormikError>}
              </div>
              <div className="grid gap-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="******" required {...formik.getFieldProps("password")} />
                {formik.touched.password && formik.errors.password && <FormikError>{formik.errors.password}</FormikError>}
              </div>
              <div className="grid gap-1">
                <Button type="submit" className="w-full mt-2">
                  Login
                </Button>
              </div>
              <p className="text-muted-foreground text-sm text-center">
                Not account? <Link href="/sign-up">Sign up</Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </LoginSignUpLayout>
  );
};

export default Login;
