from sqlalchemy.exc import SQLAlchemyError
from models.balance_sheet_statement import BalanceSheetStatement

class BalanceSheetHandler:
    def __init__(self, session):
        self.__session = session

    def create(self, data):
        try:
            balance_sheet = BalanceSheetStatement(
                symbol=data["symbol"],
                date=data["date"],
                reportedCurrency=data.get("reportedCurrency"),
                cik=data.get("cik"),
                fillingDate=data.get("fillingDate"),
                acceptedDate=data.get("acceptedDate"),
                calendarYear=data.get("calendarYear"),
                period=data.get("period"),
                totalAssets=data["totalAssets"],
                totalLiabilities=data["totalLiabilities"],
                totalEquity=data.get("totalEquity"),
                totalStockholdersEquity=data.get("totalStockholdersEquity"),
                totalLiabilitiesAndStockholdersEquity=data.get("totalLiabilitiesAndStockholdersEquity"),
                totalLiabilitiesAndTotalEquity=data.get("totalLiabilitiesAndTotalEquity"),
                cashAndCashEquivalents=data.get("cashAndCashEquivalents"),
                shortTermInvestments=data.get("shortTermInvestments"),
                cashAndShortTermInvestments=data.get("cashAndShortTermInvestments"),
                netReceivables=data.get("netReceivables"),
                inventory=data.get("inventory"),
                otherCurrentAssets=data.get("otherCurrentAssets"),
                totalCurrentAssets=data.get("totalCurrentAssets"),
                propertyPlantEquipmentNet=data.get("propertyPlantEquipmentNet"),
                goodwill=data.get("goodwill"),
                intangibleAssets=data.get("intangibleAssets"),
                goodwillAndIntangibleAssets=data.get("goodwillAndIntangibleAssets"),
                longTermInvestments=data.get("longTermInvestments"),
                taxAssets=data.get("taxAssets"),
                otherNonCurrentAssets=data.get("otherNonCurrentAssets"),
                totalNonCurrentAssets=data.get("totalNonCurrentAssets"),
                otherAssets=data.get("otherAssets"),
                accountPayables=data.get("accountPayables"),
                shortTermDebt=data.get("shortTermDebt"),
                taxPayables=data.get("taxPayables"),
                deferredRevenue=data.get("deferredRevenue"),
                otherCurrentLiabilities=data.get("otherCurrentLiabilities"),
                totalCurrentLiabilities=data.get("totalCurrentLiabilities"),
                longTermDebt=data.get("longTermDebt"),
                deferredRevenueNonCurrent=data.get("deferredRevenueNonCurrent"),
                deferredTaxLiabilitiesNonCurrent=data.get("deferredTaxLiabilitiesNonCurrent"),
                otherNonCurrentLiabilities=data.get("otherNonCurrentLiabilities"),
                totalNonCurrentLiabilities=data.get("totalNonCurrentLiabilities"),
                otherLiabilities=data.get("otherLiabilities"),
                capitalLeaseObligations=data.get("capitalLeaseObligations"),
                preferredStock=data.get("preferredStock"),
                commonStock=data.get("commonStock"),
                retainedEarnings=data.get("retainedEarnings"),
                accumulatedOtherComprehensiveIncomeLoss=data.get("accumulatedOtherComprehensiveIncomeLoss"),
                otherTotalStockholdersEquity=data.get("otherTotalStockholdersEquity"),
                minorityInterest=data.get("minorityInterest"),
                totalInvestments=data.get("totalInvestments"),
                totalDebt=data.get("totalDebt"),
                netDebt=data.get("netDebt"),
                link=data.get("link"),
                finalLink=data.get("finalLink")
            )
            self.__session.add(balance_sheet)
            self.__session.commit()
            return {"message": "Record created successfully", "id": balance_sheet.id}

        except SQLAlchemyError as e:
            self.__session.rollback()
            return {"error": str(e)}

    def read(self, symbol, page=1, offset=10):
        try:
            total = self.__session.query(BalanceSheetStatement.id).filter(BalanceSheetStatement.symbol == symbol).count()
            records = (self.__session.query(BalanceSheetStatement)
                      .filter(BalanceSheetStatement.symbol == symbol)
                      .order_by(BalanceSheetStatement.date.desc())
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
            record = self.__session.query(BalanceSheetStatement).filter(BalanceSheetStatement.id == id).first()
            if not record:
                return {"error": "Record not found"}

            for k, v in data.items():
                setattr(record, k, v)

            self.__session.commit()
            return {"message": "Record updated successfully"}
        except SQLAlchemyError as e:
            self.__session.rollback()
            return {"error": str(e)}

    def delete(self, id):
        try:
            record = self.__session.query(BalanceSheetStatement).filter(BalanceSheetStatement.id == id).first()
            if not record:
                return {"error": "Record not found"}

            self.__session.delete(record)
            self.__session.commit()
            return {"message": "Record deleted successfully"}
        except SQLAlchemyError as e:
            self.__session.rollback()
            return {"error": str(e)}