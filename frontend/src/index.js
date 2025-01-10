import { createRoot } from 'react-dom/client';
import IncomeStatement from "./IncomeStatement";
import React from "react";

const container = document.getElementById("root");
const root = createRoot(container)

root.render(
    <IncomeStatement />
)