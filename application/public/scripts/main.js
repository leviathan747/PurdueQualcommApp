$(function() {
  $("#sidebar-toggle").click(function(e) {
    e.preventDefault();
    $('.sidebar').toggleClass('sidebar-toggled');
    $('.content').toggleClass('sidebar-toggled');
  });

  $('#tech').imagesLoaded(function() {
    $('#tech').masonry({
      itemSelector: '.tech-thumbnail',
      isFitWidth: true
    });
  });
});
