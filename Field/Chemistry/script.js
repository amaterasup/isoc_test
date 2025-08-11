async function txt_file(nama) {
    const res = await fetch(`data ${nama}.txt`)
        .then(response => response.text())
        .then(text => {
            let array = JSON.parse(text);
            return array;
        })
        .catch(err => {
            console.error("Error reading file:", err);
        });
    return res;
}
txt_file("unsur").then(result => {
    buat_unsur(result);
});
txt_file("golongan").then(result => {
    buat_golongan(result);
});
const periodic_table = document.getElementsByClassName("data-unsur")[0];
function buat_unsur(unsur){
    unsur.forEach((unsur) => {
        const div = document.createElement("div");
        div.className = "unsur";
        div.classList.add(unsur.golongan);
        div.classList.add(unsur.fase);
        div.id = unsur.tipe;
        div.style.gridColumn = unsur.gol;
        div.style.gridRow = 1 + Number(unsur.periode);
        div.onclick = () => show(unsur);
        div.innerHTML = "<div class=nomor-atom>" + unsur.nomor + "</div>" + "<div class=lambang-unsur>" + unsur.lambang + "<div>" + "<div class=nama-unsur>" + unsur.nama + "</div>";
        periodic_table.append(div);
    })
}
function buat_golongan(golongan){
    golongan.forEach((golongan) => {
        const div = document.createElement("div");
        div.className = "golongan";
        div.classList.add("unsur");
        div.style.gridColumn = golongan.c;
        div.style.gridRow = golongan.r;
        div.innerHTML = "<div class=nama-golongan>" + golongan.nama + "</div>";
        periodic_table.append(div);
    })
}
function show(unsur){
    const info = document.getElementsByClassName("display-unsur")[0];
    info.innerHTML = "<div class=lambang id=" + unsur.tipe + `><img src=${unsur.image}></div><div class=info-unsur>Nama : ${unsur.nama}<br>Nomor Atom : ${unsur.nomor}<br>Massa : ${unsur.massa}<br>Golongan : ${unsur.golongan}<div class=konfig>Kofigurasi : ${unsur.konfigurasi}</div></div>`;
}
function resizeContent() {
    const content = document.getElementsByClassName("periodic-table")[0];
    const scale = window.innerWidth / 700;
    content.style.zoom = scale;
}

//window.addEventListener("resize", resizeContent);
//window.addEventListener("load", resizeContent);

var percent = "";
for(var i = 1000; i >= 5; i--){
    var kor = i/10;
    var temp = Math.sqrt(Math.pow(99.5,2) - Math.pow(100 - kor,2));
    percent = percent + `${kor}% ${100 - temp}%,`;
}
var equalize_btn = document.getElementById("btn-input-chemistry");
equalize_btn.addEventListener("click", () => {
    var react_1 = document.getElementById("input-text-chemistry-react-1").value;
    var react_2 = document.getElementById("input-text-chemistry-react-2").value;
    var product_1 = document.getElementById("input-text-chemistry-product-1").value;
    var product_2 = document.getElementById("input-text-chemistry-product-2").value;
    var senyawa = [{value:react_1,code:"react_1",element:"react-1"},{value:react_2,code:"react_2",element:"react-2"},{value:product_1,code:"product_1",element:"product-1"},{value:product_2,code:"product_2",element:"product-2"}];
    make_equalize_result(senyawa);
    document.getElementsByClassName("equalize")[0].style.display = 'flex';
})
function make_equalize_result(senyawa_input){
    var data_senyawa = {react_1:{koofisien:0},react_2:{koofisien:0},product_1:{koofisien:0},product_2:{koofisien:0}};
    var senyawa_output = {"react_1":{value:"",code:"react_1",element:"react-1"},"react_2":{value:"",code:"react_2",element:"react-2"},"product_1":{value:"",code:"product_1",element:"product-1"},"product_2":{value:"",code:"product_2",element:"product-2"}};
    var can = true;
    txt_file("unsur").then(unsur => {
        senyawa_input.forEach(input => {
            var element = document.getElementById(input.element);
            var warn = document.getElementById("warning");
            var inside = "<p>";
            var value = input.value;
            if(!(isNaN(parseInt(value)))){
                inside += parseInt(value);
                data_senyawa_list(input.code,'koofisien',parseInt(value))
                value = value.slice((parseInt(value)).toString().length);
            }
            else if(value.length != 0){
                data_senyawa_list(input.code,'koofisien',1);
            }
            var last = 'none';
            var indexkali = 1;
            for(let index = 0; index < unsur.length && value.length > 0 && can; index++){
                if(!(isNaN(parseInt(value))) && value.length != 0 && last != 'none'){
                    inside += `<sub>${parseInt(value)}</sub>`;
                    data_senyawa_list(input.code,last,parseInt(value) * indexkali);
                    value = value.slice((parseInt(value)).toString().length);
                    index = -1;
                }
                else if(value.slice(0,1) == '(' || value.slice(0,1) == ')'){
                    if(value.slice(0,1) == '('){
                        indexkali = parseInt(value.slice(value.indexOf( ')' ) + 1));
                        inside += value.slice(0,1);
                        value = value.slice(1);
                    }
                    else if(value.slice(0,1) == ')' ){
                        indexkali = 1;
                        inside += value.slice(0,1);
                        value = value.slice(1);
                        inside += `<sub>${parseInt(value)}</sub>`;
                        value = value.slice((parseInt(value)).toString().length);
                    }
                }
                else if(value.slice(0,2) == unsur[index].lambang && value.slice(1).length != 0){
                    inside += unsur[index].lambang;
                    last = unsur[index].lambang;
                    if(!(isNaN(parseInt(value.slice(2))))){
                        data_senyawa_list(input.code,unsur[index].lambang,0);
                        value = value.slice(2);
                    }
                    else{
                        data_senyawa_list(input.code,unsur[index].lambang,1 * indexkali);
                        value = value.slice(2);
                    }
                    index = -1;
                    warn.innerHTML = "";
                }
                else if(value.slice(0,1) == unsur[index].lambang && value.length != 0 && !(unsur.some(set => Object.values(set).includes((value+'--').slice(0,2))))){
                    last = unsur[index].lambang;
                    inside += unsur[index].lambang;
                    if(!(isNaN(parseInt(value.slice(1))))){
                        data_senyawa_list(input.code,unsur[index].lambang,0);
                        value = value.slice(1);
                    }
                    else{
                        data_senyawa_list(input.code,unsur[index].lambang,1 * indexkali);
                        value = value.slice(1);
                    }
                    index = -1;
                    warn.innerHTML = "";
                }
                else if(unsur[index].nomor == 118 && isNaN(parseInt(value)) && value.length != 0){
                    warn.innerHTML = `${value} NOT FOUND!!!`;
                    value = "";
                    can = false
                }
            }
            inside += "</p>";
            senyawa_output[input.code].value = inside;
        })
        
    });
    var tempU = [];
    function data_senyawa_list(idx,name_idx,value){
        if(name_idx != 'koofisien' && !(tempU.includes(name_idx))){
            tempU.push(name_idx);
        }
        if(name_idx == 'koofisien' && value > 0){
            data_senyawa[idx]['koofisien'] = value;
        }
        else if(name_idx in data_senyawa[idx]){
            data_senyawa[idx][name_idx] += value;
        }
        else{
            data_senyawa[idx][name_idx] = value;
        }
    }
    setTimeout(() => {
        var data_senyawa_imbang = balanceEquation(data_senyawa,tempU);
        let koof = 0;
        for(let output in senyawa_output){
            var element = document.getElementById(senyawa_output[output].element);
            var inside = senyawa_output[output].value;
            if(data_senyawa_imbang[koof] > 1){
                inside = inside.slice(0,3) + data_senyawa_imbang[koof] + inside.slice(3);
            }
            element.innerHTML = inside;
            koof++;
        }
    },100)
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function lcmArray(arr) {
  return arr.reduce((a, b) => lcm(a, b));
}
function gaussianElimination(A) {
    let m = A.length;
    let n = A[0].length ; // number of variables
    let h = 0 /* Initialization of the pivot row */
    let k = 0 /* Initialization of the pivot column */
    var ans = new Array(n).fill(1);
    while( h < m && k < n){
        /* Find the k-th pivot: */
        i_max = h;
        for(i = h; i < m; i++){
            if(Math.abs(A[i][k]) > Math.abs(A[i_max][k])){
                i_max = i;

            }
        }
        if (A[i_max][k] == 0) k = k + 1
        else{
            [A[h], A[i_max]] = [A[i_max], A[h]];
            for(let i = h + 1; i < m; i++){
                var f = A[i][k] / A[h][k];
                A[i][k] = 0;
                for(let j = k + 1; j < n; j++){
                    A[i][j] = A[i][j] - A[h][j] * f;
                }
            }
            h++;
            k++;
        }
            
    }
    let idx = 0;
    let times = 0;
    function check(){
        for(let idx = 0; idx < m; idx++){
            if(A[0][0] * ans[0] + A[0][1] * ans[1] + A[0][2] * ans[2] + A[0][3] * ans[3] != 0);
            return true;
        }
        return false;
    };
    while(check() && times <= 10){
        if( A[idx][0] != 0) var a = (A[idx][1] * ans[1] + A[idx][2] * ans[2] + A[idx][3] * ans[3]) / -A[idx][0];
        if( A[idx][1] != 0) var b = (A[idx][0] * ans[1] + A[idx][2] * ans[2] + A[idx][3] * ans[3]) / -A[idx][1];
        if( A[idx][2] != 0) var c = (A[idx][0] * ans[0] + A[idx][1] * ans[1] + A[idx][3] * ans[3]) / -A[idx][2];
        if( A[idx][3] != 0) var d = (A[idx][0] * ans[0] + A[idx][1] * ans[1] + A[idx][2] * ans[2]) / -A[idx][3];
        if(a == Math.floor(a) && a > 0){
            ans[0] = a;
        }
        if(b == Math.floor(b) && b > 0){
            ans[1] = b;
        }
        if(c == Math.floor(c) && c > 0){
            ans[2] = c;
        }
        if(d == Math.floor(d) && d > 0){
            ans[3] = d;
        }
        idx = (idx + 1) % m;
        times++;
    }
    return ans;
}
function balanceEquation(compounds,unsur) {
    let matrix = [];
    unsur.forEach((element, index) => {
        let temp = [];
        for(let jok in compounds){
            let tumb = compounds[jok];
            if(element in tumb){
                if(jok.startsWith("product_")){
                    temp.push(-tumb[element]);
                }
                else{
                    temp.push(tumb[element]);
                }
            }
            else{
                temp.push(0);
            }
        }
        matrix.push(temp);
    })
    var rhs = new Array(matrix.length).fill(0);
    const solution = gaussianElimination(matrix);
    return solution;

}

