var password = "apipasswordvalue";

function processData(data) {
  if(data == null || data.password == null || data.password != password)
    return ContentService.createTextOutput('Hello, world!');
  if(data.action == "insert")
    return insertData(data)
  if(data.action == "list")
    return listData(data)
}

/*
usage 
https://script.google.com/macros/s/<script_id>/exec?data={"password":"passwordvalue","action":"list","sheetName":"sheetnamevalue","key":"searchcolumn","compare":"<contains or equals>","value":"searchvalue","data":{"columns":["column1","column2"]}}
*/
function listData(data){
  var sheetName = data.sheetName;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  var headerRow = data.headerRow ? data.headerRow : 1;
  var keyCol = getColumnByTitle(data.key, sheet,headerRow);
  var compare = data.compare;
  var value = data.value;
  
  var columnIds = []
  for(i in data.data.columns){
       columnIds.push(getColumnByTitle(data.data.columns[i], sheet,headerRow));
  }
  
  
  var output = "200\n";
  var keyValues = sheet.getRange(headerRow+1, keyCol, sheet.getLastRow(), 1).getValues(); //read key values
  for(i in keyValues){
    //Logger.log("checking "+ keyValues[i]+" against "+value +" using "+ compare);
    if(compare == "contains"){
      if(String(keyValues[i]).indexOf(value)>-1){
         //Logger.log("found contains value "+value);
         output = output+getColumnValuesForRow(columnIds,headerRow + 1 + parseInt(i),sheet);
      }         
    } else if (compare == "equals"){       
      if(String(keyValues[i]) == value){
         Logger.log("found equals value "+value);
         output = output+getColumnValuesForRow(columnIds,headerRow + 1 + parseInt(i),sheet);
      }
    }
     
  }
  return ContentService.createTextOutput(output);
}

function getColumnValuesForRow(columnIds,row,sheet){
  var output = "";
  for(i in columnIds){
    if(output.length>0)
      output=output+",";
    output = output+sheet.getRange(row,columnIds[i]).getDisplayValue()
  }
  return output+"\n";
}
/*
usage: 
https://script.google.com/macros/s/<script_id>/exec?data={"password":"passwordvalue","action":"insert","sheetName":"sheetnamevalue","key":"keycolumnname","data":{"column1":"value1","column2":"value2"}}"
*/
function insertData(data){
  //var spreadsheetID= data.sheetID;
  var sheetName = data.sheetName;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  var headerRow = data.headerRow ? data.headerRow : 1
  keyCol = getColumnByTitle(data.key, sheet,headerRow)
  //Logger.log(keyCol);
  var insertdata = data.data;
  
  var keyValues = sheet.getRange(headerRow+1, keyCol, sheet.getLastRow(), 1).getValues(); //read key values
  keyRow = -1;
  for(i in keyValues){
     if(keyValues[i] == insertdata[data.key])
       keyRow = headerRow + 1 + parseInt(i);
  }
  
  if(keyRow == -1){
    keyRow = headerRow + 1;
    sheet.insertRowsBefore(keyRow,1);  
  }
  for(name in insertdata){
    Logger.log(name +" - "+ insertdata[name]);
    sheet.getRange(keyRow,getColumnByTitle(name,sheet,headerRow)).setValue(insertdata[name]);
  }
  return ContentService.createTextOutput("200")
}

function doGet(e){
  Logger.log( "HTTP GET");
  datastr = e.parameter["data"];
  data=null;
  try {
    data = JSON.parse(datastr);
  } catch(err) {
  
  }
  return processData(data);
}

function doPost(e){ // POST not workin?
  Logger.log( "Hello POST");
 
  datastr = e.parameter["data"];
  
  data = JSON.parse(datastr);
  return processData(data);
}

function getColumnByTitle(columnName,sheet,headerRow){

 var names = sheet.getRange(headerRow, 1, 1, sheet.getLastColumn()).getValues(); 
  for(row in names){  // should only be one given the range above
    //Logger.log("row: "+row+" -- "+names[row]);
    for(i in names[row]){
      //Logger.log(i+" -- "+names[row][i]+" -- "+columnName)
      if(names[row][i]==columnName){
         //Logger.log(i);
         return parseInt(i)+1;  // arrays start at 0 rows start at one, so we add one
       }
    }
  }
  return -1
}
