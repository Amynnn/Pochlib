jQuery(document).ready(function () {

    addBookBlock();
    getInSessionStorage();

    function getInSessionStorage()
    {
        for (let i = 0; i < sessionStorage.length; i++) {
            let id = sessionStorage.key(i);
            let value = sessionStorage.getItem(id);
            $("#content").append(`<div class="my-book" id="${id}"> ${value}</div>`);
        }
        replaceBookMark();
        removeBookInMyList()
    }

    function replaceBookMark() {
        $('.my-book .addbutton').replaceWith('<button class="remove-button">Supprimer</button>');
    }

    function removeInSessionStorage(id) {
        sessionStorage.removeItem(id, parent);
    }

    function removeBookInMyList() {
        $('.remove-button').click(function () {
            const element = $(this).closest('.my-book');
            let id = $(this).siblings('p').html();
            let idnum = id.replace(/\s/g, '')
            const parent = $(this).siblings('.my-book').html();
            console.log(idnum + element.html());
            $(element).remove();
            removeInSessionStorage(idnum, parent)
        });
    }

    function addBookBlock() {
        const block =
            `<div id="addBookBlock"> <button id="addBook" class="btn">Ajouter un livre</button></div>`;
        $('.h2NewBook').after(block);
        addBook();
    }

    function addBook() {
        $('#addBook').click(function () {
            const cancel =
                '<button id="cancel" class="btn">Annuler</button>'
            const block =
                `<div id="searchBlock">

    <form id="form">

        <label>Titre du livre</label><br>
            <input required type="text" name="title" id="title" class="input">
        <br>
        <label>Auteur</label>
        <br>
            <input required type="text" name="author" id="author" class="author"><br>
        <br>
        <button class="btn" id="search">Rechercher</button>

    </form>
    <br>
    ${cancel}
    </div>`;

            $('#addBook').hide();
            $('.h2NewBook').after(block);
            $('.searchBlock').after(cancel);

            removeSearchBlock();
            search();
        })
    }


    function removeSearchBlock() {
        $('#cancel').click(function () {
            $('#searchBlock').hide();
            $("#results").remove();
            addBookBlock();
        })
    }

    function search() {
        $('#form').submit(function (research) {
            research.preventDefault();
            const title = $("#title").val();
            const author = $("#author").val();
            const url = "https://www.googleapis.com/books/v1/volumes?q=" + title + "+inauthor:" + author;

            $.getJSON(url, function (data) {
                showResults(data);
            });
        });

        function showResults(data) {
            $("#results").remove();
            const resultBlock = `<div id="results"><h2>Résultats de recherche</h2><div id="results-books"></div></div>`;
            $('hr').after(resultBlock);
            if (data.totalItems > 0) {
                $.each(data.items, function (key, value) {
                    const block = `
                    <div class="book">
                
                <h3>Titre: ${value.volumeInfo.title}</h3>
                <p class="bookid">Id: ${value.id}</p>
                <p>Auteur: ${value.volumeInfo.authors[0]}</p>
                
                
                <button class="addbutton">Ajouter</button>
                
                
                
                <p>Description: ${getDescription(value.volumeInfo.description)}</p>
                <p class="center"><img src= "${getImage(value.volumeInfo.imageLinks)}" alt="${value.volumeInfo.title}"></p>
                
                </div>
                </div>`;
                    $("#results-books").append(block);
                });
                addBookInMyList();
            }
            else {
                $("#results-books").append('<p class="center">Aucun livre n\'a été trouvé</p>');
            }
        }
        function addInSessionStorage(id, content) {
            sessionStorage.setItem(id, content);
        }

        function addBookInMyList() {
            $('.addbutton').click(function () {

                let id = $(this).siblings('.book .bookid').html();
                let idnum = id.replace(/\s/g, '');
                let value = 0;;

                if (sessionStorage.getItem(idnum)){
                    alert('Ce livre a déjà été ajouté à votre liste');
                    value = 1;
                    return false;

                } else if (value == 0) {
                    let id = $(this).siblings('p').html();
                    let idnum = id.replace(/\s/g, '')
                    const parent = $(this).closest('.book').html();
                    $('#content').append(`<div class="my-book" id = ${idnum}>${parent}</div>`);
                    replaceBookMark();
                    removeBookInMyList();
                    addInSessionStorage(idnum, parent);
                }
            });
        }

        function getImage(image) {
            if (image == undefined) {
                image = 'images/unavailable.png';
                return image;
            }
            else {
                return image.thumbnail;
            }
        }

        function getDescription(description) {
            if (description == undefined) {
                return 'Information manquante';
            }
            else {
                return description.slice(0, 200) + '...';
            }
        }
    }

});
