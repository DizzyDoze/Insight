# **Insight**

A web application for filtering and analyzing financial data, including **Income Statements**, **Balance Sheets**, and **Cash Flow Statements** for publicly listed companies. The app allows users to fetch data, filter by key metrics, and sort the results.

### **Features**
- Fetches financial data from a backend that connects to an external financial API.
- Displays financial statements in a clean and responsive UI.
- Filtering options:
    - Date range filtering for all statements.
    - Revenue, Net Income, Gross Profit, and EPS for income statements.
    - Total Assets, Liabilities, Equity, etc., for balance sheets.
    - Cash flow metrics for cash flow statements.
- **Sorting** options for all key columns.
- Responsive design using **TailwindCSS**.
- Backend support using **Flask** for data fetching, filtering, and sorting.
- Deployed on **AWS Elastic Beanstalk** (Backend and Database) and **AWS S3 + CloudFront** (Frontend).

---
## **Tech Stack**
### **Frontend**
- **React** with functional components
- **TailwindCSS** for responsive styling
- **AWS S3 + CloudFront** for deployment

### **Backend**
- **Python Flask** for API handling
- **MySQL** database hosted on AWS RDS
- **AWS Elastic Beanstalk** for backend deployment

---

## **Getting Started**
Follow these steps to run the project locally:

### **Prerequisites**
- Node.js (v16 or later)
- Python 3.8+
- npm
- MySQL database (local or hosted)
- A free API key from [Financial Modeling Prep](https://site.financialmodelingprep.com/developer/docs) (replace `<api_key>` in the backend configuration)

### **Installation**

```bash
# 1. Clone the Repository
git clone https://github.com/your-username/financial-filtering-app.git
cd financial-filtering-app

# 2. Set Up the Backend
cd backend

# Install required Python packages
pip install -r requirements.txt

# Set your database connection in the settings.py file
# Example settings.py configuration
DATABASE_NAME = "insight"
HOST = "localhost"

# Set your FMP_API_KEY and database PASSWORD in the environment variables
export FMP_API_KEY=<your fmp api key>
export PASSWORD=<your MySQL db password>

# Run the Flask backend
python app.py

# 3. Set Up the Frontend
cd ../frontend

# Install the required npm packages
npm install

# Run the server
npm start

# Open your browser and go to http://localhost:3000 to view the app
```
---
## **License**
This project is licensed under the MIT License.

---
## **Contact**
For any questions or support, please contact [DizzyDoze](overdosedizzy@gmail.com).
