;(function() {
    'use strict';

    const API_URL = `http://localhost:3000/`;
    let currentPanel = undefined;
    const listview = document.querySelector("#list-view");

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
    }

    const addList = (data) => {
        fetchCall(API_URL + currentPanel.title,data,"POST");
    }

    const deleteList = (id) => {
        fetchCall(API_URL + currentPanel.title + "/" + id,
        {},"DELETE");
    }

    const completed = (isComplete, id) => {
        if(!currentPanel.title) return;
        fetchCall(API_URL + currentPanel.title + "/" + id,
        {"completed":isComplete},
        "PATCH");
    }

    const renderList = (list) => {
        
        let res = '';
        list.forEach(i=>{
            const isCk = i.completed ? "checked" : "";
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
                <div>${i.content}</div>
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
            });
        });
    };
    const initBt = () => {
        const addBt = document.querySelector("form input[type='submit']");
        addBt.addEventListener("click", (e)=>{
            e.preventDefault();
            const form = document.querySelector("form");
            const data = {
                "content" : form.content.value,
                "completed": false,
            }            
            addList(data);
        });

        listview.addEventListener("click", (e)=>{
            const bt = e.target.className;
            const id = e.target.closest("section").id;

            if(bt === "editBt"){
                console.log("EDIT");
            }else if(bt === "delBt"){
                deleteList(id);
            }else if(bt === "completeBt"){
                completed(e.target.checked,id);
            }else{
                console.log(bt);
            }
        });
    };

    const init = () => {
        window.addEventListener("DOMContentLoaded", ()=>{            
            initPanels();
            initBt();
            getList();
        });
    };
    
    init();
    
})();
