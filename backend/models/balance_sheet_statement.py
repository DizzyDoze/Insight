from sqlalchemy import Column, Integer, String, BigInteger, Date, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class BalanceSheetStatement(Base):
    __tablename__ = "balance_sheet_statements"

    id = Column(Integer, primary_key=True, autoincrement=True)
    symbol = Column(String(10), nullable=False)
    date = Column(Date, nullable=False)
    reportedCurrency = Column(String(10), nullable=False)
    cik = Column(String(20))
    fillingDate = Column(Date)
    acceptedDate = Column(Date)
    calendarYear = Column(Integer)
    period = Column(String(5))
    
    # Assets
    cashAndCashEquivalents = Column(BigInteger)
    shortTermInvestments = Column(BigInteger)
    cashAndShortTermInvestments = Column(BigInteger)
    netReceivables = Column(BigInteger)
    inventory = Column(BigInteger)
    otherCurrentAssets = Column(BigInteger)
    totalCurrentAssets = Column(BigInteger)
    propertyPlantEquipmentNet = Column(BigInteger)
    goodwill = Column(BigInteger)
    intangibleAssets = Column(BigInteger)
    goodwillAndIntangibleAssets = Column(BigInteger)
    longTermInvestments = Column(BigInteger)
    taxAssets = Column(BigInteger)
    otherNonCurrentAssets = Column(BigInteger)
    totalNonCurrentAssets = Column(BigInteger)
    otherAssets = Column(BigInteger)
    totalAssets = Column(BigInteger, nullable=False)
    totalInvestments = Column(BigInteger)
    
    # Liabilities
    accountPayables = Column(BigInteger)
    shortTermDebt = Column(BigInteger)
    taxPayables = Column(BigInteger)
    deferredRevenue = Column(BigInteger)
    otherCurrentLiabilities = Column(BigInteger)
    totalCurrentLiabilities = Column(BigInteger)
    longTermDebt = Column(BigInteger)
    deferredRevenueNonCurrent = Column(BigInteger)
    deferredTaxLiabilitiesNonCurrent = Column(BigInteger)
    otherNonCurrentLiabilities = Column(BigInteger)
    totalNonCurrentLiabilities = Column(BigInteger)
    otherLiabilities = Column(BigInteger)
    capitalLeaseObligations = Column(BigInteger)
    totalLiabilities = Column(BigInteger, nullable=False)
    totalDebt = Column(BigInteger)
    netDebt = Column(BigInteger)
    
    # Equity
    preferredStock = Column(BigInteger)
    commonStock = Column(BigInteger)
    retainedEarnings = Column(BigInteger)
    accumulatedOtherComprehensiveIncomeLoss = Column(BigInteger)
    otherTotalStockholdersEquity = Column(BigInteger)
    totalStockholdersEquity = Column(BigInteger)
    minorityInterest = Column(BigInteger)
    
    # Totals
    totalEquity = Column(BigInteger)
    totalLiabilitiesAndStockholdersEquity = Column(BigInteger)
    totalLiabilitiesAndTotalEquity = Column(BigInteger)
    
    # Links
    link = Column(String(255))
    finalLink = Column(String(255))

    __table_args__ = (
        UniqueConstraint('symbol', 'date', name='uq_symbol_date'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'symbol': self.symbol,
            'date': self.date.isoformat() if self.date else None,
            'reportedCurrency': self.reportedCurrency,
            'cik': self.cik,
            'fillingDate': self.fillingDate.isoformat() if self.fillingDate else None,
            'acceptedDate': self.acceptedDate.isoformat() if self.acceptedDate else None,
            'calendarYear': self.calendarYear,
            'period': self.period,
            # Assets
            'cashAndCashEquivalents': self.cashAndCashEquivalents,
            'shortTermInvestments': self.shortTermInvestments,
            'cashAndShortTermInvestments': self.cashAndShortTermInvestments,
            'netReceivables': self.netReceivables,
            'inventory': self.inventory,
            'otherCurrentAssets': self.otherCurrentAssets,
            'totalCurrentAssets': self.totalCurrentAssets,
            'propertyPlantEquipmentNet': self.propertyPlantEquipmentNet,
            'goodwill': self.goodwill,
            'intangibleAssets': self.intangibleAssets,
            'goodwillAndIntangibleAssets': self.goodwillAndIntangibleAssets,
            'longTermInvestments': self.longTermInvestments,
            'taxAssets': self.taxAssets,
            'otherNonCurrentAssets': self.otherNonCurrentAssets,
            'totalNonCurrentAssets': self.totalNonCurrentAssets,
            'otherAssets': self.otherAssets,
            'totalAssets': self.totalAssets,
            'totalInvestments': self.totalInvestments,
            # Liabilities
            'accountPayables': self.accountPayables,
            'shortTermDebt': self.shortTermDebt,
            'taxPayables': self.taxPayables,
            'deferredRevenue': self.deferredRevenue,
            'otherCurrentLiabilities': self.otherCurrentLiabilities,
            'totalCurrentLiabilities': self.totalCurrentLiabilities,
            'longTermDebt': self.longTermDebt,
            'deferredRevenueNonCurrent': self.deferredRevenueNonCurrent,
            'deferredTaxLiabilitiesNonCurrent': self.deferredTaxLiabilitiesNonCurrent,
            'otherNonCurrentLiabilities': self.otherNonCurrentLiabilities,
            'totalNonCurrentLiabilities': self.totalNonCurrentLiabilities,
            'otherLiabilities': self.otherLiabilities,
            'capitalLeaseObligations': self.capitalLeaseObligations,
            'totalLiabilities': self.totalLiabilities,
            'totalDebt': self.totalDebt,
            'netDebt': self.netDebt,
            # Equity
            'preferredStock': self.preferredStock,
            'commonStock': self.commonStock,
            'retainedEarnings': self.retainedEarnings,
            'accumulatedOtherComprehensiveIncomeLoss': self.accumulatedOtherComprehensiveIncomeLoss,
            'otherTotalStockholdersEquity': self.otherTotalStockholdersEquity,
            'totalStockholdersEquity': self.totalStockholdersEquity,
            'minorityInterest': self.minorityInterest,
            'totalEquity': self.totalEquity,
            'totalLiabilitiesAndStockholdersEquity': self.totalLiabilitiesAndStockholdersEquity,
            'totalLiabilitiesAndTotalEquity': self.totalLiabilitiesAndTotalEquity,
            'link': self.link,
            'finalLink': self.finalLink
        }