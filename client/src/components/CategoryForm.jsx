const CategoryForm = ({
  text, // Text for the submit button (e.g., "Create" or "Update")
  value, // Value of the input field
  setValue, // Function to set the input field value
  handleSubmit, // Function to handle form submission
  handleDelete, // Function to handle category deletion (optional)
}) => {
  return (
    <div className="p-3">
      {/* Form for category creation or update */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className="py-3 px-4 border rounded-lg w-full"
          placeholder="Write category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {/* Buttons for submitting and, if provided, deleting the category */}
        <div className="flex justify-between">
          <button className="bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
            {/* Submit button */}
            {text}
          </button>
          {/* Delete button (conditionally rendered based on handleDelete prop) */}
          {handleDelete && (
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 foucs:ring-red-500 focus:ring-opacity-50"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
