import React,{useState,useContext} from "react";
import { expenseTrackerContex } from "../../../Context/Context";
import {v4 as uuidv4} from 'uuid';
import { TextField,Typography,Grid,Button,FormControl,InputLabel,Select,MenuItem,} from "@mui/material";
import { incomeCategories,expenseCategories } from '../../../Constants/Constant';
import useStyles from "./style";


const Form = () => {
  const classes = useStyles();
  const intialstate={
    amount:"",
    category:"",
    type:"",
    date:new Date()
  }
  const [state,setstate]=useState(intialstate);
  const {addTransaction}=useContext(expenseTrackerContex);
  const createTransaction=()=>{
    const transaction={...state,amount:Number(state.amount),id:uuidv4()};
    addTransaction(transaction);
    setstate(intialstate);
  }
  const selectedCategories = state.type === 'income' ? incomeCategories : expenseCategories;

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
          <Select value={state.type} onChange={(e)=>setstate({...state,type:e.target.value})}>  


            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select value={state.category} onChange={(e)=>setstate({...state,category:e.target.value})}>
          {selectedCategories.map((c) => <MenuItem key={c.type} value={c.type}>{c.type}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <TextField type="number" label='Amount' fullWidth value={state.amount} onChange={(e)=>setstate({...state,amount:e.target.value})}/>
      </Grid>
      <Grid item xs={6}>
        <TextField type="date"  fullWidth value={intialstate.value} onChange={(e)=>setstate({...state,date:e.target.value})} />
      </Grid>
      <Grid item xs={12}>
        <Button className={classes.Button} variant="outlined" color="primary" fullWidth onClick={createTransaction}>
          Create
        </Button>
      </Grid>
    </Grid>
  );
};

export default Form;
