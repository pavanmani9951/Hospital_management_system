import React, { Component } from "react";
import "./receptionistlist.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setpersonDetails } from "../../actions/setpersondetailsaction";
import FormPrompt from "../DailogBoxes/formprompt";
import AddPersonDetails from "../PersonDetails/addpersondetails";
import AlertDialogBox from "../DailogBoxes/alertdailogbox";
import ConfirmDialogBox from "../DailogBoxes/confirmdailogbox";
import ErorrDialogBox from "../DailogBoxes/errordaologbox";
import Service from "../../Service/firebase";

class ReceptionistList extends Component {
  constructor() {
    super();
    this.state = {
      serachText: "",
      isLoading: true,
      limit: 10,

      isLoadMoredata: false,
      isCloseBtnAppear: true,
      isDeleting: false,

      totalNumOfReceptionist: null,
      noMoredataText: "",

      openFormDailog: false,
      openAlertDailog: false,
      openErrorDailog: false,
      openConfirmDailog: false,

      receptionistList: [],
      isSearching: false,
      isSearchDataShow: false,

      selecteReceptionistName: "",
      selectedReceptionistId: "",
    };
  }
  componentDidMount() {
    this.onSetTotalNumOfReceptionist();
    this.onFetchData(this.state.limit);
  }

  showMore() {
    if (this.state.limit <= this.state.totalNumOfReceptionist) {
      const limit = this.state.limit + 10;
      console.log(this.state.totalNumOfReceptionist);
      this.setState({ limit: limit });
      this.onFetchData(limit);
    } else {
      this.setState({
        noMoredataText: "No More Receptionist",
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
        "receptionist",
        searchText
      );
      if (resultPatientlist === "error") {
        this.setState({
          isSearching: false,
          openErrorDailog: true,
        });
      } else {
        this.setState({
          receptionistList: resultPatientlist,
          isSearching: false,
        });
      }
    }
  };
  async onSetTotalNumOfReceptionist() {
    this.setState({ isLoading: true });
    const res = await Service.getTotalNumOfPerson("receptionist");
    if (res === "error") {
      console.log("error");
      this.setState({ isLoading: false });
    } else {
      this.setState({ totalNumOfReceptionist: res, isLoading: false });
    }
  }

  async onFetchData(limit) {
    this.setState({ isLoadMoredata: true });

    const fetchedDataList = await Service.getData("receptionist", limit);

    if (fetchedDataList.length !== 0) {
      this.setState({
        receptionistList: fetchedDataList,
        isLoadMoredata: false,
        isLoading: false,
      });
    } else {
      this.setState({
        receptionistList: fetchedDataList,
        isLoadMoredata: false,
        isLoading: false,
      });
    }
  }

  handleOnDelete = (receptionistName, id) => {
    this.setState({
      selecteReceptionistName: receptionistName,
      selectedReceptionistId: id,
      openConfirmDailog: true,
    });
  };
  deleteData = async () => {
    this.setState({ isDeleting: true });
    const res = await Service.deleteData(
      "receptionist",
      this.state.selectedReceptionistId
    );
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
      <div className="receptionistListpage">
        <i className="fas fa-spinner fa-pulse fa-2x "></i>
      </div>
    ) : (
      <div className="receptionistListpage">
        <div className="main_section">
          <ConfirmDialogBox
            openDailog={this.state.openConfirmDailog}
            onSetOpenDailog={this.closeConfirmDailog}
            handleConfirmOkBtn={this.deleteData}
            isLoading={this.state.isDeleting}
            title="Delete"
            des={
              "Are you sure to delete " +
              this.state.selecteReceptionistName +
              " " +
              "details"
            }
          ></ConfirmDialogBox>
          <AlertDialogBox
            openDailog={this.state.openAlertDailog}
            onSetOpenDailog={this.closeAlertDailog}
            title="Added"
            des="New receptionist has been added sccessfully"
          ></AlertDialogBox>
          <ErorrDialogBox
            openDailog={this.state.openErrorDailog}
            onSetOpenDailog={this.closeErrorDailog}
            title="Error"
            des="Someting went wrong. Try again"
          ></ErorrDialogBox>

          <FormPrompt
            openDailog={this.state.openFormDailog}
            title="Add New Receptionist"
            onSetOpenDailog={this.closeFormDailog}
            isCloseBtnAppear={this.state.isCloseBtnAppear}
          >
            <AddPersonDetails
              setCloseBtnAppear={this.setCloseBtnAppear}
              handleSuccessDailog={this.handleSuccessDailog}
              handleErrorDailog={this.handleErrorDailog}
              collectionName="receptionist"
              id="receptionistid"
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
                <h5>Receptionist</h5>
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
                      placeholder="Search receptionist by full name"
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
                  {this.state.receptionistList.length}{" "}
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
              + Add receptionist
            </button>
          </div>
          <table className="table  table-striped">
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
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Option</th>
              </tr>
            </thead>
            {this.state.isSearching ? (
              <i className="fas fa-spinner fa-pulse fa-2x "></i>
            ) : this.state.receptionistList.length === 0 ? (
              <tbody>
                <tr>
                  <td>No Receptionist Found</td>
                </tr>
              </tbody>
            ) : (
              <tbody className="tablebody">
                {this.state.receptionistList &&
                  this.state.receptionistList.map((p) => {
                    count++;

                    let date = new Date(p.timeStamp.toDate());
                    const createdTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    const createdDate = `${date.getDate()}/${
                      date.getMonth() + 1
                    }/${date.getFullYear()}`;

                    return (
                      <tr key={p.receptionistid}>
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
                                  collectionName: "receptionist",
                                  personId: p.receptionistid,
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
                                p.receptionistid
                              );
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
            {this.state.receptionistList.length === 0 ? null : this.state
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

export default connect(null, mapDisptachToProps)(ReceptionistList);
