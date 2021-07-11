$("#okbtn").click(function () {
    axios.get("https://catfact.ninja/fact")
    .then(function (res) {
        console.log(res);
    })
})