import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import arrayEmployes from "../employees/employes";
import { Create, Delete } from "@mui/icons-material";
import Suck from "../employees/suckployee";
import CheckIcon from "@mui/icons-material/Check";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  setCounterActiveProject,
  setCounterProjects,
  setProjects,
} from "../../store/slice";
import axios from "axios";

export default function Project() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const ProjectData = useSelector((state) => state.project);
  return (
    <Grid container spacing={2} sx={{ justifyContent: "center" }}>
      <Grid tem xs={10} md={3} mt={2}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 2,
            borderRadius: 5,
            textAlign: "center",
            minWidth: "175px",
          }}
        >
          <Avatar
            src="https://i.pinimg.com/564x/4a/6e/fc/4a6efce2cafda3fbff9b6e64d2ea9f94.jpg"
            sx={{ width: "175px", height: "auto", marginBottom: 3 }}
          />
          <Typography variant="h5" sx={{ textAlign: "center", margin: 2 }}>
            {ProjectData.name}
          </Typography>
          <Typography sx={{ textAlign: "center" }}>
            {ProjectData.create_at}
          </Typography>
          <Button
            color="primary"
            variant="contained"
            sx={{
              paddingLeft: 2,
              paddingRight: 2,
              borderRadius: 5,
              textAlign: "center",
              width: "100%",
              marginTop: 2,
              justifyContent: "center",
              gap: 2,
            }}
          >
            Редактировать
            <Create />
          </Button>
        </Card>

        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            padding: 2,
            borderRadius: 5,
            textAlign: "start",
            minWidth: "175px",
            marginTop: 2,
            paddingLeft: 2,
            paddingRight: 2,
          }}
        >
          <Box display={"flex"}>
            <Typography variant="h5">Статус</Typography>
            <Chip
              color="info"
              label={ProjectData.status}
              sx={{ marginLeft: 2 }}
            />
            {/* color: success/error */}
          </Box>
          <Typography variant="h5">Заказчик</Typography>
          <Typography marginLeft={2}>{ProjectData.customer}</Typography>
          <Typography variant="h5">Бюджет</Typography>
          <Typography marginLeft={2}>{ProjectData.budget}</Typography>
          <Typography variant="h5">Дата завершения</Typography>
          <Typography marginLeft={2}>{ProjectData.deadline}</Typography>
        </Card>
        <Link to={"/projects"}>
          <Button
            color="error"
            variant="outlined"
            sx={{
              paddingLeft: 2,
              paddingRight: 2,
              borderRadius: 5,
              textAlign: "center",
              width: "100%",
              marginTop: 2,
              justifyContent: "center",
              gap: 2,
              backgroundColor: "white",
            }}
            onClick={async () => {
              try {
                await axios.delete(
                  "/api/project/" + "?project_id=" + ProjectData.id
                );
                const ans1 = await axios.get("/api/counter_projects/");
                const ans2 = await axios.get("/api/counter_active_projects/");
                const ans6 = await axios.post("/api/user_projects/");
                dispatch(setCounterProjects(ans1.data));
                dispatch(setCounterActiveProject(ans2.data));
                dispatch(setProjects(ans6.data));
                alert("Удалили");
              } catch {
                alert("Какие-то ошибки с удалением");
              }
            }}
          >
            Удалить проект
            <Delete />
          </Button>
        </Link>
        <Button
          color="success"
          variant="outlined"
          sx={{
            paddingLeft: 2,
            paddingRight: 2,
            borderRadius: 5,
            textAlign: "center",
            width: "100%",
            marginTop: 2,
            justifyContent: "center",
            gap: 2,
            backgroundColor: "white",
          }}
        >
          Утвердить проект
          <CheckIcon />
        </Button>
      </Grid>
      <Grid item xs={10} md={7}>
        <Card sx={{ borderRadius: 5, padding: 2, minHeight: "100px" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              textWrap: "wrap",
              marginBottom: 2,
            }}
          >
            Описание
          </Typography>
          <Typography>{ProjectData.description}</Typography>
        </Card>
        <Card sx={{ marginTop: 2, borderRadius: 5, minHeight: "100px" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", textAlign: "center", margin: 2 }}
          >
            Технические требования
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
            {Suck.map((employee, index) =>
              employee.hSkills.map((hs, i) => (
                <Typography
                  gutterBottom
                  variant="h6"
                  color="text.secondary"
                  sx={{
                    background: "rgba(25, 118, 210, 0.20)",
                    borderRadius: 10,
                    paddingLeft: 1.5,
                    paddingRight: 1.5,
                    paddingBottom: 0.5,
                    paddingTop: 0.5,
                    marginRight: 0.5,
                    marginTop: 0.5,
                    textAlign: "center",
                    fontSize: "18px",
                  }}
                >
                  {hs.Name}
                </Typography>
              ))
            )}
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
            {Suck.map((employee, index) =>
              employee.sSkills.map((hs, i) => (
                <Typography
                  gutterBottom
                  variant="h6"
                  color="text.secondary"
                  sx={{
                    background: "rgba(25, 118, 210, 0.40)",
                    borderRadius: 10,
                    paddingLeft: 1.5,
                    paddingRight: 1.5,
                    paddingBottom: 0.5,
                    paddingTop: 0.5,
                    marginRight: 0.5,
                    marginTop: 0.5,
                    textAlign: "center",
                    fontSize: "18px",
                  }}
                >
                  {hs.Name}
                </Typography>
              ))
            )}
          </Box>
        </Card>
        <Card sx={{ marginTop: 2, borderRadius: 5, minHeight: "100px" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              margin: 2,
            }}
          >
            Участники проекта
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "row",
              justifyContent: "center",
              paddingBottom: 2,
            }}
          >
            {arrayEmployes.map((employee, index) => (
              <CardActionArea
                sx={{
                  width: 350,
                  borderRadius: 5,
                  margin: 1,
                  color: "rgba(25, 118, 210)",
                }}
              >
                <Card
                  sx={{
                    borderRadius: 5,
                    padding: 2,
                    border: "solid",
                    border: 1,
                    borderColor: "rgba(25, 118, 210, 0.40)",
                  }}
                >
                  <Typography>{employee.JobTitle}</Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      marginRight: 2,
                      marginLeft: 2,
                    }}
                  >
                    {employee.Name + " " + employee.Surname}
                  </Typography>
                </Card>
              </CardActionArea>
            ))}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}
