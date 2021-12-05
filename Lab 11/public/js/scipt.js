(function($) {
    
    let requestConfig ={
        method: "GET",
        url: "http://api.tvmaze.com/shows"
    }

    let resultsDiv = document.getElementById("results")
    let ul = document.getElementById("showList")
    let showDiv = document.getElementById("show")
    let homeLink = document.getElementById("homeLink")
    let submitBtn = document.getElementById("submitBtn")
    let searchTerm = document.getElementById("search_term")
    let myErrors = document.getElementById("myErrors")

    $.ajax(requestConfig).then(function (responseMessage) {
        resultsDiv.hidden = false
        ul.hidden = false
        for (const i of responseMessage) {
            let li = document.createElement("li")
            li.classList = "individualShow"
            let a = document.createElement("a")
            a.setAttribute("href", i._links.self.href)
            showName = i.name
            let textNode = document.createTextNode(showName)
            a.appendChild(textNode)
            li.appendChild(a)
            ul.appendChild(li)
        }
    })

    $(document).on("click", `#showList > li > a`, function (event) {
        event.preventDefault()

        let link = this.attributes.href.nodeValue
        resultsDiv.hidden = false
        ul.hidden = true
        $(ul).empty()
        $.ajax(link).then(function (responseMessage) {
            showDiv.hidden = false
            
            let h1 = document.createElement("h1"), textNode
            if (!responseMessage.name) {
                let name = "N/A"
                textNode = document.createTextNode(name)
            } else {
                let name = responseMessage.name
                textNode = document.createTextNode(name)
            }
            h1.appendChild(textNode)
            showDiv.appendChild(h1)

            let img = document.createElement("img")
            if (!responseMessage.image) {
                img.setAttribute("src", `/public/images/no_image.jpeg`)
                img.setAttribute("alt", "No Image")   
            } else {
                img.setAttribute("src", `${responseMessage.image.medium}`)
                img.setAttribute("alt", "Show's Poster")
            }
            showDiv.appendChild(img)

            let dl = document.createElement("dl")
            let dt = document.createElement("dt")

    // Language
            textNode = document.createTextNode("Language")
            dt.appendChild(textNode)
            if (!responseMessage.language) {
                let dd = document.createElement("dd")
                textNode = document.createTextNode("N/A")
                dd.appendChild(textNode)
                dt.appendChild(dd)
            } else {
                let dd = document.createElement("dd")
                textNode = document.createTextNode(responseMessage.language)
                dd.appendChild(textNode)
                dt.appendChild(dd)
            }
            dl.appendChild(dt)

    // Genre
            textNode = document.createTextNode("Genres")
            dt = document.createElement("dt")
            dt.appendChild(textNode)
            if (!responseMessage.genres || responseMessage.genres.length == 0) {
                let dd = document.createElement("dd")
                textNode = document.createTextNode("N/A")
                dd.appendChild(textNode)
                dt.appendChild(dd)
            } else {
                let dd = document.createElement("dd")
                let ul = document.createElement("ul")
                responseMessage.genres.forEach(x => {
                    let li = document.createElement("li")
                    textNode = document.createTextNode(x)
                    li.appendChild(textNode)
                    ul.appendChild(li)
                });
                dd.appendChild(ul)
                dt.appendChild(dd)
            }
            dl.appendChild(dt)

    // Average Rating
            textNode = document.createTextNode("Average Rating")
            dt = document.createElement("dt")
            dt.appendChild(textNode)
            if (!responseMessage.rating.average) {
                let dd = document.createElement("dd")
                textNode = document.createTextNode("N/A")
                dd.appendChild(textNode)
                dt.appendChild(dd)    
            } else {
                let dd = document.createElement("dd")
                textNode = document.createTextNode(responseMessage.rating.average)
                dd.appendChild(textNode)
                dt.appendChild(dd)
            }
            dl.appendChild(dt)

    // Network
            textNode = document.createTextNode("Network")
            dt = document.createElement("dt")
            dt.appendChild(textNode)
            if (!responseMessage.network.name) {
                let dd = document.createElement("dd")
                textNode = document.createTextNode("N/A")
                dd.appendChild(textNode)
                dt.appendChild(dd)    
            } else {
                let dd = document.createElement("dd")
                textNode = document.createTextNode(responseMessage.network.name)
                dd.appendChild(textNode)
                dt.appendChild(dd)
            }
            dl.appendChild(dt)
            
    // Summary
            textNode = document.createTextNode("Summary")
            dt = document.createElement("dt")
            dt.appendChild(textNode)
            if (!responseMessage.summary) {
                let dd = document.createElement("dd")
                textNode = document.createTextNode("N/A")
                dd.appendChild(textNode)
                dt.appendChild(dd)    
            } else {
                let dd = document.createElement("dd")
                dd.innerHTML = responseMessage.summary
                dt.appendChild(dd)
            }
            dl.appendChild(dt)
            showDiv.appendChild(dl)
        })
        homeLink.hidden = false
    })

    $(submitBtn).click(function (event) {
        event.preventDefault()

        resultsDiv.hidden = false
        // $(resultsDiv).empty()
        showDiv.hidden = true
        $(showDiv).empty()
        ul.hidden = false
        $(ul).empty()

        if ($(searchTerm).val().trim().length == 0) {
            resultsDiv.hidden = true
            myErrors.hidden = false
            $(myErrors).empty()

            let errorDiv = document.createElement("div")
            errorDiv.setAttribute("class", "errorDiv")
            errorDiv.innerHTML = "Please enter a valid string"
            myErrors.appendChild(errorDiv)
        } else {
            myErrors.hidden = true
            $(myErrors).empty()
            let searchReq = {
                method: "GET",
                url: "http://api.tvmaze.com/search/shows?q=" + $(searchTerm).val().trim()
            }
            $.ajax(searchReq).then(function (responseMessage) {
                let errorDiv = document.createElement("div")
                if (responseMessage.length == 0) {
                    // errorDiv.setAttribute("class", "errorDiv")
                    errorDiv.innerHTML = "No results found"
                    ul.appendChild(errorDiv)
                } else {
                    for (const i of responseMessage) {
                        let li = document.createElement("li")
                        li.classList = "individualShow"
                        let a = document.createElement("a")
                        a.setAttribute("href", i.show._links.self.href)
                        showName = i.show.name
                        let textNode = document.createTextNode(showName)
                        a.appendChild(textNode)
                        li.appendChild(a)
                        ul.appendChild(li)
                    }
                }
            })
        }
        homeLink.hidden = false
    })

})(window.jQuery);