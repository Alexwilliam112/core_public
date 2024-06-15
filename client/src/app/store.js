import { configureStore } from '@reduxjs/toolkit'
import buyings from '../features/Buyings/Buying'
import expenseTypes from '../features/ExpenseTypes/ExpenseTypes'
import masterIngredients from '../features/MasterIngredient/MasterIngredients'
import menus from '../features/Menus/Menus'
import payrolls from '../features/Payrolls/Payrolls'
import routines from '../features/Routines/Routines'
import sales from '../features/Sales/Sales'

export default configureStore({
    reducer: {
        sales,
        menus,
        buyings,
        routines,
        payrolls,
        expenseTypes,
        masterIngredients
    }
})