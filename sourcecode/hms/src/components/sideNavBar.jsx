import React, { Component } from "react";
import "./sliderNavBar.css";
import AddPersonDetails from "./PersonDetails/addpersondetails";
import PatienList from "./Patients/patientlist";
import DoctorsLis from "./Doctors/doctorslist";
import BedAllotment from "./Bed/bedallotment";
import EditPersonDetails from "./PersonDetails/editpersondetails";

import Bedlist from "./Bed/bedlist";
import MedicineList from "./Medicine/medicinelist";
import BloodBagList from "./Bloodbag/bloodbaglist";
import NurseList from "./Nurses/nurselist";
import PharmacistsList from "./Pharmacistslist/pharmacistslist";
import LaboratoristList from "./Laboratorist/laboratoristlist";
import AccountantList from "./Accountant/accountantlist";
import ReceptionistList from "./Receptionist/receptionistlist";

import DeathReportList from "./DeathReport/deathreportlist";
import DeathRepotAllotment from "./DeathReport/deathreportallotment";

import BirthReportList from "./BirthReport/birthreportlsit";
import BirthRepotAllotment from "./BirthReport/birthreportallotment";
import PayrollList from "./Payroll/payrolllist";
import Dashboard from "./Dashboard/dashboard";
import OperationAllotment from "./OperationReprot/operationallotment";
import OperationReportList from "./OperationReprot/operationreportlist";
import CreatePayRoll from "./Payroll/createpayroll";
import firebase from "../firebase";
import {
  BrowserRouter as Routers,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { setLogInDetails } from "../actions/setpersondetailsaction";
import { connect } from "react-redux";

class SideNavBar extends Component {
  state = {
    addHamburgerClass: false,
    addTitleClass: true,
    patientdetails: null,
    togglePymentTitle: true,
    selectedCat: "",
  };

  getData = (data) => {
    this.setState({ patientdetails: data });
  };

  toggleHamburger = () => {
    this.setState({ addHamburgerClass: !this.state.addHamburgerClass });
  };
  toggleTitle = () => {
    this.setState({ addTitleClass: !this.state.addTitleClass });
  };
  togglePymentTitle = () => {
    this.setState({ togglePymentTitle: !this.state.togglePymentTitle });
  };
  logout = () => {
    const loginDetails = { isLoggedIn: false };
    firebase.auth().signOut();
    this.props.setOnLogInDetails(loginDetails);
  };
  setTitleActive = (selectedCat) => {
    this.setState({
      selectedCat: selectedCat,
    });
  };

  render() {
    let boxClass = ["wrapper"];

    if (this.state.addHamburgerClass) {
      boxClass.push("collap");
    }
    let titleClass = ["subcat"];
    if (this.state.addTitleClass) {
      titleClass.push("collap");
    }
    let togglePymentTitle = ["subcat"];
    if (this.state.togglePymentTitle) {
      togglePymentTitle.push("collap");
      // console.log(boxClass);
    }
    return (
      <div className={boxClass.join(" ")}>
        <Routers>
          <div className="top_navbar">
            <div className="hamburger" onClick={this.toggleHamburger}>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div className="top_menu">
              <div className="logo">Hospital Management</div>
              <ul>
                <li onClick={this.logout}>
                  {" "}
                  <i className="fa fa-sign-out" aria-hidden="true"></i>
                </li>
                <li>
                  <i className="fas fa-search"></i>
                </li>
                <li>
                  <i className="fas fa-bell"></i>
                </li>
                <li>
                  <i className="fas fa-user"></i>
                </li>
              </ul>
            </div>
          </div>

          <div className="sidebar">
            <div className="noSubCat">
              <ul>
                <Link to="/">
                  <li
                    className={
                      this.state.selectedCat === "Dashboard" ? "active" : ""
                    }
                    onClick={() => this.setTitleActive("Dashboard")}
                  >
                    <span className="icon">
                      <i className="fa fa-home" aria-hidden="true"></i>
                    </span>
                    <span className="title">Dashboard</span>
                  </li>
                </Link>
                <Link to="/patientlist">
                  <li
                    className={
                      this.state.selectedCat === "Patient" ? "active" : ""
                    }
                    onClick={() => this.setTitleActive("Patient")}
                  >
                    <span className="icon">
                      <i className="fa fa-user" aria-hidden="true"></i>
                    </span>
                    <span className="title">Patient</span>
                  </li>
                </Link>
                <Link to="/doctorslist">
                  <li
                    className={
                      this.state.selectedCat === "Doctors" ? "active" : ""
                    }
                    onClick={() => this.setTitleActive("Doctors")}
                  >
                    {" "}
                    <span className="icon">
                      <i className="fa fa-user-md" aria-hidden="true"></i>
                    </span>
                    <span className="title">Doctors</span>
                  </li>
                </Link>
                <Link to="/nurselist">
                  <li
                    className={
                      this.state.selectedCat === "Nurse" ? "active" : ""
                    }
                    onClick={() => this.setTitleActive("Nurse")}
                  >
                    <span className="icon">
                      <i className="fa fa-female" aria-hidden="true"></i>
                    </span>
                    <span className="title">Nurse</span>
                  </li>
                </Link>

                <Link to="/pharmacistslist">
                  <li
                    className={
                      this.state.selectedCat === "pharmacist" ? "active" : ""
                    }
                    onClick={() => this.setTitleActive("pharmacist")}
                  >
                    <span className="icon">
                      <i className="fa fa-medkit" aria-hidden="true"></i>
                    </span>
                    <span className="title">pharmacist</span>
                  </li>
                </Link>

                <Link to="/laboratoristlist">
                  <li
                    className={
                      this.state.selectedCat === "Laboratorist" ? "active" : ""
                    }
                    onClick={() => this.setTitleActive("Laboratorist")}
                  >
                    <span className="icon">
                      <i className="fa fa-flask" aria-hidden="true"></i>
                    </span>
                    <span className="title">Laboratorist</span>
                  </li>
                </Link>

                <Link to="/accountantlist">
                  <li
                    className={
                      this.state.selectedCat === "Accountant" ? "active" : ""
                    }
                    onClick={() => this.setTitleActive("Accountant")}
                  >
                    <span className="icon">
                      <i className="fa fa-money" aria-hidden="true"></i>
                    </span>
                    <span className="title">Accountant</span>
                  </li>
                </Link>

                <Link to="/receptionistlist">
                  <li
                    className={
                      this.state.selectedCat === "Receptionist" ? "active" : ""
                    }
                    onClick={() => this.setTitleActive("Receptionist")}
                  >
                    <span className="icon">
                      <i className="fa fa-briefcase" aria-hidden="true"></i>
                    </span>
                    <span className="title">Receptionist</span>
                  </li>
                </Link>
              </ul>
            </div>
            <hr />

            <div className="withsubcat">
              <div className="maincat">
                <ul>
                  <li onClick={this.toggleTitle}>
                    <span className="icon">
                      <i className="fa fa-h-square" aria-hidden="true"></i>
                    </span>
                    <span className="title">Manage Hospital</span>
                  </li>
                </ul>
              </div>

              <div className={titleClass.join(" ")}>
                <ul>
                  <li
                    className={
                      this.state.selectedCat === "BedAllotment" ? "active" : ""
                    }
                    onClick={() => this.setTitleActive("BedAllotment")}
                  >
                    <Link to="/bedlist">
                      {" "}
                      <span className="subtitle">Bed Allotment</span>
                    </Link>
                  </li>

                  <li
                    className={
                      this.state.selectedCat === "Medicine" ? "active" : ""
                    }
                    onClick={() => this.setTitleActive("Medicine")}
                  >
                    {" "}
                    <Link to="/medicinelist">
                      {" "}
                      <span className="subtitle">Medicine</span>
                    </Link>
                  </li>
                  <li
                    className={
                      this.state.selectedCat === "BloodBag" ? "active" : ""
                    }
                    onClick={() => this.setTitleActive("BloodBag")}
                  >
                    {" "}
                    <Link to="/bloodbaglist">
                      {" "}
                      <span className="subtitle">Blood Bag</span>
                    </Link>
                  </li>
                  <li
                    className={
                      this.state.selectedCat === "OperationReport"
                        ? "active"
                        : ""
                    }
                    onClick={() => this.setTitleActive("OperationReport")}
                  >
                    {" "}
                    <Link to="/operationreportlist">
                      {" "}
                      <span className="subtitle">Operation Report</span>
                    </Link>
                  </li>
                  <li
                    className={
                      this.state.selectedCat === "BirthReport" ? "active" : ""
                    }
                    onClick={() => this.setTitleActive("BirthReport")}
                  >
                    {" "}
                    <Link to="/birthreportlist">
                      {" "}
                      <span className="subtitle">Birth Report</span>
                    </Link>
                  </li>
                  <li
                    className={
                      this.state.selectedCat === "DeathReport" ? "active" : ""
                    }
                    onClick={() => this.setTitleActive("DeathReport")}
                  >
                    {" "}
                    <Link to="/deathreportlist">
                      {" "}
                      <span className="subtitle">Death Report</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <hr />

              <div className="withsubcat">
                <div className="maincat">
                  <ul>
                    <li onClick={this.togglePymentTitle}>
                      <span className="icon">
                        <i
                          className="fa fa-credit-card-alt"
                          aria-hidden="true"
                        ></i>
                      </span>
                      <span className="title">Payments</span>
                    </li>
                  </ul>
                </div>

                <div className={togglePymentTitle.join(" ")}>
                  <ul>
                    <li
                      className={
                        this.state.selectedCat === "CreatePayroll"
                          ? "active"
                          : ""
                      }
                      onClick={() => this.setTitleActive("CreatePayroll")}
                    >
                      {" "}
                      <Link to="/createpayroll">
                        <span className="subtitle">Create Payroll</span>
                      </Link>
                    </li>
                    <li
                      className={
                        this.state.selectedCat === "Payroll" ? "active" : ""
                      }
                      onClick={() => this.setTitleActive("Payroll")}
                    >
                      {" "}
                      <Link to="/payrolllist">
                        {" "}
                        <span className="subtitle">Payroll</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <hr />
              </div>
            </div>
          </div>

          <div className="main_container">
            <Switch>
              <Route exact path="/">
                <Dashboard />
              </Route>
              <Route path="/patientlist">
                <PatienList />
              </Route>

              <Route path="/addpatient">
                <AddPersonDetails />
              </Route>

              <Route path="/editpersondetails">
                <EditPersonDetails />
              </Route>

              <Route path="/doctorslist">
                <DoctorsLis />
              </Route>
              <Route path="/bedlist">
                <Bedlist />
              </Route>
              <Route path="/bedlistt/bedallotment">
                <BedAllotment />
              </Route>
              <Route path="/medicinelist">
                <MedicineList />
              </Route>
              <Route path="/bloodbaglist">
                <BloodBagList />
              </Route>

              <Route path="/operationreportlist/operationreport">
                <OperationAllotment />
              </Route>
              <Route path="/operationreportlist">
                <OperationReportList />
              </Route>
              <Route path="/deathreportlist/deathreportallotment">
                <DeathRepotAllotment />
              </Route>
              <Route path="/deathreportlist">
                <DeathReportList />
              </Route>
              <Route path="/birthreportlist/birthreportallotment">
                <BirthRepotAllotment />
              </Route>
              <Route path="/birthreportlist">
                <BirthReportList />
              </Route>
              <Route path="/nurselist">
                <NurseList />
              </Route>
              <Route path="/pharmacistslist">
                <PharmacistsList />
              </Route>

              <Route path="/laboratoristlist">
                <LaboratoristList />
              </Route>

              <Route path="/accountantlist">
                <AccountantList />
              </Route>

              <Route path="/receptionistlist">
                <ReceptionistList />
              </Route>

              <Route path="/createpayroll">
                <CreatePayRoll />
              </Route>
              <Route path="/payrolllist">
                <PayrollList />
              </Route>
              <Redirect to="" />
            </Switch>
          </div>
        </Routers>
      </div>
    );
  }
}
const mapDisptachToProps = (dispatch) => {
  return {
    setOnLogInDetails: (p) => {
      dispatch(setLogInDetails(p));
    },
  };
};
export default connect(null, mapDisptachToProps)(SideNavBar);
