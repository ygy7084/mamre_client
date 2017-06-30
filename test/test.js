const mongoose = require('mongoose');
require('mongoose-function')(mongoose);

const db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/rp');
mongoose.Promise = global.Promise;

db.on('error', console.error);
db.once('open', () => {console.log('Hi mongodb')});

const Schema = mongoose.Schema;
const Excel = new Schema({
    source : String,
    parsing_rule : {
        customer_name : {
            field : String,
            code : Function
        },
        customer_phone : {
            field : String,
            code : Function
        },
        show_date_year : {
            field : String,
            code : Function
        },
        show_date_month : {
            field : String,
            code : Function
        },
        show_date_day : {
            field : String,
            code : Function
        },
        show_time_hour : {
            field : String,
            code : Function
        },
        show_time_minute : {
            field : String,
            code : Function
        },
        seat_class : {
            field : String,
            code : Function
        },
        seat_position_floor : {
            field : String,
            code : Function
        },
        seat_position_row : {
            field : String,
            code : Function
        },
        seat_position_column : {
            field : String,
            code : Function
        },
        ticket_quantity : {
            field : String,
            code : Function
        },
        ticket_code : {
            field : String,
            code : Function
        },
        ticket_price : {
            field : String,
            code : Function
        }
    }
});
const model = mongoose.model('excel', Excel);


const parsing_label = {
    customer_name : '',
    customer_phone : '',
    show_date : '',
    seat_class : '',
    seat_position : {
        floor : '',
        row : '',
        column : ''
    },
    ticket_number : '',
    ticket_code : '',
    ticket_price : ''
};
const testDB = [
    {
        source : '쿠팡',
        parsing_rule : {
            customer_name : {
                field : '쿠폰구매자',
                code : null
            },
            customer_phone : {
                field : '쿠폰구매자 전화번호',
                code : null
            },
            show_date_year : null,
            show_date_month : {
                field : '옵션사항',
                code : "function(cell_value) {\n" +
                "let regex;\n" +
                "let return_value;\n" +
                "regex = new RegExp('[0-9][0-9](?=월)');//Regex\n" +
                "return_value = regex.exec(cell_value)[0];//regex return array\n" +
                "return_value = parseInt(return_value);//parseToInteger\n" +
                "return return_value;\n" +
                "};"
            },
            show_date_day : {
                field : '옵션사항',
                code : "function(cell_value) {\n" +
                "let regex;\n" +
                "let return_value;\n" +
                "regex = new RegExp('[0-9][0-9](?=일)');//Regex\n" +
                "return_value = regex.exec(cell_value)[0];//regex return array\n" +
                "return_value = parseInt(return_value);//parseToInteger\n" +
                "return return_value;\n" +
                "};"
            },
            show_time_hour : {
                field : '옵션사항',
                code : "function(cell_value) {\n" +
                "let regex;\n" +
                "let return_value;\n" +
                "regex = new RegExp('[0-9][0-9](?=:)');//Regex\n" +
                "return_value = regex.exec(cell_value)[0];//regex return array\n" +
                "return_value = parseInt(return_value);//parseToInteger\n" +
                "return return_value;\n" +
                "};"
            },
            show_time_minute : {
                field : '옵션사항',
                code : "function(cell_value) {\n" +
                "let regex;\n" +
                "let return_value;\n" +
                "regex = new RegExp('[0-9][0-9](?=[a-zA-Z])');//Regex\n" +
                "return_value = regex.exec(cell_value)[0];//regex return array\n" +
                "return_value = parseInt(return_value);//parseToInteger\n" +
                "return return_value;\n" +
                "};"
            },
            seat_class : {
                field : '옵션사항',
                code : "function(cell_value) {\n" +
                "let regex;\n" +
                "let return_value;\n" +
                "regex = new RegExp('[a-zA-Z]+(?=석)');//Regex\n" +
                "return_value = regex.exec(cell_value)[0];//regex return array\n" +
                "return return_value;\n" +
                "};"
            },
            seat_position_floor : null,
            seat_position_row : null,
            seat_position_column : null,
            ticket_quantity : null,
            ticket_code : {
                field : '쿠폰번호',
                code : null
            },
            ticket_price : {
                field : '판매단가',
                code : null
            }
        }
    }
];
let string = "07월23일 일요일11:02 VIP석";
// string = string.replace(/\s/gi, "");


const test = new Schema({
    myfunc : Function
});

const test2 = mongoose.model('f', test);

// let m = new test2({
//     myfunc : "function(cell_value) {\n" +
//     "cell_value = cell_value.replace(/\s/gi, '');//remove whitespace\n" +
//     "return cell_value;\n" +
//     "};"
// });
// let fun = function(cell_value) {
//     cell_value = cell_value.replace(/\s/gi, '');//remove whitespace\n"
//     let regex;
//     let return_value;
//     regex = new RegExp('[a-zA-Z]+(?=석)');//Regex\n" +
//     return_value = regex.exec(cell_value)[0];//regex return array\n" +
//     return return_value;
//     };
//
// console.log(fun(string));

// m.save();
// m.save((err) => {
//     test2.find({}).exec((err,result)=> {
//         console.log(result[5].myfunc(string));
//     });
// });



let regexs = {};

let result = {};

regexs.month = new RegExp("[0-9][0-9](?=월)");
regexs.day = new RegExp("[0-9][0-9](?=일)");
regexs.hour = new RegExp("[0-9][0-9](?=:)");
regexs.minute = new RegExp("[0-9][0-9](?=[a-zA-Z])");
regexs.seat_class = new RegExp("[a-zA-Z]+(?=석)");

result.year = 2017;
// result.month = parseInt(regexs.month.exec(string)[0])-1; //month는 0-11이 1-12이다.
// result.day = parseInt(regexs.day.exec(string)[0]);
// result.hour = parseInt(regexs.hour.exec(string)[0]);
// result.minute = parseInt(regexs.minute.exec(string)[0]);
// result.seat_class = regexs.seat_class.exec(string)[0];
//
// result.date = new Date(result.year, result.month, result.day, result.hour, result.minute);


let m = new model(testDB[0]);

// for (i in Excel.obj.parsing_rule) {
//     console.log(i);
// }
//
m.save((err, data) => {
    if(err) console.log(err);
    model.find({}).exec((err, data) => {
        if(err) console.log(err);
        console.log(data);
    });
});
