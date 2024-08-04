/* ============================================
            preloader
===============================================*/
$(window).on('load', function () {
  // makes sure that whole site is loaded
  $('#preloader-gif, #preloader').fadeOut(5000, function () {});
});

/*=============================================
         js-voice-note-app scripts
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

$(function () {
  //**************** variables ****************//
  const start_button = document.getElementById('start-btn');
  const lap_button = document.getElementById('lap-btn');
  const time_display = document.getElementById('time-display');
  const lap_time_list = document.getElementById('lap-time-list');

  let has_started = false;
  let has_stopped = true;
  let lap_count = 0;


  console.log(start_button);
  console.log(lap_button);
  console.log(time_display);
  console.log(lap_time_list);


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
    console.log('lap button clicked');
    if (lap_button.innerHTML == 'reset') {
      resetWatch();

    } else {
      addLap();
    }
  })

  function startWatch() {
    console.log('watch has started')

    has_started = true;
    has_stopped = false;
    start_button.innerHTML = 'stop'
    start_button.classList.toggle('btn--green');
    start_button.classList.toggle('btn--red');

    lap_button.innerHTML = 'lap';

  }

  function stopWatch() {
    console.log('watch has stopped')
    if (has_started) {
      has_started = false;
      has_stopped = true;
      start_button.innerHTML = 'start';
      start_button.classList.toggle('btn--red');
      start_button.classList.toggle('btn--green');

      lap_button.innerHTML = 'reset';
    }

  }
  function resetWatch() {
    console.log('reset watch');
    start_button.innerHTML = 'start';
    lap_button.innerHTML = 'lap';
    start_button.classList.remove('btn--red');
    start_button.classList.add('btn--green');
    lap_count = 0;
    console.log(lap_count)
  }

  function resumeWatch() {
    console.log('resume watch time')
  }

  function addLap() {
    console.log('count lap and add time')
    lap_count++;
    console.log(lap_count);
  }

  function displayTime() {
    console.log('')
  }

});