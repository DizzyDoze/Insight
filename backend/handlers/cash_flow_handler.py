from sqlalchemy.exc import SQLAlchemyError
from models.cash_flow_statement import CashFlowStatement

class CashFlowHandler:
    def __init__(self, session):
        self.__session = session

    def create(self, data):
        try:
            cash_flow = CashFlowStatement(
                symbol=data["symbol"],
                date=data["date"],
                reported_currency=data.get("reportedCurrency"),
                cik=data.get("cik"),
                filling_date=data.get("fillingDate"),
                accepted_date=data.get("acceptedDate"),
                calendar_year=data.get("calendarYear"),
                period=data.get("period"),
                net_income=data.get("netIncome"),
                depreciation_and_amortization=data.get("depreciationAndAmortization"),
                deferred_income_tax=data.get("deferredIncomeTax"),
                stock_based_compensation=data.get("stockBasedCompensation"),
                change_in_working_capital=data.get("changeInWorkingCapital"),
                accounts_receivables=data.get("accountsReceivables"),
                inventory=data.get("inventory"),
                accounts_payables=data.get("accountsPayables"),
                other_working_capital=data.get("otherWorkingCapital"),
                other_non_cash_items=data.get("otherNonCashItems"),
                net_cash_provided_by_operating_activities=data.get("netCashProvidedByOperatingActivities"),
                investments_in_property_plant_and_equipment=data.get("investmentsInPropertyPlantAndEquipment"),
                acquisitions_net=data.get("acquisitionsNet"),
                purchases_of_investments=data.get("purchasesOfInvestments"),
                sales_maturities_of_investments=data.get("salesMaturitiesOfInvestments"),
                other_investing_activities=data.get("otherInvestingActivities"),
                net_cash_used_for_investing_activities=data.get("netCashUsedForInvestingActivities"),
                debt_repayment=data.get("debtRepayment"),
                common_stock_issued=data.get("commonStockIssued"),
                common_stock_repurchased=data.get("commonStockRepurchased"),
                dividends_paid=data.get("dividendsPaid"),
                other_financing_activities=data.get("otherFinancingActivities"),
                net_cash_used_provided_by_financing_activities=data.get("netCashUsedProvidedByFinancingActivities"),
                free_cash_flow=data.get("freeCashFlow"),
                net_change_in_cash=data.get("netChangeInCash"),
                cash_at_end_of_period=data.get("cashAtEndOfPeriod"),
                cash_at_beginning_of_period=data.get("cashAtBeginningOfPeriod"),
                operating_cash_flow=data.get("operatingCashFlow"),
                capital_expenditure=data.get("capitalExpenditure"),
                link=data.get("link"),
                final_link=data.get("finalLink")
            )
            self.__session.add(cash_flow)
            self.__session.commit()
            return {"message": "Record created successfully", "id": cash_flow.id}

        except SQLAlchemyError as e:
            self.__session.rollback()
            return {"error": str(e)}

    def read(self, symbol, page=1, offset=10):
        try:
            total = self.__session.query(CashFlowStatement.id).filter(CashFlowStatement.symbol == symbol).count()
            records = (self.__session.query(CashFlowStatement)
                      .filter(CashFlowStatement.symbol == symbol)
                      .order_by(CashFlowStatement.date.desc())
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
        try:
            record = self.__session.query(CashFlowStatement).filter(CashFlowStatement.id == id).first()
            if record:
                for key, value in data.items():
                    setattr(record, key, value)
                self.__session.commit()
                return {"message": "Record updated successfully", "id": id}
            return {"error": "Record not found"}
        except SQLAlchemyError as e:
            self.__session.rollback()
            return {"error": str(e)}

    def delete(self, id):
        try:
            record = self.__session.query(CashFlowStatement).filter(CashFlowStatement.id == id).first()
            if record:
                self.__session.delete(record)
                self.__session.commit()
                return {"message": "Record deleted successfully", "id": id}
            return {"error": "Record not found"}
        except SQLAlchemyError as e:
            self.__session.rollback()
            return {"error": str(e)}