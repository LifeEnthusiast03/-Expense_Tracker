import React from 'react'
import { Card, CardHeader, CardContent, Typography,Grid2,Divider } from "@mui/material";
import useStyles from "./style";

function Main() {
    const classes = useStyles();
  return (
      <Card className={classes.root2}>
        <CardHeader title="Expense Tracker" subheader="Powered by Speechly"/>
        <CardContent>
          <Typography align="center" variant="h5">Total Balance $100</Typography>
          <Typography variant="subtitle1" style={{ lineHeight: '1.5em', marginTop: '20px'}}>
            {/* InfoCard.... */}
            Try saying: Add income for $100 in Category Salary for Monday...
          </Typography>
          <Divider />
          {/* Form */}
        </CardContent>
        <CardContent className={classes.cartContent}>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12}>
              {/* List */}
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
  )
}

export default Main