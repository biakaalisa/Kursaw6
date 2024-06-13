/*import React, { useState, useEffect } from "react";
import { Box, Button, Card, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Customer() {
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
      <img src="https://i.pinimg.com/564x/70/c1/9c/70c19c086a89228f69de1be77a02085a.jpg"></img>
    </Box>
  );
}*/

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import { TextField } from "@mui/material";
import axios from "axios";

export default function Customer() {
  const [open, setOpen] = React.useState(false);
  const [newSkill, setNewSkill] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };
  return (
    <div>
      <Button onClick={handleClickOpen}>Open select dialog</Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Добавление навыка</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                fullWidth
                margin="normal"
                required
                label="soft-skill"
                autoFocus
                onChange={(e) => setNewSkill(e.target.value)}
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={async () => {
              let ss = await axios.get("api/get_soft_skill/");
              ss = await axios.get("api/get_hard_skill/");
              handleClose();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                await axios.post("api/create_soft_skill/", {
                  name: newSkill,
                  title: newSkill,
                });
              } catch {
                alert("Ошибка добавленния навыка");
              } finally {
                handleClose();
              }
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
