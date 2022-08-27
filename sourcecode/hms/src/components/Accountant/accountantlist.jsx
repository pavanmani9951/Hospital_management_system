import React, { Component } from "react";
import "./accountantlist.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setpersonDetails } from "../../actions/setpersondetailsaction";
import FormPrompt from "../DailogBoxes/formprompt";
import AddPersonDetails from "../PersonDetails/addpersondetails";
import AlertDialogBox from "../DailogBoxes/alertdailogbox";
import ConfirmDialogBox from "../DailogBoxes/confirmdailogbox";
import ErorrDialogBox from "../DailogBoxes/errordaologbox";
import Service from "../../Service/firebase";

class AccountantList extends Component {
  constructor() {
    super();
    this.state = {
      serachText: "",
      isLoading: true,
      limit: 10,

      isLoadMoredata: false,
      isCloseBtnAppear: true,
      isDeleting: false,

      totalNumOfAccountant: null,
      noMoredataText: "",

      openFormDailog: false,
      openAlertDailog: false,
      openErrorDailog: false,
      openConfirmDailog: false,

      accountantList: [],
      isSearching: false,
      isSearchDataShow: false,

      selecteAccountantName: "",
      selectedAccountantId: "",
    };
  }
  componentDidMount() {
    this.onSetTotalNumOfAccountant();
    this.onFetchData(this.state.limit);
  }

  showMore() {
    if (this.state.limit <= this.state.totalNumOfAccountant) {
      const limit = this.state.limit + 10;
      console.log(this.state.totalNumOfAccountant);
      this.setState({ limit: limit });
      this.onFetchData(limit);
    } else {
      this.setState({
        noMoredataText: "No More Accountant",
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
        "accountant",
        searchText
      );
      if (resultPatientlist === "error") {
        this.setState({
          isSearching: false,
          openErrorDailog: true,
        });
      } else {
        this.setState({
          accountantList: resultPatientlist,
          isSearching: false,
        });
      }
    }
  };
  async onSetTotalNumOfAccountant() {
    this.setState({ isLoading: true });
    const res = await Service.getTotalNumOfPerson("accountant");
    if (res === "error") {
      console.log("error");
      this.setState({ isLoading: false });
    } else {
      this.setState({ totalNumOfAccountant: res, isLoading: false });
    }
  }

  async onFetchData(limit) {
    this.setState({ isLoadMoredata: true });

    const fetchedDataList = await Service.getData("accountant", limit);

    if (fetchedDataList.length !== 0) {
      this.setState({
        accountantList: fetchedDataList,
        isLoadMoredata: false,
        isLoading: false,
      });
    } else {
      this.setState({
        accountantList: fetchedDataList,
        isLoadMoredata: false,
        isLoading: false,
      });
    }
  }

  handleOnDelete = (accountantName, id) => {
    this.setState({
      selecteAccountantName: accountantName,
      selectedAccountantId: id,
      openConfirmDailog: true,
    });
  };
  deleteData = async () => {
    this.setState({ isDeleting: true });
    const res = await Service.deleteData(
      "accountant",
      this.state.selectedAccountantId
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
      <div className="accountantListpage">
        <i className="fas fa-spinner fa-pulse fa-2x "></i>
      </div>
    ) : (
      <div className="accountantListpage">
        <div className="main_section">
          <ConfirmDialogBox
            openDailog={this.state.openConfirmDailog}
            onSetOpenDailog={this.closeConfirmDailog}
            handleConfirmOkBtn={this.deleteData}
            isLoading={this.state.isDeleting}
            title="Delete"
            des={
              "Are you sure to delete " +
              this.state.selecteAccountantName +
              " " +
              "details"
            }
          ></ConfirmDialogBox>
          <AlertDialogBox
            openDailog={this.state.openAlertDailog}
            onSetOpenDailog={this.closeAlertDailog}
            title="Added"
            des="New accountant has been added sccessfully"
          ></AlertDialogBox>
          <ErorrDialogBox
            openDailog={this.state.openErrorDailog}
            onSetOpenDailog={this.closeErrorDailog}
            title="Error"
            des="Someting went wrong. Try again"
          ></ErorrDialogBox>

          <FormPrompt
            openDailog={this.state.openFormDailog}
            title="Add New accountant"
            onSetOpenDailog={this.closeFormDailog}
            isCloseBtnAppear={this.state.isCloseBtnAppear}
          >
            <AddPersonDetails
              setCloseBtnAppear={this.setCloseBtnAppear}
              handleSuccessDailog={this.handleSuccessDailog}
              handleErrorDailog={this.handleErrorDailog}
              collectionName="accountant"
              id="accountantid"
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
                <h5>Accountant</h5>
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
                      placeholder="Search accountant by full name"
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
                  {this.state.accountantList.length}{" "}
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
              + Add accountant
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
            ) : this.state.accountantList.length === 0 ? (
              <tbody>
                <tr>
                  <td>No accountant Found</td>
                </tr>
              </tbody>
            ) : (
              <tbody className="tablebody">
                {this.state.accountantList &&
                  this.state.accountantList.map((p) => {
                    count++;

                    let date = new Date(p.timeStamp.toDate());
                    const createdTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    const createdDate = `${date.getDate()}/${
                      date.getMonth() + 1
                    }/${date.getFullYear()}`;

                    return (
                      <tr key={p.accountantid}>
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
                                  collectionName: "accountant",
                                  personId: p.accountantid,
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
                                p.accountantid
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
            {this.state.accountantList.length === 0 ? null : this.state
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

export default connect(null, mapDisptachToProps)(AccountantList);
