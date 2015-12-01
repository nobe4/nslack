// ---------------------------------- NSlack ------------------------------------------
//
//  Google app script for automatic export of Slack user presence to spreadsheet.
//
//  Installation:
//   See : https://github.com/nobe4/nslack
//   Have a question : https://github.com/nobe4/nslack/issues
//
//  Want to help:
//   Report us any bugs on : https://github.com/nobe4/nslack/issues
//   Got new features ideas : https://github.com/nobe4/nslack/issues
//
// ------------------------------------------------------------------------------------

var args = {
  token   : '',
  sheetId : '',
};

// Request authorization for docs and mail
MailApp.getRemainingDailyQuota();
SpreadsheetApp.getActive();

function main(){
  var url = "https://raw.githubusercontent.com/nobe4/nslack/blob/"+((args.branch!="develop") ? "master" : "develop") +"/core.gs";
  var core_gs = UrlFetchApp.fetch(url);
  var core = new Function(core_gs);
  core();
}
