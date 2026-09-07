let mode = false;

// function setMode(newMode){
//     mode=newMode;
//
//     const romanBtn = document.getElementById("romanToNumber");
//     const numberBtn = document.getElementById("numberToRoman");
//     const label = document.getElementById("inputlabel");
//     const value = document.getElementById("inputValue");
//     const result = document.getElementById("result");
// }

const toggleBtn = document.getElementById("toggleBtn");
const label = document.getElementById("inputlabel");
const input = document.getElementById("inputValue");
const result = document.getElementById("result");
const convertBtn = document.getElementById("convertBtn");

input.addEventListener('keydown', function (event){
    if (event.key === 'Enter') {
        convertBtn.click();
    }
});

toggleBtn.addEventListener("click", ()=>{
    mode = !mode;

    if(mode){
        label.textContent="Roman Number";
        input.placeholder="Enter Roman Number";
        toggleBtn.textContent="Roman To Decimal";
    }
    else{
        label.textContent="Decimal Number";
        input.placeholder="Enter Decimal Number";
        toggleBtn.textContent="Decimal To Roman";
    }

    input.value = "";
    result.textContent = "Result will be appear here.";
})

convertBtn.addEventListener("click", ()=>{
    const value = input.value.trim();

    if(!value){
        result.textContent = "Please Enter Value";
        return;
    }

    if(mode){
        result.textContent = romanToNumber(value);
    }
    else{
        if(Number.isNaN(Number(value))){
            result.textContent = "Not Valid Input!";
            return;
        }
        result.textContent = numberToRoman(Number(value));
        console.log(result.textContent);
    }
});


function numberToRoman(number){
    const symbols=['I', 'V', 'X', 'L', 'C', 'D', 'M'];
    const values=[1, 5, 10, 50, 100, 500, 1000];
    let roman="";
    let count=0;

    for(let i=symbols.length-1; i>=0; i--){
        while(number>=values[i]){
            roman+=symbols[i];
            number-=values[i];
            char = i;
            count+=1;
        }

        // 9 90 900
        if(i>=2){
            const sub = values[i]-values[i-2];
            console.log(`${number} ${sub} ${values[i]}`);

            if (number >= sub){
                roman+=symbols[i-2]+symbols[i];
                number-=sub;
            }
        }

        // if(i>=1){
        //     const sub2 = values[i]-values[i-1];
        //     console.log(`${number} ${sub2} ${values[i]}`);

        //     if(number >= sub2){
        //         roman+=symbols[i-1]+symbols[i];
        //         number-=sub2;
        //     }
        // }
        // 27 not worked

        if(count===4){
            roman=roman.slice(0, -4);
            roman+=symbols[char]+symbols[char+1];
        }
        count=0;
    }

    return roman;
}

function romanToNumber(roman){
    const romanRegex = /^(?=.)M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;

    if(!romanRegex.test(roman)){
        return "Not Valid Input!";
    }

    var num = 0;
    const values = {
        I: 1,
        V: 5,
        X: 10,
        L: 50,
        C: 100,
        D: 500,
        M: 1000
    }

    for(let i=0; i<roman.length; i++){
        let curr = values[roman[i]];
        let next = values[roman[i+1]];

        if(curr<next){
            num-=curr;
        }
        else{
            num+=curr;
        }
    }

    return num;
}