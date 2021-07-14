// const apiUrl = "https://gamerules.herokuapp.com/gamerules";
const apiUrl = "http://localhost:3000/gamerules"

let rulesArray = [];
let selectedChapterNbr = 0;

$(document).ready(function () {
    fetchRules();

    // search for word in rules
    $("#search-input").change(searchInRules);

})

function searchInRules() {
    let key = $("#search-input").val();
    $("#card-title").empty();
    $("#card-subtitle").empty();
    $("#card-content").empty();
    // search each chapter 
    rulesArray.forEach(chapter => {
        // search each chapter
        chapter.subchapters.forEach(subchapter => {
            // search each rule
            subchapter.rules.forEach(rule => {
                if (rule.text.toLowerCase().includes(key.toLowerCase())) {
                    $("#card-content").append("<p>" + rule.nbr + " – " + setHyperLink(rule.text).replace(new RegExp(key, "gi"), '<span style="background-color:yellow">$&</span>'));
                }
                if (rule.nbr.includes(key.toString())) {
                    $("#card-content").append("<p>" + setHyperLink(rule.nbr).replace(new RegExp(key, "gi"), '<span style="background-color:yellow">$&</span>') + " – " + rule.text.replace(new RegExp(key, "gi"), '<span style="background-color:yellow">$&</span>'));
                }
            })
        })
    })
}

// fetch rules with provided url
function fetchRules() {
    let url = "https://media.wizards.com/2021/downloads/MagicCompRules%2020210419.txt";
    axios.post(apiUrl, { url: url })
        .then(function (response) {
            setContent(response.data);
            rulesArray = response.data;
        })
}

// append content links
function setContent(data) {
    $.each(data, function (index, obj) {
        $("#chapters").append("<tr><td><a href='#' type='text' onclick='appendSubChapters(" + obj.nbr + ")'>" + obj.name + "</a></td></tr>");
    })
}

// append subchapters from selected chapter
function appendSubChapters(chapterNbr) {
    // empty card and search input
    $("#card-title").empty();
    $("#card-subtitle").empty();
    $("#card-content").empty();
    $("#subchapters").empty();
    $("#search-input").val('');

    $("#card-subtitle").append('–– Select Subchapter ––');

    // store selected content in varable
    selectedChapterNbr = chapterNbr;

    // search subchapters for selected chapter
    rulesArray.forEach(chapter => {
        if (chapterNbr == chapter.nbr) {
            $("#card-title").append(chapter.name);

            // Append each chapter in table
            chapter.subchapters.forEach(subchapter => {
                $("#subchapters").append("<tr><td><a href='#' type='text' onclick='appendRules(" + subchapter.nbr + ")'>" + subchapter.name + "</a></td></tr>")
            })

        }
    })
}

// append rules to html
function appendRules(subChapterNbr) {
    // empty card
    $("#card-content").empty();
    $("#card-subtitle").empty();

    // search chapter
    rulesArray.forEach(chapter => {
        // check if chapter match selected chapter
        if (chapter.nbr == selectedChapterNbr) {
            // search chapter
            chapter.subchapters.forEach(subchapter => {
                if (subchapter.nbr == subChapterNbr) {
                    $("#card-subtitle").append(subchapter.name);
                    // append rules
                    subchapter.rules.forEach(rule => {
                        // check if rule text contains reference to other rule
                        if (/\d/.test(rule.text)) {
                            // console.log('set hyperlink')
                            $("#card-content").append("<p>" + rule.nbr + " – " + setHyperLink(rule.text));
                        }
                        // append rule to card
                        else {
                            $("#card-content").append("<p>" + rule.nbr + " – " + rule.text);
                        }
                    })
                }
            })
        }
    })
}


function setHyperLink(ruleText) {
    // if "rule" followed by rule nbr
    let ruleNbr = / (\d\d\d+(\.\w+)*)/gi;

    // set matched text to variable
    let rule = ruleText.match(ruleNbr);
    if (rule) {
        let newLine = ruleText;
        rule.forEach(nbr => {
            let x = nbr.split(' ')
            newLine = newLine.replace(new RegExp(x[1]), '<a href="#" onClick="getRuleByNbr(`$&`)">$&</a>');
        })
        return newLine;
    }
    else {
        return ruleText;
    }
}

function getRuleByNbr(nbr) {
    // console.log('clicked rule nbr: ' + nbr);
    $("#card-title").empty();
    $("#card-subtitle").empty();
    $("#card-content").empty();

    rulesArray.forEach(chapter => {
        // search each chapter
        chapter.subchapters.forEach(subchapter => {
            // search each rule
            subchapter.rules.forEach(rule => {
                if (rule.nbr.includes(nbr)) {
                    $("#card-content").append("<p>" + rule.nbr + " – " + setHyperLink(rule.text));
                }
            })
        })
    })

}