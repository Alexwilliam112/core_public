'use strict'

class Authorizations {

    constructor() {
        if (Authorizations.instance === undefined) {

            this.USER_MANAGEMENT_READ = "USER_MANAGEMENT_READ"
            this.USER_MANAGEMENT_EDIT = "USER_MANAGEMENT_EDIT"
            this.USER_MANAGEMENT_DELETE = "USER_MANAGEMENT_DELETE"
            this.USER_MANAGEMENT_TERMINATE = "USER_MANAGEMENT_TERMINATE"
            this.USER_MANAGEMENT_REACTIVATE = "USER_MANAGEMENT_REACTIVATE"

            this.JOBTITLE_READ = "JOBTITLE_READ"
            this.JOBTITLE_EDIT = "JOBTITLE_EDIT"
            this.JOBTITLE_DELETE = "JOBTITLE_DELETE"

            this.CASHIER_READ = "CASHIER_READ"
            this.CASHIER_EDIT = "CASHIER_EDIT"
            this.CASHIER_DELETE = "CASHIER_DELETE"
            this.CASHIER_PROCESS = "CASHIER_PROCESS"
            this.CASHIER_ABORT = "CASHIER_ABORT"
            this.CASHIER_POST = "CASHIER_POST"

            this.MASTER_INGREDIENT_READ = "MASTER_INGREDIENT_READ"
            this.MASTER_INGREDIENT_EDIT = "MASTER_INGREDIENT_EDIT"
            this.MASTER_INGREDIENT_DELETE = "MASTER_INGREDIENT_DELETE"

            this.MENUS_READ = "MENUS_READ"
            this.MENUS_EDIT = "MENUS_EDIT"
            this.MENUS_DELETE = "MENUS_DELETE"

            this.BUYINGS_READ = "BUYINGS_READ"
            this.BUYINGS_EDIT = "BUYINGS_EDIT"
            this.BUYINGS_DELETE = "BUYINGS_DELETE"
            this.BUYINGS_PROCESS = "BUYINGS_PROCESS"
            this.BUYINGS_ABORT = "BUYINGS_ABORT"
            this.BUYINGS_POST = "BUYINGS_POST"

            this.ROUTINE_EXPENSES_READ = "ROUTINE_EXPENSES_READ"
            this.ROUTINE_EXPENSES_EDIT = "ROUTINE_EXPENSES_EDIT"
            this.ROUTINE_EXPENSES_DELETE = "ROUTINE_EXPENSES_DELETE"
            this.ROUTINE_EXPENSES_PROCESS = "ROUTINE_EXPENSES_PROCESS"
            this.ROUTINE_EXPENSES_ABORT = "ROUTINE_EXPENSES_ABORT"
            this.ROUTINE_EXPENSES_POST = "ROUTINE_EXPENSES_POST"

            this.PAYROLL_READ = "PAYROLL_READ"
            this.PAYROLL_EDIT = "PAYROLL_EDIT"
            this.PAYROLL_DELETE = "PAYROLL_DELETE"
            this.PAYROLL_PROCESS = "PAYROLL_PROCESS"
            this.PAYROLL_ABORT = "PAYROLL_ABORT"
            this.PAYROLL_POST = "PAYROLL_POST"

            Authorizations.instance = this
        }
        return Authorizations.instance
    }

    get newUser() {
        const authTemplate = Object.keys(this).map((key) => {
            return {
                "authorization": key,
                "value": false
            }
        })
        return authTemplate
    }
}

const Authorization = new Authorizations()
Object.freeze(Authorization)
module.exports = Authorization