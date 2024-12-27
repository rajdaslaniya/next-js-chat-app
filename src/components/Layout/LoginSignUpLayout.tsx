import React from "react";

interface ILoginSignUpLayout {
  children: React.ReactNode;
}

const LoginSignUpLayout: React.FC<ILoginSignUpLayout> = ({ children }) => {
  return (
    <div className="w-full h-100 min-h-full overflow-y-auto flex items-center justify-center bg-black p-3">
      {children}
    </div>
  );
};

export default LoginSignUpLayout;
