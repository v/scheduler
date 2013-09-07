$(function() {

  function selectCampus(campus) {
    window.localStorage.setItem('campus', campus);
    $('.campus').removeClass('disabled');
    $('button.campus[value="'+campus+'"]').addClass('disabled');
    $('#scheduler').show();    

  }

  if(window.localStorage.getItem('campus')) {
    selectCampus(window.localStorage.getItem('campus'));
  }

  $('.campus').click(function() {
    selectCampus($(this).val());
  });

  $('.search-bar').autocomplete({
    'source': function(request, response) {
      var term = request.term;

      var results = autocomplete(window.json, term);
      console.log(results)
    response(_.map(results, function(item) {
      if(item.course) {
        item.value = window.json['ids'][item.subj]['courses'][item.course]
      } else {
        item.value = window.json['ids'][item.subj]['name'];
      }
      return item;
    }));
    },

  'select': function(event, ui) {
    if(ui.item.course) {
      //redirect to course page.
      window.location.href = '/list?subj='+ui.item.subj+'&course='+ui.item.course;
    } else {
      //redirect to department page.
      window.location.href = '/list?subj='+ui.item.subj;
    }
  }
  });
});
