import React,{useContext} from 'react'
import { List as MUIList, ListItem, ListItemAvatar, ListItemText, Avatar, ListItemSecondaryAction, IconButton, Slide } from '@mui/material'
import { Delete, MoneyOff } from '@mui/icons-material'
import {  red,green } from "@mui/material/colors";
import useStyles from './style'
import { expenseTrackerContex } from '../../../Context/Context';
function List() {
    const classes = useStyles();
    const {deleteTransaction,transaction}=useContext(expenseTrackerContex);
    const deleteTransactionHandler=(id)=>{
        deleteTransaction(id);
    }


  return (
   <MUIList dense={false}  className={classes.list}>
      
            {transaction.map((transaction)=>(
                <Slide direction='down' in mountOnEnter unmountOnExit key={transaction.id}>
                <ListItem>
                <ListItemAvatar>
                        <Avatar
                            sx={{
                            color: "#fff",
                            backgroundColor: transaction.type === "income" ? green[500] : red[500],
                            }}>
                            <MoneyOff />
                         </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={transaction.category} secondary={`$${transaction.amount} - ${transaction.date}`}/>
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={()=>deleteTransactionHandler(transaction.id)}>
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