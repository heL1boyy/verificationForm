import * as React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export default function ErrorPopup({ message }) {
  return (
    <Stack sx={{ width: "100%", marginBottom: "20px" }} spacing={2}>
      {/* Display the error message */}
      <Alert severity="error">{message}</Alert>
    </Stack>
  );
}
