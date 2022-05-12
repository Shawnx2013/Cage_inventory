import React, { useState, useEffect } from "react";

// components
import Navigation from "../components/Navigation/Navigation";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';
import { getAllItems } from "../services/Item.service";
import { getAllLocations } from "../services/Location.service";
import { getUserId } from "../utils/User.profile";
import { createKit, getAllKits } from "../services/Kit.service";
import { useNavigate } from "react-router-dom";


function MyVerticallyCenteredModal({setSelectedItems, setModalShow, selectedItems, ...props}) {

    // state variables
    const [ allItems, setAllItems ] = useState([]);
    const [ items, setItems ] = useState([]);

    // functions
    const getItems = () => {
        getAllItems().then((items) => {
            setAllItems(items);
        }).catch((error) => {
            console.log(error);
        });
    }

    const itemChanged = (status, item) => {
        // is item added/subtracted?
        if (status) {
            // item is checked, so add it to the array
            setItems((previous) => [...previous, item]);
        } else {
            // remove item from array
            let newItems = [];
            items.forEach((prevItem) => {
                if (prevItem.id !== item.id) {
                    newItems.push(prevItem);
                }
            });

            setItems(newItems);
        }
    }

    const isItemSelected = (item) => {
        const index = items.indexOf(item);

        if (index < 0) {
            return false;
        }

        return true;
    }

    const renderItemSelectionList = () => {
        // compare to selecteditems
        let itemsList = allItems.map((item) => {
            return (
                <div key={item.id}>
                    <input type="checkbox" checked={isItemSelected(item)} className="btn-check" id={`item${item.id}`} autoComplete="off" value={item.id} onChange={(e) => itemChanged(e.target.checked, item)} />
                    <label className="btn" htmlFor={`item${item.id}`}>{item.name}</label>
                </div>
            );
        });

        return (
            <div className="col">
                { itemsList }
            </div>
        );
    }

    // onload stuff
    useEffect(() => {
        getItems();
    }, []);

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        scrollable={true}
  
      >
        <Modal.Body>
            <div className="container">
                <div className="row">
                    {renderItemSelectionList()}
                </div>
          </div>

        </Modal.Body>
      <Modal.Footer>
        <Button onClick={(e) => {setSelectedItems(items); setModalShow(false)}}>Add</Button>
      </Modal.Footer>
    </Modal>
  );
}

function Kit() {

    const [modalShow, setModalShow] = React.useState(false);
    const [ modal, setModal ] = useState(false);
    const [ allLocations, setAllLocations ] = useState([]);
    const [ selectedItems, setSelectedItems ] = useState([]);

    const [ name, setName ] = useState('');
    const [ desc, setDesc ] = useState('');
    const [ count, setCount ] = useState(1);
    const [ longTerm, setLongTerm ] = useState(false);
    const [ location, setLocation ] = useState(0);

    let navigate = useNavigate();

    const getLocations = () => {
        getAllLocations().then((locations) => {
            setAllLocations(locations);
        }).catch((error) => {
            console.log(error);
        });
    }

    const attemptCreateKit = () => {
        console.log("attempt add kit");

        // grab the variables
        const kit_name = name;
        const kit_desc = desc;
        const kit_count = count;
        const kit_location = location;
        const kit_long_term = longTerm;
        const user_id = parseInt(getUserId());
        const items = [];

        // validate them
        if (kit_location === 0) {
            return;
        }
        if (kit_count < 1) {
            return;
        }
        if (kit_name === '') {
            return;
        }
        if (selectedItems == []) {
            return;
        } 

        // make array of item_ids
        selectedItems.forEach((item) => {
            items.push(item.id);
        });

        // attempt to create kit
        createKit(kit_name, user_id, kit_desc, kit_count, kit_long_term, kit_location, items).then((kit) => {
            console.log(kit);
            setModal(true); 
        }).catch((error) => {
            console.log(error);
        })
    }

    const renderLocationSelection = () => {
        // map the array to radio buttons
        const radio = allLocations.map((location, index) => {
            if (location.id === location) {
                return (
                    <div className="form-check" key={index}>
                        <input className="form-check-input kit-location" type="radio" name="locationRadio" id={`location-${index}`} value={location.id} checked onChange={(e)=>{setLocation(e.target.value)}} ></input>
                        <label className="form-check-label" htmlFor={`location-${index}`}>
                            {location.location}
                        </label>
                    </div>
                );
            } else {
                return (
                    <div className="form-check" key={index}>
                        <input className="form-check-input kit-location" type="radio" name="locationRadio" id={`location-${index}`} value={location.id} onChange={(e)=>{setLocation(e.target.value)}} ></input>
                        <label className="form-check-label" htmlFor={`location-${index}`}>
                            {location.location}
                        </label>
                    </div>
                );
            }
        });

        return (
            <div className="form-group kit-location-container">
                <p>Kit Location: </p>
                {radio}
            </div>
        );
    }

    // onload stuff
    useEffect(() => {
        getLocations();
    }, []);

    return (
        <div className="outer">
            <Navigation currPage='Create Kit' />
            <br />
            { modal &&
                <div className="modal" id="addKitModal" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content content-light">
                        <div className="modal-header">
                            <h5 className="modal-title text-dark" id="addKitModal">Kit Created</h5>
                            <button type="button" className="close" onClick={(e) => setModal(false)}  aria-label="Close">
                            <span aria-hidden="true" className="text-dark">&times;</span>
                            </button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={(e) => setModal(false)}>Ok</button>
                        </div>
                        </div>
                    </div>
                </div>
            }
                <div className="inner">
                    <div className="container">
                        <div className="row">
                            <div className="kitHeader">
                                <h1 className="text-primary">Kit Details</h1>
                            </div>
                            <div className="col-lg-4">
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="kit-name-input" >Kit Name:</label>
                                        <input type="text" id="kit-name-input" className="form-control" placeholder="Kit Name" value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label >Kit Count:</label>
                                        <input type="number" className="form-control" placeholder="Kit Count" value={count} onChange={(e) => setCount(e.target.value)} />
                                    </div>
                                    { renderLocationSelection() }

                                    <div className="kitHeader long-term-switch">
                                        <h5 className="text-primary">Long-Term Loanable</h5>
                                        <Form.Check 
                                            className="longTermSwitch"
                                            type="switch"
                                            id="custom-switch"
                                            onChange={(e) => setLongTerm(!longTerm)}
                                            checked={longTerm}
                                        />
                                    </div>
                                </form>  
                            </div>
                            <div className="col-lg-4">
                                <div className="form-group">
                                    <label >Kit Description:</label>
                                    <textarea className="form-control" placeholder="Kit Description" rows="11" cols="50" value={desc} onChange={(e) => setDesc(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="kitItemDiv">
                                    <>
                                    <Button onClick={() => setModalShow(true)} className="btn-primary kit-button" size="sm">Add Item </Button>
                                    <MyVerticallyCenteredModal
                                        show={modalShow}
                                        setModalShow={setModalShow}
                                        onHide={() => setModalShow(false)}
                                        setSelectedItems={setSelectedItems}
                                        selectedItems={selectedItems}/>
                                    <label>Selected Items:</label>
                                    <div className="kit-item-container">
                                        <ul>
                                            { selectedItems.map((item) => {
                                                return <li className="text-light" key={`selecteditem-${item.id}`}>{item.name}</li>
                                            })}
                                        </ul>
                                    </div>
                                    </>  
                                </div>  
                            </div>
                        </div>
                        <Button onClick={(e) => {attemptCreateKit()}} className="btn btn-primary kit-button" size="lg">Add Kit</Button> 
                    </div>
                </div>
            </div>
    );
}

export default Kit;