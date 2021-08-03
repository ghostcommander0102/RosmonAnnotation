import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import Button from './component/Button/Button';
import './annotation.css';
import ReactPlayer from 'react-player/lazy';
import { ScaleLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faRedo, faVolumeOff, faFolderOpen, faStepForward, faPauseCircle, faStepBackward, faPlayCircle, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { Resizable } from "re-resizable";
import axios from 'axios';
import Modal from 'react-modal'
import Select from 'react-select';
import checkImg from '../check1.png';
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999
    },
};

const VideoTag = forwardRef((props, childRef) => {
    const vidRef = useRef(null);
    const [resize_flg, setResizeflg] = React.useState(0);
    const [resize_left, setResizeLeft] = React.useState(0);
    const [resize_width, setResizeWidth] = React.useState(0);
    //modal
    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [cetegoryerror, setCategoryError] = useState(false);
    const [modalIsOpen1, setIsOpen1] = React.useState(false);
    const [categoryId, setCategoryId] = useState(0);
    const [contextid, setContextId] = React.useState(0);
    const [changeflg, setChangeFlg] = useState(0);
    const [category, setCategory] = useState([props.category]);
    const [categoryValue, setCategoryValue] = useState(0);
    const [typecategory, setTypeCategory] = useState([]);
    useImperativeHandle(childRef, () => ({

        openModal1() {
            if (finish_flg) return;
            setIsOpen1(true);
        },
        changeCategory() {
            if (finish_flg) return;
            setCategoryId(contextid);
            setChangeFlg(1);
            openModal();
        }

    }));
    const [video_flg, setflg] = React.useState(props.flg);
    const [finish_flg, setFinishFlag] = useState(0);
    const [mouseClickPos, setMouseClickPos] = React.useState(0);
    const [videoPlaying, setvideoPlaying] = useState(false);
    const [muted, setmuted] = useState(true);
    const [isBuffering, setisBuffering] = useState(false);
    const [isError, setisError] = useState(false);
    const [seekTime, setseekTime] = useState(0);
    const [duration, setduration] = useState(0);
    const volumeRef = useRef(null);
    const [videoVolume, setVolume] = useState(1);
    const trackerRef = useRef(null);

    const [initialDrop, setinitialDrop] = React.useState(true);
    const [draggable, setDraggable] = useState(true);
    const [shouldScroll, setshouldScroll] = useState(false)
    const [currentReportItem, setcurrentReportItem] = useState([])
    const [currentReportItemIndex, setcurrentReportItemIndex] = React.useState(props.currentReportItemIndex);
    const [currentReportItemObject, setcurrentReportItemObject] = React.useState(props.currentReportItemObject);
    //DB Data
    const [tagsData, settagsData] = React.useState(props.tagsData);
    const [tagstypeData, settypeData] = React.useState(props.tagstypeData);
    //React.useEffect(() => { setinitialDrop(props.initialDrop); }, [props.initialDrop]);
    React.useEffect(() => { setcurrentReportItemIndex(props.currentReportItemIndex); }, [props.currentReportItemIndex]);
    React.useEffect(() => { setcurrentReportItemObject(props.currentReportItemObject); }, [props.currentReportItemObject]);
    React.useEffect(() => { settagsData(props.tagsData); }, [props.tagsData]);
    React.useEffect(() => { settypeData(props.tagstypeData); }, [props.tagstypeData]);
    React.useEffect(() => { setflg(props.flg); }, [props.flg]);
    React.useEffect(() => { setCategory(props.category); }, [props.category]);
    React.useEffect(() => { setcurrentReportItem(currentReportItem) }, [currentReportItem]);
    var config = {
        headers: {
            Authorization: props.token,
        },
    };
    // if (video_flg === 0) {
    //     getSavedLabels();
    // }
    const secPixel = 50;

    const formatTime = (timeInSeconds) => {
        const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

        return {
            minutes: result.substr(3, 2),
            seconds: result.substr(6, 2),
        };
    }
    //finish modal
    function closeModal1() {
        setIsOpen1(false);
    }
    function clickClose1() {
        closeModal1();
        document.getElementsByClassName("reportButton" + contextid)[0].classList.add("hidden");
        var tempitem;
        for (var i = 0; i < currentReportItem.length; i++) {
            if (currentReportItem[i].id == contextid) {
                tempitem = currentReportItem[i];
                break;
            }
        }
        axios
            .delete("http://127.0.0.1:8000/api/reactions", {
                headers: {
                    Authorization: props.token
                },
                data: {
                    video_id: tempitem.video,
                    lebel_id: tempitem.lebels,
                    type: tempitem.type
                }
            })
            .then((response) => { })
            .catch((error) => {
                console.log(error);
            });
    }
    function openModal() {
        var categorytemp = [];
        var catetype = 0;
        for (var i = 0; i < currentReportItem.length; i++) {
            if (currentReportItem[i].id == contextid) {
                catetype = currentReportItem[i].type;
            }
        }
        for (var i = 0; i < category.length; i++) {
            if (category[i].type == catetype) {
                categorytemp.push({ value: category[i].value, label: category[i].label });
            }
        }
        setTypeCategory(categorytemp);
        setIsOpen(true);
    }
    function closeModal() {
        setCategoryError(false);
        setChangeFlg(0);
        setIsOpen(false);
    }
    function clickClose() {
        if (changeflg === 1) {
            var typeid;
            for (var i = 0; i < tagsData.length; i++) {
                if (tagsData[i].id === categoryValue) {
                    typeid = tagsData[i].type;
                    break;
                }
            }

            axios
                .put(
                    "http://127.0.0.1:8000/api/finishReaction",
                    {
                        id: categoryId,
                        label_id: categoryValue,
                        type_id: typeid,
                        video_id: props.videodata.id
                    },
                    config
                )
                .then((response) => {
                    var data = response.data;
                    if (data.error == "") {
                        closeModal();
                        getSavedLabels(duration);
                    }
                    else {
                        setCategoryError(true);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            closeModal();
            var finish;
            if (finish_flg === 0) finish = 1;
            else finish = 0;
            axios
                .post(
                    "http://127.0.0.1:8000/api/finishReaction",
                    {
                        video_id: props.videodata.id,
                        finish_flg: finish
                    },
                    config
                )
                .then((response) => { setFinishFlag(finish) })
                .catch((error) => {
                    console.log(error);
                });
        }
    }
    function getSavedLabels(dur) {
        axios("http://127.0.0.1:8000/api/reactions", config)
            .then((response) => {
                setflg(1);
                var relativeLength = document.getElementsByClassName("reportContainer")[0].clientWidth;
                var data = [];
                var user_labels = response.data;
                for (var i = 0; i < user_labels.length; i++) {
                    if (user_labels[i].video === props.videodata.id) {
                        if (user_labels[i].finish_flg === 1) setFinishFlag(1);
                        else setFinishFlag(0);
                        for (var j = 0; j < tagsData.length; j++) {
                            if (tagsData[j].id === user_labels[i].lebels) {
                                var typecnt = 0;
                                for (var k = 0; k < tagstypeData.length; k++) {
                                    if (tagstypeData[k].id == user_labels[i].type) {
                                        typecnt = k;
                                        break;
                                    }
                                }
                                user_labels[i].top = typecnt * 50 + 10;
                                user_labels[i].left = parseFloat(user_labels[i].startTime) * relativeLength / dur;
                                user_labels[i].width = parseFloat(user_labels[i].endTime) * relativeLength / dur - user_labels[i].left;
                                user_labels[i].name = tagsData[j].name;
                                data.push(user_labels[i]);
                            }
                        }

                    }
                }
                setcurrentReportItem(data);

            })
            .catch((error) => {
                console.log(error);
            });
    }
    const playVideo = () => {
        setvideoPlaying(true);
    }

    const pauseVideo = () => {
        setvideoPlaying(false)
    }
    const onDurationHandler = d => {
        setduration(d)
        if (video_flg === 0) {
            document.addEventListener("click", function (event) {
                event.preventDefault();
                document.getElementsByClassName("context")[0].classList.add('hidden');
                // For the button, context menu settings begins from here:
            }, true);
            getSavedLabels(d);
        }
    }

    const onEndedHandler = () => {
        setseekTime(Math.ceil(duration));
        setvideoPlaying(false)
    }

    const videoErrorHandler = e => {

        setisError(true);
    }
    const onProgressHandler = (e) => {
        if (e.played !== 1) {
            //     setSeekTimeHandler(e.played * 100); <--- for custom div
            setSeekTimeHandler(e.playedSeconds);
        }
    }
    const setSeekTimeHandler = (time) => {
        setseekTime(time)
    }
    function showContextMenu(event) {
        event.preventDefault();
        document.getElementsByClassName("context")[0].classList.remove("hidden");
        document.getElementsByClassName("context")[0].style.top = event.pageY + "px";
        document.getElementsByClassName("context")[0].style.left = event.pageX + "px";
    }

    const handleDrop = async e => {
        if (finish_flg) return;
        e.preventDefault();
        e.stopPropagation();
        if (e.target.className === "seek") {
            const bounds = e.target.getBoundingClientRect();
            const offsetX = Number(e.nativeEvent.clientX - bounds.left - mouseClickPos).toFixed(2);
            const updatedItem = [...currentReportItem];
            console.log(e);

            if (initialDrop) {
                updateCurrentReportItemHandler(offsetX, parseInt(e.target.id) * 50 + 10);
            } else if (!initialDrop) {
                setinitialDrop(true);
                if (currentReportItemIndex == -1) {

                    return;
                }

                var updateleft = parseFloat(offsetX > e.target.clientWidth ? e.target.clientWidth - 35 : offsetX);
                var updatewidth = updatedItem[currentReportItemIndex].width === 0 ? secPixel : updatedItem[currentReportItemIndex].width;
                for (var i = 0; i < updatedItem.length; i++) {
                    if (i !== currentReportItemIndex && updatedItem[i].type === updatedItem[currentReportItemIndex].type) {
                        var tempwidth = updatedItem[i].width === 0 ? secPixel : updatedItem[i].width;
                        if (updatedItem[i].left <= updateleft && updateleft <= (updatedItem[i].left + tempwidth)) {
                            return;
                        } else if (updatedItem[i].left >= updateleft && updatedItem[i].left <= (updateleft + updatewidth)) {
                            return;
                        }
                    }
                }
                updatedItem[currentReportItemIndex].left = offsetX > e.target.clientWidth ? e.target.clientWidth - 35 : offsetX;
                if (parseFloat(updatedItem[currentReportItemIndex].left) < 0) {
                    updatedItem[currentReportItemIndex].left = 0;
                    updatedItem[currentReportItemIndex].width -= Math.abs(updatedItem[currentReportItemIndex].left);
                }
                if ((updatedItem[currentReportItemIndex].left + updatedItem[currentReportItemIndex].width) > document.getElementsByClassName("reportContainer")[0].clientWidth) {
                    updatedItem[currentReportItemIndex].width = document.getElementsByClassName("reportContainer")[0].clientWidth - updatedItem[currentReportItemIndex].left;
                }
                // for (let i = 0; i < updatedItem.length; i++) {
                //     if (updatedItem[i].top <= updatedItem[currentReportItemIndex].top + 35) {
                //         updatedItem[currentReportItemIndex].top = updatedItem[i].top
                //     }
                //     // if ((updatedItem[i].left <= updatedItem[currentReportItemIndex].left + 100)) {
                //     //     updatedItem[currentReportItemIndex].left = updatedItem[currentReportItemIndex].left + 200
                //     // }
                // }
                axios
                    .put(
                        "http://127.0.0.1:8000/api/reactions",
                        {
                            id: updatedItem[currentReportItemIndex].id,
                            startTime: Number(updatedItem[currentReportItemIndex].left) * duration / e.target.clientWidth,
                            endTime: (Number(updatedItem[currentReportItemIndex].left) + Number(updatedItem[currentReportItemIndex].width === 0 ? secPixel : updatedItem[currentReportItemIndex].width)) * duration / e.target.clientWidth

                        },
                        config
                    )
                    .then((response) => { })
                    .catch((error) => {
                        console.log(error);
                    });
                setcurrentReportItem(updatedItem);
            }
        }
    };

    const updateCurrentReportItemHandler = async (offsetX, offsetY) => {
        offsetX = parseFloat(offsetX);
        for (var i = 0; i < currentReportItem.length; i++) {
            if (currentReportItem[i].type === currentReportItemObject.type) {
                var tempwidth = currentReportItem[i].width === 0 ? secPixel : currentReportItem[i].width;
                if (currentReportItem[i].left <= offsetX && offsetX <= (currentReportItem[i].left + tempwidth)) {
                    return;
                } else if (currentReportItem[i].left >= offsetX && currentReportItem[i].left <= (offsetX + secPixel)) {
                    return;
                }
            }
        }
        for (var i = 0; i < tagstypeData.length; i++) {
            if (currentReportItemObject.type === tagstypeData[i].id) {
                offsetY = 50 * i + 10;
                break;
            }
        }
        let currentItem = {
            name: '',
            id: 0,
            top: 0,
            left: 0,
            width: 0,
            height: 0
        };
        //  currentItem = currentReportItemObject;
        //console.log('currentReportItemObject', currentReportItemObject)
        var relativeLength = document.getElementsByClassName("reportContainer")[0].clientWidth;
        currentItem.name = currentReportItemObject.name;
        currentItem.id = currentReportItemObject.id;
        currentItem.top = offsetY;
        currentItem.left = offsetX > relativeLength ? relativeLength : offsetX;
        currentItem.width = 0;
        currentItem.height = 0;
        axios
            .post(
                "http://127.0.0.1:8000/api/reactions",
                {
                    lebel_id: currentItem.id,
                    type_id: currentReportItemObject.type,
                    video_id: props.videodata.id,
                    startTime: Number(currentItem.left) * duration / relativeLength,
                    endTime: (Number(currentItem.left) + Number(secPixel)) * duration / relativeLength
                },
                config
            )
            .then((response) => { getSavedLabels(duration); })
            .catch((error) => {
                console.log(error);
            });
        // const lastCurrentReportItems = [...currentReportItem];
        // lastCurrentReportItems.push(currentItem);
        // setcurrentReportItem(lastCurrentReportItems);
        // getSavedLabels();
        setinitialDrop(true);
    }


    const handleDragOver = e => {
        e.preventDefault();
        e.stopPropagation();
    };


    return (
        <div className="rightContainer">
            <div className="innerContainer">

                <div className="videoContainer">
                    {!isError ?
                        <div className="videoItem">
                            <ReactPlayer
                                ref={vidRef}
                                muted={muted}
                                volume={videoVolume}
                                playing={videoPlaying}
                                onPlay={() => setisError(false)}
                                onStart={() => setseekTime(0)}
                                onError={e => videoErrorHandler(e)}
                                onDuration={e => onDurationHandler(e)}
                                onProgress={e => onProgressHandler(e)}
                                onBuffer={() => setisBuffering(true)}
                                onBufferEnd={() => setisBuffering(false)}
                                onEnded={onEndedHandler}
                                url={`http://localhost:8000${props.videodata.video}`}
                            />

                            <div className={(finish_flg == 1 ? "" : "hidden") + " checkImg"} >
                                <img src={checkImg} alt="" />
                            </div>
                        </div>
                        :
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', width: 500, height: 300, border: "1px solid lightgrey" }}>
                            <p>Error Playing Video</p>
                        </div>

                    }
                    {isBuffering &&
                        <div className="buffering">
                            <ScaleLoader
                                loading={isBuffering}
                                color="white"
                                speedMultiplier={1}
                                height={15}
                            />
                        </div>
                    }
                    <div className="bottom-controls">
                        <div className="left-controls">
                            <button data-title={videoPlaying ? "Pause" : "Play"} id="play" onClick={() => videoPlaying ? pauseVideo() : playVideo()}>
                                <svg className="playback-icons">
                                    <use href="#play-icon" className={videoPlaying ? "hidden" : ""}></use>
                                    <use className={videoPlaying ? "" : "hidden"} href="#pause"></use>
                                </svg>
                            </button>

                            <div className="volume-controls">
                                <button data-title="Mute" className="volume-button" id="volume-button" onClick={() => setmuted(!muted)}>
                                    <svg>
                                        <use className={muted ? "" : "hidden"} href="#volume-mute"></use>
                                        <use className="hidden" href="#volume-low"></use>
                                        <use href="#volume-high"></use>
                                    </svg>
                                </button>

                                <input ref={volumeRef} className="volume" id="volume" value={muted ? 0 : videoVolume} type="range" max="1" min="0" step="0.01" onChange={() => {
                                    setmuted(false);
                                    setVolume(volumeRef.current.value);
                                }} />
                            </div>

                            <div className="time">
                                <time id="time-elapsed">{formatTime(seekTime).minutes + ":" + formatTime(seekTime).seconds}</time>
                                <span> / </span>
                                <time id="duration">{formatTime(duration).minutes + ":" + formatTime(duration).seconds}</time>
                            </div>
                        </div>

                        <div className="right-controls">
                            <button className="btn btn-primary" onClick={openModal}>Done&nbsp;{finish_flg == 1 && <i className="bi-check-lg"></i>}</button>
                        </div>
                    </div>
                </div>

            </div>
            <div
                className="reportContainer"
                style={{ overflow: "hidden" }}
            >
                <input
                    type="range"
                    ref={trackerRef}
                    id="seek"
                    className="seek"
                    onDrop={e => handleDrop(e)}
                    onDragOver={e => handleDragOver(e)}
                    onChange={() => {
                        let seekto = trackerRef.current.value;
                        vidRef.current.seekTo(seekto, "seconds");
                    }}
                    min={0}
                    value={seekTime}
                    max={Math.ceil(duration)}
                />
                <div>
                    {currentReportItem && currentReportItem.map((c, i) => {
                        return (
                            <div
                                onContextMenu={event => {
                                    setContextId(c.id);
                                    showContextMenu(event);
                                }}
                                key={i}
                                draggable={draggable}
                                className={"reportButton reportButton" + c.id}
                                style={{ borderRadius: 3, backgroundColor: "#0a5466", top: `${c.top}px` || 10, left: `${c.left}px` || 10 }}
                                onMouseDown={(event) => {
                                    setinitialDrop(false);
                                    setMouseClickPos(event.pageX - document.getElementsByClassName("reportButton" + c.id)[0].getBoundingClientRect().x);
                                    if (currentReportItemIndex !== i) {
                                        setcurrentReportItemIndex(i)
                                    }
                                }}

                            >
                                <Resizable
                                    size={{ width: c.width === 0 ? secPixel : c.width, height: "fit-content" }}
                                    onResize={(e, direction, ref, d) => {
                                        if (finish_flg) return;
                                        const updatedItem = [...currentReportItem];
                                        if (resize_flg === 0) {
                                            setResizeflg(1);
                                            setResizeLeft(updatedItem[currentReportItemIndex].left);
                                            setResizeWidth(updatedItem[currentReportItemIndex].width);
                                        }
                                        if ((direction === "left" || direction === "topLeft" || direction === "bottomLeft") && resize_left !== 0) {
                                            updatedItem[currentReportItemIndex].left = resize_left - d.width;
                                        }
                                        const width = resize_width + d.width;
                                        updatedItem[currentReportItemIndex].width = width;
                                        setcurrentReportItem(updatedItem);
                                    }}
                                    onResizeStop={(e, direction, ref, d) => {
                                        if (finish_flg) return;
                                        const updatedItem = [...currentReportItem];
                                        setResizeflg(0);
                                        setResizeLeft(0);
                                        setResizeWidth(0);
                                        var updatewidth = updatedItem[currentReportItemIndex].width === 0 ? secPixel : updatedItem[currentReportItemIndex].width;
                                        for (var i = 0; i < currentReportItem.length; i++) {
                                            if (i !== currentReportItemIndex && currentReportItem[i].type === updatedItem[currentReportItemIndex].type) {
                                                var tempwidth = currentReportItem[i].width === 0 ? secPixel : currentReportItem[i].width;
                                                if (currentReportItem[i].left <= updatedItem[currentReportItemIndex].left && updatedItem[currentReportItemIndex].left <= (currentReportItem[i].left + tempwidth)) {
                                                    updatedItem[currentReportItemIndex].width -= currentReportItem[i].left + currentReportItem[i].width - currentReportItem[currentReportItemIndex].left - 2;
                                                    updatedItem[currentReportItemIndex].left = currentReportItem[i].left + currentReportItem[i].width + 2;
                                                } else if (currentReportItem[i].left >= updatedItem[currentReportItemIndex].left && currentReportItem[i].left <= (updatedItem[currentReportItemIndex].left + updatewidth)) {
                                                    if (direction === "left" || direction === "topLeft" || direction === "bottomLeft") {
                                                        updatedItem[currentReportItemIndex].width -= currentReportItem[i].left + currentReportItem[i].width - currentReportItem[currentReportItemIndex].left - 2;
                                                        updatedItem[currentReportItemIndex].left = currentReportItem[i].left + currentReportItem[i].width + 2;
                                                    } else {
                                                        updatedItem[currentReportItemIndex].width = updatedItem[i].left - updatedItem[currentReportItemIndex].left - 2;
                                                    }
                                                }
                                            }
                                        }
                                        if (parseFloat(updatedItem[currentReportItemIndex].left) < 0) {
                                            updatedItem[currentReportItemIndex].left = 0;
                                            updatedItem[currentReportItemIndex].width -= Math.abs(updatedItem[currentReportItemIndex].left);
                                        }
                                        if ((updatedItem[currentReportItemIndex].left + updatedItem[currentReportItemIndex].width) > document.getElementsByClassName("reportContainer")[0].clientWidth) {
                                            updatedItem[currentReportItemIndex].width = document.getElementsByClassName("reportContainer")[0].clientWidth - updatedItem[currentReportItemIndex].left;
                                        }
                                        axios
                                            .put(
                                                "http://127.0.0.1:8000/api/reactions",
                                                {
                                                    id: updatedItem[currentReportItemIndex].id,

                                                    startTime: Number(updatedItem[currentReportItemIndex].left) * duration / document.getElementsByClassName("reportContainer")[0].clientWidth,
                                                    endTime: (Number(updatedItem[currentReportItemIndex].left) + Number(updatedItem[currentReportItemIndex].width === 0 ? secPixel : updatedItem[currentReportItemIndex].width)) * duration / document.getElementsByClassName("reportContainer")[0].clientWidth
                                                },
                                                config
                                            )
                                            .then((response) => { })
                                            .catch((error) => {
                                                console.log(error);
                                            });
                                        setcurrentReportItem(updatedItem);
                                        setDraggable(true)
                                    }}
                                    draggable={false}
                                    minHeight={35}
                                    maxHeight={35}
                                    onResizeStart={() => {
                                        setDraggable(false);
                                    }}
                                >
                                    <Button
                                        title={c.name}
                                        id={c.lebels}
                                        index={c.id}
                                        token={props.token}
                                        type={c.type}
                                        video_id={props.videodata.id}
                                        backgroundColor="transparent"
                                        width="fit-content"
                                        height="fit-content"
                                        textAlign="center"
                                    />
                                </Resizable>
                            </div>
                        )
                    })
                    }
                </div>

            </div>
            <div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal">
                    {changeflg === 0 ? <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Do you want {finish_flg ? "Edit" : "Done"}?</h2> : <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Select Label Name</h2>}
                    {
                        changeflg === 1 ? <div style={{ marginTop: "20px" }}><Select options={typecategory} onChange={(e) => setCategoryValue(e.value)}></Select></div> : ""
                    }

                    <div style={{ marginTop: "20px", marginBottom: "100px" }}>{cetegoryerror && <h3 className="text-danger">Same Label Exist</h3>}</div>

                    <div className="delete_group">
                        <button className="btn btn-primary" onClick={clickClose}>Yes</button>
                        <button className="btn btn-danger" onClick={closeModal}>No</button>
                    </div>
                </Modal>
            </div>
            <div>
                <Modal
                    isOpen={modalIsOpen1}
                    onRequestClose={closeModal1}
                    style={customStyles}
                    contentLabel="Example Modal">
                    <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Do you want to remove label?</h2>
                    <div className="delete_group">
                        <button className="btn btn-primary" onClick={clickClose1}>Yes</button>
                        <button className="btn btn-danger" onClick={closeModal1}>No</button>
                    </div>
                </Modal>
            </div>
            <svg style={{ display: "none" }}>
                <defs>
                    <symbol id="pause" viewBox="0 0 24 24">
                        <path d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"></path>
                    </symbol>

                    <symbol id="play-icon" viewBox="0 0 24 24">
                        <path d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"></path>
                    </symbol>

                    <symbol id="volume-high" viewBox="0 0 24 24">
                        <path d="M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q1.031 0.516 1.758 1.688t0.727 2.344zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z"></path>
                    </symbol>

                    <symbol id="volume-low" viewBox="0 0 24 24">
                        <path d="M5.016 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6zM18.516 12q0 2.766-2.531 4.031v-8.063q1.031 0.516 1.781 1.711t0.75 2.32z"></path>
                    </symbol>

                    <symbol id="volume-mute" viewBox="0 0 24 24">
                        <path d="M12 3.984v4.219l-2.109-2.109zM4.266 3l16.734 16.734-1.266 1.266-2.063-2.063q-1.547 1.313-3.656 1.828v-2.063q1.172-0.328 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016h-3.984v-6h4.734l-4.734-4.734zM18.984 12q0-2.391-1.383-4.219t-3.586-2.484v-2.063q3.047 0.656 5.016 3.117t1.969 5.648q0 2.203-1.031 4.172l-1.5-1.547q0.516-1.266 0.516-2.625zM16.5 12q0 0.422-0.047 0.609l-2.438-2.438v-2.203q1.031 0.516 1.758 1.688t0.727 2.344z"></path>
                    </symbol>

                    <symbol id="fullscreen" viewBox="0 0 24 24">
                        <path d="M14.016 5.016h4.969v4.969h-1.969v-3h-3v-1.969zM17.016 17.016v-3h1.969v4.969h-4.969v-1.969h3zM5.016 9.984v-4.969h4.969v1.969h-3v3h-1.969zM6.984 14.016v3h3v1.969h-4.969v-4.969h1.969z"></path>
                    </symbol>

                    <symbol id="fullscreen-exit" viewBox="0 0 24 24">
                        <path d="M15.984 8.016h3v1.969h-4.969v-4.969h1.969v3zM14.016 18.984v-4.969h4.969v1.969h-3v3h-1.969zM8.016 8.016v-3h1.969v4.969h-4.969v-1.969h3zM5.016 15.984v-1.969h4.969v4.969h-1.969v-3h-3z"></path>
                    </symbol>

                    <symbol id="pip" viewBox="0 0 24 24">
                        <path d="M21 19.031v-14.063h-18v14.063h18zM23.016 18.984q0 0.797-0.609 1.406t-1.406 0.609h-18q-0.797 0-1.406-0.609t-0.609-1.406v-14.016q0-0.797 0.609-1.383t1.406-0.586h18q0.797 0 1.406 0.586t0.609 1.383v14.016zM18.984 11.016v6h-7.969v-6h7.969z"></path>
                    </symbol>
                </defs>
            </svg>
        </div>
    )
});
export default VideoTag;
