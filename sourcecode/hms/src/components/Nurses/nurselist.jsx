import React, { Component } from "react";
import "./nurselist.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setpersonDetails } from "../../actions/setpersondetailsaction";
import FormPrompt from "../DailogBoxes/formprompt";
import AddPersonDetails from "../PersonDetails/addpersondetails";
import AlertDialogBox from "../DailogBoxes/alertdailogbox";
import ConfirmDialogBox from "../DailogBoxes/confirmdailogbox";
import ErorrDialogBox from "../DailogBoxes/errordaologbox";
import Service from "../../Service/firebase";

class NurseList extends Component {
  constructor() {
    super();
    this.state = {
      serachText: "",
      isLoading: true,
      limit: 10,

      isLoadMoredata: false,
      isCloseBtnAppear: true,
      isDeleting: false,

      totalNumOfNurse: null,
      noMoredataText: "",

      openFormDailog: false,
      openAlertDailog: false,
      openErrorDailog: false,
      openConfirmDailog: false,

      nurselist: [],
      isSearching: false,
      isSearchDataShow: false,

      selectedNurseName: "",
      selectedNurseId: "",
    };
  }
  componentDidMount() {
    this.onSetTotalNumOfNurse();
    this.onFatchData(this.state.limit);
  }

  showMore() {
    if (this.state.limit <= this.state.totalNumOfNurse) {
      const limit = this.state.limit + 10;
      console.log(this.state.totalNumOfNurse);
      this.setState({ limit: limit });
      this.onFatchData(limit);
    } else {
      this.setState({
        noMoredataText: "No More Nurses",
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
        "nurses",
        searchText
      );
      if (resultPatientlist === "error") {
        this.setState({
          isSearching: false,
          openErrorDailog: true,
        });
      } else {
        this.setState({
          nurselist: resultPatientlist,
          isSearching: false,
        });
      }
    }
  };
  async onSetTotalNumOfNurse() {
    this.setState({ isLoading: true });
    const res = await Service.getTotalNumOfPerson("nurses");
    if (res === "error") {
      console.log("error");
      this.setState({ isLoading: false });
    } else {
      this.setState({ totalNumOfNurse: res, isLoading: false });
    }
  }

  async onFatchData(limit) {
    this.setState({ isLoadMoredata: true });

    const fetchedDataList = await Service.getData("nurses", limit);

    if (fetchedDataList.length !== 0) {
      this.setState({
        nurselist: fetchedDataList,
        isLoadMoredata: false,
        isLoading: false,
      });
    } else {
      this.setState({
        nurselist: fetchedDataList,
        isLoadMoredata: false,
        isLoading: false,
      });
    }
  }

  handleOnDelete = (nursename, id) => {
    this.setState({
      selectedNurseName: nursename,
      selectedNurseId: id,
      openConfirmDailog: true,
    });
  };
  deleteData = async () => {
    this.setState({ isDeleting: true });
    const res = await Service.deleteData("nurses", this.state.selectedNurseId);
    if (res === "success") {
      this.setState({
        isDeleting: false,
        openConfirmDailog: false,
      });
      window.location.reload(false);
    } else {
      this.setState({
        isDeleting: false,
      });
      this.handleErrorDailog();
    }
  };

  handleSuccessDailog = () => {
    this.setState({
      openFormDailog: false,
      openAlertDailog: true,
    });
  };
  handleErrorDailog = () => {
    this.setState({
      openFormDailog: false,
      openConfirmDailog: false,
      openErrorDailog: true,
    });
  };
  closeFormDailog = () => {
    this.setState({
      openFormDailog: false,
    });
  };
  closeAlertDailog = () => {
    this.setState({
      openAlertDailog: false,
    });
    window.location.reload(false);
  };
  closeErrorDailog = () => {
    this.setState({
      openErrorDailog: false,
    });
  };
  closeConfirmDailog = () => {
    this.setState({
      openConfirmDailog: false,
    });
  };
  setCloseBtnAppear = () => {
    this.setState({
      isCloseBtnAppear: false,
    });
  };

  render() {
    let count = 0;
    return this.state.isLoading ? (
      <div className="nurselistpage">
        <i className="fas fa-spinner fa-pulse fa-2x "></i>
      </div>
    ) : (
      <div className="nurselistpage">
        <div className="main_section">
          <ConfirmDialogBox
            openDailog={this.state.openConfirmDailog}
            onSetOpenDailog={this.closeConfirmDailog}
            handleConfirmOkBtn={this.deleteData}
            isLoading={this.state.isDeleting}
            title="Delete"
            des={
              "Are you sure to delete " +
              this.state.selectedNurseName +
              " " +
              "details"
            }
          ></ConfirmDialogBox>
          <AlertDialogBox
            openDailog={this.state.openAlertDailog}
            onSetOpenDailog={this.closeAlertDailog}
            title="Added"
            des="New nurse has been added sccessfully"
          ></AlertDialogBox>
          <ErorrDialogBox
            openDailog={this.state.openErrorDailog}
            onSetOpenDailog={this.closeErrorDailog}
            title="Error"
            des="Someting went wrong. Try again"
          ></ErorrDialogBox>

          <FormPrompt
            openDailog={this.state.openFormDailog}
            title="Add New Nurse"
            onSetOpenDailog={this.closeFormDailog}
            isCloseBtnAppear={this.state.isCloseBtnAppear}
          >
            <AddPersonDetails
              setCloseBtnAppear={this.setCloseBtnAppear}
              handleSuccessDailog={this.handleSuccessDailog}
              handleErrorDailog={this.handleErrorDailog}
              collectionName="nurses"
              id="nurseid"
            ></AddPersonDetails>
          </FormPrompt>
          <div className="topheader">
            <ul>
              <li>
                <i
                  className="fa fa-arrow-circle-o-right fa-2x"
                  aria-hidden="true"
                ></i>
              </li>
              <li>
                <h5>Nurse</h5>
              </li>
            </ul>
          </div>
          <hr />
          <div className="top_section">
            <div className="wrap">
              <ul>
                <li>
                  <div className="search">
                    <input
                      type="text"
                      className="searchTerm"
                      placeholder="Search nurses by full name"
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
                  {this.state.nurselist.length}{" "}
                </li>
              </ul>
            </div>

            <button
              type="button"
              className="btn btn-warning"
              onClick={() => {
                this.setState({
                  openFormDailog: true,
                });
              }}
            >
              + Add Nurse
            </button>
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
            ) : this.state.nurselist.length === 0 ? (
              <tbody>
                <tr>
                  <td>No Nurse Found</td>
                </tr>
              </tbody>
            ) : (
              <tbody className="tablebody">
                {this.state.nurselist &&
                  this.state.nurselist.map((p) => {
                    count++;

                    let date = new Date(p.timeStamp.toDate());
                    const createdTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    const createdDate = `${date.getDate()}/${
                      date.getMonth() + 1
                    }/${date.getFullYear()}`;

                    return (
                      <tr key={p.nurseid}>
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
                          <Link to="editpersondetails">
                            <button
                              onClick={async () => {
                                const sendData = {
                                  ...p,
                                  collectionName: "nurses",
                                  personId: p.nurseid,
                                };

                                this.props.setOPersonDetails(sendData);
                              }}
                              type="button"
                              className="btn btn-success"
                            >
                              <i className="fa fa-edit" aria-hidden="true"></i>
                            </button>
                          </Link>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                              this.handleOnDelete(
                                p.firstname + " " + p.lastname,
                                p.nurseid
                              );
                            }}
                          >
                            <i className="fa fa-trash"></i>
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
            {this.state.nurselist.length === 0 ? null : this.state
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

const mapDisptachToProps = (dispatch) => {
  return {
    setOPersonDetails: (p) => {
      dispatch(setpersonDetails(p));
    },
  };
};

export default connect(null, mapDisptachToProps)(NurseList);
