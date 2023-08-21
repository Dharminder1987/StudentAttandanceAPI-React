import React, { Fragment, useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Attendance = () => {
    const [AttendanceData, setAttendanceData] = useState([]);
    const [StatusData, setStatusData] = useState([]);

    const [RollNumber, setRollNumber] = useState('');
    const [Name, setName] = useState('');
    const [AttendanceDate, setAttendanceDate] = useState('');
    const [Status, setStatus] = useState('');
    const [StaffName, setStaffName] = useState('');

    const [EditId, setEditId] = useState('');
    const [EditRollNumber, setEditRollNumber] = useState('');
    const [EditName, setEditName] = useState('');
    const [EditAttendanceDate, setEditAttendanceDate] = useState('');
    const [EditStatus, setEditStatus] = useState('');
    const [EditStaffName, setEditStaffName] = useState('');

    const [showAdd, setShowAdd] = useState(false);
    const handleCloseAdd = () => setShowAdd(false);
    const handleShowAdd = () => setShowAdd(true);

    const [showEdit, setShowEdit] = useState(false);
    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = () => setShowEdit(true);

    useEffect(() => { 
        getAttendanceRecord(); 
    }, [])

    const getAttendanceRecord = () => {
        axios.get("https://localhost:7279/api/Attendance").then((res) => {
            setAttendanceData(res.data)
        })
    }

    const handleAdd = () => {
        axios.get("https://localhost:7279/api/Status").then((res) => {
            setStatusData(res.data)
        })
        setRollNumber('');
        setName('');
        setAttendanceDate('');
        setStatus('');
        setStaffName('');
        handleShowAdd();
    }

    const handleSubmit = () => {
        const data =
        {
            "rollNumber": RollNumber,
            "name": Name,
            "attendanceDate": AttendanceDate,
            "status": Status,
            "staffName": StaffName
        }
        axios.post('https://localhost:7279/api/Attendance', data).then((res) => {
            getAttendanceRecord();
            //toast.success(res.data);
            handleCloseAdd();
        })
    }

    const handleEdit = (id) => {
        axios.get("https://localhost:7279/api/Attendance/" + id).then((result) => {
            if (result.status === 200) {
                setEditId(result.data.id);
                setEditRollNumber(result.data.rollNumber);
                setEditName(result.data.name);
                setEditAttendanceDate(result.data.attendanceDate);
                setEditStatus(result.data.status);
                setEditStaffName(result.data.staffName);                
                handleShowEdit();
            }
        })
    }

    const handleUpdate = () => {
        const url = 'https://localhost:7279/api/Attendance';
        const data =
        {
            "rollNumber": EditRollNumber,
            "name": EditName,
            "attendanceDate": EditAttendanceDate,
            "status": EditStatus,
            "staffName": EditStaffName,
            "id": EditId
        }
        axios.put(url, data).then((res) => {
            getAttendanceRecord();
            // toast.success(res.data);
            handleCloseEdit();
        })
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure to delete this record") === true) {
            axios.delete("https://localhost:7279/api/Attendance/" + id).then((res) => {
                if (res.status === 200) {
                    //toast.warning("Record has been deleted successfully !");
                }
                getAttendanceRecord();
            });
        }
    }

    return (
        <Fragment>
            <h1>Attendance Portal</h1><br />
            <button className = 'btn btn-primary' onClick={() => handleAdd()}>Add Attendance</button><br /><br />
            <Table striped bordered hover size = "sm">
                <thead>
                    <tr>
                        <th>Roll No</th>
                        <th>Name</th>
                        <th>Attendance Date</th>
                        <th>Status</th>
                        <th>Staff Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        AttendanceData.map((item) => {
                            return (
                                <tr>
                                    <td>{item.rollNumber}</td>
                                    <td>{item.name}</td>
                                    <td>{item.attendanceDate}</td>
                                    <td>{item.status}</td>
                                    <td>{item.staffName}</td> 
                                    <td colSpan={2}>
                                    <button className='btn btn-primary' onClick={() => handleEdit(item.id)}>Edit</button>&nbsp;
                                    <button className='btn btn-danger' onClick={() => handleDelete(item.id)}>Delete</button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            <Modal show = {showAdd} onHide = {handleCloseAdd}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Attendance</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs = {6}><input type = "Text" className = 'form-control' placeholder = 'Enter Roll Number' value = {RollNumber} onChange = {(e) => setRollNumber(e.target.value)} /></Col>
                    </Row>
                    <Row style = {{marginTop:'5px'}}>
                        <Col xs = {6}><input type = "Text" className = 'form-control' placeholder = 'Enter Name' value = {Name} onChange = {(e) => setName(e.target.value)} /></Col>
                    </Row>
                    <Row style = {{marginTop:'5px'}}>
                        <Col xs = {6}><input type = "date" className = 'form-control' placeholder = 'Enter AttendanceDate' value = {AttendanceDate} onChange = {(e) => setAttendanceDate(e.target.value)} /></Col>
                    </Row>
                    <Row style = {{marginTop:'5px'}}>
                        <Col xs = {6}>
                        <select className = 'form-control' value = {Status} onChange = {(e) => setStatus(e.target.value)}>
                            <option>Select Status</option>
                            {
                                StatusData.map((result)=>(<option value={result.statusId}>{result.statusName}</option>))
                            }
                        </select>
                        </Col>
                    </Row>
                    <Row style = {{marginTop:'5px'}}>
                        <Col xs = {6}><input type = "Text" className = 'form-control' placeholder = 'Enter Staff Name' value = {StaffName} onChange = {(e) => setStaffName(e.target.value)} /></Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant = "secondary" onClick = {handleCloseAdd}>Close</Button>
                    <Button variant = "primary" onClick = {() => handleSubmit()}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

            <Modal show = {showEdit} onHide = {handleCloseEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Attendance</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs = {6}><input type = "Text" className = 'form-control' placeholder = 'Enter Roll Number' value = {EditRollNumber} onChange = {(e) => setEditRollNumber(e.target.value)} /></Col>
                    </Row>
                    <Row style = {{marginTop:'5px'}}>
                        <Col xs = {6}><input type = "Text" className = 'form-control' placeholder = 'Enter Name' value = {EditName} onChange = {(e) => setEditName(e.target.value)} /></Col>
                    </Row>
                    <Row style = {{marginTop:'5px'}}>
                        <Col xs = {6}><input type = "date" className = 'form-control' placeholder = 'Enter AttendanceDate' value = {EditAttendanceDate} onChange = {(e) => setEditAttendanceDate(e.target.value)} /></Col>
                    </Row>                    
                    <Row style = {{marginTop:'5px'}}>
                        <Col xs = {6}><input type = "Text" className = 'form-control' placeholder = 'Enter Status' value = {EditStatus} onChange = {(e) => setEditStatus(e.target.value)} /></Col>
                    </Row>
                    <Row style = {{marginTop:'5px'}}>
                        <Col xs = {6}><input type = "Text" className = 'form-control' placeholder = 'Enter Staff Name' value={EditStaffName} onChange = {(e) => setEditStaffName(e.target.value)} /></Col>
                    </Row>
                    <Row style = {{marginTop:'5px'}}>
                        <Col xs = {0}><input type = "Text" className = 'form-control' value = {EditId} hidden /></Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant = "secondary" onClick = {handleCloseEdit}>Close</Button>
                    <Button variant = "primary" onClick = {() => handleUpdate()}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}
export default Attendance;