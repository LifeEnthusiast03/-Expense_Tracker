import React from "react";
import { TextField,Typography,Grid,Button,FormControl,InputLabel,Select,MenuItem,} from "@mui/material";
import useStyles from "./style";

const Form = () => {
  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography>
            ...
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select>
            <MenuItem value="Income">Income</MenuItem>
            <MenuItem value="Expense">Expense</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select>
            <MenuItem value="Business">Business</MenuItem>
            <MenuItem value="Salary">Salary</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <TextField type="number" label="Amount" fullWidth />
      </Grid>
      <Grid item xs={6}>
        <TextField type="date"  fullWidth />
      </Grid>
      <Grid item xs={12}>
        <Button className={classes.Button} variant="outlined" color="primary" fullWidth>
          Create
        </Button>
      </Grid>
    </Grid>
  );
};

export default Form;
