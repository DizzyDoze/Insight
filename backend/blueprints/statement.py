import os

from flask import Blueprint, jsonify, request
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from filters.income_filter import IncomeFilter
from handlers.income_handler import IncomeHandler
from settings import DATABASE_NAME, HOST

statement_bp = Blueprint("statement", __name__)

engine = create_engine(f"mysql+pymysql://root:{os.getenv('PASSWORD')}@{HOST}/{DATABASE_NAME}")
Session = sessionmaker(bind=engine)
session = Session()

income_handler = IncomeHandler(session)


@statement_bp.route("/income-statement", methods=["GET"])
def get_income_statement():
    symbol = request.args.get("symbol")         # company symbol

    filters = {
        "date_range": {
            "start": request.args.get("start_date"),
            "end": request.args.get("end_date")
        },
        "revenue_range": {
            "min": request.args.get("min_revenue", 0),
            "max": request.args.get("max_revenue", float("inf"))
        },
        "net_income_range": {
            "min": request.args.get("min_net_income", 0),
            "max": request.args.get("max_net_income", float("inf"))
        }
    }

    # should be reading from db, fetch should be separate
    income_filter = IncomeFilter(session)
    records = income_filter.get_filtered_records(symbol=symbol, filters=filters)

    records = [record.to_dict() for record in records]

    return jsonify({"data": records})
