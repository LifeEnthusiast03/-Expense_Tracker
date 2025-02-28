import React from 'react'
import { List as MUIList, ListItem, ListItemAvatar, ListItemText, Avatar, ListItemSecondaryAction, IconButton, Slide } from '@mui/material'
import { Delete, MoneyOff } from '@mui/icons-material'
import useStyles from './style'
function List() {
    const classes = useStyles();
    const Transaction=[
        {id:1,type:"Income",Amount:10000,catagory:"Salary",date:new Date()}
    ]
  return (
   <MUIList dense={false}  className={classes.list}>
      
            {Transaction.map((transaction)=>(
                <Slide direction='down' in mountOnEnter unmountOnExit key={transaction.id}>
                <ListItem>
                    <ListItemAvatar className={transaction.type === "Income" ? classes.avatarIncome : classes.avatarExpense}>
                        <Avatar>
                        <MoneyOff/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={transaction.catagory} secondary={`$${transaction.Amount} - ${transaction.date}`}/>
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick="">
                            <Delete/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
                </Slide>
            ))}
       
   </MUIList>
  )
}

export default List