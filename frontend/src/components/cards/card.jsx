import * as React from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

export default function CardMP(props) {
  return (
    <Card sx={{ width: "90%", borderRadius: 5, minWidth: "250px", mb: 2 }}>
      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            gutterBottom
            variant="h5"
            color="text.secondary"
            component="div"
          >
            {props.title}
          </Typography>
          {props.img}
        </Stack>
      </Box>
      <Divider variant="middle" />
      <Box sx={{ p: 2 }}>
        <Typography color="text.primary" variant="h5">
          {props.fill}
        </Typography>
      </Box>
    </Card>
  );
}
