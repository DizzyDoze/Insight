from flask import Blueprint, jsonify, request
from fundamental_fetcher import FundamentalFetcher

statement_bp = Blueprint("statement", __name__)

fundamental_fetcher = FundamentalFetcher()


@statement_bp.route("/statement", methods=["GET"])
def get_statement():
    company_symbol = request.args.get("company-symbol")         # company symbol
    period = request.args.get("period")  # annual, quarter

    statement_type = request.args.get("statement-type")         # balance/income/cash flow
    # type validation
    if statement_type not in ["income-statement", "balance-sheet-statement", "cash-flow-statement"]:
        return jsonify({"error": "invalid statement type"})

    data = fundamental_fetcher.fetch_statement(company_symbol=company_symbol,
                                               statement_type=statement_type,
                                               period=period)
    return jsonify(data)
