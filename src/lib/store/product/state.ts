

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';



  const product_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},
    check_delete : { use : false, title: ''},
    
     
   });

  const product_form_state : any = writable({
    uid : 0,
    
    name : '',
    type : '기타',
    company : '',
    used : 1,

  })
  

  export {product_modal_state,product_form_state};