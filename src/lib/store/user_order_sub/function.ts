

//@ts-nocheck
import { DateTime } from 'luxon';
import { writable } from 'svelte/store';
import {user_order_modal_state,user_order_form_state} from './state';


import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_state,common_selected_state,common_user_state} from '$lib/store/common/state';
import Excel from 'exceljs';
import moment from 'moment';

import {TOAST_SAMPLE} from '$lib/module/common/constants';
import { businessNumber,phoneNumber} from '$lib/module/common/function';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {TABLE_TOTAL_CONFIG,TABLE_HEADER_CONFIG,TABLE_FILTER} from '$lib/module/common/constants';

const api = import.meta.env.VITE_API_BASE_URL;




let update_modal : any;
let update_form : any;
let list_data : any;
let alert : any;
let toast : any;
let search_state : any;
let login_data : any;
let table_data : any;
let user_data : any;
let selected_data : any;


let init_form_data = {
  uid : 0,
  id : '',
  code : '',
  customer_name : '',
  name : '',
  email : '',
  phone : '',
  password : '1111',
  car : '',
  used : 1,

}


user_order_modal_state.subscribe((data) => {
    update_modal = data;
})

user_order_form_state.subscribe((data) => {
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

common_user_state.subscribe((data) => {
  user_data = data;
})



const userOrderSubexcelDownload = (type,config) => {
  
  let data =  table_data[type].getSelectedData();
  


 
  if(data.length > 0){
    // 모든 객체에서 공통된 키(key) 이름을 찾기 위한 반복문
    for (let i = 0; i <  data.length; i++) {
      let currentObject =  data[i];

      Object.keys(currentObject).map((key)=> {    
      
        if(typeof currentObject[key] === "object"){
          console.log('data[i][key]',data[i][key]);

          console.log('typeof ',typeof data[i][key]);
          console.log('current ',currentObject[key]);
         
          console.log('key',key);
          if(key === 'product'){
             Object.keys(currentObject['product']).map((item) => {
              console.log('item : ', item);
              if(item === 'company'){
                data[i][item] = data[i][key][item]['name'];
              }if(item === 'name'){
                data[i][item] = data[i][key]['name'];
              }
         
        
            });
         

          }else if(key === 'userOrder'){
            Object.keys(currentObject['userOrder']).map((item) => {
              
              if(item === 'car'){
                data[i][item] = data[i][key][item]['name'];
              }
         
        
            });
          
          
          
          }else{
              data[i][key] = data[i][key]['name'];
          }
         
      
        }
      
      }); 
    }

    try {

      let text_title : any= '';
      switch(type){
          case 'product': 
              text_title = '품목 관리';
          break;
          
          default:
              text_title = '제목 없음';
          break;
    }

    const workbook = new Excel.Workbook();
      // 엑셀 생성

      // 생성자
      workbook.creator = '작성자';
     
      // 최종 수정자
      workbook.lastModifiedBy = '최종 수정자';
     
      // 생성일(현재 일자로 처리)
      workbook.created = new Date();
     
      // 수정일(현재 일자로 처리)
      workbook.modified = new Date();

      let file_name = text_title + moment().format('YYYY-MM-DD HH:mm:ss') + '.xlsx';
      let sheet_name = moment().format('YYYYMMDDHH:mm:ss');
   
    
      workbook.addWorksheet(text_title);
         

      const sheetOne = workbook.getWorksheet(text_title);
           
           
            
      // 컬럼 설정
      // header: 엑셀에 표기되는 이름
      // key: 컬럼을 접근하기 위한 key
      // hidden: 숨김 여부
      // width: 컬럼 넓이
      sheetOne.columns = config;
   
      const sampleData = data;
      const borderStyle = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
     
      sampleData.map((item, index) => {
        sheetOne.addRow(item);
     
        // 추가된 행의 컬럼 설정(헤더와 style이 다를 경우)
        
        for(let loop = 1; loop <= 6; loop++) {
          const col = sheetOne.getRow(index + 2).getCell(loop);
          col.border = borderStyle;
          col.font = {name: 'Arial Black', size: 10};
        }
      
    });


        
   
      workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = file_name;
        anchor.click();
        window.URL.revokeObjectURL(url);
      })
    } catch(error) {
      console.error(error);
    }

  }else{
    alert('데이터를 선택해주세요');
  }

}
 




export {userOrderSubexcelDownload}