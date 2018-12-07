<template>
  <frame-body>
    <loader v-if="isLoading"></loader>
     <course-list v-if="!isLoading && displayType == 'course-list'">
          
          <course-item  v-for="course in courseList" :key="course.id"  
                        :title="course.title" 
                        :thumbnail="course.image_125_H" 
                        :id="course.id"
                
                        @initiate-download="onInitiateDownload"
                      />
          
     </course-list>
     <course-details-list v-if="!isLoading && displayType == 'course-details'">
          
          <course-details-item  v-for="course in courseDetailsList"  :key="course.id"  
                        :title="course.title" 
                        :thumbnail="course.image" 
                        :course_id="course.course_id"
                        :video_id="course.id"
                        
                      />
          
     </course-details-list>
  </frame-body>
</template>

<style lang="scss">
@import "~bulma/css/bulma.css";
.course-list {
  list-style: none;
  background: #e5e5e5;
  margin:0;
  padding: 0; // finality
  height:600px;
  overflow-y: scroll;
  li:nth-child(1) {
    padding-top:0.5rem;
    overflow: hidden;
  }
  
  li {
    padding: 0.1rem 0.5rem 0.1rem 0.5rem;
    overflow: hidden;
  }
}

.columns{
  
    .column.is-1{
       width:15%;
       float: left;
    }
    .column.is-11{
      width:85%;
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
    height: 2px !important;
  }

.progress-info{
  top:-6px !important;
}

::-webkit-scrollbar {
  width: 5px;
}
 
::-webkit-scrollbar-thumb {
  background: #232323;
  border-radius: 20px;
}

::-webkit-scrollbar-track {
  background: #e5e5e5;
  border-radius: 20px;
}

</style>


<script>
  import { ipcRenderer} from 'electron';
  import FrameBody  from './Dashboard/FrameBody';
  import NavBar  from './Dashboard/NavBar';
  import Toolbar    from './Dashboard/Toolbar';
  import CourseList from './Dashboard/CourseList';
  import CourseName from './Dashboard/CourseName';
  import CourseItem from './Dashboard/CourseItem';
  import CourseDetailsList from './Dashboard/CourseDetailsList';
  import CourseDetailsItem from './Dashboard/CourseDetailsItem';
  import Loader from './Dashboard/Loader';
  import core from './../../core';
import { setTimeout } from 'timers';
  export default {
    name: "Dashboard",
    components : {
      Loader,
      NavBar,
      FrameBody,
      Toolbar,
      CourseName,
      CourseList,
      CourseItem,
      CourseDetailsList,
      CourseDetailsItem
    },
    data : function(){
      return {
          displayType:'course-list',
          username : '',
          password : '',
          isLoading : true,
          courseList : [],
          courseDetailsList : []
      }
    },
    mounted : function(){
      this.getCourseLists();                          
    },
   methods: {
      getCourseLists(){
          let user = window.localStorage.getItem('udl-username');
          let pass = window.localStorage.getItem('udl-password');
          console.log(user, pass);
          if(user && pass)
          {
            this.username = user;
            this.password = pass;
          }

            setTimeout(()=>{
              core.getCourseList()
              .then(res => {
                    console.log("res->");
                    let obj = JSON.parse(res.body); 
                    this.courseList = obj.results;
              })
              .catch(err => {
                  console.log("error->",err);
                // this.getCourseLists();
              })
              .finally(() => {
                  console.log("finally")
                  this.isLoading = false;
              }) 
            },500)
      },
      onGetDetails(img,id){
        console.log(img,id);
        this.isLoading = true;
         core.getCourseDetailsList(id)
         .then(d => {
           let data = JSON.parse(d.body);
           console.log(data);
           let courseLectures = data.results.filter(function(item){
             return item['_class'] == "lecture";
           });
           courseLectures.map(function(item){
             item.course_id = id;
             item.image = img;
             return item;
           });

           this.courseDetailsList = courseLectures;
            this.displayType = 'course-details';
         })
         .catch(e => {
            console.error(e);
         })
         .finally(()=>{
           this.isLoading = false;
         });
       },

       onInitiateDownload(id){
          //this.isLoading = true;
          core.getCourseDetailsList(id)
          .then(d => {
            let data = JSON.parse(d.body);
           // console.log(data);
            // let courseLectures = data.results.filter(function(item){
            //   return item['_class'] == "lecture";
            // });


            let chapter;
            let download_queue = [];
            let video_number = 1;
            data.results.map(function(item){
              
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

                let url = list_videos[360];

                let url_link = url
                let query_obj = url_link.type.split('/').pop();
                let element = {
                    state : 'P'
                };
                element.course_id  = id;
                element.lecture_id  = item.id;
                element.id  = id+'-'+item.id;
                element.data_url  = unescape(url_link.file);
                element.extension = url_link.type.split('/').pop();
                element.title  = item.title;
                element.chapter  = chapter;
                element.resolution = 360;
                element.number = video_number++;
                download_queue.push(element);
              
            });

            ipcRenderer.send('initiate-download',{
              id : id,
              data : download_queue
            });
            
          })
          .catch(e => {
              console.error(e);
          })
          .finally(()=>{
            //this.isLoading = false;
          });
       }
   
   
   
   
   
   } 
  };
</script>
