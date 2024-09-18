import React, { useState } from "react";

const VerificationForm = () => {
  const [code, setCode] = useState(Array(6).fill(""));
  const [error, setError] = useState(null);

  const handleChange = (e, index) => {
    const newCode = [...code];
    newCode[index] = e.target.value;
    setCode(newCode);
    // Focus on the next input if any
    if (e.target.value && index < 5)
      document.getElementById(`input-${index + 1}`).focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const codeString = code.join("");
    try {
      const res = await fetch("http://localhost:5000/api/verify", {
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

  return (
    <form onSubmit={handleSubmit}>
      <div>
        {code.map((digit, index) => (
          <input
            key={index}
            id={`input-${index}`}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            maxLength={1}
            type="text"
            pattern="[0-9]*"
          />
        ))}
      </div>
      {error && <p>{error}</p>}
      <button type="submit">Submit</button>
    </form>
  );
};

export default VerificationForm;
