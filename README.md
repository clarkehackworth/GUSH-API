# GUSH-API
## Google Universal Spreadsheet HTTP API
Use simple HTTP calls to interact with Google Spreadsheets. Insert, update and query data using standard HTTP requests. Easy to use from scripting languages such as python as an integration point between another systems and your Google spreadsheet.

## Instructions
0. Create a Google Spreadsheet with row headings (typically in the first row) 
1. From Google Spreadsheet open the script tab (Tools - > Script Editor)
2. Copy/Paste contents of Code.gs in this repositoty into your opened script editor window 
3. Update the value of the password parameter at the top of the file. Choose a unique and strong password, this becomes your API key allowing you to interact with the API without being authenticated as a Google user.
4. Hit the "save" button in the script editor. When prompted choose a name for your project (you will probably want to choose a name simiar to your spreadsheet name for consistency)
3. Enable Google Spreadsheet Web API

   a. From the script editor window enable the API (Publish -> Deploy As Web app ...), this will bring up a dialog box

   b. If you want to interact with the API without logging in as a Google user select "Anyone, even anonymous" under the "Who has access to the app:" section. 
   
   c. Hit the "Deploy" button in the dialog and follow permissions prompts allowing access
   
   d. Finally, take note of your new "Web App URL", and hit the "OK" button

## Example Use From Python:
### inserting or updating data into the spreadsheet
```python
googleAPI = "https://script.google.com/macros/s/<script_id>/exec"

content = urllib2.urlopen(googleAPI+"?data={\"password\":\"passwordvalue\",\"action\":\"insert\",\"sheetName\":\"sheetnamevalue\",\"key\":\"columnnamevalue\",\"data\":{\"column1\":\""+urllib.quote_plus(value1)+"\",\"column2\":\""+urllib.quote_plus(value2)+"\"}}").read()

print content
```
### listing data based on search criteria
```python
googleAPI = "https://script.google.com/macros/s/<script_id>/exec"

content = urllib2.urlopen(googleAPI+"?data={\"password\":\"passwordvalue\",\"action\":\"list\",\"sheetName\":\"sheetnamevalue\",\"key\":\"searchcolumn\",\"compare\":\"<contains or equals>\",\"value\":\"searchvalue\",\"data\":{\"columns\":[\"column1\",\"column2\"]}}").read()

print content
```
Output:
```
200
value 1, value 2
value 3, value 4
```
### Removing data based on criteria
```python
googleAPI = "https://script.google.com/macros/s/<script_id>/exec"

content = urllib2.urlopen(googleAPI+"?data={\"password\":\"passwordvalue\",\"action\":\"remove\",\"sheetName\":\"sheetnamevalue\",\"key\":\"searchcolumn\",\"compare\":\"<contains or equals>\",\"value\":\"deletevalue\"}}").read()

print content
```

## Notes
If you want to use Google's authentication instead of the script's API key password, you can use a script to generate the URL(s) and open browser windows which will ask for user interaction and Google authentication before interacting with the API
## Disclaimer
The API password is designed to be a minimun level of security. If the data you are using is sensitive, please considered the security architecture and the implications thereof.
