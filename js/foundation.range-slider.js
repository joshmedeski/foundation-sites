!function($, Foundation){
  'use strict';

  function Slider(element){
    this.$element = element;
    this.options = $.extend({}, Slider.defaults, this.$element.data());

    this._init();
  }

  Slider.defaults = {
    start: 0,
    end: 100,
    // min: start,
    // max: end,
    step: 1,
    initialStart: 0,
    initialEnd: 100,
    binding: false,
    clickSelect: true,
    vertical: false,
    draggable: true,
    disabled: false,

    doubleSided: false,
    steps: 100,
    decimal: 2,
    dragDelay: 0
  };

  Slider.prototype._init = function(){
    var inputs = this.$element.find('input'),
        handles = this.$element.find('[data-slider-handle]');
    this.options.vertical = this.$element.hasClass('vertical');
    this.options.disabled = this.$element.hasClass('disabled');
    this.$handle = handles.eq(0);
    this.$input = inputs.length ? inputs.eq(0) : $('#' + this.$handle.attr('aria-controls'));
    this.$fill = this.$element.find('[data-slider-fill]');

    this._setHandlePos(this.$handle, this.options.initialStart);


  };
  Slider.prototype._setHandlePos = function($hndl, location){
    var _this = this,
        vert = this.options.vertical,
        hOrW = vert ? 'height' : 'width',
        lOrT = vert ? 'top' : 'left',
        halfOfHandle = Number($hndl[0].getBoundingClientRect()[hOrW].toFixed(this.options.decimal)),
        // pctOfFill = this._calcPos(location),
        pctOfFill = percent(location, this.options.end, this.options.decimal),
        elemDim = Number(this.$element[0].getBoundingClientRect()[hOrW].toFixed(this.options.decimal)),
        pxToMove = (elemDim - halfOfHandle) * pctOfFill ,
        movement = (percent(pxToMove, elemDim, this.options.decimal) * 100).toFixed(this.options.decimal),
        anim;


    !function move(){
      console.log(_this.animComplete);
      if(!_this.animComplete){
        anim = window.requestAnimationFrame(move, $hndl[0]);
      }
      $hndl.css(lOrT, movement + '%');
    }();
    this.$element.on('transitionend.zf.slider', function(){
      _this.animComplete = true;
      window.cancelAnimationFrame(anim);
      _this.$element.off('transitionend.zf.slider');
      console.log('done moving');
    });
    // console.log(elemDim);
  };

  Slider.prototype._calcPos = function(location, cb){
    var _this = this,
        pct = percent(location, this.options.end, this.options.decimal);
    return pct;
    // cb(pct);
  };

  Slider.prototype._events = function(){
  };

  Foundation.plugin(Slider);

  function absPosition($handle, dir, clickPos, param){
    return Math.abs(($handle.position()[dir] + ($handle[param]() / 2)) - clickPos);
  }

  function percent(frac, num, dec){
    // return Number(((frac / num) * 100).toFixed(dec));
    return Number((frac / num).toFixed(dec));
  }

  $.fn.hasAttr = function(name) {
     return this.attr(name) !== undefined;
  };
}(jQuery, window.Foundation);

//*********this is in case we go to static, absolute positions instead of dynamic positioning********
// this.setSteps(function(){
//   _this._events();
//   var initStart = _this.options.positions[_this.options.initialStart - 1] || null;
//   var initEnd = _this.options.initialEnd ? _this.options.position[_this.options.initialEnd - 1] : null;
//   if(initStart || initEnd){
//     _this._handleEvent(initStart, initEnd);
//   }
// });

//***********the other part of absolute positions*************
// Slider.prototype.setSteps = function(cb){
//   var posChange = this.$element.outerWidth() / this.options.steps;
//   var counter = 0
//   while(counter < this.options.steps){
//     if(counter){
//       this.options.positions.push(this.options.positions[counter - 1] + posChange);
//     }else{
//       this.options.positions.push(posChange);
//     }
//     counter++;
//   }
//   cb();
// };
