let arr = [
    {a:1,b:2},
    {a:2,b:3}
];

console.log(arr.find((e) => {
    return e.a===0
}));