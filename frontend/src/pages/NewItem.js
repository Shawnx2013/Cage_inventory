import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation/Navigation";
import { addItem } from "../services/Item.service";
import { getAllLocations } from "../services/Location.service";

function NewItem() {
    // states for form fields
    const [ title, setTitle ] = useState('');
    const [ type, setType ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ location, setLocation ] = useState(0);
    const [ version, setVersion ] = useState(1);
    const [ count, setCount ] = useState(1);
    const [ long_term, setLongTerm ] = useState(0);

    // other states
    const [ itemCreated, setItemCreated ] = useState(false);
    const [ allLocations, setAllLocations ] = useState([]);
    const [ fieldEmpty, setFieldEmpty ] = useState(false);

    const [ modal, setModal ] = useState(false);

    // functions
    const getLocations = () => {
        getAllLocations().then((locations) => {
            setAllLocations(locations);
        });
    }

    const attemptAddItem = () => {
        addItem(title, type, description, version, count, long_term, location)
        .then((res) => {
            console.log(res);
            setItemCreated(true);
            setModal(true);
            clearForm();
        })
        .catch((error) => {
            console.log(error);
            setItemCreated(false);
        });
    }

    const handleSubmit = () => {
        // check and see if all fields are filled in (or at least required ones)
        if (title == '' || type == '' || location <= 0) {
            // for now required fields are all but description
            // rest have default states so they dont need to be checked, just aware of
            // otherwise highlight the ones that are not and display a message
            setFieldEmpty(true);
            console.log('required fields empty');
            return;
        }

        // if they are, then attempt to add the item
        setFieldEmpty(false);
        attemptAddItem();
    }

    const clearForm = () => {
        setTitle('');
        setType('');
        setDescription('');
        setLocation(0);
        setCount(1);
        setVersion(1);
        setLongTerm(0);
    }

    const renderLocationSelection = () => {
        // map the array to radio buttons
        const radio = allLocations.map((location, index) => {
            if (location.id === location) {
                return (
                    <div className="form-check" key={index}>
                        <input className="form-check-input" type="radio" name="locationRadio" id={`location-${index}`} value={location.id} checked onChange={(e)=>{setLocation(e.target.value)}} ></input>
                        <label className="form-check-label" htmlFor={`location-${index}`}>
                            {location.location}
                        </label>
                    </div>
                );
            } else {
                return (
                    <div className="form-check" key={index}>
                        <input className="form-check-input" type="radio" name="locationRadio" id={`location-${index}`} value={location.id} onChange={(e)=>{setLocation(e.target.value)}} ></input>
                        <label className="form-check-label" htmlFor={`location-${index}`}>
                            {location.location}
                        </label>
                    </div>
                );
            }
        });

        return (
            <div>
                <p>Item Location: *</p>
                {radio}
            </div>
        );
    }

    const renderLongTermLoanable = () => {
        // t/f radio depending on whether or not this item can be loaned long-term
        return (
            <div>
                <p>Long Term Loanable? *</p>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="loanableRadio" id={`loanable-true`} value={1} onChange={(e)=>{setLongTerm(e.target.value)}} ></input>
                    <label className="form-check-label" htmlFor={`loanable-true`}>
                        Yes
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="loanableRadio" id={`loanable-false`} value={0} onChange={(e)=>{setLongTerm(e.target.value)}} ></input>
                    <label className="form-check-label" htmlFor={`loanable-false`}>
                        No
                    </label>
                </div>
            </div>
        )
    }

    // onload stuff
    useEffect(() => {
        getLocations(); // loading locations for the form (radio group?)
    }, []);

    // render
    return (
        <div className="outer">
            <div><Navigation currPage='Add Item' /></div>
            <br />
            <div className="inner">
                <div className="container">
                    <form onSubmit={(e) => handleSubmit()} className="add-item-form">
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="form-group">
                                    <label htmlFor="itemTitle">Name: *</label>
                                    <input type="text" className="form-control" id="itemTitle" placeholder="" value={title} onChange={(e)=>{setTitle(e.target.value)}} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="itemType">Type: *</label>
                                    <input type="text" className="form-control" id="itemType" placeholder="" value={type} onChange={(e)=>{setType(e.target.value)}} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="itemCount">Count: *</label>
                                    <input type="number" className="form-control" id="itemCount" min="1" value={count} onChange={(e)=>{setCount(e.target.value)}} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="itemVersion">Version: *</label>
                                    <input type="number" className="form-control" id="itemVersion" min="1" value={version} onChange={(e)=>{setVersion(e.target.value)}} />
                                { renderLocationSelection() }
                                <br />
                                { renderLongTermLoanable() }
                                <br />
                                </div>
                            </div> 
                            <div className="col-lg-4 ml-auto">
                                <div className="form-group">
                                    <label htmlFor="itemDesc">Item Description: </label>
                                    <textarea className="form-control" id="itemDesc" placeholder="" rows="11" cols="50" value={description} onChange={(e)=>{setDescription(e.target.value)}} />
                                </div>
                            </div>
                        <button type="button" className="btn btn-primary" onClick={(e) => {handleSubmit()}}>Add Item</button>
                        <small id="missingFields" className={fieldEmpty ? `form-text text-danger` : `form-text error-hidden`}>One or more required fields empty.</small><br />
                        <button type="reset" className="btn btn-secondary" onClick={(e) => {clearForm()}}>Clear</button>
                    </div>
                </form> 
            </div>
        </div>
            { modal &&
                <div className="modal" id="addItemSuccessModal" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content content-light">
                        <div className="modal-header">
                            <h5 className="modal-title text-dark" id="addItemSuccessModalTitle">Item Successfully Added</h5>
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
        </div>
    );
}

export default NewItem;