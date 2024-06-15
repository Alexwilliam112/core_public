# API DOCUMENTATION - REPORTS

#### SERVER ADDRESS:

&nbsp;

&nbsp;

## Global Error

> __Response (401 - UNAUTHORIZED)__

```json
{
  "message": "Unauthorized Access. Please LogIn"
}
```

> __Response (403 - FORBIDDEN)__

```json
{
  "message": "You Do Not Have This Access!"
}
```

> __Response (500 - INTERNAL SERVER ERROR)__

```json
{
  "message": "Internal Server Error. Please Contact Server Administrator"
}
```

## GET /reports/general

### header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

### query:

```json
{
  "startDate": "2024-01-01",
  "endDate": "2024-05-01"
}
```

> __Response (200 - OK)__

```json
{
    "KeyTrends": "Payroll expenses are steady at 21,800,000 monthly. Utility expenses show minor fluctuations, but overall are stable. Supply expenses vary significantly, with some dates showing higher amounts than others. Income sales fluctuate daily, with no clear upward or downward trend.",
    "Insight": "The consistent payroll expenses suggest a stable workforce. Utility expenses are well-managed, with minor fluctuations indicating good control over usage. The significant variation in supply expenses could be due to bulk purchases or seasonal variations in prices. Fluctuating sales income suggests varying customer traffic or seasonal effects on business.",
    "Summary": "The restaurant's financial data shows stable payroll and utility expenses, with significant variation in supply expenses and fluctuating sales income. Overall, the business appears to be managing its costs well, but the variability in sales income suggests opportunities for improved marketing or customer engagement strategies.",
    "Suggestions": "Analyze supply expenses to identify patterns or opportunities for cost savings. Track sales patterns to identify high and low-traffic days and develop targeted marketing strategies. Consider implementing loyalty programs or promotional events to engage customers and drive sales."
}
```

> __Response (400 - BAD REQUEST)__

```json
{
  "message": "Invalid input"
}
```

> __Response (401 - UNAUTHORIZED)__

```json
{
  "message": "Unauthorized Access. Please LogIn"
}
```

