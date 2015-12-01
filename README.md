# nslack

This script allow you to visualize easily all your slack connections in a google spreadsheet.

[Spreadsheet example](todo)

# Installation 

## Clone the Template 

Go to the [Results Template](https://docs.google.com/spreadsheets/d/1UAqffJdW0tGfMxUh9vH3O5x50vfhtPpb0eseEbeRfyw/edit?usp=sharing) and make a copy of the document :

- File
- Make a copy ...

You can find the spreadsheet id in the url bar :

    https://docs.google.com/spreadsheets/d/YOUR-SPREADSHEET-ID

Save it for later...

## Get a Slack Token

Go to [the slack web api page](https://api.slack.com/web) and generate a token.
Save it for later...

## Create the Script
### From an empty script

1. If you haven't created a script yet, got to [this overview](https://developers.google.com/apps-script/overview)
2. [Create a script](https://cloud.githubusercontent.com/assets/2452791/4371171/b379f55a-4313-11e4-9edc-28ba351031fa.png) in your Google Drive
3. Copy the content of [main.gs](https://github.com/nobe4/extralendar/blob/master/main.gs)
4. Paste it in your created script

### Copy the Google script

1. Copy the [main.gs](https://github.com/nobe4/extralendar/blob/master/main.gs) file into your Google Drive.

## Configure the constant variables

### Required 

* token

Your Slack toek previously generated.

* sheetId

Your Spreadsheet ID previously saved.

### Optionnal

* email
If you want an error notification with mail, fill it with the wanted mail.

* branch
`master` for only stable release,
`develop` for all release.


## Configure the trigger

1. [Create the trigger](todo)
2. [Set the time preference](todo) 


# Disclaimer
> This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY expressed or implied. **Use it at your own risk**.

> You can only use this program with valid credentials.
