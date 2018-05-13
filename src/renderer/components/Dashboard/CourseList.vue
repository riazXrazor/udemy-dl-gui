<template>
    <ol class="course-list">
         <slot></slot>
    </ol>
</template>
<style lang="scss">

.course-list {
  list-style: none;
  background: #e5e5e5;
  margin:0;
  padding: 0; // finality
  height:100%;
  overflow-y: scroll;
  li:nth-child(1) {
    padding-top:0.5rem;
  }

  li:nth-last-child() {
    padding-bottom:0.5rem;
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
    height: 2px;
  }

.progress-info{
  top:-6px;
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

