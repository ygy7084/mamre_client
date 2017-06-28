let arr = [
    {
        a:1,
        b:2
    },
    {
        a:2,
        b:3
    },
    {
        a:3,
        b:4
    },
];
console.log(arr.map(e=> {
    return e.a = e.a+1;
}));
for(let i in arr[0])
    console.log(i);