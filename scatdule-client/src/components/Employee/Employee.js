const serverURL = "http://localhost:5050";

const Employee = (props) => {
  const employee = props.info;
  return (
    <div className="employee">
      <p className="employee__name">{employee.name}</p>
      <p className="employee__wage">{employee.wage}</p>
      <img src={serverURL + employee.avatar} alt="avatar" />
    </div>
  );
};

export default Employee;
