$(document).ready(function(){
    // Window Scroll
    var lastScrollTop = 0;
    $(window).scroll(function(event){
        var header = $('#fh5co-header'),
        scrlTop = $(this).scrollTop();

        if ( scrlTop > 500 && scrlTop <= 2000 ) {
            header.addClass('navbar-fixed-top fh5co-animated slideInDown');
        } else if ( scrlTop <= 500) {
            if ( header.hasClass('navbar-fixed-top') ) {
                header.addClass('navbar-fixed-top fh5co-animated slideOutUp');
                setTimeout(function(){
                    header.removeClass('navbar-fixed-top fh5co-animated slideInDown slideOutUp');
                }, 100 );
            }
        }
    });
});
