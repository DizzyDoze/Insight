from sqlalchemy.exc import SQLAlchemyError

from models.income_statement import IncomeStatement


class IncomeHandler:
    """
    MySQL operations on income statements, handling create, read, update and delete.

    Attributes:
        __session: SQLAlchemy session for MySQL database connection
    """

    def __init__(self, session):
        self.__session = session

    def create(self, data):
        """
        Insert a new income statement into database from the given data.

        Args:
            data (dict): Dictionary containing income statement data from FMP API

        Returns:
            dict: Message indicating success/failure and the record ID if successful
        """
        try:
            income_statement = IncomeStatement(
                symbol=data["symbol"],
                date=data["date"],
                revenue=data["revenue"],
                gross_profit=data["grossProfit"],
                gross_profit_ratio=data.get("grossProfitRatio"),
                operating_income=data["operatingIncome"],
                operating_income_ratio=data.get("operatingIncomeRatio"),
                net_income=data["netIncome"],
                net_income_ratio=data.get("netIncomeRatio"),
                eps=data["eps"],
                operating_expenses=data.get("operatingExpenses"),
                research_and_development_expenses=data.get("researchAndDevelopmentExpenses"),
                income_tax_expense=data.get("incomeTaxExpense"),
                depreciation_and_amortization=data.get("depreciationAndAmortization"),
                ebitda=data.get("ebitda"),
                total_other_income_expenses_net=data.get("totalOtherIncomeExpensesNet"),
                reported_currency=data.get("reportedCurrency"),
                filling_date=data.get("fillingDate"),
                accepted_date=data.get("acceptedDate"),
                period=data.get("period")
            )
            self.__session.add(income_statement)
            self.__session.commit()
            return {"message": "Record created successfully", "id": income_statement.id}

        except SQLAlchemyError as e:
            self.__session.rollback()
            return {"error": str(e)}

    def read(self, symbol, page=1, offset=10):
        """
        Retrieve income statements with pagination based on given symbol.

        Args:
            symbol (str): Company stock symbol
            page (int): Page number, default 1
            offset (int): Number of records per page, default 10

        Returns:
            dict: Dictionary containing list of statements, pagination info and status message
        """
        try:
            total = self.__session.query(IncomeStatement.id).filter(IncomeStatement.symbol == symbol).count()
            records = (self.__session.query(IncomeStatement)
                       .filter(IncomeStatement.symbol == symbol)
                       .order_by(IncomeStatement.date.desc())
                       .offset((page - 1) * offset)
                       .limit(offset)
                       .all())
            return {
                "data": [record.to_dict() for record in records],
                "pagination": {
                    "total": total,
                    "page": page,
                    "offset": offset,
                    "pages": (total + offset - 1) // offset if total > 0 else 0
                },
                "message": "Records retrieved successfully"
            }
        except SQLAlchemyError as e:
            return {"error": str(e)}

    def update(self, id, data):
        """
        Update income statement based on given statement ID and new data.

        Args:
            id (int): Statement unique ID
            data (dict): New data for updating the statement

        Returns:
            dict: Message indicating success/failure of the update operation
        """
        try:
            record = self.__session.query(IncomeStatement).filter(IncomeStatement.id == id).first()
            if not record:
                return {"error": "Record not found"}

            for k, v in data.items():
                record[k] = v

            self.__session.commit()
            return {"message": "Record updated successfully"}
        except SQLAlchemyError as e:
            self.__session.rollback()
            return {"error": str(e)}

    def delete(self, id):
        """
        Delete income statement based on the statement ID.

        Args:
            id (int): Statement unique ID

        Returns:
            dict: Message indicating success/failure of the delete operation
        """
        record = self.__session.query(IncomeStatement).filter(IncomeStatement.id == id).first()
        if not record:
            return {"error": "Record not found"}

        self.__session.delete(record)
        self.__session.commit()
        return {"message": "Record deleted successfully"}
