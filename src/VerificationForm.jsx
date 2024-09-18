import React, { useRef, useState } from "react";
import ErrorPopup from "./Components/ErrorPopup";

const VerificationForm = () => {
  const [code, setCode] = useState(Array(6).fill(""));
  const [error, setError] = useState(null);
  const inputsRef = useRef([]);

  //for deleting the codes
  const handleKeyDown = (e, index) => {
    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    if (e.key === "Delete" || e.key === "Backspace") {
      setCode((prev) => {
        const newOtp = [...prev];
        newOtp[index] = "";
        return newOtp;
      });

      if (e.key === "Backspace" && index > 0 && !code[index]) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  //for focus the input
  const handleFocus = (e) => {
    e.target.select();
  };

  // Focus on the next input if any
  const handleChange = (e, index) => {
    const newCode = [...code];
    newCode[index] = e.target.value;
    setCode(newCode);

    if (e.target.value && index < 5)
      document.getElementById(`input-${index + 1}`).focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const codeString = code.join("");
    try {
      const res = await fetch("https://verficationsever.onrender.com/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeString }),
      });

      const result = await res.json();
      if (result.success) window.location.href = "/success";
      else setError("Verification Error");
    } catch (err) {
      setError("Server error");
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");

    // Ensure the pasted content is exactly 6 digits
    if (/^\d{6}$/.test(text)) {
      const digits = text.split("");
      setCode(digits);

      // Focus the last input field after pasting
      inputsRef.current[5].focus();
    }
  };

  return (
    <>
      <section className=" h-screen flex  items-center bg-[#efefef] ">
        <div className="max-w-md  mx-auto text-center  bg-white px-4 sm:px-8 py-10 rounded-xl shadow-lg">
          <header className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Verification Code</h1>
            <p className="text-[15px] text-slate-500">
              Enter the 6-digit verification code
            </p>
          </header>
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-center gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`input-${index}`}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  maxLength={1}
                  type="text"
                  pattern="[0-9]*"
                  ref={(el) => (inputsRef.current[index] = el)}
                  className={`w-14 h-14 text-center text-2xl font-extrabold text-slate-800 bg-slate-100 border-2 ${
                    error ? "border-red-500" : "border-orange-300"
                  }  rounded-2xl p-4 outline-none focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100`}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={handleFocus}
                  onPaste={handlePaste}
                />
              ))}
            </div>
            {error && <p className="pt-5">{<ErrorPopup message={error} />}</p>}
            <div className="max-w-[260px] mx-auto mt-4">
              <button
                type="submit"
                id="submit-button"
                className="w-full inline-flex justify-center  rounded-lg bg-orange-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-orange-950/10 hover:bg-orange-600 focus:ring focus:ring-orange-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-orange-300 transition-colors duration-150"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default VerificationForm;
