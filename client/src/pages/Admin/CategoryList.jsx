import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/catApiSlice";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";

const CategoryList = () => {
  const [name, setName] = useState(""); // for creating a new category
  // State for updating an existing category
  const [selectedCat, setSelectedCat] = useState(null);
  const [updateName, setUpdateName] = useState("");

  const [modal, setModal] = useState(false);

  const { data: categories, refetch } = useFetchCategoriesQuery();
  const [createCat] = useCreateCategoryMutation();
  const [updateCat] = useUpdateCategoryMutation();
  const [deleteCat] = useDeleteCategoryMutation();

  // Effect to refetch categories when they change
  useEffect(() => {
    refetch();
  }, [categories, refetch]);

  const handleCreateCat = async (e) => {
    e.preventDefault();

    if (!name) toast.error("Category name is required");

    try {
      const result = await createCat({ name }).unwrap();
      if (result.error) {
        return toast.error(result.error);
      } else {
        setName("");
        toast.success("Create successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Create failed, try again");
    }
  };

  const handleUpdateCat = async (e) => {
    e.preventDefault();

    if (!updateName) toast.error("Category name is required");

    try {
      const result = await updateCat({
        categoryId: selectedCat._id,
        updateCat: { name: updateName },
      }).unwrap();

      if (result.error) {
        return toast.error(result.error);
      } else {
        setUpdateName("");
        setSelectedCat(null);
        toast.success("Updated successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Update failed, try again");
    }
  };

  const handleDeleteCat = async (e) => {
    e.preventDefault();

    if (window.confirm("Are you sure to delete this category?")) {
      try {
        await deleteCat(selectedCat._id);

        setModal(false);
        setSelectedCat(null);
        toast.success("Delete successfully");
      } catch (error) {
        console.log(error);
        toast.error("Delete failed, try again");
      }
    }
  };

  return (
    <div className="ml-[10rem] flex flex-col md:flex-row">
      {/* Admin menu */}

      <div className="md:w-3/4 p-3">
        <div className="h-12 text-center">Manage Categories</div>
        {/* Form for creating a new category */}
        <CategoryForm
          text="Create"
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCat}
        />
        <br />
        <hr />

        {/* Display existing categories and buttons to update */}
        <div className="flex flex-wrap">
          {categories?.map((category) => (
            <div key={category._id}>
              <button
                className="bg-white border border-pink-500 text-pink-500 py-2 px-4 rounded-lg m-3 hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                onClick={() => {
                  {
                    setModal(true);
                    setSelectedCat(category);
                    setUpdateName(category.name);
                  }
                }}
              >
                {category.name}
              </button>
            </div>
          ))}
        </div>

        {/* Modal for updating and deleting a category */}
        <Modal isOpen={modal} onClose={() => setModal(false)}>
          <CategoryForm
            value={updateName}
            setValue={(value) => setUpdateName(value)}
            handleSubmit={handleUpdateCat}
            text="Update"
            handleDelete={handleDeleteCat}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;
