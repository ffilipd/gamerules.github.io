const gameRules = "https://ffilipd.github.io/gamerules.github.io/gamerules.txt"

$("#okbtn").click(function () {
    axios.get(gameRules)
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