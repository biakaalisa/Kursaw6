import {
  Box,
  Card,
  CardActionArea,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { setProject } from "../../store/projectSlice";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

export default function ProjectsCardsWithProj() {
  const DataForCard = useSelector((state) => state.auth.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const dispatch = useDispatch();

  const filteredProjects = DataForCard.user_projects.filter((project) => {
    return (
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.create_at.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.deadline.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "name") {
      return a.f_name.localeCompare(b.f_name);
    } else if (sortBy === "create_at") {
      return a.s_name.localeCompare(b.s_name);
    } else if (sortBy === "deadline") {
      return a.s_name.localeCompare(b.spec_level);
    } else {
      return 0;
    }
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "20px",
      }}
    >
      <Box
        sx={{
          width: "80%",
          backgroundColor: "white",
          display: "flex",
          gap: "25px",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          alignContent: "center",
          borderRadius: 5,
          p: 3,
        }}
      >
        <TextField
          label="Поиск проектов"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "40%", backgroundColor: "white" }}
        />
        <TextField
          select
          label="Сортировка"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          variant="outlined"
          sx={{ width: "40%", backgroundColor: "white" }}
        >
          <MenuItem value="">Без сортировки</MenuItem>
          <MenuItem value="f_name">По названию</MenuItem>
          <MenuItem value="s_name">По дате создания</MenuItem>
          <MenuItem value="spec_level">По дате завершения</MenuItem>
        </TextField>
      </Box>
      {sortedProjects.map((project, index) => (
        <Link to={"/project"} style={{ textDecoration: "none" }}>
          <Card
            sx={{
              width: 500,
              borderRadius: 5,
            }}
          >
            <CardActionArea
              sx={{
                paddingLeft: 5,
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
              }}
              onClick={() => {
                dispatch(
                  setProject({
                    id: project.id,
                    name: project.name,
                    description: project.description,
                    create_at: project.create_at,
                    deadline: project.deadline,
                    budget: project.budget,
                    customer: project.customer,
                    status: project.status,
                  })
                );
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexWrap: "wrap",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
                  padding: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginLeft: 2,
                    marginRight: 2,
                  }}
                >
                  <Typography
                    gutterBottom
                    variant="h6"
                    color="text.secondary"
                    sx={{ alignSelf: "end" }}
                  >
                    {project.status}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "baseline" }}>
                  <Typography gutterBottom variant="h4" color="text.secondary">
                    {project.name}
                  </Typography>
                </Box>

                <Typography gutterBottom variant="h7" color="text.secondary">
                  {project.create_at} — {project.deadline}
                </Typography>

                {/*<Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  marginTop: 2,
                  marginBottom: 5,
                }}
              >
                {project.skills.map((skill, index) => (
                  <Typography
                    gutterBottom
                    variant="h6"
                    color="text.secondary"
                    sx={{
                      minWidth: "150px",
                      background: "#a5afff",
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
                    {skill.Name}
                  </Typography>
                ))}
              </Box>*/}
                <Typography
                  gutterBottom
                  variant="h6"
                  color="text.secondary"
                  sx={{ textAlign: "center", marginTop: 2 }}
                >
                  {project.description}
                </Typography>
                {/*<Box
                sx={{
                  marginBottom: 5,
                  marginTop: 5,
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {project.Team.map((team, index) => (
                  <Button
                    gutterBottom
                    variant="h6"
                    color="text.secondary"
                    sx={{
                      minWidth: "150px",
                      background: "#d7dbfb",
                      borderRadius: 10,
                      paddingLeft: 1.5,
                      paddingRight: 1.5,
                      marginRight: 0.5,
                      marginTop: 0.5,
                      textAlign: "center",
                    }}
                  >
                    {team.Name}
                  </Button>
                ))}
              </Box>*/}
              </Box>
            </CardActionArea>
          </Card>
        </Link>
      ))}
    </Box>
  );
}
