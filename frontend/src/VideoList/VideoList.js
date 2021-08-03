import React, { useState, useEffect } from "react";
import ReactPlayer from 'react-player'
import axios from 'axios'
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { history } from '../_helpers';
import filmicon from '../film.png';
import uploadicon from '../upload.png';
import Modal from 'react-modal'
// const LabelList = [];
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
function VideoList(props) {
	const token = localStorage.getItem('user');
	const a = JSON.parse(token);
	const [flg, setflg] = useState(props.flg);
	const [finishflg, setFinishFlg] = useState([]);
	const [videoData, setvideoData] = useState([]);
	const [donevideoData, setDoneVideoData] = useState([]);
	const [undonevideoData, setUnDoneVideoData] = useState([]);
	const [modalIsOpen, setIsOpen] = React.useState(false);
	const [videoitem, setVideoItem] = React.useState(0);
	function closeModal() {
        setIsOpen(false);
    }
	React.useEffect(() => { setflg(props.flg); }, [props.flg]);
	if (flg === 0) {
		getVideoData();
	}
	function getVideoData() {
		axios("http://127.0.0.1:8000/api/video/",
			{
				headers: {
					'Authorization': `token ${a.token}`
				}
			})
			.then((response) => {
				setvideoData(response.data);
				setflg(1);
				// console.log(response.data)
			})
			.catch((error) => {
				console.log(error)
			})
		axios("http://127.0.0.1:8000/api/reactions", {
			headers: {
				'Authorization': `token ${a.token}`
			}
		})
			.then((response) => {
				var user_labels = response.data;
				var data = [...videoData];
				for (var i = 0; i < user_labels.length; i++) {
					for (var j = 0; j < videoData.length; j++){
						if (user_labels[i].video == videoData[j].id) {
							data[j].finishflg = user_labels[i].finish_flg;
						}
					}
				}
				var data1 = [], data2 = [];
				for (var i = 0; i < data.length; i++){
					if (data[i].finishflg == 0) {
						data2.push(data[i]);
					} else {
						data1.push(data[i]);
					}
				}
				setDoneVideoData(data1);
				setUnDoneVideoData(data2);
			})
			.catch((error) => {
				console.log(error);
			});
	}
	function VideoClick(e) {
		alert(e.target.parentNode.getAttribute("videoid"));
		localStorage.setItem('video', e.target.parentNode.getAttribute("videoid"));
		history.push("/");
		// alert(id);
	}
	function openModal(e) {
		setVideoItem(e.target.parentNode.getAttribute("videoid"));
        setIsOpen(true);
    }
	function clickClose() {
        var config = {
			headers: {
				Authorization: `token ${a.token}`,
			},
		};
		axios
			.post(
				"http://127.0.0.1:8000/api/finishReaction",
				{
					video_id: videoitem,
					finish_flg: 1
				},
				config
			)
			.then((response) => { getVideoData();})
			.catch((error) => {
				console.log(error);
			});
		setIsOpen(false);
    }
	return (
		<Container fluid="xs">
			<div className="alert_top">
				<h4>Labeltool - tediro GmbH</h4>

				<div className="profile_main">
					<p></p>
					<Link to="/login">Logout</Link>
				</div>

			</div>
			<h3 style={{marginLeft:"50px"}}>Meine Videos(My Videos)</h3>
			<div className="videoList">
				{
					undonevideoData && undonevideoData.map((video, index) => {
						return (
							<div className="video_Item">
								<h4>{video.caption}</h4>
								<div videoid={video.id}>
									<div className="icon-group" videoid={video.id} onClick={openModal}>
										<i className="bi bi-check-circle-fill film-icons"></i>
										<div>AbschileBen</div>
									</div>
									<div className="icon-group" onClick={VideoClick} videoid={video.id}>
										<img className="film-icons" src={ filmicon } />
										<div>Annotieren</div>
									</div>
									
								</div>
							</div>
						)
					})
				}
			</div>
			<h3 style={{marginLeft:"50px"}}>Bereits abgeschlossen(Done Videos)</h3>
			<div className="videoList">
				{
					donevideoData && donevideoData.map((video, index) => {
						return (
							<div className="video_Item">
								<h4>{video.caption}</h4>
								<div videoid={video.id}>
									<div className="icon-group">
										<img className="film-icons" src={ uploadicon } />
										<div>AbschileBen</div>
									</div>
									<div className="icon-group  disabled" onClick={VideoClick} videoid={video.id}>
										<img className="film-icons" src={ filmicon } />
										<div>Annotieren</div>
									</div>
									
								</div>
							</div>
						)
					})
				}
			</div>
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				style={customStyles}
				contentLabel="Example Modal">
				<h2>Do you want Done?</h2> 
				<div className="delete_group">
					<button className="btn btn-primary" onClick={clickClose}>Yes</button>
					<button className="btn btn-danger" onClick={closeModal}>No</button>
				</div>
			</Modal>
		</Container >
	);
}

export default VideoList;
