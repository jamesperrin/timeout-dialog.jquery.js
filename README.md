# timeout-dialog.jquery.js

## Table of Contents

- [Description](#description)
- [Demo](#demo)
- [Example and Documentation](#example-and-documentation)
  - [Options](#options)
  - [How to use](#how-to-use)
- [Support](#support)
- [Dependencies](#dependencies)
- [Credit](#credit)

## Description

timeout-dialog.jquery.js is a JQuery plugin that displays a timeout popover after a certain period of time. The timeout dialog should be used whenever you want to display to the user that the logged in session is about to expire. It creates a light box with a countdown and options to stay signed in or sign out.

## Demo

[timeout-dialog.jquery.js examples (rigoneri.github.io)](https://rigoneri.github.io/timeout-dialog.js/)

## Example and Documentation

### Options

<table class="standard-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th width="170">Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>timeout</strong></td>
      <td>number</td>
      <td>1200</td>
      <td>The number of your session timeout (in seconds). The timeout value minus the countdown value determines how long until the dialog appears.</td>
    </tr>
    <tr>
      <td><strong>countdown</strong></td>
      <td>number</td>
      <td>60</td>
      <td>The countdown total value (in seconds).</td>
    </tr>
    <tr>
      <td><strong>title</strong></td>
      <td>string</td>
      <td>'Your session is about to expire!'</td>
      <td>The title message in the dialog box.</td>
    </tr>
    <tr>
      <td><strong>message</strong></td>
      <td>string</td>
      <td>'You will be logged out in {0} seconds.'</td>
      <td>The countdown message where <code>{0}</code> will be used to enter the countdown value.</td>
    </tr>
    <tr>
      <td><strong>question</strong></td>
      <td>string</td>
      <td>'Do you want to stay signed in?'</td>
      <td>The question message if they want to continue using the site or not.</td>
    </tr>
    <tr>
      <td><strong>keepAliveButtonText</strong></td>
      <td>string</td>
      <td>'Yes, Keep me signed in'</td>
      <td>The text of the YES button to keep the session alive.</td>
    </tr>
    <tr>
      <td><strong>signOutButtonText</strong></td>
      <td>string</td>
      <td>'No, Sign me out'</td>
      <td>The text of the NO button to kill the session.</td>
    </tr>
    <tr>
      <td><strong>keepAliveUrl</strong></td>
      <td>string</td>
      <td>/keep-alive</td>
      <td>The url that will perform a GET request to keep the session alive. This GET expects a 'OK' plain HTTP response.</td>
    </tr>
    <tr>
      <td><strong>logoutUrl</strong></td>
      <td>string</td>
      <td>null</td>
      <td>The url that will perform a POST request to kill the session. If no logoutUrl is defined it will just redirect to the url defined in logoutRedirectUrl.</td>
    </tr>
    <tr>
      <td><strong>logoutRedirectUrl</strong></td>
      <td>string</td>
      <td>/</td>
      <td>The redirect url after the logout happens, usually back to the login url. It will also contain a <code>next</code> query param with the url that they were when timedout and a <code>timeout=t</code> query param indicating if it was from a timeout, this value will not be set if the user clicked the 'No, Sign me out' button.</td>
    </tr>
    <tr>
      <td><strong>restartOnYes</strong></td>
      <td>boolean</td>
      <td>true</td>
      <td>A boolean value that indicates if the countdown will restart when the user clicks the 'keep session alive' button.</td>
    </tr>
    <tr>
      <td><strong>dialogWidth</strong></td>
      <td>number</td>
      <td>350</td>
      <td>The width of the dialog box.</td>
    </tr>
    <tr>
      <td><strong>enableClientEvents</strong></td>
      <td>boolean</td>
      <td>false</td>
      <td>Flag to enable client event to keep sessin alive.</td>
    </tr>
    <tr>
      <td><strong>ajaxSettings</strong></td>
      <td>json</td>
      <td>ajaxSettings: {
        type: 'POST',
        url: this.keepAliveUrl,
        contentType: 'application/json',
        dataType: 'json',
        cache: false,
        headers: {
          Accept: 'application/json',
        },</td>
      <td>A JSON object for overriding jQuery AJAX settings..</td>
    </tr>
  </tbody>
</table>

### How to use

```js
$(function () {
  $('#timeout-example').click(function (e) {
    e.preventDefault();

    $.timeoutDialog({
      timeout: 1,
      countdown: 60,
      logoutRedirectUrl: 'https://github.com/jamesperrin/timeout-dialog.js',
      restartOnYes: false,
    });
  });
});
```

## Support

Please contact [@jamesperrin](https://github.com/jamesperrin) if you have any questions or change requests.

## Dependencies

- [jQuery](https://jquery.com/)
- [jQuery UI](https://jqueryui.com/)

## Credit

timeout-dialog.js was originally developed by [Rodrigo Neri(@rigoneri)](https://github.com/rigoneri)
