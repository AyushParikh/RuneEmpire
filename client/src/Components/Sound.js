export default function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.replace = function (newsrc) {
    this.sound.src = newsrc;
  };

  this.volume = function (vol) {
    this.sound.volume = vol;
  };

  this.play = function () {
    this.sound.play();
  };
  this.loop = function (loop) {
    if (loop) {
      this.sound.loop = true;
    }
  };
  this.stop = function () {
    this.sound.pause();
  };
  this.remove = function () {
    this.sound.remove();
  };
}
