const businessNumber = (number: string): string => {
   
    console.log('number : ',number);
    // 입력된 문자열에서 숫자만 추출
    const numericString = number.replace(/\D/g, '');

    // 숫자를 사업자등록번호 형식으로 변환
    if (numericString.length >= 10) {
        console.log(`${numericString.slice(0, 3)}-${numericString.slice(3, 5)}-${numericString.slice(5)}`);
    
        return `${numericString.slice(0, 3)}-${numericString.slice(3, 5)}-${numericString.slice(5)}`;
    }
    
    // 숫자가 10자리 미만이면 그대로 반환
    return numericString;

}
const phoneNumber = (number: string): string => {
    // 입력된 문자열에서 숫자만 추출
    const numericString = number.replace(/\D/g, '');

    // 패턴에 따라 전화번호를 형식화
    if (numericString.length === 10) {
        // 010-5531-5732와 같은 10자리 번호
        const areaCode = numericString.slice(0, 3);
        const middlePart = numericString.slice(3, 7);
        const lastPart = numericString.slice(7);
        return `${areaCode}-${middlePart.slice(0, 4)}-${middlePart.slice(4)}${lastPart}`;
    } else if (numericString.length === 11) {
        // 070-444-1111와 같은 11자리 번호
        const areaCode = numericString.slice(0, 3);
        const middlePart = numericString.slice(3, 7);
        const lastPart = numericString.slice(7);
        return `${areaCode}-${middlePart}-${lastPart}`;
    } else {
        // 그 외의 경우, 숫자만 그대로 반환
        return numericString;
    }
}

function validEmail(email: string): boolean {
    // 이메일 주소를 검사하는 정규 표현식 패턴
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // 정규 표현식 패턴과 매치되는지 확인
    return emailPattern.test(email);
}


// tabulator에서만 사용가능한 함수임
function updateSupplyPrice(cell:any) {
    // "qty" 셀과 "price" 셀의 값을 가져옴
    var qty = cell.getData().qty || 0;
    var price = cell.getData().price || 0;

    // "supply_price" 셀을 계산하여 업데이트
    var supplyPrice = qty * price;
    cell.getRow().update({ supply_price: supplyPrice });
}

const commaNumber = (number:any) => {
    if (number)
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    else if (number === 0)
        return 0;
    else
        return ''
};






export {
    
    businessNumber,
    phoneNumber,
    validEmail,
    updateSupplyPrice,commaNumber
}