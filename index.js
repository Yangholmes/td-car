;

/**
 *
 */

$(function() {

    /**
     * when touch is moving, prevent touchend event
     */
    var touchMoving = false;
    $('body').on('touchstart', function(e) {
        touchMoving = false;
    });
    $('body').on('touchmove', function(e) {
        touchMoving = true;
        $('.td-form-comb').on('touchend', function(e) {
            if (touchMoving) return; // prevent popup while touch is moving
            $(e.currentTarget).find('ul').addClass('popup');
            $('.transparent-mask').addClass('popup');
        });
    });

    /**
     * td-form-datetime-picker
     */
    $('.td-form-datetime-picker input').change(function(e) {
        $(e.target).prev('output').val(e.target.value); // notice: must format datetime value
    });

    /**
     * td-form-comb-text
     * td-form-comb-img-text
     */
    // popup list
    $('.td-form-comb').on('touchend', function(e) {
        if (touchMoving) return; // prevent popup while touch is moving
        $(e.currentTarget).find('ul').addClass('popup');
        $('.transparent-mask').addClass('popup');
    });
    // select item
    $('.td-form-comb ul li').on('touchend', function(e) {
        if (touchMoving) return; //
        e.stopPropagation(); // Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event.
        var selectedDiv = $(e.currentTarget).parent('ul').prev('.td-form-comb-selected').find('.td-form-comb-item'),
            selectedCtx = $(e.currentTarget).html();
        selectedDiv.html(selectedCtx);
        $('.popup').removeClass('popup');
    });

    /**
     * mask
     */
    $('.transparent-mask').on('touchend', function(e) {
        $('.popup').removeClass('popup');
    });


})
