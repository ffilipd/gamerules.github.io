let apiUrl = "https://gamerules.herokuapp.com/gamerules"; // api url
// let apiUrl = "http://localhost:3000/gamerules"; // url for local api when debugging
let sourceUrl = "https://media.wizards.com/2021/downloads/MagicCompRules%2020210419.txt"; // rules source url 

let sourceData;

$(document).ready(() => {
    fetchRulesWithProvidedUrl(sourceUrl)

    // search for word in rules
    $("#search-input").keypress((event) => {
        let key = event.which;
        if (key == 13) {
            searchInRules();
        }
    });

    // set default url to source input
    $("#source").val(sourceUrl);

    // get different source url
    $("#source").keypress((event) => {
        let key = event.which;
        if (key == 13) {
            sourceUrl = $("#source").val();
            fetchRulesWithProvidedUrl(sourceUrl);
        }
    })

    alert('NOTE! The api, from where client gets data, goes to sleep when it has not used for a while. Please be paitient, content should appear within a few seconds. Enjoy Gamerules!')
})


const fetchRulesWithProvidedUrl = (sourceUrl) => {
    // post request to api
    axios.post(apiUrl, { url: sourceUrl })
        .then((res) => {
            sourceData = res.data;
            appendChaptersToHtml(sourceData.chapters)
        }), (err) => console.log(err)
}

const appendChaptersToHtml = (chapters) => {
    $("#chapters").empty();
    $.each(chapters, (index, obj) => {
        // create and append hyperlink
        $("#chapters").append("<tr><td><a href='#' type='text' onclick='appendSubChapters(" + obj.nbr + ")'>" + obj.text + "</a></td></tr>");
    })
}

const appendSubChapters = (selectedChapterNbr) => {
    const selectedChapter = sourceData.chapters.filter(chapter => chapter.nbr == selectedChapterNbr)[0]
    // reset card and search input
    $("#card-title").empty();
    $("#card-subtitle").empty();
    $("#card-content").empty();
    $("#subchapters").empty();
    $("#search-input").val('');

    // append chapter title to card
    $("#card-subtitle").append('–– Select Subchapter ––');
    $("#card-title").append(selectedChapter.text);

    const selectedSubchapters = sourceData.subchapters.filter(subchapter => subchapter.nbr[0] == selectedChapterNbr);

    // append subchapters to html
    $.each(selectedSubchapters, (index, obj) => {
        $("#subchapters").append("<tr><td><a href='#' type='text' onclick='appendRules(" + obj.nbr + ")'>" + obj.text + "</a></td></tr>")
    })
}

const appendRules = (subchapterNbr) => {
    const selectedSubchapter = sourceData.subchapters.filter(subchapter => subchapter.nbr == subchapterNbr)[0];
    // reset card
    $("#card-content").empty();
    $("#card-subtitle").empty();

    // append title to card
    $("#card-subtitle").append(selectedSubchapter.text);

    const selectedRules = sourceData.rules.filter(rule => rule.nbr.substr(0, 3) == subchapterNbr);

    // append rules to html
    $.each(selectedRules, (index, obj) => {
        // rule text contains reference to other rule
        if (/\d/.test(obj.text)) {
            // set link and append to card
            $("#card-content").append("<p>" + obj.nbr + " – " + setHyperLink(obj.text));
        }
        // else append rule to card
        else {
            $("#card-content").append("<p>" + obj.nbr + " – " + obj.text);
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
            newLine = newLine.replace(new RegExp(nbr), `<a href="#" onClick='getRuleByNbr($&)'>$& </a>`);
        })
        return newLine;
    }
    // if no rule nbr found
    else {
        return ruleText;
    }
}

// link in rule clicked
function getRuleByNbr(clickedRuleNbr) {
    modal.style.display = "block";

    // reset modal
    $("#modal-title").empty();
    $("#modal-subtitle").empty();
    $("#modal-content").empty();

    const selectedChapter = sourceData.chapters.filter(chapter => chapter.nbr == (clickedRuleNbr[0] + '.'))[0];
    const selectedSubchapter = sourceData.subchapters.filter(subchapter => subchapter.nbr == ((clickedRuleNbr.split('.'))[0] + '.'))[0];

    // Append titles to modal html
    $("#modal-title").append(selectedChapter.text);
    $("#modal-subtitle").append(selectedSubchapter.text)

    // get rules and append to modal html
    const selectedRules = sourceData.rules.filter(rule => rule.nbr.includes(clickedRuleNbr));

    // append rules to card html
    $.each(selectedRules, (index, obj) => {
        $("#modal-content").append("<p>" + obj.nbr + " – " + setHyperLink(obj.text));
    })
}

// search input
const searchInRules = () => {
    // get value from input
    let key = $("#search-input").val();

    // reset card content
    $("#card-title").empty();
    $("#card-subtitle").empty();
    $("#card-content").empty();


    $.each(sourceData.rules, (index, obj) => {
        // search key is string
        if (!Number.isInteger(parseInt(key)) && obj.text.toLowerCase().includes(key.toLowerCase())) {
            $("#card-content").append("<p>" + obj.nbr + " – " + setHyperLink(obj.text).replace(new RegExp(key, 'gi'), `<span style="background-color:yellow">$&</span>`));
        }
        // search key is number
        if (Number.isInteger(parseInt(key)) && obj.nbr.includes(key.toString())) {
            $("#card-content").append("<p>" + obj.nbr.replace(new RegExp(key, 'gi'), `<span style="background-color:yellow">$&</span>`) + " – " + setHyperLink(obj.text));
        }
    })

}



// Modal
const modal = document.getElementById("modal");

// When the user clicks on <span> (x), close the modal
$("span").click(() => {
    modal.style.display = "none";
})

// When the user clicks anywhere outside of the modal, close it
$(window).click((event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
})