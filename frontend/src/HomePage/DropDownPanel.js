import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import Drop from "./DropLabel";
import axios from "axios";
var flg = 0;
function DropDownPanel({ type_id, video_id, token, list }) {
    let config = {
        headers: {
            Authorization: token,
        },
    };
    const [board, setTypeData] = React.useState("");
    

    // const fetchTypes = React.useCallback(() => {
        
    // }, []);
    // React.useEffect(() => {
    //     fetchTypes();
    // }, [fetchTypes]);
    if(flg == 0)
        getSavedLabels();
    
    function getSavedLabels() {
        axios("http://127.0.0.1:8000/api/reactions", config)
            .then((response) => {
                var data = [];
                var user_labels = response.data;
                axios("http://127.0.0.1:8000/api/lebels/", config)
                    .then((response) => {
                        for (var i = 0; i < user_labels.length; i++) {
                            if (user_labels[i].type == type_id && video_id == user_labels[i].video) {
                                for (var j = 0; j < response.data.length; j++) {
                                    if (response.data[j].id == user_labels[i].lebels) {
                                        data.push({
                                            id: response.data[j].id,
                                            name: response.data[j].name,
                                            type: type_id,
                                        });
                                    }
                                }
                            }
                        }
                        setTypeData(data);
                        flg = 1;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "div",
        drop: (item) => addImageToBoard(item.id, item.name, item.type),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));
    const addImageToBoard = (id, name, type) => {
        if (type_id == type) {
            const labList = [{ id: id, name: name, type: type }];
            // board.push(labList[0]);
            // setTypeData((board) => [...board, labList[0]]);
            
            axios
                .post(
                    "http://127.0.0.1:8000/api/reactions",
                    {
                        lebel_id: id,
                        type_id: type,
                        video_id: video_id,
                    },
                    config
                )
                .then((response) => {getSavedLabels(); })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    return (
        <div className="accordian_button" ref={drop}>
            {board &&
                board.map((label) => {
                    return (
                        <Drop
                            name={label.name}
                            id={label.id}
                            type={label.type}
                            close_type={1}
                            video_id={video_id}
                            token={token}
                        />
                    );
                })}

            {/* <button type="button" className="accordian_btn active_btn">Recommended</button>
<button type="button" className="accordian_btn">Upper body sunk</button>
<button type="button" className="accordian_btn">Stride too long</button> */}
        </div>
    );
}

export default DropDownPanel;
