import express from 'express'
import wrapController from '../utils/routehelper'
import {addExpenseWithBudgetCheck,
        deleteExpense,
        getUserExpense} from '../controllers/expensecontrollers'

const route = express.Router();
route.get('/getdata',wrapController(getUserExpense));
route.post('/addexpense',wrapController(addExpenseWithBudgetCheck));
route.delete('/deleteexpese',wrapController(deleteExpense));