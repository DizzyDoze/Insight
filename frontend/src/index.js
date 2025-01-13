import { createRoot } from 'react-dom/client';
import IncomeStatement from "./components/IncomeStatement";
import React from "react";
import './global.css';
import BalanceSheetStatement from './components/BalanceSheetStatement';
import CashFlowStatement from './components/CashFlowStatement';

const container = document.getElementById("root");
const root = createRoot(container)

root.render(
    <div>
        <IncomeStatement />
        <BalanceSheetStatement />
        <CashFlowStatement />
    </div>
)