import axios from "axios";
import { useState, useEffect } from "react";

const serverURL = "http://localhost:5050";
const AddNew = () => {
  const [info, setInfo] = useState({
    name: "",
    id: "",
    password: "",
    position: "",
    wage: "",
    address: "",
    avatar: null,
  });
  const [phone, setPhone] = useState("(___)-___-____");
  const [adding, setAdding] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };
  const handlePhone = (e) => {
    setPhone((input) => {
      input = e.target.value;
      let output = "(";
      input.replace(
        /^\D*(\d{0,3})\D*(\d{0,3})\D*(\d{0,4})/,
        (match, g1, g2, g3) => {
          if (g1.length) {
            output += g1;
            if (g1.length == 3) {
              output += ")";
              if (g2.length) {
                output += "-" + g2;
                if (g2.length == 3) {
                  output += "-";
                  if (g3.length) {
                    output += g3;
                  }
                }
              }
            }
          }
        }
      );
      return output;
    });
  };
  useEffect(() => {
    setInfo({ ...info, position: info.id[0] == 2 ? "manager" : "employee" });
    // do not delete the line below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.id]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      info.name.length === 0 ||
      info.id.length != 6 ||
      info.id[0] == 1 ||
      info.password.length != 4 ||
      info.position.length === 0 ||
      info.wage.length === 0 ||
      phone.length !== 14 ||
      info.address.length === 0
    ) {
      setErrorMessage("Please double check all fields");
      return setSubmitError(true);
    } else {
      try {
        setSubmitError(null);
        setAdding(true);
        await axios
          .post(`${serverURL}/addnew`, { ...info, phone: phone })
          .then(() => {
            setSubmitError(false);
          })
          .catch((err) => {
            setErrorMessage(err.response.request.responseText);
            return setSubmitError(true);
          });
      } catch (err) {
        console.log(err);
        setErrorMessage(err.response.request.responseText);
        return setSubmitError(true);
      } finally {
        setAdding(false);
      }
    }
  };
  return (
    <div>
      <h1>Add a new employee</h1>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label className="flex flex-col">
          Employee name
          <input
            type="text"
            placeholder="Employee name"
            name="name"
            value={info.name}
            onChange={handleChange}
          />
        </label>
        <label className="flex flex-col">
          Employee ID
          <input
            type="number"
            placeholder="Manager starts with 2, Employee starts with 3"
            name="id"
            value={info.id}
            onChange={handleChange}
          />
        </label>
        {info.id.length != 6 && (
          <p className="text-red-500">ID must have 6 digits</p>
        )}
        {info.id[0] == 1 && (
          <p className="text-red-500">Can't add an employer account</p>
        )}
        <label className="flex flex-col">
          PIN
          <input
            type="password"
            placeholder="4 digits PIN"
            name="password"
            value={info.password}
            onChange={handleChange}
          />
        </label>
        {info.password.length != 4 || isNaN(info.password) ? (
          <p className="text-red-500">PIN number must have 4 digits</p>
        ) : (
          <div></div>
        )}
        <label className="flex flex-col">
          Position
          <select name="position" value={info.position} onChange={handleChange}>
            <option
              value="manager"
              /* eslint eqeqeq: 0 */
              disabled={info.id[0] == 2 ? false : true}
            >
              Manager
            </option>
            <option value="employee" disabled={info.id[0] == 3 ? false : true}>
              Employee
            </option>
          </select>
        </label>
        <label className="flex flex-col">
          Hourly Wage
          <input
            type="number"
            placeholder="Hourly wage"
            name="wage"
            value={info.wage}
            onChange={handleChange}
          />
        </label>
        <label className="flex flex-col">
          Phone Number
          <input
            type="text"
            placeholder="(___)-___-____"
            name="phone"
            value={phone}
            onChange={handlePhone}
          />
        </label>
        <label className="flex flex-col">
          Address
          <input
            type="text"
            placeholder="Address"
            name="address"
            value={info.address}
            onChange={handleChange}
          />
        </label>
        <label className="flex flex-col">
          Avatar
          <input type="file" name="avatar" />
        </label>
        <input type="submit" value="Add" />
      </form>
      {adding && <p>Adding information to server</p>}
      {submitError && <p className="text-red-500">{errorMessage}</p>}
      {submitError == false && (
        <p className="text-green-600">Added successfully</p>
      )}
    </div>
  );
};

export default AddNew;
