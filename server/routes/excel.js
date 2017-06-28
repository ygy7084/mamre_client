import express from 'express';
import multer from 'multer';
import {Excel} from '../models';
import XLSX from 'xlsx';

const router = express.Router();

// 파일 업로드 모듈. 최대 사이즈 : 30MB
const upload = multer({
    storage : multer.memoryStorage(),
    limits : {fileSize : 1024 * 1024 * 30}
});

router.post('/parse/show', upload.single('file'), (req, res) => {
//차후 show의 schedule 업데이트할 주소
    //<1. 엑셀 파일 로드>
    //엑셀 파일 버퍼 읽기
    const Excel_file_buffer = req.file.buffer;
    const Excel_file = XLSX.read(Excel_file_buffer);

    //엑셀 시트 읽기
    const Excel_sheet = Excel_file.Sheets[Excel_file.SheetNames[0]];
    const Excel_sheet_range = XLSX.utils.decode_range(Excel_sheet['!ref'].toString());

    console.log(Excel_sheet_range)
    const columns_parser = {
        date : 0,
        time : 1,
        url : 2
    };
    let parsed = [];
    for(let r = Excel_sheet_range.s.r;r<=Excel_sheet_range.e.r;r++) {
        let row = {};
        for(let col in columns_parser) {
            let cell_address = XLSX.utils.encode_cell({c: columns_parser[col], r: r});
            console.log(Excel_sheet[cell_address]);
            row[col] = Excel_sheet[cell_address].w;
        }
        parsed.push(row);
    }

    res.json(parsed);
});
router.post('/parse/theater', upload.single('file'), (req, res) => {
    /*
     column은 반드시 다음의 순서를 맞춰야 한다.
     층 수, 열, 번호, 등급
     */
    //엑셀 파일 버퍼 읽기
    const Excel_file_buffer = req.file.buffer;
    const Excel_file = XLSX.read(Excel_file_buffer);

    //엑셀 시트 읽기
    const Excel_sheet = Excel_file.Sheets[Excel_file.SheetNames[0]];
    const Excel_sheet_range = XLSX.utils.decode_range(Excel_sheet['!ref'].toString());

    const columns_parser = {
        floor : 0,
        col : 1,
        num : 2,
        seat_class:3
    };
    let seats = [];
    for(let r = Excel_sheet_range.s.r;r<=Excel_sheet_range.e.r;r++) {
        let seat = {};
        for(let col in columns_parser) {
            let cell_address = XLSX.utils.encode_cell({c: columns_parser[col], r: r});
            seat[col] = Excel_sheet[cell_address].v;
        }
        seats.push(seat);
    }
    res.json(seats);
});

// 엑셀 파일 업로드
/*
 <프로세스>
 1. 엑셀 파일 로드
 2. 파싱 데이터 로드
 3. 파싱
 4. 파싱되지 않은 값에 기본값 대입
 5. 파싱된 데이터를 통해 예매 데이터로 변환
 6. 예매 데이터 출력
 */
router.post('/parse/reservation', upload.single('file'), (req, res) => {

    //<1. 엑셀 파일 로드>
    //엑셀 파일 버퍼 읽기
    const Excel_file_buffer = req.file.buffer;
    const Excel_file = XLSX.read(Excel_file_buffer);

    //엑셀 시트 읽기
    const Excel_sheet = Excel_file.Sheets[Excel_file.SheetNames[0]];
    const Excel_sheet_range = XLSX.utils.decode_range(Excel_sheet['!ref'].toString());

    //<2. 파싱 데이터 로드>
    //source(ex.쿠팡)를 이용하여 엑셀 파싱 데이터 로드
    /* 파싱할 값. 필수->반드시 파싱되어야 할 값
     customer_name,         //필수 - 고객 이름
     customer_phone,        //필수 - 고객 번호 (뒤 4자리)
     show_date_year,        //없을 시 month가 현재 월보다 작으면 올해+1 아니면 올해 - 공연 연도
     show_date_month,       //필수 - 공연 월
     show_date_day,         //필수 - 공연 일
     show_time_hour,        //필수 - 공연 시간
     show_time_minute,      //없을 시 0 - 공연 분
     seat_class,            //필수 - 좌석 등급
     seat_position_floor,   //없을 시 null - 좌석 층수
     seat_position_col,     //없을 시 null - 좌석 열
     seat_position_num,     //없을 시 null - 좌석 번호
     ticket_quantity,       //없을 시 1 - 티켓 수량
     ticket_code,           //필수 - 예약 번호, 주문 번호, 티켓 번호 등 각 사이트별 코드
     ticket_price           //필수 - 티켓 가격
     */
    //타 조회처럼 Excel.find().lean().exec()으로 조회시 검색 시간이 빨라지나,
    //파싱 데이터에 저장된 함수를 Mongoose가 함수로 파싱하지 못한다.
    Excel.find({source:req.body.source}).exec((err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).send('Excel Upload Error', err);
        }

        let excel = result[0];

        //<3. 파싱>
        //필드가 들어있는 row의 위치를 찾아 저장한다.
        //모든 필드는 같은 row에 있어야 한다.
        //엑셀 파싱 데이터의 customer_name에 있는 필드명은 반드시 있어야 한다.
        const key = excel.parsing_rule.customer_name.field;
        let field_row = -1;
        for(let r = Excel_sheet_range.s.r;r<=Excel_sheet_range.e.r;r++) {
            for(let c = Excel_sheet_range.s.c;c<=Excel_sheet_range.e.c;c++) {
                let cell_address = XLSX.utils.encode_cell({c: c,r: r});
                if(Excel_sheet[cell_address] && Excel_sheet[cell_address].v === key){
                    field_row = r;
                }
            }
        }

        //필드가 있는 row를 못찾으면 에러 리턴
        if(field_row === -1){
            return res.status(400).send('Excel Upload Error', ' - cannot find customer_name in excel file');
        }

        //필드 row에서 필드명에 따른 column의 위치를 저장
        for(let c = Excel_sheet_range.s.c;c<=Excel_sheet_range.e.c;c++) {
            let cell_address = XLSX.utils.encode_cell({c: c, r: field_row});
            for(let i in excel.parsing_rule) {
                if(excel.parsing_rule[i] && excel.parsing_rule[i].field === Excel_sheet[cell_address].v) {
                    excel.parsing_rule[i].c = c;
                }
            }
        }

        //파싱 데이터에 필드명이 있는데 칼럼을 못찾았을 경우 에러 리턴
        for(let i in excel.parsing_rule) {
            if(excel.parsing_rule[i] && excel.parsing_rule[i].field) {
                if(!excel.parsing_rule[i].c || excel.parsing_rule[i].c ==='')
                    return res.status(400).send('Excel Upload Error', 'cannot parse',i);
            }
        }

        //파싱한 내용을 저장할 객체 초기화
        let parsed_rows = {};
        for(let row = field_row+1;row<=Excel_sheet_range.e.r;row++) {
            parsed_rows[row] = {};
        }

        //파싱 진행
        for(let i in excel.parsing_rule) {
            if(excel.parsing_rule[i] && excel.parsing_rule[i].field && excel.parsing_rule[i].c){

                for(let row = field_row+1;row<=Excel_sheet_range.e.r;row++) {
                    //셀의 내용 접근
                    let cell_address = XLSX.utils.encode_cell({c: excel.parsing_rule[i].c,r: row});

                    //v는 셀의 내용의 raw 데이터
                    let string = Excel_sheet[cell_address].v;

                    //정규식을 이용한 파싱 직전에 셀의 내용에서 공백과 빈칸을 전부 없앤다.
                    let parsed_string = string.replace(/\s/gi, "");

                    //정규식을 이용한 파싱 (정규식 코드 없으면 셀 내용 변경 안함)
                    if(excel.parsing_rule[i].code) {
                        parsed_string = excel.parsing_rule[i].code(parsed_string);
                    }
                    parsed_rows[row][i] = parsed_string;
                }
            }
        }

        //<4. 파싱되지 않은 값에 기본값 대입>
        //필수적인 파싱 데이터 존재 확인. 필수적이지 않은 데이터는 파싱되지 않았을 시 기본값으로 초기화
        let parsed_rows_array = [];
        for(let i in parsed_rows) {
            let o = parsed_rows[i];
            //필수 데이터 확인
            if(!( o['customer_name'] &&
                o['customer_phone'] &&
                o['show_date_month'] &&
                o['show_date_day'] &&
                o['show_time_hour'] &&
                o['seat_class'] &&
                o['ticket_code'] &&
                o['ticket_price']))
                return res.status(400).send('Excel Upload Error', '필수적인 파싱 내용 빠짐');

            //공연 연도 미입력 시 현재 연도 입력.
            //단, 현재 월보다 공연 월이 적은 값일 경우 내년이라고 인식하고 현재 연도+1을 입력
            if(!(o['show_date_year'])) {
                let month = o['show_date_month'];
                let current_month = new Date().getMonth()+1;
                let year = new Date().getFullYear();
                if(month<current_month)
                    year++;
                o['show_date_year'] = year;
            }
            //분 초기화 -> 0
            if(!(o['show_time_minute'])) {
                o['show_time_minute'] = 0;
            }
            //층수 초기화
            if(!(o['seat_position_floor'])) {
                o['seat_position_floor'] = null;
            }
            // 열 초기화
            if(!(o['seat_position_col'])) {
                o['seat_position_col'] = null;
            }
            // 번호 초기화
            if(!(o['seat_position_num'])) {
                o['seat_position_num'] = null;
            }
            // 티켓 수량 초기화
            if(!(o['ticket_quantity'])) {
                o['ticket_quantity'] = 1;
            }
            parsed_rows_array.push(o);
        }


        //<5. 파싱된 데이터를 통해 예매 데이터로 변환>
        /*파싱된 데이터를 통해 표준 예매 데이터로 변환
         source,              //공연 예매 출처
         customer_name,       //고객 성함
         customer_phone,      //고객 번호(뒷 4자리)
         show_date : '',      //공연 날짜 및 시간 (DATE 객체)
         seat_class : '',     //좌석 등급
         seat_position : {    //좌석 위치 -> 없을 시 null
         floor,
         col,
         num
         },
         ticket_quantity,     //티켓 수량
         ticket_code,         //예약 번호, 주문 번호, 티켓 번호 등 각 사이트별 코드
         ticket_price,        //티켓 가격
         theater,             //공연장 참조
         show                 //공연 참조
         */
        let results = [];
        for(let i=0;i<parsed_rows_array.length;i++) {
            let row = parsed_rows_array[i];
            let result = {};
            result.source = req.body.source;
            result.customer_name = row.customer_name;
            result.customer_phone = row.customer_phone;
            result.show_date = new Date(
                row.show_date_year,
                row.show_date_month-1,
                row.show_date_day,
                row.show_time_hour,
                row.show_time_minute
            );
            result.seat_class = row.seat_class;
            if(!row.floor && !row.col && !row.num)
                result.seat_position = null;
            else
                result.seat_position = {
                    floor : row.floor,
                    col : row.col,
                    num : row.num
                };
            result.ticket_quantity = row.ticket_quantity;
            result.ticket_code = row.ticket_code;
            result.ticket_price = row.ticket_price;
            result.theater = req.body.theater;
            result.show = req.body.show;
            results.push(result);
        }

        //<6. 예매 데이터 출력>
        return res.json(
            results
        );
    });
});

//엑셀 파싱 룰을 생성한다.
router.post('/create', (req, res) => {
    const excel = new Excel(req.body);
    excel.save((err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Excel Create Error', err);
        }
        else {
            return res.json({
                success : true
            });
        }
    });
});

//엑셀 파싱 룰을 조회한다.
router.get('/read/:source', (req, res) => {

    //source 파라미터가 all일 경우 모든 데이터 조회
    let query;
    if(req.params.source==='all')
        query = {};
    else
        query = {source:req.params.source};


    //lean() -> 조회 속도 빠르게 하기 위함
    Excel.find(query).lean().exec((err, excel) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Excel Read Error', err);
        }
        else {
            return res.json({
                success : true,
                excel
            });
        }
    });
});

//엑셀 파싱 룰을 수정한다.
router.put('/update', (req, res) => {
    Excel.update({_id:req.body._id}, {$set: req.body}, (err) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Excel Modify Error', err);
        }
        else {
            return res.json({
                success : true
            });
        }
    });
});

//엑셀 파싱 룰을 삭제한다.
router.delete('/delete', (req, res) => {
    Excel.remove({_id:req.body._id}, (err) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Excel Delete Error', err);
        }
        else {
            return res.json({
                success : true
            });
        }
    });
});

export default router;