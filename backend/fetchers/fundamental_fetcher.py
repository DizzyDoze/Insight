import requests
import os
import time


from handlers.cash_flow_handler import CashFlowHandler
from handlers.balance_sheet_handler import BalanceSheetHandler
from handlers.income_handler import IncomeHandler
from settings import *
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


class FundamentalFetcher:
    """
    class to fetch FMP fundamental data, including income statement, balance sheet statement and cash flow statement.

    Attributes:

    __base_url: base url for FMP API
    __symbol_url: url for statement related API
    __api_key: FMP API KEY from the environment we set before the script being run
    """

    def __init__(self):
        self.__base_url = "https://financialmodelingprep.com/api/v3"
        self.__symbol_url = f"{self.__base_url}/financial-statement-symbol-lists"
        self.__api_key = os.getenv("FMP_API_KEY")

        if not self.__api_key:
            raise Exception("FMP_API_KEY Not Found")
    
    def fetch_all_symbols(self):
        """
        Fetches a list of all available company symbols from the FMP API.

        :return: a list of symbols
        """
        try:
            res = requests.get(self.__symbol_url)
            if res and res.status_code == 200:
                data = res.json()
                return data
        except Exception as e:
            print(e)

    def fetch_statement(self, company_symbol, statement_type="income-statement", period="annual"):
        """
        Fetches a list of statements for given company

        :param company_symbol: symbol of the company, like "AAPL"
        :param statement_type: statement type, ["income-statement", "balance-sheet-statement", "cash-flow-statement"]
        :param period: period of the statement, ["annual", "quarter"]
        :return: a list of statements for given company
        """
        url = f"{self.__base_url}/{statement_type}/{company_symbol}?period={period}&apikey={self.__api_key}"
        try:
            res = requests.get(url)
            if res and res.status_code == 200:
                data = res.json()
                print(f"Sample data for {company_symbol}:", data[0] if data else "No data")  # Debug print
                return data
        except Exception as e:
            print(f"Error fetching data for {company_symbol}:", e)
            return []


if __name__ == '__main__':
    engine = create_engine(f"mysql+pymysql://root:{os.getenv('PASSWORD')}@{HOST}/{DATABASE_NAME}")
    Session = sessionmaker(bind=engine)
    session = Session()
    # handlers for db operations
    handlers = [IncomeHandler(session), BalanceSheetHandler(session), CashFlowHandler(session)]
    # fetcher requesting FMP data
    fetcher = FundamentalFetcher()

    # top 100
    us_companies_symbols = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "BRK.B", "JPM", "V",
    "UNH", "JNJ", "WMT", "PG", "MA", "HD", "XOM", "BAC", "PFE", "KO",
    "CSCO", "PEP", "MRK", "ABBV", "AVGO", "TMO", "COST", "DIS", "CMCSA", "ADBE",
    "NFLX", "VZ", "NKE", "INTC", "ORCL", "AMGN", "MCD", "QCOM", "TXN", "CVX",
    "CRM", "LLY", "UPS", "BMY", "PM", "AMD", "HON", "BA", "MS", "GS",
    "IBM", "CAT", "BLK", "MDT", "LMT", "AXP", "GE", "SCHW", "T", "DE",
    "C", "LOW", "SPGI", "NEE", "PLD", "MO", "RTX", "PYPL", "INTU", "NOW",
    "UNP", "ISRG", "BKNG", "ZTS", "CVS", "ADP", "SYK", "CCI", "TGT", "DUK",
    "COP", "CI", "ELV", "BDX", "APD", "SO", "LIN", "CB", "EW", "ICE",
    "ADI", "REGN", "GILD", "VRTX", "F", "MRNA", "CL", "NSC", "DHR", "KMB",
    "SHW", "GM", "ITW", "SBUX", "MMM", "WM", "PLTR", "PANW", "SQ", "ROKU"
]

    statement_types = ["income-statement", "balance-sheet-statement", "cash-flow-statement"]
    # switch handler base on statement type
    for index in range(len(statement_types)):
        statement_type = statement_types[index]
        handler = handlers[index]

        for symbol in us_companies_symbols:
            print(f"\nProcessing {symbol}|{statement_type}...")
            data = fetcher.fetch_statement(symbol, statement_type=statement_type)

            if not data:
                print(f"No data received for {symbol}")
                continue
                
            try:
                for item in data:
                    result = handler.create(item)

                    if "error" in result:
                        print(f"Error creating record for {symbol}:", result["error"])
                    else:
                        print(f"Successfully created record for {symbol}")
                session.commit()
            except Exception as e:
                print(f"Error processing {symbol}|{statement_type}:", str(e))
                session.rollback()
            print(f"Finished processing {symbol}|{statement_type}")
            time.sleep(1)
