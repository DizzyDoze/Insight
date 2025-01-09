from datetime import datetime
from sqlalchemy import and_

from models.income_statement import IncomeStatement


class IncomeFilter:
    def __init__(self, session):
        self.__session = session

    def __apply_filters(self, query, date_range=None, revenue_range=None, net_income_range=None, sort_by=None, order="asc"):
        if date_range and date_range.get("start") and date_range.get("end"):
            start_date = datetime.strptime(date_range["start"], "%Y-%m-%d").date()
            end_date = datetime.strptime(date_range["end"], "%Y-%m-%d").date()
            query = query.filter(and_(
                IncomeStatement.date >= start_date,
                IncomeStatement.date <= end_date
            ))

        if revenue_range and revenue_range.get("min") and revenue_range.get("max"):
            query = query.filter(and_(
                IncomeStatement.revenue >= revenue_range["min"],
                IncomeStatement.revenue <= revenue_range["max"]
            ))

        if net_income_range and net_income_range.get("min") and net_income_range.get("max"):
            query = query.filter(and_(
                IncomeStatement.net_income >= net_income_range['min'],
                IncomeStatement.net_income <= net_income_range['max']
            ))

        if sort_by:
            # getattr treats sort_by as variable, will use the string for attribute name
            sort_column = getattr(IncomeStatement, sort_by)

            if order == "desc":
                sort_column = sort_column.desc()
            query = query.order_by(sort_column)
        return query

    def get_filtered_records(self, symbol, filters):
        print(symbol)
        base_query = self.__session.query(IncomeStatement).filter(IncomeStatement.symbol == symbol)
        filtered_query = self.__apply_filters(
            query=base_query,
            date_range=filters.get("date_range"),
            revenue_range=filters.get("revenue_range"),
            net_income_range=filters.get("net_income_range"),
            sort_by=filters.get("sort_by"),
            order=filters.get("order", "asc")
        )
        print(filtered_query)
        return filtered_query.all()     # .all .first .count .one are actual queries in db
