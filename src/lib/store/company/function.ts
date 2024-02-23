

//@ts-nocheck

import { writable } from 'svelte/store';
import {company_modal_state,company_form_state} from './state';

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





company_modal_state.subscribe((data) => {
    update_modal = data;
})

company_form_state.subscribe((data) => {
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
 
 



const companyModalOpen = (data : any, title : any) => {
  console.log('data : ', data);

  console.log('title : ', title);
  
    alert['type'] = 'save';
    alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    company_modal_state.update(() => update_modal);

    console.log('update_modal : ', update_modal);

    if(title === 'add'){

      update_form = {
        uid : 0,
        type : '',
        code : '',
        name : '',
        phone : '',
        email : '',
        used : 1,
      
      };
      company_form_state.update(() => update_form);
     
    }
    if(title === 'update' ){
          Object.keys(update_form).map((item)=> {    
            
            if(item === 'type'){
              update_form[item] = data[item]['uid'];
            }else{
              update_form[item] = data[item];
            }
        
          }); 
            company_form_state.update(() => update_form);
            company_modal_state.update(() => update_modal);
           
    }
    if(title === 'check_delete'){
      let data =  table_data['company'].getSelectedData();

      common_selected_state.update(() => data);
   
   
  }
}



const modalClose = (title) => {
  update_modal['title'] = '';
  update_modal[title]['use'] = !update_modal[title]['use'];



  alert['type'] = 'save';
  alert['value'] = false;


  update_form = {
        uid : 0,
        type : '',
        code : '',
        name : '',
        phone : '',
        email : '',
        used : 1,
      
      };
  company_form_state.update(() => update_form);

  common_alert_state.update(() => alert);
  company_modal_state.update(() => update_modal);


}



const save = (param,title) => {


  update_modal['title'] = 'add';
  update_modal['add']['use'] = true;
 
    if(title === 'add'){
    
      if(param['name'] === '' || param['code'] === '' || param['type'] === ''){
        //return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        alert['type'] = 'save';
        alert['value'] = true;
        company_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
      
        const url = `${api}/company/save`
        try {
  
          let params = {
            type_uid : param.type,
            code : param.code,
            phone : param.phone,
            name : param.name,
            email : param.email,
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
        
            company_modal_state.update(() => update_modal);
            update_form = {
        uid : 0,
        type : '',
        code : '',
        name : '',
        phone : '',
        email : '',
        used : 1,
      
      };
            company_form_state.update(()=> update_form);

            select_query('company');
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
      const url = `${api}/company/update`
      try {

        let params = {
          type : param.type_uid,
          uid : param.uid,
          code : param.code,
          phone : param.phone,
          name : param.name,
          email : param.email,
      
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
          company_modal_state.update(() => update_modal);


          update_form = {
            uid : 0,
            type : '',
            code : '',
            name : '',
            phone : '',
            email : '',
            used : 1,
          
          };

          company_form_state.update(()=> update_form);
          select_query('company');
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
        common_alert_state.update(() => alert);

      }else{
        for(let i=0; i<data.length; i++){
          uid_array.push(data[i]['uid']);
        }
      }

        if(uid_array.length > 0){

          const url = `${api}/company/delete`
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
              update_modal['title'] = title;
              update_modal[title]['use'] = false;
              company_modal_state.update(() => update_modal);
              update_form = {
                uid : 0,
                type : '',
                code : '',
                name : '',
                phone : '',
                email : '',
                used : 1,
              
              };
              company_form_state.update(()=> update_form);

              select_query('company');
    
              return common_toast_state.update(() => toast);
    
            }else{
            
              alert['type'] = 'error';
              alert['value'] = true;
              
              return common_alert_state.update(() => alert);
            }
          })
          }catch (e:any){
            alert['type'] = 'error';
            alert['value'] = true;
            return common_alert_state.update(() => alert);
          };
    

        }


    }




  
  }
  // const bomRowUtil = (title) => {
  //   if(title === 'add'){
  //     let new_id = update_form['child'].length + 1;
  //     let new_bom_data = {
       
  //       id : new_id,
  //       maker : update_form['maker'],
  //       code : '',
  //       name : '',
  //       company : 'BOX',
  //       type : '완제품',
  //       check : false,
  //       use_qty : 0,

  //     };
  
  //     update_form['child'].push(new_bom_data);
  //   }else if(title === 'check_delete'){
  //     alert = {type : 'select', value : false}
      
  //     console.log('alert : ', alert);

 
  //     let delete_count = update_form['child'].filter(data => data.check === true).length;
  //     update_form['child'] = update_form['child'].filter(data => data.check === false) 



  //     console.log('child : ',delete_count);
  //     if(delete_count === 0 || delete_count === undefined){
  //       alert = {type : 'select', value : true}

  //       common_alert_state.update(() => alert);
       

  //     }

      
      

  //   }else {
  //     update_form['child'].pop();
  //   }
  
  //   company_form_state.update(() => update_form);
    
  // }


  // const bomRowCellClick = (title,id) => {
  //   if(title === 'check' ){
  //     for(let i =0; i<update_form['child'].length; i++){
  //       if(id === update_form['child'][i]['id']){
          
  //         update_form['child'][i][title] = !update_form['child'][i][title];
  //         break;
  //       }
  //     }
  
  //   }
    
  //   company_form_state.update(() => update_form);
    


  // }






export {companyModalOpen,save,modalClose}