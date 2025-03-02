import React from 'react'
import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import useTransaction from '../../useTransaction';
// import {Doughnut} from 'react-chartjs-2'
import useStyles from './style'

function Details({title}) {
    const classes = useStyles();
    const {total}=useTransaction(title);

  return (
    <Card className={title==="income"? classes.income:classes.expense}>
      <CardHeader title={title} />
      <CardContent>
        <Typography  variant="h5">
          {total}
        </Typography>
        {/* <Doughnut data="DATA" /> */}
        
      </CardContent>
    </Card>
  )
}

export default Details