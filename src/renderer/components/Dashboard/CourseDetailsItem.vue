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
                    <p class="item-nam limited-text">{{ title }}</p>
                    </tooltip>
                    <progress-bar :percent="downloadPercent" type="success" size="small" :showinfo="true" :info-inside="false"></progress-bar>
                     <div class="meta-data">
                      <time> 720p</time> <time v-if="status == 'progressing'">|</time>
                      <time v-if="status == 'progressing'"> {{ speed }}</time>
                      <div class="controls is-pulled-right">
                        <span class="icon is-small" v-if="status == 'progressing'">
                          <i class="fa fa-play"></i>
                        </span>
                        <span class="icon is-small" v-if="status == 'progressing'">
                          <i class="fa fa-pause"></i>
                        </span>
                        <span class="icon is-small" v-if="status == 'queued'">
                          <i class="fa fa-stop"></i>
                        </span>
                        <span class="icon is-small download-btn" @click="downloadVideo" v-if="status == 'waiting'">
                          <i class="fa fa-download"></i>
                        </span>
                      </div>
                     </div>
                  </div>
              </div>
            </div>
      </li>
</template>
<style lang="scss">
.download-btn:hover{
  cursor: pointer;
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
  height:540px;
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
  top:-6px;
}
</style>

<script>
  import { ipcRenderer} from 'electron';
  import cheerio from 'cheerio';
  import core from './../../../core';
  export default {
    name: "CourseItem",
    data:function(){
      return {
        downloadPercent : 0,
        status:'waiting',
        speed: 0
      }
    },
    props:{
      title :{
          type: String
      },
      thumbnail :{
          type: String
      },
      course_id :{
          type: [String, Number]
      },
      video_id :{
          type: [String, Number]
      }  
    },
    methods: {

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


      downloadVideo()
      {

          core.getLectureData(this.course_id,this.video_id).then(res => {

            console.log(res.body);
            let obj = JSON.parse(JSON.stringify(res.body));
            let $ = cheerio.load(obj.view_html);
            let data = JSON.parse($('react-video-player').attr('videojs-setup-data'));
            let video_sources = data.sources;
            console.log(video_sources[0]);
            this.status = 'queued';

            ipcRenderer.send('download',{
              id : this.video_id,
              url : video_sources[0].src
            });

          })
          .catch(e => {
            console.log(e);
          });
          
                ipcRenderer.on(`download-${this.video_id}`, (e,arg)=>{
                 
                  this.status = arg.status;
                  if(arg.status == 'progressing')
                  {
                    this.downloadPercent = Math.round(arg.progress * 100);
                    this.speed = this.bytesToSize(arg.speed)+'/sec';
                  }
                  else
                  {
                    this.downloadPercent = 100;
                    console.log(arg);
                  } 
                })
        
      }
    }
  };


</script>


