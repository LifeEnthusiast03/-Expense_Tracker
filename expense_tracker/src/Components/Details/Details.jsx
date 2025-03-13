import React from 'react'
import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import useTransaction from '../../useTransaction';

import useStyles from './style'
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

function Details({title}) {
    const classes = useStyles();
    const {total,chartdata}=useTransaction(title);
    // console.log(chartdata);
    

  return (
    <Card className={title==="income"? classes.income:classes.expense}>
      <CardHeader title={title} />
      <CardContent>
        <Typography  variant="h5">
          {total}
        </Typography>
        <Doughnut data={chartdata}/>
        
      </CardContent>
    </Card>
  )
}

export default Details