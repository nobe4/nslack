// script that will be fetched automaticly by main.gs
// this script contains all the logic but no user information

// Different Sheets used
var sheet, rawSheet, statsSheet, usersSheet;

function core(){
  try {
    coreFunction();
  } catch(e) {
    if(args.email != undefined && args.email != "")
      mailError(e);
  }
}

function coreFunction(){
  initSheets(args.sheetId);
  var teamUsers = getTeamUsers(args.token);
  var currentActives = 0;

  var currentTime = newTime();
  for(userId in teamUsers){
    rawPresence(teamUsers[userId]['name'], teamUsers[userId]['active']);
    if(teamUsers[userId]['active']){
      currentActives += 1;
      updateUserStats(teamUsers[userId]['name'], currentTime);
    }
  }

  // update current cell
  updateCurrentActives(currentActives, currentTime);
}

// -------------------------- Main  Methods ----------------------------
// Fetch all team users and presence
function getTeamUsers(token){
  var url = "https://slack.com/api/rtm.start?token=%1".replace('%1',token);
  var rawTeamInfo = makeHttpRequest(url, {});
  var rawUsers = JSON.parse(rawTeamInfo).users;
  var users = {};
  for(var rawUser in rawUsers){
    if( rawUsers[rawUser]['id'] !== 'USLACKBOT' // remove the slackbot user
       && !rawUsers[rawUser]['deleted'])
     users[rawUsers[rawUser]['id']] = { 
       'name' : rawUsers[rawUser]['name'],
       'active' : rawUsers[rawUser]['presence'] == 'active',
     };
  }
  return users;
}

// -------------------------- HTTP Request ---------------------------

function makeHttpRequest( url, options ){
  var response = UrlFetchApp.fetch(url, options);  //https://developers.google.com/apps-script/reference/url-fetch/http-response#getAllHeaders()
  // log(response.getResponseCode(), "Response Code");
  return response;
}

// ------------------------- Sheet Helper ----------------------------

// Init the spreadsheet and sheets
function initSheets(sheetId){
  sheet = SpreadsheetApp.openById(sheetId);  
  rawSheet = sheet.getSheetByName('raw');
  statsSheet = sheet.getSheetByName('stats');
  usersSheet = sheet.getSheetByName('users');
}

// Get user column based on user name
function getUserColumn(sheet, userName){
  var offset = 2;
  var currentValue = get(sheet, 1,offset);
  while(currentValue != ''){
    if(currentValue == userName) return offset;
    offset += 1;
    currentValue = get(sheet, 1,offset);
  }
  set(sheet, 1, offset, userName);
  return offset;
}

// Update user presence 
function rawPresence(user, presence){
  var lastRow = rawSheet.getLastRow();
  var userColumn = getUserColumn(rawSheet, user);
  set(rawSheet, lastRow, userColumn, presence);
}

// Create a new user log
function newTime(){
  var currentTime = new Date();
  var lastRow = rawSheet.getLastRow();
  set(rawSheet, lastRow + 1, 1, currentTime);
  return currentTime;
}

// Simpler get and set
function set(sheet, row, column, value){
  sheet.getRange(row, column).setValue(value);
} 

function get(sheet, row, column){
  return sheet.getRange(row,column).getValue();
}

// ------------------------- Date Helpers ----------------------------  

// Time comparison is rounded to the previous half hour
function compareTime(dateTime1, dateTime2){
  if(dateTime1.getUTCHours() == dateTime2.getUTCHours()){
    var m1 = dateTime1.getUTCMinutes();
    var m2 = dateTime2.getUTCMinutes();
    if ((m1 >= 30 && m2 >= 30) || 
        (m1 < 30 && m2 < 30 )) {
      return true;
    }
  }
  return false;
}

// Compare two date
function compareDate(dateTime1, dateTime2){
  return dateTime1.toDateString() == dateTime2.toDateString();
}

// ------------------- Loggin and stats Helpers ----------------------

// Get the current row number
function getCurrentTimeRow(dateTime){
  var currentRow = 2; // 1st row is for display only
  var testDateTime = get(statsSheet, currentRow, 1);

  while(testDateTime != '' && !compareTime(testDateTime, dateTime)){
    currentRow += 1;
    testDateTime = get(statsSheet, currentRow, 1);
  }

  return currentRow;
}

// Get the current day column
// Create the column if none exists
function getCurrentDateColumn(dateTime){
  var currentColumn = 2; // 1st column is for display only
  var testDateTime = get(statsSheet, 1, currentColumn);
  while(testDateTime != ''){
    if(compareDate(testDateTime, dateTime)) return currentColumn;
    currentColumn += 1;
    testDateTime = get(statsSheet, 1, currentColumn);
  }
  set(statsSheet, 1, currentColumn, dateTime);
  return currentColumn;
}

// Update the current actives number
function updateCurrentActives(currentActives, currentDateTime){
  var timeRow = getCurrentTimeRow(currentDateTime);
  var dateColumn = getCurrentDateColumn(currentDateTime);
  var currentValue = get(statsSheet, timeRow, dateColumn);
  set(statsSheet, 
      timeRow, dateColumn,
      currentValue + currentActives
     );
}

// Update the user stat
function updateUserStats(userName, currentTime){
  var timeRow = getCurrentTimeRow(currentTime);
  var userColumn = getUserColumn(usersSheet, userName);
  log(timeRow);
  log(userColumn);
  var currentValue = get(usersSheet, timeRow, userColumn);
  set(usersSheet, timeRow, userColumn, currentValue + 1);
}

// ------------------------ Config Helper -------------------------- 

// Check required arguments
function checkArguments(){
  if( args.token == undefined || args.token == "" )
    return false;

  if( args.sheetId == undefined || args.sheetId == "" )
    return false;

  return true;
}

// -------------------------- Log Helper ----------------------------
function log(message, header){
  if( header != null ){
    Logger.log( "-----> " + header );
  }
  Logger.log( message );
}

// -------------------------- Error Helper ----------------------------
function mailError(error){
  MailApp.sendEmail(args.email, "Error report Extralendar",
                    "\r\nDate: " + new Date()
                    + "\r\nNumber: " + error.number
                    + "\r\nMessage: " + error.message
                    + "\r\nLine: " + error.lineNumber);
}

// as this script will be executed as a function we need to execute core at the end ot the file
core();
