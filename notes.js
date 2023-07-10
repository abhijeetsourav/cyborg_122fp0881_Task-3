let add_note_btn = document.getElementById("add_button");
let func1 = ()=>{editor("new")};
add_note_btn.addEventListener("click", func1);

let search_note_btn = document.getElementById("search_img");
search_note_btn.addEventListener("click", search_func);

window.addEventListener("beforeunload", on_closing_tab);

function fade_bg() {
    document.body.style = "background: rgba(0, 0, 0, 0.6)";
    document.getElementById("created_notes").style.opacity = "0.1";
    document.getElementById("top").style.opacity = "0.1";
}

function reset_bg() {    
    document.body.style = "background: black";
    document.getElementById("created_notes").style.opacity = "1";
    document.getElementById("top").style.opacity = "1";
}

function editor(key, note_id=undefined){
    add_note_btn.removeEventListener("click", func1);   //disabling add_note button
    fade_bg();

    /******************************************************************************/
    let editor_popup = document.createElement("div");
    editor_popup.setAttribute("id","editor_popup");

    let title = document.createElement("textarea");    
    title.setAttribute("id","title");
    title.placeholder = "Add Your Title";
    
    let r_img = document.createElement("img");
    r_img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLFEJbciBtzhOOsVxkImfZcrg4EmzK2r04LQ&usqp=CAU";
    r_img.style = "grid-column:2";

    let w_img = document.createElement("img");
    w_img.src = "https://thumbs.dreamstime.com/b/x-red-mark-cross-sign-graphic-symbol-crossed-brush-strokes-red-mark-cross-sign-graphic-symbol-154904211.jpg";
    w_img.style =   "grid-column:3";

    let desc = document.createElement("textarea");
    desc.setAttribute("id","desc");
    desc.placeholder = "Add Description";
    
    editor_popup.appendChild(title);
    editor_popup.appendChild(r_img);
    editor_popup.appendChild(w_img);
    editor_popup.appendChild(desc);
    document.body.appendChild(editor_popup);
    /***********************************************************************************/

    if(key == "edit"){
        let note = document.getElementById(note_id);
        let para = note.getElementsByTagName("p");
        title.value = para[0].innerHTML;
        desc.value = para[1].innerHTML;
    }

    //Adding or discarding the note
    if (key == "new"){r_img.addEventListener("click", ()=>{add_note("new", title, desc);})}
    else if (key == "edit"){r_img.addEventListener("click", ()=>{edit_note(note_id, title, desc);})}
    
    w_img.onclick = () =>{
        add_note_btn.addEventListener("click", func1);
        document.body.removeChild(editor_popup);
        reset_bg();
    }

}


function add_note(key, title, desc, create_date =undefined, update=undefined){
    let notes_grid = document.getElementById("created_notes");
    let len = notes_grid.children.length;
    if(title.value != ""){
        add_note_btn.addEventListener("click", func1);      //renabling add_note_btn
        let arr = [];
        for (let i=1 ; i<=len ; i++){
            arr.push(document.getElementById((i).toString()));
        }
    
        for (let i=0 ; i<(arr.length) ; i++){
            arr[i].id = (i+2).toString();
        }
    
        /******************************************* NEW NOTE  *************************************************/
        let note = document.createElement("div");
        note.setAttribute("id","1");
        note.setAttribute("class", "note");
        
        let title_tag = document.createElement("p");
        title_tag.setAttribute("class", "title_tag");
    
        let options_img = document.createElement("img");
        options_img.setAttribute("class", "options_img");
        options_img.setAttribute("onclick", "options(this.parentElement.id)");
        options_img.src = "https://cdn0.iconfinder.com/data/icons/round-action-bar/48/more-512.png";
        options_img.width = "50";
        options_img.height = "50";
        
        let desc_tag = document.createElement("p");
        desc_tag.setAttribute("class", "desc_tag");
        
        let cr_date = document.createElement("p");
        cr_date.setAttribute("class", "cr_date");

        let up_date = document.createElement("p");
        up_date.setAttribute("class", "up_date");

        if(key == "new"){
            title_tag.innerHTML = title.value;
            desc_tag.innerHTML = desc.value;
            const date = new Date();
            cr_date.innerHTML = "Created on:"+date.getDate()+"-"+(date.getMonth() + 1)+"-"+date.getFullYear();
        }
        else if(key == "storage"){
            title_tag.innerHTML = title;
            desc_tag.innerHTML = desc;
            cr_date.innerHTML = create_date;
            up_date.innerHTML = update;
        }
        
        /*************************************************************************************************************/
        
    
        note.appendChild(title_tag);
        note.appendChild(options_img);
        note.appendChild(desc_tag);
        note.appendChild(cr_date);
        note.appendChild(up_date);

        notes_grid.appendChild(note);
        
        
        if(key == "new"){
            document.body.removeChild(editor_popup);
            reset_bg();
        }

        for (let e of arr){
            notes_grid.appendChild(e);
        }
    }

    else{alert("Add a Title");}

}


function edit_note(note_id, title, desc){
    add_note_btn.addEventListener("click", func1);      //renabling add_note_btn

    let search_win = document.getElementById("search_popup");
    if (search_win){       //checking for search window
        note_id = note_id.substring(1);
        let close_btn = document.getElementById("searchClose");
        search_win.innerHTML = "";
        search_win.appendChild(close_btn);
    }

    let note = document.getElementById(note_id);
    let para = note.getElementsByTagName("p");
    para[0].innerHTML = title.value;
    para[1].innerHTML = desc.value;

    const up_date = new Date();
    para[3].innerHTML = "Last updated:"+up_date.getDate()+"-"+(up_date.getMonth() + 1)+"-"+up_date.getFullYear();

    if (search_win == null){rem_options_box(note_id);}

    let notes_grid = document.getElementById("created_notes");
    let len = notes_grid.children.length;
    let edited_note_id = parseInt(note_id);

    let arr = [];
    for (let i=1 ; i<=len ; i++){
        if (i == edited_note_id){continue;}
        else{arr.push(document.getElementById((i).toString()));}
    }

    for (let i=0 ; i<(edited_note_id - 1) ; i++){
        arr[i].id = (i+2).toString();
    }
    note.id = "1";    //changing id of the edited note
   
    arr.unshift(note);

    for (let e of arr){
        notes_grid.appendChild(e);
    }
    

    //****************************************************************
    if (search_win){       //checking for search window
        let arr_search = searched_notes_array();
        if(arr_search.length == 0){
            rem_search_popup();
        }
        else{
            for (let note of arr_search){search_win.appendChild(note);}
        }
        }
    
    //*****************************************************************


    document.body.removeChild(editor_popup);
    reset_bg();

}


function del_note(note_id){
    let search_win = document.getElementById("search_popup");
    if(search_win){
        note_id = note_id.substring(1);
        let close_btn = document.getElementById("searchClose");
        search_win.innerHTML = "";
        search_win.appendChild(close_btn);
    }
    let note = document.getElementById(note_id);
    let notes_grid = document.getElementById("created_notes");
    let len = notes_grid.children.length;
    notes_grid.removeChild(note);
    note_id = parseInt(note_id);
    
    for (let i=(note_id + 1) ; i<=len ; i++){
        document.getElementById(i.toString()).id = (i-1).toString();
    }

    //****************************************************************
    if (search_win){       //checking for search window
        let arr_search = searched_notes_array();
        if(arr_search.length == 0){
            rem_search_popup();
        }
        else{
            for (let note of arr_search){search_win.appendChild(note);}
        }
    }
    //*****************************************************************

}


//generating options box inside an available note
function options(note_id){
    let note = document.getElementById(note_id);

    let optns_box = document.createElement("div");
    optns_box.setAttribute("class", "optns_box");

    let edit_btn = document.createElement("p");
    edit_btn.setAttribute("onclick", "editor(\"edit\", this.parentElement.parentElement.id)");
    edit_btn.innerHTML = "READ & EDIT";
    let del_btn = document.createElement("p");
    del_btn.setAttribute("onclick", "del_note(this.parentElement.parentElement.id)");
    del_btn.innerHTML = "DELETE";

    optns_box.appendChild(edit_btn);
    optns_box.appendChild(del_btn);
    note.appendChild(optns_box);

    let options_img = note.getElementsByTagName("img")[0];
    options_img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc5XG0Nn_xR6C3kw2jPzqTnEe4phroFJhSofNfOohba7cF0bsWuGmVFzKaJ3NuYT_AXy0&usqp=CAU"; 
    options_img.setAttribute("onclick", "rem_options_box(this.parentElement.id)");

}

//removing options box inside an available note
function rem_options_box(note_id){
    let note = document.getElementById(note_id);
    let options_img = note.getElementsByTagName("img")[0];
    let optns_box = note.getElementsByTagName("div")[0];
    note.removeChild(optns_box);
    options_img.setAttribute("onclick", "options(this.parentElement.id)");
    options_img.src = "https://cdn0.iconfinder.com/data/icons/round-action-bar/48/more-512.png";

}



function searched_notes_array(){
    let input_box = document.getElementById("SearchBox");
    let text = input_box.value;  //title of note searched for
    
    let titles = document.getElementsByClassName("title_tag");
    let arr_search = [];
    for (let title of titles){
        if (text == title.innerHTML){
            let note = title.parentElement;
            let cloned_note = note.cloneNode(true)
            let id = cloned_note.id;
            cloned_note.id = "0" + id;
            arr_search.push(cloned_note);
        }
    }

    return arr_search;   
}

//searching for notes
function search_func(){
    let text = document.getElementById("SearchBox").value;
    let arr_search = searched_notes_array();
    if ( (text != "") && (arr_search.length != 0) ) {
        search_note_btn.removeEventListener("click", search_func);   //disabling search button
        add_note_btn.removeEventListener("click", func1);   //disabling add_note button

        // CREATING A POPUP SEARCHED NOTES WINDOW 
        fade_bg();

        let  search_win= document.createElement("div");
        search_win.setAttribute("id", "search_popup");
        
        let cancel_img = document.createElement("img");
        cancel_img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc5XG0Nn_xR6C3kw2jPzqTnEe4phroFJhSofNfOohba7cF0bsWuGmVFzKaJ3NuYT_AXy0&usqp=CAU";
        cancel_img.setAttribute("id", "searchClose");
        cancel_img.addEventListener("click", rem_search_popup);


        for (let note of arr_search){
            search_win.appendChild(note);
        }
        search_win.appendChild(cancel_img);
        document.body.appendChild(search_win);
        alert(arr_search.length + " note(s) found!");
    }    
    
    else if((text != "") && (arr_search.length == 0)){
        alert("0 notes found!")
    }

}

//removing search popup window
function rem_search_popup(){
    search_note_btn.addEventListener("click", search_func);   //resetting search button
    add_note_btn.addEventListener("click", func1);     //renabling add_note_btn

    let  search_win = document.getElementById("search_popup");
    document.body.removeChild(search_win);
    let text = document.getElementById("SearchBox");
    text.value = "";
    
    reset_bg();
}



function on_closing_tab(){
    let notes = document.getElementById("created_notes").children;
    let Notes = {};
    for(let i of notes){
        let info = i.getElementsByTagName("p");
        Notes[i.id] = { "title" : info[0].innerHTML ,
                        "desc" : info[1].innerHTML ,
                        "create_date" : info[2].innerHTML ,
                        "update" : info[3].innerHTML          };
    }
    localStorage.setItem("notes", JSON.stringify(Notes));
}



if(localStorage !== null){
    let Notes = JSON.parse(localStorage.getItem("notes"));
    let len_notes = Object.keys(Notes).length;
    console.log(len_notes);
    for(let i = len_notes ; i >= 1 ; i-- ){
        let note = Notes[i + ""];
        add_note("storage", note["title"], note["desc"], note["create_date"], note["update"]);
    }
}

