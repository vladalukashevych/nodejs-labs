
const factorial = (n) => {
    if(n<=0)
        return -1;
    let sum = 1;
    for(let i=n; i>0; i--)
        sum = sum * i;
    return sum;
}

module.exports = factorial;