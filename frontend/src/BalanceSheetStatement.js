import React, {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from './components/ui/card';
import {ChevronDown, ChevronUp} from 'lucide-react';
import {Slider} from './components/ui/slider';

/**
 * Component for displaying and filtering balance sheet statements
 * @returns The rendered balance sheet component
 */
const BalanceSheetStatement = () => {
    // State management
    const [statements, setStatements] = useState([]);
    const [filteredStatements, setFilteredStatements] = useState([]);
    const [sortConfig, setSortConfig] = useState({key: null, direction: "asc"});
    const [symbol, setSymbol] = useState("");

    // Initial ranges for filters with reasonable values
    const defaultRanges = {
        date: {
            min: new Date("2000-01-01").getTime(),
            max: new Date("2024-12-31").getTime()
        },
        totalAssets: {min: 0, max: 1000000000},
        totalLiabilities: {min: 0, max: 1000000000},
        totalEquity: {min: 0, max: 1000000000},
        netDebt: {min: 0, max: 1000000000},
        cashAndShortTermInvestments: {min: 0, max: 1000000000}
    };

    // initial values are the same ranges
    const [filters, setFilters] = useState(defaultRanges);
    const [ranges, setRanges] = useState(defaultRanges);

    /**
     * Resets all state values to their defaults
     */
    const resetState = () => {
        setStatements([]);              // clear all statements
        setFilteredStatements([]);      // clear filtered results
        setRanges(defaultRanges);             // reset range limits
        setFilters(defaultRanges);            // reset filters which has been dragged and updated
        setSortConfig({key: null, direction: "asc"});
    };

    // fetch initial data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    const BASE_URL = "http://localhost:8080/api/balance-sheet-statement";

    // fetch data from backend
    const fetchData = async () => {
        try {
            const url = `${BASE_URL}?symbol=${symbol}`;
            console.log("Fetching from:", url);
            const response = await fetch(url);
            const data = await response.json();

            // If no data or empty array, reset state
            if (!data.data || data.data.length === 0) {
                resetState();
                return;
            }

            // Update the statements
            setStatements(data.data);

            // Calculate new ranges based on the data
            if (data.data && data.data.length > 0) {
                const newRanges = {
                    date: {
                        min: Math.min(...data.data.map(d => new Date(d.date).getTime())),
                        max: Math.max(...data.data.map(d => new Date(d.date).getTime()))
                    },
                    totalAssets: {
                        min: Math.min(...data.data.map(d => d.totalAssets)),
                        max: Math.max(...data.data.map(d => d.totalAssets))
                    },
                    totalLiabilities: {
                        min: Math.min(...data.data.map(d => d.totalLiabilities)),
                        max: Math.max(...data.data.map(d => d.totalLiabilities))
                    },
                    totalEquity: {
                        min: Math.min(...data.data.map(d => d.totalEquity)),
                        max: Math.max(...data.data.map(d => d.totalEquity))
                    },
                    netDebt: {
                        min: Math.min(...data.data.map(d => d.netDebt)),
                        max: Math.max(...data.data.map(d => d.netDebt))
                    },
                    cashAndShortTermInvestments: {
                        min: Math.min(...data.data.map(d => d.cashAndShortTermInvestments)),
                        max: Math.max(...data.data.map(d => d.cashAndShortTermInvestments))
                    }
                };

                // Update ranges and filters based on the new data we fetched, the actual range
                setRanges(newRanges);
                setFilters(newRanges);

                // Apply initial sort by date
                setSortConfig({key: 'date', direction: 'desc'});
            }

            // Apply filters and sort
            applyFiltersAndSort();
        } catch (e) {
            console.log("Error fetching data: ", e);
            resetState();
        }
    };

    /**
     * Handles Enter key press in symbol input
     * @param e keyboard event
     */
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchData();
        }
    };

    /**
     * Calculates appropriate step size for slider based on range
     * @param key Field name
     * @param min Minimum value
     * @param max Maximum value
     * @returns number Step size
     */
    const calculateStep = (key, min, max) => {
        if (key === 'date') return 24 * 60 * 60; // One day
        return Math.max(10, Math.floor((max - min) / 1000)); // At least $10 or 1/1000th of range
    };

    // Apply filters and sorting to the data
    const applyFiltersAndSort = () => {
        // create a new array with the same elements inside, original one not affected, lambda to filter each item
        let filtered = [...statements].filter(statement => {
            const date = new Date(statement.date).getTime();
            return date >= filters.date.min &&
                date <= filters.date.max &&
                Object.keys(filters).every(key =>
                    key === 'date' ||
                    (statement[key] >= filters[key].min && statement[key] <= filters[key].max)
                );
        });

        // Apply sorting if sort key is set
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aVal = sortConfig.key === "date" ?
                    new Date(a[sortConfig.key]).getTime() :
                    a[sortConfig.key];
                const bVal = sortConfig.key === "date" ?
                    new Date(b[sortConfig.key]).getTime() :
                    b[sortConfig.key];

                if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }
        setFilteredStatements(filtered);
    };

    // Handle column header clicks for sorting
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key) {
            direction = sortConfig.direction === "asc" ? "desc" : "asc";
        }
        setSortConfig({key, direction});
    };

    // hook, if sortConfig or filters updated, reapply the filter and sort for current statements data
    useEffect(() => {
        applyFiltersAndSort();
    }, [sortConfig, filters]);

    /**
     * Renders a slider component for filtering data
     * @param key - The data field to filter on
     * @param label - Display label for the slider
     * @param isDate - Whether the field is a date
     * @returns Rendered slider component
     */
    const filterSlider = (key, label, isDate = false) => {
        const range = ranges[key];
        const currentValue = filters[key];
        const hasData = statements && statements.length > 0;

        return (
            <div className="mb-4 px-4">
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">{label}</span>
                    <span className="text-sm text-gray-500">
                        {isDate
                            ? `${formatDate(currentValue.min)} - ${formatDate(currentValue.max)}`
                            : `${formatNumber(currentValue.min)} - ${formatNumber(currentValue.max)}`}
                    </span>
                </div>
                <div className={`w-full ${!hasData ? 'opacity-50' : ''}`}>
                    <Slider
                        className="w-full relative"
                        min={range.min}
                        max={range.max}
                        step={calculateStep(key, range.min, range.max)}
                        value={[currentValue.min, currentValue.max]}
                        onValueChange={(value) => {
                            if (!hasData) return;
                            setFilters(prev => ({
                                ...prev,                            // copy the previous state, original one not mutated
                                [key]: {min: value[0], max: value[1]}   // only update the value of given key
                            }));
                        }}
                        disabled={!hasData}                         // if there's no statement, slider is disabled
                    />
                </div>
            </div>
        );
    };

    /**
     * Formats a number into a currency string
     * @param num The number to format
     * @returns Formatted currency string like "$1,234"
     */
    const formatNumber = (num) => {
        if (num === Infinity || num === undefined) return '$∞';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num);
    };

    /**
     * Formats a timestamp into a date string
     * @param timestamp Unix timestamp
     * @returns Formatted date like "Jan 2024"
     */
    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        });
    };

    /**
     * Renders the sort icon based on current sort configuration
     * @param key Column key to check against current sort config
     * @returns Up or down chevron icon
     */
    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <ChevronUp className="opacity-30 h-4 w-4"/>;
        }
        return sortConfig.direction === 'asc'
            ? <ChevronUp className="h-4 w-4"/>
            : <ChevronDown className="h-4 w-4"/>;
    };

    return (
        <div className="w-full p-4">
            <Card className="w-full bg-white shadow-lg rounded-lg">
                <CardHeader className="border-b border-gray-200 p-4">
                    <div className="text-center mb-6">
                        <CardTitle className="text-2xl font-bold text-gray-800">
                            Balance Sheet Statement
                        </CardTitle>
                    </div>
                    <div className="flex gap-4 mt-4">
                        <input
                            type="text"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter company symbol (e.g., AAPL)"
                            className="px-3 py-2 border rounded-md flex-grow"
                        />
                        <button
                            onClick={fetchData}
                            className="flex h-full flex-row items-center justify-center rounded-lg border border-gray-800 px-4 py-2 align-middle text-gray-800 hover:shadow-buttonSecondary focus:border-gray-900 focus:text-gray-900"
                        >
                            Fetch Data
                        </button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {filterSlider('date', 'Date Range', true)}
                        {filterSlider('totalAssets', 'Total Assets')}
                        {filterSlider('totalLiabilities', 'Total Liabilities')}
                        {filterSlider('totalEquity', 'Total Equity')}
                        {filterSlider('netDebt', 'Net Debt')}
                        {filterSlider('cashAndShortTermInvestments', 'Cash & Short-term Investments')}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                {[
                                    {key: 'date', label: 'Date'},
                                    {key: 'totalAssets', label: 'Total Assets'},
                                    {key: 'totalLiabilities', label: 'Total Liabilities'},
                                    {key: 'totalEquity', label: 'Total Equity'},
                                    {key: 'netDebt', label: 'Net Debt'},
                                    {key: 'cashAndShortTermInvestments', label: 'Cash & Investments'}
                                ].map(({key, label}) => (
                                    <th
                                        key={key}
                                        onClick={() => handleSort(key)}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    >
                                        <div className="flex items-center gap-1">
                                            {label}
                                            {renderSortIcon(key)}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStatements.map((statement, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(new Date(statement.date).getTime())}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatNumber(statement.totalAssets)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatNumber(statement.totalLiabilities)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatNumber(statement.totalEquity)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatNumber(statement.netDebt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatNumber(statement.cashAndShortTermInvestments)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BalanceSheetStatement;