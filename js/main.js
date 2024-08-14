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
    });
  });
  
  slider_contents.forEach(function (slider_content, index) {
    slider_content.addEventListener('touchstart', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (e.touches.length !== 1) {
        return;

      }
      initial_position = e.touches[0].screenX;
      is_swipping = true;

    });

    slider_content.addEventListener('touchmove',function (e) {
      if (e.touches.length !== 1) {
        return;
      }
      if (!is_swipping) {
        return;
      }
      swipping_distance = e.touches[0].screenX - initial_position;

    });

    slider_content.addEventListener('touchend', function (e) {
      is_swipping = false;

    });
  })
});

$(function () {
  /************************* variables *************************/
  const start_button = document.getElementById('start-btn');
  const lap_button = document.getElementById('lap-btn');
  const time_display = document.getElementById('time-display');
  const lap_time_list = document.getElementById('lap-time-list');
  const interim_paragraph_parent = document.getElementById('interim-paragraph-parent');

  let [milli_seconds, seconds, minutes, hours] = [0, 0, 0, 0];
  let [formatted_hours, formatted_minutes, formatted_seconds, formatted_milli_seconds] = [0, 0, 0, 0];

  let lap_startTime_milliseconds = 0;
  let lap_stopTime_milliseconds = 0;
  let lapTime_milliseconds = 0;
  let current_time = 0;
  let formatted_time = '';

  let start_time = 0;
  let elapsed_time = 0;
  let time = 0;

  let lap_counter = 0;
  let lap_number = 0;
  let lap_time = 0;

  let has_started = false;
  let is_running = false;
  let has_stopped = true;

  let time_interval = null;

  console.log(start_button);
  console.log(lap_button);
  console.log(time_display);
  console.log(lap_time_list);

  /************************* functions *************************/

  function formatTime(time) {
    let ms = Math.floor((time % 1000) / 10);
    let sec = Math.floor((time / 1000) % 60);
    let min = Math.floor((time / 1000 / 60) % 60);
    let hrs = Math.floor(time / 1000 / 60 / 60);

    formatted_hours = hrs.toString().padStart(2, '0');
    formatted_minutes = min.toString().padStart(2, '0');
    formatted_seconds = sec.toString().padStart(2, '0');
    formatted_milli_seconds = ms.toString().padStart(2, '0');

    return `${formatted_hours}:${formatted_minutes}:${formatted_seconds}.${formatted_milli_seconds}`;

  }//end of formatTime function

  function getLapTimeMilliseconds(startTime, endTime) {
    return endTime - startTime;

  }//end of getLapTimeMilliseconds

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


  function startWatch() {
    console.log('watch has started')

    has_started = true;
    is_running = true;
    has_stopped = false;
    start_button.innerHTML = 'stop'
    start_button.classList.toggle('btn--green');
    start_button.classList.toggle('btn--red');

    lap_button.innerHTML = 'lap';

    /*if (time_interval !== null) {
      clearInterval(time_interval);
    }
    time_interval = setInterval(displayTime, 10);*/

    lap_startTime_milliseconds = Date.now();
    console.log('start time milliseconds -> ' + lap_startTime_milliseconds);

    start_time = Date.now();

    requestAnimationFrame(updateTime);

  }//end of  startWatch Funciton

  function stopWatch() {
    console.log('watch has stopped');

    if (has_started) {
      has_started = false;
      is_running = false;
      has_stopped = true;
      start_button.innerHTML = 'start';
      start_button.classList.toggle('btn--red');
      start_button.classList.toggle('btn--green');

      lap_button.innerHTML = 'reset';
      clearInterval(time_interval);

      lap_stopTime_milliseconds = Date.now();
      console.log('this is lap_stopTime_milliseconds ' , lap_stopTime_milliseconds);
    }

  }//end of stopWatch Function

  function resetWatch() {
    console.log('reset watch');

    start_button.innerHTML = 'start';
    lap_button.innerHTML = 'lap';
    start_button.classList.remove('btn--red');
    start_button.classList.add('btn--green');
    lap_counter = 0;
    lap_number = lap_counter;

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

  function deleteAllLapCountItems() {
    lap_time_list.innerHTML = '';
    addInterimPlaceholder();

  }//end of deleteAllLapCountItems function

  function addLap() {
    if (has_started) {
      lap_counter++;
      lap_number = getLapCount();

      current_time = Date.now();
      lapTime_milliseconds = getLapTimeMilliseconds(lap_startTime_milliseconds, current_time);
      lap_time = formatTime(lapTime_milliseconds);

      addLapCountItem();
      lap_startTime_milliseconds = current_time;
      lap_counter > 0 ? removeInterimPlaceholder() : '';

    }
  }//end of addLap function

  function addLapCountItem() {
    const id = new Date().getTime().toString();
    let attr = document.createAttribute('data-id');
    attr.value = id;

    const template = document.querySelector('#template');
    const clone = document.importNode(template.content, true);
    clone.querySelector('.lap-count-item').setAttributeNode(attr);
    clone.querySelector('.lap-count-inner-wrapper');
    clone.querySelector('.lap-count-number').textContent = `Lap ${getLapCount()}`;
    clone.querySelector('.lap-count-time').textContent = `${getLapTime()}`;
    clone.querySelector('.lap-count-line');

    lap_time_list.prepend(clone);

  }//end of addLapCountItem function

  function addInterimPlaceholder() {
    lap_time_list.innerHTML += `<li id="interim-paragraph-parent" class="interim-paragraph-parent">
                    <p class="interim-paragraph" spellcheck="false" contentEditable=false data-placeholder="No laps counted."></p>
                </li>`;

  }//end of the addInterimPlaceholde function

  function removeInterimPlaceholder() {
    const interimPlaceholder = document.getElementById('interim-paragraph-parent');
    if (interimPlaceholder) {
      interimPlaceholder.style.display = 'none';
    }
  }//end of removeInterimPlaceholder function

  function getLapTime() {
    return lap_time;

  }//end of getLapTime function

  function getLapCount() {
   return lap_counter < 10 ? '0' + lap_counter.toString() : lap_counter.toString();

  }//end of getLapCount Function




  function updateTime() {
    if (has_started) {
      time = Date.now() - start_time;
      updateDisplayTime(time);
      requestAnimationFrame(updateTime);

    }

  }//end of updateTime function

  function updateDisplayTime(time) {
    const formatted_time = formatTime(has_started ? time : elapsed_time);
    time_display.innerHTML = formatted_time;

  }//end of updateDisplayTime function

  /************************* add event listeners *************************/
  start_button.addEventListener('click', function (e) {
    e.preventDefault();

    if (start_button.innerHTML == 'start') {
      startWatch();

    } else {
      stopWatch();

    }
  })

  lap_button.addEventListener('click', function (e) {
    e.preventDefault();

    if (lap_button.innerHTML == 'reset') {
      resetWatch();

    } else {
      addLap();

    }
  })
});