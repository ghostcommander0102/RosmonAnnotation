import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import axios from "axios";
import Modal from 'react-modal'

const customStyles = {
	content: {
	  top: '50%',
	  left: '50%',
	  right: 'auto',
	  bottom: 'auto',
	  marginRight: '-50%',
	  transform: 'translate(-50%, -50%)',
	},
  };
function Drop({ id, name, type, close_type, video_id, token }) {
	const [show_flg, setFlag] = React.useState("");
	let subtitle;
	const [modalIsOpen, setIsOpen] = React.useState(false);
	const [{ isDragging }, drag] = useDrag(() => ({
		type: "div",
		item: { id: id, name: name, type: type },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));
	

	function openModal() {
		setIsOpen(true);
	}

	function closeModal() {
		setIsOpen(false);
	}
	function clickClose() {
		closeModal();
		setFlag("hidden");
		let config = {
			headers: {
				Authorization: token,
			},
			data: {
				lebel_id: id,
				type: type,
				video_id: video_id,
			},
		};
		axios
			.delete("http://127.0.0.1:8000/api/reactions", config)
			.then((response) => { })
			.catch((error) => {
				console.log(error);
			});
	}
	return (
		<div className={"sidetag " + show_flg} ref={drag}>
			<p className={close_type == 1 ? "text-center":""}>
				{name}
				{close_type == 0 &&
				<i className="fa fa-question-circle" aria-hidden="true"></i>}
				{close_type == 1 && (
					<i className="bi-x close_btn" onClick={openModal}></i>
				)}
			</p>
			<div>
				<Modal
					isOpen={modalIsOpen}
					onRequestClose={closeModal}
					style={customStyles}
					contentLabel="Example Modal">
					<h2 ref={(_subtitle	) => (subtitle = _subtitle)}>Do you want to remove label?</h2>
					<div className="delete_group">
						<button className="btn btn-primary" onClick={clickClose}>Yes</button>
						<button className="btn btn-danger" onClick={closeModal}>No</button>
					</div>
				</Modal>
			</div>
		</div>
	);
}



export default Drop;
