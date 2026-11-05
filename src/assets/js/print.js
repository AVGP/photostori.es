(function () {
  var card = document.getElementById("print-card");
  var btn = document.getElementById("turn");
  var front = document.getElementById("front");
  var back = document.getElementById("back");
  if (!card || !btn) return;

  // Share links: copy the address. Without JS they are plain links.
  var status = document.querySelector(".share-status");
  var links = document.querySelectorAll("[data-share]");
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function (e) {
      if (!navigator.clipboard) return;
      e.preventDefault();
      var href = this.href;
      navigator.clipboard.writeText(href).then(function () {
        if (status) {
          status.textContent = "Link copied";
          setTimeout(function () { status.textContent = ""; }, 2500);
        }
      }, function () { window.location.href = href; });
    });
  }

  // The flip. Reduced motion means the back is already below the front.
  var motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!motionOk) return;

  var turned = false;

  function fit() {
    var face = turned ? back : front;
    card.style.setProperty("--face-h", face.scrollHeight + "px");
  }

  function setTurned(state, instant) {
    turned = !!state;
    if (instant) {
      card.style.transition = "none";
      front.style.transition = "none";
      back.style.transition = "none";
    }
    card.classList.toggle("is-turned", turned);
    btn.setAttribute("aria-pressed", turned ? "true" : "false");
    btn.textContent = turned ? "Turn back" : "Turn over";
    front.inert = turned;
    back.inert = !turned;
    fit();
    if (instant) {
      void card.offsetWidth;
      card.style.transition = "";
      front.style.transition = "";
      back.style.transition = "";
    }
    var want = turned ? "#back" : "";
    if (window.location.hash !== want) {
      history.replaceState(null, "", window.location.pathname + window.location.search + want);
    }
  }

  btn.addEventListener("click", function () { setTurned(!turned); });
  window.addEventListener("hashchange", function () {
    if ((window.location.hash === "#back") !== turned) setTurned(!turned);
  });
  window.addEventListener("resize", fit);
  var img = front.querySelector("img");
  if (img && !img.complete) img.addEventListener("load", fit);

  setTurned(window.location.hash === "#back", true);
})();