import React, { Component } from "react";
import firebase from "../../firebase";
import "./payrolllist.css";
import FormPrompt from "../DailogBoxes/formprompt";
import AlertDialogBox from "../DailogBoxes/alertdailogbox";
import Service from "../../Service/firebase";
import ConfirmDialogBox from "../DailogBoxes/confirmdailogbox";
import Recipt from "./recipt";

class PayrollList extends Component {
  constructor() {
    super();
    this.state = {
      limit: 10,
      isLoadMoredata: false,
      isPromptLoading: false,
      isSearching: false,
      isSearchDataShow: false,
      isCloseBtnAppear: true,
      isLoading: true,

      totalNumOfReports: null,
      noMoredataText: "",

      payList: [],

      setOpenAlertDailog: false,
      alertDailogBoxTitle: null,
      alertDailogBoxDes: null,
      openConfirmDailog: false,
      openFormDailog: false,
      openReciptDailog: false,

      selectedPayrollID: "",
      selectedEmployeeName: "",
      status: "",
      selectedPayList: { id: 1 },
    };
  }
  componentDidMount() {
    this.onSetTotalNumOfReports();
    this.onFatchData(this.state.limit);
  }
  onSetTotalNumOfReports() {
    const db = firebase.firestore();
    db.collection("payrolllist")
      .get()
      .then((snapshot) => {
        this.setState({ totalNumOfReports: snapshot.docs.length });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  showMore = () => {
    if (this.state.limit <= this.state.totalNumOfReports) {
      const limit = this.state.limit + 10;
      this.setState({ limit: limit });
      this.onFatchData(limit);
    } else {
      this.setState({
        noMoredataText: "No More Paylist",
      });
    }
  };

  async onFatchData(limit) {
    this.setState({ isLoadMoredata: true });
    const fetchDataList = await Service.getData("payrolllist", limit);
    if (fetchDataList.length !== 0) {
      this.setState({
        payList: fetchDataList,
        isLoadMoredata: false,
        isLoading: false,
      });
    } else {
      this.setState({
        isLoadMoredata: false,
        isLoading: false,
      });
    }
  }

  handleOnDelete = async () => {
    this.setState({ isDeleting: true });
    const res = await Service.deleteData(
      "payrolllist",
      this.state.selectedPayrollID
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
        openConfirmDailog: false,
      });
    }
  };
  handleSeach = () => {
    if (this.state.serachText === "" || null) {
      window.location.reload(false);
    } else {
      this.setState({
        isSearching: true,
        isSearchDataShow: true,
      });
      const searchText = this.state.serachText.toLowerCase().replace(/\s/g, "");

      const db = firebase.firestore();
      db.collection("payrolllist")
        .orderBy("searchbyname")
        .startAt(searchText)
        .endAt(searchText + "\uf8ff")
        .get()
        .then((snapshot) => {
          const resultlist = [];

          snapshot.docs.forEach((doc) => {
            console.log(doc.data());
            resultlist.push(doc.data());
          });
          this.setState({
            payList: resultlist,
          });
          this.setState({
            isSearching: false,
          });
        })
        .catch((e) => {
          this.setState({
            isSearching: false,
          });
          console.log(e);
        });
    }
  };
  handleAlertDailog = () => {
    this.setState({
      openAlertDailog: false,
    });
    window.location.reload(false);
  };

  handleSubmit = async (event) => {
    const data = new FormData(event.target);

    this.setState({
      isPromptLoading: true,
      isCloseBtnAppear: false,
    });
    const sendData = {
      status: data.get("status"),
    };
    const res = await Service.updateData(
      sendData,
      "payrolllist",
      this.state.selectedPayrollID
    );
    if (res === "success") {
      this.setState({
        openFormDailog: false,
        isPromptLoading: false,
        openAlertDailog: true,
        isCloseBtnAppear: true,
        alertDailogBoxTitle: "Update",
        alertDailogBoxDes: "successfully Updated",
      });
    } else {
      this.setState({
        openFormDailog: false,
        isPromptLoading: false,
        openAlertDailog: true,
        isCloseBtnAppear: true,
        alertDailogBoxTitle: "Error",
        alertDailogBoxDes: "Something went wrong",
      });
    }
  };

  onEdit = (e) => {
    this.setState({
      [e.target.name]: [e.target.value],
    });
  };

  closeFormDailog = () => {
    this.setState({
      openFormDailog: false,
    });
  };
  closeReciptDailog = () => {
    this.setState({
      openReciptDailog: false,
    });
  };

  closeConfirmDailog = () => {
    this.setState({
      openConfirmDailog: false,
    });
  };
  render() {
    let count = 0;
    return this.state.isLoading ? (
      <div className="paylistpage">
        <i className="fas fa-spinner fa-pulse fa-2x"></i>
      </div>
    ) : (
      <div className="paylistpage">
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
                <h5>Payroll</h5>
              </li>
            </ul>
          </div>
          <hr />
          <ConfirmDialogBox
            openDailog={this.state.openConfirmDailog}
            onSetOpenDailog={this.closeConfirmDailog}
            handleConfirmOkBtn={this.handleOnDelete}
            isLoading={this.state.isDeleting}
            title="Delete"
            des={
              "Are you sure to delete " +
              this.state.selectedEmployeeName +
              " " +
              "details"
            }
          ></ConfirmDialogBox>
          <AlertDialogBox
            openDailog={this.state.openAlertDailog}
            setOpenDailog={this.state.setOpenAlertDailog}
            onSetOpenDailog={this.handleAlertDailog}
            title={this.state.alertDailogBoxTitle}
            des={this.state.alertDailogBoxDes}
          />
          <FormPrompt
            openDailog={this.state.openReciptDailog}
            title="Payment Recipt"
            onSetOpenDailog={this.closeReciptDailog}
            isCloseBtnAppear={true}
          >
            <Recipt payList={this.state.selectedPayList}></Recipt>
          </FormPrompt>
          <FormPrompt
            openDailog={this.state.openFormDailog}
            title="Payment Status"
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
                  <div className="col-md-6 mb-3">
                    <label htmlFor="validationDefault11">Mark as </label>
                    <select
                      name="status"
                      className="custom-select"
                      id="status"
                      value={this.state.status}
                      onChange={this.onEdit}
                      required
                    >
                      <option>Paid</option>
                      <option>Unpaid</option>
                    </select>
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
          </FormPrompt>
          <div className="top_section">
            <div className="wrap">
              <ul>
                <li>
                  <div className="search">
                    <input
                      type="text"
                      className="searchTerm"
                      placeholder="Search Employee by full name"
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
                  {this.state.payList.length}{" "}
                </li>
              </ul>
            </div>

            <a href="/createpayroll">
              <button type="button" className="btn btn-warning">
                + create Payroll
              </button>
            </a>
          </div>

          <table className="table table-striped">
            <thead className="thead tablehead">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Id</th>
                <th scope="col">Employee Name</th>
                <th scope="col">Pay</th>
                <th scope="col">Month</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Status</th>
                <th scope="col">Options</th>
              </tr>
            </thead>
            {this.state.isSearching ? (
              <i className="fas fa-spinner fa-pulse fa-2x "></i>
            ) : this.state.payList.length === 0 ? (
              <tbody>
                <tr>
                  <td>No Paylist Found</td>
                </tr>
              </tbody>
            ) : (
              <tbody className="tablebody">
                {this.state.payList &&
                  this.state.payList.map((p) => {
                    count++;
                    const date = new Date(p.timeStamp.toDate());
                    return (
                      <tr key={p.operationreportid}>
                        <th className="align-middle" scope="row">
                          {count}
                        </th>
                        <td className="align-middle">{p.payrollid}</td>
                        <td className="align-middle">{p.employeeName}</td>
                        <td className="align-middle">{p.netSalery}</td>
                        <td className="align-middle">{p.month}</td>

                        <td className="align-middle">
                          {" "}
                          {date.getDate()}/{date.getMonth()}/
                          {date.getFullYear()}
                        </td>
                        <td className="align-middle">
                          {date.getHours()}:{date.getMinutes()}
                        </td>
                        <td className="align-middle">{p.status}</td>

                        <td className="align-middle">
                          <button
                            onClick={() => {
                              this.setState({
                                selectedPayList: p,
                                openReciptDailog: true,
                              });
                            }}
                            type="button"
                            className="btn btn-secondary"
                          >
                            <i className="fa fa-eye" aria-hidden="true"></i>
                          </button>
                          <button
                            onClick={() => {
                              this.setState({
                                status: p.status,
                                selectedPayrollID: p.payrollid,
                                selectedEmployeeName: p.employeeName,
                                openFormDailog: true,
                              });
                            }}
                            type="button"
                            className="btn btn-success"
                          >
                            <i className="fa fa-edit" aria-hidden="true"></i>
                          </button>

                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                              this.setState({
                                openConfirmDailog: true,
                                selectedPayrollID: p.payrollid,
                                selectedEmployeeName: p.employeeName,
                              });
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
          <div className="loadmoredatasection payListpage">
            {this.state.isLoadMoredata ? (
              <i className="fas fa-spinner fa-pulse fa-2x loadmoredataspinner"></i>
            ) : (
              <div className="nomoredatatext">{this.state.noMoredataText}</div>
            )}
            {this.state.payList.length === 0 ? null : this.state
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

export default PayrollList;
