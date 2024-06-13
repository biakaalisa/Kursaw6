import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SkillsAdder from "./skills";
import { Add, Delete } from "@mui/icons-material";
import img from "../images/addPic.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  setCounterActiveProject,
  setCounterProjects,
  setProjects,
} from "../../store/slice";
import { useDispatch, useSelector } from "react-redux";
import CreateHSkill from "./CreateHSkill";

export default function AddProject() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const UserData = useSelector((state) => state.auth.user.counter_employees);

  const [softSkills, setSoftSkills] = useState([]);
  const [hardSkills, setHardSkills] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseS = await axios.get("/api/get_soft_skill/");
        setSoftSkills(responseS.data);
        const responseH = await axios.get("api/get_hard_skill/");
        setHardSkills(responseH.data);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };
    fetchData();
  }, []);

  const names = [
    "C++",
    "C#",
    "Python",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
  ];
  const [projectData, setProjectData] = useState({
    name: null,
    create_at: null,
    deadline: null,
    description: null,
    budget: null,
    customer: null,
    team_leader: "string",
    status: "string",
  });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (
      projectData.name &&
      projectData.create_at &&
      projectData.deadline &&
      projectData.description &&
      projectData.budget &&
      projectData.customer &&
      projectData.team_leader
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [projectData]);

  const handleAddProject = async () => {
    try {
      await axios.post("/api/projects/", {
        name: projectData.name,
        create_at: projectData.create_at,
        deadline: projectData.deadline,
        description: projectData.description,
        budget: projectData.budget,
        customer: projectData.customer,
        team_leader: "string",
        status: "string",
      });
      const ans1 = await axios.get("/api/counter_projects/");
      const ans2 = await axios.get("/api/counter_active_projects/");
      const ans6 = await axios.post("/api/user_projects/");
      dispatch(setCounterProjects(ans1.data));
      dispatch(setCounterActiveProject(ans2.data));
      dispatch(setProjects(ans6.data));
    } catch (error) {
      alert("Ошибка добавления проекта: " + error.response.data);
    }
  };

  return (
    <Box>
      {UserData === "У вас нет сотрудников" ? (
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mt: 5,
            p: 4,
            mr: 3,
            ml: 3,
            backgroundColor: "white",
            borderRadius: 5,
          }}
        >
          <Typography variant="h6" align="center" mb={3}>
            Прежде чем начать работу над созданием проекта, Вам необходимо
            добавить сотрудников!
          </Typography>
          <Link to="/addEmployee">
            <Button variant="contained">Добавить сотрудника</Button>
          </Link>
        </Card>
      ) : (
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          <Grid item xs={12} md={4} sx={{ ml: { xs: 0, md: 2.5 } }}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 2,
                borderRadius: 5,
                textAlign: "center",
                gap: 2,
              }}
            >
              <Avatar
                src={img}
                sx={{ width: "175px", height: "auto", marginBottom: 3 }}
              />
              <Grid item sx={{ width: "80%", maxWidth: "300px" }}>
                <TextField
                  multiline
                  required
                  fullWidth
                  label="Название проекта"
                  onChange={(e) =>
                    setProjectData({ ...projectData, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item sx={{ width: "80%", maxWidth: "300px" }}>
                <TextField
                  required
                  fullWidth
                  multiline
                  label="Заказчик"
                  autoFocus
                  onChange={(e) =>
                    setProjectData({ ...projectData, customer: e.target.value })
                  }
                />
              </Grid>
              <Grid item sx={{ width: "80%", maxWidth: "300px" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    label="Дата начала проекта"
                    onChange={(date) => {
                      if (date) {
                        setProjectData({
                          ...projectData,
                          create_at: date.format("YYYY-MM-DD"),
                        });
                      } else {
                        setProjectData({ ...projectData, create_at: "" });
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item sx={{ width: "80%", maxWidth: "300px" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    label="Дата завершения проекта"
                    onChange={(date) => {
                      if (date) {
                        setProjectData({
                          ...projectData,
                          deadline: date.format("YYYY-MM-DD"),
                        });
                      } else {
                        setProjectData({ ...projectData, deadline: "" });
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid
                item
                sx={{ width: "80%", maxWidth: "300px", marginBottom: 2 }}
              >
                <TextField
                  required
                  fullWidth
                  label="Бюджет"
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₽</InputAdornment>
                    ),
                  }}
                  onChange={(e) =>
                    setProjectData({ ...projectData, budget: e.target.value })
                  }
                />
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <Card
              sx={{
                borderRadius: 5,
                padding: 2,
                minHeight: "100px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 1,
                  marginTop: 3,
                }}
              >
                Описание проекта
              </Typography>
              <TextField
                required
                fullWidth
                id="education"
                multiline
                name="education"
                variant="standard"
                sx={{
                  background: "white",
                  width: "80%",
                  margin: "0 auto 2rem",
                }}
                onChange={(e) =>
                  setProjectData({
                    ...projectData,
                    description: e.target.value,
                  })
                }
              />
            </Card>

            <Card
              sx={{
                marginTop: 2,
                borderRadius: 5,
                minHeight: "100px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", textAlign: "center", margin: 2 }}
              >
                Профессиональные навыки
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingBottom: 2,
                }}
              >
                <Box
                  sx={{
                    minWidth: "70%",
                    maxWidth: "70%",
                  }}
                >
                  <SkillsAdder
                    data={hardSkills}
                    title="Профессиональные навыки сотрудника"
                  ></SkillsAdder>
                </Box>
                <CreateHSkill setHardSkills={setHardSkills} />
              </Box>
            </Card>

            <Card sx={{ marginTop: 2, borderRadius: 5, minHeight: "100px" }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", textAlign: "center", margin: 2 }}
              >
                Личностные компетенции
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingBottom: 2,
                }}
              >
                <Box
                  sx={{
                    minWidth: "70%",
                    maxWidth: "70%",
                  }}
                >
                  <SkillsAdder
                    data={names}
                    title="Компетенции сотрудника"
                  ></SkillsAdder>
                </Box>
              </Box>
            </Card>
            <Box
              sx={{
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                marginTop: 2,
              }}
            >
              <Link
                to="/main"
                style={{ width: isSmallScreen ? "100%" : "48%" }}
              >
                <Button
                  color="error"
                  variant="outlined"
                  fullWidth
                  sx={{
                    paddingLeft: 2,
                    paddingRight: 2,
                    borderRadius: 5,
                    paddingTop: 1,
                    paddingBottom: 1,
                    backgroundColor: "white",
                  }}
                >
                  Отмена
                  <Delete />
                </Button>
              </Link>
              <Link
                to="/main"
                style={{
                  width: isSmallScreen ? "100%" : "48%",
                  pointerEvents: isActive === true ? "" : "none",
                }}
              >
                <Button
                  onClick={handleAddProject}
                  color="success"
                  variant="outlined"
                  fullWidth
                  sx={{
                    paddingLeft: 2,
                    paddingRight: 2,
                    borderRadius: 5,
                    paddingTop: 1,
                    paddingBottom: 1,
                    backgroundColor: isActive ? "white" : "lightgrey",
                  }}
                  disabled={!isActive}
                >
                  Добавить
                  <Add />
                </Button>
              </Link>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
