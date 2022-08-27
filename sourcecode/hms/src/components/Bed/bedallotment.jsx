import React, { Component } from "react";
import firebase from "../../firebase";
import "./bedallotment.css";
import FormPrompt from "../DailogBoxes/formprompt";
import Service from "../../Service/firebase";
import ErorrDialogBox from "../DailogBoxes/errordaologbox";
import AlertDialogBox from "../DailogBoxes/alertdailogbox";

class BedAllotment extends Component {
  constructor() {
    super();
    this.state = {
      selectedPatiendId: "",
      serachText: "",

      limit: 10,
      totalNumOfPatient: null,
      noMoredataText: "",

      bedTypes: ["Type-1", "Type-2"],

      isLoadMoredata: false,
      isBedAllotted: false,
      isPromptLoading: false,
      isCloseBtnAppear: true,
      isSearching: false,
      isSearchDataShow: false,
      isLoading: true,

      openErrorDailog: false,
      openFormDailog: false,
      patientlist: [],

      openAlertDailog: false,
    };
  }
  componentDidMount() {
    this.onSetTotalNumOfPatient();
    this.onFetchData(this.state.limit);
    this.onSetBedTypes();
  }

  showMore = () => {
    if (this.state.limit <= this.state.totalNumOfPatient) {
      const limit = this.state.limit + 10;

      this.setState({ limit: limit });
      this.onFetchData(limit);
    } else {
      this.setState({
        noMoredataText: "No More Patients",
      });
    }
  };
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
      this.setState({ isLoading: false, isLoadMoredata: false });
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
  handleSetCloseDailog = () => {
    this.setState({
      setAlertOpenDailog: false,
      openAlertDailog: false,
    });
  };
  handleSubmit = async (event) => {
    this.setState({
      isPromptLoading: true,
      isCloseBtnAppear: false,
    });
    const data = new FormData(event.target);
    const sendData = {
      allotedbednum: data.get("bedNum"),
      allotedbedtype: data.get("bedType"),
      caretaker: data.get("careTaker"),
      isadmitted: true,
      isDischarged: false,
      dischargedate: "",
      dischargetime: "",
      searchbyname: this.state.selectedPatiendName
        .toLowerCase()
        .replace(/\s/g, ""),
      allotedbeddatetime: firebase.firestore.Timestamp.fromDate(new Date()),
      isadmittedbefore: true,
      patientname: this.state.selectedPatiendName,
      patientid: this.state.selectedPatiendId,
      timeStamp: firebase.firestore.Timestamp.fromDate(new Date()),
    };
    const res = await Service.addDataAndReturnId(
      sendData,
      "beds",
      "bedallotementid"
    );
    if (res === "error") {
      this.setState({
        isPromptLoading: false,
        openFormDailog: false,
        isCloseBtnAppear: true,
        openErrorDailog: true,
      });
    } else {
      const docId = res;
      const sendData = {
        isBedAllotted: true,
        bedallotementid: docId,
      };
      const result = await Service.updateData(
        sendData,
        "patients",
        this.state.selectedPatiendId
      );
      if (result === "success") {
        this.setState({
          isPromptLoading: false,
          openFormDailog: false,
          isCloseBtnAppear: true,
          openAlertDailog: true,
        });

        // window.location.reload(false);
      } else {
        this.setState({
          isPromptLoading: false,
          openFormDailog: false,
          isCloseBtnAppear: true,
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
  closeErrorDailog = () => {
    this.setState({
      openErrorDailog: false,
    });
  };
  closeAlertDailog = () => {
    this.setState({
      openAlertDailog: false,
    });
    window.location = "/bedlist";
  };

  render() {
    let count = 0;
    return this.state.isLoading ? (
      <div className="bedallotmentpage">
        <i className="fas fa-spinner fa-pulse fa-2x"></i>
      </div>
    ) : (
      <div className="bedallotmentpage">
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
                <h5>BedAllotment</h5>
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
            title="Allot New Patient"
            onSetOpenDailog={this.closeFormDailog}
            isCloseBtnAppear={this.state.isCloseBtnAppear}
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
                      className="custom-select"
                      id="validationDefault10"
                    ></input>
                  </div>
                </div>

                <div className="form-row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="validationDefault10">Bed Type</label>
                    <select
                      name="bedType"
                      className="custom-select"
                      id="validationDefault10"
                      required
                    >
                      {this.state.bedTypes.map((option) => {
                        return <option>{option}</option>;
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
                      required
                    />
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
          <table className="table table-striped">
            <thead className="thead tablehead">
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
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Option</th>
              </tr>
            </thead>
            {this.state.isSearching ? (
              <i className="fas fa-spinner fa-pulse fa-2x "></i>
            ) : this.state.patientlist.length === 0 ? (
              <tbody>
                <tr>
                  <td>No Patients Found</td>
                </tr>
              </tbody>
            ) : (
              <tbody className="tablebody">
                {this.state.patientlist &&
                  this.state.patientlist.map((p) => {
                    count++;
                    let date = new Date(p.timeStamp.toDate());
                    const createdTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    const createdDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
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
                          {createdDate === "" ? "N/A" : createdDate}
                        </td>
                        <td className="align-middle">
                          {createdTime === "" ? "N/A" : createdTime}
                        </td>
                        <td className="align-middle">
                          {p.isBedAllotted ? (
                            " Allotted"
                          ) : (
                            <div>
                              <button
                                onClick={() => {
                                  this.setState({
                                    selectedPatiendId: p.patientid,
                                    selectedPatiendName:
                                      p.firstname + " " + p.lastname,

                                    openFormDailog: true,
                                  });
                                }}
                                type="button"
                                className="btn btn-success"
                              >
                                + Allot
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
                onClick={this.showMore}
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

export default BedAllotment;
