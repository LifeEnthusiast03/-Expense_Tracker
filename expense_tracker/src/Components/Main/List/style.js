import {  red,green } from "@mui/material/colors";
import { makeStyles } from "@mui/styles";
export default makeStyles((theme) => ({
    avatarIncome: {
      color: '#fff',
      backgroundColor: green[500],
    },
    avatarExpense: {
      color: theme.palette.getContrastText(red[500]),
      backgroundColor: red[500],
    },
    list: {
      maxHeight: '150px',
      overflow: 'auto',
    },
  }));