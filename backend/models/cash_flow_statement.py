from sqlalchemy import Column, Integer, String, BigInteger, Date, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class CashFlowStatement(Base):
    """
    SQLAlchemy model for cash flow statements.

    Attributes:
        id (int): Primary key
        symbol (str): Company stock symbol
        date (Date): Statement date
        ...etc
    """
    __tablename__ = "cash_flow_statements"

    id = Column(Integer, primary_key=True, autoincrement=True)
    symbol = Column(String(10), nullable=False)
    date = Column(Date, nullable=False)
    reported_currency = Column(String(10), nullable=False)
    cik = Column(String(20))
    filling_date = Column(Date)
    accepted_date = Column(Date)
    calendar_year = Column(Integer)
    period = Column(String(5))
    
    # Operating Activities
    net_income = Column(BigInteger)
    depreciation_and_amortization = Column(BigInteger)
    deferred_income_tax = Column(BigInteger)
    stock_based_compensation = Column(BigInteger)
    change_in_working_capital = Column(BigInteger)
    accounts_receivables = Column(BigInteger)
    inventory = Column(BigInteger)
    accounts_payables = Column(BigInteger)
    other_working_capital = Column(BigInteger)
    other_non_cash_items = Column(BigInteger)
    net_cash_provided_by_operating_activities = Column(BigInteger, nullable=False)
    
    # Investing Activities
    investments_in_property_plant_and_equipment = Column(BigInteger)
    acquisitions_net = Column(BigInteger)
    purchases_of_investments = Column(BigInteger)
    sales_maturities_of_investments = Column(BigInteger)
    other_investing_activities = Column(BigInteger)
    net_cash_used_for_investing_activities = Column(BigInteger, nullable=False)
    
    # Financing Activities
    debt_repayment = Column(BigInteger)
    common_stock_issued = Column(BigInteger)
    common_stock_repurchased = Column(BigInteger)
    dividends_paid = Column(BigInteger)
    other_financing_activities = Column(BigInteger)
    net_cash_used_provided_by_financing_activities = Column(BigInteger, nullable=False)
    
    # Cash Flow Metrics
    free_cash_flow = Column(BigInteger)
    net_change_in_cash = Column(BigInteger)
    cash_at_end_of_period = Column(BigInteger)
    cash_at_beginning_of_period = Column(BigInteger)
    operating_cash_flow = Column(BigInteger)
    capital_expenditure = Column(BigInteger)
    
    # Links
    link = Column(String(255))
    final_link = Column(String(255))

    __table_args__ = (
        UniqueConstraint('symbol', 'date', name='uq_symbol_date'),
    )

    def to_dict(self):
        """
        Convert the CashFlowStatement instance to a dictionary.

        Returns:
            dict: Dictionary containing all cash flow statement data with
                 dates converted to ISO format strings
        """
        return {
            'id': self.id,
            'symbol': self.symbol,
            'date': self.date.isoformat() if self.date else None,
            'reported_currency': self.reported_currency,
            'cik': self.cik,
            'filling_date': self.filling_date.isoformat() if self.filling_date else None,
            'accepted_date': self.accepted_date.isoformat() if self.accepted_date else None,
            'calendar_year': self.calendar_year,
            'period': self.period,
            'net_income': self.net_income,
            'depreciation_and_amortization': self.depreciation_and_amortization,
            'deferred_income_tax': self.deferred_income_tax,
            'stock_based_compensation': self.stock_based_compensation,
            'change_in_working_capital': self.change_in_working_capital,
            'accounts_receivables': self.accounts_receivables,
            'inventory': self.inventory,
            'accounts_payables': self.accounts_payables,
            'other_working_capital': self.other_working_capital,
            'other_non_cash_items': self.other_non_cash_items,
            'net_cash_provided_by_operating_activities': self.net_cash_provided_by_operating_activities,
            'investments_in_property_plant_and_equipment': self.investments_in_property_plant_and_equipment,
            'acquisitions_net': self.acquisitions_net,
            'purchases_of_investments': self.purchases_of_investments,
            'sales_maturities_of_investments': self.sales_maturities_of_investments,
            'other_investing_activities': self.other_investing_activities,
            'net_cash_used_for_investing_activities': self.net_cash_used_for_investing_activities,
            'debt_repayment': self.debt_repayment,
            'common_stock_issued': self.common_stock_issued,
            'common_stock_repurchased': self.common_stock_repurchased,
            'dividends_paid': self.dividends_paid,
            'other_financing_activities': self.other_financing_activities,
            'net_cash_used_provided_by_financing_activities': self.net_cash_used_provided_by_financing_activities,
            'free_cash_flow': self.free_cash_flow,
            'net_change_in_cash': self.net_change_in_cash,
            'cash_at_end_of_period': self.cash_at_end_of_period,
            'cash_at_beginning_of_period': self.cash_at_beginning_of_period,
            'operating_cash_flow': self.operating_cash_flow,
            'capital_expenditure': self.capital_expenditure,
            'link': self.link,
            'final_link': self.final_link
        }