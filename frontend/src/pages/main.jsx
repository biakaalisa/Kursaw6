import React from "react";
import Box from "@mui/material/Box";
import CardMP from "../components/cards/card";
import { Code, People, Person, Topic } from "@mui/icons-material";
import ProjectTable from "../components/cards/projectTable";
import { useSelector } from "react-redux";
import { selectUser } from "../store/slice";
import Todo from "../components/cards/todo";

const Main = () => {
  const DataForCard = useSelector(selectUser);

  const arrayCards = [
    {
      title: "Количество проектов",
      fill: DataForCard.counter_projects,
      img: <Topic fontSize="large" sx={{ color: "#304ffe" }} />,
      id: 1,
    },
    {
      title: "Активных пректов",
      fill: DataForCard.counter_active_projects,
      img: <Code fontSize="large" sx={{ color: "#304ffe" }} />,
      id: 2,
    },
    {
      title: "Количество сотрудников",
      fill: DataForCard.counter_employees,
      img: <People fontSize="large" sx={{ color: "#304ffe" }} />,
      id: 3,
    },
    {
      title: "Свободных сотрудников",
      fill: DataForCard.counter_free_employees,
      img: <Person fontSize="large" sx={{ color: "#304ffe" }} />,
      id: 4,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "25px",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        alignContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "25px",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          alignContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "100%",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "50%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              alignContent: "center",
            }}
          >
            {arrayCards.map((card, index) => (
              <CardMP
                title={card.title}
                fill={card.fill}
                img={card.img}
                key={index}
              />
            ))}
          </Box>
          <Todo />
        </Box>

        <ProjectTable />
      </Box>
    </Box>
  );
};

export default Main;
