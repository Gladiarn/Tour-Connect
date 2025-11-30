// src/pages/index.tsx (assuming this is the login/signup page)

import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function Index() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registeremail, setRegisterEmail] = useState("");
  const [registername, setRegisterName] = useState("");
  const [registerpassword, setRegisterPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  function clearFields() {
    setEmail("");
    setPassword("");
    setRegisterEmail("");
    setRegisterName("");
    setRegisterPassword("");
    setConfirmPassword("");
  }

  //for login password
  const [isHiddenLogin, setisHiddenLogin] = useState<boolean>(true);
  const togglePasswordLogin = () => {
    setisHiddenLogin(!isHiddenLogin);
  };

  // for signup password
  const [isHidden, setisHidden] = useState<boolean>(true);
  const togglePassword = () => {
    setisHidden(!isHidden);
  };

  // for confirm signup password
  const [isHiddenConfirm, setisHiddenConfirm] = useState<boolean>(true);
  const togglePasswordConfirm = () => {
    setisHiddenConfirm(!isHiddenConfirm);
  };

  const [isLogin, setisLogin] = useState<boolean>(true);

  const toggleLogin = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault(); // Prevent default link behavior
    clearFields();
    setisLogin(!isLogin);
  };

  const { login } = useAuth();
  const router = useRouter();
  const loginHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw data;
      }

      login(data.accessToken, data.refreshToken);
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="min-h-[85vh] grid place-items-center bg-white text-[#3C3D37]">
        <div className="flex max-w-[600px] justify-center w-full px-4 md:px-0">
          {isLogin ? (
            <div className="w-full" key="login">
              <div className="text-center flex flex-col items-center gap-[0.65rem]">
                <div className="w-[80px] h-[80px] relative">
                  <Image src={"/images/Icon.svg"} alt="Bus Icon" fill />
                </div>
                <h3 className="text-2xl font-semibold">
                  Welcome back! Let&apos;s continue your journey!
                </h3>
                <p>
                  Ready to embark on your next exploration in Eastern Visayas?
                  Log in now.
                </p>
              </div>

              <form
                onSubmit={(e) => loginHandler(e)}
                action=""
                className="flex flex-col gap-6 py-8"
              >
                <div className="relative">
                  <input
                    type="email"
                    required
                    className="w-full h-[50px] px-3 border border-[#3C3D37] text-lg outline-none peer rounded-[10px]"
                    placeholder=" "
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    value={email}
                  />
                  <span
                    className="absolute left-0 p-[15px] pointer-events-none text-gray-500/50 transition-all duration-200 ease-in-out
                                            peer-focus:text-[13px] peer-not-placeholder-shown:text-[13px]
                                            peer-not-placeholder-shown:-translate-y-[15px] peer-not-placeholder-shown:translate-x-[15px] peer-not-placeholder-shown:tracking-[5px] peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:border-l peer-not-placeholder-shown:border-l-[#3C3D37] peer-not-placeholder-shown:border-r peer-not-placeholder-shown:border-r-[#3C3D37] peer-not-placeholder-shown:text-[#3C3D37] peer-not-placeholder-shown:py-[4px] peer-not-placeholder-shown:px-[5px]
                                            peer-focus:-translate-y-[15px] peer-focus:translate-x-[15px] peer-focus:tracking-[5px] peer-focus:bg-white peer-focus:border-l peer-focus:border-l-[#3C3D37] peer-focus:border-r peer-focus:border-r-[#3C3D37] peer-focus:text-[#3C3D37] peer-focus:py-[4px] peer-focus:px-[5px]"
                  >
                    EMAIL
                  </span>
                </div>

                <div className="relative">
                  {" "}
                  {/* .input-box */}
                  <input
                    type={isHiddenLogin ? "password" : "text"}
                    required
                    className="w-full h-[50px] px-3 border border-[#3C3D37] text-lg outline-none peer rounded-[10px]"
                    placeholder=" "
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    value={password}
                  />
                  {isHiddenLogin ? (
                    <FaEyeSlash
                      className="absolute right-[15px] top-1/2 -translate-y-1/2 text-2xl cursor-pointer text-[#1a3236]"
                      onClick={togglePasswordLogin}
                    />
                  ) : (
                    <FaEye
                      className="absolute right-[15px] top-1/2 -translate-y-1/2 text-2xl cursor-pointer text-[#1a3236]"
                      onClick={togglePasswordLogin}
                    />
                  )}
                  <span
                    className="absolute left-0 p-[15px] pointer-events-none text-gray-500/50 transition-all duration-200 ease-in-out peer-focus:text-[13px] peer-valid:text-[13px]
                                            peer-valid:-translate-y-[15px] peer-valid:translate-x-[15px] peer-valid:tracking-[5px] peer-valid:bg-white peer-valid:border-l peer-valid:border-l-[#3C3D37] peer-valid:border-r peer-valid:border-r-[#3C3D37] peer-valid:text-[#3C3D37] peer-valid:py-[4px] peer-valid:px-[5px]
                                            peer-focus:-translate-y-[15px] peer-focus:translate-x-[15px] peer-focus:tracking-[5px] peer-focus:bg-white peer-focus:border-l peer-focus:border-l-[#3C3D37] peer-focus:border-r peer-focus:border-r-[#3C3D37] peer-focus:text-[#3C3D37] peer-focus:py-[4px] peer-focus:px-[5px]"
                  >
                    PASSWORD
                  </span>
                </div>

                <button className="w-full h-[50px] text-xl font-semibold text-white bg-[#3C3D37] border-none cursor-pointer hover:bg-[#697565] rounded-[10px]">
                  Continue
                </button>

                <p>
                  Don&apos;t have an account yet?{" "}
                  <Link
                    href={"#"}
                    className="text-[#8b5b00]"
                    onClick={(e) => toggleLogin(e)}
                  >
                    Sign up here
                  </Link>
                  .
                </p>
              </form>

              <div className="mt-4 relative border-t border-gray-400/50 pt-4 leading-normal">
                <p className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 text-gray-700">
                  By Logging in
                </p>
                <p>
                  By logging in, you confirm that you have read and agree to our{" "}
                  <Link href="" target="_blank" className="text-[#8b5b00]">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="" target="_blank" className="text-[#8b5b00]">
                    Privacy Policy
                  </Link>
                  , including any updates or amendments.
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full py-8" key="signup">
              <div className="text-center flex flex-col items-center gap-[0.65rem]">
                <div className="w-[80px] h-[80px] relative">
                  <Image src={"/images/Icon.svg"} alt="Bus Icon" fill />{" "}
                </div>
                <h3 className="text-2xl font-semibold">
                  Join our community of fellow explorers in Eastern Visayas!
                </h3>
                <p>
                  Become a member and plan your dream trip to the captivating
                  Eastern Visayas region, where adventure and culture await.
                  Sign up now!
                </p>
              </div>

              <form action="" className="flex flex-col gap-6 py-8">
                <div className="relative">
                  <input
                    type="email"
                    required
                    className="w-full h-[50px] px-3 border border-[#3C3D37] text-lg outline-none peer rounded-[10px]"
                    placeholder=" "
                    onChange={(e) => {
                      setRegisterEmail(e.target.value);
                    }}
                    value={registeremail}
                  />
                  <span
                    className="absolute left-0 p-[15px] pointer-events-none text-gray-500/50 transition-all duration-200 ease-in-out peer-focus:text-[13px] peer-not-placeholder-shown:text-[13px]
                                            peer-not-placeholder-shown:-translate-y-[15px] peer-not-placeholder-shown:translate-x-[15px] peer-not-placeholder-shown:tracking-[5px] peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:border-l peer-not-placeholder-shown:border-l-[#3C3D37] peer-not-placeholder-shown:border-r peer-not-placeholder-shown:border-r-[#3C3D37] peer-not-placeholder-shown:text-[#3C3D37] peer-not-placeholder-shown:py-[4px] peer-not-placeholder-shown:px-[5px]
                                            peer-focus:-translate-y-[15px] peer-focus:translate-x-[15px] peer-focus:tracking-[5px] peer-focus:bg-white peer-focus:border-l peer-focus:border-l-[#3C3D37] peer-focus:border-r peer-focus:border-r-[#3C3D37] peer-focus:text-[#3C3D37] peer-focus:py-[4px] peer-focus:px-[5px]"
                  >
                    EMAIL
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    className="w-full h-[50px] px-3 border border-[#3C3D37] text-lg outline-none peer rounded-[10px]"
                    placeholder=" "
                    onChange={(e) => {
                      setRegisterName(e.target.value);
                    }}
                    value={registername}
                  />
                  <span
                    className="absolute left-0 p-[15px] pointer-events-none text-gray-500/50 transition-all duration-200 ease-in-out peer-focus:text-[13px] peer-valid:text-[13px]
                                            peer-valid:-translate-y-[15px] peer-valid:translate-x-[15px] peer-valid:tracking-[5px] peer-valid:bg-white peer-valid:border-l peer-valid:border-l-[#3C3D37] peer-valid:border-r peer-valid:border-r-[#3C3D37] peer-valid:text-[#3C3D37] peer-valid:py-[4px] peer-valid:px-[5px]
                                            peer-focus:-translate-y-[15px] peer-focus:translate-x-[15px] peer-focus:tracking-[5px] peer-focus:bg-white peer-focus:border-l peer-focus:border-l-[#3C3D37] peer-focus:border-r peer-focus:border-r-[#3C3D37] peer-focus:text-[#3C3D37] peer-focus:py-[4px] peer-focus:px-[5px]"
                  >
                    NAME
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={isHidden ? "password" : "text"}
                    required
                    className="w-full h-[50px] px-3 border border-[#3C3D37] text-lg outline-none peer rounded-[10px]"
                    placeholder=" "
                    onChange={(e) => {
                      setRegisterPassword(e.target.value);
                    }}
                    value={registerpassword}
                  />
                  {isHidden ? (
                    <FaEyeSlash
                      className="absolute right-[15px] top-1/2 -translate-y-1/2 text-2xl cursor-pointer text-[#1a3236]"
                      onClick={togglePassword}
                    />
                  ) : (
                    <FaEye
                      className="absolute right-[15px] top-1/2 -translate-y-1/2 text-2xl cursor-pointer text-[#1a3236]"
                      onClick={togglePassword}
                    />
                  )}
                  <span
                    className="absolute left-0 p-[15px] pointer-events-none text-gray-500/50 transition-all duration-200 ease-in-out peer-focus:text-[13px] peer-valid:text-[13px]
                                            peer-valid:-translate-y-[15px] peer-valid:translate-x-[15px] peer-valid:tracking-[5px] peer-valid:bg-white peer-valid:border-l peer-valid:border-l-[#3C3D37] peer-valid:border-r peer-valid:border-r-[#3C3D37] peer-valid:text-[#3C3D37] peer-valid:py-[4px] peer-valid:px-[5px]
                                            peer-focus:-translate-y-[15px] peer-focus:translate-x-[15px] peer-focus:tracking-[5px] peer-focus:bg-white peer-focus:border-l peer-focus:border-l-[#3C3D37] peer-focus:border-r peer-focus:border-r-[#3C3D37] peer-focus:text-[#3C3D37] peer-focus:py-[4px] peer-focus:px-[5px]"
                  >
                    PASSWORD
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={isHiddenConfirm ? "password" : "text"}
                    required
                    className="w-full h-[50px] px-3 border border-[#3C3D37] text-lg outline-none peer rounded-[10px]"
                    placeholder=" "
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                    value={confirmpassword}
                  />
                  {isHiddenConfirm ? (
                    <FaEyeSlash
                      className="absolute right-[15px] top-1/2 -translate-y-1/2 text-2xl cursor-pointer text-[#1a3236]"
                      onClick={togglePasswordConfirm}
                    />
                  ) : (
                    <FaEye
                      className="absolute right-[15px] top-1/2 -translate-y-1/2 text-2xl cursor-pointer text-[#1a3236]"
                      onClick={togglePasswordConfirm}
                    />
                  )}
                  <span
                    className="absolute left-0 p-[15px] pointer-events-none text-gray-500/50 transition-all duration-200 ease-in-out peer-focus:text-[13px] peer-valid:text-[13px]
                                            peer-valid:-translate-y-[15px] peer-valid:translate-x-[15px] peer-valid:tracking-[5px] peer-valid:bg-white peer-valid:border-l peer-valid:border-l-[#3C3D37] peer-valid:border-r peer-valid:border-r-[#3C3D37] peer-valid:text-[#3C3D37] peer-valid:py-[4px] peer-valid:px-[5px]
                                            peer-focus:-translate-y-[15px] peer-focus:translate-x-[15px] peer-focus:tracking-[5px] peer-focus:bg-white peer-focus:border-l peer-focus:border-l-[#3C3D37] peer-focus:border-r peer-focus:border-r-[#3C3D37] peer-focus:text-[#3C3D37] peer-focus:py-[4px] peer-focus:px-[5px]"
                  >
                    CONFIRM PASSWORD
                  </span>
                </div>

                <button className="w-full h-[50px] text-xl font-semibold text-white bg-[#3C3D37] border-none cursor-pointer hover:bg-[#697565] rounded-[10px]">
                  Continue
                </button>

                <p>
                  Already have an account?{" "}
                  <Link
                    href="#"
                    className="text-[#8b5b00]"
                    onClick={toggleLogin}
                  >
                    Log in here
                  </Link>
                  .
                </p>
              </form>

              <div className="mt-4 relative border-t border-gray-400/50 pt-4 leading-normal">
                <p className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 text-gray-700">
                  By Signing up
                </p>
                <p>
                  By creating an account, you acknowledge and agree to our{" "}
                  <Link href="" target="_blank" className="text-[#8b5b00]">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="" target="_blank" className="text-[#8b5b00]">
                    Privacy Policy
                  </Link>
                  , including any updates or amendments.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
