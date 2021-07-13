const apiUrl = "https://gamerules.herokuapp.com/gamerules";

$("#okbtn").click(function () {
    let url = "https://media.wizards.com/2021/downloads/MagicCompRules%2020210419.txt";
    axios.post(apiUrl, {url: url})
    .then(function (res) {
        console.log(res.data);
    })
})

$("#search-input").change(function () {
    let searchKey = $("#search-input").val();
    console.log(searchKey);

    $.get(gameRules, function (res) {
        let result = (res.data.indexOf(searchKey));
        console.log(res[result])
    })
})  