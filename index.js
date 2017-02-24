;

/**
 *
 */

$(function() {


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
    var touchMoving = false;
    //
    $('.td-form-comb').on('touchstart', function(e){
      touchMoving = false;
    });
    // popup list
    $('.td-form-comb').on('touchend', function(e){
      if(touchMoving) return;
      $(e.currentTarget).find('ul').addClass('popup');
      $('.transparent-mask').addClass('popup');
    });
    // prevent popup while touch is moving
    $('.td-form-comb').on('touchmove', function(e){
      touchMoving = true;
    });

    /**
     * mask
     */
    $('.transparent-mask').on('touchend', function(e){
      console.log(e);
      $('.popup').removeClass('popup');
    });


})
