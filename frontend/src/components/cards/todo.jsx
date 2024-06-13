import * as React from "react";
import Card from "@mui/material/Card";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import AddTask from "../adds/addTask";
import { useEffect, useState } from "react";
import axios from "axios";

function CustomToolbar() {
  return (
    <Box sx={{ p: 1, pb: 0, alignSelf: "flex-end" }}>
      <GridToolbarQuickFilter />
    </Box>
  );
}

export default function Todo() {
  const [todoData, setTodoData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const todoPost = await axios.post("api/user_tasks/");
        setTodoData(todoPost.data);
        console.log(todoData);
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    }
    fetchData();
  }, []);

  const columns = [
    {
      field: "name",
      headerName: "Задача",
      headerClassName: "anotherTitle",
      editable: true,
      type: "string",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "deadline",
      headerClassName: "anotherTitle",
      editable: false,
      headerName: "Сделать до",
      type: "string",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "status",
      headerName: "Статус",
      headerClassName: "anotherTitle",
      type: "singleSelect",
      editable: false,
      valueOptions: ["Выполнено", "В работе", "Заморожено", "Просрочено"],
      flex: 1,
      minWidth: 150,
    },
    {
      field: "description",
      headerClassName: "anotherTitle",
      editable: false,
      headerName: "Описание",
      flex: 2,
      minWidth: 200,
    },
  ];

  const handleRowClick = (params) => {
    setSelectedTask(params.row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTask(null);
  };

  return (
    <Card
      sx={{
        minWidth: "250px",
        width: "45%",
        borderRadius: 5,
        p: 2,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        gutterBottom
        variant="h5"
        color="text.secondary"
        component="div"
        align="left"
      >
        Текущие задачи:
      </Typography>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          "& .anotherTitle": {
            fontSize: "24px",
          },
        }}
      >
        {todoData.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "70%",
              mt: 7,
            }}
          >
            <Typography variant="h6" align="center" mb={2}>
              У вас еще нет задач, над которыми ведётся работа :(
            </Typography>
            <AddTask />
          </Box>
        ) : (
          <Box sx={{ "& .MuiDataGrid-root": { mb: 4 } }}>
            <DataGrid
              sx={{
                borderColor: "white",
                fontSize: "18px",
                minHeight: "200px",
              }}
              rows={todoData}
              columns={columns}
              autoHeight
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
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Детали задачи</DialogTitle>
        <DialogContent>
          {selectedTask && (
            <>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Задача:</Typography>
                <Typography variant="body1">{selectedTask.name}</Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Сделать до:</Typography>
                <Typography variant="body1">{selectedTask.deadline}</Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Статус:</Typography>
                <Typography variant="body1">{selectedTask.status}</Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Описание:</Typography>
                <Typography variant="body1">
                  {selectedTask.description}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
