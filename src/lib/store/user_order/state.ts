

import { writable } from 'svelte/store';
import {v4 as uuid} from 'uuid';



  const user_order_modal_state : any = writable( {
    title : 'add',
    add : { use : false, title: ''},
    update : { use : false, title: ''},
    delete : { use : false, title: ''},

    check_delete : { use : false, title: ''},
   
     
   });

  const user_order_form_state : any = writable({
    uid : 0,
    user : '',
    
    price_status : '미수금',
    order_status : '주문완료',
   
    image_url:'',
    ship_image_url : '',
  
    car : '',
    description : '**농협 김옥병(453103-56-019411) 오늘도 건강하고 힘나는 하루 되세요**',
    
    used : 1,
    
  })
  

  export {user_order_modal_state,user_order_form_state};