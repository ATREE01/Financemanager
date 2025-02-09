# Finance Manager App (NextJS & NestJS)  

## Deployment Guide  

### Deployment Using Docker  

1. Copy the example environment file:  
   ```bash  
   cp .env.example .env  
   ```  

2. Open the `.env` file for editing:  
   ```bash  
   vim .env  
   ```  

3. Configure the following environment variables:  

#### Frontend Configuration  
```bash  
FRONTEND_PORT=3000  
```  

#### Backend Configuration  
```bash  
BACKEND_PORT=3000  

ACCESS_TOKEN_SECRET=  
REFRESH_TOKEN_SECRET=  

DB_TYPE=mariadb  
DB_HOST=database  
DB_USER=  
DB_PASSWORD=  
DB_ROOT_PASSWORD=  
DB_NAME=  

EXCHANGE_RATE_GOOGLE_SHEET_API=  

REDIS_HOST=redis  
REDIS_PORT=6379  
```  

4. Start the services using Docker Compose:  
   ```bash
   docker compose up -d
   ```

---

### Exchange Rate API

> **Note:** The exchange rate API is a custom script created using Google Sheets.

#### Google App Script Code

```javascript
function getExchangeRate() {
  SpreadsheetApp.flush();
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName("exchangeRate");
  const data = sheet.getDataRange().getValues();
  const jsonData = convertExchangeRateToJson(data);
  return jsonData;
}

function convertExchangeRateToJson(data) {
  let jsonData = {};
  data.forEach(([code, name, value]) => {
    if (value !== '#N/A') {
      jsonData[code] = { name, value };
    }
  });
  return jsonData;
}

function doGet(e) {
  const action = e.parameter.action;
  if (action === 'getExchangeRate') {
    const jsonData = getExchangeRate();
    return ContentService
      .createTextOutput(JSON.stringify(jsonData))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

#### Example Spreadsheet Data
|  **Code** | **Name** | **Value** |
|-----------|----------|----------|
| TW        | 新台幣   | 1        |

> **Note:** The first row in the spreadsheet shown above is for demonstration purposes only and should not be included in the actual spreadsheet.

