CREATE TABLE balance_sheet_statements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    reportedCurrency VARCHAR(10) NOT NULL,
    cik VARCHAR(20),
    fillingDate DATE,
    acceptedDate DATETIME,
    calendarYear YEAR,
    period VARCHAR(5),
    cashAndCashEquivalents BIGINT,
    shortTermInvestments BIGINT,
    cashAndShortTermInvestments BIGINT,
    netReceivables BIGINT,
    inventory BIGINT,
    otherCurrentAssets BIGINT,
    totalCurrentAssets BIGINT,
    propertyPlantEquipmentNet BIGINT,
    goodwill BIGINT,
    intangibleAssets BIGINT,
    goodwillAndIntangibleAssets BIGINT,
    longTermInvestments BIGINT,
    taxAssets BIGINT,
    otherNonCurrentAssets BIGINT,
    totalNonCurrentAssets BIGINT,
    otherAssets BIGINT,
    totalAssets BIGINT NOT NULL,
    accountPayables BIGINT,
    shortTermDebt BIGINT,
    taxPayables BIGINT,
    deferredRevenue BIGINT,
    otherCurrentLiabilities BIGINT,
    totalCurrentLiabilities BIGINT,
    longTermDebt BIGINT,
    deferredRevenueNonCurrent BIGINT,
    deferredTaxLiabilitiesNonCurrent BIGINT,
    otherNonCurrentLiabilities BIGINT,
    totalNonCurrentLiabilities BIGINT,
    otherLiabilities BIGINT,
    capitalLeaseObligations BIGINT,
    totalLiabilities BIGINT NOT NULL,
    preferredStock BIGINT,
    commonStock BIGINT,
    retainedEarnings BIGINT,
    accumulatedOtherComprehensiveIncomeLoss BIGINT,
    othertotalStockholdersEquity BIGINT,
    totalStockholdersEquity BIGINT,
    totalEquity BIGINT,
    totalLiabilitiesAndStockholdersEquity BIGINT,
    minorityInterest BIGINT,
    totalLiabilitiesAndTotalEquity BIGINT,
    totalInvestments BIGINT,
    totalDebt BIGINT,
    netDebt BIGINT,
    link VARCHAR(255),
    finalLink VARCHAR(255),
    UNIQUE KEY uq_symbol_date (symbol, date)
);
