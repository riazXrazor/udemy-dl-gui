import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import { download } from 'electron-file-downloader';
import _ from 'lodash';
import Store from '../core/store';
import sanitize from 'sanitize-filename';
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let runningDownload = {};  
let focusWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

  const store = new Store({
    // We'll call our data file 'user-preferences'
    configName: '.udl',
    defaults: {}
  });

  ipcMain.on('download', (event, arg) => {
  
    arg.event = event;
    toDownload.push(arg);
    if(isDownloading == false)
    {
      isDownloading = true;
      startDownload();
    }
  })
  
  function startDownload(event,course){

    let data = store.get(course);
    let toDownload;
 
    toDownload = _.findIndex(data.downloads, function(o) { return o.state == 'R'; });
    if(toDownload == '-1')
    {
      toDownload = _.findIndex(data.downloads, function(o) { return o.state == 'P'; });
    }
    if(!toDownload == '-1')
    {
      event.sender.send('download-complet-' + course, {});
      return;
    }
    console.log(toDownload);
    let activeDownload = data.downloads[toDownload];
    data.downloads[toDownload].state = 'R';
    store.set(course,data);
    let filename = activeDownload.number +' - '+sanitize(activeDownload.title)+'.'+activeDownload.extension;
    console.log(filename)
     download(focusWindow, activeDownload.data_url, {
       directory : activeDownload.directory+'/'+sanitize(activeDownload.course_name)+'/'+sanitize(activeDownload.chapter),
       filename: filename,
       onStarted : (downloadItem)=>{
        runningDownload[course] = {};
        runningDownload[course].downloadItem = downloadItem;
        runningDownload[course].event = event;
        runningDownload[course].item = downloadItem;
        runningDownload[course].ReceivedBytesArr = [];
        runningDownload[course].speedValue = 0;
        
        runningDownload[course].downloadItem.once('done', (e, state) => {
          if (state === 'completed') {
            
            data.downloads[toDownload].state = 'C';
            data.completed++;
            runningDownload[course].event.sender.send('download-progress-' + course, runningDownload[course].progress);
            store.set(course,data);
              startDownload(event,course);

          } else {
            console.log(`Download failed ${course}: ${state}`)
          }
        })
      
        runningDownload[course].downloadItem.on('updated', (e, state) => {
          runningDownload[course].receivedBytes = runningDownload[course].downloadItem.getReceivedBytes();
          runningDownload[course].totalBytes = runningDownload[course].downloadItem.getTotalBytes();
          runningDownload[course].ReceivedBytesArr.push(runningDownload[course].receivedBytes);
         if (runningDownload[course].ReceivedBytesArr.length >= 2) {
              runningDownload[course].PreviousReceivedBytes = runningDownload[course].ReceivedBytesArr.shift();
              runningDownload[course].speedValue = Math.max(runningDownload[course].PreviousReceivedBytes, runningDownload[course].ReceivedBytesArr[0]) - Math.min(runningDownload[course].PreviousReceivedBytes, runningDownload[course].ReceivedBytesArr[0]);
        }

          let o = Object.assign({},{
            id : course, 
            item : {
              completed : _.filter(data.downloads,(o)=>o.state == 'C').length,
              total : data.downloads.length,
              downloading : activeDownload
            },
             progress : {
                    progress: runningDownload[course].receivedBytes / runningDownload[course].totalBytes,
                    speed:  runningDownload[course].speedValue,
                    remaining: runningDownload[course].totalBytes - runningDownload[course].receivedBytes,
                    status: state,
                    total: runningDownload[course].totalBytes,
                    downloaded: runningDownload[course].receivedBytes
             }
          });
          console.log('download-progress-' + course,o);
          runningDownload[course].progress = o;
          runningDownload[course].event.sender.send('download-progress-' + course, runningDownload[course].progress)
        });
      
      },
       onProgress: (item) => {
         
       }
     })
       .then(item => {
         
         
         
       })
       .catch((e) => {
         console.log(e);
         runningDownload[course].event.sender.send('download-progress-' + course, {
           progress: 0,
           speed: 0,
           remaining: 0,
           status: 'error',
           error: e
         })
       });

}

ipcMain.on('pause-download',(event, arg)=>{
  let course = store.get(arg.id);
  if(!_.isEmpty(course))
  {
    runningDownload[arg.id].item.pause();
    
    course.pause = true;
    store.set(arg.id,course);
  }
});

ipcMain.on('initiate-download', (event, arg) => {

  if(arg)
  {
    let course_data = store.get(arg.id);
    if(_.isEmpty(course_data))
    {
      store.set(arg.id, {
        total : arg.data.length,
        completed : 0,
        downloads : arg.data,
        directory : arg.data[0].directory
      });
    }
    else
    {
      if(!_.isEmpty(runningDownload[arg.id]))
      {
        if(runningDownload[arg.id].item.isPaused())
        {
          runningDownload[arg.id].item.resume();
          return;
        }
      }
    }
    focusWindow = BrowserWindow.getFocusedWindow()
    startDownload(event,arg.id);
  }
})

ipcMain.on('get-status-download',(event, arg)=>{
    let item = store.get(arg.id);
    if(!_.isEmpty(item))
    {
      let p = Number(parseFloat(item.completed * 100/ item.total).toFixed(2));
      console.log(arg.id+':'+p);
      event.sender.send('status-download-'+ arg.id, {
        percentage : p,
        directory : item.directory
      });
    }
  
})


function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    useContentSize: true,
    width: 500,
    resizable:false
  });

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
