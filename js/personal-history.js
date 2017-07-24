/* jshint esversion: 6 */

/**
 * [$ description]
 * @param  {[type]} let [description]
 * @return {[type]}     [description]
 */
var _user = {};
$( ()=>{
  let thisUser = localStorage.getItem('thisUser');
  if( !thisUser ){
	   window.location.href = 'http://www.gdrtc.org/dd-verification/index.php';
	}
	else if( thisUser == 'error' ){
		window.localStorage.removeItem('thisUser');
		window.close();
    return false;
	}

  _user = JSON.parse(thisUser); // parse string into json

  renderPersonalInfo();

  scrollToLoad();
} );

/**
 * [renderPersonalInfo description]
 * @param  {[type]} user [description]
 * @return {[type]}      [description]
 */
var renderPersonalInfo = () => {
  // load department and reservation sum
  // load top 5 reservations
  $.ajax({
		url: '../server/reservation/personal-history-init.php',
		dataType: 'json',
		type: "POST",
		data: { user: _user.userid, department: _user.department.filter( (e) => { if(e!=1)return e; }) },
		cache: false,
		success: (response) => {
      let department = response.department,
          sum        = response.reservationSum,
          personalInfo = `
            <div class="personnal-avatar"><img alt="帅照" src="` + _user.avatar + `"></div>
            <div class="personal-overall-info">
              <div class="personal-info-name-department"><span class="personal-info-name">` + _user.name + `</span><span class="personal-info-department">` + department.join(',') + `</span></div>
              <div class="personal-info-sum">一共借车<span>` + sum + `</span>次</div>
            </div>
          `;

      $('header.personal-info').html(personalInfo);
      renderReservationInfo(response.reservation);
    },
    error: () => {
      $('header.personal-info').html('通信失败，请重试');
    }
  });
};


/**
 * [renderReservationInfo description]
 * @param  {[type]} reservation [description]
 * @return {[type]}             [description]
 */
var renderReservationInfo = (reservation) => {
  reservation.forEach( (e, i, res)=>{
    // console.log(e);
    let reservationItem = `
    <li>
        <div class="car-img"><img alt="awesome car" src="` + e.carImageSrc + `"><div class="car-model">` + e.carModel + `</div></div>
        <div class="reservation-info-detail">
          <p><label>出发地点:</label><span>` + e.startpoint + `</span></p>
          <p><label>目的地点:</label><span>` + e.endpoint + `</span></p>
          <p><label>预计出发:</label><span>` + e['schedule-start'] + `</span></p>
          <p><label>预计返回:</label><span>` + e['schedule-end'] + `</span></p>
          <p><label>归还时间:</label><span>` + e.returnDt + `</span></p>
          <p><label>司机:</label><span>` + e.driver + `</span></p>
          <p><label>同行人员:</label><span>` + e.accompanist + `</span></p>
        </div>
    </li>
    `;
    $('ul.reservation-list div.pull-up-tip').before( reservationItem );
  } );
};

/**
 * [description]
 * @param  {[type]} arg [description]
 * @return {[type]}     [description]
 */
var loadmoreEnable = false,
    loadmoreMoveEnable = false,
    psitionY = 0,
    deltaY = 0;
var scrollToLoad = function() {
  $(window).on('scroll', function(e) {
    console.log( $(window).scrollTop(), $(document).height() - $('body').height() );
    if( $(window).scrollTop() >= $(document).height() - $('body').height() - 50 ){
      loadmoreEnable = true;
    }
    else{
      loadmoreEnable = false;
    }
  });

  $('main').on('touchstart', function(e){
    // console.log(e, e.changedTouches[0]);
    if(loadmoreEnable){
      loadmoreMoveEnable = true;
      positionY = e.changedTouches[0].clientY;
      $('ul.reservation-list div.pull-up-tip p').html('松开加载');
    }
  });

  $('main').on('touchmove', function(e){
    if(loadmoreEnable && loadmoreMoveEnable){
        e.preventDefault();
        deltaY = e.changedTouches[0].clientY - positionY;
        $('ul.reservation-list').css('transform', 'translateY(' + deltaY + 'px)');
    }
  });

  $('main').on('touchend', function(e){
    if(loadmoreEnable && loadmoreMoveEnable){
      deltaY = e.changedTouches[0].clientY - positionY;
      loadmore(deltaY);
    }
  });
};

/**
 * [loadmore description]
 * @return {[type]} [description]
 */
var offset = 1;
var loadmore = (distance) => {
  $('ul.reservation-list div.pull-up-tip p').html('加载中……');
  loadmoreEnable = false; loadmoreMoveEnable = false; deltaY = 0; positionY = 0;
  let backto0 = setInterval( ()=>{
    if(distance>0){
      distance = 0;
    }
    else if(distance==0){
      clearInterval(backto0);
    }
    else{
      distance += 10;
    }
    $('ul.reservation-list').css('transform', 'translateY(' + distance + 'px)');
  }, 10 );

  $.ajax({
		url: '../server/reservation/personal-history-retrieve.php',
		dataType: 'json',
		type: "POST",
		data: { user: _user.userid, offset: offset*5 },
		cache: false,
		success: (response) => {
      renderReservationInfo(response.reservation);
      $('ul.reservation-list div.pull-up-tip p').html('上拉加载更多');
      if(response.reservation.length){
        offset++;
      }
      else{
        $('ul.reservation-list div.pull-up-tip p').html('全部加载完毕');
      }
    },
    error: (response) => {
      $('ul.reservation-list div.pull-up-tip p').html('加载失败，请重试');
    }
  });
};
