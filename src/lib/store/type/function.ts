

//@ts-nocheck

import { writable } from 'svelte/store';
import {type_modal_state,type_form_state} from './state';

import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_state,common_selected_state} from '$lib/store/common/state';
import moment from 'moment';
import {select_query} from '$lib/store/common/function';
import {TOAST_SAMPLE} from '$lib/module/common/constants';

const api = import.meta.env.VITE_API_BASE_URL;




let update_modal : any;
let update_form : any;
let list_data : any;
let alert : any;
let toast : any;
let search_state : any;
let login_data : any;
let table_data : any;

let selected_data : any;





type_modal_state.subscribe((data) => {
    update_modal = data;
})

type_form_state.subscribe((data) => {
    update_form = data;
})


common_alert_state.subscribe((data) => {
  alert = data;
})
common_toast_state.subscribe((data) => {
  toast = data;
})

common_search_state.subscribe((data) => {
  search_state = data;
})

login_state.subscribe((data) => {
  login_data = data;
})
table_state.subscribe((data) => {
  table_data = data;
})

common_selected_state.subscribe((data) => {
  selected_data = data;
})
 
 



const typeModalOpen = (data : any, title : any) => {
  console.log('data : ', data);

  console.log('title : ', title);
  
    alert['type'] = 'save';
    alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    type_modal_state.update(() => update_modal);

    console.log('update_modal : ', update_modal);

    if(title === 'add'){
      update_form = {
        uid : 0,
        code : '',
        name : '',
        used : 1,
      
      }
      
      type_form_state.update(() => update_form);
     
    }
    if(title === 'update' ){
          Object.keys(update_form).map((item)=> {    
            
            update_form[item] = data[item];
        
          }); 
            type_form_state.update(() => update_form);
            type_modal_state.update(() => update_modal);
           
    }
    if(title === 'check_delete'){
      let data =  table_data['type'].getSelectedData();

      common_selected_state.update(() => data);
      
    
  }
}


const modalClose = (title) => {
  update_modal['title'] = '';
  update_modal[title]['use'] = !update_modal[title]['use'];

  alert['type'] = 'save';
  alert['value'] = false;
  common_alert_state.update(() => alert);
  type_modal_state.update(() => update_modal);


}




const save = (param,title) => {


  update_modal['title'] = 'add';
  update_modal['add']['use'] = true;
 
    if(title === 'add'){
    
      if(param['name'] === '' ){
        //return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        alert['type'] = 'save';
        alert['value'] = true;
        type_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
      
        const url = `${api}/type/save`
        try {
  
          
          let params = {
            name : param.name,
          
            used : param.used,
            
            token : login_data['token'],
          };
        axios.post(url,
          params,
        ).then(res => {
          console.log('res',res);
          if(res.data !== undefined && res.data !== null && res.data !== '' ){
            console.log('실행');
            console.log('res:data', res.data);
            
            toast['type'] = 'success';
            toast['value'] = true;
            update_modal['title'] = '';
            update_modal['add']['use'] = !update_modal['add']['use'];
            type_modal_state.update(() => update_modal);

            
            select_query('type');
            return common_toast_state.update(() => toast);

          }else{
          
            return common_toast_state.update(() => TOAST_SAMPLE['fail']);
          }
        })
        }catch (e:any){
          return console.log('에러 : ',e);
        };
      }


    
    }
    
    if(title === 'update'){
      const url = `${api}/type/update`
      try {

        let params = {
          uid : param.uid,
          name : param.name,
      
          used : param.used,
          token : login_data['token'],
        };
      axios.post(url,
        params,
      ).then(res => {
        console.log('res',res);
        if(res.data !== undefined && res.data !== null && res.data !== '' ){
          console.log('실행');
          console.log('res:data', res.data);
          
          toast['type'] = 'success';
          toast['value'] = true;
          update_modal['title'] = '';
          update_modal['update']['use'] = false;
          type_modal_state.update(() => update_modal);
          update_form = {
            uid : 0,
            code : '',
            name : '',
            used : 1,
          
          }
          
          type_form_state.update(()=> update_form);
          select_query('type');
          return common_toast_state.update(() => toast);

        }else{
        
          return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        }
      })
      }catch (e:any){
        return console.log('에러 : ',e);
      };


     
    }if(title === 'check_delete'){
      let data =  selected_data;
      let uid_array = [];

      console.log('deleted_data : ', data);
      if(data.length === 0){
        alert['type'] = 'check_delete';
        alert['value'] = true;
        return common_alert_state.update(() => alert);

      }else{
        for(let i=0; i<data.length; i++){
          uid_array.push(data[i]['uid']);
        }
      }

        if(uid_array.length > 0){

          const url = `${api}/type/delete`
          try {
    
            let params = {
              uid : uid_array,
            };
          axios.post(url,
            params,
          ).then(res => {
            console.log('res',res);
            if(res.data !== undefined && res.data !== null && res.data !== '' ){
              console.log('실행');
              console.log('res:data', res.data);
              
              toast['type'] = 'success';
              toast['value'] = true;
              update_modal['title'] = 'check_delete';
              update_modal[title]['use'] = false;
              type_modal_state.update(() => update_modal);
              update_form = {
                uid : 0,
                code : '',
                name : '',
                used : 1,
              
              }
              
              type_form_state.update(()=> update_form);

              select_query('type');
    
              return common_toast_state.update(() => toast);
    
            }else{
            
              alert['type'] = 'error';
              alert['value'] = true;
              
              return common_alert_state.update(() => alert);
            }
          })
          }catch (e:any){
            return console.log('에러 : ',e);
          };
    



        }
       
    }




  
  }
  






export {typeModalOpen,save,modalClose}