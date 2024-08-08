/* ============================================
            preloader
===============================================*/
$(window).on('load', function () {
  // makes sure that whole site is loaded
  $('#preloader-gif, #preloader').fadeOut(5000, function () {});
});

/*=============================================
         js-stopwatch scripts
================================================*/
$(function () {
  //**************** variables ****************//
  const slider = document.getElementById('slider');
  let indicators = document.querySelectorAll('.indicator');
  let slider_contents = document.querySelectorAll('.slider-content');
  let carousel_index = 0;
  
  let initial_position = null;
  let is_swipping = false;
  let swipping_distance = 0;
  
  /**
   * @description - adds an EventListener with an anonymous function that updates the
   * indicator with the selected class and removes the selected class from the appropriate
   * indicator. Also, add the transform style to slide the slider.
   * @param {element}
   * @param {number}
   */
  indicators.forEach(function (indicator, index) {
    indicator.addEventListener('click', function (e) {
      carousel_index = index;
      document.querySelector('.indicator.selected').classList.remove('selected');
      indicator.classList.add('selected');
      slider.style.transform = 'translate(' + carousel_index * -50 + '%)';
    })
  });
  
  slider_contents.forEach(function (slider_content, index) {
    slider_content.addEventListener('touchstart', function (e) {
      console.log(e);
      e.preventDefault();
      e.stopPropagation();
      console.log(e.target);
      if (e.touches.length !== 1) {
        return;
      }
      initial_position = e.touches[0].screenX;
      
      
      console.log(e.target);
      is_swipping = true;
    })
    slider_content.addEventListener('touchmove',function (e) {
      console.log(e);
      if (e.touches.length !== 1) {
        return;
      }
      if (!is_swipping) {
        return;
      }
      swipping_distance = e.touches[0].screenX - initial_position;
      console.log('sliding: ', e.touches[0].screenX - initial_position);
    })
    slider_content.addEventListener('touchend', function (e) {
      
      
      is_swipping = false;
    })
  })
});
/*===============================================================
          js-stopwatch scripts
==================================================================*/
$(function () {
  //**************** variables ****************//
  const start_button = document.getElementById('start-btn');
  const lap_button = document.getElementById('lap-btn');
  const time_display = document.getElementById('time-display');
  const lap_time_list = document.getElementById('lap-time-list');

  const no_lap_count = document.querySelector('.no-lap-count');

  console.log(no_lap_count
  )

  let display_content;
  let has_started = false;
  let has_stopped = true;

  let lap_counter = 0;
  let lap_number = 0;
  let lap_time;

  let time_counter = 0;
  let time_interval = null;

  let [milli_seconds, seconds, minutes, hours] = [0, 0, 0, 0];

  console.log(start_button);
  console.log(lap_button);

  console.log(time_display);

  console.log(lap_time_list);

  /************************* add event listeners *************************/
  start_button.addEventListener('click', function (e) {
    e.preventDefault();

     if (start_button.innerHTML == 'start') {
       startWatch();

     } else {
       stopWatch();

     }
  });

  lap_button.addEventListener('click', function (e) {
    e.preventDefault();

    console.log('lap button clicked');
    if (lap_button.innerHTML == 'reset') {
      resetWatch();

    } else {
      addLap();

    }
  });

  /************************* functions *************************/
  /**
   * startWatch Function -
   */
  function startWatch() {
    console.log('watch has started')

    has_started = true;
    has_stopped = false;
    start_button.innerHTML = 'stop'
    start_button.classList.toggle('btn--green');
    start_button.classList.toggle('btn--red');

    lap_button.innerHTML = 'lap';

    if (time_interval !== null) {
      clearInterval(time_interval);
    }
    time_interval = setInterval(displayTime, 10);

  }//end of  startWatch Funciton

  /**
   * stopWatch Function -
   */
  function stopWatch() {
    console.log('watch has stopped');
    if (has_started) {
      has_started = false;
      has_stopped = true;
      start_button.innerHTML = 'start';
      start_button.classList.toggle('btn--red');
      start_button.classList.toggle('btn--green');

      lap_button.innerHTML = 'reset';
      clearInterval(time_interval);
    }

  }//end of stopWatch Function

  /**
   * resetWatch Function -
   */
  function resetWatch() {
    console.log('reset watch');

    start_button.innerHTML = 'start';
    lap_button.innerHTML = 'lap';
    start_button.classList.remove('btn--red');
    start_button.classList.add('btn--green');
    lap_counter = 0;
    lap_number = lap_counter;


    console.log(lap_counter);
    console.log(lap_number);

    clearInterval(time_interval);
    [milli_seconds, seconds, minutes, hours] = [0, 0, 0, 0];

    let h = hours < 10 ? '0' + hours : hours;

    let m = minutes < 10 ? '0' + minutes : minutes;

    let s = seconds < 10 ? '0' + seconds : seconds;

    let ms = milli_seconds < 10
       ? '0' + milli_seconds
       : milli_seconds < 100
          ? '' + milli_seconds
          : milli_seconds;

    time_display.innerHTML = `${h}:${m}:${s}.${ms}`;

    deleteAllLapCountItems();

  }//end of resetWatch Function

  /**
   * addLap Function -
   */
  function addLap() {
    if (has_started) {
      /*console.log('count lap and add time')
      lap_counter++;
      lap_number = getLapCount();
      console.log(lap_number);
      display_content = getLapTime();
      console.log(display_content);*/

      lap_counter++;
      lap_number = getLapCount();
      addLapCountItem();

    }

  }//end of addLap Function

  function addLapCountItem() {
    const id = new Date().getTime().toString();
    let attr = document.createAttribute('data-id');
    attr.value = id;

    const template = document.querySelector('#template');
    const clone = document.importNode(template.content, true);
    clone.querySelector('.lap-count-item').setAttributeNode(attr);
    clone.querySelector('.lap-count-inner-wrapper');
    clone.querySelector('.lap-count-number').textContent = `Lap ${lap_number}`;
    clone.querySelector('.lap-count-time').textContent = `${getLapTime()}`;
    clone.querySelector('.lap-count-line');

    lap_time_list.prepend(clone);

  }//end of addLapCountItem Function


  function deleteAllLapCountItems() {
    lap_time_list.innerHTML = '';

  }//end of deleteAllLapCountItems function

  function toggleNoLapCount() {
    document.getElementById('no-lap-count').classList.toggle('no-lap-count-hidden');
    document.getElementById('no-lap-count-para').classList.toggle('no-lap-count-para-hidden');
  }

  /**
   * displayTime Function -
   */
  function displayTime() {
    milli_seconds += 1;
    if (milli_seconds == 100) {
      milli_seconds = 0;
      seconds++;
      if (seconds == 60) {
        seconds = 0;
        minutes++;
        if (minutes == 60) {
          minutes = 0;
          hours++;
        }
      }
    }

    let h = hours < 10 ? '0' + hours : hours;

    let m = minutes < 10 ? '0' + minutes : minutes;

    let s = seconds < 10 ? '0' + seconds : seconds;

    let ms = milli_seconds < 10
       ? '0' + milli_seconds
       : milli_seconds < 100
       ?  '' + milli_seconds
       : milli_seconds;

    time_display.innerHTML = `${h}:${m}:${s}.${ms}`;

  }//end of displayTime Function

  function getLapTime() {
      return time_display.innerHTML;

  }//end of getLapTime Function

  function getLapCount() {
    return lap_counter.toString();

  }//end of getLapCount Function
});