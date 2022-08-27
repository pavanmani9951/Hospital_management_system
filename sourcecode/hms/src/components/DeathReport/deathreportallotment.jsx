import React, { Component } from "react";
import firebase from "../../firebase";
import "./deathreportallotment.css";
import FormPrompt from "../DailogBoxes/formprompt";
import Service from "../../Service/firebase";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import AlertDialogBox from "../DailogBoxes/alertdailogbox";
import ErorrDialogBox from "../DailogBoxes/errordaologbox";

class DeathRepotAllotment extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      deathAllotedDate: new Date(),
      limit: 10,
      isLoadMoredata: false,
      totalNumOfPatient: null,
      noMoredataText: "",

      isPromptLoading: false,
      isCloseBtnAppear: true,

      selectedPatienName: "",
      doctorList: ["doctor-1", "doctor-2"],
      selectedPatiendId: "",

      startDate: new Date(),
      isSearching: false,
      isSearchDataShow: false,
      serachText: "",
      patientlist: [],

      openAlertDailog: false,
      openErrorDailog: false,
      openFormDailog: false,
    };
  }
  componentDidMount() {
    this.onSetTotalNumOfPatient();
    this.onFetchData(this.state.limit);
    this.fetchDoctorList();
  }
  async fetchDoctorList() {
    const db = firebase.firestore();
    await db
      .collection("doctors")
      .orderBy("timeStamp", "desc")
      .get()
      .then((snapshot) => {
        const fetchedDataList = [];

        snapshot.docs.forEach((doc) => {
          fetchedDataList.push({
            firstname: doc.data().firstname,
            lastname: doc.data().lastname,
            doctorid: doc.data().doctorid,
          });
        });
        console.log("Data fetched ");
        this.setState({
          doctorList: fetchedDataList,
        });
      })
      .catch((e) => {
        console.log("Error during fetching data" + e);
      });
  }

  showMore() {
    if (this.state.limit <= this.state.totalNumOfPatient) {
      const limit = this.state.limit + 10;
      this.setState({ limit: limit });
      this.onFetchData(limit);
    } else {
      this.setState({
        noMoredataText: "No More Patients",
      });
    }
  }
  onSetTotalNumOfPatient() {
    const db = firebase.firestore();
    db.collection("patients")
      .get()
      .then((snapshot) => {
        this.setState({ totalNumOfPatient: snapshot.docs.length });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async onFetchData(limit) {
    this.setState({ isLoadMoredata: true });

    const fetchedDataList = await Service.getData("patients", limit);

    if (fetchedDataList.length !== 0) {
      this.setState({
        patientlist: fetchedDataList,
        isLoadMoredata: false,
        isLoading: false,
      });
    } else {
      this.setState({
        patientlist: fetchedDataList,
        isLoadMoredata: false,
        isLoading: false,
      });
    }
  }
  handleSeach = async () => {
    if (this.state.serachText === "" || null) {
      window.location.reload(false);
    } else {
      this.setState({
        isSearching: true,
        isSearchDataShow: true,
      });

      const searchText = this.state.serachText.toLowerCase().replace(/\s/g, "");
      const resultPatientlist = await Service.getSearchRes(
        "patients",
        searchText
      );
      if (resultPatientlist === "error") {
        this.setState({
          isSearching: false,
          openErrorDailog: true,
        });
      } else {
        this.setState({
          patientlist: resultPatientlist,
          isSearching: false,
        });
      }
    }
  };
  handleFormDailogToClose = () => {
    this.setState({
      openFormDailog: false,
    });
  };
  hanldeSubmit = async (event) => {
    const data = new FormData(event.target);

    this.setState({
      isPromptLoading: true,
    });
    const sendData = {
      doctorname: data.get("doctor"),
      date: data.get("deathalloteddate"),
      remark: data.get("remark"),
      description: data.get("description"),
      status: data.get("status"),
      patientid: this.state.selectedPatiendId,
      patientname: this.state.selectedPatienName,
      timeStamp: firebase.firestore.Timestamp.fromDate(new Date()),
      searchbyname: this.state.selectedPatienName
        .toLowerCase()
        .replace(/\s/g, ""),
    };
    const docId = await Service.addDataAndReturnId(
      sendData,
      "deathreport",
      "deathreportid"
    );

    if (docId === "error") {
      this.setState({
        openFormDailog: false,
        isPromptLoading: false,
      });
    } else {
      const sendData = {
        deathreportid: docId,
        isBeforeDeathAlloted: true,
      };
      const res = await Service.updateData(
        sendData,
        "patients",
        this.state.selectedPatiendId
      );
      if (res === "success") {
        this.setState({
          // isLoading: false,

          openFormDailog: false,
          isPromptLoading: false,
          openAlertDailog: true,
        });
        // window.location.reload(false);
      } else {
        this.setState({
          openFormDailog: false,
          isPromptLoading: false,
          openErrorDailog: true,
        });
      }
    }
  };
  closeFormDailog = () => {
    this.setState({
      openFormDailog: false,
    });
  };
  handleDateChange = (date) => {
    this.setState({
      deathAllotedDate: date,
    });
  };
  handleErrorDailog = () => {
    this.setState({
      openErrorDailog: true,
    });
  };

  closeAlertDailog = () => {
    this.setState({
      openAlertDailog: false,
    });
    window.location = "/deathreportlist";
  };
  render() {
    let count = 0;
    return this.state.isLoading ? (
      <div className="deathreportallotmentpage">
        <i className="fas fa-spinner fa-pulse fa-2x"></i>
      </div>
    ) : (
      <div className="deathreportallotmentpage">
        <div className="main_section ">
          <div className="topheader">
            <ul>
              <li>
                <i
                  className="fa fa-arrow-circle-o-right fa-2x"
                  aria-hidden="true"
                ></i>
              </li>
              <li>
                <h5>Death Allotment</h5>
              </li>
            </ul>
          </div>
          <AlertDialogBox
            openDailog={this.state.openAlertDailog}
            onSetOpenDailog={this.closeAlertDailog}
            title="Added"
            des="New Patient has been alloted sccessfully"
          ></AlertDialogBox>

          <ErorrDialogBox
            openDailog={this.state.openErrorDailog}
            onSetOpenDailog={this.closeErrorDailog}
            title="Error"
            des="Someting went wrong. Try again"
          ></ErorrDialogBox>
          <FormPrompt
            openDailog={this.state.openFormDailog}
            title={"Name: " + this.state.selectedPatienName}
            onSetOpenDailog={this.closeFormDailog}
            isCloseBtnAppear={this.state.isCloseBtnAppear}
          >
            {this.state.isPromptLoading ? (
              <i
                className="fas fa-spinner fa-pulse fa-2x"
                style={{ position: "relative", top: " 0%", left: "40%" }}
              ></i>
            ) : (
              <form onSubmit={this.hanldeSubmit}>
                <div className="form-row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="validationDefault11">Doctor</label>
                    <select
                      name="doctor"
                      className="custom-select"
                      id="doctor"
                      required
                    >
                      {this.state.doctorList.map((option) => {
                        return (
                          <option key={Math.random()}>
                            {option.firstname + " " + option.lastname}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="validationDefault11">Date</label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        style={{
                          padding: "5px 10px",
                          border: "1px solid rgb(197, 197, 197)",
                        }}
                        name="deathalloteddate"
                        className="  form-control"
                        InputProps={{
                          disableUnderline: true,
                        }}
                        value={this.state.deathAllotedDate}
                        onChange={this.handleDateChange}
                        autoComplete="off"
                        format="MM/dd/yyyy"
                        required
                      />
                    </MuiPickersUtilsProvider>
                    {/* <DatePicker
                          name="date"
                          className="datepicker form-control"
                          selected={this.state.startDate}
                          value={this.state.startDate}
                          onChange={(date) =>
                            this.setState({
                              startDate: date,
                            })
                          }
                          autoComplete="off"
                          required
                        /> */}
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="validationDefault11">Status</label>
                    <input
                      name="status"
                      type="text"
                      className="form-control"
                      id="status"
                      ///  value={this.state.status}
                      //  onChange={this.onEdit}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="validationDefault11">Remark</label>
                    <input
                      name="remark"
                      type="text"
                      className="form-control"
                      id="remark"
                      ///  value={this.state.remark}
                      //  onChange={this.onEdit}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="validationDefault09">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    id="description"
                    rows="3"
                    // value={this.state.description}
                    //onChange={this.onEdit}
                  ></textarea>
                </div>

                <div
                  className="btnsection"
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    className="btn btn-success"
                    type="submit"
                    style={{
                      borderRadius: "10px",
                      padding: "5px 10px",
                      fontSize: "14px",
                    }}
                    //  onClick={this.handleFormDailog}
                  >
                    Ok
                  </button>
                </div>
              </form>
            )}
          </FormPrompt>

          <div className="top_section">
            <div className="wrap">
              <ul>
                <li>
                  <div className="search">
                    <input
                      type="text"
                      className="searchTerm"
                      placeholder="Search patient by full name"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          this.handleSeach();
                        }
                      }}
                      onChange={(e) => {
                        this.setState({
                          serachText: e.target.value,
                        });
                      }}
                    />

                    <button
                      onClick={this.handleSeach}
                      type="submit"
                      className="searchButton"
                    >
                      <i className="fa fa-search"></i>
                    </button>
                  </div>
                </li>
                <li style={{ fontSize: "14px" }}> #</li>
                <li tyle={{ fontSize: "14px" }}>
                  {this.state.patientlist.length}{" "}
                </li>
              </ul>
            </div>
          </div>
          <table className="table">
            <thead className="thead-dark tablehead">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Profile</th>
                <th scope="col">Name</th>
                <th scope="col">Sex</th>
                <th scope="col">Age</th>
                <th scope="col">Blood Group</th>
                <th scope="col">Mobile</th>
                {/* <th scope="col">Email</th> */}
                <th scope="col">City</th>
                <th scope="col">Option</th>
              </tr>
            </thead>
            {this.state.isSearching ? (
              <i className="fas fa-spinner fa-pulse fa-2x "></i>
            ) : this.state.patientlist.length === 0 ? (
              <tbody>
                <tr>
                  <td>No Patient Found</td>
                </tr>
              </tbody>
            ) : (
              <tbody className="tablebody">
                {this.state.patientlist &&
                  this.state.patientlist.map((p) => {
                    count++;
                    return (
                      <tr key={p.patientid}>
                        <td className="align-middle">{count}</td>
                        <td className="align-middle">
                          {p.imgaeurl === "" ? (
                            <div className="userbg">
                              <i className="fa fa-user fa-2x"></i>
                            </div>
                          ) : (
                            <img className="image" alt="" srcSet={p.imgaeurl} />
                          )}
                        </td>
                        <td className="align-middle">
                          {p.firstname + " " + p.lastname}
                        </td>
                        <td className="align-middle">{p.sex}</td>
                        <td className="align-middle">
                          {p.age === "" ? "N/A" : p.age}
                        </td>
                        <td className="align-middle">
                          {p.bloodgroup === "" ? "N/A" : p.bloodgroup}
                        </td>
                        <td className="align-middle">
                          {" "}
                          {p.phonenumber === "" ? "N/A" : p.phonenumber}
                        </td>
                        {/* <td className="align-middle">
                          {" "}
                          {p.email == "" ? "N/A" : p.email}
                        </td> */}
                        <td className="align-middle">
                          {p.city === "" ? "N/A" : p.city}
                        </td>
                        <td className="align-middle">
                          {p.isBeforeDeathAlloted ? (
                            "Allotted"
                          ) : (
                            <div>
                              <button
                                onClick={() => {
                                  this.setState({
                                    selectedPatienName:
                                      p.firstname + " " + p.lastname,
                                    openFormDailog: true,
                                    selectedPatiendId: p.patientid,
                                  });
                                }}
                                type="button"
                                className="btn btn-success"
                              >
                                +Allot
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            )}
          </table>
          <div className="loadmoredatasection">
            {this.state.isLoadMoredata ? (
              <i className="fas fa-spinner fa-pulse fa-2x loadmoredataspinner"></i>
            ) : (
              <div className="nomoredatatext">{this.state.noMoredataText}</div>
            )}
            {this.state.patientlist.length === 0 ? null : this.state
                .isSearchDataShow ? null : (
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => this.showMore()}
              >
                Show More
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default DeathRepotAllotment;
