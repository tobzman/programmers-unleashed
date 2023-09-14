import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";

import { ADD_NOTE } from "../../utils/mutations";

import Auth from "../../utils/auth";

const MedForm = () => {
  const [userFormData, setUserFormData] = useState({
    title: "",
    medicine: "",
    startTime: "",
    period: "",
    numberOfTime: "",
    total: "",
  });

  const [addNote, { error, data }] = useMutation(ADD_NOTE);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    console.log(userFormData);

    try {
      const { data } = await addNote({
        variables: { noteData: userFormData },
      });

      console.log(data);
    } catch (err) {
      console.error(err);
    }

    setUserFormData({
      title: "",
      medicine: "",
      startTime: "",
      period: "",
      numberOfTime: "",
      total: "",
    });
  };

  return (
    <div>
      <h3>What's your medication?</h3>

      {Auth.loggedIn() ? (
        <>
          <form className="container">
            <div className="row input-group-lg m-4">
              <div>
                <label for="titleInput" class="form-label">
                  Title
                </label>
              </div>
              <input
                name="title"
                id="titleInput"
                value={userFormData.title}
                onChange={handleChange}
                type="text"
                class="form-control"
                placeholder="Enter your title"
              ></input>
            </div>
            <div className="row input-group-lg m-4">
              <div>
                <label for="medicineInput" class="form-label">
                  Medicine
                </label>
              </div>
              <input
                name="medicine"
                id="medicineInput"
                value={userFormData.medicine}
                onChange={handleChange}
                type="text"
                class="form-control"
                placeholder="Enter your medicine"
              ></input>
            </div>
            <div className="row input-group-lg m-4">
              <div>
                <label for="startTimeInput" class="form-label">
                  Start time
                </label>
              </div>
              <input
                name="startTime"
                id="startTimeInput"
                value={userFormData.startTime}
                onChange={handleChange}
                type="text"
                class="form-control"
                placeholder="Enter your start time"
              ></input>
            </div>

            <div className="row input-group-lg m-4">
              <div>
                <label for="periodInput" class="form-label">
                  Period
                </label>
              </div>
              <input
                name="period"
                id="periodInput"
                value={userFormData.period}
                onChange={handleChange}
                type="text"
                class="form-control"
                placeholder="Enter your period"
              ></input>
            </div>
            <div className="row input-group-lg m-4">
              <div>
                <label for="numberOfTimeInput" class="form-label">
                  Number of doses per day
                </label>
              </div>
              <input
                name="numberOfTime"
                id="numberOfTimeInput"
                value={userFormData.numberOfTime}
                onChange={handleChange}
                type="text"
                class="form-control"
                placeholder="Enter your number of doses per day"
              ></input>
            </div>
            <div className="row input-group-lg m-4">
              <div>
                <label for="totalInput" class="form-label">
                  Total number of doses
                </label>
              </div>
              <input
                name="total"
                id="totalInput"
                value={userFormData.total}
                onChange={handleChange}
                type="text"
                class="form-control"
                placeholder="Enter your total number of doses"
              ></input>
            </div>
            <div className="row m-4">
              <button
                type="button"
                className="btn btn-outline-primary btn-lg"
                onClick={handleFormSubmit}
              >
                Submit
              </button>
            </div>
          </form>
        </>
      ) : (
        <p>
          You need to be logged in to share your thoughts. Please{" "}
          <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
        </p>
      )}
    </div>
  );
};

export default MedForm;
