function download(dataObj,onProgress,onComplet,onError) {
  var request = require('request');
  var moment = require('moment');
  var progress = require('request-progress');
  var fs = require('fs');
  var path = require('path');
  var mkdirp = require('mkdirp');
  var files = require('./files');
  var sanitize = require('sanitize-filename');

    function bytesToSize(bytes,decimals) {
        if(bytes == 0) return '0 Bytes';
        var k = 1000,
            dm = decimals || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }


    function convertTime(input, separator) {
        var pad = function(input) {return input < 10 ? "0" + input : input;};
        return [
            pad(Math.floor(input / 3600)),
            pad(Math.floor(input % 3600 / 60)),
            pad(Math.floor(input % 60)),
        ].join(typeof separator !== 'undefined' ?  separator : ':' );
    }


  var bar;
  var fileUrl = dataObj.data_url,
      base_path = argv.output ? files.getCurrentDirectoryBase() + path.sep + argv.output : files.getCurrentDirectoryBase(),
      //edited to get current file with its chapter number
      title = sanitize(dataObj.video_number + " - " +dataObj.title)+'.mp4',
      apiPath = base_path + path.sep + sanitize(dataObj.chapter) + path.sep + title,
      total_size = 0,
      total_downloaded = 0,
      remaining_time = 0;

      console.log();
      console.log('Chapter : '+dataObj.chapter);
      console.log('Video : '+ title);
      console.log('Resolution : '+ dataObj.resolution+'p');
      console.log('Location : '+apiPath);

      if(files.fileExists(apiPath))
      {
        console.log("Already downloaded");
        callback();
      }
      else
      {

      mkdirp(base_path+path.sep+sanitize(dataObj.chapter), function (err) {
          if (err){
             onError(err);
             return;
           }

          // The options argument is optional so you can omit it
        progress(request(fileUrl), {
            // throttle: 2000,                    // Throttle the progress event to 2000ms, defaults to 1000ms
            // delay: 1000,                       // Only start to emit after 1000ms delay, defaults to 0ms
            // lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length
        })
        .on('request',function(req){

            onStart({
                'status': "start",
                't_size': total_size,
                'download_time': remaining_time,
                't_downloaded': total_downloaded
            });

        })
        .on('progress', function (state) {
            // The state is an object that looks like this:
            // {
            //     percent: 0.5,               // Overall percent (between 0 to 1)
            //     speed: 554732,              // The download speed in bytes/sec
            //     size: {
            //         total: 90044871,        // The total payload size in bytes
            //         transferred: 27610959   // The transferred payload size in bytes
            //     },
            //     time: {
            //         elapsed: 36.235,        // The total elapsed seconds since the start (3 decimals)
            //         remaining: 81.403       // The remaining seconds to finish (3 decimals)
            //     }
            // }

            total_size = bytesToSize(state.size.total);
            remaining_time = convertTime(state.time.remaining);
            total_downloaded = bytesToSize(state.size.transferred);

            onProgress({
                'status': "progress",
                't_size': total_size,
                'download_time': remaining_time,
                't_downloaded': total_downloaded
            });

        })
        .on('error', function (err) {
            console.log();
            console.log("Error Downloading please try again !!");
        })
        .on('end', function () {
            
            onComplet({
                'status': "complet",
                't_size': total_size,
                'download_time': remaining_time,
                't_downloaded': total_size
            });

            callback();
        })
        .pipe(fs.createWriteStream(apiPath));
      });
    }
  }



    module.exports = download;
