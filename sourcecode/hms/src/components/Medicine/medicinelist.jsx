import React, { Component } from "react";
import firebase from "../../firebase";
import "./medicinelist.css";
import FormPrompt from "../DailogBoxes/formprompt";
import AlertDialogBox from "../DailogBoxes/alertdailogbox";
import Service from "../../Service/firebase";
import ConfirmDialogBox from "../DailogBoxes/confirmdailogbox";
import ErorrDialogBox from "../DailogBoxes/errordaologbox";

class MedicineList extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      limit: 10,
      isLoadMoredata: false,
      totalNumOfMedicie: null,
      noMoredataText: "",
      openFormDailog: false,
      setOpenFormDailog: false,
      medicinelist: [],
      isPromptLoading: false,
      medicineCategories: [],

      setOpenAlertDailog: false,
      alertDailogBoxTitle: null,
      alertDailogBoxDes: null,
      isForUpdate: false,
      medicinename: "",
      medicinedescription: "",
      medicinecompany: "",
      medicineremark: "",
      medicineqty: "",
      medicinestatus: "",
      medicinecategory: "",
      isCloseBtnAppear: true,
      isSearching: false,
      isSearchDataShow: false,
      searchText: "",
      openConfirmDailog: false,
      selectedMedicineName: "",
      selectedMedicineId: "",
      isDeleting: false,
      openErrorDailog: false,
    };
  }
  componentDidMount() {
    this.onSetTotalNumOfMedicie();
    this.onFetchData(this.state.limit);
    this.onSetMedicineCat();
  }
  async onSetMedicineCat() {
    const db = firebase.firestore();
    db.collection("medicines")
      .doc("categories")
      .get()
      .then((doc) => {
        let categories = doc.data().categories;

        this.setState({
          medicineCategories: categories,
        });
      })
      .catch((e) => {
        console.log(e);
      });
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

    console.log(this.state.medicineCategories);
  }

  showMore() {
    if (this.state.limit <= this.state.totalNumOfMedicie) {
      const limit = this.state.limit + 10;
      console.log(this.state.totalNumOfMedicie);
      this.setState({ limit: limit });
      this.onFetchData(limit);
    } else {
      this.setState({
        noMoredataText: "No More Medicines",
      });
    }
  }
  onSetTotalNumOfMedicie() {
    const db = firebase.firestore();
    db.collection("medicines")
      .get()
      .then((snapshot) => {
        this.setState({ totalNumOfMedicie: snapshot.docs.length });
      })
      .catch((e) => {
        console.log(e);
      });
  }
  async onFetchData(limit) {
    this.setState({ isLoadMoredata: true });
    const db = firebase.firestore();
    await db
      .collection("medicines")
      .orderBy("timeStamp", "desc")
      .limit(limit)
      .get()
      .then((snapshot) => {
        const medicinelist = [];

        snapshot.docs.forEach((doc) => {
          medicinelist.push(doc.data());
        });

        this.setState({
          medicinelist: medicinelist,
          isLoadMoredata: false,
          isLoading: false,
        });
      })
      .catch((e) => {
        this.setState({ isLoading: false });
        console.log(e);
      });
  }

  handleChange = (date) => {
    this.setState({
      date: date,
      startDate: date,
    });
  };

  handleOnDelete = (medicineName, medicineId) => {
    this.setState({
      selectedMedicineName: medicineName,
      selectedMedicineId: medicineId,
      openConfirmDailog: true,
    });
  };

  deleteData = async () => {
    this.setState({ isDeleting: true });
    const res = await Service.deleteData(
      "medicines",
      this.state.selectedMedicineId
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
        openErrorDailog: true,
      });
      //this.handleErrorDailog();
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
      db.collection("medicines")
        .orderBy("searchbyname")
        .startAt(searchText)
        .endAt(searchText + "\uf8ff")
        .get()
        .then((snapshot) => {
          const resultPatientlist = [];

          snapshot.docs.forEach((doc) => {
            console.log(doc.data());
            resultPatientlist.push(doc.data());
          });
          this.setState({
            medicinelist: resultPatientlist,
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
      setAlertOpenDailog: false,
      openAlertDailog: false,
    });
    window.location.reload(false);
  };
  handleFormDailogToClose = () => {
    this.setState({
      medicinename: "",
      medicinedescription: "",
      medicinecompany: "",
      medicineremark: "",
      medicineqty: "",
      medicinestatus: "",
      medicinecategory: "",
      selectedMedicineId: "",
      setFormnDailog: false,
      openFormDailog: false,
    });
  };
  handleFormDailogToUpdate = async (event) => {
    this.setState({
      isPromptLoading: true,
      isCloseBtnAppear: false,
    });
    const data = new FormData(event.target);
    const sendData = {
      name: data.get("medicinename"),
      description: data.get("medicinedescription"),

      company: data.get("medicinecompany"),
      remark: data.get("medicineremark"),
      qty: data.get("medicineqty"),
      status: data.get("medicinestatus"),
      category: data.get("medicinecategory"),
    };

    const res = await Service.updateData(
      sendData,
      "medicines",
      this.state.selectedMedicineId
    );

    if (res === "success") {
      this.setState({
        // isLoading: false,
        setFormnDailog: false,
        openFormDailog: false,
        isPromptLoading: false,
        isForUpdate: false,
        openAlertDailog: true,
        alertDailogBoxTitle: "Update",
        alertDailogBoxDes: "successfully Updated",
        isCloseBtnAppear: true,
      });
    } else {
      this.setState({
        setFormnDailog: false,
        openFormDailog: false,
        isPromptLoading: false,
        isForUpdate: false,
        openAlertDailog: true,
        isCloseBtnAppear: true,
      });
    }
  };
  handleFormDailogToAdd = async (event) => {
    const data = new FormData(event.target);

    this.setState({
      isPromptLoading: true,
      isCloseBtnAppear: false,
    });

    const sendData = {
      name: data.get("medicinename"),
      description: data.get("medicinedescription"),
      company: data.get("medicinecompany"),
      remark: data.get("medicineremark"),
      qty: data.get("medicineqty"),
      status: data.get("medicinestatus"),
      category: data.get("medicinecategory"),
      timeStamp: firebase.firestore.Timestamp.fromDate(new Date()),
      searchbyname: data.get("medicinename").toLowerCase().replace(/\s/g, ""),
    };
    const res = await Service.addData(sendData, "medicines", "medicineid");
    if (res === "success") {
      this.setState({
        // isLoading: false,
        setFormnDailog: false,
        openFormDailog: false,
        isPromptLoading: false,
        openAlertDailog: true,
        alertDailogBoxTitle: "Added",
        alertDailogBoxDes: "New Medicine has been added successfully",
        isCloseBtnAppear: true,
      });
    } else {
      this.setState({
        // isLoading: false,
        setFormnDailog: false,
        openFormDailog: false,
        isPromptLoading: false,
        isCloseBtnAppear: true,
      });
    }
  };
  onEdit = (e) => {
    this.setState({
      [e.target.name]: [e.target.value],
    });
    //console.log(doctorsDetails);
  };
  closeFormDailog = () => {
    this.setState({
      isForUpdate: false,
      medicinename: "",
      medicinedescription: "",
      medicinecompany: "",
      medicineremark: "",
      medicineqty: "",
      medicinestatus: "",
      medicinecategory: "",
      selectedMedicineId: "",

      openFormDailog: false,
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
  render() {
    let count = 0;
    return this.state.isLoading ? (
      <div className="medicinelistpage">
        <i className="fas fa-spinner fa-pulse fa-2x"></i>
      </div>
    ) : (
      <div className="medicinelistpage">
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
                <h5>Medicine</h5>
              </li>
            </ul>
            <hr />
          </div>
          <ConfirmDialogBox
            openDailog={this.state.openConfirmDailog}
            onSetOpenDailog={this.closeConfirmDailog}
            handleConfirmOkBtn={this.deleteData}
            isLoading={this.state.isDeleting}
            title="Delete"
            des={
              "Are you sure to delete " +
              this.state.selectedMedicineName +
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

          <AlertDialogBox
            openDailog={this.state.openAlertDailog}
            setOpenDailog={this.state.setOpenAlertDailog}
            onSetOpenDailog={this.handleAlertDailog}
            title={this.state.alertDailogBoxTitle}
            des={this.state.alertDailogBoxDes}
          />
          <FormPrompt
            openDailog={this.state.openFormDailog}
            onSetOpenDailog={this.closeFormDailog}
            isCloseBtnAppear={this.state.isCloseBtnAppear}
            title="Add New Medicine"
          >
            {this.state.isPromptLoading ? (
              <i
                className="fas fa-spinner fa-pulse fa-2x"
                style={{ position: "relative", top: " 0%", left: "40%" }}
              ></i>
            ) : (
              <form
                style={{ fontSize: "12px" }}
                onSubmit={
                  this.state.isForUpdate
                    ? this.handleFormDailogToUpdate
                    : this.handleFormDailogToAdd
                }
              >
                <div className="form-row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="validationDefault11">Medicine Name</label>
                    <input
                      name="medicinename"
                      type="text"
                      className="form-control"
                      id="medicinename"
                      value={this.state.medicinename}
                      onChange={this.onEdit}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="validationDefault11">category</label>
                    <select
                      name="medicinecategory"
                      className="custom-select"
                      id="medicinecategory"
                      value={this.state.medicinecategory}
                      onChange={this.onEdit}
                      required
                    >
                      {this.state.medicineCategories.map((option) => {
                        return <option key={Math.random()}>{option}</option>;
                      })}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="validationDefault11">Company</label>
                    <input
                      name="medicinecompany"
                      type="text"
                      className="form-control"
                      id="medicinecompany"
                      value={this.state.medicinecompany}
                      onChange={this.onEdit}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="validationDefault11">Qty</label>
                    <input
                      name="medicineqty"
                      type="number"
                      className="form-control"
                      id="medicineqty"
                      value={this.state.medicineqty}
                      onChange={this.onEdit}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-md">
                    <label htmlFor="validationDefault10">Remark</label>
                    <input
                      name="medicineremark"
                      className="form-control"
                      id="medicineremark"
                      value={this.state.medicineremarkr}
                      onChange={this.onEdit}
                    ></input>
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-md">
                    <label htmlFor="validationDefault10">Status</label>
                    <input
                      name="medicinestatus"
                      className="form-control"
                      id="medicinestatus"
                      value={this.state.medicinestatus}
                      onChange={this.onEdit}
                    ></input>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="validationDefault09">Description</label>
                  <textarea
                    name="medicinedescription"
                    className="form-control"
                    id="medicinedescription"
                    rows="3"
                    value={this.state.medicinedescription}
                    onChange={this.onEdit}
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
                      fontSize: "12px",
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
                  {this.state.medicinelist.length}{" "}
                </li>
              </ul>
            </div>

            <button
              type="button"
              className="btn btn-warning"
              onClick={() => {
                this.setState({ openFormDailog: true });
              }}
            >
              + Add Medicine
            </button>
          </div>
          <table className="table table-striped">
            <thead className="thead tablehead">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Description</th>
                <th scope="col">Company</th>
                <th scope="col">Remark</th>
                <th scope="col">Qty</th>
                <th scope="col">Status</th>
                <th scope="col">Options</th>
              </tr>
            </thead>
            {this.state.isSearching ? (
              <i className="fas fa-spinner fa-pulse fa-2x "></i>
            ) : this.state.medicinelist.length === 0 ? (
              <tbody>
                <tr>
                  <td>No Medicine Found</td>
                </tr>
              </tbody>
            ) : (
              <tbody className="tablebody">
                {this.state.medicinelist &&
                  this.state.medicinelist.map((p) => {
                    count++;
                    return (
                      <tr key={p.medicineid}>
                        <td>{count}</td>
                        <td>{p.name}</td>
                        <td>{p.category === "" ? "N/A" : p.category}</td>
                        <td className="desctd">
                          {p.description === "" ? "N/A" : p.description}
                        </td>
                        <td>{p.company === "" ? "N/A" : p.company}</td>
                        <td> {p.remark === "" ? "N/A" : p.remark}</td>
                        <td> {p.qty === "" ? "N/A" : p.qty}</td>
                        <td> {p.status === "" ? "N/A" : p.status}</td>
                        <td>
                          <button
                            onClick={() => {
                              this.setState({
                                isForUpdate: true,
                                medicinename: p.name,
                                medicinedescription: p.description,
                                medicinecompany: p.company,
                                medicineremark: p.remark,
                                medicineqty: p.qty,
                                medicinestatus: p.status,
                                medicinecategory: p.category,
                                selectedMedicineId: p.medicineid,
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
                              this.handleOnDelete(p.name, p.medicineid);
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
          <div className="loadmoredatasection medicinelistpage">
            {this.state.isLoadMoredata ? (
              <i className="fas fa-spinner fa-pulse fa-2x loadmoredataspinner"></i>
            ) : (
              <div className="nomoredatatext">{this.state.noMoredataText}</div>
            )}
            {this.state.medicinelist.length === 0 ? null : this.state
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

export default MedicineList;
