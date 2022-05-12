import React from "react";

// components
import Navigation from "../components/Navigation/Navigation";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { useState } from "react";
import axios from 'axios';
import { BASE_ROUTE } from "../constants/api-routes";

function Report() {

    //get value of checkbox states
    const [userCheckbox, setUserCheckbox] = useState(false);
    const [reservationCheckbox, setReservationCheckbox] = useState(false);
    const [itemCheckbox, setItemCheckbox] = useState(false);
    const [tagCheckbox, setTagCheckbox] = useState(false);
    const [locationsCheckbox, setLocationsCheckbox] = useState(false);

    function validateReportOptions(e) {
      e.preventDefault()
      
      if(userCheckbox == true) {

        const sendUserRequest = async () => {
          try {
            const request = await axios.get(`${BASE_ROUTE}/user/`)
            const user = request.data

            var doc = new jsPDF();
            var col = ["Username", "Type", "Password", "Role"];
            var rows = [];
            
            for(const element of user){
              const role = await axios.get(`${BASE_ROUTE}/role/${element.role_id}`)
              const data = role.data;

              var temp = [element.username,element.type,element.password, data.role_name];
              rows.push(temp);
            }
            //  user.forEach(element => {      
            //   switch(element.role_id){
            //     case 1:
            //       roleName = "student";
            //       break;
            //     case 2:
            //       roleName = "staff";
            //       break;
            //     case 3:
            //       roleName = "faculty";
            //       break;
            //     default:
            //       break;
            //   }
            //   var temp = [element.username,element.type,element.password, roleName];
            //   rows.push(temp);
            // });        
        
            doc.autoTable(col, rows);
        
            doc.save('UserReport.pdf');
          } catch(err) {
            console.error(err);
          }
        };
          sendUserRequest();    
      }

      if(reservationCheckbox == true) {

        const sendReservationRequest = async () => {
          try {
            const request = await axios.get(`${BASE_ROUTE}/reservation/`)
            const reservation = request.data

            var doc = new jsPDF();
            var col = ["User ID", "Loan Start", "Loan End", "Item(s)", "Kit(s)"];
            var rows = [];
          
            for (const element of reservation){
              const r = await axios.get(`${BASE_ROUTE}/reservation/${element.id}`)
              const data = r.data;
              console.log(data);

              var temp = [data.user_id,data.loan_start,data.loan_end, data.items.length > 0 ? data.items : "N/A", data.kits.length > 0 ? data.kits : "N/A"];
              rows.push(temp);
            }      
          
            doc.autoTable(col, rows);
          
            doc.save('ReservationsReport.pdf');
            } catch(err) {
              console.error(err);
            }
          };   
            sendReservationRequest(); 
        }


      if(itemCheckbox == true) {

        const sendItemRequest = async () => {
          try {
            const request = await axios.get(`${BASE_ROUTE}/item/`) 
            const item = request.data

            const requestTwo = await axios.get(`${BASE_ROUTE}/location/`);
            const locationItem = requestTwo.data
            
            var doc = new jsPDF();
            var col = ["Id", "Name", "Type", "Description", "Version", "Long Term Loanable", "Item Location", "Tags"];
            var rows = [];
            var longTermLoanableYesOrNo = "";
            for (const element of item){
              if(element.long_term_loanable === 0){
                longTermLoanableYesOrNo = "No";
              }else{
                longTermLoanableYesOrNo = "Yes";
              }
              const tags = element.tags;
              element.tags = "";
              for (const t of tags){
                const res = await axios.get(`${BASE_ROUTE}/item-tag/${t}`);
                element.tags += res.data.tag_name + ", ";
              }
              element.tags = element.tags.slice(0, -2); 
              var temp = [element.id, element.name,element.type,element.description,element.version, longTermLoanableYesOrNo, locationItem[element.location_id - 1].location, element.tags];
              rows.push(temp);
            }     
        
            doc.autoTable(col, rows);
        
            doc.save('ItemsReport.pdf');
            } catch(err) {
              console.error(err);
            }
          };   
            sendItemRequest(); 
        }

      if(tagCheckbox == true) {

        const sendTagRequest = async () => {
          try {
            const request = await axios.get(`${BASE_ROUTE}/item-tag/`)
            const tag = request.data

            var doc = new jsPDF();
            var col = ["Tag Name"];
            var rows = [];
        
            tag.forEach(element => {      
              var temp = [element.tag_name];
              rows.push(temp);
            });        
        
            doc.autoTable(col, rows);
        
            doc.save('TagReport.pdf');
            } catch(err) {
              console.error(err);
            }
          };   
            sendTagRequest(); 
        }
          

      if(locationsCheckbox == true) {

        const sendLocationRequest = async () => {
          try {
            const request = await  axios.get(`${BASE_ROUTE}/location/`)
            const location = request.data

            var doc = new jsPDF();
            var col = ["Location"];
            var rows = [];
        
             location.forEach(element => {      
              var temp = [element.location];
              rows.push(temp);
            });        
        
            doc.autoTable(col, rows);
        
            doc.save('LocationsReport.pdf');
            } catch(err) {
              console.error(err);
            }
          };   
            sendLocationRequest(); 
        }
    }//validateReportOptions

    return (
        <div className="outer">
            <div><Navigation currPage='Generate Report' /></div>
            <div className="inner">
                <Form className="reportForm" onSubmit={validateReportOptions}>
                <div className="reportHeader">
                    <h1 className="text-primary">Report Content</h1>
                </div>
                    {['checkbox'].map((type) => (
                        <div key={`default-${type}`} className="mb-3">
                            <Form.Check 
                                type={type}
                                id={`usersBox`}
                                label={`Users`}
                                onChange={(e)=>setUserCheckbox(e.target.checked)}
                            />
                            <Form.Check 
                                type={type}
                                id={`reservationsBox`}
                                label={`Reservations`}
                                onChange={(e)=>setReservationCheckbox(e.target.checked)}

                            />
                            <Form.Check 
                                type={type}
                                id={`itemBox`}
                                label={`Items`}
                                onChange={(e)=>setItemCheckbox(e.target.checked)}
                            />
                            <Form.Check 
                                type={type}
                                id={`tagsBox`}
                                label={`Tags`}
                                onChange={(e)=>setTagCheckbox(e.target.checked)}
                            />
                            <Form.Check 
                                type={type}
                                id={`locationsBox`}
                                label={`Locations`}
                                onChange={(e)=>setLocationsCheckbox(e.target.checked)}
                            /> 
                        </div> 
                    ))}
                      <Button className="report-button" as="input" type="submit" value="Generate Report" />{' '}
              </Form>
            </div>
        </div>
    );
  }

export default Report;