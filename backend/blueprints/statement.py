import os

from flask import Blueprint, jsonify, request
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from handlers.balance_sheet_handler import BalanceSheetHandler
from handlers.income_handler import IncomeHandler
from settings import DATABASE_NAME, HOST

statement_bp = Blueprint("statement", __name__)

engine = create_engine(f"mysql+pymysql://root:{os.getenv('PASSWORD')}@{HOST}/{DATABASE_NAME}")
Session = sessionmaker(bind=engine)
session = Session()

income_handler = IncomeHandler(session)
balance_sheet_handler = BalanceSheetHandler(session)


@statement_bp.route("/income-statement", methods=["GET"])
def get_income_statement():
    symbol = request.args.get("symbol")         # company symbol
    page = int(request.args.get("page", 1))
    
    records = income_handler.read(symbol=symbol, page=page)
    return jsonify(records)


@statement_bp.route("/balance-sheet-statement", methods=["GET"])
def get_balance_sheet_statement():
    symbol = request.args.get("symbol")
    page = int(request.args.get("page", 1))
    
    records = balance_sheet_handler.read(symbol=symbol, page=page)
    return jsonify(records)