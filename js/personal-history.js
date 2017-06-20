/* jshint esversion: 6 */
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

  thisUser = JSON.parse(thisUser); // parse string into json

  renderPersonalInfo(thisUser);

} );

var renderPersonalInfo = (user) => {
  // load department and reservation sum
  // load top 5 reservations
  $.ajax({
		url: '../server/reservation/personal-history-init.php',
		dataType: 'json',
		type: "POST",
		data: { user: user.userid, department: user.department.filter( (e) => { if(e!=1)return e; }) },
		cache: false,
		success: (response) => {
      let department = response.department,
          sum        = response.reservationSum,
          personalInfo = `
            <div class="personnal-avatar"><img alt="帅照" src="` + user.avatar + `"></div>
            <div class="personal-overall-info">
              <div class="personal-info-name-department"><span class="personal-info-name">` + user.name + `</span><span class="personal-info-department">` + department.join(',') + `</span></div>
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


var renderReservationInfo = (reservation) => {
  reservation.forEach( (e, i, res)=>{
    console.log(e);
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
    $('ul.reservation-list').append( reservationItem );
  } );
};
