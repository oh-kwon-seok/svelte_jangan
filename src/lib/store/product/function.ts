

//@ts-nocheck

import { writable } from 'svelte/store';
import {product_modal_state,product_form_state} from './state';

import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_state,common_selected_state} from '$lib/store/common/state';
import moment from 'moment';
import Excel from 'exceljs';
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
let product_upload_data : any;

let selected_data : any;


let init_form_data = {
  uid : 0,
  name : '',
  type : '기타',
  company : '',
  used : 1,

}


product_modal_state.subscribe((data) => {
    update_modal = data;
})

product_form_state.subscribe((data) => {
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
 
 



const productModalOpen = (data : any, title : any) => {
  console.log('data : ', data);

  console.log('title : ', title);
  
    alert['type'] = 'save';
    alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    product_modal_state.update(() => update_modal);

    console.log('update_modal : ', update_modal);

    if(title === 'add'){
      product_form_state.update(() => init_form_data);
     
    }
    if(title === 'update' ){
       
   
        Object.keys(update_form).map((item)=> {    
            if(item === 'company' ){
              update_form[item] = data[item]['uid'];
            }else{
              update_form[item] = data[item];
            }
           
        }); 

            product_form_state.update(() => update_form);
            product_modal_state.update(() => update_modal);
            console.log('update_modal : ', update_modal);

    }
    if(title === 'check_delete'){
      let data =  table_data['product'].getSelectedData();

      common_selected_state.update(() => data);
      
   
  }
}



const select_query = (type) => {
   
  const url = `${api}/${type}/select`; 
        
  let basic_date = moment().subtract(90,'days');
  

  
  let start_date = basic_date.format('YYYY-MM-DDTHH:mm:ss');
  let end_date = basic_date.add(150,'days').format('YYYY-MM-DDTHH:mm:ss');


  let params = 
  {
    start_date : start_date,
    end_date  : end_date
  };
  const config = {
    params : params,
    headers:{
      "Content-Type": "application/json",
      
    }
  }
    axios.get(url,config).then(res=>{
      console.log('table_state : ', table_state['product']);
      table_data[type].setData(res.data);
      table_state.update(() => table_data);
      console.log('table_data : ', table_data);
   })

}

const modalClose = (title) => {
  update_modal['title'] = '';
  update_modal[title]['use'] = !update_modal[title]['use'];

  alert['type'] = 'save';
  alert['value'] = false;
  common_alert_state.update(() => alert);
  product_modal_state.update(() => update_modal);


}



const save = (param,title) => {

  console.log(param);

  update_modal['title'] = 'add';
  update_modal['add']['use'] = true;
 
    if(title === 'add'){
    
      if(param['name'] === '' || param['type'] === '' || param['company'] === ''){
        //return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        alert['type'] = 'save';
        alert['value'] = true;
        product_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
      
        const url = `${api}/product/save`
        try {
  
          
          let params = {
            name : param.name,
            type : param.type,
            company_uid : param.company,
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
            product_modal_state.update(() => update_modal);

            select_query('product');

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
      const url = `${api}/product/update`
      try {

        let params = {
          uid : param.uid,
          name : param.name,
          type : param.type,  
          company_uid : param.company,
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
          product_modal_state.update(() => update_modal);
          product_form_state.update(()=> init_form_data);
          select_query('product');
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

          const url = `${api}/product/delete`
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
              product_modal_state.update(() => update_modal);
              product_form_state.update(()=> init_form_data);

            
              select_query('product');
    
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
  // const bomRowUtil = (title) => {
  //   if(title === 'add'){
  //     let new_id = update_form['child'].length + 1;
  //     let new_bom_data = {
       
  //       id : new_id,
  //       maker : update_form['maker'],
  //       code : '',
  //       name : '',
  //       unit : 'BOX',
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
  
  //   product_form_state.update(() => update_form);
    
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
    
  //   product_form_state.update(() => update_form);
    


  // }

  const productExcelUpload = (e) => {
  
    const product_config : any = [
      {header: '제품명', key: 'name', width: 30},
      {header: '품목분류', key: 'type', width: 30},
  
    ]; 


    const wb = new Excel.Workbook();
    const reader = new FileReader()

    let file = e.target.files[0];

    reader.readAsArrayBuffer(file)
    reader.onload = () => {
     let change_data = [];
     
      const buffer = reader.result;
      wb.xlsx.load(buffer).then(workbook => {
        console.log(workbook, 'workbook instance')
        workbook.eachSheet((sheet, id) => {
          sheet.eachRow((row, rowIndex) => {
          
            if(rowIndex > 1){
            let obj = {

            };
            for(let i=0; i<product_config.length; i++){
              obj[product_config[i].key] = row.values[i+1] !== '' ?  row.values[i+1] : "";

            }
            change_data.push(obj);
            
            product_upload_data = change_data;

          
          }else {

          }
          });

          console.log('product_upload_data',product_upload_data);

            const url = `${api}/product/excel_upload`
            try {
      
              let params = {
                data :  product_upload_data,
                
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
                select_query('product');
                return common_toast_state.update(() => toast);
      
              }else{
              
                return common_toast_state.update(() => TOAST_SAMPLE['fail']);
              }
            })
            }catch (e:any){
              return console.log('에러 : ',e);
            };
      
      
           
          



        
  

        })
      })

    }

  }







export {productModalOpen,save,productExcelUpload,modalClose}