// let apiUrl = "https://gamerules.herokuapp.com/gamerules"; // api url
let apiUrl = "http://localhost:3000/gamerules"; // url for local api when debugging
let sourceUrl = "https://media.wizards.com/2021/downloads/MagicCompRules%2020210419.txt"; // rules source url 

// store Rules in array
let rulesArray = [];

// Store selected chapter
let selectedChapterNbr = 0;

$(document).ready(function () {
    // get rules data from api
    fetchRules(sourceUrl);

    // search for word in rules
    $("#search-input").keypress(function (event) {
        let key = event.which;
        if (key == 13) {
            searchInRules();
        }
    });

    // set default url to source input
    $("#source").val(sourceUrl);

    // get different source url
    $("#source").keypress(function (event) {
        let key = event.which;
        if (key == 13) {
            sourceUrl = $("#source").val();
            fetchRules(sourceUrl);
        }
    })

    alert('NOTE! The api, from where client gets data, goes to sleep when it has not used for a while. Please be paitient, content should appear within a few seconds. Enjoy Gamerules!')

})

// search input
function searchInRules() {
    // get value from input
    let key = $("#search-input").val();

    // reset card content
    $("#card-title").empty();
    $("#card-subtitle").empty();
    $("#card-content").empty();

    // search each chapter 
    rulesArray.forEach(chapter => {
        // search each chapter
        chapter.subchapters.forEach(subchapter => {
            // search each rule
            subchapter.rules.forEach(rule => {
                // search key is string
                if (!Number.isInteger(parseInt(key)) && rule.text.toLowerCase().includes(key.toLowerCase())) {
                    $("#card-content").append("<p>" + rule.nbr + " – " + setHyperLink(rule.text).replace(new RegExp(key, 'gi'), '<span style="background-color:yellow">$&</span>'));
                }
                // search key is number
                if (Number.isInteger(parseInt(key)) && rule.nbr.includes(key.toString())) {
                    $("#card-content").append("<p>" + rule.nbr.replace(new RegExp(key, 'gi'), '<span style="background-color:yellow">$&</span>') + " – " + setHyperLink(rule.text));
                }
            })
        })
    })
}

// fetch rules with provided url
function fetchRules(sourceUrl) {
    // post request to api
    axios.post(apiUrl, { url: sourceUrl })
        .then(function (response) {
            // set content to table
            setContent(response.data);
            // save rules to variable
            rulesArray = response.data;
        })
}

// append content links
function setContent(data) {
    $.each(data, function (index, obj) {
        // append hyperlink
        $("#chapters").append("<tr><td><a href='#' type='text' onclick='appendSubChapters(" + obj.nbr + ")'>" + obj.name + "</a></td></tr>");
    })
}

// append subchapters from selected chapter
function appendSubChapters(chapterNbr) {
    // reset card and search input
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
        // chapter match selected chapter
        if (chapterNbr == chapter.nbr) {
            $("#card-title").append(chapter.name);

            // Append each chapter in table
            chapter.subchapters.forEach(subchapter => {
                $("#subchapters").append("<tr><td><a href='#' type='text' onclick='appendRules(" + subchapter.nbr + ")'>" + subchapter.name + "</a></td></tr>")
            })

        }
    })
}

// append rules to card
function appendRules(subChapterNbr) {
    // reset card
    $("#card-content").empty();
    $("#card-subtitle").empty();

    // search chapter
    rulesArray.forEach(chapter => {
        // check if chapter match selected chapter
        if (chapter.nbr == selectedChapterNbr) {
            // search chapter
            chapter.subchapters.forEach(subchapter => {
                // subchapter match selected subchapter
                if (subchapter.nbr == subChapterNbr) {
                    // set card subtitle
                    $("#card-subtitle").append(subchapter.name);
                    // append rules
                    subchapter.rules.forEach(rule => {
                        // rule text contains reference to other rule
                        if (/\d/.test(rule.text)) {
                            // set link and append to card
                            $("#card-content").append("<p>" + rule.nbr + " – " + setHyperLink(rule.text));
                        }
                        // else append rule to card
                        else {
                            $("#card-content").append("<p>" + rule.nbr + " – " + rule.text);
                        }
                    })
                }
            })
        }
    })
}

// replace rule number with link
function setHyperLink(ruleText) {
    // if "rule" followed by rule nbr
    let ruleNbr = /(\d\d\d+(\.\w+)*)/gi;

    // set matched text to variable
    let rule = ruleText.match(ruleNbr);
    // if text match
    if (rule) {
        let newLine = ruleText;
        //  if string would contain multiple rule numbers
        rule.forEach(nbr => {
            newLine = newLine.replace(new RegExp(nbr), `<a href="#" onClick="getRuleByNbr('$&')">$& </a>`);
        })
        return newLine;
    }
    // if no rule nbr found
    else {
        return ruleText;
    }
}

// link in rule clicked
function getRuleByNbr(nbr) {
    // reset card
    $("#card-title").empty();
    $("#card-subtitle").empty();
    $("#card-content").empty();
    
    // extract chapter- and subchapter number
    let chapterNbr = nbr[0] + '.';
    let subChapterNbr = (nbr.split('.'))[0] + '.';

    // search chapter
    rulesArray.forEach(chapter => {
        // chapter match
        if (chapterNbr == chapter.nbr) {
            // set card title
            $("#card-title").append(chapter.name);
        }

        // search each chapter
        chapter.subchapters.forEach(subchapter => {
            // subtitle match
            if (subChapterNbr == subchapter.nbr) {
                // set card subtitle
                $("#card-subtitle").append(subchapter.name)
            }

            // search each rule
            subchapter.rules.forEach(rule => {
                // rule match search key
                if (rule.nbr.includes(nbr)) {
                    $("#card-content").append("<p>" + rule.nbr + " – " + setHyperLink(rule.text));
                }
            })
        })
    })

}