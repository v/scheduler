$(function() {
  window.json = {};
  if(window.localStorage.getItem('json')) {
    window.json = JSON.parse(window.localStorage.getItem('json'));
  }

  function loadCampusData(campus) {
    /* campus is one of NB NK CM */
    function loadUrl(url, campus, level) {
      var yurl = 'https://query.yahooapis.com/v1/public/yql';

      $.ajax({
        'url': yurl,
        'data': {
          'q': 'SELECT * FROM json WHERE url="'+url+'"',
          'format': 'json',
          'jsonCompat': 'new',
        },
        'dataType': 'jsonp',
        'success': function(response) {
          console.log('Successfully got data from JSON');
          if(!window.json[campus]) {
            window.json[campus] = response.query.results.json;
          } else {
            $.extend(true, window.json[campus], response.query.results.json);
          }

          var tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);

          window.json[campus].expiration = tomorrow;
          window.localStorage.setItem('json', JSON.stringify(window.json));
        },
      });
    }
    var base_url = 'https://rumobile.rutgers.edu/1/indexes/92013';

    // if we haven't already loaded the data or if it's expired.
    if(!window.json[campus] || window.json[campus].expiration < new Date())
      loadUrl(base_url + '_' + campus + '_U.json', campus, 'U')
    if(!window.json[campus] || window.json[campus].expiration < new Date())
      loadUrl(base_url + '_' + campus + '_G.json', campus, 'G')
  }

  function selectCampus(campus) {
    window.localStorage.setItem('campus', campus);
    $('.campus').removeClass('active');
    $('button.campus[value="'+campus+'"]').addClass('active');
    $('#scheduler').show();
    loadCampusData(campus)
  }
  //friendship is magic
  if(window.localStorage.getItem('campus')) {
    selectCampus(window.localStorage.getItem('campus'));
  }

  $('.campus').click(function() {
    selectCampus($(this).val());
  });

  $('.search-bar').on('focus', function(){
    $(this).autocomplete('search', $(this).val());
  });
  //power of the ponies
  $('.search-bar').autocomplete({
    'source': function(request, response) {
      var term = request.term;

      var courses = window.json[window.localStorage.getItem('campus')];

      var results = autocomplete(courses, term);
      console.log(results)

      response(_.map(results, function (item) {
        if(item.course) {
          item.value = courses['ids'][item.subj]['courses'][item.course]
        } else {
          item.value = courses['ids'][item.subj]['name'];
        }
        return item;
      }));
    },

    'select': function(event, ui) {
      params = {}
      if(ui.item.course) {
        //redirect to course page.
        params.subj = ui.item.subj;
        params.course = ui.item.course;
      } else {
        //redirect to department page.
        params.subj = ui.item.subj;
      }
      params.campus = window.localStorage.getItem('campus');
      params.q = $('.search-bar').val();
      window.location.href = '/list?' + $.param(params);
    }
  })
  .data('ui-autocomplete')._renderItem = function(ul, item) {
    var li = $('<li class="ui-menu-item row"></li>');
    var type = 'Department '+item.subj;
    if(item.subj && item.course) {
      type = 'Course '+item.subj+':'+item.course;
    }

    return li.append('<a class="result-title ui-corner-all col-lg-7">'+item.value+'</a>')
      .append('<a class="result-type col-lg-5 text-right"> '+type+' </a>')
      .appendTo(ul);
  };
});
