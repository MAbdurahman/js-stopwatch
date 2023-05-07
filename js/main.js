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
  let carousel_index = 0;
  
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
  
});