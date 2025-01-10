import React, {useState, useEffect} from "react";
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Slider } from './components/ui/slider';

const IncomeStatement = () => {
    // Initial ranges with sensible defaults
    const defaultRanges = {
        date: {
            min: new Date("2000-01-01").getTime(),
            max: new Date("2024-12-31").getTime()
        },
        // range [0, 1 billion]
        revenue: { min: 0, max: 1000000000 },
        net_income: { min: 0, max: 1000000000 },
        gross_profit: { min: 0, max: 1000000000 },
        operating_income: { min: 0, max: 1000000000 },
        eps: { min: 0, max: 10 }
    };

    // Reset state to initial values
    const resetState = () => {
        setStatements([]);
        setFilteredStatements([]);
        setRanges(defaultRanges);
        setFilters(defaultRanges);
        setSortConfig({ key: null, direction: "asc" });
    };

    // raw data from API response
    const [statements, setStatements] = useState([]);
    // filterred and sorted data for display
    const [filteredStatements, setFilteredStatements] = useState([]);
    // configuration for sorting: column(date, revenue, etc), order(asc, desc)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc"})
    const [symbol, setSymbol] = useState("")
    
    const [filters, setFilters] = useState(defaultRanges);
    const [ranges, setRanges] = useState(defaultRanges);

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
                    revenue: {
                        min: Math.min(...data.data.map(d => d.revenue)),
                        max: Math.max(...data.data.map(d => d.revenue))
                    },
                    net_income: {
                        min: Math.min(...data.data.map(d => d.net_income)),
                        max: Math.max(...data.data.map(d => d.net_income))
                    },
                    gross_profit: {
                        min: Math.min(...data.data.map(d => d.gross_profit)),
                        max: Math.max(...data.data.map(d => d.gross_profit))
                    },
                    operating_income: {
                        min: Math.min(...data.data.map(d => d.operating_income)),
                        max: Math.max(...data.data.map(d => d.operating_income))
                    },
                    eps: {
                        min: Math.min(...data.data.map(d => d.eps)),
                        max: Math.max(...data.data.map(d => d.eps))
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

    // Handle Enter key press for symbol input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchData();
        }
    };

    // Calculate step size based on range
    const calculateStep = (key, min, max) => {
        if (key === 'date') return 24 * 60 * 60; // One day
        if (key === 'eps') return 0.01; // Small offset for EPS
        return Math.max(10, Math.floor((max - min) / 1000)); // At least $10 or 1/1000th of range
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
                newFilters[key] = { min: newRanges[key].min, max: newRanges[key].max };
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
                    new Date(a[sortConfig.key]).getTime() :
                    a[sortConfig.key]
                const bVal = sortConfig.key === "date" ?
                    new Date(b[sortConfig.key]).getTime() :
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
        if (sortConfig.key === key) {
            direction = sortConfig.direction === "asc" ? "desc" : "asc";
        }
        setSortConfig({ key, direction });
        applyFiltersAndSort(); // Apply sorting immediately
    };

    useEffect(() => {
        applyFiltersAndSort();
    }, [sortConfig]); // Re-apply filters and sort when sortConfig changes

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
                            applyFiltersAndSort();
                        }}
                        disabled={!hasData}
                    />
                </div>
            </div>
        );
    };
    
    const formatNumber = (num) => {
        if (num === Infinity || num === undefined) return '$∞';
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(num);
      };
    
    const formatDate = (timestamp) => {
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
    };
    
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
                  Income Statement
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
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Fetch Data
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterSlider('date', 'Date Range', true)}
                {filterSlider('revenue', 'Revenue')}
                {filterSlider('net_income', 'Net Income')}
                {filterSlider('gross_profit', 'Gross Profit')}
                {filterSlider('operating_income', 'Operating Income')}
                {filterSlider('eps', 'EPS')}
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
                        revenue: 'Revenue',
                        net_income: 'Net Income', 
                        gross_profit: 'Gross Profit',
                        eps: 'EPS',
                        operating_income: 'Operating Income'
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
                        <td className="p-3 text-sm text-gray-600">{formatNumber(statement.revenue)}</td>
                        <td className="p-3 text-sm text-gray-600">{formatNumber(statement.net_income)}</td>
                        <td className="p-3 text-sm text-gray-600">{formatNumber(statement.gross_profit)}</td>
                        <td className="p-3 text-sm text-gray-600">{statement.eps.toFixed(2)}</td>
                        <td className="p-3 text-sm text-gray-600">{formatNumber(statement.operating_income)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      );
}


export default IncomeStatement;