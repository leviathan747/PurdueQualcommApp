$("#sidebar-toggle").click(function(e) {
  e.preventDefault();
  $('.sidebar').toggleClass('sidebar-toggled');
  $('.content').toggleClass('sidebar-toggled');
});
