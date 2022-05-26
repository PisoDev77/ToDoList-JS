;(function() {
    'use strict';

    const API_URL = `http://localhost:3000/`;
    let currentPanel = undefined;
    const listview = document.querySelector("#list-view");
    const listpanelTitle = document.querySelector("#list-title");

    const fetchCall = (api,data,method) => {
        if(!data){
            fetch(api)
                .then((response) => response.json())
                .then((list) => {
                    renderList(list);
                })
                .catch((error) => console.log(error.message));
        }else{
            fetch(api,{
                method: method,
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then(() => {
                getList();
            })
            .catch((error) => console.log(error.message));
        }
        
    }

    const getList = () => {
        fetchCall(API_URL + currentPanel.title);
    };
    const addList = () => {
        const form = document.querySelector("form");
        
        const data = {
            "content" : form.content.value,
            "completed": false,
            "time": getTime(),
        }
        fetchCall(API_URL + currentPanel.title,data,"POST");
    };
    const deleteList = (id) => {
        fetchCall(API_URL + currentPanel.title + "/" + id,
        {},"DELETE");
    };
    const editList = (id) => {
        const content = document.querySelector("#editContent").value;
        fetchCall(API_URL + currentPanel.title + "/" + id,
        {"content":content},"PATCH");
    };

    const completed = (isComplete, id) => {
        if(!currentPanel.title) return;
        fetchCall(API_URL + currentPanel.title + "/" + id,
        {"completed":isComplete},
        "PATCH");
    }

    const renderList = (list) => {
        listpanelTitle.innerText = currentPanel.innerText;  
        let res = ``;
        list.forEach(i=>{
            const isCk = i.completed ? "checked" : "";
            let content = i.content;
            if(isCk){
                content = `<del>${content}</del>`;
            }
            res += `
            <section id="${i.id}" class="flexRow">
                <!-- checkbox -->
                <div>
                    <input class="completeBt" 
                    type="checkbox" 
                    name="iscomplete" 
                    ${isCk} />
                </div>
                <!-- content -->
                <div class="flexCol">
                    <div>${content}</div>
                    <div class="time">
                        <small>${i.time}</small>
                    </div>
                </div>
                <!-- edit -->
                <div>
                    <span class="editBt">EDIT</span>
                </div>
                <!-- delete -->
                <div>
                    <span class="delBt">Del</span>
                </div>
            </section>
            `;
        });
        listview.innerHTML = res;
    }   
    const initPanels = () => {
        const panels = document.querySelectorAll("#list-panels div");
        currentPanel = panels[0];
        panels.forEach(panel => {
            panel.addEventListener("click", ()=>{
                currentPanel = panel;
                getList();
                listpanelTitle.innerText = currentPanel.innerText;
            });
        });
    };
    
    let edit_temp = null;
    const editView = (mode,view) => {
        
        const confirmBt = view.querySelector("div:nth-child(3)");
        const cancelBt = view.querySelector("div:nth-child(4)");
        const inputContent = view.querySelector("div:nth-child(2) div:nth-child(1)");
        
        if(mode){
            confirmBt.innerText = "CONFIRM";
            confirmBt.className = "confirmBt";
            cancelBt.innerText = "CANCEL";
            cancelBt.className = "cancelBt";

            edit_temp = inputContent.innerText;

            inputContent.innerHTML = `<input id="editContent" 
            type="text" value="${edit_temp}" />`

        }else{
            confirmBt.innerText = "EDIT";
            confirmBt.className = "editBt";
            cancelBt.innerText = "Del";
            cancelBt.className = "delBt";

            inputContent.innerText = edit_temp;
        }
    };

    const initBt = () => {
        const addBt = document.querySelector("form input[type='submit']");
        addBt.addEventListener("click", (e)=>{
            e.preventDefault();            
            addList();
        });

        listview.addEventListener("click", (e)=>{
            const bt = e.target.className;
            const item = e.target.closest("section");
            const id = item.id;
            

            if(bt === "editBt"){
                editView(true,e.target.closest("section"));
            }else if(bt === "cancelBt"){
                editView(false,e.target.closest("section"));
            }else if(bt === "confirmBt"){
                editList(id);
            }else if(bt === "delBt"){
                deleteList(id);
            }else if(bt === "completeBt"){
                completed(e.target.checked,id);
            }else{
                
            }
        });
    };

    const getTime = () => {
        const time = new Date();
        return `
            ${time.getMonth() + 1}-${time.getDate()}
             / ${time.getFullYear()}
            ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}
        `;
    }

    const init = () => {
        window.addEventListener("DOMContentLoaded", ()=>{            
            initPanels();
            initBt();
            getList();
        });
    };
    
    init();
    
})();
