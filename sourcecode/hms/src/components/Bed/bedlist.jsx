import React, { Component } from "react";
import firebase from "../../firebase";
import "./bedlist.css";
import { Link } from "react-router-dom";
import FormPrompt from "../DailogBoxes/formprompt";
import {
  TimePicker,
  DatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Service from "../../Service/firebase";
import ConfirmDialogBox from "../DailogBoxes/confirmdailogbox";
import ErorrDialogBox from "../DailogBoxes/errordaologbox";
class BedList extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      limit: 10,
      isCloseBtnAppear: true,

      totalNumOfPatient: null,
      noMoredataText: "",

      bedTypes: ["Type-1", "Type-2"],
      isBedAllotted: true,
      isSearching: false,
      isSearchDataShow: false,
      serachText: "",
      selectedBedAllotmentId: "",
      careTaker: "",
      bedType: "",
      bedNum: "",
      selectedPatientName: "",
      selectedPatientID: "",
      dischargetime: new Date(), // `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
      dischargedate: new Date(), //`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,

      isGoingToBeDischarge: "",
      isDischarged: false,
      isadmitted: true,
      isPromptLoading: false,
      isLoadMoredata: false,

      allotedbedlist: [],
      openConfirmDailog: false,
      isDeleting: false,
      openErrorDailog: false,
      openFormDailog: false,
    };
  }
  componentDidMount() {
    this.onSettotalNumOfPatients();
    this.onFetchData(this.state.limit);
    this.onSetBedTypes();
  }

  onSetBedTypes() {
    const db = firebase.firestore();
    db.collection("beds")
      .doc("bedtypes")
      .get()
      .then((doc) => {
        let bedTypes = doc.data().bedtypes;

        this.setState({
          bedTypes: bedTypes,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }
  showMore() {
    if (this.state.limit <= this.state.totalNumOfPatient) {
      const limit = this.state.limit + 10;
      console.log(this.state.totalNumOfPatient);
      this.setState({ limit: limit });
      this.onFetchData(limit);
    } else {
      this.setState({
        noMoredataText: "No more allotted patients",
      });
    }
  }
  onSettotalNumOfPatients() {
    const db = firebase.firestore();
    db.collection("beds")
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

    const fetchedDataList = await Service.getData("beds", limit);

    if (fetchedDataList.length !== 0) {
      this.setState({
        allotedbedlist: fetchedDataList,
        isLoadMoredata: false,
        isLoading: false,
      });
    } else {
      this.setState({ isLoading: false, isLoadMoredata: false });
    }
  }

  handleOnDelete = async () => {
    this.setState({
      isDeleting: true,
    });

    const res = await Service.deleteData(
      "beds",
      this.state.selectedBedAllotmentId
    );

    if (res === "success") {
      const sendData = {
        bedallotementid: "",
        isBedAllotted: false,
      };
      const result = await Service.updateData(
        sendData,
        "patients",
        this.state.selectedPatientID
      );
      if (result === "success") {
        this.setState({
          isDeleting: false,
          openConfirmDailog: false,
        });
        window.location.reload(false);
      } else {
        this.setState({
          isDeleting: false,
          openConfirmDailog: false,
          openErrorDailog: true,
        });
      }
    }
  };
  handleSeach = async () => {
    if (this.state.serachText === "" || null) {
      window.location.reload(false);
    } else {
      this.setState({
        isSearching: true,
        isSearchDataShow: true,
      });

      const searchText = this.state.serachText.toLowerCase().replace(/\s/g, "");
      const resultPatientlist = await Service.getSearchRes("beds", searchText);
      if (resultPatientlist === "error") {
        this.setState({
          isSearching: false,
          openErrorDailog: true,
        });
      } else {
        this.setState({
          allotedbedlist: resultPatientlist,
          isSearching: false,
        });
      }
    }
  };

  handleSubmit = async (event) => {
    const data = new FormData(event.target);
    this.setState({
      isPromptLoading: true,
      isCloseBtnAppear: false,
    });
    if (!this.state.isDischarged) {
      this.setState({
        dischargetime: "",
        dischargedate: "",
      });
    }
    const sendData = {
      allotedbednum: data.get("bedNum"),
      allotedbedtype: data.get("bedType"),
      caretaker: data.get("careTaker"),
      dischargetime: this.state.dischargetime,
      dischargedate: this.state.dischargedate,
      isDischarged: this.state.isDischarged,
      isadmitted: this.state.isadmitted,
      isBedAllotted: this.state.isBedAllotted,
    };
    const res = await Service.updateData(
      sendData,
      "beds",
      this.state.selectedBedAllotmentId
    );
    if (res === "success") {
      const sendData = {
        isBedAllotted: this.state.isBedAllotted,
      };
      const result = await Service.updateData(
        sendData,
        "patients",
        this.state.selectedPatientID
      );
      if (result === "success") {
        this.setState({
          isPromptLoading: false,
          isCloseBtnAppear: false,
          openFormDailog: false,
        });
        window.location.reload(false);
      } else {
        this.setState({
          isPromptLoading: false,
          openErrorDailog: true,
        });
      }
    } else {
      this.setState({
        isPromptLoading: false,
        openErrorDailog: true,
      });
    }
  };
  onEdit = (e) => {
    this.setState({
      [e.target.name]: [e.target.value],
    });
  };

  isGoingToBeDischarge = (e) => {
    this.setState({
      isDischarged: e.target.checked,
    });
    if (e.target.checked) {
      this.setState({
        isadmitted: false,
        isBedAllotted: false,
        isGoingToBeDischarge: "",
        dischargedate: new Date(),
        dischargetime: new Date(),
      });
    } else {
      this.setState({
        isBedAllotted: true,
        isadmitted: true,
        isGoingToBeDischarge: "false",
        dischargedate: "", //  new Date(),
        dischargetime: "", //</td>new Date(),
      });
    }
  };
  handleDateChange = (date) => {
    this.setState({
      dischargedate: date,
    });
  };
  handleTimeChange = (date) => {
    this.setState({
      dischargetime: date,
    });
  };
  closeConfirmDailog = () => {
    this.setState({
      openConfirmDailog: false,
    });
  };
  closeErrorDailog = () => {
    this.setState({
      openErrorDailog: false,
    });
  };

  handleErrorDailog = () => {
    this.setState({
      openFormDailog: false,
      openConfirmDailog: false,
      openErrorDailog: true,
    });
  };
  setCloseBtnAppear = () => {
    this.setState({
      isCloseBtnAppear: false,
    });
  };
  closeFormDailog = () => {
    this.setState({
      openFormDailog: false,
    });
  };
  render() {
    let count = 0;
    return this.state.isLoading ? (
      <div className="bedlistpage">
        <i className="fas fa-spinner fa-pulse fa-2x"></i>
      </div>
    ) : (
      <div className="bedlistpage">
        <div className="main_section">
          <div className="topheader">
            <ul>
              <li>
                <i
                  className="fa fa-arrow-circle-o-right fa-2x"
                  aria-hidden="true"
                ></i>
              </li>
              <li>
                <h5>BedList</h5>
              </li>
            </ul>
          </div>
          <hr />
          <div className="top_section">
            <ConfirmDialogBox
              openDailog={this.state.openConfirmDailog}
              onSetOpenDailog={this.closeConfirmDailog}
              handleConfirmOkBtn={this.handleOnDelete}
              isLoading={this.state.isDeleting}
              title="Delete"
              des={
                "Are you sure to delete " +
                this.state.selectedPatientName +
                " " +
                "details"
              }
            ></ConfirmDialogBox>
            <ErorrDialogBox
              openDailog={this.state.openErrorDailog}
              onSetOpenDailog={this.closeErrorDailog}
              title="Error"
              des="Someting went wrong. Try again"
            ></ErorrDialogBox>
            <FormPrompt
              onSetOpenDailog={this.closeFormDailog}
              isCloseBtnAppear={this.state.isCloseBtnAppear}
              openDailog={this.state.openFormDailog}
              title={"Mr/Mrs: " + this.state.selectedPatientName}
            >
              {this.state.isPromptLoading ? (
                <i
                  className="fas fa-spinner fa-pulse fa-2x"
                  style={{ position: "relative", top: " 0%", left: "40%" }}
                ></i>
              ) : (
                <form onSubmit={this.handleSubmit}>
                  <div className="form-row">
                    <div className="col-md">
                      <label htmlFor="validationDefault10">Care Taker</label>
                      <input
                        name="careTaker"
                        className="form-control"
                        value={this.state.careTaker}
                        onChange={this.onEdit}
                      ></input>
                    </div>
                  </div>
                  <div style={{ height: "10px" }}></div>

                  <div className="form-row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="validationDefault10">Bed Type</label>
                      <select
                        name="bedType"
                        className="custom-select"
                        value={this.state.bedType}
                        onChange={this.onEdit}
                        required
                      >
                        {this.state.bedTypes.map((option) => {
                          return <option key={Math.random()}>{option}</option>;
                        })}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="validationDefault11">Bed Number</label>
                      <input
                        name="bedNum"
                        type="number"
                        className="form-control"
                        id="validationDefault11"
                        value={this.state.bedNum}
                        onChange={this.onEdit}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="invalidCheck2"
                        checked={this.state.isDischarged}
                        onChange={this.isGoingToBeDischarge}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="invalidCheck2"
                      >
                        {"Discharge Mr/Mrs: " +
                          this.state.selectedPatientName +
                          "  "}
                      </label>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="validationDefault11">
                        Discharge Date
                      </label>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                          style={{
                            padding: "0px 10px",
                            border: "1px solid rgb(197, 197, 197)",
                          }}
                          name="dischargedate"
                          className="  form-control"
                          InputProps={{
                            disableUnderline: true,
                          }}
                          readOnly={this.state.isGoingToBeDischarge}
                          value={
                            this.state.dischargedate === ""
                              ? new Date()
                              : this.state.dischargedate
                          }
                          onChange={this.handleDateChange}
                          autoComplete="off"
                          format="MM/dd/yyyy"
                        />
                      </MuiPickersUtilsProvider>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="validationDefault11">
                        Discharge Time
                      </label>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <TimePicker
                          style={{
                            padding: "0px 10px",
                            border: "1px solid rgb(197, 197, 197)",
                          }}
                          InputProps={{
                            disableUnderline: true,
                          }}
                          name="dischargetime"
                          className="  form-control"
                          readOnly={this.state.isGoingToBeDischarge}
                          value={
                            this.state.dischargetime === ""
                              ? new Date()
                              : this.state.dischargetime
                          }
                          onChange={this.handleTimeChange}
                          autoComplete="off"
                        />
                      </MuiPickersUtilsProvider>
                    </div>
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
                    >
                      Ok
                    </button>
                  </div>
                </form>
              )}
            </FormPrompt>{" "}
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
                  {this.state.allotedbedlist.length}{" "}
                </li>
              </ul>
            </div>
            <Link to="/bedlistt/bedallotment">
              <button type="button" className="btn btn-warning">
                + Add Allotment
              </button>
            </Link>
          </div>
          <table className="table table-striped">
            <thead className="thead tablehead">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Bed Number</th>
                <th scope="col">Type</th>
                <th scope="col">Patient Name</th>
                <th scope="col">Allotment Date</th>
                <th scope="col">Allotment Time</th>
                <th scope="col">Discharge Date</th>
                <th scope="col">Discharge Time</th>
                <th scope="col">Care Taker</th>
                <th scope="col">Option</th>
              </tr>
            </thead>
            {this.state.isSearching ? (
              <i className="fas fa-spinner fa-pulse fa-2x "></i>
            ) : this.state.allotedbedlist.length === 0 ? (
              <tbody>
                <tr>
                  <td>No Patient Found</td>
                </tr>
              </tbody>
            ) : (
              <tbody className="tablebody">
                {this.state.allotedbedlist &&
                  this.state.allotedbedlist.map((p) => {
                    count++;

                    let alloteddate = new Date(p.allotedbeddatetime.toDate());
                    let dischargeDate = "";
                    let dischargeTime = "";

                    if (p.dischargedate !== "" && p.dischargetime !== "") {
                      dischargeDate = new Date(p.dischargedate.toDate());
                      dischargeTime = new Date(p.dischargetime.toDate());
                    }

                    return (
                      <tr key={p.patientid}>
                        <td className="align-middle">{count}</td>
                        <td className="align-middle">{p.allotedbednum}</td>
                        <td className="align-middle">{p.allotedbedtype}</td>
                        <td className="align-middle">{p.patientname}</td>
                        <td className="align-middle">
                          {alloteddate.getDate()}/{alloteddate.getMonth() + 1}/
                          {alloteddate.getFullYear()}
                        </td>

                        <td className="align-middle">
                          {" "}
                          {alloteddate.getHours()}:{alloteddate.getMinutes()}
                        </td>

                        <td className="align-middle">
                          {p.dischargedate === ""
                            ? "N/A"
                            : `${dischargeDate.getDate()}/${
                                dischargeDate.getMonth() + 1
                              }/
                        ${dischargeDate.getFullYear()}`}
                        </td>

                        <td className="align-middle">
                          {p.dischargetime === ""
                            ? "N/A"
                            : `${dischargeTime.getHours()}:${dischargeTime.getMinutes()}`}
                        </td>
                        <td className="align-middle">
                          {" "}
                          {p.caretaker === "" ? "N/A" : p.caretaker}
                        </td>

                        <td className="align-middle">
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                              this.setState({
                                openFormDailog: true,
                                selectedBedAllotmentId: p.bedallotementid,
                                selectedPatientName: p.patientname,
                                isDischarged: p.isDischarged,

                                bedType: p.allotedbedtype,
                                bedNum: p.allotedbednum,
                                careTaker: p.caretaker,
                                selectedPatientID: p.patientid,
                              });
                              if (p.dischargetime === "") {
                                this.setState({
                                  isGoingToBeDischarge: "false",
                                  dischargedate: "", //  new Date(),
                                  dischargetime: "", //new Date(),
                                });
                              } else {
                                this.setState({
                                  isGoingToBeDischarge: "",
                                  dischargedate: p.dischargedate.toDate(),
                                  dischargetime: p.dischargetime.toDate(),
                                });
                              }
                            }}
                          >
                            <i className="fa fa-edit" aria-hidden="true"></i>
                          </button>

                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                              this.setState({
                                openConfirmDailog: true,
                                selectedBedAllotmentId: p.bedallotementid,
                                selectedPatientID: p.patientid,
                              });

                              // this.handleOnDelete(
                              //   p.firstname + " " + p.lastname,
                              //   p.patientid,
                              //   p.allotedbedtype
                              // );
                            }}
                          >
                            <i className="fa fa-trash" aria-hidden="true"></i>
                          </button>
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
            {this.state.allotedbedlist.length === 0 ? null : this.state
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

export default BedList;
