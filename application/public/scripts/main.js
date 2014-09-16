$(function() {
  $("#sidebar-toggle").click(function(e) {
    e.preventDefault();
    $('.sidebar').toggleClass('sidebar-toggled');
    $('.content').toggleClass('sidebar-toggled');
    $('.inner-content').toggleClass('sidebar-toggled');
  });

  $('#tech').imagesLoaded(function() {
    $('#tech').masonry({
      itemSelector: '.tech-thumbnail',
      isFitWidth: true
    });
  });

  $('#connect').imagesLoaded(function() {
    $('#connect').masonry({
      itemSelector: '.tech-thumbnail',
      isFitWidth: true
    });
  });

  $('#agendaEventContainer1').height(500);
});
