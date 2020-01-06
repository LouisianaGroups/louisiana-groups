// Google Scripts code for form submissions and email notifications
var scriptProp = PropertiesService.getScriptProperties();

function doGet(request) {
	scriptProp.setProperty('sheetName', request.parameter.formUsed);
	return ContentService.createTextOutput(request.parameter.formUsed);
}

function setup() {
	var doc = SpreadsheetApp.getActiveSpreadsheet();
	scriptProp.setProperty('key', doc.getId());
}

function doPost(request) {
	var lock = LockService.getScriptLock();
	lock.waitLock(10000);

	try {
		var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
		var sheet = doc.getSheetByName(scriptProp.getProperty('sheetName'));
		var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
		var nextRow = sheet.getLastRow() + 1;

		var emailHeaders = headers;
		var emailContent = [];

		var newRow = headers.map(function(header) {
			emailContent.push(request.parameter[header]);
			return header === 'timestamp' ? new Date() : request.parameter[header];
		});

		//Build Email
		var fullEmailContent = '';

		for (i in emailHeaders) {
			fullEmailContent += emailHeaders[i] + ': ' + emailContent[i] + '\n';
		}

		MailApp.sendEmail('korndragon@gmail.com', 'Louisianagroups.com Submission (' + request.parameter.formUsed + ')', fullEmailContent);

		sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
		return ContentService.createTextOutput(JSON.stringify({
			'result': 'success',
			'row': nextRow
		})).setMimeType(ContentService.MimeType.JSON);
	} catch (e) {
		return ContentService.createTextOutput(JSON.stringify({
			'result': 'error',
			'error': e
		})).setMimeType(ContentService.MimeType.JSON);
	} finally {
		lock.releaseLock();
	}
}