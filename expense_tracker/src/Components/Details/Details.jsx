import React from 'react'
import { Card, CardHeader, CardContent, Typography } from "@mui/material";
// import {Doughnut} from 'react-chartjs-2'
import useStyles from './style'

function Details({title}) {
    const classes = useStyles();
  return (
    <Card className={title==="INCOME"? classes.income:classes.expense}>
      <CardHeader title={title} />
      <CardContent>
        <Typography  variant="h5">
          Total Balance $100
        </Typography>
        {/* <Doughnut data="DATA" /> */}
        
      </CardContent>
    </Card>
  )
}

export default Details