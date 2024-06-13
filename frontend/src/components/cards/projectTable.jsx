import * as React from "react";
import Card from "@mui/material/Card";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setProject } from "../../store/projectSlice";

function CustomToolbar() {
  return (
    <Box sx={{ p: 1, pb: 0, alignSelf: "flex-end" }}>
      <GridToolbarQuickFilter />
    </Box>
  );
}

export default function ProjectTable() {
  const userData = useSelector((state) => state.auth.user.user_projects);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const columns = [
    {
      field: "name",
      headerName: "Проект",
      headerClassName: "anotherTitle",
      editable: true,
      type: "string",
      width: 500,
    },
    {
      field: "deadline",
      headerClassName: "anotherTitle",
      editable: false,
      headerName: "Сделать до",
      width: 300,
    },
    {
      field: "status",
      headerName: "Статус",
      headerClassName: "anotherTitle",
      type: "singleSelect",
      editable: false,
      valueOptions: ["Выполнено", "В работе", "Заморожено", "Просрочено"],
      width: 300,
    },
    {
      field: "customer",
      headerClassName: "anotherTitle",
      editable: false,
      headerName: "Заказчик",
      width: 300,
    },
  ];

  const handleRowClick = (project) => {
    dispatch(
      setProject({
        name: project.row.name,
        description: project.row.description,
        create_at: project.row.create_at,
        deadline: project.row.deadline,
        budget: project.row.budget,
        customer: project.row.customer,
        status: project.row.status,
      })
    );
    navigate(`/project`);
  };

  return (
    <Card sx={{ width: "80%", borderRadius: 5, p: 2, mx: "auto", mt: 4 }}>
      <Typography
        gutterBottom
        variant="h5"
        color="text.secondary"
        component="div"
        align="left"
      >
        Текущие проекты:
      </Typography>
      <Box
        sx={{
          maxHeight: 500,
          width: "100%",
          "& .anotherTitle": {
            fontSize: "24px",
          },
        }}
      >
        {userData === "У вас нет проектов" ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              mt: 7,
            }}
          >
            <Typography variant="h6" align="center" mb={2}>
              У вас еще нет проектов, над которыми вы тут работаете :(
            </Typography>
            <Link to="/addProject">
              <Button variant="contained">Добавить проект</Button>
            </Link>
          </Box>
        ) : (
          <Box sx={{ "& .MuiDataGrid-root": { mb: 4 } }}>
            <DataGrid
              sx={{
                borderColor: "white",
                fontSize: "18px",
                minHeight: "200px",
              }}
              rows={userData}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              slots={{ toolbar: CustomToolbar }}
              onRowClick={handleRowClick}
            />
          </Box>
        )}
      </Box>
    </Card>
  );
}
