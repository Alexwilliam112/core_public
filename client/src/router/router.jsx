import * as React from "react";
import {
    createBrowserRouter,
    redirect
} from "react-router-dom";
import Swal from 'sweetalert2';
import BaseLayout from "../layouts/BaseLayout";
import HomePage from "../views/HomePage";
import LoginPage from "../views/LoginPage";
import Buying from "../views/buyings/Buying";
import CashierCreate from "../views/cashier/CashierCreate";
import CashierEdit from "../views/cashier/CashierEdit";
import Cashier from "../views/cashier/cashier";
import ExpenseType from "../views/expenseTypes/ExpenseType";
import IngredientCreate from "../views/masterIngredient/IngredientCreate";
import IngredientEdit from "../views/masterIngredient/IngredientEdit";
import MasterIngredient from "../views/masterIngredient/MasterIngredient";
import MenuCreate from "../views/menus/MenuCreate";
import MenuEdit from "../views/menus/MenuEdit";
import Menus from "../views/menus/Menus";
import Payroll from "../views/payrolls/Payroll";
import GeneralReports from "../views/reports/GeneralReports";
import Routines from "../views/routines/Routine";

export const url = 'https://coreappalex.xyz'
const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage url={url} />
    },
    {
        element: <BaseLayout />,
        loader: () => {
            if (!localStorage.access_token) {
                Swal.fire({
                    icon: "error",
                    title: "Please Log In First",
                })
                return redirect('/login')
            }
            return null
        },
        children: [
            {
                path: '/',
                element: <HomePage />
            },
            {
                path: '/users',
                element: <HomePage />
            },
            {
                path: '/auths',
                element: <HomePage />
            },
            {
                path: '/jobtitles',
                element: <HomePage />
            },
            {
                path: '/cashier',
                element: <Cashier url={url}/>
            },
            {
                path: '/cashier/create',
                element: <CashierCreate url={url} />
            },
            {
                path: '/cashier/:id',
                element: <CashierEdit url={url} />
            },
            {
                path: '/masteringredient',
                element: <MasterIngredient url={url} />
            },
            {
                path: '/masteringredient/create',
                element: <IngredientCreate url={url} />
            },
            {
                path: '/masteringredient/edit/:id',
                element: <IngredientEdit url={url} />
            },
            {
                path: '/menus',
                element: <Menus url={url} />
            },
            {
                path: '/menus/create',
                element: <MenuCreate url={url} />
            },
            {
                path: '/menus/edit/:id',
                element: <MenuEdit url={url} />
            },
            {
                path: '/buyings',
                element: <Buying url={url} />
            },
            {
                path: '/payrolls',
                element: <Payroll url={url} />
            },
            {
                path: '/expensetypes',
                element: <ExpenseType url={url} />
            },
            {
                path: '/routines',
                element: <Routines url={url} />
            },
            {
                path: '/genreports',
                element: <GeneralReports url={url} />
            }
        ]
    }
]);

export default router