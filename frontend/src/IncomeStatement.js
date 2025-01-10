import React, {useState, useEffect} from "react";
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Slider } from './components/ui/slider';

const IncomeStatement = () => {
    // raw data from API response
    const [statements, setStatements] = useState([]);
    // filterred and sorted data for display
    const [filteredStatements, setFilteredStatements] = useState([]);
    // configuration for sorting: column(date, revenue, etc), order(asc, desc)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc"})
    const [symbol, setSymbol] = useState("")
    
    const [filters, setFilters] = useState({
        date: {min: new Date("2020-01-01").getTime(), max: new Date("2024-12-31").getTime()},
        revenue: {min: 0, max: Infinity},
        net_income: {min: 0, max: Infinity},
        gross_profit: {min: 0, max: Infinity},
        operating_income: {min: 0, max: Infinity},
        eps: {min: 0, max: Infinity}
    })

    const [ranges, setRanges] = useState({
        date: {min: new Date("2020-01-01").getTime(), max: new Date("2024-12-31").getTime()},
        revenue: {min: 0, max: Infinity},
        net_income: {min: 0, max: Infinity},
        gross_profit: {min: 0, max: Infinity},
        operating_income: {min: 0, max: Infinity},
        eps: {min: 0, max: Infinity}
    })

    // fetch initial data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    const BASE_URL = "http://localhost:8080/api/income-statement";

    // fetch data from backend
    const fetchData = async () => {
        try {
            const url = `${BASE_URL}?symbol=${symbol}`;
            console.log("Fetching from:", url);
            const response = await fetch(url);
            const data = await response.json();
            setStatements(data.data);
        } catch (e) {
            console.log("Error fetching data: ", e);
        }
    };

    // once we get the data response, calculate actual range(min, max) for each field
    const calculateRanges = () => {
        if (!statements || statements.length === 0) {
            console.log("No statements data available");
            return;
        }

        // convert each date string to Date object and use Math to find min/max
        const newRanges = {
            date: {
                min: Math.min(...statements.map(s => new Date(s.date).getTime())),
                max: Math.max(...statements.map(s => new Date(s.date).getTime()))
            },
            revenue: {
                min: Math.min(...statements.map(s => s.revenue)),
                max: Math.max(...statements.map(s => s.revenue))
            },
            net_income: {
                min: Math.min(...statements.map(s => s.net_income)),
                max: Math.max(...statements.map(s => s.net_income))
            },
            gross_profit: {
                min: Math.min(...statements.map(s => s.gross_profit)),
                max: Math.max(...statements.map(s => s.gross_profit))
            },
            operating_income: {
                min: Math.min(...statements.map(s => s.operating_income)),
                max: Math.max(...statements.map(s => s.operating_income))
            },
            eps: {
                min: Math.min(...statements.map(s => s.eps)),
                max: Math.max(...statements.map(s => s.eps))
            }
        };

        setRanges(newRanges);       // update range for all fields
        
        // set filters to min, max to show all data at initialization
        setFilters(prev => {
            const newFilters = {...prev};
            Object.keys(newRanges).forEach(key => {
                newFilters[key] = {min: newRanges[key].min, max: newRanges[key].max};
            });
            return newFilters;
        });
    }

    // Calculate ranges whenever statements data changes(only after we get valid statements)
    useEffect(() => {
        if (statements && statements.length > 0) {
            calculateRanges();
            applyFiltersAndSort();
        }
    }, [statements]);

    const applyFiltersAndSort = () => {
        // [...statements] creates a copy, filter each statement using lambda function defined inside
        let filtered = [...statements].filter(statement => {
            const date = new Date(statement.date).getTime();
            return date >= filters.date.min && 
                    date <= filters.date.max && 
                    Object.keys(filters).every(key => key === 'date' || (statement[key] >= filters[key].min && statement[key] <= filters[key].max));
        })
        // define lambda compare function, sort each element in the filtered
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                // handle date format
                const aVal = sortConfig.key === "date" ? 
                    new Date(a[sortConfig.key]).getTime :
                    a[sortConfig.key]
                const bVal = sortConfig.key === "date" ?
                    new Date(b[sortConfig.key]).getTime :
                    b[sortConfig.key]
                
                if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            })
        }
        setFilteredStatements(filtered);
    }

    // hanlder column header clicks for sorting
    const handleSort = (key) => {
        let direction = "asc";
        // only toggle the direction if we are clicking the same title
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction })
    }
    
    return (
        <div>
            <CardHeader>
                <CardTitle>
                    Income Statement
                </CardTitle>
                <div>
                    <input
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        placeholder="Enter company symbol (e.g., AAPL)"
                    />
                    <button onClick={fetchData}>Fetch Data</button>
                </div>
                <div>
                    render filter sliders
                </div>
            </CardHeader>

            <CardContent>
                <table>
                    <thead>
                        <tr>
                            {Object.entries({
                                date: "Date",
                                revenue: "Revenue",
                                net_income: "Net Income",
                                gross_profit: "Gross Profit",
                                eps: "EPS",
                                operating_income: "Operating Income"
                            }).map(([key, label]) => (
                                <th key={key} onClick={() => handleSort(key)}>
                                    {label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStatements.map((statement, index) => (
                            <tr key={statement.id}>
                                <td>{statement.date}</td>
                                <td>{statement.revenue}</td>
                                <td>{statement.net_income}</td>
                                <td>{statement.gross_profit}</td>
                                <td>{statement.eps}</td>
                                <td>{statement.operating_income}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </div>

    );
}


export default IncomeStatement;