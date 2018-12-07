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
    config.headers = {
        'Authorization': "Basic YWQxMmVjYTljYmUxN2FmYWM2MjU5ZmU1ZDk4NDcxYTY6YTdjNjMwNjQ2MzA4ODI0YjIzMDFmZGI2MGVjZmQ4YTA5NDdlODJkNQ=="
    }
    config.uri = session.getCsrfUrl();
    console.log(config)
    return request(config);
}


function login (username, password) {
    let config = session.config();
        console.log("login")

            let payload = {
                'email': username, 'password': password
            }

            config['formData'] = payload;
            config['method'] = 'POST';
            
            config.uri = session.getLoginUrl();
         
            return request(config);

}


function getCourseList() {
    let config = session.config();
    config.uri = session.getCourseListUrl();
    console.log("config",config)
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