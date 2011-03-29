/*!
 * Scrollpane plugin
 *
 * This plugin simulates the "iOS" scroll interface with an intuitive scrollbar
 * that only appears when focused.
 *
 * Author: Josh Sullivan (heavily altered from unknown source)
 * Version: 1.0
 */
(function ($) {
    $.fn.scrollpane = function (opts) {
        opts = $.extend({
            idleOpacity: '0'
        }, opts || {});

        return this.each(function() {
            var $pane = $(this),
                data = $pane.data('scrollpane');

            if (!data) {
                data = init();
            }

            var scrollbar = data.scrollbar,
                content = data.content,
                track = data.track,
                drag = data.drag,
                contentHeight = content.outerHeight(),
                height = $pane.height(),
                offset = $pane.offset(),
                ratio = height / contentHeight,
                ie7 = $.browser.msie && $.browser.version.charAt(0) === '7';
            
            if (ie7) {
                $pane.height($pane.parent().height());
                $pane.css({
                    'margin-right': '0px',
                    'overflow-y': 'auto',
                    'position': 'relative'
                });
                return;
            }
            if (ratio < 1) {
                scrollbar.show();
                scrollbar.height(height);
                drag.height(Math.floor(height * ratio) - 6);
            } else {
                scrollbar.hide();
            }
            $pane.unbind('dragTop').bind('dragTop', function () {
                var scrollTop = $pane.scrollTop(),
                        top = Math.min(Math.round(scrollTop * ratio), height - drag.height());
                drag.css('top', top + 'px');
            });
            $pane.unbind('resizeCheck').bind('resizeCheck', function () {
                var newOffset = $pane.offset(),
                        dataOffset = offset;
                if (newOffset && dataOffset) {
                    if (($pane.height() != height) || (content.height() != contentHeight) || (newOffset.top != dataOffset.top) || (newOffset.left != dataOffset.left)) {
                        try {
                            $pane.scrollpane();
                        } catch (e) {
                        }
                    }
                }
            });

            function init() {
                var barWidth = calcScrollbarWidth(),
                    scrollbarHTML = '<div class="scrollbar-container" style="width:' + barWidth + 'px;display:none;">' + '<div class="scrollbar-track"><div class="scrollbar-drag">' + '</div></div></div>',
                    scrollbar = $(scrollbarHTML),
                    content = $('<div class="scrollpane-content"></div>'),
                    drag = $('.scrollbar-drag', scrollbar);

                drag.css('opacity', opts.idleOpacity);
                $pane.wrapInner(content);
                $pane.append(scrollbar);
                $pane.attr('data-scrollpane', true);
                content = $('> div:first', $pane);
                content.css({
                    overflow: 'hidden'
                });
                $pane.css({
                    marginRight: '-' + barWidth + 'px',
                    overflowX: 'hidden',
                    overflowY: 'scroll',
                    height: '100%'
                });
                $pane.bind('mouseenter.scrollpane', function (e) {
                    drag.animate({
                        duration: 100,
                        opacity: '0.5'
                    });
                });
                $pane.bind('mouseleave.scrollpane', function () {
                    drag.animate({
                        duration: 100,
                        opacity: opts.idleOpacity
                    });
                });
                $pane.bind('scroll.scrollpane', throttle(function () {
                    $pane.trigger('dragTop');
                }, 10));
                drag.mousedown(function (event) {
                    $(document).unbind('mousemove.scrollpane');
                    event.preventDefault();
                    var offsetTop = event.pageY - drag.offset().top;
                    $(document).bind('mousemove.scrollpane',
                            function (event) {
                                $pane.scrollTop((event.pageY - $pane.offset().top - offsetTop) / ($pane.height() / content.outerHeight()));
                                return false;
                            }).mouseup(function () {
                        $(document).unbind('mousemove.scrollpane');
                    });
                    return false;
                });
                (function resizeCheck() {
                    setTimeout(function () {
                        $pane.trigger('resizeCheck');
                        resizeCheck();
                    }, 500);
                })();
                var scrollpane = {
                    scrollbar: scrollbar,
                    content: content,
                    track: $('.scrollbar-track', scrollbar),
                    drag: drag
                };
                $pane.data('scrollpane', scrollpane);
                return scrollpane;
            }
        });
    };

    function calcScrollbarWidth() {
        var divHTML = '<div style="width:50px;height:50px;overflow-y:scroll;position:absolute;top:-2000px;left:-2000px;">' + '<div style="height:100px;"></div></div>',
                div = $(divHTML);
        $('body').append(div);
        var w = $('div', div).innerWidth();
        div.remove();
        return (50 - w);
    }

    function throttle(callback, delay) {
        var lasttime = 0;
        return function () {
            var elapsed = +new Date() - lasttime,
                    args = arguments,
                    self = this;
            if (elapsed > delay) {
                lasttime = +new Date();
                callback.apply(self, args);
            }
        }
    }
})(jQuery, window);