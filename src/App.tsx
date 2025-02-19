import React, { useState, useEffect } from "react";
import { Container, Grid, Paper, Button, TextField } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface UserData {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  description: string;
}

const App = () => {
  // Counter State
  const [count, setCount] = useState(0);

  // Form State
  const [userData, setUserData] = useState<UserData>({
    id: 0,
    name: "",
    address: "",
    email: "",
    phone: "",
    description: "",
  });

  const [isUnsaved, setIsUnsaved] = useState(false);

  useEffect(() => {
    const existingData: UserData[] = JSON.parse(
      localStorage.getItem("userData") || "[]"
    );
    if (existingData.length > 0) {
      setUserData(existingData[existingData.length - 1]); // Load last saved entry
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isUnsaved) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isUnsaved]);

  // Handle Form Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    setIsUnsaved(true);
  };

  const handleEditorChange = (content: string) => {
    setUserData({ ...userData, description: content });
    setIsUnsaved(true);
  };

  // Save to Local Storage
  const handleSave = () => {
    const existingData: UserData[] = JSON.parse(
      localStorage.getItem("userData") || "[]"
    );
    const nextId =
      existingData.length > 0
        ? existingData[existingData.length - 1].id + 1
        : 1;

    const newUser = { ...userData, id: nextId };
    const updatedData = [...existingData, newUser];

    localStorage.setItem("userData", JSON.stringify(updatedData));
    alert("User data saved!");
    setIsUnsaved(false);
    window.location.reload()
  };

  // Counter Background Color
  const backgroundColor = `rgba(0, 150, 255, ${Math.min(count / 20, 1)})`;

  return (
    <Container>
      <Grid container spacing={2}>
        {/* Counter Component */}
        <Grid item xs={6} style={{ padding: 30, backgroundColor }}>
          {/* <Paper style={{ padding: 20, backgroundColor }}> */}
          <h2>Counter</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCount(count + 1)}
          >
            +
          </Button>
          <span style={{ margin: "0 15px" }}>{count}</span>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCount(Math.max(0, count - 1))}
          >
            -
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCount(0)}
            style={{ marginLeft: 15 }}
          >
            Reset
          </Button>
          {/* </Paper> */}
        </Grid>

        {/* Rich Text Editor */}
        <Grid item xs={6} style={{ padding: 30 }}>
          {/* <Paper style={{ padding: 20 }}> */}
          <h2>Rich Text Editor</h2>
          <ReactQuill
            theme="snow"
            value={userData.description}
            onChange={handleEditorChange}
          />
        </Grid>
        {/* </Paper> */}
      </Grid>

      {/* User Data Form */}
      <Grid item xs={12} style={{ padding: 30 }}>
        {/* <Paper> */}
        <h2>User Data Form</h2>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={userData.name}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Address"
          name="address"
          value={userData.address}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Phone"
          name="phone"
          value={userData.phone}
          onChange={handleChange}
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        {/* </Paper> */}
      </Grid>
      {/* </Grid> */}
    </Container>
  );
};

export default App;
