function decimal_to_roman(num){
    const symbolTree = [
        ["I", "V", "X"],
        ["X", "L", "C"],
        ["C", "M", "D"]
    ]

    let result="";

    const thousands = Math.floor(num/1000);
    result+="M".repeat(thousands);
    num%=1000;

    for(let power=2; power>=0; power--){
        const unitValue=10**power;

        const digit = Math.floor(num/unitValue);
        num%=unitValue;

        if(digit===0){
            continue;
        }

        const [one, five, ten] = symbolTree[power];

        if(digit<=3){
            result+=one.repeat(digit);
        }
        else if(digit===4){
            result+=one+five;
        }
        else if(digit<=8){
            result+=five+one.repeat(digit-5);
        }
        else if(digit===9){
            result+=one+ten;
        }
    }

    return result;
}

console.log(decimal_to_roman(3444))

function decimal_to_roman_2(number){
    let roman = "";

    while(number>0){
        if(number>=1000){
            roman+="M";
            number-=1000;
        }
        else if(number>=500){
            roman+="D";
            number-=500;
        }
        else if(number>=100){
            roman+="C";
            number-=100;
        }
        else if(number>=50){
            roman+="L";
            number-=50;
        }
        else if(number>=10){
            roman+="X";
            number-=10
        }
        else if(number>=5){
            roman+="V";
            number-=5;
        }
        else{
            roman+="I";
            number-=1;
        }
    }

    return roman.replace("IIII", "IV")
        .replace("VIV", "IX")
        .replace("XXXX", "XL")
        .replace("LXL", "XC")
        .replace("CCCC", "CD")
        .replace("DCD", "CM")
}

console.log(decimal_to_roman_2(3444))
