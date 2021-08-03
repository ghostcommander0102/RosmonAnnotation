import React, { useState, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Button from './component/Button/Button';
import './annotation.css';
import { Link } from 'react-router-dom';
import axios from 'axios'
import VideoTag from './VideoTag'
import { history } from '../_helpers';
const Annotation = (props) => {
    const token = localStorage.getItem('user');
    const a = JSON.parse(token);
    //  const customSeekbar = useRef(null);

    const [selectedTag, setselectedTag] = useState(-1);
    const [videoid, setvideoId] = useState(localStorage.getItem('video'));

    const [initialDrop, setinitialDrop] = useState(false);
    const [currentReportItemIndex, setcurrentReportItemIndex] = useState(-1);
    const [currentReportItemObject, setcurrentReportItemObject] = useState(null);
    //DB Data
    const [tagsData, settagsData] = useState([]);
    const [tagstypeData, settypeData] = useState([]);
    const [videoData, setvideoData] = useState([]);
    const [flg, setflg] = useState(props.flg);
    const [category, setCategory] = useState([]);
    const childRef = useRef();
    React.useEffect(() => { settagsData(tagsData); }, [tagsData]);
    React.useEffect(() => { settypeData(tagstypeData); }, [tagstypeData]);
    React.useEffect(() => { setvideoData(videoData); }, [videoData]);
    React.useEffect(() => { setflg(props.flg); }, [props.flg]);

    React.useEffect(() => { setvideoId(localStorage.getItem('video')); }, [localStorage.getItem('video')]);


    if (flg === 0)
        initDB();
    function initDB() {

        axios("http://127.0.0.1:8000/api/lebels/",
            {
                headers: {
                    'Authorization': `token ${a.token}`
                }
            })
            .then((response) => {
                settagsData(response.data)
                var data = [];
                for (var i = 0; i < response.data.length; i++) {
                    data.push({ value: response.data[i].id, label: response.data[i].name, type: response.data[i].type });
                }
                setCategory(data);
                setflg(1);
                // console.log(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
        axios("http://127.0.0.1:8000/api/lebel_types/",
            {
                headers: {
                    'Authorization': `token ${a.token}`
                }
            })
            .then((response) => {
                settypeData(response.data);

                // console.log(response.data)
            })
            .catch((error) => {
                console.log(error)
            })

        axios("http://127.0.0.1:8000/api/video/",
            {
                headers: {
                    'Authorization': `token ${a.token}`
                }
            })
            .then((response) => {
                setvideoData(response.data)
                // console.log(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }



    const toggleSelected = (id) => {
        const index = tagsData.findIndex(item => item.id === id);
        if (index !== -1) {
            setselectedTag(index);
        }
    }
    return (
        <Container fluid="xs">
            <div className="alert_top">
                <h4>Labeltool - tediro GmbH</h4>
                <div className="profile_main">
                    <p></p>
                    <Link to="/login" onClick={() => { document.location.href = "/login" }}>Logout</Link>
                    <Link to="/VideoList" onClick={() => { document.location.href = "/VideoList" }} style={{ right: "100px" }}>VideoList</Link>
                </div>
            </div>
            <Row className="rowContainer">
                <Col style={{ paddingLeft: 0, paddingRight: 0 }} xs={12} md={3}>
                    <div className="leftContainer">
                        {tagsData && tagsData.map((t, i) => (
                            <div
                                key={i}
                                draggable
                                onMouseEnter={() => {
                                    setinitialDrop(true);
                                    setcurrentReportItemObject(t);
                                    setcurrentReportItemIndex(i);
                                }}
                                style={{ margin: 10, borderRadius: 3, backgroundColor: i === selectedTag ? "#7cac16" : "#0a5466" }}
                                onMouseLeave={() => setinitialDrop(false)}
                            >
                                <Button
                                    title={t.name}
                                    icon
                                    textMarginLeft={10}
                                    backgroundColor="transparent"
                                    onClick={() => toggleSelected(t.id)}
                                />
                            </div>
                        ))}
                    </div>
                </Col>
                <Col style={{ paddingLeft: 0, paddingRight: 0 }} xs={12} md={8}>
                    {videoData && videoData.map((video, index) => {
                        return (video.id == videoid && <VideoTag videodata={video} tagsData={tagsData} tagstypeData={tagstypeData} initialDrop={initialDrop} currentReportItemIndex={currentReportItemIndex} currentReportItemObject={currentReportItemObject} token={`token ${a.token}`} flg={0} category={category} ref={childRef} />)
                    })}

                </Col>
                <Col style={{ paddingLeft: 0, paddingRight: 0 }} xs={12} md={1} />
            </Row>
            <div className="context hidden">
                <div className="context_item" onClick={() => {
                    childRef.current.changeCategory();
                }}>
                    <div className="inner_item">
                        Change Label
                    </div>
                </div>
                <div className="context_item" onClick={() => { childRef.current.openModal1() }}>
                    <div className="inner_item">
                        Delete Label
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default Annotation;
