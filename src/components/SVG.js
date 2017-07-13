import React from 'react';

class SVG extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            index : 0
        }
    }
    render() {
        let propss = [
            {
            show_date:new Date(2017,6,22,4,30),
            seat_class:'VIP',
            seat_price:20000,
            seats_picked :[
            {
                col:'가',
                num:24
            },
            {
                col:'가',
                num:21
            },
            {
                col:'가',
                num:14
            }]},
            {
                show_date:new Date(2017,3,22,4,30),
                seat_class:'R',
                seat_price:30000,
                seats_picked :[
                    {
                        col:'가',
                        num:24
                    },
                ]},
            {
                show_date:new Date(2017,6,22,6,0),
                seat_class:'VIP',
                seat_price:20000,
                seats_picked :[
                    {
                        col:'가',
                        num:24
                    },
                    {
                        col:'가',
                        num:21
                    },
                    {
                        col:'가',
                        num:12
                    },
                    {
                        col:'가',
                        num:23
                    },
                    {
                        col:'가',
                        num:29
                    },
                    {
                        col:'가',
                        num:20
                    },
                    {
                        col:'가',
                        num:11
                    }]},
            {
                show_date:new Date(2017,6,22,4,30),
                seat_class:'R',
                seat_price:20000,
                seats_picked :[
                    {
                        col:'가',
                        num:24
                    },
                    {
                        col:'가',
                        num:21
                    },
                    ]},
        ]
        let props = propss[this.state.index]
        props.seats_picked.sort((c,d) => {
            return c.num>d.num
        });
        props.seats_picked.sort((a,b) => {
            return a.col>b.col
        });

        let days=['일','월','화','수','목','금','토'];
        let day = days[new Date().getDay()];

        let seats_length = props.seats_picked.length;

        let seats_tspan_1 = '';
        if(seats_length>0) {
            for(let i=0;i<5&&i<seats_length;i++)
                seats_tspan_1 += props.seats_picked[i].col+'-열 '+props.seats_picked[i].num+'번 '
        }
        let seats_tspan_2 = '';
        if(seats_length>5) {
            for(let i=5;i<10&&i<seats_length;i++)
                seats_tspan_2 += props.seats_picked[i].col+'-열 '+props.seats_picked[i].num+'번 '
        }

        let seats_tspan_3 = '';
        if(seats_length>0) {
            for(let i=0;i<2&&i<seats_length;i++)
                seats_tspan_3 += props.seats_picked[i].col+'-열 '+props.seats_picked[i].num+'번 '
        }
        let seats_tspan_4 = '';
        if(seats_length>2) {
            for(let i=2;i<4&&i<seats_length;i++)
                seats_tspan_4 += props.seats_picked[i].col+'-열 '+props.seats_picked[i].num+'번 '
        }
        let seats_tspan_5 = '';
        if(seats_length>4) {
            for(let i=4;i<6&&i<seats_length;i++)
                seats_tspan_5 += props.seats_picked[i].col+'-열 '+props.seats_picked[i].num+'번 '
        }
        let seats_tspan_6 = '';
        if(seats_length>6) {
            for(let i=6;i<8&&i<seats_length;i++)
                seats_tspan_6 += props.seats_picked[i].col+'-열 '+props.seats_picked[i].num+'번 '
        }
        let seats_tspan_7 = '';
        if(seats_length>8) {
            for(let i=8;i<10&&i<seats_length;i++)
                seats_tspan_7 += props.seats_picked[i].col+'-열 '+props.seats_picked[i].num+'번 '
        }





        return (
            <div style={{width:430.860,height:252.270}}>
                <object style={{width:430.860,height:252.270,position:'absolute',zIndex:-1}}
                        type="image/svg+xml" data={
                            props.seat_class==='R' ?
                            "https://storage.googleapis.com/red_printing/ticket_R.svg" :
                                "https://storage.googleapis.com/red_printing/ticket_VIP.svg"}>
                    Your browser does not support SVG
                </object>
                <svg style={{width:430.860,height:252.270}}>
                    <text transform="matrix(7.74 0 0 9 317.6007 27.7169)">
                        <tspan fontFamily="g_font_2"
                                   fontSize="1px" y="0" x="0 1 2 3 4"
                                   fill="rgb(255,255,255)">
                            소월아트홀
                        </tspan>
                    </text>
                    <text transform="matrix(12.9 0 0 15 314.0857 42.7169)">
                        <tspan fontFamily="g_font_2"
                               fontSize="1px" y="0" x="0"
                               fill="rgb(255,255,255)">
                            {parseInt(props.show_date.getMonth())+1+'/'+props.show_date.getDate()+'·'+day}
                        </tspan>
                    </text>
                    <text transform="matrix(7.74 0 0 9 331.0993 55.7169)">
                        <tspan fontFamily="g_font_4"
                               fontSize="1px" y="0" x="-1"
                               fill="rgb(255,255,255)">
                            {props.show_date.getHours()+'시'+props.show_date.getMinutes()+'분'}
                        </tspan>
                    </text>
                    <text transform={props.seat_class==='R' ? "matrix(10.8 0 0 12 269.9115 20)":"matrix(10.8 0 0 12 262.9115 20)"}>
                        <tspan fontFamily="g_font_5" fontSize="1px" y="0" x="0" fill="rgb(255,255,255)">
                            {props.seat_class}
                        </tspan>
                    </text>
                    <text transform="matrix(7.2 0 0 8 270.6855 30)">
                        <tspan fontFamily="g_font_5" fontSize="1px" y="0" x="0" fill="rgb(255,255,255)">
                            석
                        </tspan>
                    </text>
                    <text transform={props.seat_class==='R' ?"matrix(8.64 0 0 9.6 10.2895 20.2913)":"matrix(8.64 0 0 9.6 5.2895 20.2913)"}>
                        <tspan fontFamily="g_font_5" fontSize="1px" y="0" x="0" fill="rgb(255,255,255)">
                            {props.seat_class}
                        </tspan>
                    </text>
                    <text transform="matrix(5.76 0 0 6.4 10.9087 30.2913)">
                        <tspan fontFamily="g_font_5" fontSize="1px" y="0" x="0" fill="rgb(255,255,255)">
                            석
                        </tspan>
                    </text>
                <text  transform={props.seats_picked.length>5 ? "matrix(10 0 0 10 143.2697 50.7093)" : "matrix(10 0 0 10 143.2697 60.7093)"}>
                    <tspan fontFamily="g_font_4"
                           fontSize="1px"
                           y="0"
                           x="0"
                           fill="rgb(43,46,52)">
                        {'공연시간 : '+(props.show_date.getMonth()+1)+'.'+props.show_date.getDate()+'.'+day+' / '+props.show_date.getHours()+'시 '+props.show_date.getMinutes()+'분'}
                    </tspan>
                    <tspan fontFamily="g_font_4"
                           fontSize="1px"
                           y="1.2"
                           x="0"
                           fill="rgb(43,46,52)">
                        {'인원 : '+props.seats_picked.length} 명
                    </tspan>
                    <tspan fontFamily="g_font_4"
                           fontSize="1px"
                           y="2.4"
                           x="0"
                           fill="rgb(43,46,52)">
                          {'좌석 : '+props.seat_class+'석'+' '+props.seat_price+'원'}
                    </tspan>
                    <tspan fontFamily="g_font_4"
                           fontSize="1px"
                           y="3.6"
                           x="0"
                           fill="rgb(43,46,52)">
                        {
                            seats_tspan_1
                        }
                    </tspan>
                    <tspan fontFamily="g_font_4"
                           fontSize="1px"
                           y="4.8"
                           x="0"
                           fill="rgb(43,46,52)">
                        {
                            seats_tspan_2
                        }
                    </tspan>
                    <tspan fontFamily="g_font_4"
                           fontSize="1px"
                           y="0"
                           x="-13.365"
                           fill="rgb(43,46,52)">
                        {'공연시간 : '+(props.show_date.getMonth()+1)+'.'+props.show_date.getDate()+'.'+day+' / '+props.show_date.getHours()+'시 '+props.show_date.getMinutes()+'분'}
                    </tspan>
                    <tspan fontFamily="g_font_4"
                           fontSize="1px"
                           y="1.2"
                           x="-13.365"
                           fill="rgb(43,46,52)">
                        {'인원 : '+props.seats_picked.length} 명
                    </tspan>
                    <tspan fontFamily="g_font_4"
                           fontSize="1px"
                           y="2.4"
                           x="-13.365"
                           fill="rgb(43,46,52)">
                        {'좌석 : '+props.seat_class+'석'+' '+props.seat_price+'원'}
                    </tspan>
                    <tspan fontFamily="g_font_4"
                           fontSize="1px"
                           y="3.6"
                           x="-13.365"
                           fill="rgb(43,46,52)">
                        {
                            seats_tspan_3
                        }
                    </tspan>
                    <tspan fontFamily="g_font_4"
                           fontSize="1px"
                           y="4.8"
                           x="-13.365"
                           fill="rgb(43,46,52)">
                        {
                            seats_tspan_4
                        }
                    </tspan>
                    <tspan fontFamily="g_font_4"
                           fontSize="1px"
                           y="6"
                           x="-13.365"
                           fill="rgb(43,46,52)">
                        {
                            seats_tspan_5
                        }
                    </tspan>
                    <tspan fontFamily="g_font_4" 
                           fontSize="1px" 
                           y="7.2" 
                           x="-13.365"
                           fill="rgb(43,46,52)">
                        {
                            seats_tspan_6
                        }
                    </tspan>
                    <tspan fontFamily="g_font_4" 
                           fontSize="1px" 
                           y="8.4" 
                           x="-13.365"
                           fill="rgb(43,46,52)">
                        {
                            seats_tspan_7
                        }
                    </tspan>
                </text>
                </svg>
                <button onClick={()=>{this.setState({index: (this.state.index+1)%4})}}>change</button>
            </div>

        )
    }
}


export default SVG