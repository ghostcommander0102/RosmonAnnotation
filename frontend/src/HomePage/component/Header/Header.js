import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import './header.css';
const Header = (props) => {
    return (
        <Container fluid="xs">
            <Row >
                <Col style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <div className="headerContainer">
                        <p className="headerTitle">{props.title}</p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Header;