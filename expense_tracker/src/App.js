import React from "react";
import Details from "./Components/Details/Details";
import Main from "./Components/Main/Main";
import { Grid2 } from "@mui/material";
import useStyles from "./style2";
import { Trackprovider } from "./Context/Context";
const App = () => {
  const classes = useStyles();
  return (
    <Trackprovider>
     <Grid2 className={classes.grid} container spacing={0} alignItems="center" justify="center" style={{height: '100vh'}}>
      <Grid2 item xs={12} sm={4}>
        <Details title='INCOME'/>
      </Grid2>
      <Grid2 item xs={12} sm={3}>
          <Main/>
      </Grid2>
      <Grid2 item xs={12} sm={4}>
        <Details title='EXPENCE'/>
      </Grid2>
    </Grid2>
    </Trackprovider>

       
 

    

  )
};

export default App;
