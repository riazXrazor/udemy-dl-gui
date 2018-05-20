<template>
   <li class="course-item">
            <div class="course-item-data ">
                <div class="columns is-clearfix">
                  <div class="column is-1 has-text-centered">
                  <figure class="image">
                    <img :src="thumbnail">
                  </figure>
                  </div>
                  <div class="column is-11">
                    <tooltip :content="title">
                    <p class="item-name limited-text">{{ title }}</p>
                    </tooltip>
                    <progress-bar v-if="isDownloading" :percent="percentage" type="info" size="small" :showinfo="false" :info-inside="false"></progress-bar>
                    <progress-bar :percent="overall_percentage" type="success" size="small" :showinfo="true" :info-inside="false"></progress-bar>
                   <div class="meta-data">
                      <div v-if="isDownloading" class="download-meta">
                        <time class="resolution"> {{ resolution }}</time> <time>|</time>
                        <time class="rate"> {{ rate }}</time>
                      </div>
                      <div class="controls is-pulled-right">
                        <span v-if="isResumeDownload && !isDownloading" class="icon is-small" @click="InitiateDownload">
                          <i class="fa fa-play"></i>
                        </span>
                      
                        <span v-if="isDownloading" class="icon is-small" @click="StopDownload">
                          <i class="fa fa-pause"></i>
                        </span>
                        <span class="icon is-small download-btn" @click="SelectResolution">
                          <i v-if="isLoading" class="fa fa-refresh fa-spin fa-fw"></i>
                          <i v-if="!isDownloading && !isResumeDownload" class="fa fa-download"></i>
                        </span>
                      </div>
                   </div>
                  </div>
              </div>
             
            </div>
            <modal title="Select Resolution" :on-ok="ResolutionSelected" :on-cancel="cancelCb" :is-show="isShow" @close="cancelCb">
              <a v-if="isLoading" class="button is-loading is-large loading-res">Loading</a>
              <radio-group v-model="resolution" v-else>
                  <radio-button v-for="resolution in avilableResolutions" :key="resolution.resolution" :val="resolution.resolution">{{ resolution.label }}</radio-button>
              </radio-group>
            </modal>
      </li>
</template>
<style lang="scss">
::-webkit-scrollbar-track{
    background: #e5e5e5 !important;
}
.limited-text{
    white-space: nowrap;
    width: 335px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.meta-data{
    white-space: nowrap;
    width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.controls{
   font-size: 0.7rem;
    color: #ccc;
    margin-top:5px;
}
.course-list {
  list-style: none;
  background: #e5e5e5;
  margin:0;
  padding: 0; // finality
  height:100%;
  overflow-y: scroll;
  li:nth-child(1) {
    padding-top:0.5rem;
    overflow: hidden;
  }
  
  li {
    padding: 0.1rem 0.2rem 0.1rem 0.5rem;
    overflow: hidden;
  }

  li:hover {
    // cursor: pointer;
    opacity: 0.9;
  }

  .icon{
    color: #6cc788;
  }

  .fa-remove{
    color: #f56954;
  }
  .fa-pause{
    color:#f39c12;
  }

  .item-name{
    font-size: 0.9rem;
    color: #909090
  }

}

.columns{
  
    .column.is-1{
       width:25%;
       float: left;
    }
    .column.is-11{
      width:75%;
      float: left;
    }
  
}

.course-item-data {
  background: white;
  padding: 10px;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(black, 0.2);
  p {
    font-size: 0.8rem;
    margin: 0 0 0.2rem 0;
  }
  time {
    font-size: 0.7rem;
    color: #ccc;
  }
}

.progress{
  margin-bottom: 0;
  margin-top: 10px;
}
  .progress.is-small{
    height: 2px;
  }

.progress-info{
  top:-7px !important;
  font-size: 10px;
}

.download-btn:hover{
  cursor: pointer;
}

.loading-res{
      border: 0;
      margin: 0 auto;
      display: block;
      font-size: 35px;
}
</style>

<script>
import { ipcRenderer } from 'electron';
import core from './../../../core';
import _ from 'lodash';
import { setTimeout } from 'timers';
const {dialog} = require('electron').remote
  export default {
    name: "CourseItem",
    data : function(){
      return {
        isShow: false,
        isLoading : false,
        isDownloading : false,
        percentage : 0,
        overall_percentage : 0,
        resolution: "",
        avilableResolutions:[],
        rate: "",
        isResumeDownload: false,
        course_vids:[]
      }
    },
    props:{
      status: {
        default: 'waiting',
        type: String
      },
      title :{
          type: String
      },
      thumbnail :{
          type: String
      },
      id :{
          type: [String, Number]
      } 
    },
    mounted : function(){
            let id = this.id;
            ipcRenderer.send('get-status-download',{
              id : id
            });

            ipcRenderer.on('status-download-'+id,(e,data)=>{
              this.overall_percentage = data.percentage;
              if(data.directory)
              {
                this.isResumeDownload = true;
              }
            });
    },
    methods: {
      SelectResolution() {
      this.isShow = !this.isShow;
      if(this.isShow && this.avilableResolutions.length == 0)
      {
        this.getResolutions();
      }
      
    },
    ResolutionSelected() {
      if(!this.resolution)
      {
        alert("please select a resolution");
      }
      else
      {
        this.isShow = false;
        this.InitiateDownload();
      }
    },
    cancelCb() {
      this.isShow = false;
      this.avilableResolutions = [];
      this.resolution = "";
    },
      bytesToSize(bytes, decimals) {
        if (bytes == 0) return '0 Bytes';
        var k = 1000,
          dm = decimals || 2,
          sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
          i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      },
      convertTime(input, separator) {
        var pad = function (input) { return input < 10 ? "0" + input : input; };
        return [
          pad(Math.floor(input / 3600)),
          pad(Math.floor(input % 3600 / 60)),
          pad(Math.floor(input % 60)),
        ].join(typeof separator !== 'undefined' ? separator : ':');
      },
      getResolutions()
      {
         let id = this.id;
        this.isLoading = true;
                core.getCourseDetailsList(id)
                .then(d => {
                      let data = JSON.parse(d.body);
                      let chapter;
                      let download_queue = [];
                      let video_number = 1;

                      this.course_vids = data.results;

                      let index = _.findIndex(data.results,function(item){
                          return item['asset'] ? item['asset'].asset_type == 'Video' : false;
                      });
                      let item = data.results[index];
                    //console.log(item);
                  
                        let videos;
                
                        if(item.asset.is_downloadable)
                        {
                            videos = item.asset.download_urls.Video;
                        }
                        else
                        {
                            videos = item.asset.stream_urls.Video;
                        }
              
                        for(let i=0;i<videos.length;i++)
                        {
                          if(!_.includes(videos[i].label.toLowerCase(),'auto'))
                          {
                            this.avilableResolutions.push({
                              label : videos[i].label,
                              resolution: videos[i].label
                            })
                          }
                        }
                    
                  })
                
                .catch(e => {
                    console.error(e);
                })
                .finally(()=>{
                  this.isLoading = false;
                });
      
      },
      InitiateDownload()
      {
        let id = this.id;

        if(this.isResumeDownload)
        {
            ipcRenderer.send('initiate-download',{
              id : id,
              data : []
            });
            this.isDownloading = true;
            ipcRenderer.on('download-progress-'+id, (event, args) => {
              if(!this.isDownloading)
              {
                return;
              }
              
              if(args.error)
              {
                console.log(args.error.getMessage());
                return;
              }
              if(args.id == id)
              {
                
                let item = args.item;
                let progress = args.progress;

                    this.resolution = item.downloading.resolution+'p';
                    this.rate = this.bytesToSize(progress.speed)+'/sec';
                    this.percentage = Math.round(progress.progress * 100);

                this.overall_percentage = Number(parseFloat(item.completed * 100/ item.total).toFixed(2));
              }
            });

            return;
        
        }

        //this.isLoading = true;

        let course_name = this.title;
        let video_save_folder =  dialog.showOpenDialog({properties: ['openFile', 'openDirectory']});
          video_save_folder = video_save_folder.pop();
 
            let chapter;
            let download_queue = [];
            let video_number = 1;

            this.course_vids.map((item)=>{
              
              if(item['_class'] == 'chapter')
              {
                chapter = item.title;
                return;
              }

              if(!item['asset'] || item['asset'].asset_type != 'Video')
              {
                return;
              }
              let videos;
              let list_videos = {};
              if(item.asset.is_downloadable)
              {
                   videos = item.asset.download_urls.Video;
              }
              else
              {
                   videos = item.asset.stream_urls.Video;
              }
    
              for(let i=0;i<videos.length;i++)
              {
                  list_videos[videos[i].label] = videos[i];
              }

                let url = this.resolution ? list_videos[this.resolution] : list_videos[360];

                let url_link = url
                let query_obj = url_link.type.split('/').pop();
                let element = {
                    state : 'P'
                };
                element.course_id  = id;
                element.course_name  = course_name;
                element.lecture_id  = item.id;
                element.id  = id+'-'+item.id;
                element.data_url  = unescape(url_link.file);
                element.extension = url_link.type.split('/').pop();
                element.title  = item.title;
                element.chapter  = chapter;
                element.resolution = 360;
                element.number = video_number++;
                element.directory  = video_save_folder
                download_queue.push(element);
              
            });

            ipcRenderer.send('initiate-download',{
              id : id,
              data : download_queue
            });
            this.isDownloading = true;
            ipcRenderer.on('download-progress-'+id, (event, args) => {
              if(!this.isDownloading)
              {
                return;
              }
              console.log(args);
              if(args.error)
              {
                console.log(args.error.getMessage());
                return;
              }

              if(args.id == id)
              {
             
              

                let item = args.item;
                let progress = args.progress;
              
              
                    this.resolution = item.downloading.resolution+'p';
                    this.rate = this.bytesToSize(progress.speed)+'/sec';
                    this.percentage = Math.round(progress.progress * 100);

                this.overall_percentage = Number(parseFloat(item.completed * 100/ item.total).toFixed(2));
              }
            });

            
          
         
      }
      ,
      StopDownload(){
          let id = this.id;
          this.isDownloading = false;
          this.isResumeDownload = true;
            ipcRenderer.send('pause-download',{
              id : id
            });
      }
    }
  };
</script>


