import request from 'request-promise';
import cheerio from 'cheerio';
import session from './session';

export default {
    login: login,
    getCourseList: getCourseList,
    getCourseDetailsList: getCourseDetailsList,
    getLectureData: getLectureData
};

 
function get_csrf_token () {
    let config = session.config();
    config.uri = session.getCsrfUrl();
    return request(config);
}


function login (username, password) {
    let config = session.config();
        return get_csrf_token().then((res)=>{
           
            var cookie = res.headers['set-cookie'].join(';');
          
            let $ = cheerio.load(res.body);
            let csrf_token = $("input[name ='csrfmiddlewaretoken']").val();
            let payload = {
                'isSubmitted': 1, 'email': username, 'password': password,
                'displayType': 'ajax', 'csrfmiddlewaretoken': csrf_token
            }

            config.headers['Cookie'] = cookie;
            config['formData'] = payload;
            config['method'] = 'POST';
            config.uri = session.getLoginUrl();
         
            return request(config);

       
        });

}


function getCourseList() {
    let config = session.config();
    config.uri = session.getCourseListUrl();
    return request(config);
}

function getCourseDetailsList(id){
    let config = session.config();
    config.uri = session.getCourseDetailsUrl(id);
    return request(config);
}

function getLectureData(course_id,video_id){
    let config = session.config();
    config.uri = session.getLectureUrl(course_id, video_id);
    return request(config);
}