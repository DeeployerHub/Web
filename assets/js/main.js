(function () {
    'use strict';

    // Carousel Feature Slide
    var owlCrouselFeatureSlide = function () {
        var owl = $('.owl-carousel');

        owl.on('initialized.owl.carousel change.owl.carousel', function (elem) {
            var current = elem.item.index;
            $(elem.target).find('.owl-item').eq(current).find('.to-animate').removeClass('fadeInUp animated');
            $(elem.target).find('.owl-item').eq(current).find('.to-animate-2').removeClass('fadeInUp animated');

        });
        owl.on('initialized.owl.carousel changed.owl.carousel', function (elem) {
            setTimeout(function () {
                var current = elem.item.index;
                $(elem.target).find('.owl-item').eq(current).find('.to-animate').addClass('fadeInUp animated');
            }, 700);
            setTimeout(function () {
                var current = elem.item.index;
                $(elem.target).find('.owl-item').eq(current).find('.to-animate-2').addClass('fadeInUp animated');
            }, 900);
        });
        owl.owlCarousel({
            items: 1,
            loop: true,
            margin: 0,
            responsiveClass: true,
            nav: true,
            dots: true,
            autoHeight: true,
            smartSpeed: 500,
            autoplay: true,
            autoplayTimeout: 8000,
            autoplayHoverPause: true,
            navText: [
                '<i class="icon-arrow-left2 owl-direction"></i>',
                '<i class="icon-arrow-right2 owl-direction"></i>'
            ]
        });
    };

    // animate-box
    var contentWayPoint = function () {
        $('.animate-box').waypoint(function (direction) {
            if (direction === 'down' && !$(this).hasClass('animated')) {
                $(this.element).addClass('fadeInUp animated');
            }
        }, {offset: '75%'});
    };

    // Page Nav
    var clickMenu = function () {
        $('a[data-nav-section]').click(function (event) {
            var section = $(this).data('nav-section'),
                navbar = $('#navbar');

            $('html, body').animate({
                scrollTop: $('[data-section="' + section + '"]').offset().top
            }, 200);

            if (navbar.is(':visible')) {
                navbar.removeClass('in');
                navbar.attr('aria-expanded', 'false');
                $('.js-fh5co-nav-toggle').removeClass('active');
            }

            event.preventDefault();
            return false;
        });
    };

    // Reflect scrolling in navigation
    var navActive = function (section) {
        var $el = $('#navbar > ul');
        $el.find('li').removeClass('active');
        $el.each(function () {
            $(this).find('a[data-nav-section="' + section + '"]').closest('li').addClass('active');
        });
    };

    var navigationSection = function () {
        var $section = $('div[data-section]');
        $section.waypoint(function (direction) {
            if (direction === 'down') {
                navActive($(this.element).data('section'));

            }
        }, {
            offset: '150px'
        });

        $section.waypoint(function (direction) {
            if (direction === 'up') {
                navActive($(this.element).data('section'));
            }
        }, {
            offset: function () {
                return -$(this.element).height() + 155;
            }
        });
    };

    // Animations
    var publicAnimate = function () {
        if ($('.public-section').length > 0) {
            $('.public-section .to-animate').each(function (k) {
                var el = $(this);

                setTimeout(function () {
                    el.addClass('fadeInUp animated');
                }, k * 200, 'easeInOutExpo');
            });
        }
    };

    var publicWayPoint = function () {
        if ($('.public-section').length > 0) {
            $('.public-section').waypoint(function (direction) {
                if (direction === 'down' && !$(this).hasClass('animated')) {
                    setTimeout(publicAnimate, 1);
                    $(this.element).addClass('animated');
                }
            }, {offset: '95%'});
        }
    };

    var notifyJs = function () {
        $.notify.addStyle('eloyt', {
            html: '<div>\n<p data-notify-html></p>\n</div>',
            classes: {
                base: {
                    'font-weight': '400',
                    'padding': '8px 15px 0px 14px',
                    'text-shadow': '0 1px 0 rgba(255, 255, 255, 0.5)',
                    'background-color': '#fcf8e3',
                    'border': '1px solid #e7e7e7',
                    'border-radius': '4px',
                    'background-repeat': 'no-repeat',
                    'background-position': '3px 7px',
                    'width': '300px',
                    'min-height': '30px'
                },
                normal: {
                    'color': '#777',
                    'background-color': '#f8f8f8',
                    'border': '1px solid #e7e7e7',
                },
                success: {
                    'color': '#468847',
                    'background-color': '#DFF0D8',
                },
                error: {
                    'color': '#B94A48',
                    'background-color': '#F2DEDE',
                },
                info: {
                    'color': '#3A87AD',
                    'background-color': '#D9EDF7',
                },
                warn: {
                    'color': '#C09853',
                    'background-color': '#FCF8E3',
                }
            }
        });

        $.notify.defaults({
            clickToHide: true,
            autoHide: true,
            autoHideDelay: 7000,
            arrowShow: false,
            position: 'bottom left',
            style: 'eloyt',
            className: 'normal'
        });
    };

    $(document).ready(function () {
        owlCrouselFeatureSlide();
        clickMenu();
        navigationSection();
        publicWayPoint();
        notifyJs();
    });
}());
