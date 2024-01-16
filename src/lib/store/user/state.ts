

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';



  const user_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},

    check_delete : { use : false, title: ''},
   
     
   });

  const user_form_state : any = writable({
    uid : 0,
    id : '',
    code : '',
    customer_name : '',
    name : '',
    email : '',
    phone : '',
    password : '1111',
    car : '',
    auth:'',
    used : 1,
    
  })
  

  export {user_modal_state,user_form_state};