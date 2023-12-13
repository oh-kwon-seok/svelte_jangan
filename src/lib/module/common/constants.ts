
import { DateTime } from 'luxon';


import {product_modal_state} from '$lib/store/product/state';

import {table_state} from '$lib/store/common/state';



import {productModalOpen} from '$lib/store/product/function';

import { carModalOpen } from '$lib/store/car/function';

import { companyModalOpen } from '$lib/store/company/function';
import { phoneNumber,businessNumber,updateSupplyPrice } from './function';

import { userModalOpen} from '$lib/store/user/function';

import { userOrderModalOpen} from '$lib/store/user_order/function';











let table_data : any;
table_state.subscribe((data : any) => {
    table_data = data;
  })
  

const LOGIN_ALERT = {
    type : 'success',
    title : '로그인',
    content : '로그인에 실패했습니다. 계정 및 비밀번호를 확인해주십시오,',
    
}

const DATA_SUCCESS_ALERT = {
    color : 'blue',
    data : [{
        title : '저장', 
        content : '데이터 저장에 성공했습니다.',
    },
    {
        title : '수정', 
        content : '데이터 수정에 성공했습니다.',
    },
    {
        title : '삭제', 
        content : '데이터 삭제에 성공했습니다.',
    }]
}


const DATA_FAIL_ALERT = {
    color : 'red',
    add : {title : '추가', content : '데이터 저장에 실패했습니다.'},

    update : {title : '수정', content : '데이터 수정에 실패했습니다.'},
    delete : {title : '삭제', content : '데이터 삭제에 실패했습니다.'},
    check_delete : {title : '선택 삭제', content : '데이터 선택 삭제에 실패했습니다.'},
    
}

const DATA_SELECT_ALERT = {
    color : 'red',
    select : {title : '실패', content : '데이터를 1개 이상 선택해주세요.'},
}

const MENU = {
    info : [
        {name: '품목 관리', help: " 품목관리란, 원자재,부자재,반제품,부분품,완제품 등 제품생산 및 출하에 필요한 모든 재료를 말합니다."},
    
        {name: 'BOM 관리', help: "BOM 관리란, 제품 생산 및 출하에 필요한 모든 원자재/부자재/반제품/부분품 등을 리스트로 관리하여 필요시 생산 및 출하메뉴에서 불러오는 메뉴입니다."},
        {name: '거래처 관리', help: "업체에서 거래하는 거래처 관리 메뉴입니다. 영업처 또는 제조사가 될 수도 있습니다."},
        {name: '회원 관리', help: "MES 프로그램을 사용하는 사용자를 관리하는 메뉴입니다."},
        {name: '창고 관리', help: "원자재,부자재,반제품,부분품,완제품 등을 관리하는 메뉴입니다."},
        {name: 'Excel 관리', help: "기준정보를 Excel에 작성하여 업로드하기 위한 메뉴입니다."},
      ],
}


const TOAST_SAMPLE = {
   
    success : {type : 'success', value : false, counter : 2},
    fail : {type : 'fail', value : false, counter : 2}
    
}


const TABLE_FILTER : any = {
    product : [
    {value : "all",name : "전체"},
    {value : "name", name : "상품명"},
    {value : "type", name : "분류"},
    {value : "company", name : "매입처"},
  
    ],
    
    car : [
        {value : "all",name : "전체"},
        {value : "name", name : "차량번호"},
    ],
    company : [
        {value : "all",name : "전체"},
        {value : "code", name : "사업자등록번호"},
        {value : "name", name : "매입처명"},
        {value : "phone", name : "연락처"},
        {value : "email", name : "이메일"},

        
    ],
    user : [
        {value : "all",name : "전체"},
        {value : "id", name : "ID"},
        {value : "car", name : "지정차량"},
        {value : "code", name : "사업자번호"},
        {value : "name", name : "이름"},
        {value : "email", name : "이메일"},
        {value : "phone", name : "연락처"},
    ],
    user_order : [
        {value : "all",name : "전체"},
        {value : "code", name : "사업자번호"},
        {value : "customer_name", name : "거래처명"},
        {value : "order_status", name : "주문상태"},
        {value : "price_status", name : "수금유무"},

        {value : "car", name : "지정차량"},
    ],
    user_order_sub : [
        {value : "all",name : "전체"},
        {value : "company", name : "매입처명"},
        {value : "name", name : "상품명"},
        {value : "type", name : "분류명"},
        {value : "car", name : "지정차량"},
        {value : "order_status", name : "주문상태"},
       
    ],
}

const EXCEL_CONFIG : any = {
    product : [
    {header: '번호코드', key: 'uid', width: 30},
    {header: '분류', key: "type", width: 30},
    {header: '상품명', key: 'name', width: 30},
   
   
    {header: '등록일', key: 'created', width: 30},
    ],
  
   
    car : [
        {header: '번호코드', key: 'uid', width: 30},
        {header: '차량번호', key: 'name', width: 30},
        {header: '등록일', key: 'created', width: 30},
    ],
    company : [
        {header: '번호코드', key: 'uid', width: 30},
        {header: '사업자등록번호', key: 'code', width: 30},
        {header: '회사명', key: 'name', width: 30},
        {header: '연락처', key: 'phone', width: 30},
        {header: '이메일', key: 'email', width: 30},
        {header: '등록일', key: 'created', width: 30},
    ],
    user : [
        {header: 'ID', key: 'id', width: 30},
        {header: '지정차량', key: 'car', width: 30},
        {header: '사업자등록번호', key: 'code', width: 30},
        {header: '회사명', key: 'customer_name', width: 30},
        {header: '대표자명', key: 'name', width: 30},
        {header: '연락처', key: 'phone', width: 30},
        {header: '이메일', key: 'email', width: 30},
        {header: '등록일', key: 'created', width: 30},
    ],
    user_product : [
        {header: '번호코드', key: 'uid', width: 30},
        {header: '분류', key: "type", width: 30},
        {header: '상품명', key: 'name', width: 150},
        {header: '개수', key: 'qty', width: 30},

        {header: '등록일', key: 'created', width: 30},
        ],
        user_order_sub : [
            {header: '매입처', key: 'company', width: 30},
            {header: '상품명', key: 'name', width: 150},  
            {header: '주문수량', key: 'qty', width: 30},  
            {header: '차량명', key: 'car', width: 30},
        
            ],
}; 


const TABLE_HEADER_CONFIG : any = {
    product : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID", field:"uid", width:150, headerFilter:"input"},
        {title:"분류", field:"type", width:150, headerFilter:"input"},
      
        {title:"상품명", field:"name", width:500, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
         },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
            if(row){
                productModalOpen(row.getData(),"update");
            }else{
                
            }
            }
        },
        
        {title:"매입처", field:"company.name", width:150, headerFilter:"input"},
        {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
        formatter: function(cell : any, formatterParams: any, onRendered: any) {
            // Luxon을 사용하여 datetime 값을 date로 변환
            const datetimeValue = cell.getValue();
            const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
            return date;
        },
    }],


    car : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID", field:"uid", width:150, headerFilter:"input"},
        {title:"차량번호", field:"name", width:150, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
         },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
           if(row){
            carModalOpen(row.getData(),"update");
           }else{
          
           }
        }
    },
        {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
        formatter: function(cell : any, formatterParams: any, onRendered: any) {
            // Luxon을 사용하여 datetime 값을 date로 변환
            const datetimeValue = cell.getValue();
            const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
            return date;
        },
    }],

    company : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID", field:"uid", width:150, headerFilter:"input"},
        {title:"사업자번호", field:"code", width:150, headerFilter:"input",
        formatter:function(cell : any){
            var value = cell.getValue();
        return businessNumber(value);
         },
        },
        
        {title:"매입처명", field:"name", width:150, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
         },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
           if(row){
            companyModalOpen(row.getData(),"update");
           }else{
          
           }
        }
    },
        
    {title:"연락처", field:"phone", width:150, headerFilter:"input", formatter:function(cell : any){
        var value = cell.getValue();
    return phoneNumber(value);
     }},
    {title:"이메일", field:"email", width:150, headerFilter:"input"},

        {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
        formatter: function(cell : any, formatterParams: any, onRendered: any) {
            // Luxon을 사용하여 datetime 값을 date로 변환
            const datetimeValue = cell.getValue();
            const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
            return date;
        },
    }],

    user : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect()
        }},
        {title:"ID", field:"id", width:150, headerFilter:"input"},
        {title:"사업자번호", field:"code", width:150, headerFilter:"input",
        formatter:function(cell : any){
            var value = cell.getValue();
        return businessNumber(value);
         },
        },
        {title:"상호명", field:"customer_name", width:150, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
            
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
         },

        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
           if(row){
            userModalOpen(row.getData(),"update");
           }else{
          
           }
        }
        },
        {title:"지정차량", field:"car.name", width:150, headerFilter:"input"},
        {title:"연락처", field:"phone", width:150, headerFilter:"input", formatter:function(cell : any){
            var value = cell.getValue();
        return phoneNumber(value);
         },},
  
        {title:"이메일", field:"email", width:150, headerFilter:"input"},
        
        {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
        formatter: function(cell : any, formatterParams: any, onRendered: any) {
            // Luxon을 사용하여 datetime 값을 date로 변환
            const datetimeValue = cell.getValue();
            const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
            return date;
        }},     
    
   ],

   user_product : [
    {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:true, 
    cellClick:function(e : any, cell:any){
        cell.getRow().toggleSelect();
        console.log(cell.getRow());
    }},
    {title:"ID", field:"uid", width:150, headerFilter:"input"},
    {title:"분류", field:"type", width:150, headerFilter:"input", 
    formatter:function(cell : any){
        var value = cell.getValue();
    return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
     },
    },
    {title:"상품명", field:"name", width:150, headerFilter:"input", 
    formatter:function(cell : any){
        var value = cell.getValue();
    return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
     },
    },
    {title:"수량", field:"qty", width:150, editor : "input"},

   ],

   user_order : [
    {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
    cellClick:function(e : any, cell:any){
        cell.getRow().toggleSelect()
    }},
    {title:"ID", field:"uid", width:150, headerFilter:"input"},
    {title:"사업자번호", field:"user.code", width:150, headerFilter:"input",
    formatter:function(cell : any){
        var value = cell.getValue();
    return businessNumber(value);
     },
    },
    {title:"거래처명", field:"user.customer_name", width:150, headerFilter:"input", 
    formatter:function(cell : any){
        var value = cell.getValue();
    return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
     },

    cellClick:function(e : any, cell:any){
        let row = cell.getRow();
       if(row){
        userOrderModalOpen(row.getData(),"update");
       }else{
      
       }
    }
    },

    {title:"주문상태", field:"order_status", width:150, headerFilter:"input"},
    {title:"수금유무", field:"price_status", width:150, headerFilter:"input"},
 

    {title:"주문총액", field:"totalSupplyPrice", width:150, editor : "input",formatter: "money",  
    
    formatterParams: {    
        thousand:",",
        symbol:"원",
        symbolAfter:"p",
        precision:false,
    },
    bottomCalc:"sum", bottomCalcFormatter: "money", // 합계 포매터 지정
    bottomCalcFormatterParams: {
        thousand: ",",
        symbol: "원",
        symbolAfter: "p",
        precision: false,
      },


},

    {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
        formatter: function(cell : any, formatterParams: any, onRendered: any) {
            // Luxon을 사용하여 datetime 값을 date로 변환
            const datetimeValue = cell.getValue();
            const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
            return date;
        },
    },
],

    user_order_sub_list : [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:true, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect();
            console.log(cell.getRow());
        }},
        {title:"ID", field:"uid", width:150, headerFilter:"input"},
        {title:"분류", field:"type", width:150, headerFilter:"input"},
      
        {title:"상품명", field:"name", width:150, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
         },
    
      
        },
        {title:"수량", field:"qty", width:150, editor : "input",formatter: "money",  formatterParams: {
          
            thousand:",",
            precision:false,

        },cellEdited: updateSupplyPrice},
        {title:"단가", field:"price", width:150, editor : "input",formatter: "money",  formatterParams: {
            
              thousand:",",
              symbol:"원",
            symbolAfter:"p",
            precision:false,
        },cellEdited: updateSupplyPrice},
        {title:"매입단가", field:"buy_price", width:150, editor : "input",formatter: "money",  formatterParams: {
            
            thousand:",",
            symbol:"원",
          symbolAfter:"p",
          precision:false,
      }},


        {title:"공급가액", field:"supply_price", width:150, editor : "input",formatter: "money",  formatterParams: {
           
            thousand:",",
            symbol:"원",
            symbolAfter:"p",
            precision:false,
        }},
        

    
       ],

       user_order_sub: [
        {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:true, 
        cellClick:function(e : any, cell:any){
            cell.getRow().toggleSelect();
            console.log(cell.getRow());
        }},
       
        {title:"분류", field:"product.type", width:150, headerFilter:"input"},
      
        {title:"상품명", field:"product.name", width:150, headerFilter:"input", 
        formatter:function(cell : any){
            var value = cell.getValue();
        return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
         },
    
        },
        {title:"매입처", field:"product.company.name", width:150, headerFilter:"input"},
        {title:"지정차량", field:"userOrder.car.name", width:150, headerFilter:"input"},
        {title:"수량", field:"qty", width:150, editor : "input",formatter: "money",  formatterParams: {
          
            thousand:",",
            precision:false,

        }},
        {title:"단가", field:"price", width:150, editor : "input",formatter: "money",  formatterParams: {
            
              thousand:",",
              symbol:"원",
            symbolAfter:"p",
            precision:false,
        }},
        {title:"매입단가", field:"buy_price", width:150, editor : "input",formatter: "money",  formatterParams: {
            
            thousand:",",
            symbol:"원",
          symbolAfter:"p",
          precision:false,
      }},


        {title:"공급가액", field:"supply_price", width:150, editor : "input",formatter: "money",  formatterParams: {
           
            thousand:",",
            symbol:"원",
            symbolAfter:"p",
            precision:false,
        }},
        

    
       ],


}


let TABLE_COMPONENT : any = "example-table-theme";


const TABLE_TOTAL_CONFIG : any = {
    layout: "fitDataTable",
    pagination:"local",
  
    paginationSize:10,
    paginationSizeSelector:[10, 50, 100,5000],

    movableColumns:true,
    paginationCounter:"rows",
    paginationAddRow:"table", //add rows relative to the table
    height : "50vh",
    locale: "ko-kr",
    langs:{
        "ko-kr":{
            "columns":{
                // "name":"Name",
                 //replace the title of column name with the value "Name"
            
            },
            "data":{
                "loading":"Loading", //data loader text
                "error":"Error", //data error text
            },
            "groups":{ //copy for the auto generated item count in group header
                "item":"item", //the singular  for item
                "items":"items", //the plural for items
            },
            "pagination":{
            	"page_size":"행 개수", //label for the page size select element
                "page_title":"Show Page",//tooltip text for the numeric page button, appears in front of the page number (eg. "Show Page" will result in a tool tip of "Show Page 1" on the page 1 button)
                "first":"처음", //text for the first page button
                "first_title":"첫 페이지", //tooltip text for the first page button
                "last":"뒤 페이지",
                "last_title":"뒤 페이지",
                "prev":"이전",
                "prev_title":"이전 페이지",
                "next":"다음",
                "next_title":"다음 페이지",
                "all":"전체",
                "counter":{
                    "showing": "보여지기",
                    "of": "중",
                    "rows": "행",
                    "pages": "pages",
                }
            },
            
        }
    },
    rowFormatter:function(row : any){
        row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
     
  },

   
  
  
    
}






export {
    LOGIN_ALERT,
    DATA_SELECT_ALERT,
    DATA_SUCCESS_ALERT,
    DATA_FAIL_ALERT,
    MENU,
    TOAST_SAMPLE,
    TABLE_TOTAL_CONFIG,
    TABLE_HEADER_CONFIG,
    TABLE_COMPONENT,
    TABLE_FILTER,
    EXCEL_CONFIG
}


