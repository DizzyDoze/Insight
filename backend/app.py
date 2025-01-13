from flask import Flask
from flask_cors import CORS

from blueprints.statement import statement_bp

app = Flask(__name__)
app.register_blueprint(statement_bp, url_prefix="/api")

CORS(app)  # allow all origins to access this service


@app.route("/")
def index():
    return "ok"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=False)
    # production env, use below
    # gunicorn --bind 0.0.0.0:9999 app:app
