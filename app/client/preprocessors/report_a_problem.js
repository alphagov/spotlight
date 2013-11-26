define([
  'jquery'
],
function ($) {
  var ReportAProblem = {
    showErrorMessage: function (jqXHR) {
      var response = "<h2>Sorry, we're unable to receive your message right now.</h2> " +
                     "<p>We have other ways for you to provide feedback on the " +
                     "<a href='/feedback'>support page</a>.</p>";
      $('.report-a-problem-container').html(response);
    },

    promptUserToEnterValidData: function() {
      ReportAProblem.enableSubmitButton();
      $('<p class="error-notification">Please enter details of what you were doing.</p>').insertAfter('.report-a-problem-container h2');
    },

    disableSubmitButton: function() {
      $('.report-a-problem-container .button').attr("disabled", true);
    },  

    enableSubmitButton: function() {
      $('.report-a-problem-container .button').attr("disabled", false);
    },

    showConfirmation: function(data) {
      $('.report-a-problem-container').html(data.message);
    },

    submit: function() {
      $('.report-a-problem-container .error-notification').remove();

      ReportAProblem.disableSubmitButton();
      $.ajax({
        type: "POST",
        url: "/contact/govuk/problem_reports",
        dataType: "json",
        data: $('.report-a-problem-container form').serialize(),
        success: ReportAProblem.showConfirmation,
        error: function(jqXHR, status) {
          if (status === 'error' || !jqXHR.responseText) {
            if (jqXHR.status == 422) {
              ReportAProblem.promptUserToEnterValidData();
            }
            else {
              ReportAProblem.showErrorMessage();
            }
          }
        },
        statusCode: {
          500: ReportAProblem.showErrorMessage
        }
      });
      return false;
    }
  };

  return function () {
    // toggle for reporting a problem (on all content pages)
    $('.report-a-problem-toggle a').on('click', function() {
      $('.report-a-problem-container').toggle();
        return false;
    });

    // form submission for reporting a problem
    var $forms = $('.report-a-problem-container form, .report-a-problem form');
    $forms.append('<input type="hidden" name="javascript_enabled" value="true"/>');
    $forms.append($('<input type="hidden" name="referrer">').val(document.referrer || "unknown"));

    $('.report-a-problem-container form').submit(ReportAProblem.submit);
  };
});
