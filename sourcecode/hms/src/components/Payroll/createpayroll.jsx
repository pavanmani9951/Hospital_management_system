import React, { Component } from "react";
import "./createpayroll.css";
import firebase from "../../firebase";
import Service from "../../Service/firebase";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ErorrDialogBox from "../DailogBoxes/errordaologbox";

class CreatePayRoll extends Component {
  constructor() {
    super();
    this.state = {
      disable: "",
      readOnly: true,
      isLoading: false,
      doctorList: [],
      nurseList: [],
      pharmacistList: [],
      laboratoristList: [],
      accountantList: [],
      receptionistList: [],
      allowance: [
        {
          id: 1,
          allowanceType: "allowanceType1",
          allowanceAmount: "allowanceAmount1",
        },
      ],
      deduction: [
        {
          id: 1,
          deductionType: "deductionType1",
          deductionAmount: "deductionAmount1",
        },
      ],
      year: new Date(),
      allowanceCount: 1,
      deductionCount: 1,
      formData: { basic: 0 },
      totalAllowanceAmount: 0,
      totalDeductionAmoount: 0,
      netSalery: 0,
      basic: 0,
      togglePayslipClass: false,

      openErrorDailog: false,
    };
  }
  componentDidMount() {
    this.fetchDoctorList();
    this.receptionistList();
    this.pharmacistsList();
    this.nursesList();
    this.laboratoristList();
    this.accountantList();
  }
  async fetchDoctorList() {
    this.setState({
      isLoading: true,
    });
    const fetchedEmployeeList = await Service.getEmployeeList("doctors");
    if (fetchedEmployeeList === "error") {
      console.log("Error");
      this.setState({
        isLoading: false,
      });
    } else {
      this.setState({
        doctorList: fetchedEmployeeList,
        isLoading: false,
      });
    }
  }
  async accountantList() {
    this.setState({
      isLoading: true,
    });
    const fetchedEmployeeList = await Service.getEmployeeList("accountant");
    if (fetchedEmployeeList === "error") {
      console.log("Error");
      this.setState({
        isLoading: false,
      });
    } else {
      this.setState({
        accountantList: fetchedEmployeeList,
        isLoading: false,
      });
    }
  }
  async laboratoristList() {
    this.setState({
      isLoading: true,
    });
    const fetchedEmployeeList = await Service.getEmployeeList("laboratorist");
    if (fetchedEmployeeList === "error") {
      console.log("Error");
      this.setState({
        isLoading: false,
      });
    } else {
      this.setState({
        laboratoristList: fetchedEmployeeList,
        isLoading: false,
      });
    }
  }

  async nursesList() {
    this.setState({
      isLoading: true,
    });
    const fetchedEmployeeList = await Service.getEmployeeList("nurses");
    if (fetchedEmployeeList === "error") {
      console.log("Error");
      this.setState({
        isLoading: false,
      });
    } else {
      this.setState({
        nurseList: fetchedEmployeeList,
        isLoading: false,
      });
    }
  }
  async pharmacistsList() {
    this.setState({
      isLoading: true,
    });
    const fetchedEmployeeList = await Service.getEmployeeList("pharmacists");
    if (fetchedEmployeeList === "error") {
      console.log("Error");
      this.setState({
        isLoading: false,
      });
    } else {
      this.setState({
        pharmacistList: fetchedEmployeeList,
        isLoading: false,
      });
    }
  }
  async receptionistList() {
    this.setState({
      isLoading: true,
    });
    const fetchedEmployeeList = await Service.getEmployeeList("receptionist");
    if (fetchedEmployeeList === "error") {
      console.log("Error");
      this.setState({
        isLoading: false,
      });
    } else {
      this.setState({
        receptionistList: fetchedEmployeeList,
        isLoading: false,
      });
    }
  }
  handleDateChange = (date) => {
    this.setState({
      formData: {
        ...this.state.formData,
        year: date,
      },

      year: date,
    });
  };
  handleDeleteAlowance = async (id) => {
    const allowance = await this.state.allowance.filter((c) => c.id !== id);
    console.log("AAAAAAAAAAAAAAAAAaaaaa");
    console.log(allowance);
    console.log(this.state.formData);

    this.setState({
      allowance: allowance,
    });
    this.onSumAllownace();
  };
  handleDeleteDeduction = async (id) => {
    const deduction = await this.state.deduction.filter((c) => c.id !== id);

    this.setState({
      deduction: deduction,
    });
    this.onSumDeduction();
  };
  onChange = (e) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [e.target.name]: e.target.value,
      },
    });
  };
  onSumDeduction = () => {
    let totalDeductionAmoount = 0;

    this.state.deduction.map((p) => {
      if (!isNaN(parseInt(this.state.formData[p.deductionAmount], 10))) {
        totalDeductionAmoount =
          totalDeductionAmoount +
          parseInt(this.state.formData[p.deductionAmount], 10);
      } else {
        totalDeductionAmoount = 0;
      }
      return null;
    });
    this.setState({
      totalDeductionAmoount: totalDeductionAmoount,
    });
    this.setState({
      netSalery:
        parseInt(this.state.totalAllowanceAmount) +
        parseInt(this.state.formData.basic) -
        totalDeductionAmoount,
    });
  };

  onSumAllownace = () => {
    let totalAllowanceAmount = 0;

    this.state.allowance.map((p) => {
      if (!isNaN(parseInt(this.state.formData[p.allowanceAmount], 10))) {
        totalAllowanceAmount =
          totalAllowanceAmount +
          parseInt(this.state.formData[p.allowanceAmount], 10);
      } else {
        totalAllowanceAmount = 0;
      }
      return null;
    });
    this.setState({
      totalAllowanceAmount: totalAllowanceAmount,
    });
    this.setState({
      netSalery:
        totalAllowanceAmount +
        parseInt(this.state.formData.basic) -
        parseInt(this.state.totalDeductionAmoount),
    });
    console.log(this.state.netSalery);
  };
  onBasicChange = (e) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [e.target.name]: e.target.value,
      },
      basic: e.target.value,
    });

    this.calculateNetSalery(parseInt(e.target.value));
  };
  calculateNetSalery(basic) {
    if (!isNaN(basic)) {
      this.setState({
        netSalery:
          this.state.totalAllowanceAmount +
          basic -
          this.state.totalDeductionAmoount,
      });
    } else {
      this.setState({
        formData: {
          ...this.state.formData,
          basic: 0,
        },
        netSalery: this.state.totalAllowanceAmount,
      });
    }
  }
  handleIntialSubmit = (event) => {
    if (!this.state.togglePayslipClass) {
      event.preventDefault();
    }
    this.setState({
      togglePayslipClass: !this.state.togglePayslipClass,
    });
    if (this.state.togglePayslipClass) {
      this.setState({
        disable: "",
      });
    } else {
      this.setState({
        disable: "disabled",
      });
    }
  };
  onPayrollSubmit = async (e) => {
    e.preventDefault();
    const date = new Date();

    const sendData = {
      ...this.state.formData,
      timeStamp: firebase.firestore.Timestamp.fromDate(new Date()),
      date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
      searchbyname: this.state.formData.employeeName
        .toLowerCase()
        .replace(/\s/g, ""),
      netSalery: this.state.netSalery,
      totalAllowanceAmount: this.state.totalAllowanceAmount,
      totalDeductionAmoount: this.state.totalDeductionAmoount,
    };
    this.setState({
      isLoading: true,
    });
    const res = await Service.addData(sendData, "payrolllist", "payrollid");
    if (res === "success") {
      this.setState({
        isLoading: false,
      });
      window.location = "/payrolllist";
    } else {
      this.setState({ isLoading: false, openErrorDailog: true });
    }

    console.log(this.state.formData);
  };

  closeErrorDailog = () => {
    this.setState({
      openErrorDailog: false,
    });
  };

  render() {
    let allowanceDeleteClass = [""];
    let deductionDeleteClass = [""];
    let togglePayslipClass = [""];

    if (this.state.allowance.length < 2) {
      allowanceDeleteClass.push("disable");
    }
    if (this.state.deduction.length < 2) {
      deductionDeleteClass.push("disable");
    }
    if (!this.state.togglePayslipClass) {
      togglePayslipClass.push("disable");
    }

    return this.state.isLoading ? (
      <div className="createpayrollpage">
        <i className="fas fa-spinner fa-pulse fa-2x"></i>
      </div>
    ) : (
      <div className="createpayrollpage">
        <ErorrDialogBox
          openDailog={this.state.openErrorDailog}
          onSetOpenDailog={this.closeErrorDailog}
          title="Error"
          des="Someting went wrong. Try again"
        ></ErorrDialogBox>
        <div className="topheader">
          <i
            className="fa fa-arrow-circle-o-right fa-2x"
            aria-hidden="true"
          ></i>
          <h5>Create Payroll</h5>
        </div>
        <hr />
        <div className="first_section">
          <div className="wrapper">
            <form onSubmit={this.handleIntialSubmit}>
              <div className="form-row">
                <div className="form-group col-md-3">
                  <label for="inputState">Employee</label>
                  <select
                    name="employeeName"
                    id="employeeName"
                    className="form-control"
                    onChange={this.onChange}
                    required
                    disabled={this.state.disable}
                  >
                    <option selected></option>

                    <option disabled="disabled">Doctor</option>

                    {this.state.doctorList.map((p) => {
                      return <option>{p.firstname + " " + p.lastname}</option>;
                    })}

                    <option disabled="disabled">Nurses</option>
                    {this.state.nurseList.map((p) => {
                      return <option>{p.firstname + " " + p.lastname}</option>;
                    })}
                    <option disabled="disabled">Pharmacist</option>

                    {this.state.pharmacistList.map((p) => {
                      return <option>{p.firstname + " " + p.lastname}</option>;
                    })}
                    <option disabled="disabled">Laboratorist</option>

                    {this.state.laboratoristList.map((p) => {
                      return <option>{p.firstname + " " + p.lastname}</option>;
                    })}
                    <option disabled="disabled">Accountant</option>

                    {this.state.accountantList.map((p) => {
                      return <option>{p.firstname + " " + p.lastname}</option>;
                    })}
                    <option disabled="disabled">Receptionist</option>

                    {this.state.receptionistList.map((p) => {
                      return <option>{p.firstname + " " + p.lastname}</option>;
                    })}
                  </select>
                </div>
                <div className="form-group col-md-3">
                  <label for="inputState">Month</label>
                  <select
                    name="month"
                    id="month"
                    className="form-control"
                    onChange={this.onChange}
                    disabled={this.state.disable}
                    required
                  >
                    <option selected></option>
                    <option>Jan</option>
                    <option>Feb</option>
                    <option>March</option>
                    <option>April</option>
                    <option>May</option>
                    <option>Jun</option>
                    <option>July</option>
                    <option>Aug</option>
                    <option>Sep</option>
                    <option>Oct</option>
                    <option>Nov</option>
                    <option>Dec </option>
                  </select>
                </div>
                <div className="form-group col-md-3">
                  <label for="inputState">Year</label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      readOnly={this.state.togglePayslipClass}
                      style={{
                        padding: "0px 10px",
                        border: "1px solid rgb(197, 197, 197)",
                      }}
                      views={["year"]}
                      name="year"
                      className="  form-control"
                      InputProps={{
                        disableUnderline: true,
                      }}
                      disable={this.state.isGoingToBeDischarge}
                      value={this.state.year}
                      onChange={this.handleDateChange}
                      autoComplete="off"
                      format="yyyy"
                      required
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <div className="form-group col-md-3">
                  <button type="submit" className="btn btn-warning">
                    {this.state.togglePayslipClass
                      ? "Reset"
                      : "Genrate Payslip"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <hr />
        <div className={"seond_section" + togglePayslipClass.join(" ")}>
          <div className="row">
            <div className="col-md-6">
              <div className="box card">
                <h6>Allowance</h6>
                {this.state.allowance.map((p) => {
                  return (
                    <form className="card-body">
                      <div className="form-row">
                        <div className="form-group col-md-5">
                          <label for="inputEmail4">Type</label>
                          <input
                            name={"allowanceType" + p.id}
                            type="text"
                            className="form-control"
                            id={"allowancetype" + p.id}
                            value={this.state.formData["allowanceType" + p.id]}
                            onChange={this.onChange}
                          />
                        </div>
                        <div className="form-group col-md-5">
                          <label for="inputEmail4">Amount</label>
                          <input
                            name={"allowanceAmount" + p.id}
                            type="number"
                            className="form-control"
                            id={"allowanceAmount" + p.id}
                            value={
                              this.state.formData["allowanceAmount" + p.id]
                            }
                            onChange={this.onChange}
                          />
                        </div>
                        <div
                          className={
                            "form-group col-2 " + allowanceDeleteClass.join(" ")
                          }
                        >
                          <label htmlFor=""></label>
                          <div className="delete_section">
                            <i
                              className="fa fa-trash"
                              aria-hidden="true"
                              onClick={() => this.handleDeleteAlowance(p.id)}
                            ></i>
                          </div>
                        </div>
                      </div>
                    </form>
                  );
                })}
                <div className="btn_section">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      const allowanceCount = this.state.allowanceCount + 1;

                      this.setState({
                        allowanceCount: allowanceCount,
                      });

                      let allowance = this.state.allowance;
                      allowance.push({
                        id: allowanceCount,
                        allowanceType: "allowanceType" + allowanceCount,
                        allowanceAmount: "allowanceAmount" + allowanceCount,
                      });
                      this.setState({
                        allowance: allowance,
                      });
                    }}
                  >
                    +Add Allownace
                  </button>
                  <button
                    type="button"
                    className="btn btn-info"
                    onClick={this.onSumAllownace}
                  >
                    Total Allowance
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="box card">
                <h6>Deduction</h6>
                {this.state.deduction.map((p) => {
                  return (
                    <form className="card-body">
                      <div className="form-row">
                        <div className="form-group col-md-5">
                          <label for="inputEmail4">Type</label>
                          <input
                            name={"deductionType" + p.id}
                            type="text"
                            className="form-control"
                            id={"deductionType" + p.id}
                            // value={p.id}
                            onChange={this.onChange}
                            value={this.state.formData["deductionType" + p.id]}
                          />
                        </div>
                        <div className="form-group col-md-5">
                          <label for="inputEmail4">Amount</label>
                          <input
                            name={"deductionAmount" + p.id}
                            type="number"
                            className="form-control"
                            id={"deductionAmount" + p.id}
                            onChange={this.onChange}
                            value={
                              this.state.formData["deductionAmount" + p.id]
                            }
                          />
                        </div>
                        <div
                          className={
                            "form-group col-2 " + deductionDeleteClass.join(" ")
                          }
                        >
                          <label htmlFor=""></label>
                          <div className="delete_section">
                            <i
                              className="fa fa-trash"
                              aria-hidden="true"
                              onClick={() => this.handleDeleteDeduction(p.id)}
                            ></i>
                          </div>
                        </div>
                      </div>
                    </form>
                  );
                })}
                <div className="btn_section">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      const deductionCount = this.state.deductionCount + 1;

                      this.setState({
                        deductionCount: deductionCount,
                      });

                      let deduction = this.state.deduction;
                      deduction.push({
                        id: deductionCount,
                        deductionType: " deductionType" + deductionCount,
                        deductionAmount: "deductionAmount" + deductionCount,
                      });
                      this.setState({
                        deduction: deduction,
                      });
                    }}
                  >
                    +Add Deduction
                  </button>
                  <button
                    type="button"
                    className="btn btn-info"
                    onClick={this.onSumDeduction}
                  >
                    Total Deduction
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={"third_section" + togglePayslipClass.join(" ")}>
          <div className="wrapper card">
            <h5>Payroll Summary</h5>
            <form className="card-body" onSubmit={this.onPayrollSubmit}>
              <div className="form-group row">
                <label for="inputPassword" className="col-sm-2 col-form-label">
                  Basic
                </label>
                <div className="col-sm-10">
                  <input
                    name="basic"
                    type="number"
                    className="form-control"
                    id="basic"
                    onChange={this.onBasicChange}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label for="inputPassword" className="col-sm-2 col-form-label">
                  Total Allowance
                </label>
                <div className="col-sm-10">
                  <input
                    name="totalAllowance"
                    type="number"
                    className="form-control"
                    id="inputPassword"
                    value={this.state.totalAllowanceAmount}
                    disable
                  />
                </div>
              </div>
              <div className="form-group row">
                <label for="inputPassword" className="col-sm-2 col-form-label">
                  Total Deduction
                </label>
                <div className="col-sm-10">
                  <input
                    name="totalDeduction"
                    type="number"
                    className="form-control"
                    id="inputPassword"
                    value={this.state.totalDeductionAmoount}
                    disable
                  />
                </div>
              </div>
              <div className="form-group row">
                <label for="inputPassword" className="col-sm-2 col-form-label">
                  Net Salary
                </label>
                <div className="col-sm-10">
                  <input
                    name="netSalery"
                    type="number"
                    className="form-control"
                    id="netSalery"
                    value={this.state.netSalery}
                    disable
                  />
                </div>
              </div>
              <div className="form-group row">
                <label for="inputPassword" className="col-sm-2 col-form-label">
                  Status
                </label>
                <div className="col-sm-10">
                  <select
                    name="status"
                    id="status"
                    className="form-control"
                    onChange={this.onChange}
                    required
                  >
                    <option></option>
                    <option>Paid</option>

                    <option>Unpaid</option>
                  </select>
                </div>
              </div>

              <div className="form-group row btn_section">
                <button type="submit" className="btn btn-success">
                  Create Payslip
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default CreatePayRoll;
