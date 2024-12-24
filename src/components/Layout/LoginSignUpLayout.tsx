import React from "react";

interface ILoginSignUpLayout {
  children: React.ReactNode;
}

const LoginSignUpLayout: React.FC<ILoginSignUpLayout> = ({ children }) => {
  return <div className="bg-background flex h-screen w-full items-center justify-center px-4">{children}</div>;
};

export default LoginSignUpLayout;
