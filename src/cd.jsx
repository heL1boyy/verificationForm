import React, { useRef, useState } from "react";

const VerificationForm = () => {
  const [code, setCode] = useState(Array(6).fill(""));
  const [error, setError] = useState(null);
  const [inputErrors, setInputErrors] = useState(Array(6).fill(false));
  const inputsRef = useRef([]);

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
      if (index > 0) {
        setCode((prev) => {
          const newOtp = [...prev];
          newOtp[index - 1] = "";
          return newOtp;
        });
        inputsRef.current[index - 1].focus();
      }
    }
  };
  const handleFocus = (e) => {
    e.target.select();
  };

  const handleChange = (e, index) => {
    const newCode = [...code];
    const value = e.target.value;

    // Check if input is valid
    if (/^\d{1}$/.test(value) || value === "") {
      newCode[index] = value;
      setCode(newCode);

      // Clear error for this input if valid
      const newErrors = [...inputErrors];
      newErrors[index] = false;
      setInputErrors(newErrors);
    }

    // Focus on the next input if not empty
    if (e.target.value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    // Check for empty or non-numeric inputs
    const newErrors = code.map((digit) => digit === "");
    setInputErrors(newErrors);

    if (newErrors.includes(true)) {
      hasError = true;
      setError("Please fill all fields with numeric values.");
    }

    // Submit if no errors
    if (!hasError) {
      const codeString = code.join("");
      try {
        const res = await fetch("http://localhost:5000/verify", {
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
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (/^\d{6}$/.test(text)) {
      const digits = text.split("");
      setCode(digits);
      document.getElementById("submit-button").focus();
    }
  };

  return (
    <>
      <section className=" h-screen flex  items-center bg-orange-100 ">
        <div className="max-w-md  mx-auto text-center  bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
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
                  //   ref={(el) => (inputsRef.current[index] = el)}
                  className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  //   onKeyDown={(e) => handleKeyDown(e, index)}

                  onFocus={handleFocus}
                  onPaste={handlePaste}
                />
              ))}
            </div>
            {error && <p>{error}</p>}
            <div className="max-w-[260px] mx-auto mt-4">
              <button
                type="submit"
                id="submit-button"
                className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
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
