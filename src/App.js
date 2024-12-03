import React, { useState, useEffect } from "react";
import "./App.css";

// Mock API Responses
const apiResponses = {
  "User Information": {
    fields: [
      { name: "firstName", type: "text", label: "First Name", required: true },
      { name: "lastName", type: "text", label: "Last Name", required: true },
      { name: "age", type: "number", label: "Age", required: false },
    ],
  },
  "Address Information": {
    fields: [
      { name: "street", type: "text", label: "Street", required: true },
      { name: "city", type: "text", label: "City", required: true },
      {
        name: "state",
        type: "dropdown",
        label: "State",
        options: [
          "Andhra Pradesh",
          "Arunachal Pradesh",
          "Assam",
          "Bihar",
          "Chhattisgarh",
          "Goa",
          "Gujarat",
          "Haryana",
          "Himachal Pradesh",
          "Jharkhand",
          "Karnataka",
          "Kerala",
          "Madhya Pradesh",
          "Maharashtra",
          "Manipur",
          "Meghalaya",
          "Mizoram",
          "Nagaland",
          "Odisha",
          "Punjab",
          "Rajasthan",
          "Sikkim",
          "Tamil Nadu",
          "Telangana",
          "Tripura",
          "Uttar Pradesh",
          "Uttarakhand",
          "West Bengal",
          "Delhi",
          "Jammu and Kashmir",
          "Ladakh",
          "Puducherry",
        ],
        required: true,
      },
      { name: "zipCode", type: "text", label: "Zip Code", required: false },
    ],
  },
  "Payment Information": {
    fields: [
      { name: "cardNumber", type: "text", label: "Card Number", required: true },
      { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
      { name: "cvv", type: "password", label: "CVV", required: true },
      { name: "cardholderName", type: "text", label: "Cardholder Name", required: true },
    ],
  },
};

function App() {
  const [formType, setFormType] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [progress, setProgress] = useState(0);

  // Load form fields based on selected form type
  useEffect(() => {
    if (formType) {
      setFormFields(apiResponses[formType].fields);
      setFormData({});
      setErrors({});
      setProgress(0);
    }
  }, [formType]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Calculate progress based on required fields
  useEffect(() => {
    if (formFields.length > 0) {
      const requiredFields = formFields.filter((field) => field.required);
      const filledFields = requiredFields.filter((field) => formData[field.name]);
      setProgress((filledFields.length / requiredFields.length) * 100);
    }
  }, [formData, formFields]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    formFields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmittedData((prev) => [...prev, formData]);
      setFormData({});
      setErrors({});
      setProgress(100);
      alert("Form submitted successfully!");
    }
  };

  // Handle deletion of a row
  const handleDelete = (index) => {
    const updatedData = [...submittedData];
    updatedData.splice(index, 1);
    setSubmittedData(updatedData);
    alert("Entry deleted successfully!");
  };

  // Handle editing a row
  const handleEdit = (index) => {
    setFormData(submittedData[index]);
    handleDelete(index);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dynamic Form Implementation</h1>
      </header>
      <div className="form-container">
        <label htmlFor="formType">Choose Form Type:</label>
        <select
          id="formType"
          value={formType}
          onChange={(e) => setFormType(e.target.value)}
        >
          <option value="">Select...</option>
          {Object.keys(apiResponses).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {formType && (
          <form onSubmit={handleSubmit}>
            {formFields.map((field) => (
              <div key={field.name} className="form-group">
                <label htmlFor={field.name}>{field.label}</label>
                {field.type === "dropdown" ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Select...</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                  />
                )}
                {errors[field.name] && <span className="error">{errors[field.name]}</span>}
              </div>
            ))}
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
      {submittedData.length > 0 && (
        <div className="data-table">
          <h2>Submitted Data</h2>
          <table>
            <thead>
              <tr>
                {formFields.map((field) => (
                  <th key={field.name}>{field.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedData.map((data, index) => (
                <tr key={index}>
                  {formFields.map((field) => (
                    <td key={field.name}>{data[field.name]}</td>
                  ))}
                  <td>
                    <button onClick={() => handleEdit(index)}>Edit</button>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <footer className="App-footer">
        <p>Dynamic Form &copy; 2024</p>
      </footer>
    </div>
  );
}

export default App;

