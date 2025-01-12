import { createRoot } from 'react-dom/client';
import IncomeStatement from "./IncomeStatement";
import React from "react";
import './global.css';
import BalanceSheetStatement from './BalanceSheetStatement';
import CashFlowStatement from './CashFlowStatement';

const container = document.getElementById("root");
const root = createRoot(container)

root.render(
    <div>
        <IncomeStatement />
        <BalanceSheetStatement />
        <CashFlowStatement />
    </div>
)