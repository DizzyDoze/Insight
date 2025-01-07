from flask import Flask

from blueprints.statement import statement_bp

app = Flask(__name__)
app.register_blueprint(statement_bp, url_prefix="/api")


@app.route("/")
def index():
    return "ok"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
