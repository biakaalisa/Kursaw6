import React from "react";
import { Box, Typography, Button, Card } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import EmployesCardsWithEmpl from "./employesCardsWithEmpl";

export default function EmployesCards() {
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
      {DataForCard.user_employees === "У вас нет сотрудников" ? (
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
            У вас еще нет сотрудников, с которыми вы тут работаете :(
          </Typography>
          <Link to="/addEmployee">
            <Button variant="contained">Добавить сотрудника</Button>
          </Link>
        </Card>
      ) : (
        <EmployesCardsWithEmpl />
      )}
    </Box>
  );
}
