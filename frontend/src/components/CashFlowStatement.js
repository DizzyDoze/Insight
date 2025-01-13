import {useState, useEffect} from "react";
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Slider } from './ui/slider';

/**
 * Component for displaying and filtering cash flow statements
 * @returns The rendered cash flow statement component
 */
const CashFlowStatement = () => {
    // Initial ranges with sensible defaults for financial metrics [-1B to 1B]
    const defaultRanges = {
        date: {
            min: new Date("2000-01-01").getTime(),
            max: new Date("2024-12-31").getTime()
        },
        net_cash_provided_by_operating_activities: { min: 0, max: 1000000000 },
        net_cash_used_for_investing_activities: { min: -1000000000, max: 0 },
        net_cash_used_provided_by_financing_activities: { min: -1000000000, max: 1000000000 },
        free_cash_flow: { min: -1000000000, max: 1000000000 },
        net_change_in_cash: { min: -1000000000, max: 1000000000 }
    };

    /**
     * Resets all state values to their defaults
     */
    const resetState = () => {
        setStatements([]);
        setFilteredStatements([]);
        setRanges(defaultRanges);
        setFilters(defaultRanges);
        setSortConfig({ key: null, direction: "asc" });
    };

    // State management for component data
    const [statements, setStatements] = useState([]); // Raw data from API
    const [filteredStatements, setFilteredStatements] = useState([]); // Filtered and sorted data
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc"}); // Sorting configuration
    const [symbol, setSymbol] = useState(""); // Stock symbol to fetch
    const [filters, setFilters] = useState(defaultRanges); // Current filter values
    const [ranges, setRanges] = useState(defaultRanges); // Available range limits

    /**
     * Fetches initial data when component mounts
     */
    useEffect(() => {
        fetchData();
    }, []);

    const BACKEND_HOST = "insight-lirl.onrender.com";
    const BASE_URL = `https://${BACKEND_HOST}/api/cash-flow-statement`;

    /**
     * Fetches cash flow statement data from backend API
     * Updates state with new data and recalculates ranges
     */
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
                    net_cash_provided_by_operating_activities: {
                        min: Math.min(...data.data.map(d => d.net_cash_provided_by_operating_activities)),
                        max: Math.max(...data.data.map(d => d.net_cash_provided_by_operating_activities))
                    },
                    net_cash_used_for_investing_activities: {
                        min: Math.min(...data.data.map(d => d.net_cash_used_for_investing_activities)),
                        max: Math.max(...data.data.map(d => d.net_cash_used_for_investing_activities))
                    },
                    net_cash_used_provided_by_financing_activities: {
                        min: Math.min(...data.data.map(d => d.net_cash_used_provided_by_financing_activities)),
                        max: Math.max(...data.data.map(d => d.net_cash_used_provided_by_financing_activities))
                    },
                    free_cash_flow: {
                        min: Math.min(...data.data.map(d => d.free_cash_flow)),
                        max: Math.max(...data.data.map(d => d.free_cash_flow))
                    },
                    net_change_in_cash: {
                        min: Math.min(...data.data.map(d => d.net_change_in_cash)),
                        max: Math.max(...data.data.map(d => d.net_change_in_cash))
                    }
                };
                
                // Update ranges and filters with the new data
                setRanges(newRanges);
                setFilters(newRanges);
                
                // Apply initial sort by date
                setSortConfig({ key: 'date', direction: 'desc' });
            }
            
            // Apply filters and sort
            applyFiltersAndSort();
        } catch (e) {
            console.log("Error fetching data: ", e);
            resetState();
        }
    };

    /**
     * Handles Enter key press for symbol input
     * @param {KeyboardEvent} e
     */
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchData();
        }
    };

    /**
     * Calculates appropriate step size for slider based on field type
     * @param {string} key - Field name
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Calculated step size
     */
    const calculateStep = (key, min, max) => {
        if (key === 'date') return 24 * 60 * 60; // One day
        return Math.max(10, Math.floor((max - min) / 1000)); // At least $10 or 1/1000th of range
    };

    /**
     * Calculates actual min/max ranges from current statement data
     * Updates ranges state with new calculated values
     */
    const calculateRanges = () => {
        const newRanges = {
            date: {
                min: Math.min(...statements.map(d => new Date(d.date).getTime())),
                max: Math.max(...statements.map(d => new Date(d.date).getTime()))
            },
            net_cash_provided_by_operating_activities: {
                min: Math.min(...statements.map(d => d.net_cash_provided_by_operating_activities)),
                max: Math.max(...statements.map(d => d.net_cash_provided_by_operating_activities))
            },
            net_cash_used_for_investing_activities: {
                min: Math.min(...statements.map(d => d.net_cash_used_for_investing_activities)),
                max: Math.max(...statements.map(d => d.net_cash_used_for_investing_activities))
            },
            net_cash_used_provided_by_financing_activities: {
                min: Math.min(...statements.map(d => d.net_cash_used_provided_by_financing_activities)),
                max: Math.max(...statements.map(d => d.net_cash_used_provided_by_financing_activities))
            },
            free_cash_flow: {
                min: Math.min(...statements.map(d => d.free_cash_flow)),
                max: Math.max(...statements.map(d => d.free_cash_flow))
            },
            net_change_in_cash: {
                min: Math.min(...statements.map(d => d.net_change_in_cash)),
                max: Math.max(...statements.map(d => d.net_change_in_cash))
            }
        };
        setRanges(newRanges);
    };

    /**
     * Updates ranges whenever statements data changes
     */
    useEffect(() => {
        calculateRanges();
    }, [statements]);

    /**
     * Applies current filters and sorting to statements data
     * Updates filteredStatements state with results
     */
    const applyFiltersAndSort = () => {
        // Filter statements based on current filters
        let filtered = [...statements].filter(statement => {
            const date = new Date(statement.date).getTime();
            return date >= filters.date.min && 
                    date <= filters.date.max && 
                    Object.keys(filters).every(key => key === 'date' || (statement[key] >= filters[key].min && statement[key] <= filters[key].max));
        });

        // Sort filtered statements
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

    /**
     * Handles column header clicks for sorting
     * @param {string} key - Column to sort by
     */
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key) {
            direction = sortConfig.direction === "asc" ? "desc" : "asc";
        }
        setSortConfig({ key, direction });
    };

    /**
     * Reapplies filters and sort when sortConfig changes
     */
    useEffect(() => {
        applyFiltersAndSort();
    }, [sortConfig, filters]); // Re-apply filters and sort when sortConfig or filters change

    /**
     * Renders a filter slider for a specific field
     * @param {string} key - Field name to filter
     * @param {string} label - Display label for the filter
     * @param {boolean} isDate - Whether the field is a date
     * @returns {JSX.Element} Rendered filter slider component
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
                                ...prev,
                                [key]: { min: value[0], max: value[1] }
                            }));
                        }}
                        disabled={!hasData}
                    />
                </div>
            </div>
        );
    };
    
    /**
     * Formats a number as a currency string
     * @param {number} num - Number to format
     * @returns {string} Formatted currency string
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
     * Formats a timestamp as a date string
     * @param {number} timestamp - Unix timestamp to format
     * @returns {string} Formatted date string
     */
    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        });
    };
    
    /**
     * Renders sort direction icon for a column
     * @param {string} key - Column name
     * @returns {JSX.Element} Rendered sort icon component
     */
    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <ChevronUp className="opacity-30 h-4 w-4" />;
        }
        return sortConfig.direction === 'asc' 
            ? <ChevronUp className="h-4 w-4" />
            : <ChevronDown className="h-4 w-4" />;
    };
      
    return (
        <div className="w-full p-4">
            <Card className="w-full bg-white shadow-lg rounded-lg">
                <CardHeader className="border-b border-gray-200 p-4">
                    <div className="text-center mb-6">
                        <CardTitle className="text-2xl font-bold text-gray-800">
                            Cash Flow Statement
                        </CardTitle>
                    </div>
                    <div className="flex gap-4 mt-4">
                        <input
                            type="text"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filterSlider('date', 'Date Range', true)}
                        {filterSlider('net_cash_provided_by_operating_activities', 'Operating Cash Flow')}
                        {filterSlider('net_cash_used_for_investing_activities', 'Investing Cash Flow')}
                        {filterSlider('net_cash_used_provided_by_financing_activities', 'Financing Cash Flow')}
                        {filterSlider('free_cash_flow', 'Free Cash Flow')}
                        {filterSlider('net_change_in_cash', 'Net Change in Cash')}
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 text-left">
                                    <th className="p-3 text-sm font-semibold text-gray-600 cursor-pointer"
                                        onClick={() => handleSort('date')}>
                                        <div className="flex items-center">
                                            Date {renderSortIcon('date')}
                                        </div>
                                    </th>
                                    {Object.entries({
                                        net_cash_provided_by_operating_activities: 'Operating Cash Flow',
                                        net_cash_used_for_investing_activities: 'Investing Cash Flow',
                                        net_cash_used_provided_by_financing_activities: 'Financing Cash Flow',
                                        free_cash_flow: 'Free Cash Flow',
                                        net_change_in_cash: 'Net Change in Cash'
                                    }).map(([key, label]) => (
                                        <th key={key} 
                                            className="p-3 text-sm font-semibold text-gray-600 cursor-pointer"
                                            onClick={() => handleSort(key)}>
                                            <div className="flex items-center">
                                                {label} {renderSortIcon(key)}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStatements.map((statement, index) => (
                                    <tr 
                                        key={statement.id} 
                                        className={`border-b border-gray-100 hover:bg-gray-50 
                                            ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                    >
                                        <td className="p-3 text-sm text-gray-600">
                                            {formatDate(new Date(statement.date))}
                                        </td>
                                        <td className="p-3 text-sm text-gray-600">
                                            {formatNumber(statement.net_cash_provided_by_operating_activities)}
                                        </td>
                                        <td className="p-3 text-sm text-gray-600">
                                            {formatNumber(statement.net_cash_used_for_investing_activities)}
                                        </td>
                                        <td className="p-3 text-sm text-gray-600">
                                            {formatNumber(statement.net_cash_used_provided_by_financing_activities)}
                                        </td>
                                        <td className="p-3 text-sm text-gray-600">
                                            {formatNumber(statement.free_cash_flow)}
                                        </td>
                                        <td className="p-3 text-sm text-gray-600">
                                            {formatNumber(statement.net_change_in_cash)}
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

export default CashFlowStatement;