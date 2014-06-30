
var QPolls = {};

(function() {

  QPolls.baseUrl = 'qpolls/';

  QPolls.totals = function(id, cb) {
    $.ajax({
      dataType: 'jsonp',
      url: QPolls.baseUrl + 'api/app/1.0/poll/' + id + '/vote/totals',
      success: QPolls.defaultSuccess(cb),
      error: QPolls.defaultError(cb)
    });
  };

  QPolls.list = function(secret, cb) {
    $.ajax({
      dataType: 'jsonp',
      url: QPolls.baseUrl + 'api/app/1.0/poll/list',
      data: { secret: secret },
      success: QPolls.defaultSuccess(cb),
      error: QPolls.defaultError(cb)
    });
  };

  QPolls.vote = function(pollId, options, cb) {
    $.ajax({
      dataType: 'jsonp',
      url: QPolls.baseUrl + 'api/app/1.0/poll/' + pollId + '/vote',
      data: { vote: options },
      success: QPolls.defaultSuccess(cb),
      error: QPolls.defaultError(cb)
    });
  };

  QPolls.defaultSuccess = function(cb) {
    return function(data) {
      if (data.error) return cb && cb(data.error);
      cb && cb(null, data.success);
    }
  };
  
  QPolls.defaultError = function(cb) {
    return function(jqXHR, textStatus, errorThrown) {
      if (console && console.log) console.log(jqXHR, textStatus, errorThrown);
      cb && cb(errorThrown);
    };
  };

  QPolls.normalizeTotals = function(poll, totals) {
    var result = [];
    var options = typeof(poll.options) == 'string' ? JSON.parse(poll.options) : poll.options;

    if (poll.type == QPolls.PollType.BOOLEAN) {
      var yes = 0;
      var no = 0;
      for (var i = 0, len = totals.length; i < len; i++) {
        if (totals[i].answer == 0) {
          no = totals[i].total;
        } else {
          yes = totals[i].total;
        }
      }
      result = [ { answer: 0, total: no }, { answer: 1, total: yes } ];
    } else {
      for (var i = 0, len = options.length; i < len; i++) {
        var found = false;
        for (var j = 0; j < totals.length; j++) {
          if (options[i].id == totals[j].answer) {
            found = true;
            result.push(totals[j]);
          }
        }
        if (!found) {
          result.push({ answer: parseInt(options[i].id), total: 0 });
        }
      }
    }
    return result;
  };

  QPolls.PollType = {
    BOOLEAN: 1,
    SINGLE: 2,
    MULTIPLE: 3
  };

})();
