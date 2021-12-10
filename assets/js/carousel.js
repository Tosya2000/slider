class Carousel {
  constructor(p) {
    const settings = { ...{ containerID: '#carousel', interval: 5000, isPlaying: true, slideID: '.slide' }, ...p };

    this.container = document.querySelector(settings.containerID);
    this.slideItems = this.container.querySelectorAll(settings.slideID);
    this.interval = settings.interval;
    this.isPlaying = settings.isPlaying;
  }
  _initProps() {
    this.currentSlide = 0;

    this.SLIDES_COUNT = this.slideItems.length;
    this.CODE_LEFT_ARROW = "ArrowLeft";
    this.CODE_RIGHT_ARROW = "ArrowRight";
    this.CODE_SPACE = "Space";
    this.FA_PAUSE = '<i class="far fa-pause-circle"></i>';
    this.FA_PLAY = '<i class="far fa-play-circle"></i>';
    this.FA_PREV = '<i class="fas fa-angle-left"></i>';
    this.FA_NEXT = '<i class="fas fa-angle-right"></i>';
  }
  _initControls() {
    const controls = document.createElement('div');
    const PAUSE = `<span class="control control-pause" id="pause-btn">                      
                    <span id="fa-pause-icon">${this.FA_PAUSE}</span>
                    <span id="fa-play-icon">${this.FA_PLAY}</span>
                  </span>`;
    const PREV = `<span class="control control-prev" id="prev-btn">${this.FA_PREV}</span>`;
    const PLAY = `<span class="control control-next" id="next-btn">${this.FA_NEXT}</span>`;

    controls.setAttribute('class', 'controls');
    controls.innerHTML = PAUSE + PREV + PLAY;

    this.container.append(controls);

    this.pauseButton = this.container.querySelector("#pause-btn");
    this.previousButton = this.container.querySelector("#prev-btn");
    this.nextButton = this.container.querySelector("#next-btn");

    this.pauseIcon = this.container.querySelector('#fa-pause-icon');
    this.playIcon = this.container.querySelector('#fa-play-icon');

    this.isPlaying ? this.pauseIcon.style.opacity = 1 : this.playIcon.style.opacity = 1;
  }
  _initIndicators() {
    const indicators = document.createElement('div');

    indicators.setAttribute('class', 'indicators');

    for (let i = 0, n = this.SLIDES_COUNT; i < n; i++) {
      const indicator = document.createElement('div');

      indicator.setAttribute('class', 'indicator');
      indicator.dataset.slideTo = `${i}`;
      i === 0 && indicator.classList.add('active');
      indicators.appendChild(indicator);
    }
    this.container.appendChild(indicators);

    this.indContainer = this.container.querySelector('.indicators');
    this.indItems = this.container.querySelectorAll('.indicator');
  }
  _initListeners() {
    this.pauseButton.addEventListener("click", this.pausePlay.bind(this));
    this.nextButton.addEventListener("click", this.next.bind(this));
    this.previousButton.addEventListener("click", this.prev.bind(this));
    this.indContainer.addEventListener("click", this._indicate.bind(this));
    this.container.addEventListener('mouseenter', this._pause.bind(this));
    this.container.addEventListener('mouseleave', this._play.bind(this));
    document.addEventListener("keydown", this._pressKey.bind(this));
  }
  _gotoNth(n) {
    this.slideItems[this.currentSlide].classList.toggle("active");
    this.indItems[this.currentSlide].classList.toggle("active");
    this.currentSlide = (n + this.SLIDES_COUNT) % this.SLIDES_COUNT;
    this.slideItems[this.currentSlide].classList.toggle("active");
    this.indItems[this.currentSlide].classList.toggle("active");
  }
  _gotoNext() {
    this._gotoNth(this.currentSlide + 1);
  }
  _gotoPrev() {
    this._gotoNth(this.currentSlide - 1);
  }
  _pause() {
    if (this.isPlaying) {
      this.pauseIcon.style.opacity = 0;
      this.playIcon.style.opacity = 1;
      this.isPlaying = false;
      clearInterval(this.timerID);
    }
  }
  _play() {
    if (!this.isPlaying) {
      this.pauseIcon.style.opacity = 1;
      this.playIcon.style.opacity = 0;
      this.isPlaying = true;
      this.timerID = setInterval(() => this._gotoNext(), this.interval);
    }
  }
  _indicate(e) {
    const target = e.target;
    if (target && target.classList.contains("indicator")) {
      this._pause();
      this._gotoNth(+target.dataset.slideTo);
    }
  }
  _pressKey(e) {
    if (e.code === this.CODE_LEFT_ARROW) this.prev();
    if (e.code === this.CODE_RIGHT_ARROW) this.next();
    if (e.code === this.CODE_SPACE) this.pausePlay();
  }

  _swipeSatrt(e) {
    this.swipeSatrtX = e.changedTouches[0].pageX;
  }
  _swipeEnd(e) {
    this.swipeEndX = e.changedTouches[0].pageX;
    if (this.swipeSatrtX - this.swipeEndX < -100) this.prev();
    if (this.swipeSatrtX - this.swipeEndX > 100) this.next();
  }
  pausePlay() {
    this.isPlaying ? this._pause() : this._play();
  }
  prev() {
    this._pause();
    this._gotoPrev();
  }
  next() {
    this._pause();
    this._gotoNext();
  }
  init() {
    this._initProps();
    this._initIndicators();
    this._initControls();
    this._initListeners();
    if (this.isPlaying) this.timerID = setInterval(() => this._gotoNext(), this.interval);
  }
}

export default Carousel;
// (function(){

//     init();
//   }());
