<template>
  <div>
    <loader v-if="isSubmitting"></loader>
    <div v-if="!isSubmitting" class="form">
      <div class="thumbnail"><img src="~@/assets/logo.svg"/></div>
        <alert v-if="hasError" title="Error!" type="danger" :closable="true" :on-close="close">
        {{ hasError}}
      </alert>
      <form class="login-form" action="#" @submit.prevent="login">
        <input type="text" placeholder="username" v-model="username" />
        <input type="password" placeholder="password" v-model="password"  />
        <button type="submit" :class="{'button':true,'is-medium':true,'is-loading':isSubmitting}" :disabled="isSubmitting">login</button>
      </form>
    </div>
  </div>
</template>

<script>
  import core from './../../core';
  import cheerio from 'cheerio';
  import Loader from './Dashboard/Loader';
  import cookieParser from 'cookie';

  export default {
    name: 'login',
    components:{
      Loader
    },
    mounted: function () {
      let user = window.localStorage.getItem('udl-username');
      let pass = window.localStorage.getItem('udl-password');
      if(user && pass)
      {
        this.username = user;
        this.password = pass;
        this.login(true);
      }
    },
    data : function(){
      return {
        username : '',
        password : '',
        isSubmitting: false,
        hasError : ''
      };
    },
    methods: {
      close(){
        this.hasError = '';
        this.username = '';
        this.password = '';
      },
      login(direct) {
       if(!this.username.trim() || !this.password.trim()) {
         alert("Enter your udemy username and password");
         return;
       }
        this.isSubmitting = true;
        this.hasError = '';
       core.login(this.username,this.password).then(res=>{
        let $ = cheerio.load(res.body);
        console.log(res.body);
        let error = $('.js-error-list').text() || $('.js-error-alert').text();
         if(error)
         {
            this.hasError = error;
            if(direct)
            {
              this.isSubmitting = false;
            }
         }
         else
         {
                let cookies = res.headers['set-cookie'].join(';');
                        cookies = cookieParser.parse(cookies);

                       if(cookies.access_token && cookies.client_id)
                       {
                            window.localStorage.setItem('udl-username',this.username);
                            window.localStorage.setItem('udl-password',this.password);
                            window.localStorage.setItem('udl-access_token',cookies.access_token);
                            window.localStorage.setItem('udl-client_id',cookies.client_id);

                            // this.$db.findOne({'username':this.username,'password':this.password})
                            // .then(user => {
                            //       if(!user)
                            //       {
                            //          return this.$db.insert({
                            //            'username':this.username,
                            //            'password':this.password,
                            //            });
                            //       }
                            // })
                            // .then(() => {
                               this.$router.push('/dashboard');
                               if(direct)
                               {
                                 this.isSubmitting = false;
                               }
                            // })
                            // .catch(err => {
                            //     this.hasError = "Unable to login";
                            //     if(direct)
                            //     {
                            //       this.isSubmitting = false;
                            //     }
                            //     console.log(err);
                            // })

                           
                       }
                       else {

                          this.hasError = "Unable to login";
                          if(direct)
                          {
                            this.isSubmitting = false;
                          }
                         
                       }
         }
       })
       .catch(err => {
          console.log(err);
          this.hasError = "Somthing went wrong !!";
       })
       .finally(() => {
         if(!direct)
            this.isSubmitting = false;
       });
        
        
      },
    },
  };
</script>

<style scoped>/* Form */

.form {
  position: relative;
  z-index: 1;
  background: #FFFFFF;
  max-width: 400px;
  margin: 0 auto 0px;
  padding: 30px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  text-align: center;
}
.form .thumbnail {
  background: rgb(64, 151, 119);
  width: 150px;
  height: 150px;
  margin: 0 auto 30px;
  padding: 50px 30px;
  border-top-left-radius: 100%;
  border-top-right-radius: 100%;
  border-bottom-left-radius: 100%;
  border-bottom-right-radius: 100%;
  box-sizing: border-box;
}
.form .thumbnail img {
  display: block;
  width: 100%;
}
.form input {
  outline: 0;
  background: #f2f2f2;
  width: 100%;
  border: 0;
  margin: 0 0 15px;
  padding: 15px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  box-sizing: border-box;
  font-size: 14px;
}
.form button {
  outline: 0;
  background: rgb(64, 151, 119);
  width: 100%;
  border: 0;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  color: #FFFFFF;
  font-size: 14px;
  -webkit-transition: all 0.3 ease;
  transition: all 0.3 ease;
  cursor: pointer;
}
.form .message {
  margin: 15px 0 0;
  color: #b3b3b3;
  font-size: 12px;
}
.form .message a {
  color: rgb(64, 151, 119);
  text-decoration: none;
}

.container {
  position: relative;
  z-index: 1;
  max-width: 300px;
  margin: 0 auto;
}
.container:before, .container:after {
  content: "";
  display: block;
  clear: both;
}
.container .info {
  margin: 50px auto;
  text-align: center;
}
.container .info h1 {
  margin: 0 0 15px;
  padding: 0;
  font-size: 36px;
  font-weight: 300;
  color: #1a1a1a;
}
.container .info span {
  color: #4d4d4d;
  font-size: 12px;
}
.container .info span a {
  color: #000000;
  text-decoration: none;
}
.container .info span .fa {
  color: rgb(64, 151, 119);
}

/* END Form */
/* Demo Purposes */
body {
  background: #ccc;
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body:before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  display: block;
  background: rgba(255, 255, 255, 0.8);
  width: 100%;
  height: 100%;
}

</style>
