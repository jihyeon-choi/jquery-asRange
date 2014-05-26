// keyboard
(function(window, document, $, undefined) {
    var $doc = $(document);

    $doc.on('asRange::ready', function(event, instance) {
        var step,
            keyboard = {
                keys: {
                    'UP': 38,
                    'DOWN': 40,
                    'LEFT': 37,
                    'RIGHT': 39,
                    'RETURN': 13,
                    'ESCAPE': 27,
                    'BACKSPACE': 8,
                    'SPACE': 32
                },
                map: {},
                bound: false,
                press: function(e) {
                    var key = e.keyCode || e.which;
                    if (key in keyboard.map && typeof keyboard.map[key] === 'function') {
                        keyboard.map[key](e);
                        return false;
                    }
                },
                attach: function(map) {
                    var key, up;
                    for (key in map) {
                        if (map.hasOwnProperty(key)) {
                            up = key.toUpperCase();
                            if (up in keyboard.keys) {
                                keyboard.map[keyboard.keys[up]] = map[key];
                            } else {
                                keyboard.map[up] = map[key];
                            }
                        }
                    }
                    if (!keyboard.bound) {
                        keyboard.bound = true;
                        $doc.bind('keydown', keyboard.press);
                    }
                },
                detach: function() {
                    keyboard.bound = false;
                    keyboard.map = {};
                    $doc.unbind('keydown', keyboard.press);
                }
            };
        if (instance.options.keyboard === true) {
            $.each(instance.pointer, function(i, p) {
                if (instance.options.step > 0) {
                    step = instance.options.step / instance.interval;
                } else {
                    step = 0.01;
                }
                var left = function() {
                    var value = p.value;
                    p.set('percent', value - step);
                };
                var right = function() {
                    var value = p.value;
                    p.set('percent', value + step);
                };
                p.$wrap.attr('tabindex', '0').on('focus', function() {
                    keyboard.attach({
                        left: left,
                        right: right
                    });
                    return false;
                }).on('blur', function() {
                    keyboard.detach();
                    return false;
                });
            });
        }
    });
})(window, document, jQuery);
