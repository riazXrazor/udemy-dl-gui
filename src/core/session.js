  
  module.exports = {
        config : () => {
          
          let headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:39.0) Gecko/20100101 Firefox/39.0',
            'X-Requested-With': 'XMLHttpRequest',
            'Host': 'www.udemy.com',
            'Authorization': "Basic YWQxMmVjYTljYmUxN2FmYWM2MjU5ZmU1ZDk4NDcxYTY6YTdjNjMwNjQ2MzA4ODI0YjIzMDFmZGI2MGVjZmQ4YTA5NDdlODJkNQ==",
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': 'https://www.udemy.com/join/login-popup',
            'Origin': 'https://www.udemy.com'
          };

          let access_token = window.localStorage.getItem('udl-access_token'), 
              client_id = window.localStorage.getItem('udl-client_id');
          if ( access_token && client_id )
          {
            headers['X-Udemy-Bearer-Token'] = access_token
            headers['X-Udemy-Client-Id'] = client_id
            headers['Authorization'] = "Bearer " + access_token
            headers['X-Udemy-Authorization'] = "Bearer " + access_token
          }

          return {
            resolveWithFullResponse: true,
            headers: headers
          }
        }
        ,
      set_auth_headers : function(){
        /*Setting up authentication headers.*/
        
      },
      getCsrfUrl(){
        return 'https://www.udemy.com/join/login-popup';
      }
      ,
      getLoginUrl(){
        return 'https://www.udemy.com/api-2.0/auth/udemy-auth/login/?fields[user]=access_token';
      },
      getCourseListUrl(){
        return 'https://www.udemy.com/api-2.0/users/me/subscribed-courses?page_size=100000';
      },
      getCourseDetailsUrl(course_id){
        return 'https://www.udemy.com/api-2.0/courses/' + course_id + '/cached-subscriber-curriculum-items?fields%5Basset%5D=@min,download_urls,stream_urls,title,filename,asset_type,external_url,length,status&fields%5Bchapter%5D=@min,description,object_index,title,sort_order&fields%5Blecture%5D=@min,object_index,asset,supplementary_assets,sort_order,is_published,is_free&fields%5Bpractice%5D=@min,object_index,title,sort_order,is_published&fields%5Bquiz%5D=@min,object_index,title,sort_order,is_published&page_size=9999';
      },
    getLectureUrl(course_id,video_id){
      //return `https://www.udemy.com/api-2.0/users/me/subscribed-courses/${course_id}/lectures/${video_id}?fields[lecture]=view_html,asset`
      return `https://www.udemy.com/api-2.0/users/me/subscribed-courses/${course_id}/lectures/${video_id}?fields[asset]=@min,download_urls,stream_urls,external_url,slide_urls&fields[course]=id,is_paid,url&fields[lecture]=@default,view_html,course&page_config=ct_v4`
    }

    };
