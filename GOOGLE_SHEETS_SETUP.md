# Google Sheets Integration Setup

This guide will help you set up Google Sheets integration to store waitlist submissions.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Mnada Waitlist" (or any name you prefer)
4. In the first row, add these headers:
   - Column A: `Name`
   - Column B: `Email`
   - Column C: `Phone`
   - Column D: `Timestamp`

## Step 2: Create Google Apps Script

1. In your Google Sheet, click on **Extensions** → **Apps Script**
2. Delete any default code and paste this script:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the JSON data from the POST request
    const data = JSON.parse(e.postData.contents);
    
    // Append the data to the sheet
    sheet.appendRow([
      data.name || '',
      data.email || '',
      data.phone || '',
      data.timestamp || new Date().toISOString()
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Save** (💾) and give your project a name (e.g., "Mnada Waitlist Handler")

## Step 3: Deploy as Web App

1. Click on **Deploy** → **New deployment**
2. Click the gear icon (⚙️) next to "Select type" and choose **Web app**
3. Configure the deployment:
   - **Description**: "Waitlist Form Handler" (optional)
   - **Execute as**: "Me" (your email)
   - **Who has access**: "Anyone" (this allows your website to submit data)
4. Click **Deploy**
5. **Copy the Web App URL** - it will look like:
   ```
   https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

## Step 4: Authorize the Script

1. When you first run the script, Google will ask for authorization
2. Click **Review Permissions**
3. Choose your Google account
4. Click **Advanced** → **Go to [Your Project Name] (unsafe)**
5. Click **Allow** to grant permissions

## Step 5: Add URL to Your Project

1. Create a `.env` file in the root of your project (copy from `.env.example`)
2. Add your Google Apps Script URL:
   ```
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
3. Replace `YOUR_SCRIPT_ID` with the actual ID from your deployment URL
4. Restart your development server:
   ```bash
   npm run dev
   ```

## Step 6: Test the Integration

1. Fill out the form on your website
2. Click "Join Waitlist"
3. Check your Google Sheet - you should see a new row with the submitted data

## Troubleshooting

### Data not appearing in the sheet?
- Make sure the script is deployed as a Web App (not just saved)
- Verify "Who has access" is set to "Anyone"
- Check the browser console for any errors
- Make sure you authorized the script when prompted

### CORS errors?
- The form uses `mode: 'no-cors'` which is required for Google Apps Script
- You won't be able to read the response, but data will still be saved
- If you need error handling, consider using a proxy server

### Need to update the script?
- After making changes to the Apps Script code, you need to create a **New deployment**
- The URL will remain the same, but you need to deploy again for changes to take effect

## Security Note

Since the Web App is set to "Anyone" access, anyone with the URL can submit data. This is fine for a waitlist form, but:
- Don't share your script URL publicly
- Consider adding basic validation or rate limiting in the script
- For production, you might want to add a simple API key check

