import catIcon from "../../assets/images/cat-icon.png";
import removeButton from "../../assets/images/removeButton.png";

const serverURL = "http://localhost:5050";

const Employee = (props) => {
  const employee = props.info;
  const { permit } = props;
  const { handleDelete } = props;
  return (
    <div
      className="employee border shadow-blue-400 shadow-md border-blue-500 mb-4 p-2 bg-blue-400 rounded-lg active:shadow-none active:border-none hover:bg-gray-200 relative z-3"
      onClick={() => props.click(employee)}
      id={employee.id}
    >
      <img
        className="absolute top-0 left-3/4 h-20 z-50"
        src={catIcon}
        alt="cat icon"
      />
      {permit < 300000 && (
        <img
          className="absolute top-20 left-3/4 ml-10 h-10 z-90 cursor-pointer"
          src={removeButton}
          alt="Remove"
          onClick={() => handleDelete(employee.name, employee.id)}
        />
      )}

      <h1 className="employee__name text-2xl font-bold relative z-2">
        {employee.name}
      </h1>
      <img
        className="employee__avatar h-20 w-20 relative z-1"
        src={serverURL + employee.avatar}
        alt="avatar"
      />
    </div>
  );
};

export default Employee;
