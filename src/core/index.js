import request from 'request-promise';
import cheerio from 'cheerio';
import session from './session';
import superagent from 'superagent';
import { forEach } from 'lodash';

export default {
    login: login,
    getCourseList: getCourseList,
    getCourseDetailsList: getCourseDetailsList,
    getLectureData: getLectureData
};

const HOST=`https://www.udemy.com`;
let config = session.config(HOST);
const agent = superagent.agent();

forEach(config.headers, function(value, key) {
    agent.set(key,value);
});

function get_csrf_token () {
    let config = session.config(HOST);
    config.uri = session.getCsrfUrl();
    return request(config);
}



function login(username, password){
    return new Promise(function(resolve, reject) {
        let login_url = `${HOST}/join/login-popup/`;
        let access_token,client_id;
        let payload = {'email' : username, 'password': password}
        agent
        .get(login_url)
        .then(res => {
            var $ = cheerio.load(res.text);
            payload['csrfmiddlewaretoken'] = $("input[name='csrfmiddlewaretoken']").val();
        })
        .then(()=>{
            payload['locale'] = 'en_US'

            return agent
            .post(login_url)
            .type('form')
            .send(payload)
        })
        .then(res => {
            res.headers['set-cookie'].forEach(function(a){

                let b = a.trim().split(';')[0].split('=');
                if(b[0]=="access_token"){
                    access_token = b[1];
                    return true;
                } else  if(b[0]=="client_id"){
                    client_id = b[1];
                    return true;
                }
              });

              if(access_token && client_id)
              {
                  resolve({
                    access_token,
                    client_id
                  });
              }
              else {
                reject(new Error("Cannot logging in"));
              }

        })
        .catch(r=>{
            reject(r);
        });

    });
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