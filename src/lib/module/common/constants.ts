//@ts-nocheck
import { DateTime } from 'luxon';


import {product_modal_state} from '$lib/store/product/state';

import {table_state} from '$lib/store/common/state';



import {productModalOpen} from '$lib/store/product/function';

import { carModalOpen } from '$lib/store/car/function';

import { companyModalOpen } from '$lib/store/company/function';
import { phoneNumber,businessNumber,updateSupplyPrice ,commaNumber} from './function';

import { userModalOpen} from '$lib/store/user/function';

import { userOrderModalOpen} from '$lib/store/user_order/function';
import moment from 'moment';

import axios from 'axios'

const api = import.meta.env.VITE_API_BASE_URL;


const printContent = (data : any) => {

    console.log('data : ', data);

   let regdate = moment(data.created).format('YYYY 년 MM월 DD일'); 
   
    const url = `${api}/user_order_sub/info_select`;
    const params = { user_order_uid : data.uid};
    const config = {
        params : params,
        headers:{
          "Content-Type": "application/json",
          
        }
      }


    axios.get(url,config).then(res=>{

   let user_order_checked_data =  res.data;

   let skyblue = "#1E90FF";


   const productDetails = user_order_checked_data.length > 0 && user_order_checked_data.map((item,index) => `
   
   <tr>
    
     <td style="text-align : center; "class="info-bottom-border info-left-border info-right-border">${index+1}</td>
     <td style="text-align : left; "class="info-bottom-border">${item.product.name}</td>
     <td style="text-align : right; "class="info-bottom-border info-left-border ">${commaNumber(item.qty)}</td>
     <td style="text-align : right; "class="info-bottom-border info-left-border">${commaNumber(item.price)}</td>
     <td style="text-align : right; "class="info-bottom-border info-left-border info-right-border">${commaNumber(item.supply_price)}</td>
   </tr>
 `).join('');


 const tempDetails = Array.from({ length: 10 - user_order_checked_data.length}, (_, index) => `
 <tr>
   <td style="text-align: center;" class="info-bottom-border info-left-border info-right-border">${user_order_checked_data.length+index+1}</td>
   <td style="text-align: left;" class="info-bottom-border"></td>
   <td style="text-align: right;" class="info-bottom-border info-left-border"></td>
   <td style="text-align: right;" class="info-bottom-border info-left-border"></td>
   <td style="text-align: right;" class="info-bottom-border info-left-border info-right-border"></td>
 </tr>
`).join('');


   const content = `
     <html>
       <head>
         <style>
         @media print {
            @page {
              size: A4;
             
              margin: 0.5cm;
            }
            body {
              font-family: 'Nanum Gothic', sans-serif;
              margin: 0;
              padding: 0px 30px 0px 5px;
            box-sizing: border-box;

              background-color: #fff;
              display: flex;
              flex-direction: column;
            }
            .container {
              width: 100%;
              height: 47%;
               
            }
            .red-border {
              border: 3px solid red;
              border-radius: 10px;
              padding: 10px; /* 예시로 padding을 추가하여 테두리가 둥글게 나타날 수 있도록 함 */
              padding-top : 10px;

            }
            .skyblue-border {
              border: 3px solid ${skyblue};
              border-radius: 10px;
              padding-top : 10px;
              padding: 10px; /* 예시로 padding을 추가하여 테두리가 둥글게 나타날 수 있도록 함 */
            }
            .header {
              text-align: center;
              padding: 10px 0;
              
            }
            .header_sub {
                text-align: center;
                display : flex;
                flex-direction : row;
                padding: 10px 0;
                
              }
            .top_title {
                text-align: center;
                font-size : 24px;
                font-weight : bold;
                text-decoration: underline;
                color : red;
              }
              .top_title_sub {
                width : "30%",
                text-align: center;
                font-size : 16px;
                color : red;
              
              }
          


              .bottom_title {
                text-align: center;
                font-size : 24px;
                font-weight : bold;
                text-decoration: underline;
                color : ${skyblue};
              }
              .bottom_title_sub {
                width : "30%",
                text-align: center;
                font-size : 16px;
                color : ${skyblue};
              
              }


            .content {
              padding: 20px 0;
            }
            .bottom_footer {
              text-align: left;
              padding: 10px 0 10px 0;
              
            }

            .table-container {
                //border-collapse: collapse;
              }
          
              .table-container table, .table-container th, .table-container td {
                border: none;
              }
          
              .table-container th, .table-container td {
                padding: 3px; /* 원하는 패딩 값 설정 */
              }

              .table_row {
                padding: 5px; 

                display:flex; flex-direction : row;
              }


              .info-table-container {
                border: 2px solid red; /* 테이블의 전체 border 색상 설정 */
                border-collapse: collapse;
              
              }
           
          
              .info-table-container th, .info-table-container td {
                border: 1px solid red; /* 각 셀의 border 색상 설정 */
                padding: 1px; /* 원하는 패딩 값 설정 */
                font-size:12px;
              }
             
              
                td.info-no-border {
                    border: none; /* 모든 테두리 없애기 */
                }
            
                td.info-top-border {
                    border-top: none; /* 위쪽 테두리 없애기 */
                }
            
                td.info-right-border {
                    border-right: none; /* 오른쪽 테두리 없애기 */
                }
            
                td.info-bottom-border {
                    border-bottom: none; /* 아래쪽 테두리 없애기 */
                }
            
                td.info-left-border {
                    border-left: none; /* 왼쪽 테두리 없애기 */
                }


                .info-sub-table-container {
                    margin-top : 10px;
                    border: 2px solid red; /* 테이블의 전체 border 색상 설정 */
                    border-collapse: collapse;
                    width: 100%;
                  }
               
              
                  .info-sub-table-container th, .info-sub-table-container td {
                    border: 1px solid red; /* 각 셀의 border 색상 설정 */
                    padding: 1px; /* 원하는 패딩 값 설정 */
                    font-size:12px;
                  }
                  td.info-no-border {
                    border: none; /* 모든 테두리 없애기 */
                }
            
                td.info-top-border {
                    border-top: none; /* 위쪽 테두리 없애기 */
                }
            
                td.info-right-border {
                    border-right: none; /* 오른쪽 테두리 없애기 */
                }
            
                td.info-bottom-border {
                    border-bottom: none; /* 아래쪽 테두리 없애기 */
                }
            
                td.info-left-border {
                    border-left: none; /* 왼쪽 테두리 없애기 */
                }








                .info-bottom-table-container {
                    border: 2px solid ${skyblue}; /* 테이블의 전체 border 색상 설정 */
                    border-collapse: collapse;
                  
                  }
               
              
                  .info-bottom-table-container th, .info-bottom-table-container td {
                    border: 1px solid ${skyblue}; /* 각 셀의 border 색상 설정 */
                    padding: 1px; /* 원하는 패딩 값 설정 */
                    font-size:12px;
                  }
                 
                  
                    td.info-no-border {
                        border: none; /* 모든 테두리 없애기 */
                    }
                
                    td.info-top-border {
                        border-top: none; /* 위쪽 테두리 없애기 */
                    }
                
                    td.info-right-border {
                        border-right: none; /* 오른쪽 테두리 없애기 */
                    }
                
                    td.info-bottom-border {
                        border-bottom: none; /* 아래쪽 테두리 없애기 */
                    }
                
                    td.info-left-border {
                        border-left: none; /* 왼쪽 테두리 없애기 */
                    }
    
    
                    .info-bottom-sub-table-container {
                        margin-top : 10px;
                        border: 2px solid ${skyblue}; /* 테이블의 전체 border 색상 설정 */
                        border-collapse: collapse;
                        width: 100%;
                      }
                   
                  
                      .info-bottom-sub-table-container th, .info-bottom-sub-table-container td {
                        border: 1px solid ${skyblue}; /* 각 셀의 border 색상 설정 */
                        padding: 1px; /* 원하는 패딩 값 설정 */
                        font-size:12px;
                      }
                      td.info-no-border {
                        border: none; /* 모든 테두리 없애기 */
                    }
                
                    td.info-top-border {
                        border-top: none; /* 위쪽 테두리 없애기 */
                    }
                
                    td.info-right-border {
                        border-right: none; /* 오른쪽 테두리 없애기 */
                    }
                
                    td.info-bottom-border {
                        border-bottom: none; /* 아래쪽 테두리 없애기 */
                    }
                
                    td.info-left-border {
                        border-left: none; /* 왼쪽 테두리 없애기 */
                    }
                 
            

          }
         </style>
       </head>
       <body>
       <div class="container red-border">
       <div class="header">
         <span class="top_title">거&nbsp;&nbsp;래&nbsp;&nbsp;명&nbsp;&nbsp;세&nbsp;&nbsp;서</span>
        </div>
       
        
                <div class="table-container">
                    <table class="table-with-border">
                    <thead>
                        <tr>
                            <th  style="width : 50px; text-align : left; color : red;">NO.</th>
                            <th  style="width : 250px; text-align : left;">${data.uid}</th>
                        
                            <th style="width : 130px; text-align : left; color : red;">(공급자 보관용)</th>
                            <th style="width : 100px; text-align : left; color : red;">TEL :</th>
                            <th style="width : 50px; text-align : left; color : red;">FAX : </th>
                            
                            <th style="width : 120px; text-align : left; color : black;">${CLIENT_INFO.fax}</th>
                            
                        </tr>    
                    </thead>
                    </table>
                </div>

                <div style="display:flex; flex-direction : row; width : 100%;" >
                    <div style="display:flex; flex-direction : column; width : 40%;" class="table-container">
                        <div class="table_row">
                            
                            <div style="text-align : left; color : red;font-weight: bold; ">일자</div>
                            <div style="text-align : left;  ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${regdate}</div>
                        </div>
                        <div class="table_row">
                            
                            <div style="text-align : left; text-decoration : underline; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${data.user.customer_name}</div>
                            <div style="text-align : left; text-decoration: underline; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;귀하</div>

                        </div>
                    <div class="table_row">
                            
                        <div style="text-align : left; text-decoration : underline; color : red; font-weight: bold; font-size : 16px;">아래와 같이 거래합니다.</div>
                    
                    </div>

                    <div class="table_row">
                            
                        <div style="text-align : left; color : red; font-weight: bold; font-size : 20px;">합계금</div>
                        <div style="text-align : left;  font-weight: bold; font-size : 24px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${commaNumber(data.totalSupplyPrice)}</div>
                    </div>
                          
                    </div>
                    <div style="display:flex; flex-direction : row; justify-content: flex-end; width : 60%;" class="table-container">
                    <div class="info-table-container">
                       
                    <table>
                    <tbody>
                <tr >
                    <td  class="info-no-border" style="writing-mode: vertical-lr; letter-spacing: 30px;" rowspan="4">공급자</td>
                    <td  class="info-top-border">등록번호</td>
                    <td  class="info-top-border info-right-border info-left-border" colspan="3">${CLIENT_INFO.code}</td>
                  </tr>
                  <tr>
                    <td  class="info-bottom-border info-top-border">상호</td>
                    <td class="info-bottom-border info-top-border info-left-border">${CLIENT_INFO.company_name}</td>
                    <td class="info-bottom-border info-right-border info-top-border info-left-border">성명</td>
                    <td class="info-bottom-border info-top-border info-right-border">${CLIENT_INFO.name}</td>
                  </tr>
                  <tr>
                    <td class="">사업장주소</td>
                    <td class="info-left-border info-right-border" colspan="3">${CLIENT_INFO.address}</td>
                  </tr>
                  <tr>
                    <td class="info-top-border info-bottom-border ">업태</td>
                    <td class="info-top-border info-bottom-border info-left-border">${CLIENT_INFO.type}</td>
                    <td class="info-top-border info-bottom-border info-left-border info-right-border">종목</td>
                    <td class="info-top-border info-bottom-border info-right-border">${CLIENT_INFO.type2}</td>
                  </tr>
                    </tbody>
                  </table>
                       
                    </div>
                </div>
              
                
                </div>








                <div style="display:flex; flex-direction : row; width : 100%;" class="table-container">
                <div class="info-sub-table-container">
                   
                <table>
                <tbody>
                <tr >
                <td style="width : 40px; text-align:center; font-weight : 600" class="info-no-border">순 서</td>
                <td style="width : 480px; text-align:center; font-weight : 600" class="info-bottom-border info-top-border">품 명</td>
                <td style="width : 100px; text-align:center; font-weight : 600" class="info-left-border info-bottom-border info-top-border">수 량</td>
                <td style="width : 100px; text-align:center; font-weight : 600" class="info-left-border info-bottom-border info-top-border">단 가</td>
                <td style="width : 200px; text-align:center; font-weight : 600" class="info-left-border info-bottom-border info-top-border info-right-border">공 급 가 액</td>
                
                </tr>

                ${productDetails}
                ${tempDetails}
                   
                </tbody>
               
              </table>
                
              
    
                </div>
            </div>

            <div class="bottom_footer">
            <span style="text-align : left;">전미수금 : ${data.totalUnpaidPrice-data.totalSupplyPrice > 0? commaNumber(data.totalUnpaidPrice-data.totalSupplyPrice) : 0}</span>
    
            <span style="text-align : left;">&nbsp;&nbsp;&nbsp;합계 : ${commaNumber(data.totalUnpaidPrice-data.totalSupplyPrice+data.totalSupplyPrice)}</span>


            <span style="text-align : left; font-weight : bold; padding-left : 50px;">입금 :        </span>
            <span style="text-align : left; font-weight : bold; padding-left : 150px;">잔액 :        </span>
            
         
            <br/>
           
             
            ${data.description}
            </div>



              
            
     </div>

     
     
     <div style="margin-top : 2px;" class="container skyblue-border">
       <div class="header">
         <span class="bottom_title">거&nbsp;&nbsp;래&nbsp;&nbsp;명&nbsp;&nbsp;세&nbsp;&nbsp;서</span>
        </div>
       
        
                <div class="table-container">
                    <table class="table-with-border">
                    <thead>
                        <tr>
                       

                            <th  style="width : 50px; text-align : left; color : ${skyblue};">NO.</th>
                            <th  style="width : 200px; text-align : left;">${data.uid}</th>


                            <th style="width : 150px; text-align : left; color : ${skyblue};">(공급받는자 보관용)</th>
                            <th style="width : 100px; text-align : left; color : ${skyblue};">TEL :</th>
                            <th style="width : 50px; text-align : left; color : ${skyblue};">FAX : </th>
                            
                            <th style="width : 120px; text-align : left; color : black;">${CLIENT_INFO.fax}</th>
                            
                        </tr>    
                    </thead>
                    </table>
                </div>

                <div style="display:flex; flex-direction : row; width : 100%;" >
                    <div style="display:flex; flex-direction : column; width : 40%;" class="table-container">
                        <div class="table_row">
                            
                            <div style="text-align : left; color : ${skyblue}; font-weight: bold;">일자</div>
                            <div style="text-align : left;  ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${regdate}</div>
                        </div>
                        <div class="table_row">
                            
                            <div style="text-align : left; text-decoration : underline; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${data.user.customer_name}</div>
                            <div style="text-align : left; text-decoration: underline; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;귀하</div>

                        </div>
                    <div class="table_row">
                            
                        <div style="text-align : left; text-decoration : underline; color : ${skyblue}; font-weight: bold; font-size : 16px;">아래와 같이 거래합니다.</div>
                    
                    </div>

                    <div class="table_row">
                            
                        <div style="text-align : left; color : ${skyblue}; font-weight: bold; font-size : 20px;">합계금</div>
                        <div style="text-align : left;  font-weight: bold; font-size : 24px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${commaNumber(data.totalSupplyPrice)}</div>
                    </div>
                          
                    </div>
                    <div style="display:flex; flex-direction : row; justify-content: flex-end; width : 60%;" class="table-container">
                    <div class="info-bottom-table-container">
                       
                    <table>
                    <tbody>
                <tr >
                    <td  class="info-no-border" style="writing-mode: vertical-lr; letter-spacing: 30px;" rowspan="4">공급자</td>
                    <td  class="info-top-border">등록번호</td>
                    <td  class="info-top-border info-right-border info-left-border" colspan="3">${CLIENT_INFO.code}</td>
                  </tr>
                  <tr>
                    <td  class="info-bottom-border info-top-border">상호</td>
                    <td class="info-bottom-border info-top-border info-left-border">${CLIENT_INFO.company_name}</td>
                    <td class="info-bottom-border info-right-border info-top-border info-left-border">성명</td>
                    <td class="info-bottom-border info-top-border info-right-border">${CLIENT_INFO.name}</td>
                  </tr>
                  <tr>
                    <td class="">사업장주소</td>
                    <td class="info-left-border info-right-border" colspan="3">${CLIENT_INFO.address}</td>
                  </tr>
                  <tr>
                    <td class="info-top-border info-bottom-border ">업태</td>
                    <td class="info-top-border info-bottom-border info-left-border">${CLIENT_INFO.type}</td>
                    <td class="info-top-border info-bottom-border info-left-border info-right-border">종목</td>
                    <td class="info-top-border info-bottom-border info-right-border">${CLIENT_INFO.type2}</td>
                  </tr>
                    </tbody>
                  </table>
                       
                    </div>
                </div>
              
                
                </div>








                <div style="display:flex; flex-direction : row; width : 100%;" class="table-container">
                <div class="info-bottom-sub-table-container">
                   
                <table>
                <tbody>
                <tr >
                <td style="width : 40px; text-align:center; font-weight : 600" class="info-no-border">순 서</td>
                <td style="width : 480px; text-align:center; font-weight : 600" class="info-bottom-border info-top-border">품 명</td>
                <td style="width : 100px; text-align:center; font-weight : 600" class="info-left-border info-bottom-border info-top-border">수 량</td>
                <td style="width : 100px; text-align:center; font-weight : 600" class="info-left-border info-bottom-border info-top-border">단 가</td>
                <td style="width : 200px; text-align:center; font-weight : 600" class="info-left-border info-bottom-border info-top-border info-right-border">공 급 가 액</td>
                
                </tr>

                ${productDetails}
                ${tempDetails}
                   
                </tbody>
               
              </table>
                
              
    
                </div>
            </div>

            <div class="bottom_footer">
            <span style="text-align : left;">공급가합 : ${commaNumber(data.totalSupplyPrice)}</span>
    
            
         
            <br/>
           
             
            ${data.description}
            </div>



              
            
     </div>
     </body>
     </html>
   `;
   // 현재 창의 내용을 복제
   const originalContent = document.body.innerHTML;

   // 프린트 다이얼로그가 열리기 전에 현재 창의 내용을 변경하지 않도록
   const printWindow : any = window.open('', '_blank');
           


   printWindow.document.write(content);
   printWindow.document.close();


   // 프린트 다이얼로그가 열릴 때 현재 창의 내용을 복원
   printWindow.onload = () => {
     document.body.innerHTML = originalContent;

      
     // 프린트 다이얼로그 호출
     printWindow.print();
   };

   // 프린트 다이얼로그가 닫힐 때 현재 창의 내용을 원복
   printWindow.onafterprint = () => {
      
     printWindow.close();
   };



   // 프린트 다이얼로그가 열릴 때 현재 창의 내용을 복원
  

   // 프린트 다이얼로그 호출
   printWindow.print();

       
    });


   
  };







let table_data : any;
table_state.subscribe((data : any) => {
    table_data = data;
  })
  

const LOGIN_ALERT = {
    type : 'success',
    title : '로그인',
    content : '로그인에 실패했습니다. 계정 및 비밀번호를 확인해주십시오,',
    
}


const CLIENT_INFO = {  // 업체정보
   
    code  : "314-13-24575",
    company_name : "장안유통(대청254번)",
    name : "김옥병",
    address : "대전시 대덕구 오정동 705 대청254번",
    type : "도,소매",
    type2 : "음식재료",
    fax : "042-369-6892",

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

        {title:"인쇄", field:"print", width:150,  
        formatter:function(cell : any){
           
        return "<span style='color:#1E90FF; font-weight:bold;'>인쇄</span>";
        },
        cellClick:function(e : any, cell:any){
            let row = cell.getRow();
        if(row){
            printContent(row.getData());
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


