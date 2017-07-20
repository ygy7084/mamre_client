/*
서버에서 한국 시간 문자열을 출력한다.
서버 내 엑셀 출력을 위함.
 */

import moment from 'moment-timezone';

const days = ['일', '월', '화', '수', '목', '금', '토'];

class datetime {
    constructor(date) {
        this.dateObj = {};
        this.dateFormat = moment.tz(new Date(date), "Asia/Seoul").format();
        const regex = /[0-9]+(?=[-T])|[0-9]+(?=:)/gmi;
        const str = this.dateFormat;
        let m;
        let index = 0;
        while ((m = regex.exec(str)) !== null && index < 5) {
            switch (index) {
                case 0 :
                    this.dateObj.year = parseInt(m[0]);
                    break;
                case 1 :
                    this.dateObj.month = parseInt(m[0]);
                    break;
                case 2 :
                    this.dateObj.date = parseInt(m[0]);
                    break;
                case 3 :
                    this.dateObj.hour = m[0];
                    break;
                case 4 :
                    this.dateObj.minute = m[0];
                    break;
            }
            index++;
        }
    }

    get year() {
        return this.dateObj.year
    }

    get month() {
        return this.dateObj.month
    }

    get date() {
        return this.dateObj.date
    }

    get day() {
        return new Date(this.year, this.month - 1, this.date).getDay()
    }

    get hour() {
        return this.dateObj.hour
    }

    get minute() {
        return this.dateObj.minute
    }

    get datetimeString() {
        return this.year + '-' + this.month + '-' + this.date + '-' + days[this.day] + '-' + this.hour + ':' + this.minute
    }
}
export default datetime;