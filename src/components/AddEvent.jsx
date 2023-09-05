import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useToast,
  Text,
} from "@chakra-ui/react";

export const AddEvent = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    categoryIds: [],
  });
  const [formErrors, setFormErrors] = useState({
    title: "",
    startTime: "",
    endTime: "",
  });

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryIds = Array.from(e.target.selectedOptions, (option) =>
      parseInt(option.value)
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      categoryIds: selectedCategoryIds,
    }));
  };

  const categories = [
    { id: 1, name: "Sports" },
    { id: 2, name: "Games" },
    { id: 3, name: "Relaxation" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.title) {
      errors.title = "This field is required";
    }
    if (!formData.startTime) {
      errors.startTime = "This field is required";
    }
    if (!formData.endTime) {
      errors.endTime = "This field is required";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const json = await response.json();

      navigate(`/event/${json.id}`);

      toast({
        title: "Event created.",
        description: "You've successfully added the event!.",
        status: "success",
        isClosable: true,
      });

      setFormData({
        title: "",
        description: "",
        image: "",
        startTime: "",
        endTime: "",
        categoryIds: [],
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed",
        description: "Event could not be created.",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Title:</FormLabel>
          <Input
            type="text"
            name="title"
            placeholder="Name of the event.."
            value={formData.title}
            onChange={handleInputChange}
          />
          {formErrors.title && (
            <Text color="red" fontSize="sm">
              {formErrors.title}
            </Text>
          )}
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Description:</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            placeholder="Write a short event description.."
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Image:</FormLabel>
          <Input
            type="url"
            name="image"
            placeholder="Copy the image url here.."
            value={formData.image}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Date - Start Time:</FormLabel>
          <Input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
          />
          {formErrors.startTime && (
            <Text color="red" fontSize="sm">
              {formErrors.startTime}
            </Text>
          )}
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Date - End Time:</FormLabel>
          <Input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleInputChange}
          />
          {formErrors.endTime && (
            <Text color="red" fontSize="sm">
              {formErrors.endTime}
            </Text>
          )}
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Category:</FormLabel>
          <Select name="categoryIds" onChange={handleCategoryChange}>
            <option>Choose a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button marginTop="25px" backgroundColor="#118a7e" type="submit">
          Add this event
        </Button>
      </form>
    </Box>
  );
};

export default AddEvent;
