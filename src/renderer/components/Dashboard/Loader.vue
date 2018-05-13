<template>
    <div class="column notification has-text-centered overlay-loader">
            <div class="wrapper">
                <svg class="hourglass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 206" preserveAspectRatio="none">
                    <path class="middle" d="M120 0H0v206h120V0zM77.1 133.2C87.5 140.9 92 145 92 152.6V178H28v-25.4c0-7.6 4.5-11.7 14.9-19.4 6-4.5 13-9.6 17.1-17 4.1 7.4 11.1 12.6 17.1 17zM60 89.7c-4.1-7.3-11.1-12.5-17.1-17C32.5 65.1 28 61 28 53.4V28h64v25.4c0 7.6-4.5 11.7-14.9 19.4-6 4.4-13 9.6-17.1 16.9z"/>
                    <path class="outer" d="M93.7 95.3c10.5-7.7 26.3-19.4 26.3-41.9V0H0v53.4c0 22.5 15.8 34.2 26.3 41.9 3 2.2 7.9 5.8 9 7.7-1.1 1.9-6 5.5-9 7.7C15.8 118.4 0 130.1 0 152.6V206h120v-53.4c0-22.5-15.8-34.2-26.3-41.9-3-2.2-7.9-5.8-9-7.7 1.1-2 6-5.5 9-7.7zM70.6 103c0 18 35.4 21.8 35.4 49.6V192H14v-39.4c0-27.9 35.4-31.6 35.4-49.6S14 81.2 14 53.4V14h92v39.4C106 81.2 70.6 85 70.6 103z"/>
                </svg>
            </div>
   </div>
  
</template>

<style lang="scss" scoped>
 @import url('https://fonts.googleapis.com/css?family=Lato:900,400');

.overlay-loader{
  position: absolute;
  top: 0;
  left: 0;
  max-height: 100vh;
  height: 100vh;
  background: #1f7f5c;
  width: 100%;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;

}

.wrapper {
  font-size: 1.6rem;
  background: #1f7f5c;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
      -ms-flex-direction: column;
          flex-direction: column;
  -webkit-box-pack: center;
      -ms-flex-pack: center;
          justify-content: center;
}

.visuallyhidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}

.clearfix:before,
.clearfix:after {
  content: ' ';
  display: table;
}

.clearfix:after {
  clear: both;
}

.clearfix {
  zoom: 1;
}

.hourglass {
  display: block;
  background: #1f7f5c;
  margin: 3em auto;
  width: 2em;
  height: 4em;
  -webkit-box-shadow: inset #1f7f5c 0 0 0 0, inset #fff 0 2em 0 0, inset #1f7f5c 0 0 4em 0;
          box-shadow: inset #1f7f5c 0 0 0 0, inset #fff 0 2em 0 0, inset #1f7f5c 0 0 4em 0;
  -webkit-animation: hourglass 1s linear infinite;
          animation: hourglass 1s linear infinite;
}

.outer {
  fill: #fff;
}

.middle {
  fill: #1f7f5c;
}

@-webkit-keyframes hourglass {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
    -webkit-box-shadow: inset #1f7f5c 0 0 0 0, inset #fff 0 2em 0 0, inset #1f7f5c 0 4em 0 0, inset #fff 0 4em 0 0;
            box-shadow: inset #1f7f5c 0 0 0 0, inset #fff 0 2em 0 0, inset #1f7f5c 0 4em 0 0, inset #fff 0 4em 0 0;
  }
  80% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
    -webkit-box-shadow: inset #1f7f5c 0 2em 0 0, inset #fff 0 2em 0 0, inset #1f7f5c 0 2em 0 0, inset #fff 0 4em 0 0;
            box-shadow: inset #1f7f5c 0 2em 0 0, inset #fff 0 2em 0 0, inset #1f7f5c 0 2em 0 0, inset #fff 0 4em 0 0;
  }
  100% {
    -webkit-transform: rotate(180deg);
            transform: rotate(180deg);
    -webkit-box-shadow: inset #1f7f5c 0 2em 0 0, inset #fff 0 2em 0 0, inset #1f7f5c 0 2em 0 0, inset #fff 0 4em 0 0;
            box-shadow: inset #1f7f5c 0 2em 0 0, inset #fff 0 2em 0 0, inset #1f7f5c 0 2em 0 0, inset #fff 0 4em 0 0;
  }
}

@keyframes hourglass {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
    -webkit-box-shadow: inset #1f7f5c 0 0 0 0, inset #fff 0 2em 0 0, inset #1f7f5c 0 4em 0 0, inset #fff 0 4em 0 0;
            box-shadow: inset #1f7f5c 0 0 0 0, inset #fff 0 2em 0 0, inset #1f7f5c 0 4em 0 0, inset #fff 0 4em 0 0;
  }
  80% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
    -webkit-box-shadow: inset #1f7f5c 0 2em 0 0, inset #fff 0 2em 0 0, inset #1f7f5c 0 2em 0 0, inset #fff 0 4em 0 0;
            box-shadow: inset #1f7f5c 0 2em 0 0, inset #fff 0 2em 0 0, inset #1f7f5c 0 2em 0 0, inset #fff 0 4em 0 0;
  }
  100% {
    -webkit-transform: rotate(180deg);
            transform: rotate(180deg);
    -webkit-box-shadow: inset #1f7f5c 0 2em 0 0, inset #fff 0 2em 0 0, inset #1f7f5c 0 2em 0 0, inset #fff 0 4em 0 0;
            box-shadow: inset #1f7f5c 0 2em 0 0, inset #fff 0 2em 0 0, inset #1f7f5c 0 2em 0 0, inset #fff 0 4em 0 0;
  }
}

</style>

