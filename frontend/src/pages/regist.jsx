import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AC1 from "../components/registComponents/AC1";
import { Avatar, Container, Typography } from "@mui/material";
import AC2 from "../components/registComponents/AC2";
import AC3 from "../components/registComponents/AC3";
import { useState } from "react";
import axios from "axios";
import { login } from "../store/slice";
import { useDispatch } from "react-redux";

export default function Regist(props) {
  const dispatch = useDispatch();
  const [RegData, setRegData] = useState({
    email: null,
    password: null,
    f_name: null,
    s_name: null,
    t_name: null,
    contact_number: null,
    organization_name: null,
    description: null,
    size: null,
    branch: null,
  });
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    {
      label: "Данные организации",
      description: (
        <AC1
          RegData={RegData}
          setRegData={setRegData}
          setIsComplete={setIsComplete}
        />
      ),
    },
    {
      label: "Данные администратора",
      description: (
        <AC2
          RegData={RegData}
          setRegData={setRegData}
          setIsComplete={setIsComplete}
        />
      ),
    },
    {
      label: "Завершение регистрации",
      description: (
        <AC3
          RegData={RegData}
          setRegData={setRegData}
          setIsComplete={setIsComplete}
        />
      ),
    },
  ];

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleReg = async () => {
    const bodyFormData = new FormData();
    bodyFormData.append("username", RegData.email);
    bodyFormData.append("password", RegData.password);
    try {
      await axios.post("/api/auth/register", {
        email: RegData.email,
        password: RegData.password,
        f_name: RegData.f_name,
        s_name: RegData.s_name,
        t_name: RegData.t_name,
        contact_number: RegData.contact_number,
        organization_name: RegData.organization_name,
        description: RegData.description,
        size: RegData.size,
        branch: RegData.branch,
      });
      await axios.post("/api/auth/jwt/login", bodyFormData);

      const ans1 = await axios.get("/api/counter_projects/");
      const ans2 = await axios.get("/api/counter_active_projects/");
      const ans3 = await axios.get("/api/counter_employees/");
      const ans4 = await axios.get("/api/counter_free_employees/");
      const ans5 = await axios.get("/api/user_employees/");
      const ans6 = await axios.post("/api/user_projects/");

      dispatch(
        login({
          counter_projects: ans1.data.detail,
          counter_active_projects: ans2.data.detail,
          counter_employees: ans3.data.detail,
          counter_free_employees: ans4.data.detail,
          user_employees: ans5.data.detail,
          user_projects: ans6.data.detail,
        })
      );
    } catch (e) {
      alert("Регистрация дает бибу");
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        paddingTop: 5,
        paddingBottom: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ mb: 1, bgcolor: "primary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" sx={{ mb: 7 }}>
        Создание аккаунта
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: -7 }}>
        {steps[activeStep].description}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            style={{ pointerEvents: isComplete === true ? "" : "none" }}
            variant="contained"
            onClick={
              activeStep === steps.length - 1 ? () => handleReg() : handleNext
            }
            sx={{
              mt: 3,
              mr: 1,
              backgroundColor: isComplete === true ? "" : "grey",
            }}
          >
            {activeStep === steps.length - 1
              ? "Завершить регистрацию"
              : "Продолжить"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
