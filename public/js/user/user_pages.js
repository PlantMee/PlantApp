$(function () {
  $(document).scroll(function () {
    var $nav = $(".fixed-top");
    $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
  });
});
//Hamburger Nav menu
$(document).ready(function(){
    $('#nav-icon1').click(function(){
        $(this).toggleClass('open');
    });
});
//JAVASCRIPT FOR SEARCH MENU ITEM

    $('.navbar-search-button .search-button').on('click', function(e){
        e.preventDefault();
        $(this).blur();
        $('.navbar-menu-items').toggleClass('disabled fadeIn animated');
        $('.navbar-search-form').toggleClass('disabled fadeInLeft animated');
        $('.navbar-search-form input.search').val('').focus();
    });