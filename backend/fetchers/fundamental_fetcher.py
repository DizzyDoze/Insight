import requests
import os

from handlers.income_handler import IncomeHandler
from settings import *
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


class FundamentalFetcher:

    def __init__(self):
        self.__base_url = "https://financialmodelingprep.com/api/v3"
        self.__api_key = os.getenv("FMP_API_KEY")

        if not self.__api_key:
            raise Exception("FMP_API_KEY Not Found")

    def fetch_statement(self, company_symbol, statement_type="income-statement", period="annual"):
        url = f"{self.__base_url}/{statement_type}/{company_symbol}?period={period}&apikey={self.__api_key}"
        print(url)
        try:
            res = requests.get(url)
            if res and res.status_code == 200:
                data = res.json()
                return data
        except Exception as e:
            print(e)


if __name__ == '__main__':
    fetcher = FundamentalFetcher()
    data = fetcher.fetch_statement("AAPL")
    print(data)
    engine = create_engine(f"mysql+pymysql://root:{os.getenv('PASSWORD')}@{HOST}/{DATABASE_NAME}")
    Session = sessionmaker(bind=engine)
    session = Session()

    income_handler = IncomeHandler(session)

    for item in data:
        income_handler.create(item)
    print("ok")
