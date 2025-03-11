/**
 *
 * timeout-dialog.jquery.js v1.2.0, 02-11-2025 - Updated by: James Perrin (@jamesperrin)
 *
 * timeout-dialog.js v1.1.0, 01-03-2012 - Updated by: James Perrin (@jamesperrin)
 *
 * Original @author: Rodrigo Neri (@rigoneri) - timeout-dialog.js v1.0.1, 01-03-2012
 *
 * (The MIT License)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * ES5 browser check
 */
function isES5Only() {
  // ES6 is NOT supported (likely ES5-only browser)
  try {
    new Function('(a = 0) => a'); // Arrow functions (ES6)
    new Function('let x = 1'); // Let/Const (ES6)
  } catch (e) {
    return true;
  }

  // ES6 is NOT supported (likely ES5-only browser)
  if (
    typeof Symbol === 'undefined' ||
    typeof Promise === 'undefined' ||
    typeof Object.assign === 'undefined' ||
    typeof Array.prototype.find === 'undefined'
  ) {
    return true;
  }

  return false;
}

/**
 * String formatting, you might want to remove this if you already use it.
 *
 * Example:
 *
 * const location = 'World';
 * alert(formatString('Hello {0}', location));
 */
let formatString = null;

if (isES5Only()) {
  formatString = function (template) {
    var args = Array.prototype.slice.call(arguments, 1);

    return template.replace(/\{(\d+)\}/g, function (match, index) {
      return typeof args[index] !== 'undefined' ? args[index] : match;
    });
  };
} else {
  formatString = function (template, ...args) {
    return template.replace(/\{(\d+)\}/g, (match, index) => (args[index] !== undefined ? args[index] : match));
  };
}

!(function ($) {
  $.timeoutDialog = function (options) {
    const settings = {
      timeout: 1200,
      countdown: 60,
      title: 'Your session is about to expire!',
      message: 'You will be logged out in {0} seconds.',
      question: 'Do you want to stay logged in?',
      keepAliveButtonText: 'Yes, Keep me signed in',
      signOutButtonText: 'No, Sign me out',
      keepAliveUrl: '/keep-alive',
      logoutUrl: null,
      logoutRedirectUrl: '/',
      restartOnYes: true,
      dialogWidth: 'auto',
      enableClientEvents: false,
      ajaxSettings: {
        type: 'POST',
        url: this.keepAliveUrl,
        contentType: 'application/json',
        dataType: 'json',
        cache: false,
        headers: {
          Accept: 'application/json',
        },
      },
    };

    $.extend(true, settings, options);

    let timeoutID;

    const TimeoutDialog = {
      init: function () {
        const self = this;
        self.setupDialogTimer();

        if (settings.enableClientEvents) {
          document.addEventListener('mouseover', self.setupDialogTimer, false);
          document.addEventListener('mousemove', self.setupDialogTimer, false);
          document.addEventListener('mousedown', self.setupDialogTimer, false);
          document.addEventListener('wheel', self.setupDialogTimer, false);
          document.addEventListener('mousewheel', self.setupDialogTimer, false);
          document.addEventListener('touchmove', self.setupDialogTimer, false);
          document.addEventListener('pointermove', self.setupDialogTimer, false);
          document.addEventListener('keypress', self.setupDialogTimer, false);
        }
      },

      setupDialogTimer: function () {
        window.clearTimeout(timeoutID);
        timeoutID = window.setTimeout(function () {
          TimeoutDialog.setupDialog();
        }, (settings.timeout - settings.countdown) * 1000);
      },

      setupDialog: function () {
        const self = this;
        self.destroyDialog();

        const $timeoutDialogDiv = $('<div>', { id: 'timeout-dialog' });
        const $timeoutMessageP = $('<p>', { id: 'timeout-message' });

        $timeoutMessageP.append(
          formatString(settings.message, '<span id="timeout-countdown">' + settings.countdown + '</span>'),
        );
        $timeoutDialogDiv.append($timeoutMessageP);
        $timeoutDialogDiv.append('<p id="timeout-question">' + settings.question + '</p>');

        $($timeoutDialogDiv)
          .appendTo('body')
          .dialog({
            modal: true,
            width: settings.dialogWidth,
            minHeight: 'auto',
            zIndex: 10000,
            closeOnEscape: false,
            draggable: false,
            resizable: false,
            dialogClass: 'timeout-dialog',
            title: settings.title,
            classes: {
              'ui-dialog': 'timeout-dialog',
            },
            buttons: {
              'keep-alive-button': {
                text: settings.keepAliveButtonText,
                id: 'timeout-keep-signin-btn',
                click: function () {
                  self.keepAlive();
                },
              },
              'sign-out-button': {
                text: settings.signOutButtonText,
                id: 'timeout-sign-out-button',
                click: function () {
                  self.signOut(true);
                },
              },
            },
          });

        self.startCountdown();
      },

      destroyDialog: function () {
        const timeoutDialog = $('#timeout-dialog');

        if (timeoutDialog.length) {
          timeoutDialog.dialog('close');
          timeoutDialog.remove();
        }
      },

      startCountdown: function () {
        const self = this;
        let counter = settings.countdown;

        this.countdown = window.setInterval(function () {
          counter -= 1;
          $('#timeout-countdown').html(counter);

          if (counter <= 0) {
            window.clearInterval(self.countdown);
            self.signOut(false);
          }
        }, 1000);
      },

      keepAlive: function () {
        const self = this;
        self.destroyDialog();
        window.clearInterval(this.countdown);

        const ajaxSettings = {
          type: 'POST',
          url: settings.keepAliveUrl,
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          cache: false,
        };

        // Making a clone due to jQuery $.extend can't due deep cloning
        const ajaxSettingsClone = $.extend(true, ajaxSettings, settings.ajaxSettings);

        $.ajax(ajaxSettingsClone)
          .done(function (response) {
            if (response && response === 'OK') {
              if (settings.restartOnYes) {
                self.setupDialogTimer();
              }
            } else {
              self.signOut(false);
            }
          })
          .catch(function (request, errorType, errorMessage) {
            let msg = '';

            if (errorType) {
              msg += `Error: ${errorType}`;
            }

            if (errorMessage) {
              msg += ` \nMessage: ${errorMessage}`;
            }

            const hasRequest = request && Object.keys(request).length > 0;

            if (hasRequest) {
              msg += ` \nRequest: ${JSON.stringify(request, null, 2)}`;
            }

            if (msg) {
              console.error(msg);
            }

            return;
          });
      },

      signOut: function (isForced) {
        const self = this;
        self.destroyDialog();

        if (settings.logoutUrl) {
          $.post(settings.logoutUrl, function (data) {
            self.redirectLogout(isForced);
          });
        } else {
          self.redirectLogout(isForced);
        }
      },

      redirectLogout: function (isForced) {
        const encodedURI = encodeURIComponent(window.location.pathname + window.location.search);
        let target = `${settings.logoutRedirectUrl}?next=${encodedURI}`;

        if (!isForced) {
          target += '&timeout=t';
        }

        window.location = target;
      },
    };

    TimeoutDialog.init();
  };
})(window.jQuery);
