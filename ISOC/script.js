var logic = true;
function display(){
    var menu = document.getElementsByClassName('menu')[0]
    if(logic){
        menu.animate([
            {
                display:"none",
                top: 0,
                right: "-375px"
            },
            {
                display:"flex",
                top: 0,
                right: 0
            }
        ],{
            duration: 500,
            easing: "linear",
            fill: "forwards"
        })
        menu.style = "display:flex;";
        logic = !logic
    }
    else{
        menu.animate([
            {
                display:"flex",
                top: 0,
                right: 0
            },
            {
                display:"none",
                top: 0,
                right: "-375px"
            }
        ],{
            duration: 500,
            easing: "linear",
            fill: "forwards"
        })
        menu.style = "display:none;";
        logic = !logic
    }
}
fetch('../struktur.txt')
    .then(response => response.text())
    .then(text => {
        document.getElementsByTagName("header")[0].innerHTML = text;
    })
    .catch(err => {
        console.error("Error reading file:", err);
    });