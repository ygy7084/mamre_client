import moment from 'moment-timezone';

const days = ['일', '월', '화', '수', '목', '금', '토'];

class datetime {

    constructor(date) {
        this.date =  new Date(moment.tz(new Date(date),"Asia/Seoul").format());
    }
    get datetimeString() {
        let minutes = String(this.date.getMinutes());

        if(minutes.length===1)
            minutes = '0'+minutes;

        return this.date.getFullYear()+'-'+(this.date.getMonth()+1)+'-'+this.date.getDate()+'-'+days[this.date.getDay()]+'-'+this.date.getHours()+':'+minutes
    }
}

export default datetime;