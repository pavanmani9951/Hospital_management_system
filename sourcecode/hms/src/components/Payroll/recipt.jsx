import React, { Component } from "react";
import "./recipt.css";

class Recipt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payList: {
        allowanceAmount1: "1500",
        allowanceAmount2: "4000",
        allowanceCount: 2,
        allowanceType1: "A1",
        allowanceType2: "A2",
        basic: "20000",
        deductionAmount1: "500",
        deductionAmount2: "500",
        deductionCount: 2,
        deductionType1: "D1",
        deductionType2: "D2",
        employeeName: "Doctor",
        month: "Jan",
        netSalery: 24500,
        payrollid: "VWn1vwcYltTj9o7mm8Ny",
        searchbyname: "doctor",
        status: "Paid",
      },
    };
  }
  render() {
    console.log("hhhhhhhhhhhhhhh");

    console.log(this.props.date);

    return (
      <div className="reciptpage">
        <div className="container">
          <div className="row">
            <div className="receipt-main ">
              <div className="row">
                <div className="col-xs-6 col-sm-6 col-md-6">
                  <div className="receipt-left">
                    <img
                      alt=""
                      srcset={require("../../Images/doctorprofile.jpg")}
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "100%",
                      }}
                    />
                  </div>
                </div>
                <div className="col-xs-6 col-sm-6 col-md-6 text-right">
                  <div className="receipt-right">
                    <h5>TechiTouch.</h5>
                    <p>
                      +91 12345-6789 <i className="fa fa-phone"></i>
                    </p>
                    <p>
                      info@gmail.com <i className="fa fa-envelope-o"></i>
                    </p>
                    <p>
                      Australia <i className="fa fa-location-arrow"></i>
                    </p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-xs-8 col-sm-8 col-md-8 text-left">
                  <div className="receipt-right">
                    <h5>
                      Gurdeep Singh <small>  |   Lucky Number : 156</small>
                    </h5>
                    <p>
                      <b>Mobile :</b> +91 12345-6789
                    </p>
                    <p>
                      <b>Email :</b> info@gmail.com
                    </p>
                    <p>
                      <b>Address :</b> Australia
                    </p>
                  </div>
                </div>
                <div className="col-xs-4 col-sm-4 col-md-4 receipt_mid_start">
                  <div className="receipt-left">
                    <h1>Receipt</h1>
                  </div>
                </div>
              </div>

              <div>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="col-md-9">Basic Ammount</td>
                      <td className="col-md-3">
                        <i className="fa fa-inr"></i> {this.props.payList.basic}
                        /-
                      </td>
                    </tr>
                    <tr>
                      <td className="col-md-9">Total AllowanceAmount</td>
                      <td className="col-md-3">
                        <i className="fa fa-inr"></i>{" "}
                        {this.props.payList.totalAllowanceAmount}/-
                      </td>
                    </tr>

                    <tr>
                      <td className="col-md-9">Total DeductionAmoount</td>
                      <td className="col-md-3">
                        <i className="fa fa-inr"></i>{" "}
                        {this.props.payList.totalDeductionAmoount}/-
                      </td>
                    </tr>

                    <tr>
                      <td className="text-right">
                        <p>
                          <strong>Total Amount: </strong>
                        </p>
                        {/* <p>
                          <strong>Late Fees: </strong>
                        </p>
                        <p>
                          <strong>Payable Amount: </strong>
                        </p> */}
                        <p>
                          <strong>Balance Due: </strong>
                        </p>
                      </td>
                      <td>
                        <p>
                          <strong>
                            <i className="fa fa-inr"></i>{" "}
                            {this.props.payList.netSalery}/-
                          </strong>
                        </p>
                        <p>
                          <strong>
                            <i className="fa fa-inr"></i> 0/-
                          </strong>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-right">
                        <h2>
                          <strong>Total: </strong>
                        </h2>
                      </td>
                      <td className="text-left text-danger">
                        <h2>
                          <strong>
                            <i className="fa fa-inr"></i>{" "}
                            {this.props.payList.netSalery}
                            {/* {this.props.payList.netSalery} */}
                          </strong>
                        </h2>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="row">
                <div className=" receipt-header-mid receipt-footer">
                  <div className="col-xs-8 col-sm-8 col-md-8 text-left">
                    <div className="receipt-right">
                      <p>
                        <b>Date :</b> {this.props.payList.date}
                      </p>
                      <h5 style={{ color: "rgb(140, 140, 140)" }}>
                        Thank you for your business!
                      </h5>
                    </div>
                  </div>
                  <div className="col-xs-4 col-sm-4 col-md-4">
                    <div className="receipt-left">
                      <h1>Signature</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Recipt;
