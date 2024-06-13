import { Box, Button, Card, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ProjectsCardsWithProj from "./projectsCardsWithProj";
import { useSelector } from "react-redux";

export default function ProjectsCards() {
  const DataForCard = useSelector((state) => state.auth.user);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 3,
      }}
    >
      {DataForCard.user_projects === "У вас нет проектов" ? (
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
          <Typography variant="h6" align="center" mb={2}>
            У вас еще нет проектов, над которыми вы тут работаете :(
          </Typography>
          <Link to="/addProject">
            <Button variant="contained">Добавить проект</Button>
          </Link>
        </Card>
      ) : (
        <ProjectsCardsWithProj />
      )}
    </Box>
  );
}
