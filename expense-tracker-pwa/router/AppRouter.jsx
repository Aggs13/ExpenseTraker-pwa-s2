import {BrowserRouter,Routes,Route} from "react-router-dom"

import HomeScreen from "../pages/HomeScreen"
import ExpensesScreen from "../pages/ExpensesScreen"
import ExpenseDetailScreen from "../pages/ExpenseDetailScreen"
import SettingsScreen from "../pages/SettingsScreen"
import NewExpenseScreen from "../pages/NewExpenseScreen"

export default function AppRouter(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/new" element={<NewExpenseScreen />} />
        <Route path="/expenses" element={<ExpensesScreen />} />
        <Route path="/expenses/:id" element={<ExpenseDetailScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
      </Routes>
    </BrowserRouter>

  )
}