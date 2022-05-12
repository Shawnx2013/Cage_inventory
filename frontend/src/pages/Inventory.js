import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation/Navigation";
import ItemCard from "../components/ItemCard/ItemCard";
import { ReactComponent as Search } from '../assets/icons/Search.svg'; 
import { getAllItems, getItemsSearch } from "../services/Item.service";
import { ReactComponent as Filter } from '../assets/icons/Filter.svg'; 
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { getAllKits, searchKits } from "../services/Kit.service";
import KitCard from "../components/KitCard/KitCard";
import { getAllTags } from "../services/Tag.service";

function MyVerticallyCenteredModal(props) {

  // states and use effect
  const [ tags, setTags ] = useState([]);
  const [ selectedTag, setSelectedTag ] = useState('');

  const getTags = () => {
    getAllTags().then((response) => {
      setTags(response);
    });
  }

  const handleTagSelection = (tag) => {
    if (selectedTag === tag) {
      setSelectedTag('');
    } else {
      setSelectedTag(tag);
    }
  }

  const filterInventory = () => {
    if (selectedTag === '') {
      return;
    }

    props.searchItems(selectedTag);
  }

  useEffect(() => {
    getTags();
  }, []);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable={true}>
      <Modal.Body>
        <h3 className="modal-title text-light">Item Tags:</h3>
        <div className="container">
          { tags && tags.map((tag) => {
            return (
              <div className="col" key={`${tag.tag_name}-tag`}>
                <input type="checkbox" checked={tag.tag_name === selectedTag} className="btn-check" id={`btn-check-${tag.id}`} autoComplete="off" value={tag.tag_name} onChange={(e) => handleTagSelection(e.target.value)} />
                <label className="btn" htmlFor={`btn-check-${tag.id}`}>{tag.tag_name}</label>
              </div>
            )
          })}
        </div>

      </Modal.Body>
      <Modal.Footer>
        <Button onClick={(e) => {filterInventory()}}>Apply Filters</Button>
      </Modal.Footer>
    </Modal>
  );
}

function Inventory() {

  // items state and state update
  const [ items, setItems ] = useState([]);
  const [ kits, setKits ] = useState([]);
  const [ isBusy, setBusy ] = useState(true);
  const [ search, setSearch ] = useState('');

  const [ modal, setModal ] = useState(false);
  const [ timeModal, setTimeModal ] = useState(false);
  
  const [ resStart, setResStart ] = useState('');
  const [ resEnd, setResEnd ] = useState('');
  const [ resError, setResError ] = useState('');

  const [ modalShow, setModalShow ] = React.useState(false);

  // define functions
  const getItems = () => {
      setBusy(true);
      getAllItems().then(items => {
          setItems(items);
          setBusy(false);
      })
  }

  const getKits = () => {
    setBusy(true);
    getAllKits().then(kits => {
      setKits(kits);
      setBusy(false);
    }).catch(error => {
      console.log(error);
    })
  }

  const reserveCurrentTime = () => {
      setTimeModal(false);
      setResError('');

      let currDate = new Date();
      currDate.setTime(currDate.getTime() - currDate.getTimezoneOffset()*60*1000);
      setResStart(currDate.toISOString().split(".")[0]);
      currDate.setHours(currDate.getHours() + 1);
      setResEnd(currDate.toISOString().split(".")[0]);

      getItems();
      getKits();
  }

  const reserveForTime = () => {
      // validate times (ie end not before start, not empty)
      if (resStart == '' || resEnd == '') {
          setResError("Start or End cannot be empty.");
          return;
      } else if (resEnd <= resStart) {
          setResError("End cannot be before Start.");
          return;
      }

      // if times are fine do this
      setTimeModal(false);
      setResError('');
      getItems();
      getKits();
  }

  const searchItems = (search) => {
      if (search === undefined || search === null || search === '') {
          getItems();
      }
      setBusy(true);
      getItemsSearch(search).then(items => {
          setItems(items);
          setBusy(false);
      });
      searchKits(search).then(kits => {
        setKits(kits);
        setBusy(false);
      });

      if (setModalShow) {
        setModalShow(false);
      }
  }

  const renderItemCards = () => {
      // for each item in the array, return an itemcard
      const itemCards = items.map( (item, id) => (
          <ItemCard item={item} key={id} setModal={setModal} start={resStart} end={resEnd} />
      ));

      const kitCards = kits.map((kit, id) => {
        return <KitCard kit={kit} key={`kit-card-${id}`} setModal={setModal} start={resStart} end={resEnd} />
      });

      return (
          <div className="item-cards-list">
              { itemCards }
              { kitCards }
          </div>
      )
  }

  useEffect(() => {
      if (window.sessionStorage.getItem("role") == 2) {
        setTimeModal(false);
        getItems();
        getKits();
      } else {
        setTimeModal(true);
      }
  }, [])

  return (
    <div className="outer">
      <div><Navigation currPage='Inventory' /></div>
      { modal &&
          <div className="modal" id="addToCartModal" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered" role="document">
                  <div className="modal-content content-light">
                  <div className="modal-header">
                      <h5 className="modal-title text-dark" id="addToCartModal">Item Added To Cart</h5>
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
      { modalShow &&
        <>
        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          searchItems={searchItems}/>
        </>
      }
      { timeModal &&
          <div className="modal" id="addToCartModal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content content-light">
                <div className="modal-header">
                    <h5 className="modal-title text-dark" id="addToCartModal">Reservation Time</h5>
                    <button type="button" className="close" onClick={(e) => setTimeModal(false)}  aria-label="Close">
                    <span aria-hidden="true" className="text-dark">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <form>
                        <p className="text-dark">Reserve Now: </p>
                        <button type="button" className="btn btn-secondary" onClick={(e) => reserveCurrentTime()}>Reserve Now</button>
                        <hr />
                        <p className="text-dark">Or Set Start and End:</p>
                        <div className="form-group">
                            <label htmlFor="reservationSetStart" className="text-dark">Start:</label>
                            <input type="datetime-local" id="reservationSetStart" value={resStart} onChange={(e) => setResStart(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="reservationSetEnd" className="text-dark">End:</label>
                            <input type="datetime-local" id="reservationSetEnd" value={resEnd} onChange={(e) => setResEnd(e.target.value)} />
                        </div>
                        <p className="text-danger">{resError}</p>
                        <button type="button" className="btn btn-primary" onClick={(e) => reserveForTime()}>Save Time</button>
                    </form>
                </div>
              </div>
            </div>
          </div>      
      }
      <div className="searchContainer">
          <div className="search-bar-container">
              <input type="input" className="searchBox" placeholder="Search" onChange={e => setSearch(e.target.value)} value={search} />
              <button type="button" className="search-button" onClick={(e) => searchItems(search)}><Search /></button>
              <button type="button" className="filter-button" onClick={() => setModalShow(true)}><Filter /></button>
          </div>
      </div>
      <div className="inner">
        <button type="button" className="btn btn-primary time-modal-button" onClick={(e) => setTimeModal(true)} disabled={window.sessionStorage.getItem("role")  == 2}>Set Reservation Time</button>
          <div className="row row-cols-1 row-cols-md-3">
              <div className="card-columns">
                  { isBusy ? <h5>loading...</h5> : renderItemCards()}
              </div>
          </div>
      </div>
    </div>
  );
}

export default Inventory;
