import React, { Component } from "react";
import firebase from "../../firebase";
import "./bloodbaglist.css";
import FormPrompt from "../DailogBoxes/formprompt";
import Service from "../../Service/firebase";

class Bloodbaglist extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      isCloseBtnAppear: true,
      openFormDailog: false,
      setOpenFormDailog: false,
      bloodbaglist: [],
      isPromptLoading: false,

      selectedBloodGroup: "",
      bloodqty: null,
      formPromptTitle: "",
    };
  }
  componentDidMount() {
    this.onFetchData(this.state.limit);
  }

  async onFetchData(limit) {
    this.setState({ isLoadMoredata: true });

    const db = firebase.firestore();
    await db
      .collection("bloodbags")
      .doc("bloodbags")
      .get()
      .then((snapshot) => {
        // const bloodbaglist = [];
        // bloodbaglist.push(doc.data());

        this.setState({
          bloodbaglist: snapshot.data(),
          isLoadMoredata: false,
          isLoading: false,
        });
      })
      .catch((e) => {
        this.setState({ isLoading: false });
        console.log(e);
      });
  }

  handleFormDailogToClose = () => {
    this.setState({
      setFormnDailog: false,
      openFormDailog: false,
    });
  };
  handleFormDailogToUpdate = async (event) => {
    const data = new FormData(event.target);
    this.setState({
      isPromptLoading: true,
      isCloseBtnAppear: false,
    });
    const sendData = {
      [this.state.selectedBloodGroup]: data.get("bloodqty"),
    };
    const res = await Service.updateData(sendData, "bloodbags", "bloodbags");

    if (res === "success") {
      this.setState({
        // isLoading: false,
        setFormnDailog: false,
        openFormDailog: false,
        isPromptLoading: false,
        isCloseBtnAppear: true,
      });
      window.location.reload(false);
    } else {
      this.setState({
        setFormnDailog: false,
        openFormDailog: false,
        isPromptLoading: false,
        isCloseBtnAppear: true,
      });
    }

    // const db = firebase.firestore();
    // db.collection("bloodbags")
    //   .doc("bloodbags")
    //   .update({
    //     [this.state.selectedBloodGroup]: data.get("bloodqty"),
    //   })
    //   .then(() => {
    //     this.setState({
    //       // isLoading: false,
    //       setFormnDailog: false,
    //       openFormDailog: false,
    //       isPromptLoading: false,
    //       isCloseBtnAppear: true,
    //     });
    //     window.location.reload(false);
    //   })
    //   .catch((error) => {
    //     console.error("Error adding document: ", error);
    //   });
  };

  onEdit = (e) => {
    this.setState({
      [e.target.name]: [e.target.value],
    });
    //console.log(doctorsDetails);
  };
  closeFormDailog = () => {
    this.setState({
      openFormDailog: false,
    });
  };
  render() {
    return this.state.isLoading ? (
      <div className="bloodbaglistpage">
        <i className="fas fa-spinner fa-pulse fa-2x"></i>
      </div>
    ) : (
      <div className=" bloodbaglistpage">
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
                <h5>Blood Bag</h5>
              </li>
            </ul>
          </div>
          <div className="top_section">
            <div className="wrap">
              <FormPrompt
                openDailog={this.state.openFormDailog}
                title="Edit Qty"
                onSetOpenDailog={this.closeFormDailog}
                isCloseBtnAppear={this.state.isCloseBtnAppear}
              >
                {this.state.isPromptLoading ? (
                  <i
                    className="fas fa-spinner fa-pulse fa-2x"
                    style={{ position: "relative", top: " 0%", left: "40%" }}
                  ></i>
                ) : (
                  <form onSubmit={this.handleFormDailogToUpdate}>
                    <div className="form-row">
                      <div className="col-md">
                        <label
                          htmlFor="validationDefault10"
                          style={{ fontSize: "12px" }}
                        >
                          {this.state.selectedBloodGroup}
                        </label>
                        <input
                          type="number"
                          name="bloodqty"
                          className="form-control"
                          id="bloodqty"
                          value={this.state.bloodqty}
                          onChange={this.onEdit}
                        ></input>
                      </div>
                    </div>

                    <div
                      className="btnsection"
                      style={{
                        marginTop: "10px",
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
                        // onClick={this.handleFormDailog}
                      >
                        Ok
                      </button>
                    </div>
                  </form>
                )}
              </FormPrompt>
            </div>
          </div>
          <table className="table  table-striped">
            <thead className="thead tablehead">
              <tr>
                <th scope="col">Blood Group</th>
                <th scope="col">Qty</th>
                <th scope="col">Option</th>
              </tr>
            </thead>
            <tbody className="tablebody">
              <tr>
                <td className="bloodgroup align-middle">A+</td>
                <td className="qty align-middle">
                  {this.state.bloodbaglist.Apositive === ""
                    ? "0"
                    : this.state.bloodbaglist.Apositive}
                </td>

                <td className="align-middle">
                  <button
                    onClick={() => {
                      this.setState({
                        selectedBloodGroup: "Apositive",
                        formPromptTitle: "A+",
                        bloodqty: this.state.bloodbaglist.Apositive,
                        openFormDailog: true,
                      });
                    }}
                    type="button"
                    className="btn btn-success"
                  >
                    <i className="fa fa-edit" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="bloodgroup align-middle">A-</td>
                <td className="qty align-middle">
                  {this.state.bloodbaglist.Anegative === ""
                    ? "0"
                    : this.state.bloodbaglist.Anegative}
                </td>

                <td>
                  <button
                    onClick={() => {
                      this.setState({
                        selectedBloodGroup: "Anegative",
                        formPromptTitle: "A-",
                        bloodqty: this.state.bloodbaglist.Anegative,
                        openFormDailog: true,
                      });
                    }}
                    type="button"
                    className="btn btn-success"
                  >
                    <i className="fa fa-edit" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="bloodgroup align-middle">AB+</td>
                <td className="qty align-middle">
                  {this.state.bloodbaglist.ABpositive === ""
                    ? "0"
                    : this.state.bloodbaglist.ABpositive}
                </td>

                <td>
                  <button
                    onClick={() => {
                      this.setState({
                        selectedBloodGroup: "ABpositive",
                        formPromptTitle: "AB+",
                        bloodqty: this.state.bloodbaglist.ABpositive,
                        openFormDailog: true,
                      });
                    }}
                    type="button"
                    className="btn btn-success"
                  >
                    <i className="fa fa-edit" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="bloodgroup align-middle">AB-</td>
                <td className="qty align-middle">
                  {this.state.bloodbaglist.ABnegative === ""
                    ? "0"
                    : this.state.bloodbaglist.ABnegative}
                </td>

                <td>
                  <button
                    onClick={() => {
                      this.setState({
                        selectedBloodGroup: "ABnegative",
                        formPromptTitle: "AB-",
                        bloodqty: this.state.bloodbaglist.ABnegative,
                        openFormDailog: true,
                      });
                    }}
                    type="button"
                    className="btn btn-success"
                  >
                    <i className="fa fa-edit" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="bloodgroup align-middle">B+</td>
                <td className="qty align-middle">
                  {this.state.bloodbaglist.Bpositive === ""
                    ? "0"
                    : this.state.bloodbaglist.Bpositive}
                </td>

                <td>
                  <button
                    onClick={() => {
                      this.setState({
                        selectedBloodGroup: "Bpositive",
                        formPromptTitle: "B+",
                        bloodqty: this.state.bloodbaglist.Bpositive,

                        openFormDailog: true,
                      });
                    }}
                    type="button"
                    className="btn btn-success"
                  >
                    <i className="fa fa-edit" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="bloodgroup align-middle">B-</td>
                <td className="qty align-middle">
                  {this.state.bloodbaglist.Bnegative === ""
                    ? "0"
                    : this.state.bloodbaglist.Bnegative}
                </td>

                <td>
                  <button
                    onClick={() => {
                      this.setState({
                        selectedBloodGroup: "Bnegative",
                        formPromptTitle: "B-",
                        openFormDailog: true,
                        bloodqty: this.state.bloodbaglist.Bnegative,
                      });
                    }}
                    type="button"
                    className="btn btn-success"
                  >
                    <i className="fa fa-edit" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="bloodgroup align-middle">O+</td>
                <td className="qty align-middle">
                  {this.state.bloodbaglist.Opositive === ""
                    ? "0"
                    : this.state.bloodbaglist.Opositive}
                </td>

                <td>
                  <button
                    onClick={() => {
                      this.setState({
                        selectedBloodGroup: "Opositive",
                        formPromptTitle: "O+",
                        bloodqty: this.state.bloodbaglist.Opositive,
                        openFormDailog: true,
                      });
                    }}
                    type="button"
                    className="btn btn-success"
                  >
                    <i className="fa fa-edit" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="bloodgroup align-middle">O-</td>
                <td className="qty align-middle">
                  {this.state.bloodbaglist.Onegative === ""
                    ? "0"
                    : this.state.bloodbaglist.Onegative}
                </td>

                <td>
                  <button
                    onClick={() => {
                      this.setState({
                        selectedBloodGroup: "Onegative",
                        formPromptTitle: "O-",
                        bloodqty: this.state.bloodbaglist.Onegative,

                        openFormDailog: true,
                      });
                    }}
                    type="button"
                    className="btn btn-success"
                  >
                    <i className="fa fa-edit" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Bloodbaglist;
